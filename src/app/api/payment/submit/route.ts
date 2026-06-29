import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMethod, senderAccount, tranId } = await req.json();

    if (!paymentMethod || !senderAccount || !tranId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: 500, // Fixed pro plan price
        currency: "BDT",
        paymentMethod: paymentMethod,
        senderAccount: senderAccount,
        tranId: tranId,
        status: "PENDING",
      }
    });

    return NextResponse.json({ success: true, transaction });

  } catch (error: any) {
    // Handle unique constraint failure on tranId
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "This Transaction ID has already been submitted." }, { status: 400 });
    }
    console.error("Payment submit error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
