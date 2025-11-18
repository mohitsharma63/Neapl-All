import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FashionBeautyProductsFormProps {
  onSuccess?: () => void;
  editingProduct?: any;
}

export default function FashionBeautyProductsForm({ onSuccess, editingProduct }: FashionBeautyProductsFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [images, setImages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const listingType = watch("listingType");

  useEffect(() => {
    // Get userId and role from localStorage
    let storedUserId = localStorage.getItem('userId');
    let storedUserRole = localStorage.getItem('userRole');

    // If not found, try getting from user object in localStorage
    if (!storedUserId) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          storedUserId = user.id;
          storedUserRole = user.role;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }

    setUserId(storedUserId);
    setUserRole(storedUserRole);
  }, []);

  useEffect(() => {
    if (editingProduct) {
      // Populate form with existing product data
      Object.keys(editingProduct).forEach((key) => {
        setValue(key, editingProduct[key]);
      });
      if (editingProduct.images) {
        setImages(editingProduct.images);
      }
    }
  }, [editingProduct, setValue]);

  const onSubmit = async (data: any) => {
    try {
      // Convert empty strings to null for numeric fields
      const formattedData = {
        ...data,
        images,
        userId,
        role: userRole,
        price: data.price ? parseFloat(data.price) : null,
        mrp: data.mrp ? parseFloat(data.mrp) : null,
        discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage) : null,
        rentalPricePerDay: data.rentalPricePerDay ? parseFloat(data.rentalPricePerDay) : null,
        rentalPricePerWeek: data.rentalPricePerWeek ? parseFloat(data.rentalPricePerWeek) : null,
        securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit) : null,
        stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : null,
        returnPeriodDays: data.returnPeriodDays ? parseInt(data.returnPeriodDays) : null,
        deliveryCharges: data.deliveryCharges ? parseFloat(data.deliveryCharges) : null,
        freeDeliveryAbove: data.freeDeliveryAbove ? parseFloat(data.freeDeliveryAbove) : null,
      };

      const url = editingProduct
        ? `/api/admin/fashion-beauty-products/${editingProduct.id}`
        : '/api/admin/fashion-beauty-products';

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="seller">Seller Info</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input id="title" {...register("title", { required: true })} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="beauty">Beauty Products</SelectItem>
                      <SelectItem value="cosmetics">Cosmetics</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" {...register("color")} />
                </div>

                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" {...register("size")} placeholder="e.g., S, M, L, XL" />
                </div>

                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input id="material" {...register("material")} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pattern">Pattern</Label>
                  <Input id="pattern" {...register("pattern")} />
                </div>

                <div>
                  <Label htmlFor="style">Style</Label>
                  <Input id="style" {...register("style")} />
                </div>

                <div>
                  <Label htmlFor="occasion">Occasion</Label>
                  <Input id="occasion" {...register("occasion")} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fitType">Fit Type</Label>
                  <Input id="fitType" {...register("fitType")} placeholder="e.g., Slim, Regular" />
                </div>

                <div>
                  <Label htmlFor="sleeveType">Sleeve Type</Label>
                  <Input id="sleeveType" {...register("sleeveType")} />
                </div>

                <div>
                  <Label htmlFor="neckType">Neck Type</Label>
                  <Input id="neckType" {...register("neckType")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">Condition *</Label>
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
                  <Label htmlFor="qualityGrade">Quality Grade</Label>
                  <Input id="qualityGrade" {...register("qualityGrade")} />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Beauty Product Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="productVolume">Volume</Label>
                    <Input id="productVolume" {...register("productVolume")} placeholder="e.g., 50ml" />
                  </div>

                  <div>
                    <Label htmlFor="skinType">Skin Type</Label>
                    <Input id="skinType" {...register("skinType")} />
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" {...register("expiryDate")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={(checked) => setValue("dermatologicallyTested", checked)} />
                    <Label>Dermatologically Tested</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={(checked) => setValue("crueltyFree", checked)} />
                    <Label>Cruelty Free</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={(checked) => setValue("vegan", checked)} />
                    <Label>Vegan</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={(checked) => setValue("parabenFree", checked)} />
                    <Label>Paraben Free</Label>
                  </div>
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
                  <Input id="price" type="number" step="0.01" {...register("price", { required: true })} />
                </div>

                <div>
                  <Label htmlFor="mrp">MRP (₹)</Label>
                  <Input id="mrp" type="number" step="0.01" {...register("mrp")} />
                </div>

                <div>
                  <Label htmlFor="discountPercentage">Discount %</Label>
                  <Input id="discountPercentage" type="number" step="0.01" {...register("discountPercentage")} />
                </div>
              </div>

              {listingType === "rent" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rentalPricePerDay">Rental/Day (₹)</Label>
                    <Input id="rentalPricePerDay" type="number" step="0.01" {...register("rentalPricePerDay")} />
                  </div>

                  <div>
                    <Label htmlFor="rentalPricePerWeek">Rental/Week (₹)</Label>
                    <Input id="rentalPricePerWeek" type="number" step="0.01" {...register("rentalPricePerWeek")} />
                  </div>

                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                    <Input id="securityDeposit" type="number" step="0.01" {...register("securityDeposit")} />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Offers & Deals</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={(checked) => setValue("isOnSale", checked)} />
                    <Label>On Sale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={(checked) => setValue("bulkDiscountAvailable", checked)} />
                    <Label>Bulk Discount Available</Label>
                  </div>
                </div>
              </div>
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
                  <Switch onCheckedChange={(checked) => setValue("inStock", checked)} defaultChecked />
                  <Label>In Stock</Label>
                </div>

                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input id="stockQuantity" type="number" {...register("stockQuantity")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("isOriginal", checked)} defaultChecked />
                  <Label>Original Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("brandAuthorized", checked)} />
                  <Label>Brand Authorized</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("customizationAvailable", checked)} />
                  <Label>Customization Available</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("limitedEdition", checked)} />
                  <Label>Limited Edition</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="careInstructions">Care Instructions</Label>
                <Textarea id="careInstructions" {...register("careInstructions")} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="returnPeriodDays">Return Period (Days)</Label>
                  <Input id="returnPeriodDays" type="number" {...register("returnPeriodDays")} />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("exchangeAvailable", checked)} defaultChecked />
                  <Label>Exchange Available</Label>
                </div>
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
                  <Label htmlFor="shopName">Shop/Boutique Name</Label>
                  <Input id="shopName" {...register("shopName")} />
                </div>

                <div>
                  <Label htmlFor="designerName">Designer Name</Label>
                  <Input id="designerName" {...register("designerName")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" {...register("contactPerson")} />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input id="contactPhone" {...register("contactPhone", { required: true })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" {...register("contactEmail")} />
                </div>

                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input id="whatsappNumber" {...register("whatsappNumber")} />
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

              <div>
                <Label htmlFor="fullAddress">Full Address</Label>
                <Textarea id="fullAddress" {...register("fullAddress")} rows={2} />
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
                  <Switch onCheckedChange={(checked) => setValue("deliveryAvailable", checked)} />
                  <Label>Delivery Available</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("freeDelivery", checked)} />
                  <Label>Free Delivery</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("sameDayDelivery", checked)} />
                  <Label>Same Day Delivery</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch onCheckedChange={(checked) => setValue("codAvailable", checked)} defaultChecked />
                  <Label>COD Available</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryCharges">Delivery Charges (₹)</Label>
                  <Input id="deliveryCharges" type="number" step="0.01" {...register("deliveryCharges")} />
                </div>

                <div>
                  <Label htmlFor="freeDeliveryAbove">Free Delivery Above (₹)</Label>
                  <Input id="freeDeliveryAbove" type="number" step="0.01" {...register("freeDeliveryAbove")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="w-full" size="lg">
        {editingProduct ? 'Update Product' : 'Submit Listing'}
      </Button>
    </form>
  );
}