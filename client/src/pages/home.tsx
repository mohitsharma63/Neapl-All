import { useState } from "react";
import {
  Home as HomeIcon,
  Building,
  Globe,
  Bus,
  Users,
  GraduationCap,
  List,
  Map,
  Building2,
  MapPin,
  Briefcase,
  Settings,
  Laptop,
  Smartphone,
  Shirt,
  Sofa,
  Car,
  BookOpen,
  Monitor,
  Sparkles,
  Home as House,
  BookMarked,
  Dumbbell,
  Languages,
  Music,
  Award,
  School,
  Trophy,
  Globe2,
  Brain,
  Star,
  TrendingUp,
  Shield,
  Clock,
  User,
  ArrowRight,
  Download,
  Eye,
  Badge
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import FeaturedBanner from "@/components/featured-banner";
import StatsSection from "@/components/stats-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const iconMap: Record<string, any> = {
  'home': HomeIcon,
  'building': Building,
  'building2': Building2,
  'globe': Globe,
  'bus': Bus,
  'users': Users,
  'graduation-cap': GraduationCap,
  'list': List,
  'map': Map,
  'map-pin': MapPin,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'smartphone': Smartphone,
  'shirt': Shirt,
  'sofa': Sofa,
  'car': Car,
  'book-open': BookOpen,
  'monitor': Monitor,
  'sparkles': Sparkles,
  'house': House,
  'book-marked': BookMarked,
  'dumbbell': Dumbbell,
  'languages': Languages,
  'music': Music,
  'award': Award,
  'school': School,
  'trophy': Trophy,
  'globe2': Globe2,
  'brain': Brain,
};

const pastelColors = [
  "bg-purple-100 hover:bg-purple-200",
  "bg-blue-100 hover:bg-blue-200",
  "bg-green-100 hover:bg-green-200",
  "bg-yellow-100 hover:bg-yellow-200",
  "bg-pink-100 hover:bg-pink-200",
  "bg-indigo-100 hover:bg-indigo-200",
  "bg-teal-100 hover:bg-teal-200",
];

// Helper function to cast JSON properties to the Property type
function castToProperty(data: any): Property {
  return {
    ...data,
    // Explicitly cast date strings to Date objects, handle nulls
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    // Ensure numeric fields are numbers, handle potential nulls from schema
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    // Ensure price and area are parsed as numbers (or handle as per schema, assuming decimal/float for now)
    price: parseFloat(data.price) || 0,
    area: parseFloat(data.area) || 0,
    // Ensure other potentially nullable fields are handled
    locationId: data.locationId ?? null,
    categoryId: data.categoryId ?? null,
    agencyId: data.agencyId ?? null,
    furnishingStatus: data.furnishingStatus ?? "unfurnished", // Default if not present
    availabilityStatus: data.availabilityStatus ?? "available", // Default if not present
  };
}


