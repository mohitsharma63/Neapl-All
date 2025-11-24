
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize, Eye } from "lucide-react";
import { Link } from "wouter";
import type { PropertyWithRelations } from "@/lib/types";

interface PropertyCardProps {
  property: PropertyWithRelations;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const primaryImage = property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {property.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">
            Featured
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-2 left-2">
          {property.priceType === 'sale' ? 'For Sale' : 'For Rent'}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">
            {property.title}
          </h3>
          {property.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="line-clamp-1">{property.location.name}</span>
            </div>
          )}
        </div>

        <div className="text-2xl font-bold text-primary mb-3">
          {formatPrice(property.price)}
          {property.priceType === 'rent' && <span className="text-sm text-muted-foreground">/month</span>}
        </div>

        {property.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {property.description}
          </p>
        )}

        <div className="flex gap-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{property.area} sq ft</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/property/${property.id}`} className="w-full">
          <Button className="w-full gap-2">
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
