"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Rocket, LayoutDashboard, Megaphone, Video, Settings, Menu, ArrowLeft, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Ad Generator", href: "/dashboard/ad-generator", icon: Megaphone },
    { name: "Video Scripts", href: "/dashboard/video-scripts", icon: Video },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-blue-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 shadow-sm z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-blue-100 p-1.5 rounded-lg border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Growth OS</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}>
                  <item.icon className="h-5 w-5" /> {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link href="/dashboard/settings">
            <span className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              pathname === "/dashboard/settings" 
                ? "bg-blue-50 text-blue-700 border border-blue-100" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
            }`}>
              <Settings className="h-5 w-5" /> Settings
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-900 tracking-tight">Growth OS</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)}>
            <aside 
              className="absolute right-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl animate-in slide-in-from-right-full duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <span className="font-bold text-slate-900">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-slate-500" />
                </Button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <span className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 border border-blue-100" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                      }`}>
                        <item.icon className="h-5 w-5" /> {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-100">
                <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    pathname === "/dashboard/settings" 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  }`}>
                    <Settings className="h-5 w-5" /> Settings
                  </span>
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()} 
              className="mb-6 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 -ml-3 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