export default function Home() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });
  const [activeCategory, setActiveCategory] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const { data: sliders = [], isLoading: slidersLoading } = useQuery({
    queryKey: ["sliders"],
    queryFn: async () => {
      const res = await fetch("/api/sliders");
      if (!res.ok) throw new Error("Failed to fetch sliders");
      return res.json();
    },
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["blog-posts-home"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });

  // Static data instead of API call, cast to Property type

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Header />

      {/* Category Navigation - Clean & Luxury with Animations */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-6 py-4 min-w-max">
              {categories.map((category: any, index: number) => {
                const Icon = iconMap[category.icon] || iconMap['home'];
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(isActive ? "" : category.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className={`flex flex-col items-center justify-center px-8 py-4 min-w-[140px] rounded-xl transition-all duration-500 animate-fade-in-up ${
                      isActive
                        ? 'bg-gradient-to-br from-[#0B8457] to-[#059669] text-white shadow-2xl scale-110 -translate-y-1'
                        : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-500 ${
                      isActive ? 'bg-white/20 rotate-6 scale-110' : 'bg-white group-hover:rotate-3'
                    }`}>
                      <Icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'text-white animate-bounce-slow' : 'text-[#0B8457]'}`} />
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight transition-all duration-300">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expanded Category View with Subcategories */}
        {activeCategory && (() => {
          const selectedCategory = categories.find((c: any) => c.id === activeCategory);
          if (!selectedCategory) return null;

          const Icon = iconMap[selectedCategory.icon] || iconMap['home'];
          const activeSubcategories = selectedCategory.subcategories?.filter((s: any) => s.isActive) || [];

          return (
            <div className="space-y-6 mt-6">
              {/* Category Header - Luxury Design */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B8457] via-[#059669] to-[#0B8457] p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2 text-white">{selectedCategory.name}</h3>
                    {selectedCategory.description && (
                      <p className="text-white/90 text-sm mb-2">{selectedCategory.description}</p>
                    )}
                    <p className="text-xs text-white/70 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                      {activeSubcategories.length} subcategories available
                    </p>
                  </div>
                </div>
              </div>

              {/* Subcategories Grid - Clean & Minimal with Animations */}
              {activeSubcategories.length > 0 ? (
                <div className="mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {activeSubcategories.map((subcategory: any, index: number) => {
                      const SubIcon = iconMap[subcategory.icon] || iconMap['home'];
                      const colorClass = pastelColors[index % pastelColors.length];
                      return (
                        <Link
                          key={subcategory.id}
                          to={`/category/${activeCategory}/subcategory/${subcategory.slug}`}
                          style={{ animationDelay: `${index * 0.08}s` }}
                          className={`${colorClass} p-6 rounded-2xl hover:shadow-xl transition-all duration-500 group border border-gray-200 animate-fade-in-up hover:scale-105 hover:-translate-y-1`}
                        >
                          <div className="flex flex-col items-center text-center gap-3">
                            <SubIcon className="w-8 h-8 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
                            <h3 className="font-medium text-sm leading-tight transition-all duration-300 group-hover:text-base">
                              {subcategory.name}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">No subcategories available</p>
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* Hero Slider Section */}
      <section className="container mx-auto px-4 py-8">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {slidersLoading ? (
              <CarouselItem>
                <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-muted-foreground">Loading sliders...</div>
                </div>
              </CarouselItem>
            ) : sliders && sliders.length > 0 ? (
              sliders.map((s: any) => (
                <CarouselItem key={s.id}>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden">
                    <img src={s.imageUrl} alt={s.title || "slider"} className="w-full h-full object-cover" />
                    {(s.title || s.description || s.buttonText) && (
                      <div className="absolute inset-0 flex items-end">
                        <div className="bg-gradient-to-t from-black/60 to-transparent w-full p-8">
                          <h3 className="text-3xl font-bold text-white">{s.title}</h3>
                          {s.description && <p className="text-white/90 mt-2">{s.description}</p>}
                          {s.linkUrl && s.buttonText && (
                            <div className="mt-4">
                              <a href={s.linkUrl} className="inline-block bg-white text-black px-4 py-2 rounded-md">
                                {s.buttonText}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))
            ) : (
              // Fallback static slides when no sliders configured
              <>
                <CarouselItem>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=500&fit=crop"
                      alt="Nepal Real Estate"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=500&fit=crop"
                      alt="Nepal Services"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=500&fit=crop"
                      alt="Nepal Business"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              </>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* More Details Section - Why Choose Us */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0B8457] to-[#059669] bg-clip-text text-transparent">
            Why Choose Jeevika Services?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nepal's most trusted platform connecting businesses and customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                All services and products are verified for authenticity and quality
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Reach</h3>
              <p className="text-muted-foreground">
                Connect with thousands of potential customers across Nepal
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and transactions are protected with advanced security
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our team is always ready to help you with any queries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Everything You Need in One Place</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Easy Listing Process</h4>
                    <p className="text-muted-foreground">Post your ad in minutes with our simple interface</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Search & Filters</h4>
                    <p className="text-muted-foreground">Find exactly what you need with advanced filters</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Direct Communication</h4>
                    <p className="text-muted-foreground">Connect directly with sellers and service providers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Mobile Friendly</h4>
                    <p className="text-muted-foreground">Access from anywhere on any device</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-[#0B8457] mb-2">10,000+</div>
              <div className="text-xl font-semibold mb-4">Active Listings</div>
              <div className="text-muted-foreground mb-6">
                Join our growing community of businesses and customers
              </div>
              <Button size="lg" className="bg-[#0B8457] hover:bg-[#059669] text-white">
                Start Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Latest from Our Blog
            </h2>
            <p className="text-muted-foreground">Stay updated with tips, trends and insights</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogLoading ? (
            // show three placeholders while loading
            [1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="relative h-48 bg-gray-100" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : blogPosts && blogPosts.length > 0 ? (
            blogPosts.slice(0, 3).map((p: any) => {
              const words = (p.content || p.excerpt || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
              const readTime = Math.max(1, Math.ceil(words / 200));
              return (
                <Card key={p.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.coverImageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"}
                      alt={p.title || "Blog post"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600">{p.category || 'Blog'}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                      <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{p.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{p.authorName || 'Admin'}</span>
                      </div>
                      <span>{readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // fallback static placeholders if no posts
            <>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
                    alt="Blog post"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">Market Trends</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    2025 Nepal Real Estate Market Outlook
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    An in-depth analysis of the upcoming trends in Nepal's real estate sector
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Mohit Sharma</span>
                    </div>
                    <span>8 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=250&fit=crop"
                    alt="Blog post"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">Investment</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    Top 10 Areas for Property Investment
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    Discover the most promising neighborhoods for real estate investment
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Ram Thapa</span>
                    </div>
                    <span>5 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop"
                    alt="Blog post"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">Property Tips</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    How to Get the Best Deal When Buying
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    Expert tips and negotiation strategies to help you secure the best price
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Asha Rai</span>
                    </div>
                    <span>7 min read</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Featured Articles & Research
            </h2>
            <p className="text-muted-foreground">In-depth guides and resources for your journey</p>
          </div>
          <Link to="/articles">
            <Button variant="outline" className="gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="relative h-48 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop"
                  alt="Article"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="md:col-span-2 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">Guide</Badge>
                  <span className="text-sm text-muted-foreground">45 pages</span>
                </div>
                <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                  Complete Guide to Property Registration in Nepal 2025
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  A comprehensive step-by-step guide covering all aspects of property registration
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    5.2K
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    12.4K
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="relative h-48 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
                  alt="Article"
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-amber-500">Premium</Badge>
              </div>
              <CardContent className="md:col-span-2 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">Research</Badge>
                  <span className="text-sm text-muted-foreground">78 pages</span>
                </div>
                <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                  Nepal Real Estate Market Report 2024-2025
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  Annual market analysis featuring price trends and investment opportunities
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    8.7K
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    18.2K
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
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