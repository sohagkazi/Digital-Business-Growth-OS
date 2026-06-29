"use client";

import { useState } from "react";
import { Users, Crown, CreditCard, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface AnalyticsProps {
  analytics: {
    totalUsers: number;
    proUsers: number;
    totalRevenue: number;
    totalGenerations: number;
  };
  chartData: any[];
}

export function AdminAnalytics({ analytics, chartData }: AnalyticsProps) {
  const [activeMetric, setActiveMetric] = useState<"users" | "proUsers" | "revenue" | "generations">("users");

  const cards = [
    {
      id: "users" as const,
      title: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200",
      chartColor: "#2563eb",
      dataKey: "users",
      label: "New Users"
    },
    {
      id: "proUsers" as const,
      title: "Active Pro Users",
      value: analytics.proUsers.toLocaleString(),
      icon: Crown,
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
      chartColor: "#d97706",
      dataKey: "proUsers",
      label: "New Pro Users"
    },
    {
      id: "revenue" as const,
      title: "Total Revenue",
      value: `৳${analytics.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-200",
      chartColor: "#16a34a",
      dataKey: "revenue",
      label: "Revenue (BDT)"
    },
    {
      id: "generations" as const,
      title: "AI Generations",
      value: analytics.totalGenerations.toLocaleString(),
      icon: Zap,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      border: "border-indigo-200",
      chartColor: "#4f46e5",
      dataKey: "generations",
      label: "Generations"
    }
  ];

  const activeCard = cards.find(c => c.id === activeMetric)!;

  return (
    <div className="space-y-8">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = activeMetric === card.id;
          
          return (
            <div 
              key={card.id} 
              onClick={() => setActiveMetric(card.id)}
              className={`bg-white p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between
                ${isActive 
                  ? 'shadow-md ring-2 ring-indigo-500 scale-[1.02] border-transparent' 
                  : 'shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-300'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color} ${isActive ? 'shadow-md' : 'shadow-sm border ' + card.border}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                <h3 className={`text-3xl font-bold ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${activeCard.bg} ${activeCard.color}`}>
            <activeCard.icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{activeCard.title} Trend</h3>
            <p className="text-sm text-slate-500">Last 7 days performance</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5 5' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}
                formatter={(value: number) => [
                  activeMetric === 'revenue' ? `৳${value}` : value, 
                  activeCard.label
                ]}
              />
              <Line 
                type="monotone"
                dataKey={activeCard.dataKey} 
                stroke={activeCard.chartColor} 
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: activeCard.chartColor }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
