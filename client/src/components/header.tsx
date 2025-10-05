import { Heart, User, Plus, Menu, X, Home, Building2, MapPin, Briefcase, Users as UsersIcon, GraduationCap, Settings, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const iconMap: Record<string, any> = {
  'home': Home,
  'building': Building2,
  'map-pin': MapPin,
  'briefcase': Briefcase,
  'users': UsersIcon,
  'graduation-cap': GraduationCap,
  'settings': Settings,
};

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showSubcategories, setShowSubcategories] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const activeCategories = categories.filter((cat: any) => cat.isActive);

  const navItems = [
    { href: "/properties", label: "घर जग्गा | Properties", shortLabel: "Properties", isActive: location.startsWith("/properties") || location === "/", hasRoute: true },
    { href: "/vehicles", label: "सवारी | Vehicles", shortLabel: "Vehicles", isActive: location.startsWith("/vehicles"), hasRoute: false },
    { href: "/jobs", label: "रोजगार | Jobs", shortLabel: "Jobs", isActive: location.startsWith("/jobs"), hasRoute: false },
    { href: "/services", label: "सेवा | Services", shortLabel: "Services", isActive: location.startsWith("/services"), hasRoute: false },
    { href: "/education", label: "शिक्षा | Education", shortLabel: "Education", isActive: location.startsWith("/education"), hasRoute: false },
    { href: "/health", label: "स्वास्थ्य | Health", shortLabel: "Health", isActive: location.startsWith("/health"), hasRoute: false },
  ];

  return (
    <>
      <header className="nepal-gradient text-primary-foreground shadow-lg sticky top-0 z-50" data-testid="header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3" data-testid="link-home">
              <div className="text-xl md:text-2xl font-bold flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-lg flex items-center justify-center text-white font-black text-lg md:text-xl">
                  j
                </div>
                <div className="hidden sm:block">
                  <span className="text-white text-lg md:text-xl tracking-wide">JEEVIKA</span>
                  <div className="text-xs text-accent/90 -mt-1 font-medium hidden md:block">सेवा प्रा. लि. | Services Pvt. Ltd.</div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Category Dropdown */}
            <nav className="hidden md:flex items-center space-x-4 relative">
              {activeCategories.map((category: any) => {
                const Icon = iconMap[category.icon] || Settings;
                const hasSubcategories = category.subcategories && category.subcategories.filter((sub: any) => sub.isActive).length > 0;
                
                return (
                  <div 
                    key={category.id} 
                    className="relative group"
                    onMouseEnter={() => {
                      setActiveCategory(category.id);
                      setShowSubcategories(true);
                    }}
                    onMouseLeave={() => {
                      setShowSubcategories(false);
                    }}
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${
                        location === `/category/${category.slug}` ? "bg-white/20 text-accent" : "text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                      {hasSubcategories && <ChevronDown className="h-3 w-3" />}
                    </Link>

                    {/* Subcategories Dropdown */}
                    {hasSubcategories && showSubcategories && activeCategory === category.id && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                     
                        {category.subcategories
                          .filter((sub: any) => sub.isActive)
                          .map((subcategory: any) => {
                            const SubIcon = iconMap[subcategory.icon] || Settings;
                            return (
                              <Link
                                key={subcategory.id}
                                href={`/subcategory/${subcategory.slug}`}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              >
                                <div 
                                  className="p-1.5 rounded-lg"
                                  style={{ backgroundColor: `${category.color}15` }}
                                >
                                  <SubIcon className="w-4 h-4" style={{ color: category.color }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{subcategory.name}</p>
                                  {subcategory.description && (
                                    <p className="text-xs text-gray-500 line-clamp-1">{subcategory.description}</p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4" data-testid="header-actions">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs md:text-sm px-2 md:px-4"
                data-testid="button-post-ad"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Post Ad</span>
                <span className="sm:hidden">Post</span>
              </Button>

              <button className="p-2 hover:bg-primary/80 rounded-lg transition-colors hidden sm:block" data-testid="button-favorites">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <Link href="/profile" className="hidden sm:block" data-testid="button-profile">
                {(() => {
                  const storedUser = localStorage.getItem("user");
                  const user = storedUser ? JSON.parse(storedUser) : null;
                  const initial = user?.firstName?.[0] || user?.username?.[0] || 'U';
                  
                  return (
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold hover:opacity-90 transition-opacity">
                      {initial.toUpperCase()}
                    </div>
                  );
                })()}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-primary/80 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-menu-overlay">
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <nav className="container mx-auto px-4 py-6" data-testid="nav-mobile">
              <div className="space-y-2">
                {/* Categories */}
                {activeCategories.map((category: any) => {
                  const Icon = iconMap[category.icon] || Settings;
                  const hasSubcategories = category.subcategories && category.subcategories.filter((sub: any) => sub.isActive).length > 0;
                  const isExpanded = activeCategory === category.id;

                  return (
                    <div key={category.id}>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/category/${category.slug}`}
                          className={`flex-1 flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                            location === `/category/${category.slug}` 
                              ? "text-primary-foreground" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          style={{
                            backgroundColor: location === `/category/${category.slug}` ? category.color : 'transparent'
                          }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid={`mobile-link-${category.name.toLowerCase()}`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{category.name}</span>
                        </Link>
                        {hasSubcategories && (
                          <button
                            onClick={() => setActiveCategory(isExpanded ? "" : category.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Subcategories */}
                      {hasSubcategories && isExpanded && (
                        <div className="ml-8 mt-2 space-y-1">
                          {category.subcategories
                            .filter((sub: any) => sub.isActive)
                            .map((subcategory: any) => {
                              const SubIcon = iconMap[subcategory.icon] || Settings;
                              return (
                                <Link
                                  key={subcategory.id}
                                  href={`/subcategory/${subcategory.slug}`}
                                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <div 
                                    className="p-1.5 rounded-lg"
                                    style={{ backgroundColor: `${category.color}15` }}
                                  >
                                    <SubIcon className="w-4 h-4" style={{ color: category.color }} />
                                  </div>
                                  <span className="text-sm text-gray-700">{subcategory.name}</span>
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <hr className="my-4" />
                <Link
                  href="#"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-favorites"
                >
                  <Heart className="w-5 h-5" />
                  <span>Favorites</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-profile"
                >
                  {(() => {
                    const storedUser = localStorage.getItem("user");
                    const user = storedUser ? JSON.parse(storedUser) : null;
                    const initial = user?.firstName?.[0] || user?.username?.[0] || 'U';
                    
                    return (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {initial.toUpperCase()}
                      </div>
                    );
                  })()}
                  <span>Profile</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}