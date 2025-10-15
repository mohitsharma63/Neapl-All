
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

type SareeClothingFormData = {
  title: string;
  description?: string;
  listingType: string;
  category: string;
  subcategory?: string;
  productType?: string;
  brand?: string;
  productName?: string;
  color?: string;
  size?: string;
  material?: string;
  fabricType?: string;
  pattern?: string;
  style?: string;
  occasion?: string;
  sareeType?: string;
  sareeLength?: string;
  blousePieceIncluded?: boolean;
  blousePieceLength?: string;
  borderType?: string;
  palluDesign?: string;
  workType?: string;
  weaveType?: string;
  transparency?: string;
  fallPicoDone?: boolean;
  gender?: string;
  ageGroup?: string;
  fitType?: string;
  sleeveType?: string;
  neckType?: string;
  length?: string;
  waistSize?: string;
  chestSize?: string;
  clothingType?: string;
  isSet?: boolean;
  setIncludes?: string[];
  comboPieces?: number;
  dupattaIncluded?: boolean;
  dupattaMaterial?: string;
  price: number;
  mrp?: number;
  discountPercentage?: number;
  rentalPricePerDay?: number;
  rentalPricePerWeek?: number;
  rentalPricePerMonth?: number;
  minimumRentalPeriod?: number;
  rentalPeriodUnit?: string;
  securityDeposit?: number;
  condition?: string;
  usageDuration?: string;
  purchaseDate?: string;
  ageInMonths?: number;
  qualityGrade?: string;
  wearCount?: number;
  isOriginal?: boolean;
  handloomCertified?: boolean;
  brandAuthorized?: boolean;
  certificateAvailable?: boolean;
  careInstructions?: string;
  washingInstructions?: string;
  dryCleanOnly?: boolean;
  ironSafe?: boolean;
  machineWashable?: boolean;
  handWashOnly?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
  sizesAvailable?: string[];
  colorsAvailable?: string[];
  readyToShip?: boolean;
  madeToOrder?: boolean;
  customizationAvailable?: boolean;
  customSizing?: boolean;
  tailoringIncluded?: boolean;
  stitchingServiceAvailable?: boolean;
  stitchingCharges?: number;
  alterationCharges?: number;
  images?: string[];
  videos?: string[];
  sizeChart?: string;
  keyFeatures?: string[];
  fabricFeatures?: string[];
  specialFeatures?: string[];
  includedItems?: string[];
  isOnSale?: boolean;
  saleEndDate?: string;
  bankOffers?: string[];
  bulkDiscountAvailable?: boolean;
  minimumOrderQuantity?: number;
  wholesaleAvailable?: boolean;
  wholesalePrice?: number;
  returnPolicy?: string;
  returnPeriodDays?: number;
  replacementPolicy?: string;
  exchangeAvailable?: boolean;
  refundAvailable?: boolean;
  warrantyAvailable?: boolean;
  warrantyPeriod?: string;
  sellerType?: string;
  shopName?: string;
  boutiqueName?: string;
  designerName?: string;
  showroomName?: string;
  contactPerson?: string;
  contactPhone: string;
  contactEmail?: string;
  alternatePhone?: string;
  whatsappAvailable?: boolean;
  whatsappNumber?: string;
  country?: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  deliveryAvailable?: boolean;
  deliveryCharges?: number;
  freeDelivery?: boolean;
  freeDeliveryAbove?: number;
  sameDayDelivery?: boolean;
  expressDelivery?: boolean;
  codAvailable?: boolean;
  estimatedDeliveryDays?: number;
  occasionSuitable?: string[];
  season?: string;
  collectionName?: string;
  launchYear?: number;
  limitedEdition?: boolean;
  handcrafted?: boolean;
  handloom?: boolean;
  madeIn?: string;
  originState?: string;
  ecoFriendly?: boolean;
  sustainableFashion?: boolean;
  traditionalWear?: boolean;
  fusionWear?: boolean;
  bridalWear?: boolean;
  partyWear?: boolean;
  casualWear?: boolean;
  formalWear?: boolean;
  ethnicWear?: boolean;
  westernWear?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  availabilityStatus?: string;
};

