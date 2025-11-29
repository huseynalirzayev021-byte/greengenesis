import { pgTable, text, integer, boolean, timestamp, real, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============ DATABASE TABLES ============

// Partner Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  logoUrl: text("logo_url"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// Receipts table
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  vendorName: text("vendor_name").notNull(),
  purchaseAmount: real("purchase_amount").notNull(),
  purchaseDate: text("purchase_date").notNull(),
  imageUrl: text("image_url"),
  pointsEarned: integer("points_earned").notNull().default(0),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  ocrData: text("ocr_data"), // JSON string of OCR extracted data
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

export const insertReceiptSchema = createInsertSchema(receipts).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
  pointsEarned: true,
  status: true,
  ocrData: true,
  adminNotes: true,
  vendorId: true,
});
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receipts.$inferSelect;

// Donations table
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: real("amount").notNull(),
  donorName: text("donor_name"),
  message: text("message"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

// Fund Allocations table (for transparency)
export const fundAllocations = pgTable("fund_allocations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull(), // trees, education, equipment, admin
  imageUrl: text("image_url"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFundAllocationSchema = createInsertSchema(fundAllocations).omit({
  id: true,
  createdAt: true,
});
export type InsertFundAllocation = z.infer<typeof insertFundAllocationSchema>;
export type FundAllocation = typeof fundAllocations.$inferSelect;

// Admin Users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"), // admin, superadmin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Withdrawal Requests table (for rewards-to-money conversion)
export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  pointsAmount: integer("points_amount").notNull(),
  moneyAmount: real("money_amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // bank_transfer, mobile_payment
  paymentDetails: text("payment_details").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, completed
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  status: true,
  adminNotes: true,
  moneyAmount: true,
});
export type InsertWithdrawalRequest = z.infer<typeof insertWithdrawalRequestSchema>;
export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;

// ============ RELATIONS ============

export const vendorsRelations = relations(vendors, ({ many }) => ({
  receipts: many(receipts),
}));

export const receiptsRelations = relations(receipts, ({ one }) => ({
  vendor: one(vendors, {
    fields: [receipts.vendorId],
    references: [vendors.id],
  }),
}));

// ============ FRONTEND-ONLY TYPES ============

// Eco Fact (static data, not in database)
export interface EcoFact {
  id: number;
  icon: string;
  title: string;
  description: string;
  statistic?: string;
}

// Environmental Impact data (static)
export interface ImpactComparison {
  id: number;
  icon: string;
  source: string;
  sourceAmount: string;
  equals: string;
  target: string;
  targetAmount: string;
  description: string;
}

// Team member (static)
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  school: string;
  bio: string;
  avatarUrl?: string;
}

// User rewards (computed from receipts)
export interface UserRewards {
  visitorId: string;
  totalPoints: number;
  totalReceipts: number;
  pendingPoints: number;
  availableForWithdrawal: number;
}

// Fund statistics (computed from donations and allocations)
export interface FundStats {
  totalRaised: number;
  totalSpent: number;
  donorCount: number;
  treesPlanted: number;
  projectsSupported: number;
}
