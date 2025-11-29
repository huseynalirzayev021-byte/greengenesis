import { Link } from "wouter";
import { Sprout, Mail, MapPin, Phone } from "lucide-react";
import { partnerVendors } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">GreenGenesis</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A student-led initiative dedicated to environmental awareness and protection in Azerbaijan. Together, we can make our country greener.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                Home
              </Link>
              <Link href="/awareness" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-awareness">
                Environmental Awareness
              </Link>
              <Link href="/green-rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-rewards">
                GreenRewards Program
              </Link>
              <Link href="/support-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-support">
                Support Us
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                About Us
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Partner Vendors</h3>
            <div className="flex flex-col gap-2">
              {partnerVendors.slice(0, 4).map((vendor) => (
                <span key={vendor} className="text-sm text-muted-foreground">
                  {vendor}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Baku, Azerbaijan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@greengenesis.az</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+994 12 XXX XX XX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              2024 GreenGenesis. A student initiative for a greener future.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with care for our planet
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
