import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const QuoteRequestSchema = z.object({
  userId: z.string(),
  designId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = QuoteRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const quoteRequest = await prisma.quoteRequest.create({
    data: parsed.data,
  });

  return NextResponse.json(quoteRequest, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const quotes = await prisma.quoteRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}
