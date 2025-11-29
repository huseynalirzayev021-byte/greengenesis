import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "./db";
import {
  vendors,
  receipts,
  donations,
  fundAllocations,
  adminUsers,
  withdrawalRequests,
  type Vendor,
  type InsertVendor,
  type Receipt,
  type InsertReceipt,
  type Donation,
  type InsertDonation,
  type FundAllocation,
  type InsertFundAllocation,
  type AdminUser,
  type InsertAdminUser,
  type WithdrawalRequest,
  type InsertWithdrawalRequest,
  type UserRewards,
  type FundStats,
} from "@shared/schema";

export interface IStorage {
  // Vendors
  getVendors(): Promise<Vendor[]>;
  getApprovedVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendorStatus(id: number, status: string): Promise<Vendor | undefined>;

  // Receipts
  getReceipts(visitorId: string): Promise<Receipt[]>;
  getAllReceipts(): Promise<Receipt[]>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt & { pointsEarned: number }): Promise<Receipt>;
  updateReceiptStatus(id: number, status: string, adminNotes?: string): Promise<Receipt | undefined>;
  updateReceiptOCR(id: number, ocrData: string): Promise<Receipt | undefined>;

  // User Rewards
  getUserRewards(visitorId: string): Promise<UserRewards>;

  // Donations
  getDonations(): Promise<Donation[]>;
  getRecentDonations(limit: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Fund Stats & Allocations
  getFundStats(): Promise<FundStats>;
  getFundAllocations(): Promise<FundAllocation[]>;
  createFundAllocation(allocation: InsertFundAllocation): Promise<FundAllocation>;

  // Admin Users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;

  // Withdrawal Requests
  getWithdrawalRequests(visitorId?: string): Promise<WithdrawalRequest[]>;
  createWithdrawalRequest(request: InsertWithdrawalRequest & { moneyAmount: number }): Promise<WithdrawalRequest>;
  updateWithdrawalStatus(id: number, status: string, adminNotes?: string): Promise<WithdrawalRequest | undefined>;
}

export class DatabaseStorage implements IStorage {
  // ============ VENDORS ============
  async getVendors(): Promise<Vendor[]> {
    return db.select().from(vendors).orderBy(desc(vendors.createdAt));
  }

  async getApprovedVendors(): Promise<Vendor[]> {
    return db.select().from(vendors).where(eq(vendors.status, "approved")).orderBy(vendors.name);
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async updateVendorStatus(id: number, status: string): Promise<Vendor | undefined> {
    const [updated] = await db
      .update(vendors)
      .set({ status })
      .where(eq(vendors.id, id))
      .returning();
    return updated || undefined;
  }

  // ============ RECEIPTS ============
  async getReceipts(visitorId: string): Promise<Receipt[]> {
    return db
      .select()
      .from(receipts)
      .where(eq(receipts.visitorId, visitorId))
      .orderBy(desc(receipts.createdAt));
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return db.select().from(receipts).orderBy(desc(receipts.createdAt));
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    const [receipt] = await db.select().from(receipts).where(eq(receipts.id, id));
    return receipt || undefined;
  }

  async createReceipt(receipt: InsertReceipt & { pointsEarned: number }): Promise<Receipt> {
    const [newReceipt] = await db.insert(receipts).values(receipt).returning();
    return newReceipt;
  }

  async updateReceiptStatus(id: number, status: string, adminNotes?: string): Promise<Receipt | undefined> {
    const [updated] = await db
      .update(receipts)
      .set({ status, adminNotes, reviewedAt: new Date() })
      .where(eq(receipts.id, id))
      .returning();
    return updated || undefined;
  }

  async updateReceiptOCR(id: number, ocrData: string): Promise<Receipt | undefined> {
    const [updated] = await db
      .update(receipts)
      .set({ ocrData })
      .where(eq(receipts.id, id))
      .returning();
    return updated || undefined;
  }

  // ============ USER REWARDS ============
  async getUserRewards(visitorId: string): Promise<UserRewards> {
    const userReceipts = await this.getReceipts(visitorId);
    const withdrawals = await this.getWithdrawalRequests(visitorId);

    const approvedPoints = userReceipts
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + r.pointsEarned, 0);

    const pendingPoints = userReceipts
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.pointsEarned, 0);

    const withdrawnPoints = withdrawals
      .filter((w) => w.status === "completed")
      .reduce((sum, w) => sum + w.pointsAmount, 0);

    const pendingWithdrawalPoints = withdrawals
      .filter((w) => w.status === "pending" || w.status === "approved")
      .reduce((sum, w) => sum + w.pointsAmount, 0);

    return {
      visitorId,
      totalPoints: approvedPoints,
      totalReceipts: userReceipts.length,
      pendingPoints,
      availableForWithdrawal: approvedPoints - withdrawnPoints - pendingWithdrawalPoints,
    };
  }

  // ============ DONATIONS ============
  async getDonations(): Promise<Donation[]> {
    return db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  async getRecentDonations(limit: number): Promise<Donation[]> {
    return db.select().from(donations).orderBy(desc(donations.createdAt)).limit(limit);
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db.insert(donations).values(donation).returning();
    return newDonation;
  }

  // ============ FUND STATS & ALLOCATIONS ============
  async getFundStats(): Promise<FundStats> {
    const allDonations = await this.getDonations();
    const allAllocations = await this.getFundAllocations();

    const totalRaised = allDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalSpent = allAllocations.reduce((sum, a) => sum + a.amount, 0);

    return {
      totalRaised,
      totalSpent,
      donorCount: allDonations.length,
      treesPlanted: Math.floor(totalRaised / 10), // Approx 10 AZN per tree
      projectsSupported: new Set(allAllocations.map(a => a.category)).size || 3,
    };
  }

  async getFundAllocations(): Promise<FundAllocation[]> {
    return db.select().from(fundAllocations).orderBy(desc(fundAllocations.createdAt));
  }

  async createFundAllocation(allocation: InsertFundAllocation): Promise<FundAllocation> {
    const [newAllocation] = await db.insert(fundAllocations).values(allocation).returning();
    return newAllocation;
  }

  // ============ ADMIN USERS ============
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db.insert(adminUsers).values(admin).returning();
    return newAdmin;
  }

  // ============ WITHDRAWAL REQUESTS ============
  async getWithdrawalRequests(visitorId?: string): Promise<WithdrawalRequest[]> {
    if (visitorId) {
      return db
        .select()
        .from(withdrawalRequests)
        .where(eq(withdrawalRequests.visitorId, visitorId))
        .orderBy(desc(withdrawalRequests.createdAt));
    }
    return db.select().from(withdrawalRequests).orderBy(desc(withdrawalRequests.createdAt));
  }

  async createWithdrawalRequest(request: InsertWithdrawalRequest & { moneyAmount: number }): Promise<WithdrawalRequest> {
    const [newRequest] = await db.insert(withdrawalRequests).values(request).returning();
    return newRequest;
  }

  async updateWithdrawalStatus(id: number, status: string, adminNotes?: string): Promise<WithdrawalRequest | undefined> {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({ status, adminNotes, processedAt: new Date() })
      .where(eq(withdrawalRequests.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
