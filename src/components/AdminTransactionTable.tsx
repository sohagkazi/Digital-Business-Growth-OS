"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminTransactionTable({ initialTransactions }: { initialTransactions: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (tranId: string, action: "APPROVE" | "REJECT") => {
    setLoadingId(tranId);
    try {
      const response = await fetch("/api/admin/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tranId, action }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Transaction ${action.toLowerCase()}d successfully`);
        router.refresh();
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">Date</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Method & Sender</th>
            <th className="px-6 py-4">Trx ID</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {initialTransactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {new Date(tx.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{tx.user.name || "Unknown"}</div>
                <div className="text-slate-500 text-xs">{tx.user.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{tx.paymentMethod}</div>
                <div className="text-slate-500">{tx.senderAccount}</div>
              </td>
              <td className="px-6 py-4 font-mono text-xs uppercase bg-slate-50 rounded px-2">
                {tx.tranId}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                  tx.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {tx.status === "PENDING" && (
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 h-8 px-3"
                      disabled={loadingId === tx.tranId}
                      onClick={() => handleAction(tx.tranId, "APPROVE")}
                    >
                      {loadingId === tx.tranId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-3"
                      disabled={loadingId === tx.tranId}
                      onClick={() => handleAction(tx.tranId, "REJECT")}
                    >
                      {loadingId === tx.tranId ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                      Reject
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {initialTransactions.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
