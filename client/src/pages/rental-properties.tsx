
import { useState } from "react";
import { Home as HomeIcon, Building } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import propertiesData from "@/data/properties.json";

function castToProperty(data: any): Property {
  return {
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    price: parseFloat(data.price) || 0,
    area: parseFloat(data.area) || 0,
    locationId: data.locationId ?? null,
    categoryId: data.categoryId ?? null,
    agencyId: data.agencyId ?? null,
    furnishingStatus: data.furnishingStatus ?? "unfurnished",
    availabilityStatus: data.availabilityStatus ?? "available",
  };
}

export default function RentalProperties() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });

  const properties: Property[] = propertiesData
    .map(castToProperty)
    .filter(p => p.priceType === "monthly" || p.priceType === "yearly");

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-rental-properties">
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
            <span className="text-foreground font-medium">Rental Properties</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">
            Rooms, Flats & Apartments for Rent ({properties.length} listings)
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No rental properties found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
              <Button onClick={handleClearFilters}>Clear Filters</Button>
            </div>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