export default function SareeClothingShoppingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<SareeClothingFormData>();
  const listingType = watch("listingType");
  const category = watch("category");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["saree-clothing-shopping"],
    queryFn: async () => {
      const response = await fetch("/api/admin/saree-clothing-shopping");
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SareeClothingFormData) => {
      const response = await fetch("/api/admin/saree-clothing-shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saree-clothing-shopping"] });
      toast({ title: "Success", description: "Item created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SareeClothingFormData }) => {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saree-clothing-shopping"] });
      toast({ title: "Success", description: "Item updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saree-clothing-shopping"] });
      toast({ title: "Success", description: "Item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: SareeClothingFormData) => {
    const formattedData = {
      ...data,
      price: data.price ? parseFloat(data.price.toString()) : 0,
      mrp: data.mrp ? parseFloat(data.mrp.toString()) : null,
      discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage.toString()) : null,
      rentalPricePerDay: data.rentalPricePerDay ? parseFloat(data.rentalPricePerDay.toString()) : null,
      rentalPricePerWeek: data.rentalPricePerWeek ? parseFloat(data.rentalPricePerWeek.toString()) : null,
      rentalPricePerMonth: data.rentalPricePerMonth ? parseFloat(data.rentalPricePerMonth.toString()) : null,
      securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit.toString()) : null,
      stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity.toString()) : null,
      returnPeriodDays: data.returnPeriodDays ? parseInt(data.returnPeriodDays.toString()) : null,
      deliveryCharges: data.deliveryCharges ? parseFloat(data.deliveryCharges.toString()) : null,
      freeDeliveryAbove: data.freeDeliveryAbove ? parseFloat(data.freeDeliveryAbove.toString()) : null,
      stitchingCharges: data.stitchingCharges ? parseFloat(data.stitchingCharges.toString()) : null,
      alterationCharges: data.alterationCharges ? parseFloat(data.alterationCharges.toString()) : null,
      wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice.toString()) : null,
      comboPieces: data.comboPieces ? parseInt(data.comboPieces.toString()) : null,
      ageInMonths: data.ageInMonths ? parseInt(data.ageInMonths.toString()) : null,
      wearCount: data.wearCount ? parseInt(data.wearCount.toString()) : null,
      minimumOrderQuantity: data.minimumOrderQuantity ? parseInt(data.minimumOrderQuantity.toString()) : null,
      minimumRentalPeriod: data.minimumRentalPeriod ? parseInt(data.minimumRentalPeriod.toString()) : null,
      estimatedDeliveryDays: data.estimatedDeliveryDays ? parseInt(data.estimatedDeliveryDays.toString()) : null,
      launchYear: data.launchYear ? parseInt(data.launchYear.toString()) : null,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    Object.keys(item).forEach((key) => {
      setValue(key as any, item[key]);
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    reset();
  };

  const handleView = (item: any) => {
    setViewingItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Saree/Clothing/Shopping</h2>
          <p className="text-muted-foreground">Manage sarees, clothing items, and shopping products</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.listingType}</Badge>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(item)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the saree/clothing/shopping item
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" {...register("title", { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" {...register("description")} rows={3} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="listingType">Listing Type *</Label>
                        <Select onValueChange={(value) => setValue("listingType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="rent">Rent</SelectItem>
                            <SelectItem value="exchange">Exchange</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={(value) => setValue("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saree">Saree</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="ethnic-wear">Ethnic Wear</SelectItem>
                            <SelectItem value="western-wear">Western Wear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input id="subcategory" {...register("subcategory")} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" {...register("brand")} />
                      </div>

                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input id="productName" {...register("productName")} />
                      </div>

                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" {...register("color")} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="size">Size</Label>
                        <Input id="size" {...register("size")} />
                      </div>

                      <div>
                        <Label htmlFor="material">Material</Label>
                        <Input id="material" {...register("material")} />
                      </div>

                      <div>
                        <Label htmlFor="fabricType">Fabric Type</Label>
                        <Input id="fabricType" {...register("fabricType")} />
                      </div>
                    </div>

                    {category === "saree" && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="sareeType">Saree Type</Label>
                            <Select onValueChange={(value) => setValue("sareeType", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="banarasi">Banarasi</SelectItem>
                                <SelectItem value="kanjivaram">Kanjivaram</SelectItem>
                                <SelectItem value="silk">Silk</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="georgette">Georgette</SelectItem>
                                <SelectItem value="chiffon">Chiffon</SelectItem>
                                <SelectItem value="designer">Designer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="sareeLength">Saree Length</Label>
                            <Input id="sareeLength" {...register("sareeLength")} />
                          </div>

                          <div>
                            <Label htmlFor="borderType">Border Type</Label>
                            <Input id="borderType" {...register("borderType")} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              onCheckedChange={(checked) => setValue("blousePieceIncluded", checked)}
                            />
                            <Label>Blouse Piece Included</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch onCheckedChange={(checked) => setValue("fallPicoDone", checked)} />
                            <Label>Fall & Pico Done</Label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => setValue("gender", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                            <SelectItem value="boys">Boys</SelectItem>
                            <SelectItem value="girls">Girls</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <Select onValueChange={(value) => setValue("condition", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like_new">Like New</SelectItem>
                            <SelectItem value="gently_used">Gently Used</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="occasion">Occasion</Label>
                        <Input id="occasion" {...register("occasion")} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          {...register("price", { required: true })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="mrp">MRP (₹)</Label>
                        <Input id="mrp" type="number" step="0.01" {...register("mrp")} />
                      </div>

                      <div>
                        <Label htmlFor="discountPercentage">Discount %</Label>
                        <Input
                          id="discountPercentage"
                          type="number"
                          step="0.01"
                          {...register("discountPercentage")}
                        />
                      </div>
                    </div>

                    {listingType === "rent" && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="rentalPricePerDay">Rental/Day (₹)</Label>
                          <Input
                            id="rentalPricePerDay"
                            type="number"
                            step="0.01"
                            {...register("rentalPricePerDay")}
                          />
                        </div>

                        <div>
                          <Label htmlFor="rentalPricePerWeek">Rental/Week (₹)</Label>
                          <Input
                            id="rentalPricePerWeek"
                            type="number"
                            step="0.01"
                            {...register("rentalPricePerWeek")}
                          />
                        </div>

                        <div>
                          <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                          <Input
                            id="securityDeposit"
                            type="number"
                            step="0.01"
                            {...register("securityDeposit")}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Stock</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("inStock", checked)}
                          defaultChecked
                        />
                        <Label>In Stock</Label>
                      </div>

                      <div>
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input id="stockQuantity" type="number" {...register("stockQuantity")} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("isOriginal", checked)}
                          defaultChecked
                        />
                        <Label>Original Product</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("handloomCertified", checked)}
                        />
                        <Label>Handloom Certified</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("customizationAvailable", checked)}
                        />
                        <Label>Customization Available</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("exchangeAvailable", checked)}
                          defaultChecked
                        />
                        <Label>Exchange Available</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="careInstructions">Care Instructions</Label>
                      <Textarea id="careInstructions" {...register("careInstructions")} rows={3} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seller">
                <Card>
                  <CardHeader>
                    <CardTitle>Seller Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shopName">Shop Name</Label>
                        <Input id="shopName" {...register("shopName")} />
                      </div>

                      <div>
                        <Label htmlFor="boutiqueName">Boutique Name</Label>
                        <Input id="boutiqueName" {...register("boutiqueName")} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input id="contactPerson" {...register("contactPerson")} />
                      </div>

                      <div>
                        <Label htmlFor="contactPhone">Contact Phone *</Label>
                        <Input
                          id="contactPhone"
                          {...register("contactPhone", { required: true })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} />
                      </div>

                      <div>
                        <Label htmlFor="areaName">Area</Label>
                        <Input id="areaName" {...register("areaName")} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("deliveryAvailable", checked)}
                        />
                        <Label>Delivery Available</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch onCheckedChange={(checked) => setValue("freeDelivery", checked)} />
                        <Label>Free Delivery</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("sameDayDelivery", checked)}
                        />
                        <Label>Same Day Delivery</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={(checked) => setValue("codAvailable", checked)}
                          defaultChecked
                        />
                        <Label>COD Available</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryCharges">Delivery Charges (₹)</Label>
                        <Input
                          id="deliveryCharges"
                          type="number"
                          step="0.01"
                          {...register("deliveryCharges")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="freeDeliveryAbove">Free Delivery Above (₹)</Label>
                        <Input
                          id="freeDeliveryAbove"
                          type="number"
                          step="0.01"
                          {...register("freeDeliveryAbove")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingItem ? "Update" : "Create"} Item
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Item Details</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{viewingItem.title}</h3>
                <p className="text-muted-foreground">{viewingItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type:</Label>
                  <p>{viewingItem.listingType}</p>
                </div>
                <div>
                  <Label>Category:</Label>
                  <p>{viewingItem.category}</p>
                </div>
                <div>
                  <Label>Price:</Label>
                  <p>₹{viewingItem.price}</p>
                </div>
                <div>
                  <Label>Contact:</Label>
                  <p>{viewingItem.contactPhone}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
