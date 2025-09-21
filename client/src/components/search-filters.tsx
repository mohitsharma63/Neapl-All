import { MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { SearchFilters } from "@/lib/types";
import type { Location } from "@shared/schema";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSaveSearch?: () => void;
  onClearFilters?: () => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSaveSearch,
  onClearFilters,
}: SearchFiltersProps) {
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const updateFilter = (key: keyof SearchFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  return (
    <section className="bg-muted py-6" data-testid="search-filters">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Location Filter */}
            <div className="relative" data-testid="filter-location">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4" />
                <Select
                  value={filters.locationId || "all"}
                  onValueChange={(value) => updateFilter("locationId", value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="All Qatar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Qatar</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* For Rent/Sale Filter */}
            <div data-testid="filter-price-type">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                For Rent/Sale
              </label>
              <Select
                value={filters.priceType || "rent"}
                onValueChange={(value) => updateFilter("priceType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="For Rent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type Filter */}
            <div data-testid="filter-property-type">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Property Type
              </label>
              <Select
                value={filters.propertyType || "all"}
                onValueChange={(value) => updateFilter("propertyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Beds & Baths Filter */}
            <div data-testid="filter-bedrooms">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Beds & Baths
              </label>
              <Select
                value={filters.bedrooms?.toString() || "any"}
                onValueChange={(value) => updateFilter("bedrooms", value === "any" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div data-testid="filter-price">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Price
              </label>
              <Select
                value={
                  filters.minPrice && filters.maxPrice
                    ? `${filters.minPrice}-${filters.maxPrice}`
                    : "any"
                }
                onValueChange={(value) => {
                  if (value === "any") {
                    updateFilter("minPrice", undefined);
                    updateFilter("maxPrice", undefined);
                  } else {
                    const [min, max] = value.split("-");
                    updateFilter("minPrice", min);
                    updateFilter("maxPrice", max);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-2000">Under 2,000 QAR</SelectItem>
                  <SelectItem value="2000-5000">2,000 - 5,000 QAR</SelectItem>
                  <SelectItem value="5000-10000">5,000 - 10,000 QAR</SelectItem>
                  <SelectItem value="10000-999999">Above 10,000 QAR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* More Filters & Actions */}
            <div className="flex flex-col space-y-2" data-testid="filter-actions">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                data-testid="button-more-filters"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={onSaveSearch}
                  className="flex-1"
                  data-testid="button-save-search"
                >
                  Save Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="flex-1"
                  data-testid="button-clear-filters"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
