"use client";

import { useState } from "react";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminUserTable } from "./AdminUserTable";
import { AdminTransactionTable } from "./AdminTransactionTable";
import { ManageAdmins } from "./ManageAdmins";
import { BarChart3, Users, ReceiptText, Settings } from "lucide-react";

interface AdminDashboardClientProps {
  analytics: {
    totalUsers: number;
    proUsers: number;
    totalRevenue: number;
    totalGenerations: number;
  };
  chartData: any[];
  users: any[];
  transactions: any[];
  currentAdmins: any[];
}

export function AdminDashboardClient({ analytics, chartData, users, transactions, currentAdmins }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "transactions" | "settings">("overview");

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 hide-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === "overview" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === "users" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" /> Users List
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === "transactions" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ReceiptText className="w-4 h-4" /> Transactions
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === "settings" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Settings className="w-4 h-4" /> Admin Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
            <AdminAnalytics analytics={analytics} chartData={chartData} />
          </div>
        )}

        {activeTab === "users" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">All Registered Users</h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{users.length} Total</span>
            </div>
            <div className="p-0">
              <AdminUserTable users={users} />
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Payment Transactions</h2>
              <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{transactions.length} Total</span>
            </div>
            <div className="p-0">
              <AdminTransactionTable initialTransactions={transactions} />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ManageAdmins currentAdmins={currentAdmins} />
          </div>
        )}
      </div>

    </div>
  );
}
