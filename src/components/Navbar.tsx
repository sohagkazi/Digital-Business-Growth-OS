import { auth } from "@/auth"
import { SignIn, SignOut } from "./AuthButtons"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Sparkles, Crown, ShieldCheck } from "lucide-react"

export async function Navbar() {
  const session = await auth()
  
  let isPro = false;
  let isAdmin = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeSubscriptionId: true, stripeCurrentPeriodEnd: true, role: true }
    });
    if (user?.stripeSubscriptionId && user?.stripeCurrentPeriodEnd && new Date(user.stripeCurrentPeriodEnd) > new Date()) {
      isPro = true;
    }
    if (user?.role === "ADMIN") {
      isAdmin = true;
      isPro = true; // Unlimited Pro access for Admins
    }
  }
  
  return (
    <header className="flex justify-between items-center p-4 border-b border-slate-200 bg-white z-50">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <span className="font-bold text-slate-900 tracking-tight">Growth OS</span>
      </Link>
      <div>
        {session?.user ? (
          <div className="flex items-center gap-4">
            {!isPro && (
              <Link href="/#pricing">
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="w-4 h-4" /> Upgrade
                </div>
              </Link>
            )}
            <span className="text-sm font-medium text-slate-700 hidden md:block">{session.user.name}</span>
            <div className="relative flex items-center">
              {session.user.image && (
                <img suppressHydrationWarning src={session.user.image} alt="avatar" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm" />
              )}
              {isAdmin ? (
                <div className="absolute -bottom-1.5 -right-4 flex items-center gap-0.5 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-[0_0_12px_rgba(79,70,229,0.7)] border border-indigo-400 tracking-wider">
                  <ShieldCheck className="w-2.5 h-2.5 text-indigo-200" /> ADMIN
                </div>
              ) : isPro ? (
                <div className="absolute -bottom-1.5 -right-3 flex items-center gap-0.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.6)] border border-amber-300 tracking-wider">
                  <Crown className="w-2.5 h-2.5" /> PRO
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded border shadow-sm tracking-wide bg-slate-100 text-slate-700 border-slate-300">
                  FREE
                </div>
              )}
            </div>
            <div className="ml-2">
              <SignOut />
            </div>
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </header>
  )
}
