import { useState } from "react";
import { Home as HomeIcon, Phone, Mail, MapPin, Star, Users, GraduationCap, Globe } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

// School interface
interface School {
  id: string;
  name: string;
  type: string;
  level: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  established?: string;
  students?: number;
  rating?: number;
  description?: string;
  facilities?: string[];
}

export default function Schools() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });

  // Fetch schools data from API
  const { data: schools = [], isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const response = await fetch('/api/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      return response.json();
    }
  });

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-schools">
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
            <span className="text-foreground font-medium">Schools</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Schools in Nepal ({schools.length} schools)
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="px-3 py-2 border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white" data-testid="select-sort">
                <option>Highest Rated</option>
                <option>Most Students</option>
                <option>Established Date</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Schools Listings */}
      <section className="container mx-auto px-4 py-8" data-testid="schools-listings">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-gray-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading schools...</h3>
              <p className="text-gray-600">कृपया प्रतीक्षा गर्नुहोस्।</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading schools</h3>
              <p className="text-gray-600 mb-6">विद्यालयहरू लोड गर्न समस्या भयो।</p>
              <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </div>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">कुनै विद्यालय फेला परेन</h3>
              <p className="text-gray-600 mb-6">हाल कुनै विद्यालयहरू उपलब्ध छैनन्।</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">होम पेजमा फिर्ता जानुहोस्</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
            <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-school-name">
                      {school.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={school.type === 'Private' ? 'default' : 'secondary'} className="text-xs">
                        {school.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {school.level}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-muted-foreground">{school.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{school.address}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {school.description}
                </p>

                <div className="space-y-2 mb-4">
                  {school.established && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Established:</span>
                      <span className="font-medium">{school.established}</span>
                    </div>
                  )}
                  {school.students && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students:</span>
                      <span className="font-medium">{school.students}</span>
                    </div>
                  )}
                </div>

                {school.facilities && school.facilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Facilities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {school.facilities.slice(0, 3).map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                      {school.facilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{school.facilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="default" size="sm" className="flex-1" data-testid="button-contact-school">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" data-testid="button-view-details">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                  {school.website && (
                    <Button variant="outline" size="sm" data-testid="button-website">
                      <Globe className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </section>

      {/* Top Schools Section */}
      <section className="bg-muted py-16" data-testid="top-schools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Top Rated Schools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nepal's leading educational institutions providing quality education and shaping future leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schools.slice(0, 3).map((school, index) => (
              <Card key={`top-${school.id}`} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{school.name}</h3>
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.floor(school.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="space-y-1 mb-4">
                    <p className="text-2xl font-bold text-primary">{school.students || 500}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <Badge className="mb-4">{school.type} School</Badge>
                  <Button size="sm" variant="outline" className="w-full">
                    View School Profile
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