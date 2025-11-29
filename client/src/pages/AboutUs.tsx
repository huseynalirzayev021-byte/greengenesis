import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { teamMembers } from "@/lib/data";
import { Link } from "wouter";
import {
  Users,
  Heart,
  Target,
  Sparkles,
  TreeDeciduous,
  Mail,
  GraduationCap,
  Quote,
} from "lucide-react";

export default function AboutUs() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/90">Our Team</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Meet the Students
              <span className="block text-green-400">Behind EcoAzerbaijan</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed">
              We're a group of passionate students from different schools in Baku, 
              united by our commitment to environmental protection. Together, we're 
              working to create a greener, more sustainable Azerbaijan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
            <blockquote className="text-2xl lg:text-3xl font-medium mb-6 leading-relaxed">
              "We believe that young people have the power to create meaningful change. 
              Our generation will inherit this planet, and it's our responsibility to 
              protect it for future generations."
            </blockquote>
            <p className="text-muted-foreground">
              - The EcoAzerbaijan Team
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four students from Baku schools working together to make a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card 
                key={member.id} 
                className="group hover-elevate text-center"
                data-testid={`card-team-${member.id}`}
              >
                <CardContent className="pt-8 pb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">
                    {member.role}
                  </p>
                  
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
                    <GraduationCap className="h-3 w-3" />
                    <span>{member.school}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What drives us every day to work towards a greener Azerbaijan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Raise Awareness</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Educate our community about environmental challenges facing Azerbaijan 
                  and inspire action through engaging content and facts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <TreeDeciduous className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Encourage Action</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Make it easy and rewarding for people to take concrete steps 
                  like planting trees through our GreenRewards program.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Heart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Build Community</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create a community of environmentally conscious citizens who 
                  support each other in making sustainable choices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why We Started</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  EcoAzerbaijan began as a school project in 2024 when we realized 
                  that many of our peers didn't know about the environmental challenges 
                  facing our country. From the declining Caspian sturgeon population 
                  to increasing air pollution in Baku, we felt compelled to act.
                </p>
                <p>
                  What started as a simple awareness campaign has grown into a 
                  comprehensive platform that combines education, incentivized action, 
                  and community fundraising. We partnered with local plant nurseries 
                  to create our GreenRewards program, making tree planting not just 
                  environmentally beneficial but personally rewarding too.
                </p>
                <p>
                  Our goal is simple: to inspire our generation to take ownership 
                  of Azerbaijan's environmental future. We believe that small actions, 
                  when multiplied by thousands of people, can create massive change.
                </p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-8">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Join Our Movement</h3>
                  <p className="text-muted-foreground">
                    Whether you plant trees, donate, or simply spread the word - 
                    you can be part of creating a greener Azerbaijan.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/green-rewards">
                    <Button className="w-full" size="lg" data-testid="button-about-rewards">
                      <TreeDeciduous className="mr-2 h-5 w-5" />
                      Start Earning GreenRewards
                    </Button>
                  </Link>
                  <Link href="/support-us">
                    <Button variant="outline" className="w-full" size="lg" data-testid="button-about-donate">
                      <Heart className="mr-2 h-5 w-5" />
                      Support Our Fund
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
              <p className="text-muted-foreground mb-6">
                Have questions, suggestions, or want to partner with us? 
                We'd love to hear from you!
              </p>
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@ecoazerbaijan.az" className="hover:underline">
                  info@ecoazerbaijan.az
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
