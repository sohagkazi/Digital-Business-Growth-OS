"use client";

import { Crown, ShieldCheck } from "lucide-react";

export function AdminUserTable({ users }: { users: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">Joined Date</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Generations (This Month)</th>
            <th className="px-6 py-4 text-right">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => {
            const isAdmin = u.role === "ADMIN";
            const isPro = isAdmin || (u.stripeSubscriptionId && u.stripeCurrentPeriodEnd && new Date(u.stripeCurrentPeriodEnd) > new Date());
            
            return (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      <img src={u.image} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {u.name ? u.name.charAt(0).toUpperCase() : u.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{u.name || "Unknown"}</div>
                      <div className="text-slate-500 text-xs">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200">
                      <ShieldCheck className="w-3 h-3" /> ADMIN
                    </span>
                  ) : isPro ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
                      <Crown className="w-3 h-3" /> PRO
                    </span>
                  ) : (
                    <span className="inline-flex items-center bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200">
                      FREE
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                      <div 
                        className={`h-2 rounded-full ${isAdmin ? 'bg-indigo-500' : isPro ? 'bg-amber-400' : 'bg-blue-500'}`} 
                        style={{ width: isPro ? '100%' : `${Math.min((u.generationsCount / 7) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {isAdmin ? '∞ (Admin)' : isPro ? '∞ (Pro)' : `${u.generationsCount} / 7`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {u.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200">
                      <ShieldCheck className="w-3 h-3" /> ADMIN
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium text-xs">USER</span>
                  )}
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
