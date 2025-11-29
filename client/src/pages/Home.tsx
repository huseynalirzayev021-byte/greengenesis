import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEcoFacts } from "@/lib/data";
import {
  Leaf,
  TreeDeciduous,
  Mountain,
  Droplets,
  Bird,
  Flame,
  Wind,
  Fish,
  Recycle,
  Sun,
  ArrowRight,
  Heart,
  Users,
  Trees,
} from "lucide-react";

const iconMap: Record<string, typeof Leaf> = {
  Leaf,
  TreeDeciduous,
  Mountain,
  Droplets,
  Bird,
  Flame,
  Wind,
  Fish,
  Recycle,
  Sun,
};

export default function Home() {
  const { t } = useTranslation();
  const ecoFacts = useEcoFacts();

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Leaf className="h-4 w-4 text-green-400" />
            <span className="text-sm text-white/90">Environmental Initiative</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t("home.heroTitle")}
            <span className="block text-green-400">{t("home.heroTitleHighlight")}</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("home.heroDescription")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/green-rewards">
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-rewards">
                <TreeDeciduous className="mr-2 h-5 w-5" />
                {t("home.getStarted")}
              </Button>
            </Link>
            <Link href="/awareness">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                data-testid="button-hero-learn"
              >
                {t("home.learnMore")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Trees className="h-7 w-7 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">2,500+</div>
              <div className="text-sm text-muted-foreground">{t("home.treesPlanted")}</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">{t("home.activeMembers")}</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">15,000</div>
              <div className="text-sm text-muted-foreground">{t("home.fundsRaised")}</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">10</div>
              <div className="text-sm text-muted-foreground">Projects Active</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t("home.factsTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.factsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecoFacts.map((fact, index) => {
              const IconComponent = iconMap[fact.icon] || Leaf;
              return (
                <Card 
                  key={fact.id} 
                  className={`group hover-elevate transition-all duration-300 ${
                    index === 0 || index === 5 ? "md:row-span-2" : ""
                  }`}
                  data-testid={`card-fact-${fact.id}`}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      {fact.statistic && (
                        <span className="ml-auto text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {fact.statistic}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{fact.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {fact.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                {t("home.ctaTitle")}
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                {t("home.ctaDescription")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/green-rewards">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full sm:w-auto"
                  data-testid="button-cta-rewards"
                >
                  <TreeDeciduous className="mr-2 h-5 w-5" />
                  {t("home.plantTree")}
                </Button>
              </Link>
              <Link href="/support-us">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  data-testid="button-cta-donate"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {t("home.joinMovement")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
