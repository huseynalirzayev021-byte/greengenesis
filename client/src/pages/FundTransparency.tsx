import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { FundStats, FundAllocation } from "@shared/schema";
import {
  TreeDeciduous,
  Users,
  Target,
  PieChart,
  TrendingUp,
  CheckCircle,
  Calendar,
  Leaf,
  GraduationCap,
  Wrench,
  CalendarDays,
  Briefcase,
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  trees: Leaf,
  education: GraduationCap,
  equipment: Wrench,
  events: CalendarDays,
  admin: Briefcase,
};

const categoryColors: Record<string, string> = {
  trees: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  education: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  equipment: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  events: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function FundTransparency() {
  const { data: fundStats, isLoading: statsLoading } = useQuery<FundStats>({
    queryKey: ["/api/fund/stats"],
  });

  const { data: allocations, isLoading: allocationsLoading } = useQuery<FundAllocation[]>({
    queryKey: ["/api/fund/allocations"],
  });

  const fundingGoal = 50000;
  const currentFunding = fundStats?.totalRaised || 0;
  const totalSpent = fundStats?.totalSpent || 0;
  const progress = Math.min((currentFunding / fundingGoal) * 100, 100);

  const getCategoryTotals = () => {
    if (!allocations) return {};
    return allocations.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  const categoryTotals = getCategoryTotals();

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <PieChart className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/90">Financial Transparency</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Where Your Money
              <span className="block text-green-400">Goes</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed">
              We believe in complete transparency. See exactly how every donation is used 
              to support environmental projects across Azerbaijan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{currentFunding.toFixed(0)} AZN</div>
                    <div className="text-sm text-muted-foreground">Total Raised</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <PieChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalSpent.toFixed(0)} AZN</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{fundStats?.donorCount || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Donors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <TreeDeciduous className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{fundStats?.treesPlanted || 0}</div>
                    <div className="text-sm text-muted-foreground">Trees Planted</div>
                  </div>
                </div>
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
                    <Target className="h-5 w-5 text-primary" />
                    Funding Progress
                  </CardTitle>
                  <CardDescription>
                    Our current goal is to raise 50,000 AZN for environmental projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{currentFunding.toFixed(0)} AZN raised</span>
                      <span className="text-muted-foreground">{fundingGoal.toLocaleString()} AZN goal</span>
                    </div>
                    <Progress value={progress} className="h-4" />
                    <div className="text-center text-sm text-muted-foreground">
                      {progress.toFixed(1)}% of our goal
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Allocations
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of how funds have been used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allocationsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading allocations...</div>
                  ) : allocations && allocations.length > 0 ? (
                    <div className="space-y-4">
                      {allocations.map((allocation) => {
                        const IconComponent = categoryIcons[allocation.category] || Leaf;
                        return (
                          <div
                            key={allocation.id}
                            className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                            data-testid={`allocation-${allocation.id}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryColors[allocation.category] || categoryColors.trees}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-medium">{allocation.title}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {allocation.description}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {new Date(allocation.date).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="font-bold text-primary">
                                    {allocation.amount.toFixed(2)} AZN
                                  </div>
                                  <Badge variant="secondary" className="mt-1 capitalize">
                                    {allocation.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PieChart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No allocations recorded yet. Funds are being carefully planned for maximum impact.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-primary" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(categoryTotals).length > 0 ? (
                      Object.entries(categoryTotals).map(([category, amount]) => {
                        const IconComponent = categoryIcons[category] || Leaf;
                        const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : 0;
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm capitalize">{category}</span>
                              </div>
                              <span className="text-sm font-medium">{amount.toFixed(0)} AZN</span>
                            </div>
                            <Progress value={Number(percentage)} className="h-2" />
                            <div className="text-xs text-muted-foreground text-right">{percentage}%</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No spending recorded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Our Commitment</h3>
                    <p className="text-sm text-muted-foreground">
                      We are committed to using at least 85% of all donations directly on environmental 
                      projects. Administrative costs are kept to a minimum.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TreeDeciduous className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Trees Planted</span>
                    </div>
                    <span className="font-semibold">{fundStats?.treesPlanted || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Community Members</span>
                    </div>
                    <span className="font-semibold">{(fundStats?.donorCount || 0) * 3}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Projects Supported</span>
                    </div>
                    <span className="font-semibold">{fundStats?.projectsSupported || 0}</span>
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
