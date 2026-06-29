import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, Layout, Calendar, Rocket, Target, Video, Sparkles } from "lucide-react";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const session = await auth();

  let isPro = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeSubscriptionId: true, stripeCurrentPeriodEnd: true, role: true }
    });
    if (user?.stripeSubscriptionId && user?.stripeCurrentPeriodEnd && new Date(user.stripeCurrentPeriodEnd) > new Date()) {
      isPro = true;
    }
    if (user?.role === "ADMIN") {
      isPro = true;
    }
  }

  const handleLogin = async () => {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      {/* Navbar */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Rocket className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Growth OS</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
        </nav>
        {session ? (
          <Link href="/dashboard">
            <Button className="font-semibold shadow-sm bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <form action={handleLogin}>
            <Button type="submit" className="font-semibold shadow-sm bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6">
              Get Started
            </Button>
          </form>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center bg-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-[100px] -z-10"></div>
          
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
            AI-Powered Marketing Assistant
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mb-6 leading-tight">
            Scale Your Business With <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Smart AI Marketing</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
            Generate high-converting Facebook ads, viral reel scripts, and 7-day marketing plans in just 1 click.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto font-bold text-base px-10 h-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white">
                  Go to Dashboard <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <form action={handleLogin}>
                <Button type="submit" size="lg" className="w-full sm:w-auto font-bold text-base px-10 h-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white">
                  Start Generating for Free <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
          <p className="mt-4 text-sm text-slate-500">No credit card required. Setup in 60 seconds.</p>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-slate-50 px-6 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-slate-600">Three simple steps to launch your next big campaign.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Enter Business Info", desc: "Tell us about your business, budget, and target audience in simple terms.", icon: Layout },
                { step: "02", title: "AI Generates Plan", desc: "Our AI instantly creates ad copies, reel scripts, and a full campaign timeline.", icon: Zap },
                { step: "03", title: "Launch & Grow", desc: "Copy the content, launch your ads, and watch your business grow.", icon: Rocket }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 z-10">{item.title}</h3>
                  <p className="text-slate-600 z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Stop guessing what works. Let AI craft the perfect marketing strategy for your niche.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Smart Targeting", desc: "Tailored to your specific niche and budget.", icon: Target },
                { title: "AI Ad Generator", desc: "High-converting Facebook & Insta ad copies.", icon: Zap },
                { title: "Reel Script Generator", desc: "Engaging video hooks and scripts for TikTok/Reels.", icon: Video },
                { title: "7-Day Campaign Planner", desc: "A day-by-day roadmap for your marketing.", icon: Calendar }
              ].map((feature, i) => (
                <Card key={i} className="border border-slate-100 shadow-sm bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <CardHeader>
                    <div className="h-10 w-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center mb-3">
                       <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-slate-50 px-6 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple Pricing</h2>
              <p className="text-slate-600">Choose the plan that best fits your business stage.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Free", price: "0", desc: "Perfect to test the waters.", features: ["3 AI Generations / month", "Basic Ad Copies", "Standard Support"], isPopular: false },
                { name: "Pro", price: "500", desc: "For growing businesses.", features: ["Unlimited Generations", "Reel Scripts & 30-Day Plan", "Priority Support", "Advanced Niche Targeting"], isPopular: true }
              ].map((plan, i) => (
                <Card key={i} className={`relative flex flex-col overflow-hidden transition-all duration-500 ${
                  plan.isPopular 
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-slate-800 shadow-2xl md:scale-105 z-10 hover:shadow-blue-900/30 hover:-translate-y-2' 
                    : 'bg-white border-slate-200 shadow-lg text-slate-900 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
                }`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  )}
                  {plan.isPopular && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pt-10">
                    <CardTitle className={`text-3xl font-bold ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</CardTitle>
                    <CardDescription className={`text-base mt-2 ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-2">
                    <div className="mb-10">
                      <span className={`text-6xl font-extrabold ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>৳{plan.price}</span>
                      <span className={`font-medium ml-2 ${plan.isPopular ? 'text-slate-500' : 'text-slate-400'}`}>/month</span>
                    </div>
                    <ul className="space-y-5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className={`flex items-center text-sm font-medium ${plan.isPopular ? 'text-slate-300' : 'text-slate-700'}`}>
                          <CheckCircle2 className={`h-5 w-5 mr-3 shrink-0 ${plan.isPopular ? 'text-blue-400' : 'text-blue-600'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-10">
                    {session ? (
                      plan.isPopular && !isPro ? (
                        <Link href="/payment/checkout" className="w-full block">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25 border-0 font-bold rounded-xl h-14 text-base transition-all">
                            Buy Now
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/dashboard" className="w-full">
                          <Button className={`w-full font-bold rounded-xl h-14 text-base transition-all ${
                            plan.isPopular 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25 border-0' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                          }`}>
                            Go to Dashboard
                          </Button>
                        </Link>
                      )
                    ) : (
                      <form action={handleLogin} className="w-full">
                        <Button type="submit" className={`w-full font-bold rounded-xl h-14 text-base transition-all ${
                          plan.isPopular 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25 border-0' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                        }`}>
                          {plan.price === "0" ? "Start Free Trial" : "Buy Now"}
                        </Button>
                      </form>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Rocket className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-slate-900">AI Growth OS</span>
          </div>
          <p>© {new Date().getFullYear()} AI Local Business Growth OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
