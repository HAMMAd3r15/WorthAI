import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, CreditCard, User, Heart } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Plan Section */}
          <Card className="p-8 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Your Plan</p>
                <h3 className="text-2xl font-bold capitalize">{profile?.plan || 'Free'} Plan</h3>
                <p className="text-secondary text-sm mt-1">
                  {profile?.plan === 'pro' 
                    ? "You have unlimited access to Worth AI." 
                    : "Upgrade to Pro for unlimited questions and premium models."}
                </p>
              </div>
              {profile?.plan !== 'pro' && (
                <Button>Upgrade Now</Button>
              )}
            </div>
          </Card>

          {/* Account Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-bold">Account Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-secondary">Email Address</label>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-bold">Billing</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-secondary leading-relaxed">
                  Manage your payment methods and view your billing history on Lemon Squeezy.
                </p>
                <Button variant="outline" size="sm" className="w-full">Manage Subscription</Button>
              </div>
            </Card>
          </div>

          {/* Support Section */}
          <Card className="p-6 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-warning/10 rounded flex items-center justify-center">
                <Heart className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-bold">Help & Support</h3>
                <p className="text-xs text-secondary">Need help? Contact our support team.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-secondary" />
          </Card>
        </div>
      </div>
    </div>
  )
}
