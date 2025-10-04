
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Home as HomeIcon, MapPin, Filter, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/property-card";
import SearchFilters from "@/components/search-filters";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { PropertyWithRelations, SearchFilters as Filters } from "@/lib/types";
import { useState } from "react";

export default function SubcategoryPage() {
  const params = useParams();
  const subcategoryName = params.name ? decodeURIComponent(params.name) : "";
  const [filters, setFilters] = useState<Filters>({
    priceType: "sale"
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: properties = [] } = useQuery<PropertyWithRelations[]>({
    queryKey: ["/api/properties"],
  });

  // Filter properties based on subcategory and filters
  const filteredProperties = properties.filter((property) => {
    let matches = true;

    // Filter by price type for Property Deals
    if (filters.priceType && property.priceType !== filters.priceType) {
      matches = false;
    }

    // Apply other filters
    if (filters.locationId && property.locationId !== filters.locationId) {
      matches = false;
    }

    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      matches = false;
    }

    if (filters.bedrooms && property.bedrooms && property.bedrooms < parseInt(filters.bedrooms.toString())) {
      matches = false;
    }

    if (filters.minPrice && parseFloat(property.price) < filters.minPrice) {
      matches = false;
    }

    if (filters.maxPrice && parseFloat(property.price) > filters.maxPrice) {
      matches = false;
    }

    return matches;
  });

  const handleSaveSearch = () => {
    console.log("Saving search with filters:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "sale" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 border-b">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span>{'>'}</span>
            <Link href="/properties" className="hover:text-foreground transition-colors">
              Properties
            </Link>
            <span>{'>'}</span>
            <span className="text-foreground font-medium">{subcategoryName}</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </Link>
                <Badge variant="secondary" className="text-sm">
                  {filteredProperties.length} Properties
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {subcategoryName}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover the best property deals for buying and selling in Nepal. 
                Browse through verified listings with competitive prices.
              </p>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <LayoutList className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSaveSearch={handleSaveSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Stats Bar */}
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">All Locations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {Object.keys(filters).filter(key => filters[key as keyof Filters]).length} Active Filters
                </span>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid/List */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to see more results
              </p>
              <Button onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
                </p>
              </div>

              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
