import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function upsertCategory(name: string, slug: string, parentId?: string) {
  return prisma.category.upsert({
    where: { slug },
    update: { parentId: parentId ?? null },
    create: { name, slug, parentId },
  });
}

async function main() {
  // ---- Parent categories ----
  const moto = await upsertCategory("Motorcycle Racing", "motorcycle-racing");
  const kart = await upsertCategory("Kart Racing", "kart-racing");
  const sportswear = await upsertCategory("Sportswear", "sportswear");
  const team = await upsertCategory("Team Uniforms", "team-uniforms");

  // ---- Sub-categories (children) ----
  const motoChildren = await Promise.all([
    upsertCategory("Leather Racing Suits", "leather-racing-suits", moto.id),
    upsertCategory("Textile Suits", "textile-suits", moto.id),
    upsertCategory("Jackets", "moto-jackets", moto.id),
    upsertCategory("Pants", "moto-pants", moto.id),
    upsertCategory("Gloves", "moto-gloves", moto.id),
    upsertCategory("Boots", "moto-boots", moto.id),
  ]);

  const kartChildren = await Promise.all([
    upsertCategory("Kart Racing Suits", "kart-racing-suits", kart.id),
    upsertCategory("Gloves", "kart-gloves", kart.id),
    upsertCategory("Shoes", "kart-shoes", kart.id),
    upsertCategory("Balaclavas", "balaclavas", kart.id),
    upsertCategory("Rib Protectors", "rib-protectors", kart.id),
    upsertCategory("Neck Supports", "neck-supports", kart.id),
  ]);

  const sportswearChildren = await Promise.all([
    upsertCategory("T-Shirts", "t-shirts", sportswear.id),
    upsertCategory("Polo Shirts", "polo-shirts", sportswear.id),
    upsertCategory("Hoodies", "hoodies", sportswear.id),
    upsertCategory("Tracksuits", "tracksuits", sportswear.id),
    upsertCategory("Shorts", "shorts", sportswear.id),
  ]);

  const teamChildren = await Promise.all([
    upsertCategory("Football", "football", team.id),
    upsertCategory("Basketball", "basketball", team.id),
    upsertCategory("Cricket", "cricket", team.id),
    upsertCategory("Rugby", "rugby", team.id),
    upsertCategory("Ice Hockey", "ice-hockey", team.id),
    upsertCategory("Baseball", "baseball", team.id),
    upsertCategory("Cycling", "cycling", team.id),
    upsertCategory("Esports", "esports", team.id),
  ]);

  const find = (arr: { slug: string; id: string }[], slug: string) =>
    arr.find((c) => c.slug === slug)!.id;

  // ---- Products, assigned to the correct sub-category ----
  const products = [
    { name: "Apex Leather Race Suit", slug: "apex-leather-race-suit", description: "Full leather race suit, CE-rated construction.", basePrice: 649, categoryId: find(motoChildren, "leather-racing-suits") },
    { name: "Vector Textile Jacket", slug: "vector-textile-jacket", description: "All-weather textile racing jacket.", basePrice: 289, categoryId: find(motoChildren, "moto-jackets") },
    { name: "Torque Racing Gloves", slug: "torque-racing-gloves", description: "Reinforced knuckle racing gloves.", basePrice: 89, categoryId: find(motoChildren, "moto-gloves") },
    { name: "Marshal Racing Boots", slug: "marshal-racing-boots", description: "Reinforced ankle racing boots.", basePrice: 159, categoryId: find(motoChildren, "moto-boots") },

    { name: "Circuit Kart Suit", slug: "circuit-kart-suit", description: "Lightweight kart racing suit.", basePrice: 349, categoryId: find(kartChildren, "kart-racing-suits") },
    { name: "Rib Protector Pro", slug: "rib-protector-pro", description: "CIK-FIA compliant rib protection.", basePrice: 79, categoryId: find(kartChildren, "rib-protectors") },
    { name: "Podium Balaclava", slug: "podium-balaclava", description: "Fire-resistant racing balaclava.", basePrice: 29, categoryId: find(kartChildren, "balaclavas") },

    { name: "Paddock Tracksuit", slug: "paddock-tracksuit", description: "Team-branded off-track tracksuit.", basePrice: 119, categoryId: find(sportswearChildren, "tracksuits") },
    { name: "Grid Performance Tee", slug: "grid-performance-tee", description: "Moisture-wicking performance tee.", basePrice: 39, categoryId: find(sportswearChildren, "t-shirts") },

    { name: "Club Football Kit", slug: "club-football-kit", description: "Full team football kit, bulk pricing available.", basePrice: 54, categoryId: find(teamChildren, "football") },
    { name: "Esports Pro Jersey", slug: "esports-pro-jersey", description: "Breathable esports team jersey.", basePrice: 59, categoryId: find(teamChildren, "esports") },
    { name: "Cricket Whites Set", slug: "cricket-whites-set", description: "Full cricket whites uniform set.", basePrice: 74, categoryId: find(teamChildren, "cricket") },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { categoryId: p.categoryId },
      create: p,
    });
  }

  console.log("Seed complete — categories, sub-categories, and products loaded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
