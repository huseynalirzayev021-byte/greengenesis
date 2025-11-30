import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vendor } from "@shared/schema";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  CheckCircle,
  TreeDeciduous,
  Leaf,
} from "lucide-react";

const vendorFormSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Please provide a brief description"),
  address: z.string().min(5, "Please provide a valid address"),
  phone: z.string().min(7, "Please provide a contact number"),
  email: z.string().email("Please provide a valid email"),
  website: z.string().url("Please provide a valid website URL").optional().or(z.literal("")),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

export default function VendorDirectory() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const registerVendorMutation = useMutation({
    mutationFn: async (data: VendorFormValues) => {
      return apiRequest("POST", "/api/vendors", {
        ...data,
        website: data.website || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({
        title: t("toasts.vendorRegistered"),
        description: t("toasts.vendorRegisteredDesc"),
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("toasts.vendorRegistrationError"),
        description: t("toasts.tryAgainLater"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VendorFormValues) => {
    registerVendorMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Store className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/90">{t("vendors.heroBadge")}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("vendors.heroTitle")}
              <span className="block text-green-400">{t("vendors.heroTitleHighlight")}</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              {t("vendors.heroDescription")}
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                  <Plus className="mr-2 h-5 w-5" />
                  {t("vendors.registerBusiness")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5 text-primary" />
                    {t("vendors.registrationTitle")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("vendors.registrationDesc")}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("vendors.businessName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("vendors.businessNamePlaceholder")} {...field} data-testid="input-vendor-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("vendors.description")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("vendors.descriptionPlaceholder")} 
                              className="resize-none"
                              {...field} 
                              data-testid="input-vendor-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("vendors.address")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("vendors.addressPlaceholder")} {...field} data-testid="input-vendor-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("vendors.contactPhone")}</FormLabel>
                            <FormControl>
                              <Input placeholder="+994 12 345 6789" {...field} data-testid="input-vendor-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("vendors.contactEmail")}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="info@business.az" {...field} data-testid="input-vendor-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("vendors.website")}</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourbusiness.az" {...field} data-testid="input-vendor-website" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerVendorMutation.isPending}
                      data-testid="button-submit-vendor"
                    >
                      {registerVendorMutation.isPending ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Partner Vendors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Shop at these approved vendors to earn reward points on your eco-friendly purchases.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading vendors...
            </div>
          ) : vendors && vendors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="hover-elevate" data-testid={`card-vendor-${vendor.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Leaf className="h-7 w-7 text-primary" />
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    {vendor.description && (
                      <CardDescription className="line-clamp-2">
                        {vendor.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vendor.address && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{vendor.address}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{vendor.email}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={vendor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Vendors Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to register as a partner vendor!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Register Now
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Join Our Network?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              If you own a nursery, flower shop, or plant business in Azerbaijan, 
              register to become a partner vendor. Help us make Azerbaijan greener 
              while growing your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Increased visibility</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Access to eco-conscious customers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Support environmental initiatives</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
