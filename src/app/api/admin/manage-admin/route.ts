import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found. They must log in with Google at least once first." }, { status: 404 });
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json({ error: "User is already an ADMIN." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: targetUser.id },
      data: { role: "ADMIN" }
    });

    return NextResponse.json({ success: true, message: `Successfully promoted ${email} to ADMIN.` });

  } catch (error: any) {
    console.error("Manage admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
