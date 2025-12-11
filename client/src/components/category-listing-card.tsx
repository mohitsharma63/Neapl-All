
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Eye, Star, Heart } from "lucide-react";
import { Link } from "wouter";
import useWishlist from "@/hooks/useWishlist";

interface CategoryListingCardProps {
  listing: any;
  categorySlug: string;
}

export function CategoryListingCard({ listing, categorySlug }: CategoryListingCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(listing.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      <button
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist({ id: listing.id, title: listing.title, href: `/${categorySlug}/${listing.id}`, photo: listing.photos?.[0] })}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors ${active ? 'bg-red-50' : 'bg-white'}`}
      >
        <Heart className={`w-4 h-4 ${active ? 'text-red-500' : 'text-gray-600'}`} />
      </button>

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
        <Link href="/service-details/7b8cc32d-6901-4ee8-b7f3-620dd484e0b8" className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
