import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const data: any = {};
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.name !== undefined) data.name = body.name;

  const category = await prisma.category.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const productsCount = await prisma.product.count({ where: { categoryId: params.id } });
  const childrenCount = await prisma.category.count({ where: { parentId: params.id } });

  if (productsCount > 0) {
    return NextResponse.json(
      { error: `Can't delete — ${productsCount} product(s) still use this category.` },
      { status: 409 }
    );
  }
  if (childrenCount > 0) {
    return NextResponse.json(
      { error: `Can't delete — this category still has ${childrenCount} sub-categor${childrenCount === 1 ? "y" : "ies"}. Delete those first.` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
