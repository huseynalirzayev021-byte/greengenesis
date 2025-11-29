import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { insertReceiptSchema, insertDonationSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Helper to get or create a visitor ID from cookies
function getVisitorId(req: Request, res: Response): string {
  let visitorId = req.cookies?.visitorId;
  if (!visitorId) {
    visitorId = randomUUID();
    res.cookie("visitorId", visitorId, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: "lax",
    });
  }
  return visitorId;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Serve public objects from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve uploaded objects (public access for receipts)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL for receipts
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Normalize receipt image path after upload
  app.put("/api/receipts/image", async (req, res) => {
    if (!req.body.imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.imageUrl,
      );
      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error normalizing image path:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user's receipts
  app.get("/api/receipts", async (req, res) => {
    try {
      const visitorId = getVisitorId(req, res);
      const receipts = await storage.getReceipts(visitorId);
      res.json(receipts);
    } catch (error) {
      console.error("Error getting receipts:", error);
      res.status(500).json({ error: "Failed to get receipts" });
    }
  });

  // Submit a new receipt
  app.post("/api/receipts", async (req, res) => {
    try {
      const visitorId = getVisitorId(req, res);
      
      const validatedData = insertReceiptSchema.parse(req.body);
      
      // Calculate points: 10 points per AZN spent
      const pointsEarned = Math.floor(validatedData.purchaseAmount * 10);
      
      const receipt = await storage.createReceipt({
        visitorId,
        vendorName: validatedData.vendorName,
        purchaseAmount: validatedData.purchaseAmount,
        purchaseDate: validatedData.purchaseDate,
        imageUrl: validatedData.imageUrl,
        pointsEarned,
        status: "pending", // All new receipts start as pending
      });

      res.status(201).json(receipt);
    } catch (error) {
      console.error("Error creating receipt:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid receipt data" });
      }
      res.status(500).json({ error: "Failed to create receipt" });
    }
  });

  // Get user's rewards
  app.get("/api/rewards", async (req, res) => {
    try {
      const visitorId = getVisitorId(req, res);
      const rewards = await storage.getUserRewards(visitorId);
      res.json(rewards);
    } catch (error) {
      console.error("Error getting rewards:", error);
      res.status(500).json({ error: "Failed to get rewards" });
    }
  });

  // Get recent donations
  app.get("/api/donations/recent", async (req, res) => {
    try {
      const donations = await storage.getRecentDonations(10);
      res.json(donations);
    } catch (error) {
      console.error("Error getting donations:", error);
      res.status(500).json({ error: "Failed to get donations" });
    }
  });

  // Create a donation
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      
      const donation = await storage.createDonation({
        amount: validatedData.amount,
        donorName: validatedData.isAnonymous ? undefined : validatedData.donorName,
        message: validatedData.message,
        isAnonymous: validatedData.isAnonymous,
      });

      res.status(201).json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid donation data" });
      }
      res.status(500).json({ error: "Failed to create donation" });
    }
  });

  // Get fund statistics
  app.get("/api/fund/stats", async (req, res) => {
    try {
      const stats = await storage.getFundStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting fund stats:", error);
      res.status(500).json({ error: "Failed to get fund stats" });
    }
  });

  return httpServer;
}
