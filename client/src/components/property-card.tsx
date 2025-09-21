
import { Link } from "wouter";
import { Heart, MapPin, Bed, Bath, Home as HomeIcon, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Property } from "@shared/schema";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString();
  };

  const getPriceLabel = () => {
    switch (property.priceType) {
      case "monthly":
        return "QAR/महिना";
      case "yearly":
        return "QAR/वर्ष";
      case "sale":
        return "QAR";
      default:
        return "QAR";
    }
  };

  const getBedroomDisplay = () => {
    if (!property.bedrooms) return "स्टुडियो";
    return property.bedrooms.toString();
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description || "",
        url: `/properties/${property.id}`
      });
    }
  };

  return (
    <Card className="overflow-hidden hover-lift smooth-transition fade-in group border border-border/50 hover:border-primary/20 hover:shadow-lg" data-testid="property-card">
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          <div className="relative h-48 md:h-64 bg-gray-200 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            )}
            <img
              src={mainImage}
              alt={property.title}
              className={`w-full h-full object-cover group-hover:scale-105 smooth-transition ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              data-testid="img-property"
            />
            
            {/* Property badges */}
            <div className="absolute top-4 left-4 space-x-2">
              {property.isFeatured && (
                <Badge className="bg-yellow-500 text-white shadow-lg" data-testid="badge-featured">
                  विशेष
                </Badge>
              )}
              {property.availabilityStatus === "available" && (
                <Badge className="bg-green-500 text-white shadow-lg" data-testid="badge-available">
                  उपलब्ध
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 smooth-transition space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={handleFavoriteClick}
                data-testid="button-favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={handleShareClick}
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Image count */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{property.images.length}</span>
              </div>
            )}
          </div>

          <CardContent className="p-4 md:p-6">
            {/* Price */}
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <div className="text-xl md:text-2xl font-bold text-primary" data-testid="text-property-price">
                  {formatPrice(property.price)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{getPriceLabel()}</div>
                {property.isNegotiable && (
                  <Badge variant="outline" className="mt-1 text-xs bg-green-50 text-green-700 border-green-200">
                    मोलमोलाइ
                  </Badge>
                )}
              </div>
            </div>

            {/* Title and location */}
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-snug" data-testid="text-property-title">
                {property.title}
              </h3>
              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0 text-primary/60" />
                <span className="truncate" data-testid="text-property-location">
                  {property.location?.area || property.location?.name || "स्थान उल्लेख नगरिएको"}
                </span>
              </div>
            </div>

            {/* Property specs */}
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground" data-testid="property-specs">
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <Bed className="w-3 h-3 md:w-4 md:h-4" />
                <span>{getBedroomDisplay()}</span>
              </div>
              {property.bathrooms && (
                <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                  <Bath className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <HomeIcon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="truncate text-xs">{property.propertyType}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
              {property.furnishingStatus && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {property.furnishingStatus === "furnished" ? "सज्जित" : 
                   property.furnishingStatus === "semi-furnished" ? "अर्ध-सज्जित" : "खाली"}
                </Badge>
              )}
              {property.area && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {property.area} वर्ग मिटर
                </Badge>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3 md:mb-4 leading-relaxed" data-testid="text-property-description">
                {property.description}
              </p>
            )}

            {/* View details button */}
            <Button 
              className="w-full group-hover:bg-primary/90 smooth-transition text-sm font-medium py-2 md:py-3" 
              data-testid="button-view-details"
            >
              <span className="hidden sm:inline">विस्तृत जानकारी हेर्नुहोस्</span>
              <span className="sm:hidden">View Details</span>
            </Button>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
