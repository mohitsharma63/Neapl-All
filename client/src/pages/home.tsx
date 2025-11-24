import { useState } from "react";
import { 
  Home as HomeIcon, 
  Building, 
  Globe, 
  Bus, 
  Users, 
  GraduationCap, 
  List, 
  Map, 
  Building2, 
  MapPin, 
  Briefcase, 
  Settings,
  Laptop,
  Smartphone,
  Shirt,
  Sofa,
  Car,
  BookOpen,
  Monitor,
  Sparkles,
  Home as House
} from "lucide-react";
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
  'home': HomeIcon,
  'building': Building,
  'building2': Building2,
  'globe': Globe,
  'bus': Bus,
  'users': Users,
  'graduation-cap': GraduationCap,
  'list': List,
  'map': Map,
  'map-pin': MapPin,
  'briefcase': Briefcase,
  'settings': Settings,
  'laptop': Laptop,
  'smartphone': Smartphone,
  'shirt': Shirt,
  'sofa': Sofa,
  'car': Car,
  'book-open': BookOpen,
  'monitor': Monitor,
  'sparkles': Sparkles,
  'house': House,
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
        

        {/* Horizontal Category Navigation - Clean & Luxury */}
        <div className="mb-10">
          {/* Top Category Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 px-6 py-4 min-w-max">
                {categories.map((category: any) => {
                  const Icon = iconMap[category.icon] || Settings;
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(isActive ? "" : category.id)}
                      className={`flex flex-col items-center justify-center px-8 py-4 min-w-[140px] rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                          : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                        isActive ? 'bg-white/20' : 'bg-white'
                      }`}>
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <span className="text-xs font-semibold text-center leading-tight">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Expanded Category View with Subcategories */}
          {activeCategory && (() => {
            const selectedCategory = categories.find((c: any) => c.id === activeCategory);
            if (!selectedCategory) return null;
            
            const Icon = iconMap[selectedCategory.icon] || Settings;
            const activeSubcategories = selectedCategory.subcategories?.filter((s: any) => s.isActive) || [];

            return (
              <div className="space-y-6">
                {/* Category Header - Luxury Design */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                  <div className="relative flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2 text-white">{selectedCategory.name}</h3>
                      {selectedCategory.description && (
                        <p className="text-white/90 text-sm mb-2">{selectedCategory.description}</p>
                      )}
                      <p className="text-xs text-white/70 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                        {activeSubcategories.length} subcategories available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subcategories Grid - Clean & Minimal */}
                {activeSubcategories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {activeSubcategories.map((subcategory: any) => {
                      const SubIcon = iconMap[subcategory.icon] || Icon;
                      return (
                        <Link
                          key={subcategory.id}
                          href={`/subcategory/${subcategory.slug}`}
                          className="group"
                        >
                          <div className="bg-white rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                              <SubIcon className="w-7 h-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                            </div>
                            <h4 className="font-semibold text-sm leading-tight text-gray-800 line-clamp-2">{subcategory.name}</h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">No subcategories available</p>
                  </div>
                )}
              </div>
            );
          })()}
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