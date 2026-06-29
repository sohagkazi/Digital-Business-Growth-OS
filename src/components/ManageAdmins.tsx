"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function ManageAdmins({ currentAdmins }: { currentAdmins: { id: string, name: string | null, email: string | null }[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/manage-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Admin added successfully!");
        setEmail("");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to add admin");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">Manage Administrators</h2>
      </div>
      
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium text-slate-700 mb-4">Add New Admin</h3>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-600">User's Google Email</label>
              <Input
                id="email"
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-slate-50 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
              />
              <p className="text-xs text-slate-500 mt-1">
                Note: The user must have logged into this website with Google at least once before you can make them an Admin.
              </p>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11 rounded-xl shadow-md transition-colors">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Promote to Admin
            </Button>
          </form>
        </div>

        <div>
          <h3 className="font-medium text-slate-700 mb-4">Current Admins</h3>
          <ul className="space-y-3">
            {currentAdmins.map(admin => (
              <li key={admin.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {admin.name ? admin.name.charAt(0).toUpperCase() : admin.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{admin.name || "Unknown"}</div>
                  <div className="text-xs text-slate-500">{admin.email}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
