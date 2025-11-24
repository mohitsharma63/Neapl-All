
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Eye, Star } from "lucide-react";
import { Link } from "wouter";

interface CategoryListingCardProps {
  listing: any;
  categorySlug: string;
}

export function CategoryListingCard({ listing, categorySlug }: CategoryListingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
          {listing.isFeatured && (
            <Badge className="bg-yellow-500">Featured</Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {listing.description}
        </p>

        <div className="space-y-2 text-sm">
          {listing.city && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{listing.city}{listing.areaName && `, ${listing.areaName}`}</span>
            </div>
          )}
          
          {listing.contactPhone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{listing.contactPhone}</span>
            </div>
          )}

          {listing.contactEmail && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{listing.contactEmail}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{listing.viewCount || 0}</span>
          </div>
          {listing.rating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{listing.rating}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-4">
        <Link href={categorySlug === 'TuitionPrivatClasses' ? `/tuition-private-classes/${listing.id}` : `/${categorySlug}/${listing.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
