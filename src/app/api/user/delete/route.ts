import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Call the SECURITY DEFINER function that handles all deletion
    // (deletes data from all tables, persists limits, and removes auth user)
    const { error } = await supabase.rpc('delete_user_account')
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Account Deletion Error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 })
  }
}
