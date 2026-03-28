import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  const supabase = await createClient()
  
  // 1. Verify Webhook Signature
  const rawBody = await req.text()
  const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '')
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
  const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8')

  if (!crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName = payload.meta.event_name
  const customData = payload.meta.custom_data
  const userId = customData?.user_id

  if (!userId) {
    return NextResponse.json({ error: "No user_id in custom_data" }, { status: 400 })
  }

  // 2. Handle Event
  if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
    const status = payload.data.attributes.status
    const plan = status === 'active' || status === 'on_trial' ? 'pro' : 'free'

    await supabase
      .from('profiles')
      .update({ plan: plan })
      .eq('id', userId)
  }

  if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('id', userId)
  }

  return NextResponse.json({ success: true })
}
