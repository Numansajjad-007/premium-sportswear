import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DesignSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  name: z.string().default("Untitled Design"),
  panelColors: z.record(z.string()), // e.g. { panelBase: "#1c1c1f" }
  logoUrl: z.string().optional(),
  logoTransform: z
    .object({ x: z.number(), y: z.number(), scale: z.number(), rotate: z.number() })
    .optional(),
  driverName: z.string().optional(),
  raceNumber: z.string().optional(),
  flagColor: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = DesignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const design = await prisma.design.create({ data: parsed.data });
  return NextResponse.json(design, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const designs = await prisma.design.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(designs);
}
