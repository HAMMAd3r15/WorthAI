import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groqReportKeys = [
  process.env.GROQ_API_KEY_REPORT
].filter(Boolean)

let currentReportIndex = 0

async function callGroqWithRotation(prompt: string) {
  for (let i = 0; i < groqReportKeys.length; i++) {
    const startIndex = currentReportIndex
    currentReportIndex = (currentReportIndex + 1) % groqReportKeys.length
    
    const currentKey = groqReportKeys[startIndex]
    
    try {
      const groq = new Groq({ 
        apiKey: currentKey 
      })
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 800,
        response_format: { type: "json_object" },
      })
      return response
    } catch (error: any) {
      if (error.status === 429) {
        console.log(`Report Key ${startIndex + 1} rate limited, trying next key`)
        continue
      } else {
        throw error
      }
    }
  }
  throw new Error('ALL_REPORT_KEYS_EXHAUSTED')
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Parse body early so we know if regenerate is requested
  const { regenerate } = await req.json()

  // Run rate limit check, profile fetch, and existing report check IN PARALLEL
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  const [rateLimitResult, existingReportResult, financialResult] = await Promise.all([
    // Rate limit: 3 reports per day
    supabase
      .from('monthly_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gt('created_at', twentyFourHoursAgo),
    // Existing report for this month
    supabase
      .from('monthly_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('report_month', currentMonth)
      .single(),
    // Financial profile
    supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
  ])

  // Rate limit check
  if ((rateLimitResult.count || 0) >= 3) {
    return NextResponse.json({ error: "You've reached the maximum of 3 reports per day. Please try again tomorrow." }, { status: 429 })
  }

  // Return cached report if exists and not regenerating
  const existingReport = existingReportResult.data
  if (existingReport && !regenerate) {
    return NextResponse.json({ report: existingReport.content, month: currentMonth })
  }

  // Financial profile required
  const financial = financialResult.data
  if (!financial) {
    return NextResponse.json({ error: "Financial profile not found." }, { status: 404 })
  }

  const totalIncome = (financial.income_sources || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const totalExpenses = (financial.expenses || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const monthlySurplus = totalIncome - totalExpenses
  const totalDebts = (financial.debts || []).reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const netWorth = (financial.savings || 0) - totalDebts

  // Generate AI Report with faster model and strict constraints
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
    let completion;
    try {
      completion = await callGroqWithRotation(prompt)
    } catch (error: any) {
      if (error.message === 'ALL_REPORT_KEYS_EXHAUSTED') {
        throw new Error("Report generation is currently unavailable due to high demand. Please try again in 10 minutes.")
      }
      throw error
    }

    let reportContent = completion.choices[0]?.message?.content || "";
    
    // Clean potential markdown backticks if AI ignores strict instructions
    reportContent = reportContent.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(reportContent);
      // Validate required fields exist
      if (!parsed.score || !parsed.wins || !parsed.concerns || !parsed.action_plan || !parsed.verdict) {
        throw new Error("Missing fields");
      }
    } catch (e) {
      throw new Error("The AI failed to generate a valid structured report. Please try again.");
    }

    // Save to database (upsert pattern)
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
    return NextResponse.json({ error: error.message || "Failed to generate report." }, { status: 500 })
  }
}
