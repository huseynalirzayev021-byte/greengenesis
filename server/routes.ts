import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { 
  insertReceiptSchema, 
  insertDonationSchema,
  insertVendorSchema,
  insertFundAllocationSchema,
  insertWithdrawalRequestSchema,
} from "@shared/schema";
import { randomUUID } from "crypto";
import * as bcrypt from "bcryptjs";
import OpenAI from "openai";

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

// Simple admin auth check via session
function isAdminAuthenticated(req: Request): boolean {
  return !!(req.session as any)?.adminId;
}

function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ OBJECT STORAGE ROUTES ============
  
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

  // OCR Receipt Analysis - Extract vendor, amount, date from receipt image
  app.post("/api/receipts/ocr", async (req, res) => {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      // Get the approved vendor names for matching
      const approvedVendors = await storage.getApprovedVendors();
      const vendorNames = approvedVendors.map(v => v.name);

      // Construct full image URL if it's a relative path
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('/objects/')) {
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol || 'http';
        fullImageUrl = `${protocol}://${host}${imageUrl}`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a receipt analysis assistant. Extract the following information from receipt images:
1. Vendor/Store name - Try to match with these partner vendors if possible: ${vendorNames.join(", ")}
2. Total amount (in AZN - Azerbaijani Manat)
3. Date of purchase (format: YYYY-MM-DD)

Respond ONLY with a valid JSON object in this exact format:
{
  "vendorName": "extracted vendor name or best match from partner list",
  "amount": 123.45,
  "date": "2024-01-15",
  "confidence": 0.85,
  "isPartnerVendor": true,
  "rawVendorName": "original vendor name from receipt"
}

If you cannot extract a field, use null for that field. The confidence should be between 0 and 1.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this receipt image and extract the vendor name, total amount, and date."
              },
              {
                type: "image_url",
                image_url: {
                  url: fullImageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Failed to analyze receipt" });
      }

      // Parse the JSON response
      try {
        // Extract JSON from the response (handle markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
        
        const ocrResult = JSON.parse(jsonStr.trim());
        res.json({
          success: true,
          data: {
            vendorName: ocrResult.vendorName || null,
            amount: ocrResult.amount || null,
            date: ocrResult.date || null,
            confidence: ocrResult.confidence || 0,
            isPartnerVendor: ocrResult.isPartnerVendor || false,
            rawVendorName: ocrResult.rawVendorName || ocrResult.vendorName || null,
          }
        });
      } catch (parseError) {
        console.error("Failed to parse OCR response:", content);
        res.status(500).json({ error: "Failed to parse receipt data" });
      }
    } catch (error) {
      console.error("OCR analysis error:", error);
      res.status(500).json({ error: "Failed to analyze receipt" });
    }
  });

  // ============ VENDOR ROUTES ============

  // Get all approved vendors (public)
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getApprovedVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error getting vendors:", error);
      res.status(500).json({ error: "Failed to get vendors" });
    }
  });

  // Register a new vendor (public - pending approval)
  app.post("/api/vendors", async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid vendor data" });
      }
      res.status(500).json({ error: "Failed to create vendor" });
    }
  });

  // ============ RECEIPT ROUTES ============

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

  // ============ REWARDS ROUTES ============

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

  // Request withdrawal (convert points to money)
  app.post("/api/withdrawals", async (req, res) => {
    try {
      const visitorId = getVisitorId(req, res);
      const validatedData = insertWithdrawalRequestSchema.parse(req.body);
      
      // Check if user has enough available points
      const rewards = await storage.getUserRewards(visitorId);
      if (rewards.availableForWithdrawal < validatedData.pointsAmount) {
        return res.status(400).json({ error: "Insufficient points available" });
      }
      
      // Conversion rate: 100 points = 1 AZN
      const moneyAmount = validatedData.pointsAmount / 100;
      
      const withdrawal = await storage.createWithdrawalRequest({
        visitorId,
        pointsAmount: validatedData.pointsAmount,
        paymentMethod: validatedData.paymentMethod,
        paymentDetails: validatedData.paymentDetails,
        moneyAmount,
      });
      
      res.status(201).json(withdrawal);
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid withdrawal data" });
      }
      res.status(500).json({ error: "Failed to create withdrawal request" });
    }
  });

  // Get user's withdrawal requests
  app.get("/api/withdrawals", async (req, res) => {
    try {
      const visitorId = getVisitorId(req, res);
      const withdrawals = await storage.getWithdrawalRequests(visitorId);
      res.json(withdrawals);
    } catch (error) {
      console.error("Error getting withdrawals:", error);
      res.status(500).json({ error: "Failed to get withdrawals" });
    }
  });

  // ============ DONATION ROUTES ============

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

  // ============ FUND ROUTES ============

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

  // Get fund allocations (transparency)
  app.get("/api/fund/allocations", async (req, res) => {
    try {
      const allocations = await storage.getFundAllocations();
      res.json(allocations);
    } catch (error) {
      console.error("Error getting allocations:", error);
      res.status(500).json({ error: "Failed to get allocations" });
    }
  });

  // ============ ADMIN AUTH ROUTES ============

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set admin session
      (req.session as any).adminId = admin.id;
      (req.session as any).adminUsername = admin.username;
      (req.session as any).adminRole = admin.role;
      
      res.json({ 
        success: true, 
        admin: { 
          id: admin.id, 
          username: admin.username, 
          name: admin.name,
          role: admin.role 
        } 
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Check admin session
  app.get("/api/admin/session", (req, res) => {
    if (isAdminAuthenticated(req)) {
      res.json({ 
        authenticated: true,
        admin: {
          id: (req.session as any).adminId,
          username: (req.session as any).adminUsername,
          role: (req.session as any).adminRole,
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // ============ ADMIN MANAGEMENT ROUTES ============

  // Get all vendors (admin only)
  app.get("/api/admin/vendors", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error getting vendors:", error);
      res.status(500).json({ error: "Failed to get vendors" });
    }
  });

  // Update vendor status (admin only)
  app.patch("/api/admin/vendors/:id/status", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const vendor = await storage.updateVendorStatus(id, status);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      
      res.json(vendor);
    } catch (error) {
      console.error("Error updating vendor:", error);
      res.status(500).json({ error: "Failed to update vendor" });
    }
  });

  // Get all receipts (admin only)
  app.get("/api/admin/receipts", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const receipts = await storage.getAllReceipts();
      res.json(receipts);
    } catch (error) {
      console.error("Error getting receipts:", error);
      res.status(500).json({ error: "Failed to get receipts" });
    }
  });

  // Update receipt status (admin only)
  app.patch("/api/admin/receipts/:id/status", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const receipt = await storage.updateReceiptStatus(id, status, adminNotes);
      if (!receipt) {
        return res.status(404).json({ error: "Receipt not found" });
      }
      
      res.json(receipt);
    } catch (error) {
      console.error("Error updating receipt:", error);
      res.status(500).json({ error: "Failed to update receipt" });
    }
  });

  // Get all withdrawal requests (admin only)
  app.get("/api/admin/withdrawals", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const withdrawals = await storage.getWithdrawalRequests();
      res.json(withdrawals);
    } catch (error) {
      console.error("Error getting withdrawals:", error);
      res.status(500).json({ error: "Failed to get withdrawals" });
    }
  });

  // Update withdrawal status (admin only)
  app.patch("/api/admin/withdrawals/:id/status", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      
      if (!["approved", "rejected", "pending", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const withdrawal = await storage.updateWithdrawalStatus(id, status, adminNotes);
      if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal request not found" });
      }
      
      res.json(withdrawal);
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      res.status(500).json({ error: "Failed to update withdrawal" });
    }
  });

  // Create fund allocation (admin only)
  app.post("/api/admin/fund/allocations", (req, res, next) => requireAdmin(req, res, next), async (req, res) => {
    try {
      const validatedData = insertFundAllocationSchema.parse(req.body);
      const allocation = await storage.createFundAllocation(validatedData);
      res.status(201).json(allocation);
    } catch (error) {
      console.error("Error creating allocation:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid allocation data" });
      }
      res.status(500).json({ error: "Failed to create allocation" });
    }
  });

  // Create initial admin (only works if no admins exist)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { username, password, name } = req.body;
      
      if (!username || !password || !name) {
        return res.status(400).json({ error: "Username, password, and name required" });
      }
      
      // Check if any admin already exists
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin setup already completed" });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await storage.createAdminUser({
        username,
        passwordHash,
        name,
        role: "superadmin",
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Admin account created",
        admin: { id: admin.id, username: admin.username, name: admin.name }
      });
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ error: "Admin setup failed" });
    }
  });

  return httpServer;
}
