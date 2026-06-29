import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Failed</h1>
        <p className="text-slate-600 mb-8">
          Unfortunately, your payment could not be processed at this time. Please try again or use a different payment method.
        </p>
        
        <div className="space-y-4">
          <Link href="/#pricing" className="w-full block">
            <Button variant="outline" className="w-full font-bold h-14 rounded-xl text-lg border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
