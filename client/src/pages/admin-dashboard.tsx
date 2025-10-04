
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ChevronDown
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { CategoryDialog } from "@/components/category-dialog";
import { SubcategoryDialog } from "@/components/subcategory-dialog";

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

interface Property {
  id: string;
  title: string;
  description?: string;
  price: string;
  priceType: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  furnishingStatus?: string;
  availabilityStatus?: string;
  images: string[];
  amenities: string[];
  isFeatured: boolean;
  isNegotiable: boolean;
  locationId?: string;
  categoryId?: string;
  agencyId?: string;
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
  propertyCount: number;
  createdAt: string;
}

interface PropertyPage {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  priceType: string;
  sortOrder: number;
  isActive: boolean;
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
  const sidebarItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
    { title: "Categories", icon: FileText, key: "categories", badge: "12" },
    { title: "Property Pages", icon: MapPin, key: "property-pages" },
    { title: "Users", icon: Users, key: "users" },
    { title: "Agencies", icon: Bookmark, key: "agencies" },
    { title: "Analytics", icon: BarChart3, key: "analytics" },
    { title: "Settings", icon: Settings, key: "settings" }
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Super Admin</h1>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeSection === item.key}
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveSection(item.key)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="w-full justify-start cursor-pointer"
                  onClick={() => setActiveSection('categories')}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Admin User</span>
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

// Categories Component
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

// Property Pages Section Component
function PropertyPagesSection() {
  const [pages, setPages] = useState<PropertyPage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PropertyPage | undefined>(undefined);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/property-pages');
      const data = await response.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching property pages:', error);
      setPages([]);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property page?')) return;

    try {
      const response = await fetch(`/api/admin/property-pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error deleting property page:', error);
    }
  };

  const handleToggleActive = async (page: PropertyPage) => {
    try {
      const response = await fetch(`/api/admin/property-pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...page, isActive: !page.isActive }),
      });

      if (response.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error toggling page status:', error);
    }
  };

  const handleEditPage = (page: PropertyPage) => {
    setEditingPage(page);
    setIsDialogOpen(true);
  };

  const handleAddPage = () => {
    setEditingPage(undefined);
    setIsDialogOpen(true);
  };

  const handleSavePage = async (formData: any) => {
    try {
      const url = editingPage
        ? `/api/admin/property-pages/${editingPage.id}`
        : '/api/admin/property-pages';
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPages();
        setIsDialogOpen(false);
        setEditingPage(undefined);
      }
    } catch (error) {
      console.error('Error saving property page:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Property Pages Management</h3>
          <p className="text-sm text-muted-foreground">Manage property listing pages and categories</p>
        </div>
        <Button size="sm" onClick={handleAddPage}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property Page
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPage ? 'Edit Property Page' : 'Add Property Page'}</DialogTitle>
            <DialogDescription>
              {editingPage ? 'Update property page details' : 'Create a new property listing page'}
            </DialogDescription>
          </DialogHeader>
          <PropertyPageForm
            page={editingPage}
            onSave={handleSavePage}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.id} className="group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{page.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">/{page.slug}</Badge>
                      <Badge
                        variant={page.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {page.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditPage(page)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(page)}
                  >
                    {page.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4 opacity-50" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {page.description && (
                <CardDescription className="mt-2">{page.description}</CardDescription>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price Type:</span>
                  <Badge variant="outline">{page.priceType}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sort Order:</span>
                  <span className="font-medium">{page.sortOrder}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Property Page Form Component
function PropertyPageForm({ page, onSave, onCancel }: { page?: PropertyPage; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: page?.name || '',
    slug: page?.slug || '',
    description: page?.description || '',
    icon: page?.icon || '',
    priceType: page?.priceType || 'sale',
    sortOrder: page?.sortOrder || 0,
    isActive: page?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g., home"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceType">Price Type</Label>
          <Select
            value={formData.priceType}
            onValueChange={(value) => setFormData({ ...formData, priceType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          type="number"
          value={formData.sortOrder}
          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {page ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

// Agencies Section Component
function AgenciesSection() {
  const [agencies, setAgencies] = useState<Agency[]>([]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agencies Management</h2>
          <p className="text-muted-foreground">Manage real estate agencies</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Agency
        </Button>
      </div>

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
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
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
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "categories":
        return <CategoriesSection />;
      case "property-pages":
        return <PropertyPagesSection />;
      case "users":
        return <UsersSection />;
      
      case "agencies":
        return <AgenciesSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "settings":
        return <SettingsSection />;
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
