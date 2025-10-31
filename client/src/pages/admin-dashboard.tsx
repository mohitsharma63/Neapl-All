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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PropertyDealsForm } from "@/components/property-deals-form";
import { CommercialPropertiesForm } from '@/components/commercial-properties-form';
import { CarsBikesForm } from "@/components/cars-bikes-form";
import { HeavyEquipmentForm } from "@/components/heavy-equipment-form";
import { ShowroomsForm } from "@/components/showrooms-form";
import { SecondHandCarsBikesForm } from "@/components/second-hand-cars-bikes-form";
import CarBikeRentalsForm from "@/components/car-bike-rentals-form";
import {TransportationMovingServicesForm} from "@/components/transportation-moving-services-form";
import VehicleLicenseClassesForm from "@/components/vehicle-license-classes-form";
import ElectronicsGadgetsForm from "@/components/electronics-gadgets-form";
import PhonesTabletsAccessoriesForm from "@/components/phones-tablets-accessories-form";
import SecondHandPhonesTabletsAccessoriesForm from "@/components/second-hand-phones-tablets-accessories-form";
import ComputerMobileLaptopRepairServicesForm from "@/components/computer-mobile-laptop-repair-services-form";
import FurnitureInteriorDecorForm from "@/components/furniture-interior-decor-form";
import HouseholdServicesForm from "@/components/household-services-form";
import { EventDecorationServicesForm } from "@/components/event-decoration-services-form";
import FashionBeautyProductsForm from "@/components/fashion-beauty-products-form";
import SareeClothingShoppingForm from "@/components/saree-clothing-shopping-form"; // Assuming this component exists
import PharmacyMedicalStoresForm from "@/components/pharmacy-medical-stores-form";
import EbooksOnlineCoursesForm from "@/components/ebooks-online-courses-form";
import CricketSportsTrainingForm from "@/components/cricket-sports-training-form"; // Assuming this component exists

