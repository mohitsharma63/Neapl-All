
import { useState } from "react";
import { Home as HomeIcon, Factory } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import Footer from "@/components/footer";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";

export default function IndustrialLand() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "sale",
  });

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "sale" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-industrial-land">
      <Header />
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSaveSearch={handleSaveSearch}
        onClearFilters={handleClearFilters}
      />

      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              <HomeIcon className="w-4 h-4" />
            </Link>
            <span>{'>'}</span>
            <span className="text-foreground font-medium">Industrial Land</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">
            Factory & Industrial Land
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Factory className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Industrial Land & Factories</h3>
          <p className="text-muted-foreground mb-6">
            Find industrial plots, factory spaces, and warehouses for lease or sale
          </p>
          <p className="text-sm text-muted-foreground">
            This section is coming soon with industrial property listings
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
