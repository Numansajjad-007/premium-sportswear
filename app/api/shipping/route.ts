import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.shippingSettings.findFirst();
  if (!settings) {
    settings = await prisma.shippingSettings.create({ data: { flatFee: 0 } });
  }
  return NextResponse.json({ flatFee: settings.flatFee.toString() });
}
