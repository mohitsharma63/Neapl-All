import { useState } from "react";
import { Home as HomeIcon, Building, Globe, Bus, Users, GraduationCap, List, Map } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import PropertyCard from "@/components/property-card";
import FeaturedBanner from "@/components/featured-banner";
import StatsSection from "@/components/stats-section";
import GlobalPropertiesSection from "@/components/global-properties";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";

const PROPERTY_CATEGORIES = [
  { icon: HomeIcon, label: "Residential", href: "/properties?category=residential", isActive: true },
  { icon: Building, label: "Commercial", href: "/properties?category=commercial", isActive: false },
  { icon: Globe, label: "International", href: "/properties?category=international", isActive: false },
  { icon: Bus, label: "Agents", href: "/agents", isActive: false },
  { icon: Users, label: "Agencies", href: "/agencies", isActive: false },
  { icon: GraduationCap, label: "Schools", href: "/schools", isActive: false },
];

export default function Home() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });

  const { data: featuredProperties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Header />
      
      {/* Property Categories */}
      <section className="bg-white border-b" data-testid="property-categories">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 py-4">
            {PROPERTY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.label}
                  href={category.href}
                  className={`flex flex-col items-center space-y-2 pb-2 ${
                    category.isActive
                      ? "text-accent border-b-2 border-accent"
                      : "text-muted-foreground hover:text-foreground transition-colors"
                  }`}
                  data-testid={`link-category-${category.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSaveSearch={handleSaveSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Breadcrumb Navigation */}
      <section className="bg-white py-4 border-b" data-testid="breadcrumb-navigation">
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
            <span className="text-foreground font-medium">Residential</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Properties for Rent in Qatar ({featuredProperties.length} results)
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
      </section>

      <FeaturedBanner />

      {/* Property Listings */}
      <section className="container mx-auto px-4 py-8" data-testid="property-listings">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Property Listings */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Loading featured properties...</div>
                </div>
              ) : featuredProperties.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No featured properties available at the moment.</p>
                  <Link href="/properties">
                    <Button className="mt-4">Browse All Properties</Button>
                  </Link>
                </div>
              ) : (
                featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              )}
            </div>
          </div>

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
                  <h3 className="text-xl font-bold mb-4" data-testid="text-promo-title-2">Home with Qatar</h3>
                  <h3 className="text-xl font-bold mb-6" data-testid="text-promo-title-3">Living Properties!</h3>
                  <div className="text-right text-orange-300 font-bold text-lg" dir="rtl" data-testid="text-promo-arabic">
                    ابحث عن منزلك<br />
                    القادم مع قطر<br />
                    ليفينج للعقارات!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />
      <GlobalPropertiesSection />
      <FAQSection />
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
