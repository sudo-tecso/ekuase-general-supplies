import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Manager
  const managerPassword = await bcrypt.hash("Manager@123", 12);
  await prisma.user.upsert({
    where: { email: "manager@ekuasegs.com" },
    update: {},
    create: {
      email: "manager@ekuasegs.com",
      name: "Ekuase Manager",
      passwordHash: managerPassword,
      role: "MANAGER",
      phone: "0240000001",
    },
  });

  // 2. Seed Admin
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@ekuasegs.com" },
    update: {},
    create: {
      email: "admin@ekuasegs.com",
      name: "Ekuase Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "0240000002",
    },
  });

  // 3. Seed Categories
  const categories = [
    { name: "Cement", slug: "cement" },
    { name: "Steel", slug: "steel" },
    { name: "Roofing", slug: "roofing" },
    { name: "Plumbing", slug: "plumbing" },
    { name: "Electrical", slug: "electrical" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 4. Seed Products
  const categoryEntities = await prisma.category.findMany();
  const products = [
    {
      name: "Dangote Cement 42.5R",
      description: "High-quality Portland cement for all construction needs.",
      price: 95.0,
      category: "Cement",
      stock: 500,
      sku: "CEM-DAN-001",
      images: ["/images/products/cement.png"],
      categoryId: categoryEntities.find(c => c.slug === "cement")!.id,
    },
    {
      name: "Ghacem Super Strong",
      description: "Premium grade cement for heavy-duty foundations.",
      price: 98.0,
      category: "Cement",
      stock: 400,
      sku: "CEM-GHA-002",
      images: ["/images/products/cement.png"],
      categoryId: categoryEntities.find(c => c.slug === "cement")!.id,
    },
    {
      name: "Iron Rods 12mm",
      description: "Standard 12mm high-tensile steel rods for reinforcement.",
      price: 85.0,
      category: "Steel",
      stock: 200,
      sku: "STL-ROD-012",
      images: ["/images/products/iron-rods.png"],
      categoryId: categoryEntities.find(c => c.slug === "steel")!.id,
    },
    {
      name: "Aluminum Roofing Sheets",
      description: "Durable 0.5mm long-span aluminum sheets.",
      price: 150.0,
      category: "Roofing",
      stock: 1000,
      sku: "ROF-ALU-001",
      images: ["/images/products/roofing.png"],
      categoryId: categoryEntities.find(c => c.slug === "roofing")!.id,
    },
    {
      name: "Ceramic Floor Tiles",
      description: "Elegant ceramic tiles for premium indoor finishes.",
      price: 120.0,
      category: "Tiles",
      stock: 300,
      sku: "TILE-CER-001",
      images: ["/images/products/tiles.png"],
      categoryId: categoryEntities.find(c => c.slug === "roofing")!.id, // Placeholder category mapping
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        price: prod.price,
        stock: prod.stock,
        images: prod.images,
      },
      create: prod,
    });
  }

  // 5. Seed Service Providers
  const providers = [
    {
      name: "Kwame Mensah",
      specialty: "Architect",
      phone: "0241112223",
      email: "kwame@arch.com",
      bio: "15 years of experience in residential design.",
      rating: 4.8,
    },
    {
      name: "Ama Serwaa",
      specialty: "Plumber",
      phone: "0243334445",
      email: "ama@plumbing.com",
      bio: "Expert in industrial and residential plumbing systems.",
      rating: 4.9,
    },
    {
      name: "Kofi Owusu",
      specialty: "Electrician",
      phone: "0245556667",
      email: "kofi@electric.com",
      bio: "Certified electrical engineer for wiring and repairs.",
      rating: 4.7,
    },
  ];

  for (const prov of providers) {
    await prisma.serviceProvider.create({
      data: prov,
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
