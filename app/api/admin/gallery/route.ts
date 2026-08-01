import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { imageUrl, caption } = await req.json();
  if (!imageUrl) return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });

  const count = await prisma.galleryImage.count();
  const image = await prisma.galleryImage.create({
    data: { imageUrl, caption, order: count },
  });
  return NextResponse.json(image, { status: 201 });
}
