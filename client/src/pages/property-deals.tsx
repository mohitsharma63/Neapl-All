
import { useState } from "react";
import { Home as HomeIcon, Building, MapPin, Bed, Bath } from "lucide-react";
import { Link, useParams } from "wouter";
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

export default function PropertyDeals() {
  const params = useParams();
  const slug = params.slug;
  
  console.log("PropertyDeals - slug:", slug);
  console.log("PropertyDeals - params:", params);
  
  // Map slug to page type and title
  const getPageInfo = () => {
    if (!slug) {
      return { priceType: "sale", title: "Property Deals (Buy/Sell)", breadcrumb: "Property Deals (Buy/Sell)" };
    }
    
    // Decode URL-encoded slug (e.g., "Property%20Deals%20(Buy/Sell)" -> "Property Deals (Buy/Sell)")
    const decodedSlug = decodeURIComponent(slug);
    const slugLower = decodedSlug.toLowerCase();
    
    // Map common slugs to their display names (kebab-case format)
    const slugMap: Record<string, { priceType: string; title: string; breadcrumb: string }> = {
      "property-deals": { priceType: "sale", title: "Property Deals (Buy/Sell)", breadcrumb: "Property Deals (Buy/Sell)" },
      "rental-properties": { priceType: "rent", title: "Rental Properties", breadcrumb: "Rental Properties" },
      "hostels-pg": { priceType: "rent", title: "Hostels & PG", breadcrumb: "Hostels & PG" },
      "commercial-property": { priceType: "sale", title: "Commercial Property", breadcrumb: "Commercial Property" },
      "office-space": { priceType: "rent", title: "Office Space", breadcrumb: "Office Space" },
      "industrial-land": { priceType: "sale", title: "Industrial Land", breadcrumb: "Industrial Land" },
      "construction-materials": { priceType: "sale", title: "Construction Materials", breadcrumb: "Construction Materials" },
    };
    
    // Also map full names (for URL-encoded names)
    const nameMap: Record<string, { priceType: string; title: string; breadcrumb: string }> = {
      "property deals (buy/sell)": { priceType: "sale", title: "Property Deals (Buy/Sell)", breadcrumb: "Property Deals (Buy/Sell)" },
      "rental properties": { priceType: "rent", title: "Rental Properties", breadcrumb: "Rental Properties" },
      "hostels & pg": { priceType: "rent", title: "Hostels & PG", breadcrumb: "Hostels & PG" },
      "commercial property": { priceType: "sale", title: "Commercial Property", breadcrumb: "Commercial Property" },
      "office space": { priceType: "rent", title: "Office Space", breadcrumb: "Office Space" },
      "industrial land": { priceType: "sale", title: "Industrial Land", breadcrumb: "Industrial Land" },
      "construction materials": { priceType: "sale", title: "Construction Materials", breadcrumb: "Construction Materials" },
    };
    
    // Check kebab-case slugs first, then full names
    if (slugMap[slugLower]) {
      return slugMap[slugLower];
    }
    
    if (nameMap[slugLower]) {
      return nameMap[slugLower];
    }
    
    // Default fallback
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const priceType = slugLower.includes("rental") || slugLower.includes("rent") || slugLower.includes("hostel") || slugLower.includes("pg") ? "rent" : "sale";
    
    return { priceType, title, breadcrumb: title };
  };
  
  const pageInfo = getPageInfo();
  
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: pageInfo.priceType as "rent" | "sale",
  });

  // Update filters when pageInfo changes
  useState(() => {
    setFilters(prev => ({ ...prev, priceType: pageInfo.priceType as "rent" | "sale" }));
  });

  const properties: Property[] = propertiesData
    .map(castToProperty)
    .filter(p => {
      // For rent subcategories, show monthly/yearly rentals
      if (pageInfo.priceType === "rent") {
        return p.priceType === "monthly" || p.priceType === "yearly";
      }
      // For sale subcategories, show sale properties
      return p.priceType === "sale";
    });

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "sale" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-property-deals">
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
            <span className="text-foreground font-medium">{pageInfo.breadcrumb}</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">
            {pageInfo.title} in Nepal ({properties.length} listings)
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
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
