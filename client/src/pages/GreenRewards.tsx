import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Receipt, UserRewards, Vendor, WithdrawalRequest } from "@shared/schema";
import {
  TreeDeciduous,
  Upload,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Coins,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Scan,
  Loader2,
  Wallet,
  CreditCard,
  Smartphone,
  History,
} from "lucide-react";

const receiptFormSchema = z.object({
  vendorName: z.string().min(1, "Please select a vendor"),
  purchaseAmount: z.string().min(1, "Please enter the purchase amount"),
  purchaseDate: z.string().min(1, "Please select a date"),
});

const withdrawalFormSchema = z.object({
  pointsAmount: z.string().min(1, "Please enter the points to withdraw"),
  paymentMethod: z.enum(["bank_transfer", "mobile_payment"]),
  paymentDetails: z.string().min(1, "Please enter payment details"),
});

type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;

interface OcrResult {
  vendorName: string | null;
  amount: number | null;
  date: string | null;
  confidence: number;
  isPartnerVendor: boolean;
  rawVendorName: string | null;
}

export default function GreenRewards() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      vendorName: "",
      purchaseAmount: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    },
  });

  const withdrawalForm = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      pointsAmount: "",
      paymentMethod: "bank_transfer",
      paymentDetails: "",
    },
  });

  const { data: rewards, isLoading: rewardsLoading } = useQuery<UserRewards>({
    queryKey: ["/api/rewards"],
  });

  const { data: receipts, isLoading: receiptsLoading } = useQuery<Receipt[]>({
    queryKey: ["/api/receipts"],
  });

  const { data: vendors, isLoading: vendorsLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery<WithdrawalRequest[]>({
    queryKey: ["/api/withdrawals"],
  });

  const submitReceiptMutation = useMutation({
    mutationFn: async (data: ReceiptFormValues & { imageUrl?: string }) => {
      return apiRequest("POST", "/api/receipts", {
        vendorName: data.vendorName,
        purchaseAmount: parseFloat(data.purchaseAmount),
        purchaseDate: data.purchaseDate,
        imageUrl: data.imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      toast({
        title: t("toasts.receiptSubmitted"),
        description: t("toasts.receiptSubmittedDesc"),
      });
      form.reset();
      setUploadedImageUrl(null);
      setOcrResult(null);
    },
    onError: () => {
      toast({
        title: t("toasts.receiptError"),
        description: t("toasts.tryAgainLater"),
        variant: "destructive",
      });
    },
  });

  const submitWithdrawalMutation = useMutation({
    mutationFn: async (data: WithdrawalFormValues) => {
      return apiRequest("POST", "/api/withdrawals", {
        pointsAmount: parseInt(data.pointsAmount),
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentDetails,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      toast({
        title: t("toasts.withdrawalRequested"),
        description: t("toasts.withdrawalRequestedDesc"),
      });
      withdrawalForm.reset();
      setWithdrawalDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t("toasts.withdrawalError"),
        description: error?.message || t("toasts.tryAgainLater"),
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { 
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const analyzeReceiptWithOcr = async (imagePath: string) => {
    setIsAnalyzing(true);
    setOcrResult(null);
    
    try {
      const response = await apiRequest("POST", "/api/receipts/ocr", {
        imageUrl: imagePath,
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        const ocrData = result.data as OcrResult;
        setOcrResult(ocrData);
        
        // Auto-fill form fields with OCR data
        if (ocrData.vendorName) {
          form.setValue("vendorName", ocrData.vendorName);
        }
        if (ocrData.amount !== null) {
          form.setValue("purchaseAmount", ocrData.amount.toString());
        }
        if (ocrData.date) {
          form.setValue("purchaseDate", ocrData.date);
        }
        
        toast({
          title: t("toasts.receiptAnalyzed"),
          description: ocrData.isPartnerVendor 
            ? t("toasts.partnerVendorFound", { vendor: ocrData.vendorName })
            : t("toasts.dataExtracted"),
        });
      } else {
        toast({
          title: t("toasts.analysisIncomplete"),
          description: t("toasts.analysisIncompleteDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast({
        title: t("toasts.analysisFailed"),
        description: t("toasts.analysisFailedDesc"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadComplete = async (result: { successful?: { uploadURL?: string }[] }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (uploadedUrl) {
        const response = await apiRequest("PUT", "/api/receipts/image", {
          imageUrl: uploadedUrl,
        });
        const data = await response.json();
        setUploadedImageUrl(data.objectPath);
        toast({
          title: t("toasts.imageUploaded"),
          description: t("toasts.analyzingReceipt"),
        });
        
        // Automatically analyze the receipt with OCR
        await analyzeReceiptWithOcr(data.objectPath);
      }
    }
  };

  const onSubmit = (data: ReceiptFormValues) => {
    submitReceiptMutation.mutate({
      ...data,
      imageUrl: uploadedImageUrl || undefined,
    });
  };

  const getStatusBadge = (status: Receipt["status"]) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />{t("greenRewards.status.approved")}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t("greenRewards.status.rejected")}</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t("greenRewards.status.pending")}</Badge>;
    }
  };

  const getWithdrawalStatusBadge = (status: WithdrawalRequest["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />{t("greenRewards.status.completed")}</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-blue-600"><Clock className="w-3 h-3 mr-1" />{t("greenRewards.status.processing")}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t("greenRewards.status.rejected")}</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t("greenRewards.status.pending")}</Badge>;
    }
  };

  const onWithdrawalSubmit = (data: WithdrawalFormValues) => {
    const pointsAmount = parseInt(data.pointsAmount);
    if (pointsAmount < 500) {
      toast({
        title: t("toasts.withdrawalError"),
        description: t("greenRewards.minWithdrawal"),
        variant: "destructive",
      });
      return;
    }
    if (rewards && pointsAmount > rewards.availableForWithdrawal) {
      toast({
        title: t("toasts.withdrawalError"),
        description: t("toasts.tryAgainLater"),
        variant: "destructive",
      });
      return;
    }
    submitWithdrawalMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Gift className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/90">Rewards Program</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              GreenRewards
              <span className="block text-green-400">Plant & Earn</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed">
              Purchase trees and flowers from our partner vendors, upload your receipt, 
              and earn reward points. Your contribution helps make Azerbaijan greener 
              while you benefit from exclusive rewards.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">1. Purchase</h3>
                <p className="text-sm text-muted-foreground">
                  Buy trees or flowers from our partner vendors
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">2. Upload Receipt</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your purchase receipt for verification
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">3. Earn Points</h3>
                <p className="text-sm text-muted-foreground">
                  Get reward points convertible to cash
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Submit New Receipt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="vendorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partner Vendor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-vendor">
                                  <SelectValue placeholder="Select a vendor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {vendorsLoading ? (
                                  <SelectItem value="loading" disabled>Loading vendors...</SelectItem>
                                ) : vendors && vendors.length > 0 ? (
                                  vendors.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.name}>
                                      {vendor.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>No vendors available</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="purchaseAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purchase Amount (AZN)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  data-testid="input-amount"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="purchaseDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purchase Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  data-testid="input-date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <FormLabel>Receipt Image</FormLabel>
                        <div className="flex flex-wrap items-center gap-4">
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            maxFileSize={10485760}
                            onGetUploadParameters={handleGetUploadParameters}
                            onComplete={handleUploadComplete}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Receipt Photo
                          </ObjectUploader>
                          {isAnalyzing && (
                            <Badge variant="secondary" className="gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Analyzing with AI...
                            </Badge>
                          )}
                          {uploadedImageUrl && !isAnalyzing && (
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Image uploaded
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload a clear photo of your purchase receipt (max 10MB). AI will automatically extract the details.
                        </p>
                        
                        {ocrResult && (
                          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                              <Scan className="h-4 w-4" />
                              AI Analysis Results
                              <Badge variant="outline" className="ml-auto text-xs">
                                {Math.round(ocrResult.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Vendor: </span>
                                <span className="font-medium">{ocrResult.vendorName || "Not detected"}</span>
                                {ocrResult.isPartnerVendor && (
                                  <Badge variant="default" className="ml-1 text-xs bg-green-600">Partner</Badge>
                                )}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Amount: </span>
                                <span className="font-medium">
                                  {ocrResult.amount !== null ? `${ocrResult.amount} AZN` : "Not detected"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date: </span>
                                <span className="font-medium">{ocrResult.date || "Not detected"}</span>
                              </div>
                            </div>
                            {ocrResult.rawVendorName && ocrResult.rawVendorName !== ocrResult.vendorName && (
                              <p className="text-xs text-muted-foreground">
                                Original vendor name on receipt: "{ocrResult.rawVendorName}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={submitReceiptMutation.isPending}
                        data-testid="button-submit-receipt"
                      >
                        {submitReceiptMutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            <TreeDeciduous className="mr-2 h-5 w-5" />
                            Submit Receipt
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Your Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {receiptsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading your submissions...
                    </div>
                  ) : receipts && receipts.length > 0 ? (
                    <div className="space-y-4">
                      {receipts.map((receipt) => (
                        <div
                          key={receipt.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                          data-testid={`receipt-item-${receipt.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <TreeDeciduous className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{receipt.vendorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {receipt.purchaseAmount.toFixed(2)} AZN - {new Date(receipt.purchaseDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold text-primary">
                                +{receipt.pointsEarned} pts
                              </div>
                            </div>
                            {getStatusBadge(receipt.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TreeDeciduous className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No submissions yet. Submit your first receipt to start earning!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {withdrawals && withdrawals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Withdrawal History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {withdrawals.map((withdrawal) => (
                        <div
                          key={withdrawal.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                          data-testid={`withdrawal-item-${withdrawal.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {withdrawal.pointsAmount} points to {withdrawal.moneyAmount.toFixed(2)} AZN
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {withdrawal.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Mobile Payment"} - {new Date(withdrawal.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {getWithdrawalStatusBadge(withdrawal.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Star className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Your Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep earning to unlock rewards
                    </p>
                  </div>

                  {rewardsLoading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-background rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {rewards?.totalPoints || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Points
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background rounded-lg p-3 text-center">
                          <div className="text-xl font-semibold">
                            {rewards?.totalReceipts || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Submissions
                          </div>
                        </div>
                        <div className="bg-background rounded-lg p-3 text-center">
                          <div className="text-xl font-semibold text-yellow-600">
                            {rewards?.pendingPoints || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pending
                          </div>
                        </div>
                      </div>

                      <div className="bg-background rounded-lg p-4 text-center border-2 border-dashed border-primary/30">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {rewards?.availableForWithdrawal || 0}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Available to Withdraw
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          = {((rewards?.availableForWithdrawal || 0) / 100).toFixed(2)} AZN
                        </div>
                        
                        <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full" 
                              size="sm"
                              disabled={(rewards?.availableForWithdrawal || 0) < 500}
                              data-testid="button-withdraw"
                            >
                              <Wallet className="mr-2 h-4 w-4" />
                              Withdraw Points
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-primary" />
                                Withdraw Points
                              </DialogTitle>
                              <DialogDescription>
                                Convert your points to money. Minimum withdrawal: 500 points (5 AZN)
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...withdrawalForm}>
                              <form onSubmit={withdrawalForm.handleSubmit(onWithdrawalSubmit)} className="space-y-4">
                                <FormField
                                  control={withdrawalForm.control}
                                  name="pointsAmount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Points to Withdraw</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter points (min 500)"
                                          {...field}
                                          data-testid="input-withdrawal-points"
                                        />
                                      </FormControl>
                                      <div className="text-xs text-muted-foreground">
                                        Available: {rewards?.availableForWithdrawal || 0} points 
                                        ({field.value ? (parseInt(field.value) / 100).toFixed(2) : '0.00'} AZN)
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={withdrawalForm.control}
                                  name="paymentMethod"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Payment Method</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger data-testid="select-payment-method">
                                            <SelectValue placeholder="Select payment method" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="bank_transfer">
                                            <div className="flex items-center gap-2">
                                              <CreditCard className="h-4 w-4" />
                                              Bank Transfer
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="mobile_payment">
                                            <div className="flex items-center gap-2">
                                              <Smartphone className="h-4 w-4" />
                                              Mobile Payment
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={withdrawalForm.control}
                                  name="paymentDetails"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        {withdrawalForm.watch("paymentMethod") === "bank_transfer" 
                                          ? "Bank Account / Card Number" 
                                          : "Phone Number"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={
                                            withdrawalForm.watch("paymentMethod") === "bank_transfer"
                                              ? "Enter your bank account or card number"
                                              : "Enter your phone number"
                                          }
                                          {...field}
                                          data-testid="input-payment-details"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    disabled={submitWithdrawalMutation.isPending}
                                    data-testid="button-submit-withdrawal"
                                  >
                                    {submitWithdrawalMutation.isPending ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <Wallet className="mr-2 h-4 w-4" />
                                        Request Withdrawal
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        
                        {(rewards?.availableForWithdrawal || 0) < 500 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Earn {500 - (rewards?.availableForWithdrawal || 0)} more points to withdraw
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Point Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">1 AZN spent</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-primary">10 points</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">100 points</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-primary">1 AZN reward</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Points can be redeemed once you reach 500 points minimum.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Partner Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vendorsLoading ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">Loading vendors...</div>
                    ) : vendors && vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover-elevate"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <TreeDeciduous className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm">{vendor.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No partner vendors yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
