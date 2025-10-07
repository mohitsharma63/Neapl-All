
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CarBike {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometersDriven?: number;
  fuelType?: string;
  transmission?: string;
  ownerNumber?: number;
  registrationNumber?: string;
  registrationState?: string;
  insuranceValidUntil?: string;
  color?: string;
  images?: string[];
  documents?: string[];
  features?: string[];
  condition?: string;
  isNegotiable: boolean;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export function CarsBikesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarBike | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "sell",
    vehicleType: "car",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    kilometersDriven: "",
    fuelType: "petrol",
    transmission: "manual",
    ownerNumber: 1,
    registrationNumber: "",
    registrationState: "",
    insuranceValidUntil: "",
    color: "",
    images: [] as string[],
    documents: [] as string[],
    features: [] as string[],
    condition: "good",
    isNegotiable: false,
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    isActive: true,
    isFeatured: false,
  });

  const { data: listings = [], isLoading } = useQuery<CarBike[]>({
    queryKey: ["/api/admin/cars-bikes"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/admin/cars-bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}/toggle-active`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}/toggle-featured`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Featured status updated successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      listingType: "sell",
      vehicleType: "car",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: "",
      kilometersDriven: "",
      fuelType: "petrol",
      transmission: "manual",
      ownerNumber: 1,
      registrationNumber: "",
      registrationState: "",
      insuranceValidUntil: "",
      color: "",
      images: [],
      documents: [],
      features: [],
      condition: "good",
      isNegotiable: false,
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      isActive: true,
      isFeatured: false,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: CarBike) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      listingType: item.listingType,
      vehicleType: item.vehicleType,
      brand: item.brand,
      model: item.model,
      year: item.year,
      price: item.price.toString(),
      kilometersDriven: item.kilometersDriven?.toString() || "",
      fuelType: item.fuelType || "petrol",
      transmission: item.transmission || "manual",
      ownerNumber: item.ownerNumber || 1,
      registrationNumber: item.registrationNumber || "",
      registrationState: item.registrationState || "",
      insuranceValidUntil: item.insuranceValidUntil || "",
      color: item.color || "",
      images: item.images || [],
      documents: item.documents || [],
      features: item.features || [],
      condition: item.condition || "good",
      isNegotiable: item.isNegotiable,
      country: item.country,
      stateProvince: item.stateProvince || "",
      city: item.city || "",
      areaName: item.areaName || "",
      fullAddress: item.fullAddress || "",
      isActive: item.isActive,
      isFeatured: item.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cars & Bikes</CardTitle>
            <CardDescription>Manage vehicle listings</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                <DialogDescription>Fill in the vehicle details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., 2020 Honda City VX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="listingType">Listing Type *</Label>
                    <Select value={formData.listingType} onValueChange={(value) => setFormData({ ...formData, listingType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Honda, Toyota"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., City, Activa"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="₹"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="kilometersDriven">Kilometers Driven</Label>
                    <Input
                      id="kilometersDriven"
                      type="number"
                      value={formData.kilometersDriven}
                      onChange={(e) => setFormData({ ...formData, kilometersDriven: e.target.value })}
                      placeholder="e.g., 25000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ownerNumber">Owner Number</Label>
                    <Select value={formData.ownerNumber.toString()} onValueChange={(value) => setFormData({ ...formData, ownerNumber: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Owner</SelectItem>
                        <SelectItem value="2">2nd Owner</SelectItem>
                        <SelectItem value="3">3rd Owner</SelectItem>
                        <SelectItem value="4">4th Owner</SelectItem>
                        <SelectItem value="5">5+ Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs_work">Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      placeholder="e.g., MH12AB1234"
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationState">Registration State</Label>
                    <Input
                      id="registrationState"
                      value={formData.registrationState}
                      onChange={(e) => setFormData({ ...formData, registrationState: e.target.value })}
                      placeholder="e.g., Maharashtra"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g., White, Black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the vehicle condition, features, etc."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isNegotiable}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNegotiable: checked })}
                    />
                    <Label>Price Negotiable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.listingType}</Badge>
                  </TableCell>
                  <TableCell>{item.brand} {item.model}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>₹{item.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {item.isFeatured && <Badge variant="default">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActiveMutation.mutate(item.id)}
                      >
                        {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