// Educational Consultancy - Study Abroad Admissions Section Component
function EducationalConsultancyStudyAbroadSection() {
  const [consultancies, setConsultancies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConsultancy, setEditingConsultancy] = useState(null);

  useEffect(() => {
    fetchConsultancies();
  }, []);

  const fetchConsultancies = async () => {
    try {
      const response = await fetch('/api/admin/educational-consultancy-study-abroad');
      const data = await response.json();
      setConsultancies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching educational consultancies:', error);
      setConsultancies([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingConsultancy(null);
    fetchConsultancies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultancy?')) return;
    try {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchConsultancies();
      }
    } catch (error) {
      console.error('Error deleting consultancy:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchConsultancies();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchConsultancies();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Educational Consultancy & Study Abroad Admissions</h2>
          <p className="text-muted-foreground">Manage educational consultancy and study abroad admissions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Consultancy
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Educational Consultancy/Study Abroad Listing</DialogTitle>
            <DialogDescription>Fill in the details to create a new listing</DialogDescription>
          </DialogHeader>
          {/* Assuming EducationalConsultancyStudyAbroadForm exists, similar to other form components */}
          {/* <EducationalConsultancyStudyAbroadForm onSuccess={handleSuccess} /> */}
          <p>Educational Consultancy Study Abroad Form Placeholder</p>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(consultancies) && consultancies.map((consultancy) => (
          <Card key={consultancy.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{consultancy.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{consultancy.specialization}</Badge>
                    <Badge variant="outline">{consultancy.country}</Badge>
                    {consultancy.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(consultancy.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultancy.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{consultancy.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">Contact: {consultancy.contactPhone || consultancy.contactEmail}</span>
                  <Badge variant={consultancy.isActive ? 'default' : 'secondary'}>
                    {consultancy.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {consultancy.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {consultancy.city}, {consultancy.country}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={consultancy.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(consultancy.id)}
              >
                {consultancy.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={consultancy.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(consultancy.id)}
              >
                {consultancy.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!consultancies || consultancies.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Consultancies Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first educational consultancy/study abroad listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Consultancy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


function EventDecorationServicesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Event & Decoration Services</h2>
          <p className="text-muted-foreground">Manage marriage halls, party venues, café setups, and decoration materials</p>
        </div>
      </div>
      <EventDecorationServicesForm />
    </div>
  );
}

// Fashion & Beauty Products Section Component
function FashionBeautyProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/fashion-beauty-products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching fashion & beauty products:', error);
      setProducts([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/fashion-beauty-products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/fashion-beauty-products/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/fashion-beauty-products/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Fashion & Beauty Products</h2>
          <p className="text-muted-foreground">Manage fashion items, clothing, accessories, and beauty products</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Fashion & Beauty Product</DialogTitle>
            <DialogDescription>Fill in the details to create a new fashion or beauty product listing</DialogDescription>
          </DialogHeader>
          <FashionBeautyProductsForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(products) && products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.listingType}</Badge>
                    {product.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{product.price}</span>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {product.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={product.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(product.id)}
              >
                {product.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={product.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(product.id)}
              >
                {product.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first fashion or beauty product</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Saree/Clothing/Shopping Section Component
function SareeClothingShoppingSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/saree-clothing-shopping');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching saree/clothing/shopping products:', error);
      setProducts([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Saree, Clothing & Shopping</h2>
          <p className="text-muted-foreground">Manage saree, clothing, and shopping products</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Saree/Clothing/Shopping Product</DialogTitle>
            <DialogDescription>Fill in the details to create a new product listing</DialogDescription>
          </DialogHeader>
          <SareeClothingShoppingForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(products) && products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.listingType}</Badge>
                    {product.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{product.price}</span>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {product.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={product.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(product.id)}
              >
                {product.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={product.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(product.id)}
              >
                {product.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first saree, clothing, or shopping product</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Pharmacy & Medical Stores Section Component
function PharmacyMedicalStoresSection() {
  const [stores, setStores] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/admin/pharmacy-medical-stores');
      const data = await response.json();
      setStores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pharmacy & medical stores:', error);
      setStores([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingStore(null);
    fetchStores();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    try {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchStores();
      }
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchStores();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchStores();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pharmacy & Medical Stores</h2>
          <p className="text-muted-foreground">Manage pharmacy and medical store listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Pharmacy/Medical Store</DialogTitle>
            <DialogDescription>Fill in the details to create a new pharmacy or medical store listing</DialogDescription>
          </DialogHeader>
          <PharmacyMedicalStoresForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(stores) && stores.map((store) => (
          <Card key={store.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{store.storeName}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{store.storeType}</Badge>
                    {store.listingType && <Badge variant="outline">{store.listingType}</Badge>}
                    {store.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(store.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {store.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant={store.isActive ? 'default' : 'secondary'}>
                    {store.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {store.ownerName && (
                  <div className="text-sm">
                    <span className="font-medium">Owner: </span>
                    <span className="text-muted-foreground">{store.ownerName}</span>
                  </div>
                )}
                {store.contactPhone && (
                  <div className="text-sm">
                    <span className="font-medium">Phone: </span>
                    <span className="text-muted-foreground">{store.contactPhone}</span>
                  </div>
                )}
                {(store.city || store.area) && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[store.area, store.city].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={store.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(store.id)}
              >
                {store.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={store.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(store.id)}
              >
                {store.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!stores || stores.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Stores Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first pharmacy or medical store</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// E-Books & Online Courses Section Component
function EbooksOnlineCoursesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">E-Books & Online Courses</h2>
          <p className="text-muted-foreground">Manage digital educational content and online learning resources</p>
        </div>
      </div>
      <EbooksOnlineCoursesForm />
    </div>
  );
}

// Cricket Sports Training Section Component
function CricketSportsTrainingSection() {
  const [training, setTraining] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  useEffect(() => {
    fetchTraining();
  }, []);

  const fetchTraining = async () => {
    try {
      const response = await fetch('/api/admin/cricket-sports-training');
      const data = await response.json();
      setTraining(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cricket sports training:', error);
      setTraining([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTraining(null);
    fetchTraining();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training program?')) return;
    try {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTraining();
      }
    } catch (error) {
      console.error('Error deleting training program:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchTraining();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchTraining();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cricket Sports Training</h2>
          <p className="text-muted-foreground">Manage cricket coaching and training programs</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Training Program
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Cricket Sports Training Program</DialogTitle>
            <DialogDescription>Fill in the details to create a new training program listing</DialogDescription>
          </DialogHeader>
          <CricketSportsTrainingForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(training) && training.map((program) => (
          <Card key={program.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{program.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{program.level}</Badge>
                    <Badge variant="outline">{program.duration}</Badge>
                    {program.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(program.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {program.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{program.price}</span>
                  <Badge variant={program.isActive ? 'default' : 'secondary'}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {program.coachName && (
                  <div className="text-sm">
                    <span className="font-medium">Coach: </span>
                    <span className="text-muted-foreground">{program.coachName}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={program.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(program.id)}
              >
                {program.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={program.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(program.id)}
              >
                {program.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!training || training.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Training Programs Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first cricket sports training program</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Training Program
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


// Household Services Section Component
function HouseholdServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingService, setViewingService] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/household-services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching household services:', error);
      setServices([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const response = await fetch(`/api/admin/household-services/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/household-services/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/household-services/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleViewDetails = (service: any) => {
    setViewingService(service);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Household Services</h2>
          <p className="text-muted-foreground">Manage household service providers</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Household Service</DialogTitle>
            <DialogDescription>Fill in the details to create a new household service listing</DialogDescription>
          </DialogHeader>
          <HouseholdServicesForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(services) && services.map((service) => (
          <Card key={service.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{service.serviceType}</Badge>
                    {service.serviceCategory && <Badge variant="outline">{service.serviceCategory}</Badge>}
                    {service.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(service)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-lg text-primary">₹{service.baseServiceCharge}</span>
                    {service.hourlyRate && (
                      <span className="text-sm text-muted-foreground ml-2">| ₹{service.hourlyRate}/hr</span>
                    )}
                  </div>
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {service.emergencyService && <Badge variant="destructive" className="text-xs">Emergency</Badge>}
                  {service.sameDayService && <Badge variant="default" className="text-xs">Same Day</Badge>}
                  {service.available24_7 && <Badge variant="default" className="text-xs">24/7</Badge>}
                  {service.freeEstimate && <Badge variant="outline" className="text-xs">Free Estimate</Badge>}
                  {service.warrantyProvided && <Badge variant="outline" className="text-xs">Warranty</Badge>}
                  {service.certifiedProfessional && <Badge variant="secondary" className="text-xs">Certified</Badge>}
                </div>

                {service.businessName && (
                  <div className="text-sm">
                    <span className="font-medium">Business: </span>
                    <span className="text-muted-foreground">{service.businessName}</span>
                  </div>
                )}
                {service.contactPerson && (
                  <div className="text-sm">
                    <span className="font-medium">Contact: </span>
                    <span className="text-muted-foreground">{service.contactPerson}</span>
                    {service.contactPhone && (
                      <span className="text-muted-foreground ml-1">• {service.contactPhone}</span>
                    )}
                  </div>
                )}
                {service.workingHours && (
                  <div className="text-sm">
                    <span className="font-medium">Hours: </span>
                    <span className="text-muted-foreground">{service.workingHours}</span>
                  </div>
                )}
                {(service.city || service.areaName) && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[service.areaName, service.city].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={service.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(service.id)}
              >
                {service.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={service.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(service.id)}
              >
                {service.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingService?.title}</DialogTitle>
            <DialogDescription>Complete service details</DialogDescription>
          </DialogHeader>
          {viewingService && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingService.serviceType}</Badge>
                {viewingService.serviceCategory && <Badge variant="outline">{viewingService.serviceCategory}</Badge>}
                {viewingService.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Base Charge</p>
                  <p className="text-lg font-bold text-primary">₹{viewingService.baseServiceCharge}</p>
                </div>
                {viewingService.hourlyRate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="text-lg font-bold">₹{viewingService.hourlyRate}/hr</p>
                  </div>
                )}
                {viewingService.minimumCharge && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Min. Charge</p>
                    <p className="text-lg font-bold">₹{viewingService.minimumCharge}</p>
                  </div>
                )}
                {viewingService.emergencyCharges && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Emergency Charge</p>
                    <p className="text-lg font-bold text-red-600">₹{viewingService.emergencyCharges}</p>
                  </div>
                )}
              </div>

              {/* Service Features */}
              <div>
                <h3 className="font-semibold mb-2">Service Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingService.emergencyService && <Badge variant="destructive">Emergency Service</Badge>}
                  {viewingService.sameDayService && <Badge variant="default">Same Day Service</Badge>}
                  {viewingService.available24_7 && <Badge variant="default">24/7 Available</Badge>}
                  {viewingService.freeInspection && <Badge variant="outline">Free Inspection</Badge>}
                  {viewingService.freeEstimate && <Badge variant="outline">Free Estimate</Badge>}
                  {viewingService.warrantyProvided && <Badge variant="outline">Warranty: {viewingService.warrantyPeriod || 'Yes'}</Badge>}
                  {viewingService.certifiedProfessional && <Badge variant="secondary">Certified Professional</Badge>}
                  {viewingService.equipmentProvided && <Badge variant="outline">Equipment Provided</Badge>}
                  {viewingService.materialsIncluded && <Badge variant="outline">Materials Included</Badge>}
                  {viewingService.homeVisitAvailable && <Badge variant="outline">Home Visit</Badge>}
                  {viewingService.consultationAvailable && <Badge variant="outline">Consultation</Badge>}
                </div>
              </div>

              {/* Service Type & Pricing */}
              <div>
                <h3 className="font-semibold mb-2">Service Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Pricing Type:</span>
                    <span className="ml-2 text-muted-foreground capitalize">{viewingService.pricingType?.replace('_', ' ')}</span>
                  </div>
                  {viewingService.workingHours && (
                    <div>
                      <span className="font-medium">Working Hours:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.workingHours}</span>
                    </div>
                  )}
                  {viewingService.workingDays && (
                    <div>
                      <span className="font-medium">Working Days:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.workingDays}</span>
                    </div>
                  )}
                  {viewingService.serviceRadiusKm && (
                    <div>
                      <span className="font-medium">Service Radius:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.serviceRadiusKm} km</span>
                    </div>
                  )}
                </div>
              </div>

              {viewingService.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingService.description}</p>
                </div>
              )}

              {viewingService.businessName && (
                <div>
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Business Name:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.businessName}</span>
                    </div>
                    {viewingService.ownerName && (
                      <div>
                        <span className="font-medium">Owner:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.ownerName}</span>
                      </div>
                    )}
                    {viewingService.experienceYears && (
                      <div>
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.experienceYears} years</span>
                      </div>
                    )}
                    {viewingService.teamSize && (
                      <div>
                        <span className="font-medium">Team Size:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.teamSize} members</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {viewingService.residentialService && <Badge variant="outline">Residential</Badge>}
                    {viewingService.commercialService && <Badge variant="outline">Commercial</Badge>}
                    {viewingService.contractAvailable && <Badge variant="outline">Contract Available</Badge>}
                    {viewingService.amcAvailable && <Badge variant="outline">AMC Available</Badge>}
                  </div>
                </div>
              )}

              {viewingService.contactPerson && (
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Contact Person:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.contactPerson}</span>
                    </div>
                    {viewingService.contactPhone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.contactPhone}</span>
                      </div>
                    )}
                    {viewingService.contactEmail && (
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.contactEmail}</span>
                      </div>
                    )}
                    {viewingService.whatsappAvailable && (
                      <div className="col-span-2">
                        <Badge variant="outline" className="bg-green-50">WhatsApp Available</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Information */}
              {viewingService.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location & Service Area
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingService.fullAddress}</p>
                    {viewingService.areaName && <p><span className="font-medium">Area:</span> {viewingService.areaName}</p>}
                    {viewingService.city && <p><span className="font-medium">City:</span> {viewingService.city}</p>}
                    {viewingService.stateProvince && <p><span className="font-medium">State:</span> {viewingService.stateProvince}</p>}
                    {viewingService.serviceRadiusKm && <p><span className="font-medium">Service Radius:</span> {viewingService.serviceRadiusKm} km</p>}
                  </div>
                </div>
              )}

              {/* Payment & Discounts */}
              <div>
                <h3 className="font-semibold mb-2">Payment & Offers</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingService.cashOnDelivery && <Badge variant="outline">Cash Payment</Badge>}
                  {viewingService.digitalPayment && <Badge variant="outline">Digital Payment</Badge>}
                  {viewingService.seniorCitizenDiscount && <Badge variant="default">Senior Citizen Discount</Badge>}
                </div>
              </div>

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingService.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingService.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!services || services.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Household Services Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first household service</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


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

// Dashboard Section
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
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

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

  const handleSuccess = () => {
    setShowForm(false);
    setEditingDeal(null);
    fetchDeals();
  };

  const handleEdit = (deal: any) => {
    setEditingDeal(deal);
    setShowForm(true);
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property Deal
        </Button>
      </div>

      {showForm && (
        <PropertyDealsForm
          open={showForm}
          onOpenChange={setShowForm}
          propertyDeal={editingDeal}
          onSuccess={handleSuccess}
        />
      )}

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
                    className="h-8 w-8"
                    onClick={() => handleEdit(deal)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
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
            <p className="text-muted-foreground mb-4">Start by adding your first property deal</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property Deal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Commercial Properties Section Component
function CommercialPropertiesSection() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

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

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setShowForm(true);
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Commercial Property
        </Button>
      </div>

      {showForm && (
        <CommercialPropertiesForm
          open={showForm}
          onOpenChange={setShowForm}
          property={editingProperty}
          onSuccess={handleSuccess}
        />
      )}

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
                    className="h-8 w-8"
                    onClick={() => handleEdit(property)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
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
            <p className="text-muted-foreground mb-4">Start by adding your first commercial property listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Commercial Property
            </Button>
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
console.log("AAAAAAAAAAAAA",normalizedSection)
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
      case "saree-shopping-clothing":
        return <SareeClothingShoppingSection />;
      case "fashion-&-beauty-products":
      case "fashion-beauty-products":
        return <FashionBeautyProductsSection />;
      case "cars-&-bikes":
      case "cars-bikes":
        return <CarsBikesSection />;
      case "heavy-equipment-for-sale":
        return <HeavyEquipmentSection />;
      case "showrooms-(authorized-second-hand)":
      case "showrooms":
        return <ShowroomsSection />;
      case "second-hand-cars-&-bikes":
      case "second-hand-cars-bikes":
        return <SecondHandCarsBikesSection />;
      case "car-&-bike-rentals":
      case "car-bike-rentals":
        return <CarBikeRentalsSection />;
      case "transportation-moving-services":
        return <TransportationMovingServicesSection />;
      case "vehicle-license-classes":
        return <VehicleLicenseClassesSection />;
      case "electronics-&-gadgets":
      case "electronics-gadgets":
        return <ElectronicsGadgetsSection />;
      case "new-phones-&-tablets-&-accessories":
      case "phones-tablets-accessories":
        return <PhonesTabletsAccessoriesSection />;
      case "second-hand-phones-&-tablets-&-accessories":
      case "second-hand-phones-tablets-accessories":
        return <SecondHandPhonesTabletsAccessoriesSection />;
      case "computer,-mobile-&-laptop-repair-services":
        return <ComputerMobileLaptopRepairServicesSection />;
      case "furniture-&-interior-decor":
      case "furniture-interior-decor":
        return <FurnitureInteriorDecorSection />;
      case "household-services":
        return <HouseholdServicesSection />;
      case "event-&-decoration-services-(marriage-halls,-parties,-café-setup,-decoration-materials)":
        return <EventDecorationServicesSection />;
      case "pharmacy-&-medical-stores":
        return <PharmacyMedicalStoresSection />;
      case "e-books-&-online-courses":
      case "ebooks-online-courses":
        return <EbooksOnlineCoursesSection />;
      case "cricket-sports-training":
        return <CricketSportsTrainingSection />;
      case "educational-consultancy-study-abroad":
        return <EducationalConsultancyStudyAbroadSection />;
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

// Cars & Bikes Section Component
function CarsBikesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cars & Bikes</h2>
          <p className="text-muted-foreground">Manage vehicle listings for cars and bikes</p>
        </div>
      </div>
      <CarsBikesForm />
    </div>
  );
}

// Heavy Equipment Section Component
function HeavyEquipmentSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Heavy Equipment for Sale</h2>
          <p className="text-muted-foreground">Manage heavy equipment listings</p>
        </div>
      </div>
      <HeavyEquipmentForm />
    </div>
  );
}

// Showrooms Section Component
function ShowroomsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Showrooms (Authorized Second-hand)</h2>
          <p className="text-muted-foreground">Manage authorized second-hand vehicle showrooms</p>
        </div>
      </div>
      <ShowroomsForm />
    </div>
  );
}

// Second Hand Cars & Bikes Section Component
function SecondHandCarsBikesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Second Hand Cars & Bikes</h2>
          <p className="text-muted-foreground">Manage second-hand vehicle listings</p>
        </div>
      </div>
      <SecondHandCarsBikesForm />
    </div>
  );
}

// Car & Bike Rentals Section Component
function CarBikeRentalsSection() {
  return (
    <div className="space-y-6">
     
      <CarBikeRentalsForm />
    </div>
  );
}

// Transportation & Moving Services Section Component
function TransportationMovingServicesSection() {
  return (
    <div className="space-y-6">
      <TransportationMovingServicesForm />
    </div>
  );
}

// Vehicle License Classes Section Component
function VehicleLicenseClassesSection() {
  return (
    <div className="space-y-6">
  
      <VehicleLicenseClassesForm />
    </div>
  );
}

// Electronics & Gadgets Section Component
function ElectronicsGadgetsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Electronics & Gadgets</h2>
          <p className="text-muted-foreground">Manage electronics and gadgets listings</p>
        </div>
      </div>
      <ElectronicsGadgetsForm />
    </div>
  );
}

// Phones, Tablets & Accessories Section Component
function PhonesTabletsAccessoriesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">New Phones, Tablets & Accessories</h2>
          <p className="text-muted-foreground">Manage new phone, tablet and accessory listings</p>
        </div>
      </div>
      <PhonesTabletsAccessoriesForm />
    </div>
  );
}

// Second Hand Phones, Tablets & Accessories Section Component
function SecondHandPhonesTabletsAccessoriesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Second Hand Phones, Tablets & Accessories</h2>
          <p className="text-muted-foreground">Manage second-hand phone, tablet and accessory listings</p>
        </div>
      </div>
      <SecondHandPhonesTabletsAccessoriesForm />
    </div>
  );
}

// Computer, Mobile & Laptop Repair Services Section Component
function ComputerMobileLaptopRepairServicesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Computer, Mobile & Laptop Repair Services</h2>
          <p className="text-muted-foreground">Manage device repair service providers</p>
        </div>
      </div>
      <ComputerMobileLaptopRepairServicesForm />
    </div>
  );
}

// Furniture & Interior Decor Section Component
function FurnitureInteriorDecorSection() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/furniture-interior-decor');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching furniture items:', error);
      setItems([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/admin/furniture-interior-decor/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/furniture-interior-decor/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/furniture-interior-decor/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleViewDetails = (item: any) => {
    setViewingItem(item);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Furniture & Interior Decor</h2>
          <p className="text-muted-foreground">Manage furniture and interior decor listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Furniture Item
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Furniture/Decor Item</DialogTitle>
            <DialogDescription>Fill in the details to create a new furniture or decor listing</DialogDescription>
          </DialogHeader>
          <FurnitureInteriorDecorForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(items) && items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.listingType}</Badge>
                    {item.condition && <Badge variant="outline">{item.condition}</Badge>}
                    {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(item)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{item.price}</span>
                  <Badge variant={item.isActive ? 'default' : 'secondary'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {item.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{item.brand}</span>
                  </div>
                )}
                {item.material && (
                  <div className="text-sm">
                    <span className="font-medium">Material: </span>
                    <span className="text-muted-foreground">{item.material}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={item.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(item.id)}
              >
                {item.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={item.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(item.id)}
              >
                {item.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingItem?.title}</DialogTitle>
            <DialogDescription>Complete furniture/decor item details</DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingItem.category}</Badge>
                <Badge variant="outline">{viewingItem.listingType}</Badge>
                {viewingItem.condition && <Badge variant="outline">{viewingItem.condition}</Badge>}
                {viewingItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{viewingItem.price}</p>
                </div>
                {viewingItem.originalPrice && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Original Price</p>
                    <p className="text-lg font-bold">₹{viewingItem.originalPrice}</p>
                  </div>
                )}
              </div>

              {viewingItem.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingItem.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewingItem.brand && (
                  <div>
                    <span className="font-medium">Brand:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.brand}</span>
                  </div>
                )}
                {viewingItem.material && (
                  <div>
                    <span className="font-medium">Material:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.material}</span>
                  </div>
                )}
                {viewingItem.color && (
                  <div>
                    <span className="font-medium">Color:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.color}</span>
                  </div>
                )}
                {viewingItem.dimensions && (
                  <div>
                    <span className="font-medium">Dimensions:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.dimensions}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingItem.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingItem.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!items || items.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Furniture Items Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first furniture/decor item</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Furniture Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}