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
import { Card, CardContent } from "@/components/ui/card";
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


      {/* Welcome Section */}
      <section className="container mx-auto px-4 py-12">
        

        {/* Quick Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Link href="/categories">
              <Button variant="outline" size="sm">View All Categories</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category: any) => {
              const Icon = iconMap[category.icon] || Settings;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group"
                >
                  <div className="nepali-card p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-h-[140px]">
                    <div 
                      className="w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: category.color }} />
                    </div>
                    <h3 className="font-semibold text-xs leading-tight line-clamp-2">{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="nepali-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Popular Services</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.slice(0, 4).map((category: any) => {
                    const Icon = iconMap[category.icon] || Settings;
                    return (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: category.color }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.subcategories?.length || 0} subcategories
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg mb-6" data-testid="property-promotion-card">
              <div
                className="relative h-80 bg-gradient-to-br from-orange-400 to-pink-500"
                style={{
                  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
                  <h3 className="text-2xl font-bold mb-2" data-testid="text-promo-title-1">Find Your Next</h3>
                  <h3 className="text-2xl font-bold mb-4" data-testid="text-promo-title-2">Home with Jeevika</h3>
                  <h3 className="text-xl font-bold mb-6" data-testid="text-promo-title-3">Services Properties!</h3>
                  <div className="text-center text-orange-200 font-bold text-lg" data-testid="text-promo-nepali">
                    तपाईंको अर्को घर<br />
                    जीविका सेवाको साथ<br />
                    फेला पार्नुहोस्!
                  </div>
                  <Button className="mt-6 bg-white text-primary hover:bg-white/90">
                    Get Started
                  </Button>
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