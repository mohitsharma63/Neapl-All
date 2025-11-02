import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import {
  Home,
  Building,
  Plus,
  BarChart3,
  Settings,
  User,
  LogOut,
  MessageSquare,
  TrendingUp
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
  selectedServices?: string[];
  selectedServicesDetails?: Array<{
    slug: string;
    name: string;
    type: string;
    parentCategory?: string;
  }>;
}

function SellerSidebar({ activeSection, setActiveSection, selectedServices, categoryPreferences }: { activeSection: string; setActiveSection: (section: string) => void; selectedServices: string[]; categoryPreferences?: any[] }) {
  // Base navigation items
  const baseItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
  ];

  // Service icon mapping
  const getServiceIcon = (serviceKey: string) => {
    const iconMap: { [key: string]: any } = {
      'rental': Building,
      'hostel-pg': Building,
      'construction-materials': Building,
      'property-deals': Building,
      'commercial-properties': Building,
      'industrial-land': Building,
      'office-spaces': Building,
      'heavy-equipment': Building,
      'showrooms': Building,
      'second-hand-cars-bikes': Building,
      'car-bike-rentals': Building,
      'transportation-moving-services': Building,
      'vehicle-license-classes': Building,
      'electronics-gadgets': Building,
      'phones-tablets-accessories': Building,
      'second-hand-phones-tablets-accessories': Building,
      'cricket-sports-training': Building,
      'computer-mobile-laptop-repair-services': Building,
      'cyber-cafe-internet-services': Building,
      'event-decoration-services': Building,
      'fashion-beauty-products': Building,
      'furniture-interior-decor': Building,
      'household-services': Building,
      'saree-clothing-shopping': Building,
      'ebooks-online-courses': Building,
    };
    return iconMap[serviceKey] || Building;
  };

  // Service-specific items based on category preferences
  const serviceItems = (categoryPreferences || []).flatMap(pref => {
    const items = [];
    
    // Add category as main item
    items.push({
      title: pref.categoryName,
      icon: Building,
      key: pref.categorySlug,
      isCategory: true
    });
    
    // Add subcategories
    if (pref.subcategoriesWithNames && pref.subcategoriesWithNames.length > 0) {
      pref.subcategoriesWithNames.forEach((sub: any) => {
        items.push({
          title: sub.name,
          icon: Building,
          key: sub.slug || sub.id,
          isSubcategory: true,
          parentCategory: pref.categoryName
        });
      });
    }
    
    return items;
  });

  // Common items for all sellers
  const commonItems = [
    { title: "Analytics", icon: BarChart3, key: "analytics" },
    { title: "Inquiries", icon: MessageSquare, key: "inquiries" },
    { title: "Profile", icon: User, key: "profile" },
    { title: "Settings", icon: Settings, key: "settings" }
  ];

  const sidebarItems = [...baseItems, ...serviceItems, ...commonItems];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Seller Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {selectedServices.length > 0 
                ? `${selectedServices.length} Service${selectedServices.length > 1 ? 's' : ''} Active`
                : 'No Services Selected'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeSection === item.key}
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveSection(item.key)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {serviceItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>My Services</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {serviceItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={activeSection === item.key}
                      className="w-full justify-start cursor-pointer"
                      onClick={() => setActiveSection(item.key)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeSection === item.key}
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveSection(item.key)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Seller Account</span>
                <span className="text-xs text-muted-foreground">seller@jeevika.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function DashboardSection({ userId, selectedServices }: { userId: string; selectedServices: string[] }) {
  const [stats, setStats] = useState({
    totalListings: 0,
    totalViews: 0,
    inquiries: 0,
    activeListings: 0
  });
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all properties
        const response = await fetch('/api/properties');
        const properties = await response.json();

        // Calculate stats
        const totalViews = properties.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);

        setStats({
          totalListings: properties.length,
          totalViews: totalViews,
          inquiries: Math.floor(totalViews * 0.15), // Estimate 15% conversion
          activeListings: properties.filter((p: any) => p.availabilityStatus === 'available').length
        });

        setMyListings(properties.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Seller Overview</h2>
        <p className="text-muted-foreground">Track your property listings and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries</CardTitle>
            <div className="text-2xl font-bold">{stats.inquiries}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {myListings.length > 0 ? (
              <div className="space-y-3">
                {myListings.map((listing) => (
                  <div key={listing.id} className="flex items-center gap-3 p-2 border rounded hover:bg-accent transition-colors">
                    <Building className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{listing.title}</p>
                      <p className="text-xs text-muted-foreground">NPR {listing.price}</p>
                    </div>
                    <Badge variant={listing.availabilityStatus === 'available' ? 'default' : 'secondary'}>
                      {listing.availabilityStatus || 'available'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No listings yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Views This Week</span>
                <span className="font-bold text-green-600">+15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inquiries</span>
                <span className="font-bold text-green-600">+8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Properties</span>
                <span className="font-bold">{stats.totalListings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLocation("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        
        // Fetch fresh user data from database
        const response = await fetch(`/api/users/${userData.id}`);
        if (response.ok) {
          const freshUserData = await response.json();
          
          // Check account type
          if (freshUserData.accountType !== "seller") {
            setLocation("/");
            return;
          }
          
          setUser(freshUserData);
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(freshUserData));
          // Store globally for sidebar access
          (window as any).__currentUser = freshUserData;
        } else {
          // Fallback to stored data if API fails
          if (userData.accountType !== "seller") {
            setLocation("/");
            return;
          }
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLocation("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SellerSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          selectedServices={user.selectedServices || []}
          categoryPreferences={user.categoryPreferences || []}
        />

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center border-b px-6 bg-card justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold capitalize">{activeSection.replace('-', ' ')}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </header>

          <main className="flex-1 p-6">
            {activeSection === "dashboard" && <DashboardSection userId={user.id} selectedServices={user.selectedServices || []} />}
            {activeSection !== "dashboard" && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {(user.selectedServices || []).includes(activeSection) 
                    ? `${activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} section - Coming soon`
                    : 'Section under development'
                  }
                </p>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}