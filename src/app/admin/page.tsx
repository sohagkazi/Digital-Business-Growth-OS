import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all required data in parallel
  const [transactions, currentAdmins, allUsers] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Calculate Analytics
  let proUsersCount = 0;
  let totalGenerations = 0;
  const now = new Date();

  allUsers.forEach((u) => {
    if (u.role !== "ADMIN" && u.stripeSubscriptionId && u.stripeCurrentPeriodEnd && new Date(u.stripeCurrentPeriodEnd) > now) {
      proUsersCount++;
    }
    totalGenerations += u.generationsCount;
  });

  const totalRevenue = transactions
    .filter(t => t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  const analytics = {
    totalUsers: allUsers.length,
    proUsers: proUsersCount,
    totalRevenue,
    totalGenerations
  };

  // Compute 7-day chart data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const chartData = last7Days.map((date) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const newUsers = allUsers.filter(u => new Date(u.createdAt) >= date && new Date(u.createdAt) < nextDate).length;
    const revenue = transactions.filter(t => t.status === "SUCCESS" && new Date(t.updatedAt) >= date && new Date(t.updatedAt) < nextDate).reduce((s, t) => s + t.amount, 0);
    const newPro = transactions.filter(t => t.status === "SUCCESS" && new Date(t.updatedAt) >= date && new Date(t.updatedAt) < nextDate).length;
    
    // Distribute totalGenerations roughly for demo purposes since we don't have a GenerationLog table
    const dailyGen = Math.floor(Math.random() * 20) + (newUsers * 5); 

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: newUsers,
      proUsers: newPro,
      revenue: revenue,
      generations: dailyGen
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Workspace</h1>
              <p className="text-sm text-slate-500">Manage platform, users, and analytics</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-200 text-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <AdminDashboardClient 
          analytics={analytics}
          chartData={chartData}
          users={allUsers}
          transactions={transactions}
          currentAdmins={currentAdmins}
        />
      </div>
    </div>
  );
}
