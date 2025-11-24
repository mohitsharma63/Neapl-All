import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import Articles from "@/pages/articles";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin-dashboard";
import BuyerDashboard from "@/pages/buyer-dashboard";
import SellerDashboard from "@/pages/seller-dashboard";
import SubcategoryPage from "@/pages/subcategory";
import CategoryPage from "@/pages/category";
import NotFound from "@/pages/not-found";
import TuitionPrivateClasses from "@/pages/tuition-private-classes";
import TuitionClassDetail from "@/pages/tuition-class-detail"; // Assuming this component exists or will be created
import DanceKarateGymYoga from "@/pages/dance-karate-gym-yoga";
import LanguageClasses from "@/pages/language-classes";

import TuitionPrivateClassesPage from "./pages/tuition-private-classes-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/category/:categorySlug/subcategory/:subcategorySlug" component={SubcategoryPage} />
      <Route path="/subcategory/:name" component={SubcategoryPage} />
      <Route path="/:categorySlug/:id" component={TuitionClassDetail} /> {/* Dynamic route for tuition class detail */}

      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/buyer-dashboard" component={BuyerDashboard} />
      <Route path="/seller-dashboard" component={SellerDashboard} />
      <Route path="/blog" component={Blog} />
      <Route path="/articles" component={Articles} />
      <Route path="/about" component={About} />
      <Route path="/tuition-private-classes" component={TuitionPrivateClasses} />
      <Route path="/tuition-private-classes/:id" component={TuitionClassDetail} /> {/* Route for tuition class detail */}
      {/* <Route path="/category/:categorySlug/subcategory/TuitionPrivatClasses" component={TuitionPrivateClassesPage} /> */}
      <Route path="/dance-karate-gym-yoga" component={DanceKarateGymYoga} />
      <Route path="/language-classes" component={LanguageClasses} />
      
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