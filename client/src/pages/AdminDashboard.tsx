import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vendor, Receipt, WithdrawalRequest, FundAllocation } from "@shared/schema";
import {
  Shield,
  Store,
  Receipt as ReceiptIcon,
  Wallet,
  PieChart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  LogOut,
  Plus,
  TreeDeciduous,
  Users,
  DollarSign,
} from "lucide-react";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const allocationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type AllocationFormValues = z.infer<typeof allocationFormSchema>;

interface AdminSession {
  authenticated: boolean;
  admin?: {
    id: number;
    username: string;
    role: string;
  };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showAllocationForm, setShowAllocationForm] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const allocationForm = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { data: session, isLoading: sessionLoading } = useQuery<AdminSession>({
    queryKey: ["/api/admin/session"],
  });

  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/admin/vendors"],
    enabled: !!session?.authenticated,
  });

  const { data: receipts } = useQuery<Receipt[]>({
    queryKey: ["/api/admin/receipts"],
    enabled: !!session?.authenticated,
  });

  const { data: withdrawals } = useQuery<WithdrawalRequest[]>({
    queryKey: ["/api/admin/withdrawals"],
    enabled: !!session?.authenticated,
  });

  const { data: allocations } = useQuery<FundAllocation[]>({
    queryKey: ["/api/fund/allocations"],
    enabled: !!session?.authenticated,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return apiRequest("POST", "/api/admin/login", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      toast({ title: "Login successful", description: "Welcome to the admin dashboard." });
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid credentials.", variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/logout", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      toast({ title: "Logged out successfully" });
    },
  });

  const updateVendorStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/vendors/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({ title: "Vendor status updated" });
    },
  });

  const updateReceiptStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      return apiRequest("PATCH", `/api/admin/receipts/${id}/status`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/receipts"] });
      toast({ title: "Receipt status updated" });
    },
  });

  const updateWithdrawalStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      return apiRequest("PATCH", `/api/admin/withdrawals/${id}/status`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      toast({ title: "Withdrawal status updated" });
    },
  });

  const createAllocationMutation = useMutation({
    mutationFn: async (data: AllocationFormValues) => {
      return apiRequest("POST", "/api/admin/fund/allocations", {
        ...data,
        amount: parseFloat(data.amount),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fund/allocations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fund/stats"] });
      toast({ title: "Fund allocation created" });
      allocationForm.reset();
      setShowAllocationForm(false);
    },
    onError: () => {
      toast({ title: "Failed to create allocation", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} data-testid="input-admin-username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-admin-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-admin-login">
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingVendors = vendors?.filter(v => v.status === "pending") || [];
  const pendingReceipts = receipts?.filter(r => r.status === "pending") || [];
  const pendingWithdrawals = withdrawals?.filter(w => w.status === "pending" || w.status === "approved") || [];

  return (
    <div className="min-h-screen pt-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome, {session.admin?.username}
            </p>
          </div>
          <Button variant="outline" onClick={() => logoutMutation.mutate()} data-testid="button-admin-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingVendors.length}</div>
                  <div className="text-sm text-muted-foreground">Pending Vendors</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <ReceiptIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingReceipts.length}</div>
                  <div className="text-sm text-muted-foreground">Pending Receipts</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingWithdrawals.length}</div>
                  <div className="text-sm text-muted-foreground">Pending Withdrawals</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{allocations?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Fund Allocations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vendors" data-testid="tab-vendors">
              <Store className="mr-2 h-4 w-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="receipts" data-testid="tab-receipts">
              <ReceiptIcon className="mr-2 h-4 w-4" />
              Receipts
            </TabsTrigger>
            <TabsTrigger value="withdrawals" data-testid="tab-withdrawals">
              <Wallet className="mr-2 h-4 w-4" />
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="allocations" data-testid="tab-allocations">
              <PieChart className="mr-2 h-4 w-4" />
              Fund Allocations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Approve or reject vendor registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {vendors && vendors.length > 0 ? (
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50" data-testid={`admin-vendor-${vendor.id}`}>
                        <div className="flex-1">
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">{vendor.email} | {vendor.phone}</div>
                          {vendor.description && <div className="text-sm text-muted-foreground mt-1">{vendor.description}</div>}
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(vendor.status)}
                          {vendor.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateVendorStatusMutation.mutate({ id: vendor.id, status: "approved" })} data-testid={`approve-vendor-${vendor.id}`}>
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateVendorStatusMutation.mutate({ id: vendor.id, status: "rejected" })} data-testid={`reject-vendor-${vendor.id}`}>
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No vendors found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Verification</CardTitle>
                <CardDescription>Review and approve submitted receipts</CardDescription>
              </CardHeader>
              <CardContent>
                {receipts && receipts.length > 0 ? (
                  <div className="space-y-4">
                    {receipts.map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50" data-testid={`admin-receipt-${receipt.id}`}>
                        <div className="flex-1">
                          <div className="font-medium">{receipt.vendorName}</div>
                          <div className="text-sm text-muted-foreground">
                            {receipt.purchaseAmount.toFixed(2)} AZN | {new Date(receipt.purchaseDate).toLocaleDateString()} | +{receipt.pointsEarned} pts
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Visitor: {receipt.visitorId.slice(0, 8)}...</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {receipt.imageUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={receipt.imageUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </a>
                            </Button>
                          )}
                          {getStatusBadge(receipt.status)}
                          {receipt.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateReceiptStatusMutation.mutate({ id: receipt.id, status: "approved" })} data-testid={`approve-receipt-${receipt.id}`}>
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateReceiptStatusMutation.mutate({ id: receipt.id, status: "rejected" })} data-testid={`reject-receipt-${receipt.id}`}>
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No receipts found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>Process user withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                {withdrawals && withdrawals.length > 0 ? (
                  <div className="space-y-4">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50" data-testid={`admin-withdrawal-${withdrawal.id}`}>
                        <div className="flex-1">
                          <div className="font-medium">{withdrawal.pointsAmount} points → {withdrawal.moneyAmount.toFixed(2)} AZN</div>
                          <div className="text-sm text-muted-foreground">
                            {withdrawal.paymentMethod}: {withdrawal.paymentDetails}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Visitor: {withdrawal.visitorId.slice(0, 8)}...</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(withdrawal.status)}
                          {withdrawal.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateWithdrawalStatusMutation.mutate({ id: withdrawal.id, status: "approved" })}>
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateWithdrawalStatusMutation.mutate({ id: withdrawal.id, status: "rejected" })}>
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {withdrawal.status === "approved" && (
                            <Button size="sm" onClick={() => updateWithdrawalStatusMutation.mutate({ id: withdrawal.id, status: "completed" })}>
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No withdrawal requests found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Fund Allocations</CardTitle>
                  <CardDescription>Track how donations are spent</CardDescription>
                </div>
                <Button onClick={() => setShowAllocationForm(!showAllocationForm)} data-testid="button-add-allocation">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Allocation
                </Button>
              </CardHeader>
              <CardContent>
                {showAllocationForm && (
                  <Card className="mb-6 bg-muted/30">
                    <CardContent className="pt-6">
                      <Form {...allocationForm}>
                        <form onSubmit={allocationForm.handleSubmit((data) => createAllocationMutation.mutate(data))} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={allocationForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tree planting in Baku" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={allocationForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="trees">Trees & Plants</SelectItem>
                                      <SelectItem value="education">Education</SelectItem>
                                      <SelectItem value="equipment">Equipment</SelectItem>
                                      <SelectItem value="events">Events</SelectItem>
                                      <SelectItem value="admin">Administrative</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={allocationForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Details about this allocation..." className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={allocationForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount (AZN)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" placeholder="500.00" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={allocationForm.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" disabled={createAllocationMutation.isPending}>
                              {createAllocationMutation.isPending ? "Creating..." : "Create Allocation"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowAllocationForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                {allocations && allocations.length > 0 ? (
                  <div className="space-y-4">
                    {allocations.map((allocation) => (
                      <div key={allocation.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="font-medium">{allocation.title}</div>
                          <div className="text-sm text-muted-foreground">{allocation.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">{new Date(allocation.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{allocation.category}</Badge>
                          <span className="font-bold text-primary">{allocation.amount.toFixed(2)} AZN</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No allocations yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
