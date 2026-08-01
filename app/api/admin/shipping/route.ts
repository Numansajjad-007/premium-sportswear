import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { flatFee } = await req.json();
  if (typeof flatFee !== "number" || flatFee < 0) {
    return NextResponse.json({ error: "Invalid shipping fee" }, { status: 400 });
  }

  let settings = await prisma.shippingSettings.findFirst();
  if (settings) {
    settings = await prisma.shippingSettings.update({
      where: { id: settings.id },
      data: { flatFee },
    });
  } else {
    settings = await prisma.shippingSettings.create({ data: { flatFee } });
  }

  return NextResponse.json({ flatFee: settings.flatFee.toString() });
}
