import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, List, Map } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";

export default function Properties() {
  const [location, setLocation] = useLocation();
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });

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

  // Build query parameters from filters
  const buildQueryParams = (filters: SearchFiltersType) => {
    const params = new URLSearchParams();
    
    if (filters.locationId) params.set('locationId', filters.locationId);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.priceType) params.set('priceType', filters.priceType);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties${buildQueryParams(filters)}`],
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
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-lg">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
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
