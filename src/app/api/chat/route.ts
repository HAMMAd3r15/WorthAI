import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// IP-based rate limiting: 20 per IP per hour
const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  
  // Clean old entries
  const currentLimit = rateLimitMap.get(ip)
  if (currentLimit && now > currentLimit.resetTime) {
    rateLimitMap.delete(ip)
  }

  const limitData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs }
  
  if (limitData.count >= 20) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
  }
  
  rateLimitMap.set(ip, { count: limitData.count + 1, resetTime: limitData.resetTime })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // 1. Get Profile & Financial Data
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: financial } = await supabase.from('financial_profiles').select('*').eq('user_id', user.id).single()

  if (!profile || !financial) {
    return NextResponse.json({ error: "Profile not found. Please complete onboarding." }, { status: 404 })
  }

  // 2. Check & Reset Daily Limit
  const today = new Date().toISOString().split('T')[0]
  const lastReset = profile.last_reset_date || today
  
  let questionsToday = profile.questions_today || 0
  
  if (today !== lastReset) {
    questionsToday = 0
    // Async update reset date
    await supabase.from('profiles').update({ 
      questions_today: 0, 
      last_reset_date: today 
    }).eq('id', user.id)
  }

  if (questionsToday >= 10) {
    return NextResponse.json({ error: "You've used all 10 of your questions for today. Come back tomorrow — Worth will be here." }, { status: 429 })
  }

  // 3. Prepare AI Prompt & Validate Input
  const body = await req.json()
  const { question } = body

  if (!question || typeof question !== 'string') {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 })
  }

  const trimmedQuestion = question.trim()
  if (!trimmedQuestion) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
  }

  if (trimmedQuestion.length > 500) {
    return NextResponse.json({ error: "Message too long. Maximum 500 characters." }, { status: 400 })
  }
  
  const totalIncome = (financial.income_sources || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const totalExpenses = (financial.expenses || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const monthlySurplus = totalIncome - totalExpenses
  const incomeBreakdown = (financial.income_sources || []).map((i: any) => `${i.label}: $${i.amount}`).join(', ')
  const expenseBreakdown = (financial.expenses || []).map((i: any) => `${i.label}: $${i.amount}`).join(', ')
  const debtsBreakdown = (financial.debts || []).map((i: any) => `${i.label}: $${i.amount}`).join(', ')

  const systemPrompt = `You are Worth, a sharp, no-nonsense financial advisor. 
You don't sugarcoat the truth. You use the user's real numbers to give objective, data-driven verdicts. 
You know the user's complete financial situation already.

CRITICAL EVALUATION FOR INVESTING:
If the user asks about investing their savings or surplus, evaluate these specific thresholds:
1. Emergency Fund: They need at least 3 months of total expenses ($${totalExpenses * 3}) in savings ($${financial.savings || 0}).
2. Debt: High-interest debt (Credit Cards, Personal Loans) should be prioritized over investing.
3. Surplus: They must have a positive monthly surplus ($${monthlySurplus}) to invest consistently.

INVESTMENT VERDICT LOGIC:
- If (Savings >= 3x Expenses) AND (No/Low High-Interest Debt) AND (Surplus > 0):
  Lean YES or GOOD MOVE. Suggest a smart allocation (e.g. "80% into low-cost index funds like VOO, 20% kept in your HYSA").
- If (Savings < 3x Expenses): 
  Lean NOT YET. Explain: "You're $${(totalExpenses * 3) - (financial.savings || 0)} short of a safe 3-month emergency fund."
- If (High-interest debts exist):
  Lean NO. Explain: "Your debt interest is likely higher than your expected market returns. Kill the debt first."

RESPONSE RULES:

Rule 1 — If the user asks a YES/NO/MAYBE type question (should I buy X, can I afford X, is it a good idea to X, should I invest in X):
Use this exact format:
VERDICT: [YES / NO / NOT YET]
EXPLANATION: [2-3 sentences using their exact numbers]
ACTION PLAN: [2-3 numbered concrete steps]

Rule 2 — If the user asks a HOW/WHAT/WHY type question (how do I get out of debt, what should I do with my savings, why is my surplus low, how can I save more):
Still ADD a verdict tag at the top that fits naturally:
Example: if someone asks how to get out of a loan, the verdict could be "ACHIEVABLE" or "CHALLENGING" based on their numbers.
Then give a full helpful answer with specific steps using their real numbers.
Format:
VERDICT: [ACHIEVABLE / CHALLENGING / URGENT / ON TRACK / GOOD MOVE / RISKY]
EXPLANATION: [helpful answer using their numbers]
ACTION PLAN: [numbered steps]

Rule 3 — If the user is just chatting or asking something not financial at all:
Politely redirect them. Example: 'I'm Worth, your financial advisor. I'm only able to help with questions about your finances.'

IMPORTANT RULES:
- ALWAYS use the user's actual numbers, never generic advice
- ALWAYS have some kind of verdict tag — never respond without one
- Keep responses concise and sharp — no fluff or corporate speak
- Verdict options: YES, NO, NOT YET, ACHIEVABLE, CHALLENGING, URGENT, ON TRACK, GOOD MOVE, RISKY

User Financial Profile:
- Monthly Income: $${totalIncome} (${incomeBreakdown})
- Monthly Expenses: $${totalExpenses} (${expenseBreakdown})
- Monthly Surplus: $${monthlySurplus}
- Savings: $${financial.savings || 0}
- Debts: ${debtsBreakdown || 'None'}`

  try {
    // 4. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
    })


    const rawAnswer = completion.choices[0].message.content || ""
    
    // 5. Structured Parsing
    // Look for VERDICT: [ANY OF THE ALLOWED TAGS]
    const verdictMatch = rawAnswer.match(/VERDICT:\s*(YES|NO|NOT YET|ACHIEVABLE|CHALLENGING|URGENT|ON TRACK|GOOD MOVE|RISKY)/i)
    const verdict = (verdictMatch ? verdictMatch[1].toUpperCase() : "ON TRACK") 
    
    // Extract explanation (everything between VERDICT and ACTION PLAN, or everything if no ACTION PLAN)
    const explanationMatch = rawAnswer.match(/EXPLANATION:\s*([\s\S]*?)(?=ACTION PLAN:|$)/i)
    let reasoning = explanationMatch ? explanationMatch[1].trim() : ""

    // If no explicit structure was found, it might be a Rule 3 response
    if (!reasoning && !verdictMatch) {
      reasoning = rawAnswer;
    } else if (!reasoning) {
      // Sometimes it might not have the "EXPLANATION:" header if it's Rule 3
      reasoning = rawAnswer.replace(/VERDICT:\s*.*?\n/i, '').trim();
    }
    
    // Extract action plan items
    const actionPlanMatch = rawAnswer.match(/ACTION PLAN:\s*([\s\S]*)/i)
    const actionPlanRaw = actionPlanMatch ? actionPlanMatch[1].trim() : ""
    const actionPlan = actionPlanRaw
      .split(/\d\.\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)

    // 6. Save Data
    // Save to history (async)
    supabase.from('chat_history').insert({
      user_id: user.id,
      question: trimmedQuestion,
      answer: rawAnswer
    }).then()

    // Increment question count
    await supabase.from('profiles').update({ 
      questions_today: questionsToday + 1 
    }).eq('id', user.id)

    return NextResponse.json({
      verdict,
      reasoning,
      actionPlan: actionPlan.length > 0 ? actionPlan : null
    })

  } catch (error: any) {
    console.error("Groq Error:", error)
    return NextResponse.json({ error: "AI service is currently unavailable. Please try again later." }, { status: 500 })
  }
}
