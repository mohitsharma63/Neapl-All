
import { useState } from "react";
import { Home as HomeIcon, Phone, Mail, MapPin, Star, Users, Building, Globe, Bus, GraduationCap } from "lucide-react";
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

const PROPERTY_CATEGORIES = [
  { id: "residential", icon: HomeIcon, label: "आवासीय | Residential", href: "/properties?category=residential" },
  { id: "commercial", icon: Building, label: "व्यावसायिक | Commercial", href: "/properties?category=commercial" },
  { id: "international", icon: Globe, label: "अन्तर्राष्ट्रिय | International", href: "/properties?category=international" },
  { id: "agents", icon: Bus, label: "एजेन्टहरू | Agents", href: "/agents" },
  { id: "agencies", icon: Users, label: "एजेन्सीहरू | Agencies", href: "/agencies" },
  { id: "schools", icon: GraduationCap, label: "विद्यालयहरू | Schools", href: "/schools" },
];

export default function Agents() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });
  const [activeCategory, setActiveCategory] = useState<string>("agents");

  // Static data instead of API call
  const agencies: Agency[] = agenciesData;

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-agents">
      <Header />

      {/* Property Categories */}
      <section className="bg-white border-b shadow-sm" data-testid="property-categories">
        <div className="container mx-auto px-4">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto py-4">
            <div className="flex space-x-6 min-w-max px-2">
              {PROPERTY_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Link href={category.href} key={category.label}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex flex-col items-center space-y-2 pb-2 px-3 py-2 rounded-lg min-w-0 whitespace-nowrap transition-all duration-200 ${
                        activeCategory === category.id
                          ? "bg-accent/10 text-accent border-2 border-accent/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                      }`}
                      data-testid={`button-category-${category.label.toLowerCase()}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium leading-tight text-center">
                        {category.label.split(' | ')[0]}
                      </span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop: Grid layout */}
          <div className="hidden md:flex items-center justify-center space-x-8 py-6">
            {PROPERTY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link href={category.href} key={category.label}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex flex-col items-center space-y-3 pb-3 px-4 py-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
                      activeCategory === category.id
                        ? "text-accent border-b-3 border-accent bg-accent/5 shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-50 hover:shadow-md"
                    }`}
                    data-testid={`button-category-${category.label.toLowerCase()}`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium text-sm text-center leading-tight">
                      {category.label}
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
            <span className="text-foreground font-medium">Real Estate Agents</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Real Estate Agents in Nepal ({agencies.length} agents)
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="px-3 py-2 border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white" data-testid="select-sort">
                <option>Most Properties</option>
                <option>Highest Rated</option>
                <option>Newest</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Listings */}
      <section className="container mx-auto px-4 py-8" data-testid="agents-listings">
        {agencies.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">कुनै एजेन्ट फेला परेन</h3>
              <p className="text-gray-600 mb-6">हाल कुनै रियल इस्टेट एजेन्टहरू उपलब्ध छैनन्।</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">होम पेजमा फिर्ता जानुहोस्</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <Card key={agency.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1 truncate" data-testid="text-agent-name">
                        {agency.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {agency.propertyCount || 0} Properties
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground">{agency.rating || 4.5}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {agency.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {agency.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {agency.phone && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{agency.phone}</span>
                      </div>
                    )}
                    {agency.email && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{agency.email}</span>
                      </div>
                    )}
                    {agency.address && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{agency.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid="button-call-agent">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid="button-view-properties">
                      <Building className="w-4 h-4 mr-2" />
                      Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Featured Agents Section */}
      <section className="bg-muted py-16" data-testid="featured-agents">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Top Rated Agents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with Nepal's most trusted real estate professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agencies.slice(0, 4).map((agency) => (
              <Card key={`featured-${agency.id}`} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{agency.name}</h3>
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {agency.propertyCount || 0} properties listed
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Profile
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
