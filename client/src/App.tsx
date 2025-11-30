import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import "./lib/i18n";
import { Footer } from "@/components/Footer";
import EcoChatbot from "@/components/EcoChatbot";
import Home from "@/pages/Home";
import Awareness from "@/pages/Awareness";
import GreenRewards from "@/pages/GreenRewards";
import SupportUs from "@/pages/SupportUs";
import AboutUs from "@/pages/AboutUs";
import VendorDirectory from "@/pages/VendorDirectory";
import FundTransparency from "@/pages/FundTransparency";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/awareness" component={Awareness} />
      <Route path="/green-rewards" component={GreenRewards} />
      <Route path="/support-us" component={SupportUs} />
      <Route path="/about" component={AboutUs} />
      <Route path="/vendors" component={VendorDirectory} />
      <Route path="/transparency" component={FundTransparency} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <EcoChatbot />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
