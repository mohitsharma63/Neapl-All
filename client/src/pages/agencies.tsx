
import { useState } from "react";
import { Home as HomeIcon, Phone, Mail, MapPin, Star, Users, Building, Globe } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Agency } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import agenciesData from "@/data/agencies.json";

export default function Agencies() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });

  // Static data instead of API call
  const agencies: Agency[] = agenciesData;

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-agencies">
      <Header />

      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSaveSearch={handleSaveSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Breadcrumb Navigation */}
      <section className="bg-white py-4 border-b" data-testid="breadcrumb-navigation">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-home">
              <HomeIcon className="w-4 h-4" />
            </Link>
            <span>{'>'}</span>
            <span className="text-foreground font-medium">Real Estate Agencies</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Real Estate Agencies in Nepal ({agencies.length} agencies)
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="px-3 py-2 border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white" data-testid="select-sort">
                <option>Most Properties</option>
                <option>Highest Rated</option>
                <option>Established Date</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Agencies Listings */}
      <section className="container mx-auto px-4 py-8" data-testid="agencies-listings">
        {agencies.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">कुनै एजेन्सी फेला परेन</h3>
              <p className="text-gray-600 mb-6">हाल कुनै रियल इस्टेट एजेन्सीहरू उपलब्ध छैनन्।</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">होम पेजमा फिर्ता जानुहोस्</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agencies.map((agency) => (
              <Card key={agency.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-agency-name">
                        {agency.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {agency.propertyCount || 0} Properties
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {agency.rating || 4.8} Rating
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{agency.address || "Kathmandu, Nepal"}</span>
                      </div>
                    </div>
                  </div>

                  {agency.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {agency.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-6">
                    {agency.phone && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{agency.phone}</span>
                      </div>
                    )}
                    {agency.email && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium truncate ml-2">{agency.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Established:</span>
                      <span className="font-medium">{agency.established || "2018"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Specializes:</span>
                      <span className="font-medium">{agency.specialization || "Residential"}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="default" size="sm" className="flex-1" data-testid="button-contact-agency">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid="button-view-properties">
                      <Building className="w-4 h-4 mr-2" />
                      Properties
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-website">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Top Agencies Section */}
      <section className="bg-muted py-16" data-testid="top-agencies">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Top Real Estate Agencies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nepal's leading real estate agencies with years of experience and thousands of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agencies.slice(0, 3).map((agency, index) => (
              <Card key={`top-${agency.id}`} className="text-center hover:shadow-lg transition-shadow relative">
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      #1 Agency
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Building className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{agency.name}</h3>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">({agency.rating || 4.9})</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="text-2xl font-bold text-primary">
                      {agency.propertyCount || Math.floor(Math.random() * 500) + 100}+
                    </div>
                    <div className="text-sm text-muted-foreground">Properties Listed</div>
                  </div>
                  <Button className="w-full">
                    View Agency Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
