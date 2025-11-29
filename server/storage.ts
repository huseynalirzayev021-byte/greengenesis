import { randomUUID } from "crypto";
import type { Receipt, UserRewards, Donation, FundStats } from "@shared/schema";

export interface IStorage {
  // Receipts
  getReceipts(visitorId: string): Promise<Receipt[]>;
  createReceipt(receipt: Omit<Receipt, "id" | "createdAt">): Promise<Receipt>;
  
  // User Rewards
  getUserRewards(visitorId: string): Promise<UserRewards>;
  
  // Donations
  getDonations(): Promise<Donation[]>;
  getRecentDonations(limit: number): Promise<Donation[]>;
  createDonation(donation: Omit<Donation, "id" | "createdAt">): Promise<Donation>;
  
  // Fund Stats
  getFundStats(): Promise<FundStats>;
}

export class MemStorage implements IStorage {
  private receipts: Map<string, Receipt>;
  private donations: Map<string, Donation>;

  constructor() {
    this.receipts = new Map();
    this.donations = new Map();
    
    // Seed with some initial donations for demo
    this.seedData();
  }

  private seedData() {
    const seedDonations: Omit<Donation, "id" | "createdAt">[] = [
      { amount: 100, donorName: "Eldar M.", message: "For a greener Baku!", isAnonymous: false },
      { amount: 50, donorName: "Nigar A.", message: "Keep up the great work!", isAnonymous: false },
      { amount: 25, isAnonymous: true },
      { amount: 200, donorName: "Kamran H.", message: "Happy to support!", isAnonymous: false },
      { amount: 75, donorName: "Sevinj R.", isAnonymous: false },
    ];

    seedDonations.forEach((donation) => {
      const id = randomUUID();
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
      this.donations.set(id, { ...donation, id, createdAt });
    });
  }

  async getReceipts(visitorId: string): Promise<Receipt[]> {
    return Array.from(this.receipts.values())
      .filter((receipt) => receipt.visitorId === visitorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReceipt(receipt: Omit<Receipt, "id" | "createdAt">): Promise<Receipt> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const newReceipt: Receipt = { ...receipt, id, createdAt };
    this.receipts.set(id, newReceipt);
    return newReceipt;
  }

  async getUserRewards(visitorId: string): Promise<UserRewards> {
    const userReceipts = await this.getReceipts(visitorId);
    
    const totalPoints = userReceipts
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + r.pointsEarned, 0);
    
    const pendingPoints = userReceipts
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.pointsEarned, 0);
    
    return {
      visitorId,
      totalPoints,
      totalReceipts: userReceipts.length,
      pendingPoints,
    };
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecentDonations(limit: number): Promise<Donation[]> {
    const allDonations = await this.getDonations();
    return allDonations.slice(0, limit);
  }

  async createDonation(donation: Omit<Donation, "id" | "createdAt">): Promise<Donation> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const newDonation: Donation = { ...donation, id, createdAt };
    this.donations.set(id, newDonation);
    return newDonation;
  }

  async getFundStats(): Promise<FundStats> {
    const allDonations = await this.getDonations();
    const totalRaised = allDonations.reduce((sum, d) => sum + d.amount, 0);
    
    return {
      totalRaised,
      donorCount: allDonations.length,
      treesPlanted: Math.floor(totalRaised / 10), // Approx 10 AZN per tree
      projectsSupported: 3,
    };
  }
}

export const storage = new MemStorage();
