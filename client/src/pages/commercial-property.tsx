
import { useState } from "react";
import { Home as HomeIcon, Hammer, Package } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import Footer from "@/components/footer";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";

export default function ConstructionMaterials() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-construction-materials">
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
            <span className="text-foreground font-medium">Construction & Building Materials</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">
            Construction & Building Materials
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Hammer className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Building Materials Marketplace</h3>
          <p className="text-muted-foreground mb-6">
            Find quality construction materials, suppliers, and contractors
          </p>
          <p className="text-sm text-muted-foreground">
            This section is coming soon with verified suppliers and materials
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
