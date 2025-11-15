
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface JewelryAccessoriesFormProps {
  onSuccess?: () => void;
  editingItem?: any;
}

export default function JewelryAccessoriesForm({ onSuccess, editingItem }: JewelryAccessoriesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let storedUserId = localStorage.getItem('userId');
    let storedUserRole = localStorage.getItem('userRole');

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

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: editingItem || {
      category: 'necklace',
      listingType: 'sell',
      condition: 'new',
      isActive: true,
      isFeatured: false,
      hallmarked: false,
      certified: false,
      customizable: false,
      giftWrapping: false,
      returnPolicy: false,
      codAvailable: false,
      freeShipping: false,
    }
  });

  const onSubmit = async (data: any) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        userId,
        role: userRole || 'user',
      };

      const url = editingItem
        ? `/api/admin/jewelry-accessories/${editingItem.id}`
        : '/api/admin/jewelry-accessories';

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save item');
      }

      toast({
        title: "Success",
        description: editingItem ? "Item updated successfully" : "Item created successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the basic details of your jewelry or accessory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Product Title *</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="e.g., Gold Plated Necklace" />
            {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Describe the product..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value)} defaultValue={watch("category")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="necklace">Necklace</SelectItem>
                  <SelectItem value="earrings">Earrings</SelectItem>
                  <SelectItem value="ring">Ring</SelectItem>
                  <SelectItem value="bracelet">Bracelet</SelectItem>
                  <SelectItem value="pendant">Pendant</SelectItem>
                  <SelectItem value="chain">Chain</SelectItem>
                  <SelectItem value="bangles">Bangles</SelectItem>
                  <SelectItem value="watch">Watch</SelectItem>
                  <SelectItem value="anklet">Anklet</SelectItem>
                  <SelectItem value="nose_pin">Nose Pin</SelectItem>
                  <SelectItem value="hair_accessories">Hair Accessories</SelectItem>
                  <SelectItem value="belt">Belt</SelectItem>
                  <SelectItem value="sunglasses">Sunglasses</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="handbag">Handbag</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="listingType">Listing Type *</Label>
              <Select onValueChange={(value) => setValue("listingType", value)} defaultValue={watch("listingType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material">Material</Label>
              <Input id="material" {...register("material")} placeholder="e.g., Gold, Silver, Diamond" />
            </div>

            <div>
              <Label htmlFor="purity">Purity/Karat</Label>
              <Input id="purity" {...register("purity")} placeholder="e.g., 22K, 18K, 925" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" {...register("weight")} placeholder="e.g., 10 grams" />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} placeholder="Brand name" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select onValueChange={(value) => setValue("condition", value)} defaultValue={watch("condition")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setValue("gender", value)} defaultValue={watch("gender")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" {...register("price", { required: true })} placeholder="5000" />
              {errors.price && <span className="text-red-500 text-sm">Price is required</span>}
            </div>

            <div>
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input id="originalPrice" type="number" {...register("originalPrice")} placeholder="7000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" {...register("discount")} placeholder="20" />
            </div>

            <div>
              <Label htmlFor="makingCharges">Making Charges (₹)</Label>
              <Input id="makingCharges" type="number" {...register("makingCharges")} placeholder="500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shopName">Shop/Business Name</Label>
              <Input id="shopName" {...register("shopName")} placeholder="Jewelers name" />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input id="contactPhone" {...register("contactPhone", { required: true })} placeholder="+91 9876543210" />
              {errors.contactPhone && <span className="text-red-500 text-sm">Phone is required</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="shop@example.com" />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} placeholder="https://example.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...register("address")} placeholder="Shop address" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} placeholder="Mumbai" />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} placeholder="Maharashtra" />
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" {...register("pincode")} placeholder="400001" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="hallmarked" onCheckedChange={(checked) => setValue("hallmarked", checked)} defaultChecked={watch("hallmarked")} />
              <Label htmlFor="hallmarked">Hallmarked</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="certified" onCheckedChange={(checked) => setValue("certified", checked)} defaultChecked={watch("certified")} />
              <Label htmlFor="certified">Certified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="customizable" onCheckedChange={(checked) => setValue("customizable", checked)} defaultChecked={watch("customizable")} />
              <Label htmlFor="customizable">Customizable</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="giftWrapping" onCheckedChange={(checked) => setValue("giftWrapping", checked)} defaultChecked={watch("giftWrapping")} />
              <Label htmlFor="giftWrapping">Gift Wrapping</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="returnPolicy" onCheckedChange={(checked) => setValue("returnPolicy", checked)} defaultChecked={watch("returnPolicy")} />
              <Label htmlFor="returnPolicy">Return Policy</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="codAvailable" onCheckedChange={(checked) => setValue("codAvailable", checked)} defaultChecked={watch("codAvailable")} />
              <Label htmlFor="codAvailable">COD Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="freeShipping" onCheckedChange={(checked) => setValue("freeShipping", checked)} defaultChecked={watch("freeShipping")} />
              <Label htmlFor="freeShipping">Free Shipping</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
}
