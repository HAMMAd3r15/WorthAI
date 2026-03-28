import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientLayout } from "./client-layout"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [financialRes, profileRes] = await Promise.all([
    supabase.from('financial_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('profiles').select('*').eq('id', user.id).single()
  ])

  if (!financialRes.data || !profileRes.data) {
    redirect('/onboarding')
  }

  const initialProfile = { ...profileRes.data, email: user.email }

  return (
    <ClientLayout initialFinancial={financialRes.data} initialProfile={initialProfile}>
      {children}
    </ClientLayout>
  )
}
