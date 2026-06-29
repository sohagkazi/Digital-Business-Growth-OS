"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { QrCode, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    paymentMethod: "bKash",
    senderAccount: "",
    tranId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Payment submitted successfully! Waiting for admin approval.");
      } else {
        toast.error(data.error || "Failed to submit payment");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Request Submitted!</h1>
          <p className="text-slate-600 mb-8">
            Your payment details have been received. An admin will review and approve your account shortly.
          </p>
          <Link href="/dashboard" className="w-full block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-14 rounded-xl text-lg shadow-lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Payment Instructions Side */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-200">
             <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Manual Payment</h2>
          <p className="text-slate-600 mb-6">Scan the QR code or send exactly <span className="font-bold text-slate-900 text-lg">৳500</span> to the number below to upgrade to Pro.</p>
          
          <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl mb-6 flex items-center justify-center">
            {/* Placeholder for QR Code Image */}
            <span className="text-slate-400 font-medium">Bangla QR Here</span>
          </div>

          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">bKash (Personal)</span>
              <span className="font-bold text-slate-900">017XXXXXXXX</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Nagad (Personal)</span>
              <span className="font-bold text-slate-900">017XXXXXXXX</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Rocket (Personal)</span>
              <span className="font-bold text-slate-900">017XXXXXXXX</span>
            </div>
          </div>
        </div>

        {/* Verification Form Side */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Verify Payment</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-slate-700 font-bold">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({...formData, paymentMethod: v})}>
                <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bKash">bKash</SelectItem>
                  <SelectItem value="Nagad">Nagad</SelectItem>
                  <SelectItem value="Rocket">Rocket</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderAccount" className="text-slate-700 font-bold">Your Account Number</Label>
              <Input 
                id="senderAccount" 
                required 
                placeholder="01XXXXXXXXX"
                value={formData.senderAccount}
                onChange={(e) => setFormData({...formData, senderAccount: e.target.value})}
                className="h-12 bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
              />
              <p className="text-xs text-slate-500">The number you sent the money from.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tranId" className="text-slate-700 font-bold">Transaction ID</Label>
              <Input 
                id="tranId" 
                required 
                placeholder="e.g. 9BXXXXXX"
                value={formData.tranId}
                onChange={(e) => setFormData({...formData, tranId: e.target.value})}
                className="h-12 bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl uppercase"
              />
              <p className="text-xs text-slate-500">You will receive this via SMS after sending money.</p>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-xl text-lg shadow-lg">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isSubmitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
