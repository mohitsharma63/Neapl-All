import { Heart, User, Plus, Menu, X, Home, Building2, MapPin, Briefcase, Users as UsersIcon, GraduationCap, Settings, ChevronDown, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showCategoriesPanel, setShowCategoriesPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const handleCategoryClick = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (activeCategory === categoryId) {
      setActiveCategory("");
      setShowSubcategories(false);
    } else {
      setActiveCategory(categoryId);
      setShowSubcategories(true);
    }
  };

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

  // Build grouped services: each category once, with its active subcategories
  const serviceGroups: Array<any> = activeCategories.map((cat: any) => {
    const subs = (cat.subcategories || [])
      .filter((s: any) => s.isActive)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        type: 'subcategory',
        parent: { id: cat.id, name: cat.name, slug: cat.slug },
      }));

    const catEntry = { id: cat.id, name: cat.name, slug: cat.slug, type: 'category' };

    return { category: catEntry, subcategories: subs };
  });

  // Filter groups based on the search query. If query matches category name or any sub, include them.
  const lowerQ = searchQuery.trim().toLowerCase();
  const filteredGroups = serviceGroups
    .map((g) => {
      const catMatches = !lowerQ || g.category.name.toLowerCase().includes(lowerQ);
      let matchedSubs = lowerQ
        ? g.subcategories.filter((s: any) => s.name.toLowerCase().includes(lowerQ))
        : g.subcategories;

      // If the category itself matches the query but no subs matched the query,
      // show all active subcategories so they appear under the category header.
      if (catMatches && matchedSubs.length === 0) {
        matchedSubs = g.subcategories;
      }

      // include group if category matches or has any matched subcategories
      if (catMatches || matchedSubs.length > 0) {
        return { category: g.category, subcategories: matchedSubs };
      }
      return null;
    })
    .filter(Boolean) as Array<any>;

  // Flatten filtered groups for keyboard navigation (only subcategories are selectable)
  const flatList = filteredGroups.flatMap((g) => g.subcategories || []);

  const navItems = [
    { href: "/properties", label: "घर जग्गा | Properties", shortLabel: "Properties", isActive: location.startsWith("/properties") || location === "/", hasRoute: true },
    { href: "/vehicles", label: "सवारी | Vehicles", shortLabel: "Vehicles", isActive: location.startsWith("/vehicles"), hasRoute: false },
    { href: "/jobs", label: "रोजगार | Jobs", shortLabel: "Jobs", isActive: location.startsWith("/jobs"), hasRoute: false },
    { href: "/services", label: "सेवा | Services", shortLabel: "Services", isActive: location.startsWith("/services"), hasRoute: false },
    { href: "/education", label: "शिक्षा | Education", shortLabel: "Education", isActive: location.startsWith("/education"), hasRoute: false },
    { href: "/health", label: "स्वास्थ्य | Health", shortLabel: "Health", isActive: location.startsWith("/health"), hasRoute: false },
  ];

  const topNav = [
    { href: "/", label: "Home", isActive: location === "/" || location.startsWith("/") },
    { href: "/about", label: "About Us", isActive: location.startsWith("/about") },
    { href: "/contact", label: "Contact", isActive: location.startsWith("/contact") },
    { href: "/blog", label: "Blog", isActive: location.startsWith("/blog") },
    { href: "/articles", label: "Articles", isActive: location.startsWith("/articles") },
  ];

  return (
    <>
      {/* Top simple nav - static links */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-end space-x-4 text-sm py-2">
            {topNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1 rounded-md hover:bg-gray-100 transition-colors ${
                  item.isActive ? "font-semibold text-gray-900" : "text-gray-700"
                }`}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

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

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:flex items-start gap-3" data-testid="search-bar">
              {/* Categories dropdown trigger (desktop) */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoriesPanel((s) => !s)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm"
                  aria-expanded={showCategoriesPanel}
                  aria-haspopup="true"
                >
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showCategoriesPanel && (
                  <div className="absolute left-0 mt-2 w-[28rem] bg-white shadow-xl rounded-md z-50 max-h-80 overflow-auto">
                    <div className="p-3">
                      {activeCategories.length === 0 ? (
                        <div className="text-sm text-gray-500">No categories</div>
                      ) : (
                        activeCategories.map((category: any) => {
                          const subs = (category.subcategories || []).filter((s: any) => s.isActive);
                          return (
                            <div key={category.id} className="border-b last:border-b-0">
                              <div className="px-3 py-2 text-sm font-medium text-gray-800">{category.name}</div>
                              {subs.length === 0 ? (
                                <div className="px-6 py-2 text-sm text-gray-500">No subcategories</div>
                              ) : (
                                subs.map((sub: any) => (
                                  <button
                                    key={sub.id}
                                    onMouseDown={(ev) => ev.preventDefault()}
                                    onClick={() => { setLocation(`/subcategory/${sub.slug}`); setShowCategoriesPanel(false); }}
                                    className="w-full text-left px-6 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{sub.name}</span>
                                      <span className="text-xs text-gray-400">{category.name}</span>
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search properties, vehicles, jobs..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setHighlightIndex(-1); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setHighlightIndex((i) => Math.min(i + 1, flatList.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = flatList[highlightIndex] || flatList[0];
                      if (target) {
                        if (target.type === 'subcategory') setLocation(`/subcategory/${target.slug}`);
                        else setLocation(`/category/${target.slug}`);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      } else {
                        setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setShowSuggestions(false);
                      }
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white/90 border-white/20 focus:bg-white"
                />
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 max-h-60 overflow-auto">
                    {flatList.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No services found</div>
                    ) : (
                      filteredGroups.map((g, gi) => {
                        // count previous subcategories only (categories are headers, not selectable)
                        const prevCount = filteredGroups.slice(0, gi).reduce((acc, cur) => acc + (cur.subcategories ? cur.subcategories.length : 0), 0);
                        return (
                          <div key={`group-${g.category.id}`} className="border-b last:border-b-0">
                            <div className="w-full text-left px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">{g.category.name}</div>
                            {g.subcategories && g.subcategories.map((s: any, si: number) => {
                              const idx = prevCount + si;
                              return (
                                <button
                                  key={`sub-${s.id}`}
                                  onMouseDown={(ev) => { ev.preventDefault(); }}
                                  onClick={() => { setLocation(`/subcategory/${s.slug}`); setShowSuggestions(false); setSearchQuery(''); }}
                                  className={`w-full text-left px-6 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${highlightIndex === idx ? 'bg-gray-100' : ''}`}
                                >
                                  <div className="flex-1">
                                    <div className="text-sm">{s.name}</div>
                                    <div className="text-xs text-gray-500">{g.category.name}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })
                    )}
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

              <Link href="/buyer-dashboard" className="relative" data-testid="button-favorites">
                <button className="p-2 hover:bg-primary/80 rounded-lg transition-colors hidden sm:block">
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {/** show wishlist count */}
                {(() => {
                  try {
                    const stored = localStorage.getItem('neapl_wishlist_v1');
                    const list = stored ? JSON.parse(stored) : [];
                    if (list && list.length > 0) {
                      return (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">{list.length}</span>
                      );
                    }
                  } catch (e) {
                    return null;
                  }
                  return null;
                })()}
              </Link>

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
                    {/* Top static pages for mobile */}
                    {topNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg ${
                          item.isActive ? 'text-primary-foreground' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid={`mobile-top-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.label}
                      </Link>
                    ))}

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