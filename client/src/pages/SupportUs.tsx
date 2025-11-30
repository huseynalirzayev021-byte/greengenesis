import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { FundStats, Donation } from "@shared/schema";
import {
  Heart,
  TreeDeciduous,
  Users,
  Target,
  Shield,
  CheckCircle,
  Sparkles,
  HandHeart,
} from "lucide-react";

const donationFormSchema = z.object({
  amount: z.string().min(1, "Please enter an amount"),
  donorName: z.string().optional(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

const presetAmounts = [5, 10, 25, 50, 100];

export default function SupportUs() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState(false);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "25",
      donorName: "",
      message: "",
      isAnonymous: false,
    },
  });

  const { data: fundStats, isLoading: statsLoading } = useQuery<FundStats>({
    queryKey: ["/api/fund/stats"],
  });

  const { data: recentDonations, isLoading: donationsLoading } = useQuery<Donation[]>({
    queryKey: ["/api/donations/recent"],
  });

  const donateMutation = useMutation({
    mutationFn: async (data: DonationFormValues) => {
      return apiRequest("POST", "/api/donations", {
        amount: parseFloat(data.amount),
        donorName: data.isAnonymous ? undefined : data.donorName,
        message: data.message,
        isAnonymous: data.isAnonymous,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fund/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/donations/recent"] });
      toast({
        title: t("toasts.donationSuccess"),
        description: t("toasts.donationSuccessDesc"),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t("toasts.donationError"),
        description: t("toasts.tryAgainLater"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    donateMutation.mutate(data);
  };

  const fundingGoal = 50000;
  const currentFunding = fundStats?.totalRaised || 0;
  const progress = Math.min((currentFunding / fundingGoal) * 100, 100);

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm text-white/90">{t("supportUs.heroBadge")}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("supportUs.heroTitle")}
              <span className="block text-green-400">{t("supportUs.heroTitleHighlight")}</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed">
              {t("supportUs.heroDescription")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-card">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{t("supportUs.fundingGoalTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("supportUs.fundingGoalDesc")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {currentFunding.toLocaleString()} AZN
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("supportUs.ofGoal", { goal: fundingGoal.toLocaleString() })}
                  </div>
                </div>
              </div>
              <Progress value={progress} className="h-3 mb-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{fundStats?.donorCount || 0} {t("supportUs.donors")}</span>
                <span>{progress.toFixed(1)}% {t("supportUs.funded")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart className="h-5 w-5 text-primary" />
                    {t("supportUs.makeDonation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <FormLabel className="mb-3 block">{t("supportUs.selectAmount")}</FormLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                          {presetAmounts.map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant={form.watch("amount") === amount.toString() && !customAmount ? "default" : "outline"}
                              onClick={() => {
                                form.setValue("amount", amount.toString());
                                setCustomAmount(false);
                              }}
                              data-testid={`button-amount-${amount}`}
                            >
                              {amount} AZN
                            </Button>
                          ))}
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    placeholder={t("supportUs.enterAmount")}
                                    className="pl-12"
                                    {...field}
                                    onFocus={() => setCustomAmount(true)}
                                    data-testid="input-custom-amount"
                                  />
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    AZN
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="donorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your name"
                                {...field}
                                disabled={form.watch("isAnonymous")}
                                data-testid="input-donor-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Leave a message of support..."
                                className="resize-none"
                                rows={3}
                                {...field}
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isAnonymous"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Donate Anonymously
                              </FormLabel>
                              <FormDescription>
                                Your name won't be displayed publicly
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-anonymous"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={donateMutation.isPending}
                        data-testid="button-donate"
                      >
                        {donateMutation.isPending ? (
                          "Processing..."
                        ) : (
                          <>
                            <Heart className="mr-2 h-5 w-5" />
                            Donate {form.watch("amount")} AZN
                          </>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Secure and encrypted donation</span>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Impact Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statsLoading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading...
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <TreeDeciduous className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xl font-bold">
                            {fundStats?.treesPlanted || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Trees Planted
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xl font-bold">
                            {fundStats?.donorCount || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Donors
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xl font-bold">
                            {fundStats?.projectsSupported || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Projects Supported
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Recent Supporters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {donationsLoading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading...
                    </div>
                  ) : recentDonations && recentDonations.length > 0 ? (
                    <div className="space-y-3">
                      {recentDonations.slice(0, 5).map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Heart className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {donation.isAnonymous ? "Anonymous" : donation.donorName || "Supporter"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {donation.amount} AZN
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Be the first to donate!
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        100% Transparency
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        All donations are tracked and reported. We publish regular updates 
                        on how funds are used for environmental projects.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Where Your Donation Goes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every manat is carefully allocated to maximize environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <TreeDeciduous className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold mb-2 text-green-600">60%</div>
                <h3 className="font-semibold mb-2">Tree Planting</h3>
                <p className="text-sm text-muted-foreground">
                  Purchasing and planting native trees across Azerbaijan
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold mb-2 text-blue-600">25%</div>
                <h3 className="font-semibold mb-2">Education</h3>
                <p className="text-sm text-muted-foreground">
                  Environmental workshops and school programs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold mb-2 text-purple-600">15%</div>
                <h3 className="font-semibold mb-2">Operations</h3>
                <p className="text-sm text-muted-foreground">
                  Platform maintenance and project coordination
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
