import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, Phone, Mail, MapPin, Bed, Bath, Home as HomeIcon, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Property, Agency, Location } from "@shared/schema";

interface PropertyWithRelations extends Property {
  location?: Location;
  agency?: Agency;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: property, isLoading, error } = useQuery<PropertyWithRelations>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="page-property-detail-loading">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse text-lg">Loading property details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background" data-testid="page-property-detail-error">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link href="/properties">
              <Button data-testid="button-back-to-properties">Back to Properties</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600";

  return (
    <div className="min-h-screen bg-background" data-testid="page-property-detail">
      <Header />

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
            <span className="text-foreground font-medium">{property.title}</span>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/properties">
              <Button variant="outline" size="sm" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <div className="relative" data-testid="property-images">
              <div className="relative h-96 bg-muted rounded-xl overflow-hidden">
                <img
                  src={mainImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  data-testid="img-property-main"
                />
                <div className="absolute top-4 left-4 space-x-2">
                  {property.isFeatured && (
                    <Badge className="bg-accent text-accent-foreground" data-testid="badge-featured">
                      Featured
                    </Badge>
                  )}
                  {property.availabilityStatus === "available" && (
                    <Badge className="bg-green-500 text-white" data-testid="badge-available">
                      Available
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 space-x-2">
                  <Button size="sm" variant="secondary" data-testid="button-favorite">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" data-testid="button-share">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
                  1/{property.images?.length || 1}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <Card data-testid="property-details">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-property-title">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span data-testid="text-property-location">
                        {property.location?.area || property.location?.name || "Location not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground" data-testid="text-property-price">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-muted-foreground">{getPriceLabel()}</div>
                    {property.isNegotiable && (
                      <Badge variant="secondary" className="mt-2">Negotiable</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6" data-testid="property-specs">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{getBedroomDisplay()}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.bathrooms || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <HomeIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.propertyType}</div>
                    <div className="text-sm text-muted-foreground">Type</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Property Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.furnishingStatus && (
                        <Badge variant="outline">{property.furnishingStatus}</Badge>
                      )}
                      {property.area && (
                        <Badge variant="outline">{property.area} sqm</Badge>
                      )}
                      <Badge variant="outline">{property.propertyType}</Badge>
                    </div>
                  </div>

                  {property.description && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground" data-testid="text-property-description">
                        {property.description}
                      </p>
                    </div>
                  )}

                  {property.amenities && property.amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" data-testid={`badge-amenity-${index}`}>
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Agent */}
            <Card className="mb-6" data-testid="contact-agent">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                {property.agency ? (
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium" data-testid="text-agency-name">
                        {property.agency.name}
                      </div>
                      {property.agency.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {property.agency.description}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {property.agency.phone && (
                        <Button variant="outline" className="w-full" data-testid="button-call-agent">
                          <Phone className="w-4 h-4 mr-2" />
                          {property.agency.phone}
                        </Button>
                      )}
                      {property.agency.email && (
                        <Button variant="outline" className="w-full" data-testid="button-email-agent">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Agent
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Contact information not available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card data-testid="quick-actions">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full" data-testid="button-schedule-viewing">
                    Schedule Viewing
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-request-info">
                    Request More Info
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-save-property">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
