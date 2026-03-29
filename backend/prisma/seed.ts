/**
 * @file seed.ts
 * @author Gurkirat Singh
 * @description Database seed — departments, super admin, academic session
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const DEPARTMENTS = [
  { name: "Computer Science & Engineering", slug: "cse", code: "CSE" },
  { name: "Electronics & Communication Engineering", slug: "ece", code: "ECE" },
  { name: "Electrical Engineering", slug: "ee", code: "EE" },
  { name: "Civil Engineering", slug: "ce", code: "CE" },
  { name: "Mechanical Engineering", slug: "me", code: "ME" },
  { name: "Instrumentation & Control Engineering", slug: "ice", code: "ICE" },
  { name: "Applied Science", slug: "as", code: "AS" },
  { name: "Workshop", slug: "ws", code: "WS" },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // --- Departments ---
  console.log("Creating departments...");
  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: { name: dept.name, code: dept.code },
      create: dept,
    });
  }
  console.log(`  ✓ ${DEPARTMENTS.length} departments\n`);

  // --- Super Admin ---
  console.log("Creating super admin...");
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@gpnilokheri.ac.in";
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required to seed the database. Set it before running the seed.");
  }
  if (adminPassword.length < 16) {
    throw new Error("ADMIN_PASSWORD must be at least 16 characters. Generate a strong one with: openssl rand -base64 24");
  }
  const passwordHash = await hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`  ✓ Super admin (${adminEmail})\n`);

  // --- Hero Slides ---
  console.log("Creating hero slides...");
  const HERO_SLIDES = [
    { title: "Empowering New India", subtitle: "with world-class technical education since 1959", imageUrl: "/images/slider1.jpg", sortOrder: 1 },
    { title: "Master the Skills", subtitle: "to drive your career forward", imageUrl: "/images/slider2.jpg", sortOrder: 2 },
    { title: "Committed to Deliver", subtitle: "highly-trained professionals to the industry", imageUrl: "/images/slider3.jpg", sortOrder: 3 },
  ];
  for (const slide of HERO_SLIDES) {
    const existing = await prisma.heroSlide.findFirst({ where: { title: slide.title } });
    if (!existing) {
      await prisma.heroSlide.create({ data: slide });
    }
  }
  console.log(`  ✓ ${HERO_SLIDES.length} hero slides\n`);

  // --- Academic Session ---
  console.log("Creating academic session...");
  await prisma.academicSession.upsert({
    where: { name: "2025-26" },
    update: { isCurrent: true },
    create: {
      name: "2025-26",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2026-07-31"),
      isCurrent: true,
    },
  });
  console.log("  ✓ Session 2025-26 (current)\n");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
