import { z } from "zod";

// Eco Fact schema
export interface EcoFact {
  id: number;
  icon: string;
  title: string;
  description: string;
  statistic?: string;
}

// Environmental Impact data
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

// Receipt for tree/flower purchases
export const insertReceiptSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  purchaseAmount: z.number().min(0.01, "Amount must be greater than 0"),
  purchaseDate: z.string(),
  imageUrl: z.string().optional(),
});

export type InsertReceipt = z.infer<typeof insertReceiptSchema>;

export interface Receipt {
  id: string;
  visitorId: string;
  vendorName: string;
  purchaseAmount: number;
  purchaseDate: string;
  imageUrl?: string;
  pointsEarned: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// User rewards tracking
export interface UserRewards {
  visitorId: string;
  totalPoints: number;
  totalReceipts: number;
  pendingPoints: number;
}

// Donation schema
export const insertDonationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1 AZN"),
  donorName: z.string().optional(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;

export interface Donation {
  id: string;
  amount: number;
  donorName?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
}

// Team member
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  school: string;
  bio: string;
  avatarUrl?: string;
}

// Fund statistics
export interface FundStats {
  totalRaised: number;
  donorCount: number;
  treesPlanted: number;
  projectsSupported: number;
}
