
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, List, Map, Building, Globe, Bus, Users, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import propertiesData from "@/data/properties.json";

const PROPERTY_CATEGORIES = [
  { id: "residential", icon: HomeIcon, label: "आवासीय | Residential", href: "/properties?category=residential" },
  { id: "commercial", icon: Building, label: "व्यावसायिक | Commercial", href: "/properties?category=commercial" },
  { id: "international", icon: Globe, label: "अन्तर्राष्ट्रिय | International", href: "/properties?category=international" },
  { id: "agents", icon: Bus, label: "एजेन्टहरू | Agents", href: "/agents" },
  { id: "agencies", icon: Users, label: "एजेन्सीहरू | Agencies", href: "/agencies" },
  { id: "schools", icon: GraduationCap, label: "विद्यालयहरू | Schools", href: "/schools" },
];

export default function Properties() {
  const [location, setLocation] = useLocation();
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });
  const [activeCategory, setActiveCategory] = useState<string>("residential");

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    const locationParam = urlParams.get("location");
    const typeParam = urlParams.get("type");

    setFilters(prev => ({
      ...prev,
      ...(categoryParam && { categoryId: categoryParam }),
      ...(locationParam && { locationId: locationParam }),
      ...(typeParam && { propertyType: typeParam }),
    }));
  }, [location]);

  // Static data instead of API call with filtering
  const properties: Property[] = propertiesData.filter(property => {
    let matches = true;
    
    if (filters.categoryId && property.categoryId !== filters.categoryId) {
      matches = false;
    }
    
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      matches = false;
    }
    
    if (filters.bedrooms && property.bedrooms !== filters.bedrooms) {
      matches = false;
    }
    
    if (filters.minPrice && parseInt(property.price) < filters.minPrice) {
      matches = false;
    }
    
    if (filters.maxPrice && parseInt(property.price) > filters.maxPrice) {
      matches = false;
    }
    
    return matches;
  });

  // Update URL when filters change
  const updateUrlWithFilters = (newFilters: SearchFiltersType) => {
    const params = new URLSearchParams();
    
    if (newFilters.locationId) params.set('locationId', newFilters.locationId);
    if (newFilters.categoryId) params.set('categoryId', newFilters.categoryId);
    if (newFilters.propertyType) params.set('propertyType', newFilters.propertyType);
    if (newFilters.priceType && newFilters.priceType !== 'rent') params.set('priceType', newFilters.priceType);
    if (newFilters.bedrooms) params.set('bedrooms', newFilters.bedrooms.toString());
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    
    const queryString = params.toString();
    const newUrl = queryString ? `/properties?${queryString}` : '/properties';
    setLocation(newUrl);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    updateUrlWithFilters(newFilters);
  };

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { priceType: "rent" };
    setFilters(clearedFilters);
    updateUrlWithFilters(clearedFilters);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-properties">
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
            <span className="text-foreground font-medium">Search Results</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Properties ({properties.length} results)
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

      {/* Property Listings */}
      <section className="container mx-auto px-4 py-8" data-testid="property-listings">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No properties found matching your criteria.</p>
            <p className="text-muted-foreground mb-8">Try adjusting your search filters or browse all properties.</p>
            <div className="space-x-4">
              <Button onClick={handleClearFilters} data-testid="button-clear-search">
                Clear Filters
              </Button>
              <Link href="/">
                <Button variant="outline" data-testid="button-browse-all">
                  Browse All Properties
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

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
