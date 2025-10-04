import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import PropertyDeals from "@/pages/property-deals";
import RentalProperties from "@/pages/rental-properties";
import HostelsPG from "@/pages/hostels-pg";
import ConstructionMaterials from "@/pages/construction-materials";
import CommercialProperty from "@/pages/commercial-property";
import IndustrialLand from "@/pages/industrial-land";
import OfficeSpace from "@/pages/office-space";
import Agents from "@/pages/agents";
import Agencies from "@/pages/agencies";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={Home} />
      <Route path="/subcategory/:slug">{(params) => <PropertyDeals />}</Route>
      <Route path="/property-deals" component={PropertyDeals} />
      <Route path="/rental" component={RentalProperties} />
      <Route path="/hostels-pg" component={HostelsPG} />
      <Route path="/construction-materials" component={ConstructionMaterials} />
      <Route path="/commercial" component={CommercialProperty} />
      <Route path="/industrial" component={IndustrialLand} />
      <Route path="/office-space" component={OfficeSpace} />
      <Route path="/agents" component={Agents} />
      <Route path="/agencies" component={Agencies} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;