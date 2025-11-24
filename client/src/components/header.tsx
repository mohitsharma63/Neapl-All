import { Heart, User, Plus, Menu, X, Home, Building2, MapPin, Briefcase, Users as UsersIcon, GraduationCap, Settings, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useRef, useState } from "react";
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
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const subScrollRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [submenuLeft, setSubmenuLeft] = useState<number | null>(null);
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
  const activeCat = activeCategories.find((c: any) => c.id === activeCategory);

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
      <header ref={headerRef} className="nepal-gradient text-primary-foreground shadow-lg sticky top-0 z-50" data-testid="header">
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

            {/* Desktop Category Card Bar (replaces dropdown navigation) */}
              <div className="hidden md:block w-full" onMouseLeave={() => setShowSubcategories(false)}>
              <div className="container mx-auto px-4 py-6 relative">
                <div className="relative">
                  <div
                    ref={scrollRef}
                    className="overflow-x-auto hide-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    <div className="flex items-center gap-6 flex-nowrap" style={{ minWidth: 'max-content' }}>
                    {activeCategories.map((category: any) => {
                      return (
                        <div className="relative inline-block flex-shrink-0" key={category.id}>
                          <Link
                            ref={(el: any) => (linkRefs.current[category.id] = el)}
                            href={`/category/${category.slug}`}
                            onMouseEnter={() => {
                              setActiveCategory(category.id);
                              setShowSubcategories(true);
                              // compute left offset for submenu
                              if (headerRef.current && linkRefs.current[category.id]) {
                                const headerRect = headerRef.current.getBoundingClientRect();
                                const linkRect = linkRefs.current[category.id]!.getBoundingClientRect();
                                setSubmenuLeft(linkRect.left - headerRect.left);
                              }
                            }}
                            onFocus={() => {
                              setActiveCategory(category.id);
                              setShowSubcategories(true);
                            }}
                            className={`inline-block px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors`}
                            style={{ textDecoration: 'none' }}
                          >
                            {category.name}
                          </Link>
                        </div>
                      );
                    })}
                    </div>
                  </div>

                  {/* Left / Right controls for the category scroller */}
                  <button
                    aria-label="Scroll left"
                    onClick={() => {
                      if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                    }}
                    className="hidden lg:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md hover:bg-white"
                    style={{ zIndex: 60 }}
                  >
                    <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>

                  <button
                    aria-label="Scroll right"
                    onClick={() => {
                      if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                    }}
                    className="hidden lg:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md hover:bg-white"
                    style={{ zIndex: 60 }}
                  >
                    <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>

                {/* Subcategory popup positioned under the hovered category */}
                {showSubcategories && activeCat && activeCat.subcategories && activeCat.subcategories.filter((s: any) => s.isActive).length > 0 && submenuLeft !== null && (
                  <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{ top: '100%', zIndex: 60 }}
                  >
                    <div
                          className="pointer-events-auto bg-white rounded-lg shadow-sm border border-gray-100 mx-4"
                          style={{ position: 'absolute', left: submenuLeft, transform: 'translateX(0)', minWidth: 320 }}
                        >
                          <div className="px-2 py-3 relative">
                            <div
                              ref={subScrollRef}
                              className="overflow-x-auto hide-scrollbar"
                              style={{ scrollBehavior: 'smooth' }}
                            >
                              <div className="flex items-center gap-4 px-2">
                                {activeCat.subcategories.filter((s: any) => s.isActive).map((sub: any) => {
                            const SubIcon = iconMap[activeCat.icon] || Settings;
                            return (
                              <Link
                                key={sub.id}
                                href={`/subcategory/${sub.slug}`}
                                className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors min-w-[160px]"
                                onClick={() => setShowSubcategories(false)}
                                style={{ textDecoration: 'none' }}
                              >
                                <div className="p-2 rounded-md" style={{ backgroundColor: `${activeCat.color || '#eee'}20` }}>
                                  <SubIcon className="w-5 h-5" style={{ color: activeCat.color || '#333' }} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-800">{sub.name}</div>
                                  {sub.description && <div className="text-xs text-gray-500">{sub.description}</div>}
                                </div>
                              </Link>
                            );
                              })}
                              </div>
                            </div>

                            {/* Sub-scroll left/right controls */}
                            <button
                              aria-label="Scroll subcategories left"
                              onClick={() => { if (subScrollRef.current) subScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' }); }}
                              className="hidden lg:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-sm hover:bg-white"
                              style={{ zIndex: 70 }}
                            >
                              <svg className="w-3 h-3 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            <button
                              aria-label="Scroll subcategories right"
                              onClick={() => { if (subScrollRef.current) subScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' }); }}
                              className="hidden lg:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-sm hover:bg-white"
                              style={{ zIndex: 70 }}
                            >
                              <svg className="w-3 h-3 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                          </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                <Link href="/settings" className="hidden sm:flex items-center gap-2 p-2 hover:bg-primary/80 rounded-lg transition-colors" data-testid="button-settings">
                  <Settings className="w-4 h-4 text-white" />
                  <span className="hidden md:inline text-white">Settings</span>
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
                                const SubIcon = iconMap[category.icon] || Settings;
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
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="mobile-link-settings"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                    
                  </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}