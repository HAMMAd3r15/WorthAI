import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // 1. Check Pro Status
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  if (profile?.plan !== 'pro') {
    return NextResponse.json({ error: "Pro subscription required for monthly reports." }, { status: 403 })
  }

  // 2. Check for existing report this month
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  const { data: existingReport } = await supabase
    .from('monthly_reports')
    .select('*')
    .eq('user_id', user.id)
    .eq('report_month', currentMonth)
    .single()

  const { regenerate } = await req.json()

  if (existingReport && !regenerate) {
    return NextResponse.json({ report: existingReport.content, month: currentMonth })
  }

  // 3. Fetch Financial Data
  const { data: financial } = await supabase.from('financial_profiles').select('*').eq('user_id', user.id).single()
  if (!financial) {
    return NextResponse.json({ error: "Financial profile not found." }, { status: 404 })
  }

  const totalIncome = (financial.income_sources || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const totalExpenses = (financial.expenses || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const monthlySurplus = totalIncome - totalExpenses
  const totalDebts = (financial.debts || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const netWorth = (financial.savings || 0) - totalDebts

  // 4. Generate AI Report
  const prompt = `You are a financial health analyzer. 
  You must respond with ONLY valid JSON, no other text, no markdown, no backticks. 
  
  Return exactly this structure:
  {
    "score": <number between 0 and 100>,
    "score_explanation": "<one sentence explaining the score>",
    "wins": [
      { "tag": "SAVINGS", "text": "..." },
      { "tag": "DEBT", "text": "..." },
      { "tag": "NET WORTH", "text": "..." }
    ],
    "concerns": [
      { "tag": "CRITICAL", "text": "..." },
      { "tag": "URGENT", "text": "..." },
      { "tag": "WARNING", "text": "..." }
    ],
    "action_plan": ["<action 1>", "<action 2>", "<action 3>"],
    "verdict": "<one powerful closing sentence about their financial trajectory>"
  }

  For WINS and CONCERNS:
  - Text: Be highly analytical and human-like. Instead of "You have $X", say "You have a sizable savings of $X which provides a strong cushion." or "Monthly expenses of $X far exceed your income of $Y — you are spending ZX what you earn."
  - Tags: Use concise, uppercase labels (e.g., SAVINGS, DEBT, NET WORTH, CASH FLOW, CRITICAL, URGENT, WARNING).

  User Financial Profile:
  - Monthly Income: $${totalIncome}
  - Monthly Expenses: $${totalExpenses}
  - Monthly Surplus: $${monthlySurplus}
  - Savings: $${financial.savings || 0}
  - Debts: $${totalDebts}
  - Net Worth: $${netWorth}

  Be honest and specific based on these numbers.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Lower temperature for more consistent JSON
    })

    let reportContent = completion.choices[0]?.message?.content || "";
    
    // Clean potential markdown backticks if AI ignores strict instructions
    reportContent = reportContent.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      JSON.parse(reportContent); // Validate JSON
    } catch (e) {
      throw new Error("The AI failed to generate a valid structured report. Please try again.");
    }

    // 5. Save to database
    if (existingReport) {
      await supabase
        .from('monthly_reports')
        .update({ content: reportContent, created_at: new Date().toISOString() })
        .eq('id', existingReport.id)
    } else {
      await supabase.from('monthly_reports').insert({
        user_id: user.id,
        report_month: currentMonth,
        content: reportContent
      })
    }

    return NextResponse.json({ report: reportContent, month: currentMonth })

  } catch (error: any) {
    console.error("Report Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate report." }, { status: 500 })
  }
}
