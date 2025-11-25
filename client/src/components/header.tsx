import { Heart, User, Plus, Menu, X, Home, Building2, MapPin, Briefcase, Users as UsersIcon, GraduationCap, Settings, ChevronDown, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useRef, useState, useEffect } from "react";
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
  

  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [selectedSources, setSelectedSources] = useState<Record<string, boolean>>({});
  const [searchMode, setSearchMode] = useState<'or'|'and'>('or');

  const { data: searchSources } = useQuery({
    queryKey: ["search-sources"],
    queryFn: async () => {
      const res = await fetch('/api/search/sources');
      if (!res.ok) return { sources: [] };
      return res.json();
    },
    enabled: true,
  });

  useEffect(() => {
    // initialize selectedSources to all available when searchSources loads
    if (searchSources?.sources && Object.keys(selectedSources).length === 0) {
      const map: Record<string, boolean> = {};
      searchSources.sources.forEach((s: any) => { map[s.key] = true; });
      setSelectedSources(map);
    }
  }, [searchSources]);

  const { data: searchSuggestions } = useQuery({
    queryKey: ["search-suggestions", searchQuery, selectedSources, searchMode],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { q: searchQuery, results: {} };
      const selected = Object.keys(selectedSources || {}).filter(k => selectedSources[k]);
      const sourcesParam = selected.length > 0 ? `&sources=${encodeURIComponent(selected.join(','))}` : '';
      const modeParam = searchMode === 'and' ? '&mode=all' : '';
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5${modeParam}${sourcesParam}`);
      if (!res.ok) return { q: searchQuery, results: {} };
      return res.json();
    },
    enabled: !!searchQuery && searchQuery.length >= 2,
  });

  function getItemLink(group: string, item: any) {
    const r = item.raw || item;
    switch (group) {
      case 'properties':
        return `/properties/${r.id}`;
      case 'cars':
        return `/vehicles/${r.id}`;
      case 'rentals':
        return `/properties/rent/${r.id}`;
      case 'propertyDeals':
        return `/properties/deal/${r.id}`;
      case 'commercialProperties':
        return `/properties/commercial/${r.id}`;
      case 'officeSpaces':
        return `/properties/office/${r.id}`;
      case 'blogPosts':
        return `/blog/${r.slug || r.id}`;
      case 'articles':
        return `/articles/${r.id}`;
      case 'categories':
        return `/category/${r.raw?.slug || r.id}`;
      case 'users':
        return `/profile/${r.id}`;
      default:
        return '#';
    }
  }

  function buildSearchUrl(q: string) {
    const modeParam = searchMode === 'and' ? 'all' : 'or';
    const selected = Object.keys(selectedSources || {}).filter(k => selectedSources[k]);
    const sourcesParam = selected.length > 0 ? `&sources=${encodeURIComponent(selected.join(','))}` : '';
    return `/search?q=${encodeURIComponent(q)}&mode=${modeParam}${sourcesParam}`;
  }
  
  
  

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

  // compute backend + local combined suggestions
  const backendSuggestions = searchSuggestions?.results || {};

  // build local matches from topNav (pages) and serviceGroups (categories/subcategories)
  const localMatches: Record<string, any[]> = (() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q || q.length < 1) return {} as Record<string, any[]>;
    const tokens = q.split(/\s+/).filter(Boolean);

    const pages = topNav.filter(p => tokens.some(t => p.label.toLowerCase().includes(t))).map(p => ({ href: p.href, label: p.label }));

    const categories: any[] = [];
    const subcategories: any[] = [];
    serviceGroups.forEach((grp) => {
      const catName = (grp.category.name || '').toLowerCase();
      const catMatched = tokens.some(t => catName.includes(t));
      if (catMatched) {
        categories.push({ id: grp.category.id, name: grp.category.name, slug: grp.category.slug });
      }
      grp.subcategories.forEach((s: any) => {
        const subName = (s.name || '').toLowerCase();
        if (tokens.some(t => subName.includes(t))) {
          subcategories.push({ id: s.id, name: s.name, slug: s.slug, parent: grp.category });
        }
      });
    });

    return { pages, categories, subcategories };
  })();

  // merge backend suggestions with localMatches (concatenate arrays, avoid duplicates roughly by id/name)
  const combinedResults: Record<string, any[]> = {};
  const groups = new Set([...Object.keys(backendSuggestions), ...Object.keys(localMatches)]);
  groups.forEach((g) => {
    const fromBackend = Array.isArray(backendSuggestions[g]) ? backendSuggestions[g] : [];
    const fromLocal = Array.isArray(localMatches[g]) ? localMatches[g] : [];
    // simple merge: backend first, then local (could dedupe if needed)
    combinedResults[g] = [...fromBackend, ...fromLocal];
  });

  const combinedTotal = Object.values(combinedResults).reduce((acc: number, cur: any) => {
    if (Array.isArray(cur)) return acc + cur.length;
    return acc;
  }, 0);

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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchPopup(true)}
                 
                  className="w-full pl-10 pr-4 py-2 bg-white/90 border-white/20 focus:bg-white text-black"
                />
                {/* Close / clear icon inside the input */}
                <button
                  type="button"
                  onMouseDown={(ev) => ev.preventDefault()}
                  onClick={() => { setSearchQuery(''); setShowSearchPopup(false); }}
                  aria-label="Close search"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-white/0 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
                {/** full popup when input focused */}
                {showSearchPopup && (
                  <div className="absolute left-0 right-0 mt-2 bg-white shadow-xl rounded-md z-50 max-h-[60vh] overflow-auto p-4 text-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium">Search options</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSearchMode((m) => m === 'or' ? 'and' : 'or')}
                          className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800"
                        >Mode: {searchMode === 'or' ? 'OR' : 'AND'}</button>
                        <button onClick={() => setShowSearchPopup(false)} className="px-2 py-1 bg-gray-100 rounded text-gray-800">Close</button>
                      </div>
                    </div>

               

                

                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Pages</div>
                      <div className="flex flex-wrap gap-2">
                        {topNav.map((p) => (
                          <button
                            key={p.href}
                            onMouseDown={(ev) => ev.preventDefault()}
                            onClick={() => { setShowSearchPopup(false); setLocation(p.href); }}
                            className="text-sm px-3 py-1 bg-white border rounded text-gray-800"
                          >{p.label}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Results</div>
                      {(!searchQuery || searchQuery.length < 2) ? (
                        <div className="text-sm text-gray-500">Type at least 2 characters to search</div>
                      ) : (combinedTotal > 0) ? (
                        <div className="space-y-2">
                          {Object.entries(combinedResults).map(([group, items]) => (
                            Array.isArray(items) && items.length > 0 ? (
                              <div key={group} className="mb-1">
                                <div className="text-sm font-medium text-gray-800 px-2 py-1 capitalize">{group}</div>
                                <div className="divide-y rounded border">
                                  {items.map((it: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onMouseDown={(ev) => ev.preventDefault()}
                                      onClick={() => {
                                        setShowSearchPopup(false);
                                        // local page matches
                                        if (group === 'pages') {
                                          setLocation(it.href);
                                          return;
                                        }
                                        // local categories/subcategories
                                        if (group === 'categories') {
                                          setLocation(`/category/${it.slug}`);
                                          return;
                                        }
                                        if (group === 'subcategories') {
                                          setLocation(`/subcategory/${it.slug}`);
                                          return;
                                        }
                                        // fallback to backend item link resolver
                                        setLocation(getItemLink(group, it));
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                                    >
                                      {group === 'pages' ? (it.label) : group === 'categories' ? (it.name) : group === 'subcategories' ? (it.name + (it.parent ? ` — ${it.parent.name}` : '')) : (it.title || it.name || it.raw?.name || it.raw?.title || it.id || String(it))}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No results found</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">All categories & subcategories</div>
                      <div className="max-h-48 overflow-auto border rounded p-2">
                        {serviceGroups.map((grp) => (
                          <div key={grp.category.id} className="mb-2">
                            <div className="text-sm font-medium text-gray-800 px-2 py-1">{grp.category.name}</div>
                            <div className="flex flex-wrap gap-2 px-2">
                              <button
                                onMouseDown={(ev) => ev.preventDefault()}
                                onClick={() => { setShowSearchPopup(false); setLocation(`/category/${grp.category.slug}`); }}
                                className="text-xs px-2 py-1 bg-white border rounded text-gray-800"
                              >All in {grp.category.name}</button>
                              {grp.subcategories.map((s: any) => (
                                <button
                                  key={s.id}
                                  onMouseDown={(ev) => ev.preventDefault()}
                                  onClick={() => { setShowSearchPopup(false); setLocation(`/subcategory/${s.slug}`); }}
                                  className="text-xs px-2 py-1 bg-white border rounded text-gray-800"
                                >{s.name}</button>
                              ))}
                            </div>
                          </div>
                        ))}
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