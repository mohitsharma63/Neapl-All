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
  { id: "residential", icon: HomeIcon, label: "आवासीय | Residential", href: "/properties?category=residential" },
  { id: "commercial", icon: Building, label: "व्यावसायिक | Commercial", href: "/properties?category=commercial" },
  { id: "international", icon: Globe, label: "अन्तर्राष्ट्रिय | International", href: "/properties?category=international" },
  { id: "agents", icon: Bus, label: "एजेन्टहरू | Agents", href: "/agents" },
  { id: "agencies", icon: Users, label: "एजेन्सीहरू | Agencies", href: "/agencies" },
  { id: "schools", icon: GraduationCap, label: "विद्यालयहरू | Schools", href: "/schools" },
];

export default function Home() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });
  const [activeCategory, setActiveCategory] = useState<string>("residential");

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
      <section className="bg-white border-b shadow-sm" data-testid="property-categories">
        <div className="container mx-auto px-4">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto py-4">
            <div className="flex space-x-6 min-w-max px-2">
              {PROPERTY_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Link href={category.href} key={category.label}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex flex-col items-center space-y-2 pb-2 px-3 py-2 rounded-lg min-w-0 whitespace-nowrap transition-all duration-200 ${
                        activeCategory === category.id
                          ? "bg-accent/10 text-accent border-2 border-accent/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                      }`}
                      data-testid={`button-category-${category.label.toLowerCase()}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium leading-tight text-center">
                        {category.label.split(' | ')[0]}
                      </span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:flex items-center justify-center space-x-8 py-6">
            {PROPERTY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link href={category.href} key={category.label}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex flex-col items-center space-y-3 pb-3 px-4 py-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
                      activeCategory === category.id
                        ? "text-accent border-b-3 border-accent bg-accent/5 shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-50 hover:shadow-md"
                    }`}
                    data-testid={`button-category-${category.label.toLowerCase()}`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium text-sm text-center leading-tight">
                      {category.label}
                    </span>
                  </button>
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
            <span className="text-foreground font-medium">
              {PROPERTY_CATEGORIES.find(cat => cat.id === activeCategory)?.label.split(' | ')[1] || 'Residential'}
            </span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              {activeCategory === 'residential' ? 'Properties for Rent in Nepal' :
               activeCategory === 'commercial' ? 'Commercial Properties in Nepal' :
               activeCategory === 'international' ? 'International Properties' :
               activeCategory === 'agents' ? 'Real Estate Agents in Nepal' :
               activeCategory === 'agencies' ? 'Real Estate Agencies in Nepal' :
               'Schools in Nepal'} ({featuredProperties.length} results)
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
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm animate-pulse">
                      <div className="h-64 bg-gray-200"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : featuredProperties.length === 0 ? (
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
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">विशेष सम्पत्तिहरू</h2>
                    <p className="text-gray-600">नेपालका उत्कृष्ट घर र जग्गाहरू</p>
                  </div>
                  {featuredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </>
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