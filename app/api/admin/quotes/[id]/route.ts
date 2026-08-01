import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

const VALID_STATUSES = ["NEW", "REVIEWED", "QUOTED", "ACCEPTED", "DECLINED"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status, quotedPrice } = await req.json();
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const quote = await prisma.quoteRequest.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(quotedPrice !== undefined && quotedPrice !== "" && { quotedPrice: parseFloat(quotedPrice) }),
    },
  });
  return NextResponse.json(quote);
}
