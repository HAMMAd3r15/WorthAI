"use client"

import dynamic from "next/dynamic"

const AetherFlowBackground = dynamic(
  () => import("@/components/ui/aether-flow-background").then(mod => mod.AetherFlowBackground),
  { ssr: false }
)

const OnboardingFlow = dynamic(
  () => import("@/components/onboarding/onboarding-flow").then(mod => mod.OnboardingFlow),
  { ssr: false }
)

export function OnboardingPageClient() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 relative overflow-hidden">
      <AetherFlowBackground />
      <div className="text-center mb-6 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-[0.2em] text-[#C9A84C]">WorthAI</h1>
      </div>
      <div className="relative z-10">
        <OnboardingFlow />
      </div>
    </div>
  )
}
