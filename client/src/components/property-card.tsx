import { Heart, Bed, Bath, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Property, Agency, Location } from "@shared/schema";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property & {
    location?: Location;
    agency?: Agency;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString();
  };

  const getPriceLabel = () => {
    switch (property.priceType) {
      case "monthly":
        return "QAR/month";
      case "yearly":
        return "QAR/year";
      case "sale":
        return "QAR";
      default:
        return "QAR";
    }
  };

  const getBedroomDisplay = () => {
    if (!property.bedrooms) return "Studio";
    return property.bedrooms.toString();
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";

  return (
    <div 
      className="property-card bg-card border border-border rounded-xl overflow-hidden shadow-sm" 
      data-testid={`card-property-${property.id}`}
    >
      <div className="relative">
        {property.isFeatured && (
          <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium z-10">
            <i className="fas fa-star mr-1"></i>Featured
          </span>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10" data-testid={`button-favorite-${property.id}`}>
          <Heart className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="relative h-48 bg-muted">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
            data-testid={`img-property-${property.id}`}
          />
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            1/{property.images?.length || 1}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-title-${property.id}`}>
              {property.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {property.furnishingStatus && (
                <Badge 
                  variant={property.furnishingStatus === "furnished" ? "default" : "secondary"}
                  data-testid={`badge-furnishing-${property.id}`}
                >
                  {property.furnishingStatus}
                </Badge>
              )}
              {property.availabilityStatus === "available" && (
                <Badge variant="secondary" className="bg-green-100 text-green-700" data-testid={`badge-availability-${property.id}`}>
                  Available
                </Badge>
              )}
              {property.isNegotiable && (
                <Badge variant="secondary" className="bg-green-100 text-green-700" data-testid={`badge-negotiable-${property.id}`}>
                  Negotiable
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground" data-testid={`text-price-${property.id}`}>
              {formatPrice(property.price)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {getPriceLabel()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground" data-testid={`text-specs-${property.id}`}>
            <span>
              <Bed className="w-4 h-4 mr-1 inline" />
              {getBedroomDisplay()}
            </span>
            {property.bathrooms && (
              <span>
                <Bath className="w-4 h-4 mr-1 inline" />
                {property.bathrooms}
              </span>
            )}
            {property.location && (
              <span>
                <MapPin className="w-4 h-4 mr-1 inline" />
                {property.location.area || property.location.name}
              </span>
            )}
          </div>
          <Link href={`/properties/${property.id}`}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid={`button-view-details-${property.id}`}>
              View Details
            </Button>
          </Link>
        </div>
        
        {property.agency && (
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground" data-testid={`text-agency-${property.id}`}>
              By{" "}
              <span className="text-primary font-medium">
                {property.agency.name}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
