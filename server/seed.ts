import { db } from "./db";
import { vendors, donations, fundAllocations, adminUsers } from "@shared/schema";
import * as bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Seed vendors
  const vendorData = [
    {
      name: "GreenBaku Nursery",
      description: "Premium tree and plant nursery in the heart of Baku. Specializing in native Azerbaijani species.",
      address: "45 Nizami Street, Baku",
      phone: "+994 12 456 7890",
      email: "info@greenbaku.az",
      website: "https://greenbaku.az",
      status: "approved",
    },
    {
      name: "Azerbaijan Flora Center",
      description: "Azerbaijan's largest garden center with over 500 plant varieties.",
      address: "78 Ataturk Avenue, Baku",
      phone: "+994 12 555 1234",
      email: "sales@azflora.az",
      website: "https://azflora.az",
      status: "approved",
    },
    {
      name: "EcoPlant Baku",
      description: "Eco-friendly plant shop focused on sustainability and local species.",
      address: "12 Green Valley Road, Baku",
      phone: "+994 12 789 0123",
      email: "hello@ecoplant.az",
      status: "approved",
    },
    {
      name: "Nature's Gift Garden",
      description: "Family-owned nursery with decades of experience in tree cultivation.",
      address: "156 Khojaly Avenue, Baku",
      phone: "+994 12 234 5678",
      email: "contact@naturesgift.az",
      status: "approved",
    },
    {
      name: "Caspian Botanicals",
      description: "Specialized in rare and exotic plants suitable for Azerbaijan's climate.",
      address: "89 Seaside Boulevard, Baku",
      phone: "+994 12 345 6789",
      email: "info@caspianbotanicals.az",
      website: "https://caspianbotanicals.az",
      status: "approved",
    },
  ];

  for (const vendor of vendorData) {
    await db.insert(vendors).values(vendor).onConflictDoNothing();
  }
  console.log(`Seeded ${vendorData.length} vendors`);

  // Seed some initial donations
  const donationData = [
    { amount: 100, donorName: "Eldar M.", message: "For a greener Baku!", isAnonymous: false },
    { amount: 50, donorName: "Nigar A.", message: "Keep up the great work!", isAnonymous: false },
    { amount: 25, isAnonymous: true },
    { amount: 200, donorName: "Kamran H.", message: "Happy to support!", isAnonymous: false },
    { amount: 75, donorName: "Sevinj R.", isAnonymous: false },
    { amount: 150, donorName: "Farid K.", message: "Azerbaijan needs more trees!", isAnonymous: false },
  ];

  for (const donation of donationData) {
    await db.insert(donations).values(donation).onConflictDoNothing();
  }
  console.log(`Seeded ${donationData.length} donations`);

  // Seed some fund allocations
  const allocationData = [
    {
      title: "Tree Planting Project - Baku Parks",
      description: "Planted 50 trees in Baku city parks including Fountains Square and Highland Park.",
      amount: 250,
      category: "trees",
      date: "2024-03-15",
    },
    {
      title: "Environmental Education Workshop",
      description: "Conducted workshop for 100+ students on environmental awareness and tree planting.",
      amount: 75,
      category: "education",
      date: "2024-04-20",
    },
    {
      title: "Planting Equipment Purchase",
      description: "Purchased shovels, gloves, and watering equipment for community planting events.",
      amount: 120,
      category: "equipment",
      date: "2024-05-10",
    },
  ];

  for (const allocation of allocationData) {
    await db.insert(fundAllocations).values(allocation).onConflictDoNothing();
  }
  console.log(`Seeded ${allocationData.length} fund allocations`);

  // Create default admin user (password: admin123)
  const adminExists = await db.select().from(adminUsers).limit(1);
  if (adminExists.length === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.insert(adminUsers).values({
      username: "admin",
      passwordHash,
      name: "EcoAzerbaijan Admin",
      role: "superadmin",
    });
    console.log("Created default admin user (username: admin, password: admin123)");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
