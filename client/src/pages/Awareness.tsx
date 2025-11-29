import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { impactComparisons } from "@/lib/data";
import {
  Car,
  Plane,
  Smartphone,
  Factory,
  Lightbulb,
  TreeDeciduous,
  ArrowRight,
  Leaf,
  AlertTriangle,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { Link } from "wouter";

const iconMap: Record<string, typeof Car> = {
  Car,
  Plane,
  Smartphone,
  Factory,
  Lightbulb,
  Beef: AlertTriangle,
};

export default function Awareness() {
  const [kmPerYear, setKmPerYear] = useState([15000]);
  const co2Emissions = (kmPerYear[0] * 0.12).toFixed(0);
  const treesNeeded = Math.ceil(Number(co2Emissions) / 21);
  const monthsToOffset = Math.ceil(treesNeeded * 2);

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white/90">Understanding Our Impact</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Environmental Impact
              <span className="block text-green-400">Awareness</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed">
              Understanding the environmental consequences of our daily activities is the first 
              step toward positive change. Discover how trees and plants can help offset our 
              carbon footprint and restore balance to our ecosystem.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Impact Calculator</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Calculate Your Driving Impact
              </h2>
              <p className="text-muted-foreground mb-8">
                See how many trees you need to plant to offset the carbon emissions 
                from your annual driving. Adjust the slider to match your driving habits.
              </p>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium">
                      Kilometers driven per year
                    </label>
                    <span className="text-2xl font-bold text-primary">
                      {kmPerYear[0].toLocaleString()} km
                    </span>
                  </div>
                  <Slider
                    value={kmPerYear}
                    onValueChange={setKmPerYear}
                    max={50000}
                    min={1000}
                    step={500}
                    className="mb-2"
                    data-testid="slider-km"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1,000 km</span>
                    <span>50,000 km</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-6 text-center">
                  <Car className="h-10 w-10 text-destructive mx-auto mb-4" />
                  <div className="text-3xl font-bold text-destructive mb-1">
                    {Number(co2Emissions).toLocaleString()} kg
                  </div>
                  <div className="text-sm text-muted-foreground">
                    CO2 Emissions per Year
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <TreeDeciduous className="h-10 w-10 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-1">
                    {treesNeeded} trees
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Needed to Offset
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{monthsToOffset} months</div>
                      <div className="text-sm text-muted-foreground">
                        of tree oxygen production needed to offset 1 year of driving
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Environmental Impact Comparisons
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding these equivalencies helps us make better choices and 
              appreciate the vital role of trees in our ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactComparisons.map((comparison) => {
              const IconComponent = iconMap[comparison.icon] || AlertTriangle;
              return (
                <Card 
                  key={comparison.id} 
                  className="group hover-elevate"
                  data-testid={`card-comparison-${comparison.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-destructive" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TreeDeciduous className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {comparison.source}
                        </div>
                        <div className="font-semibold text-destructive">
                          {comparison.sourceAmount}
                        </div>
                      </div>

                      <div className="text-2xl font-bold text-center py-2">=</div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Trees Required
                        </div>
                        <div className="font-semibold text-primary">
                          {comparison.targetAmount}
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                      {comparison.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                The Power of a Single Tree
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Oxygen Production</h3>
                    <p className="text-sm text-muted-foreground">
                      A mature tree produces enough oxygen for 2-4 people annually and absorbs about 21 kg of CO2 per year.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Air Purification</h3>
                    <p className="text-sm text-muted-foreground">
                      Trees filter pollutants, dust, and particulate matter, improving air quality in urban areas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Temperature Regulation</h3>
                    <p className="text-sm text-muted-foreground">
                      Trees can reduce surrounding temperatures by up to 8°C through shade and evapotranspiration.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Biodiversity Support</h3>
                    <p className="text-sm text-muted-foreground">
                      A single tree can be home to hundreds of species of insects, birds, and small animals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-card">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <TreeDeciduous className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Take Action Today</h3>
                  <p className="text-muted-foreground">
                    Every tree you plant makes a real difference. Join our GreenRewards 
                    program and earn points while helping the environment.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link href="/green-rewards">
                    <Button className="w-full" size="lg" data-testid="button-awareness-join">
                      <TreeDeciduous className="mr-2 h-5 w-5" />
                      Join GreenRewards
                    </Button>
                  </Link>
                  <Link href="/support-us">
                    <Button variant="outline" className="w-full" size="lg" data-testid="button-awareness-support">
                      Support Our Mission
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
