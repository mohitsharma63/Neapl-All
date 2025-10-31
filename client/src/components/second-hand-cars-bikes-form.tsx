import { useState } from "react";
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
import { Pencil, Trash2, Plus, Eye, EyeOff, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecondHandCarBike {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  vehicleType: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  kilometersDriven?: number;
  fuelType?: string;
  transmission?: string;
  ownerNumber?: number;
  registrationNumber?: string;
  registrationState?: string;
  registrationYear?: number;
  insuranceType?: string;
  insuranceValidUntil?: string;
  taxValidity?: string;
  color?: string;
  bodyType?: string;
  seatingCapacity?: number;
  engineCapacity?: number;
  mileageKmpl?: number;
  images?: string[];
  documents?: string[];
  features?: string[];
  condition?: string;
  accidentHistory: boolean;
  floodAffected: boolean;
  serviceRecordsAvailable: boolean;
  nocAvailable: boolean;
  isNegotiable: boolean;
  exchangeAccepted: boolean;
  testDriveAvailable: boolean;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  sellerType?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export function SecondHandCarsBikesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SecondHandCarBike | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "sell",
    vehicleType: "car",
    brand: "",
    model: "",
    variant: "",
    year: new Date().getFullYear(),
    price: "",
    kilometersDriven: "",
    fuelType: "petrol",
    transmission: "manual",
    ownerNumber: 1,
    registrationNumber: "",
    registrationState: "",
    registrationYear: "",
    insuranceType: "comprehensive",
    insuranceValidUntil: "",
    taxValidity: "",
    color: "",
    bodyType: "",
    seatingCapacity: "",
    engineCapacity: "",
    mileageKmpl: "",
    images: [] as string[],
    documents: [] as string[],
    features: [] as string[],
    condition: "good",
    accidentHistory: false,
    floodAffected: false,
    serviceRecordsAvailable: false,
    nocAvailable: false,
    isNegotiable: false,
    exchangeAccepted: false,
    testDriveAvailable: true,
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    sellerType: "individual",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    isActive: true,
    isFeatured: false,
    isVerified: false,
  });

  const { data: listings = [], isLoading } = useQuery<SecondHandCarBike[]>({
    queryKey: ["/api/admin/second-hand-cars-bikes"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        year: parseInt(data.year.toString()),
        price: parseFloat(data.price.toString()),
        kilometersDriven: data.kilometersDriven ? parseInt(data.kilometersDriven.toString()) : null,
        ownerNumber: data.ownerNumber ? parseInt(data.ownerNumber.toString()) : null,
        registrationYear: data.registrationYear ? parseInt(data.registrationYear.toString()) : null,
        seatingCapacity: data.seatingCapacity ? parseInt(data.seatingCapacity.toString()) : null,
        engineCapacity: data.engineCapacity ? parseInt(data.engineCapacity.toString()) : null,
        mileageKmpl: data.mileageKmpl ? parseFloat(data.mileageKmpl.toString()) : null,
        insuranceValidUntil: data.insuranceValidUntil || null,
        taxValidity: data.taxValidity || null,
      };

      const response = await fetch("/api/admin/second-hand-cars-bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/second-hand-cars-bikes"] });
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
      const payload = {
        ...data,
        year: parseInt(data.year.toString()),
        price: parseFloat(data.price.toString()),
        kilometersDriven: data.kilometersDriven ? parseInt(data.kilometersDriven.toString()) : null,
        ownerNumber: data.ownerNumber ? parseInt(data.ownerNumber.toString()) : null,
        registrationYear: data.registrationYear ? parseInt(data.registrationYear.toString()) : null,
        seatingCapacity: data.seatingCapacity ? parseInt(data.seatingCapacity.toString()) : null,
        engineCapacity: data.engineCapacity ? parseInt(data.engineCapacity.toString()) : null,
        mileageKmpl: data.mileageKmpl ? parseFloat(data.mileageKmpl.toString()) : null,
        insuranceValidUntil: data.insuranceValidUntil || null,
        taxValidity: data.taxValidity || null,
      };

      const response = await fetch(`/api/admin/second-hand-cars-bikes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/second-hand-cars-bikes"] });
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
      const response = await fetch(`/api/admin/second-hand-cars-bikes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/second-hand-cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/second-hand-cars-bikes/${id}/toggle-active`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/second-hand-cars-bikes"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/second-hand-cars-bikes/${id}/toggle-featured`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/second-hand-cars-bikes"] });
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
      variant: "",
      year: new Date().getFullYear(),
      price: "",
      kilometersDriven: "",
      fuelType: "petrol",
      transmission: "manual",
      ownerNumber: 1,
      registrationNumber: "",
      registrationState: "",
      registrationYear: "",
      insuranceType: "comprehensive",
      insuranceValidUntil: "",
      taxValidity: "",
      color: "",
      bodyType: "",
      seatingCapacity: "",
      engineCapacity: "",
      mileageKmpl: "",
      images: [],
      documents: [],
      features: [],
      condition: "good",
      accidentHistory: false,
      floodAffected: false,
      serviceRecordsAvailable: false,
      nocAvailable: false,
      isNegotiable: false,
      exchangeAccepted: false,
      testDriveAvailable: true,
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      sellerType: "individual",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      isActive: true,
      isFeatured: false,
      isVerified: false,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: SecondHandCarBike) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      listingType: item.listingType,
      vehicleType: item.vehicleType,
      brand: item.brand,
      model: item.model,
      variant: item.variant || "",
      year: item.year,
      price: item.price.toString(),
      kilometersDriven: item.kilometersDriven?.toString() || "",
      fuelType: item.fuelType || "petrol",
      transmission: item.transmission || "manual",
      ownerNumber: item.ownerNumber || 1,
      registrationNumber: item.registrationNumber || "",
      registrationState: item.registrationState || "",
      registrationYear: item.registrationYear?.toString() || "",
      insuranceType: item.insuranceType || "comprehensive",
      insuranceValidUntil: item.insuranceValidUntil || "",
      taxValidity: item.taxValidity || "",
      color: item.color || "",
      bodyType: item.bodyType || "",
      seatingCapacity: item.seatingCapacity?.toString() || "",
      engineCapacity: item.engineCapacity?.toString() || "",
      mileageKmpl: item.mileageKmpl?.toString() || "",
      images: item.images || [],
      documents: item.documents || [],
      features: item.features || [],
      condition: item.condition || "good",
      accidentHistory: item.accidentHistory,
      floodAffected: item.floodAffected,
      serviceRecordsAvailable: item.serviceRecordsAvailable,
      nocAvailable: item.nocAvailable,
      isNegotiable: item.isNegotiable,
      exchangeAccepted: item.exchangeAccepted,
      testDriveAvailable: item.testDriveAvailable,
      country: item.country,
      stateProvince: item.stateProvince || "",
      city: item.city || "",
      areaName: item.areaName || "",
      fullAddress: item.fullAddress || "",
      sellerType: item.sellerType || "individual",
      contactPerson: item.contactPerson || "",
      contactPhone: item.contactPhone || "",
      contactEmail: item.contactEmail || "",
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      isVerified: item.isVerified,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const formDataUpload = new FormData();

    Array.from(files).forEach(file => {
      formDataUpload.append('images', file);
    });

    try {
      const response = await fetch('/api/upload/vehicle-images', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Failed to upload images');

      const data = await response.json();
      const uploadedUrls = data.files.map((file: any) => file.url);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({ title: "Success", description: "Images uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
            <CardTitle>Second Hand Cars & Bikes</CardTitle>
            <CardDescription>Manage second-hand vehicle listings</CardDescription>
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
                  <div className="col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., 2020 Honda City VX Petrol"
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
                    <Label htmlFor="variant">Variant</Label>
                    <Input
                      id="variant"
                      value={formData.variant}
                      onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                      placeholder="e.g., VX, ZX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1900"
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
                        <SelectItem value="lpg">LPG</SelectItem>
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

                  <div>
                    <Label htmlFor="sellerType">Seller Type</Label>
                    <Select value={formData.sellerType} onValueChange={(value) => setFormData({ ...formData, sellerType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="dealer">Dealer</SelectItem>
                        <SelectItem value="showroom">Showroom</SelectItem>
                      </SelectContent>
                    </Select>
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

                <div className="space-y-4">
                  <div>
                    <Label>Vehicle Images</Label>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingImages}
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingImages ? "Uploading..." : "Upload Images"}
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <span className="text-sm text-muted-foreground">
                          Max 5MB per image, up to 10 images
                        </span>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Vehicle ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isNegotiable}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNegotiable: checked })}
                    />
                    <Label>Price Negotiable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.exchangeAccepted}
                      onCheckedChange={(checked) => setFormData({ ...formData, exchangeAccepted: checked })}
                    />
                    <Label>Exchange Accepted</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.testDriveAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, testDriveAvailable: checked })}
                    />
                    <Label>Test Drive Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.accidentHistory}
                      onCheckedChange={(checked) => setFormData({ ...formData, accidentHistory: checked })}
                    />
                    <Label>Accident History</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.serviceRecordsAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, serviceRecordsAvailable: checked })}
                    />
                    <Label>Service Records</Label>
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