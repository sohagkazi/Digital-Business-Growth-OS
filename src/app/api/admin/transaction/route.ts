import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { tranId, action } = await req.json();

    if (!tranId || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { tranId }
    });

    if (!transaction || transaction.status !== "PENDING") {
      return NextResponse.json({ error: "Transaction not found or not pending" }, { status: 400 });
    }

    if (action === "APPROVE") {
      // Update transaction status
      await prisma.transaction.update({
        where: { tranId },
        data: { status: "SUCCESS" }
      });

      // Upgrade user to Pro for 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          stripeSubscriptionId: `PRO_${tranId}`,
          stripeCurrentPeriodEnd: thirtyDaysFromNow,
        }
      });
    } else if (action === "REJECT") {
      // Reject transaction
      await prisma.transaction.update({
        where: { tranId },
        data: { status: "FAILED" }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
