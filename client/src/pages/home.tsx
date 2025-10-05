import { useState } from "react";
import { Home as HomeIcon, Building, Globe, Bus, Users, GraduationCap, List, Map, Building2, MapPin, Briefcase, Settings } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import FeaturedBanner from "@/components/featured-banner";
import StatsSection from "@/components/stats-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const iconMap: Record<string, any> = {
  'home': Home,
  'building': Building2,
  'map-pin': MapPin,
  'briefcase': Briefcase,
  'users': Users,
  'graduation-cap': GraduationCap,
  'settings': Settings,
};

// Helper function to cast JSON properties to the Property type
function castToProperty(data: any): Property {
  return {
    ...data,
    // Explicitly cast date strings to Date objects, handle nulls
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    // Ensure numeric fields are numbers, handle potential nulls from schema
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    // Ensure price and area are parsed as numbers (or handle as per schema, assuming decimal/float for now)
    price: parseFloat(data.price) || 0,
    area: parseFloat(data.area) || 0,
    // Ensure other potentially nullable fields are handled
    locationId: data.locationId ?? null,
    categoryId: data.categoryId ?? null,
    agencyId: data.agencyId ?? null,
    furnishingStatus: data.furnishingStatus ?? "unfurnished", // Default if not present
    availabilityStatus: data.availabilityStatus ?? "available", // Default if not present
  };
}


export default function Home() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });
  const [activeCategory, setActiveCategory] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Static data instead of API call, cast to Property type

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Header />

      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSaveSearch={handleSaveSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Breadcrumb Navigation */}
      {/* <section className="bg-white py-4 border-b" data-testid="breadcrumb-navigation">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-home">
              <HomeIcon className="w-4 h-4" />
            </Link>
            <span>{'>'}</span>
            <Link href="/properties" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-properties">
              Properties
            </Link>
            <span>{'>'}</span>
            <span className="text-foreground font-medium">
              {categories.find(cat => cat.id === activeCategory)?.name || 'Residential'}
            </span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              {categories.find(cat => cat.id === activeCategory)?.name || 'Properties'} ({featuredProperties.length} results)
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Button variant="outline" size="sm" data-testid="button-view-list">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" data-testid="button-view-map">
                  <Map className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="px-3 py-2 border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white" data-testid="select-sort">
                  <option>Default</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <FeaturedBanner />

      {/* Property Listings */}
      <section className="container mx-auto px-4 py-8" data-testid="property-listings">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Property Listings */}
          {/* <div className="lg:col-span-2">
            <div className="space-y-6">
              {featuredProperties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-border">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <HomeIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">कुनै सम्पत्ति फेला परेन</h3>
                    <p className="text-gray-600 mb-6">हाल कुनै विशेष सम्पत्तिहरू उपलब्ध छैनन्।</p>
                    <Link href="/properties">
                      <Button className="bg-primary hover:bg-primary/90">सबै सम्पत्तिहरू हेर्नुहोस्</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
           
                </>
              )}
            </div>
          </div> */}

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-8" data-testid="property-promotion-card">
              <div
                className="relative h-64 bg-gradient-to-br from-orange-400 to-pink-500"
                style={{
                  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
                  <h3 className="text-xl font-bold mb-2" data-testid="text-promo-title-1">Find Your Next</h3>
                  <h3 className="text-xl font-bold mb-4" data-testid="text-promo-title-2">Home with Jeevika</h3>
                  <h3 className="text-xl font-bold mb-6" data-testid="text-promo-title-3">Services Properties!</h3>
                  <div className="text-right text-orange-300 font-bold text-lg" data-testid="text-promo-nepali">
                    तपाईंको अर्को घर<br />
                    जीविका सेवाको साथ<br />
                    फेला पार्नुहोस्!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />
a      <FAQSection />
      <Footer />

      {/* Back to Top Button */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        data-testid="button-back-to-top"
      >
        ↑
      </button>
    </div>
  );
}