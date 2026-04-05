import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Admin client for deletion (Requires SERVICE_ROLE_KEY)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY for account deletion");
    return NextResponse.json({ error: "Account deletion is currently unavailable. Please contact support." }, { status: 500 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    // 1. Get current limits to persist by email
    const { data: profile } = await adminClient
      .from('profiles')
      .select('questions_today, last_reset_date')
      .eq('id', user.id)
      .single()

    if (profile) {
      // 2. Persist to historical_limits so they can't reset by deleting/remaking
      await adminClient
        .from('historical_limits')
        .upsert({
          email: user.email,
          questions_today: profile.questions_today,
          last_reset_date: profile.last_reset_date,
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' })
    }

    // 3. Delete from all user-data tables (wipe clean)
    // Ordered to respect dependencies if any, though Supabase is pretty flexible
    const tables = [
      'financial_profiles', 
      'chat_history', 
      'monthly_reports', 
      'financial_goals', 
      'profiles'
    ]
    
    for (const table of tables) {
      const column = table === 'profiles' ? 'id' : 'user_id'
      await adminClient.from(table).delete().eq(column, user.id)
    }

    // 4. Force sign out and delete from Supabase Auth
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Account Deletion Error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 })
  }
}
