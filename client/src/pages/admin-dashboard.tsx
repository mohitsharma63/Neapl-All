import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  Users,
  Building,
  MapPin,
  FileText,
  Home,
  Shield,
  Bookmark,
  Eye,
  Mail,
  Phone,
  ChevronDown,
  Pencil,
  Trash
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CategoryDialog } from "@/components/category-dialog";
import { SubcategoryDialog } from "@/components/subcategory-dialog";
import { HostelPgForm } from "@/components/hostel-pg-form";
import { ConstructionMaterialsForm } from "@/components/construction-materials-form";
import { RentalListingsForm } from "@/components/rental-listings-form";
import { OfficeSpacesForm } from "@/components/office-spaces-form";
import { IndustrialLandForm } from "@/components/industrial-land-form";


interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  subcategories?: AdminSubcategory[];
}

interface AdminSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface Agency {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  website?: string;
  propertyCount?: number;
  createdAt: string;
  updatedAt: string;
}

const iconMap: Record<string, React.ElementType> = {
  'building': Building,
  'map-pin': MapPin,
  'briefcase': Building,
  'users': Users,
  'file-text': FileText,
  'bar-chart': BarChart3,
  'settings': Settings,
};

function AppSidebar({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (section: string) => void }) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const staticItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
    { title: "Categories", icon: FileText, key: "categories" },
  ];

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">Super Admin</h1>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeSection === item.key}
                    className={`
                      w-full justify-start cursor-pointer rounded-lg transition-all duration-200
                      ${activeSection === item.key
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md hover:shadow-lg'
                        : 'hover:bg-muted/80'
                      }
                    `}
                    onClick={() => setActiveSection(item.key)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {categories.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {categories.map((category) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;
                  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                  const isExpanded = expandedCategories.has(category.id);

                  return (
                    <div key={category.id}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          tooltip={category.name}
                          isActive={activeSection === category.slug}
                          className={`
                            w-full justify-start cursor-pointer rounded-lg transition-all duration-200
                            ${activeSection === category.slug
                              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                              : 'hover:bg-muted/80'
                            }
                          `}
                          onClick={() => {
                            if (hasSubcategories) {
                              toggleCategoryExpand(category.id);
                            }
                            setActiveSection(category.slug);
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: activeSection === category.slug ? 'rgba(255,255,255,0.2)' : `${category.color}20`,
                            }}
                          >
                            <IconComponent
                              className="w-4 h-4"
                              style={{ color: activeSection === category.slug ? 'white' : category.color }}
                            />
                          </div>
                          <span className="font-medium flex-1">{category.name}</span>
                          {hasSubcategories && (
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {hasSubcategories && isExpanded && (
                        <SidebarMenuSub className="ml-2 mt-1 mb-2 border-l-2 pl-4" style={{ borderColor: `${category.color}40` }}>
                          {category.subcategories.map((subcategory) => {
                            const SubIcon = iconMap[subcategory.icon as keyof typeof iconMap] || Settings;
                            return (
                              <SidebarMenuSubItem key={subcategory.id}>
                                <SidebarMenuSubButton
                                  isActive={activeSection === subcategory.slug}
                                  onClick={() => setActiveSection(subcategory.slug)}
                                  className={`
                                    cursor-pointer rounded-md transition-all duration-200
                                    ${activeSection === subcategory.slug
                                      ? 'bg-muted font-medium'
                                      : 'hover:bg-muted/50'
                                    }
                                  `}
                                >
                                  <SubIcon className="w-4 h-4" style={{ color: category.color }} />
                                  <span>{subcategory.name}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Users"
                  isActive={activeSection === "users"}
                  className={`
                    w-full justify-start cursor-pointer rounded-lg transition-all duration-200
                    ${activeSection === "users"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('users')}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Agencies"
                  isActive={activeSection === "agencies"}
                  className={`
                    w-full justify-start cursor-pointer rounded-lg transition-all duration-200
                    ${activeSection === "agencies"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('agencies')}
                >
                  <Bookmark className="w-5 h-5" />
                  <span className="font-medium">Agencies</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Analytics"
                  isActive={activeSection === "analytics"}
                  className={`
                    w-full justify-start cursor-pointer rounded-lg transition-all duration-200
                    ${activeSection === "analytics"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('analytics')}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  isActive={activeSection === "settings"}
                  className={`
                    w-full justify-start cursor-pointer rounded-lg transition-all duration-200
                    ${activeSection === "settings"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('settings')}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="w-full justify-start cursor-pointer rounded-lg transition-all duration-200 hover:bg-green-600/10 text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300"
                  onClick={() => setActiveSection('categories')}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Category</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-muted/30 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                A
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-semibold">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@jeevika.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// Dashboard Component
function DashboardSection() {
  const [stats, setStats] = useState({
    totalProperties: '0',
    totalAgencies: '0',
    totalUsers: '0',
    totalCategories: '0'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Agencies</CardTitle>
            <div className="text-2xl font-bold">{stats.totalAgencies}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Categories Section
function CategoriesSection() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | undefined>(undefined);
  const [editingSubcategory, setEditingSubcategory] = useState<AdminSubcategory | undefined>(undefined);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('expandedCategories');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('expandedCategories', JSON.stringify(Array.from(expandedCategories)));
  }, [expandedCategories]);

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All subcategories will be deleted as well.')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleToggleCategoryActive = async (category: AdminCategory) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, isActive: !category.isActive }),
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleToggleSubcategoryActive = async (subcategory: AdminSubcategory) => {
    try {
      const response = await fetch(`/api/admin/subcategories/${subcategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subcategory, isActive: !subcategory.isActive }),
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling subcategory status:', error);
    }
  };

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: AdminSubcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryDialogOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryDialogOpen(true);
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(undefined);
    setSubcategoryDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Categories Management</h3>
          <p className="text-sm text-muted-foreground">Manage your system categories and subcategories</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddSubcategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) setEditingCategory(undefined);
        }}
        category={editingCategory}
      />
      <SubcategoryDialog
        open={subcategoryDialogOpen}
        onOpenChange={(open) => {
          setSubcategoryDialogOpen(open);
          if (!open) setEditingSubcategory(undefined);
        }}
        categories={categories}
        subcategory={editingSubcategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(categories) && categories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;

          return (
            <Card key={category.id} className="group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-lg transition-colors"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{category.slug}</Badge>
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleCategoryActive(category)}
                    >
                      {category.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4 opacity-50" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {category.description && (
                  <CardDescription className="mt-2">{category.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent>
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                      onClick={() => toggleCategoryExpand(category.id)}
                    >
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Subcategories ({category.subcategories.length})
                      </h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        )}
                      </Button>
                    </div>
                    {expandedCategories.has(category.id) && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {category.subcategories.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors group/sub">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{sub.name}</span>
                              <Badge
                                variant={sub.isActive ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {sub.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                onClick={() => handleEditSubcategory(sub)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                onClick={() => handleToggleSubcategoryActive(sub)}
                              >
                                {sub.isActive ? (
                                  <Eye className="w-3 h-3" />
                                ) : (
                                  <Eye className="w-3 h-3 opacity-50" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/sub:opacity-100 transition-opacity text-destructive"
                                onClick={() => handleDeleteSubcategory(sub.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(!category.subcategories || category.subcategories.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No subcategories yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Users Section Component
function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        fetchUsers();
        setIsCreateUserOpen(false);
        setUserForm({ username: '', email: '', firstName: '', lastName: '', phone: '', role: 'user', password: '' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users Management</h2>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={userForm.firstName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={userForm.lastName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={userForm.username}
                  onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={userForm.phone}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Agencies Section Component
function AgenciesSection() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await fetch('/api/agencies');
      const data = await response.json();
      setAgencies(data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingAgency(null);
    fetchAgencies();
  };

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agency?')) return;
    try {
      const response = await fetch(`/api/agencies/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAgencies();
      }
    } catch (error) {
      console.error('Error deleting agency:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agencies Management</h2>
          <p className="text-muted-foreground">Manage real estate agencies</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Agency
        </Button>
      </div>

      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAgency ? 'Edit Agency' : 'Add Agency'}
              </DialogTitle>
            </DialogHeader>
            {/* Assuming an AgencyForm component exists */}
            {/* <AgencyForm agency={editingAgency} onCancel={() => setShowForm(false)} onSuccess={handleSuccess} /> */}
            <p>Agency Form Placeholder</p>
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agencies.map((agency) => (
          <Card key={agency.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    {agency.propertyCount} properties
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(agency)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(agency.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agency.description && (
                  <p className="text-sm text-muted-foreground">{agency.description}</p>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  {agency.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{agency.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  {agency.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{agency.email}</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  Created: {new Date(agency.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Analytics Section Component
function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <p className="text-muted-foreground">System analytics and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Listings</span>
                <span className="font-bold">145</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Listings</span>
                <span className="font-bold">132</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sold This Month</span>
                <span className="font-bold">23</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Users</span>
                <span className="font-bold">1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active This Month</span>
                <span className="font-bold">856</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New Registrations</span>
                <span className="font-bold">42</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <Input defaultValue="Jeevika Properties" />
              </div>
              <div>
                <label className="text-sm font-medium">Site Description</label>
                <Textarea defaultValue="Your trusted real estate partner" />
              </div>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">SMTP Host</label>
                <Input placeholder="smtp.example.com" />
              </div>
              <div>
                <label className="text-sm font-medium">SMTP Port</label>
                <Input placeholder="587" />
              </div>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Hostels & PG Section Component
function HostelsPgSection() {
  const [hostels, setHostels] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [viewingHostel, setViewingHostel] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await fetch('/api/admin/hostel-pg');
      const data = await response.json();
      setHostels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setHostels([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingHostel(null);
    fetchHostels();
  };

  const handleEdit = (hostel: any) => {
    setEditingHostel(hostel);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hostel/PG?')) return;
    try {
      const response = await fetch(`/api/admin/hostel-pg/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  const handleToggleActive = async (hostel: any) => {
    try {
      const response = await fetch(`/api/admin/hostel-pg/${hostel.id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const handleToggleFeatured = async (hostel: any) => {
    try {
      const response = await fetch(`/api/admin/hostel-pg/${hostel.id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleViewDetails = (hostel: any) => {
    setViewingHostel(hostel);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hostels & PG</h2>
          <p className="text-muted-foreground">Manage hostel and paying guest accommodations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Hostel/PG
        </Button>
      </div>

      {showForm && (
        <HostelPgForm
          open={showForm}
          onOpenChange={setShowForm}
          hostelPg={editingHostel}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(hostels) && hostels.map((hostel) => (
          <Card key={hostel.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{hostel.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{hostel.hostelType}</Badge>
                    <Badge variant="outline">{hostel.roomType}</Badge>
                    {hostel.foodIncluded && <Badge variant="default">Food Included</Badge>}
                    {hostel.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(hostel)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(hostel)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(hostel.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hostel.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{hostel.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-lg text-primary">₹{hostel.pricePerMonth}/month</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Beds:</span>
                    <span className="font-medium ml-1">{hostel.totalBeds || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium ml-1">{hostel.availableBeds || 'N/A'}</span>
                  </div>
                </div>
                {(hostel.city || hostel.area) && (
                  <div className="text-sm pt-2 border-t">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {[hostel.area, hostel.city, hostel.stateProvince].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                )}
                {hostel.contactPerson && (
                  <div className="text-sm pt-2 border-t">
                    <div className="font-medium">{hostel.contactPerson}</div>
                    {hostel.contactPhone && (
                      <div className="text-muted-foreground">{hostel.contactPhone}</div>
                    )}
                  </div>
                )}
                {hostel.facilities && hostel.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {hostel.facilities.slice(0, 3).map((facility: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {hostel.facilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hostel.facilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hostel.active}
                      onCheckedChange={() => handleToggleActive(hostel)}
                    />
                    <span className="text-xs font-medium">
                      {hostel.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleToggleFeatured(hostel)}
                  >
                    {hostel.featured ? "★ Featured" : "☆ Feature"}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  Added: {new Date(hostel.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingHostel?.name}</DialogTitle>
            <DialogDescription>Complete details of the hostel/PG listing</DialogDescription>
          </DialogHeader>
          {viewingHostel && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant={viewingHostel.active ? "default" : "secondary"}>
                  {viewingHostel.active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">{viewingHostel.hostelType}</Badge>
                <Badge variant="outline">{viewingHostel.roomType}</Badge>
                {viewingHostel.foodIncluded && <Badge>Food Included</Badge>}
                {viewingHostel.featured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              {/* Price & Capacity */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price/Month</p>
                  <p className="text-lg font-bold text-primary">₹{viewingHostel.pricePerMonth}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Beds</p>
                  <p className="text-lg font-bold">{viewingHostel.totalBeds || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Available Beds</p>
                  <p className="text-lg font-bold text-green-600">{viewingHostel.availableBeds || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="text-lg font-bold">
                    {viewingHostel.totalBeds > 0
                      ? `${Math.round(((viewingHostel.totalBeds - viewingHostel.availableBeds) / viewingHostel.totalBeds) * 100)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {viewingHostel.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingHostel.description}</p>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Address:</span> {viewingHostel.fullAddress}</p>
                  {viewingHostel.area && <p><span className="font-medium">Area:</span> {viewingHostel.area}</p>}
                  <p><span className="font-medium">City:</span> {viewingHostel.city}</p>
                  {viewingHostel.stateProvince && <p><span className="font-medium">State:</span> {viewingHostel.stateProvince}</p>}
                  <p><span className="font-medium">Country:</span> {viewingHostel.country}</p>
                </div>
              </div>

              {/* Contact */}
              {(viewingHostel.contactPerson || viewingHostel.contactPhone) && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    {viewingHostel.contactPerson && (
                      <p><span className="font-medium">Contact Person:</span> {viewingHostel.contactPerson}</p>
                    )}
                    {viewingHostel.contactPhone && (
                      <p><span className="font-medium">Phone:</span> {viewingHostel.contactPhone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {viewingHostel.facilities && viewingHostel.facilities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingHostel.facilities.map((facility: string, idx: number) => (
                      <Badge key={idx} variant="outline">{facility}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {viewingHostel.rules && (
                <div>
                  <h3 className="font-semibold mb-2">Rules & Regulations</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingHostel.rules}</p>
                </div>
              )}

              {/* Images */}
              {viewingHostel.images && viewingHostel.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images ({viewingHostel.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingHostel.images.map((image: string, idx: number) => (
                      <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img src={image} alt={`Hostel ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingHostel.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingHostel.updatedAt).toLocaleString()}</p>
                {viewingHostel.ownerId && <p>Owner ID: {viewingHostel.ownerId}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!hostels || hostels.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Hostels/PG Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first hostel or PG listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hostel/PG
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Construction Materials Section Component
function ConstructionMaterialsSection() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [viewingMaterial, setViewingMaterial] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/admin/construction-materials');
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingMaterial(null);
    fetchMaterials();
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      const response = await fetch(`/api/admin/construction-materials/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleViewDetails = (material: any) => {
    setViewingMaterial(material);
    setShowDetailsDialog(true);
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/construction-materials/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/construction-materials/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Construction & Building Materials</h2>
          <p className="text-muted-foreground">Manage construction materials inventory</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {showForm && (
        <ConstructionMaterialsForm
          open={showForm}
          onOpenChange={setShowForm}
          material={editingMaterial}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(materials) && materials.map((material) => (
          <Card key={material.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{material.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{material.category}</Badge>
                    {material.brand && <Badge variant="outline">{material.brand}</Badge>}
                    {material.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(material)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(material)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(material.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {material.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-lg text-primary">₹{material.price}/{material.unit}</span>
                  <Badge variant={material.stockStatus === 'in_stock' ? 'default' : 'secondary'}>
                    {material.stockStatus?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {material.supplierName && (
                  <div className="text-sm pt-2 border-t">
                    <div className="font-medium">{material.supplierName}</div>
                    {material.supplierContact && (
                      <div className="text-muted-foreground">{material.supplierContact}</div>
                    )}
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2">
                  Added: {new Date(material.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Stock: <span className="font-medium">{material.stockStatus?.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="text-lg font-bold text-primary">
                ₹{material.price}/{material.unit}
              </div>
            </CardFooter>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={material.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(material.id)}
              >
                {material.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={material.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(material.id)}
              >
                {material.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingMaterial?.name}</DialogTitle>
            <DialogDescription>Complete material details</DialogDescription>
          </DialogHeader>
          {viewingMaterial && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingMaterial.category}</Badge>
                {viewingMaterial.brand && <Badge variant="outline">{viewingMaterial.brand}</Badge>}
                <Badge variant={viewingMaterial.stockStatus === 'in_stock' ? 'default' : 'secondary'}>
                  {viewingMaterial.stockStatus?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{viewingMaterial.price}/{viewingMaterial.unit}</p>
                </div>
                {viewingMaterial.minimumOrder && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Min. Order</p>
                    <p className="text-lg font-bold">{viewingMaterial.minimumOrder} {viewingMaterial.unit}</p>
                  </div>
                )}
              </div>

              {viewingMaterial.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingMaterial.description}</p>
                </div>
              )}

              {viewingMaterial.specifications && Object.keys(viewingMaterial.specifications).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(viewingMaterial.specifications).map(([key, value]) => (
                      <Badge key={key} variant="outline">{key}: {value as string}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingMaterial.images && viewingMaterial.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images ({viewingMaterial.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingMaterial.images.map((image: string, idx: number) => (
                      <img key={idx} src={image} alt={`Material ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!materials || materials.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Materials Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first construction material</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Property Deals Section Component
function PropertyDealsSection() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/property-deals');
      const data = await response.json();
      setDeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching property deals:', error);
      setDeals([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property deal?')) return;
    try {
      const response = await fetch(`/api/admin/property-deals/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDeals();
      }
    } catch (error) {
      console.error('Error deleting property deal:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/property-deals/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchDeals();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/property-deals/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchDeals();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Deals (Buy/Sell)</h2>
          <p className="text-muted-foreground">Manage property buy and sell listings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(deals) && deals.map((deal) => (
          <Card key={deal.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{deal.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{deal.propertyType}</Badge>
                    <Badge variant="outline">{deal.listingType}</Badge>
                    {deal.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(deal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{deal.price}</span>
                  <Badge variant={deal.isActive ? 'default' : 'secondary'}>
                    {deal.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {deal.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {deal.city}, {deal.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={deal.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(deal.id)}
              >
                {deal.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={deal.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(deal.id)}
              >
                {deal.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!deals || deals.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Property Deals Found</h3>
            <p className="text-muted-foreground">No property deals available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Commercial Properties Section Component
function CommercialPropertiesSection() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/commercial-properties');
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching commercial properties:', error);
      setProperties([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this commercial property?')) return;
    try {
      const response = await fetch(`/api/admin/commercial-properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting commercial property:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/commercial-properties/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/commercial-properties/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Local Market Commercial Properties</h2>
          <p className="text-muted-foreground">Manage commercial property listings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(properties) && properties.map((property) => (
          <Card key={property.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{property.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{property.commercialType}</Badge>
                    <Badge variant="outline">{property.listingType}</Badge>
                    {property.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{property.price}</span>
                  <Badge variant={property.isActive ? 'default' : 'secondary'}>
                    {property.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {property.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property.city}, {property.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={property.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(property.id)}
              >
                {property.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={property.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(property.id)}
              >
                {property.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!properties || properties.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Commercial Properties Found</h3>
            <p className="text-muted-foreground">No commercial properties available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Industrial Land Section Component
function IndustrialLandSection() {
  const [lands, setLands] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLand, setEditingLand] = useState(null);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await fetch('/api/admin/industrial-land');
      const data = await response.json();
      setLands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching industrial land:', error);
      setLands([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingLand(null);
    fetchLands();
  };

  const handleEdit = (land: any) => {
    setEditingLand(land);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this industrial land?')) return;
    try {
      const response = await fetch(`/api/admin/industrial-land/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchLands();
      }
    } catch (error) {
      console.error('Error deleting industrial land:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/industrial-land/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchLands();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/industrial-land/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchLands();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Factory Industrial Land</h2>
          <p className="text-muted-foreground">Manage industrial land listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Industrial Land
        </Button>
      </div>

      {showForm && (
        <IndustrialLandForm
          open={showForm}
          onOpenChange={setShowForm}
          land={editingLand}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(lands) && lands.map((land) => (
          <Card key={land.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{land.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{land.landType}</Badge>
                    <Badge variant="outline">{land.listingType}</Badge>
                    {land.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(land)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(land.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {land.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{land.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{land.price}</span>
                  <Badge variant={land.isActive ? 'default' : 'secondary'}>
                    {land.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {land.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {land.city}, {land.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={land.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(land.id)}
              >
                {land.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={land.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(land.id)}
              >
                {land.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!lands || lands.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Industrial Land Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first industrial land listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Industrial Land
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Office Spaces Section Component
function OfficeSpacesSection() {
  const [offices, setOffices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const response = await fetch('/api/admin/office-spaces');
      const data = await response.json();
      setOffices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching office spaces:', error);
      setOffices([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingOffice(null);
    fetchOffices();
  };

  const handleEdit = (office: any) => {
    setEditingOffice(office);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this office space?')) return;
    try {
      const response = await fetch(`/api/admin/office-spaces/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchOffices();
      }
    } catch (error) {
      console.error('Error deleting office space:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/office-spaces/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchOffices();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/office-spaces/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchOffices();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Company Office Spaces</h2>
          <p className="text-muted-foreground">Manage office space listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Office Space
        </Button>
      </div>

      {showForm && (
        <OfficeSpacesForm
          open={showForm}
          onOpenChange={setShowForm}
          office={editingOffice}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(offices) && offices.map((office) => (
          <Card key={office.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{office.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{office.officeType}</Badge>
                    <Badge variant="outline">{office.listingType}</Badge>
                    {office.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(office)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(office.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {office.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{office.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{office.price}</span>
                  <Badge variant={office.isActive ? 'default' : 'secondary'}>
                    {office.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {office.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {office.city}, {office.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={office.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(office.id)}
              >
                {office.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={office.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(office.id)}
              >
                {office.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!offices || offices.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Office Spaces Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first office space listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Office Space
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Rental Listings Section Component
function RentalListingsSection() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/admin/rental-listings');
      const data = await response.json();
      setRentals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching rental listings:', error);
      setRentals([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingRental(null);
    fetchRentals();
  };

  const handleEdit = (rental: any) => {
    setEditingRental(rental);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rental listing?')) return;
    try {
      const response = await fetch(`/api/admin/rental-listings/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchRentals();
      }
    } catch (error) {
      console.error('Error deleting rental listing:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/rental-listings/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchRentals();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/rental-listings/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchRentals();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rental – Rooms, Flats, Apartments</h2>
          <p className="text-muted-foreground">Manage rental property listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rental Listing
        </Button>
      </div>

      {showForm && (
        <RentalListingsForm
          open={showForm}
          onOpenChange={setShowForm}
          rental={editingRental}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(rentals) && rentals.map((rental) => (
          <Card key={rental.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{rental.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{rental.rentalType}</Badge>
                    {rental.furnishingStatus && <Badge variant="outline">{rental.furnishingStatus}</Badge>}
                    {rental.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(rental)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(rental.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rental.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{rental.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{rental.price}/month</span>
                  <Badge variant={rental.isActive ? 'default' : 'secondary'}>
                    {rental.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {rental.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {rental.city}, {rental.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={rental.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(rental.id)}
              >
                {rental.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={rental.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(rental.id)}
              >
                {rental.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!rentals || rentals.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Rental Listings Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first rental listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rental Listing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem('activeSection');
    return saved || "dashboard";
  });
  const [loading] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const renderSection = () => {
    // Normalize the active section to handle different slug formats
    const normalizedSection = activeSection.toLowerCase().replace(/\s+/g, '-');

    switch (normalizedSection) {
      case "dashboard":
        return <DashboardSection />;
      case "categories":
        return <CategoriesSection />;
      case "users":
        return <UsersSection />;
      case "agencies":
        return <AgenciesSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "settings":
        return <SettingsSection />;
      case "hostels-&-pg":
      case "hostels-pg":
      case "hostel-pg":
        return <HostelsPgSection />;
      case "construction-&-building-materials":
      case "construction-materials":
        return <ConstructionMaterialsSection />;
      case "property-deals-(buy/sell)":
      case "property-deals":
        return <PropertyDealsSection />;
      case "local-market-commercial-property":
      case "commercial-properties":
        return <CommercialPropertiesSection />;
      case "factory-industrial-land":
      case "industrial-land":
        return <IndustrialLandSection />;
      case "company-office-space":
      case "office-spaces":
        return <OfficeSpacesSection />;
      case "rental-–-rooms,-flats,-apartments":
      case "rental-listings":
        return <RentalListingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center border-b px-6 bg-card">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-px bg-border mx-4" />
            <div>
              <h1 className="text-lg font-semibold capitalize">{activeSection.replace('-', ' ')}</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            {renderSection()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}