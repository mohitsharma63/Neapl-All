import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface HostelPgFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostelPg?: any;
  onSuccess: () => void;
}

export function HostelPgForm({ open, onOpenChange, hostelPg, onSuccess }: HostelPgFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerMonth: "",
    hostelType: "boys",
    roomType: "single",
    totalBeds: "",
    availableBeds: "",
    facilities: [] as string[],
    foodIncluded: false,
    images: [] as string[],
    rules: "",
    country: "",
    stateProvince: "", // Updated field name
    city: "",
    area: "",
    fullAddress: "", // Updated field name
    contactPerson: "",
    contactPhone: "",
    isActive: true,
    isFeatured: false,
  });

  const [newFacility, setNewFacility] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (hostelPg) {
      setFormData({
        name: hostelPg.name || "",
        description: hostelPg.description || "",
        pricePerMonth: hostelPg.pricePerMonth || "",
        hostelType: hostelPg.hostelType || "boys",
        roomType: hostelPg.roomType || "single",
        totalBeds: hostelPg.totalBeds || "",
        availableBeds: hostelPg.availableBeds || "",
        facilities: hostelPg.facilities || [],
        foodIncluded: hostelPg.foodIncluded || false,
        images: hostelPg.images || [],
        rules: hostelPg.rules || "",
        country: hostelPg.country || "",
        stateProvince: hostelPg.stateProvince || "", // Updated field name
        city: hostelPg.city || "",
        area: hostelPg.area || "",
        fullAddress: hostelPg.fullAddress || "", // Updated field name
        contactPerson: hostelPg.contactPerson || "",
        contactPhone: hostelPg.contactPhone || "",
        isActive: hostelPg.isActive ?? true,
        isFeatured: hostelPg.isFeatured || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        pricePerMonth: "",
        hostelType: "boys",
        roomType: "single",
        totalBeds: "",
        availableBeds: "",
        facilities: [],
        foodIncluded: false,
        images: [],
        rules: "",
        country: "",
        stateProvince: "", // Updated field name
        city: "",
        area: "",
        fullAddress: "", // Updated field name
        contactPerson: "",
        contactPhone: "",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [hostelPg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = hostelPg
        ? `/api/admin/hostel-pg/${hostelPg.id}`
        : "/api/admin/hostel-pg";
      const method = hostelPg ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save hostel/PG");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving hostel/PG:", error);
    }
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()],
      });
      setNewFacility("");
    }
  };

  const removeFacility = (index: number) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            if (reader.result) {
              uploadedUrls.push(reader.result as string);
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hostelPg ? "Edit Hostel/PG" : "Add Hostel/PG"}</DialogTitle>
          <DialogDescription>
            {hostelPg ? "Update hostel/PG details" : "Create a new hostel/PG listing"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="pricePerMonth">Price Per Month *</Label>
              <Input
                id="pricePerMonth"
                type="number"
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="hostelType">Hostel Type *</Label>
              <Select
                value={formData.hostelType}
                onValueChange={(value) => setFormData({ ...formData, hostelType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="coed">Co-ed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="roomType">Room Type *</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData({ ...formData, roomType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                  <SelectItem value="dormitory">Dormitory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalBeds">Total Beds</Label>
              <Input
                id="totalBeds"
                type="number"
                value={formData.totalBeds}
                onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="availableBeds">Available Beds</Label>
              <Input
                id="availableBeds"
                type="number"
                value={formData.availableBeds}
                onChange={(e) => setFormData({ ...formData, availableBeds: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., Nepal"
              />
            </div>

            <div>
              <Label htmlFor="stateProvince">State/Province *</Label>
              <Input
                id="stateProvince"
                value={formData.stateProvince}
                onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                placeholder="e.g., Bagmati"
                required
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Kathmandu"
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Thamel"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="fullAddress">Full Address *</Label>
              <Textarea
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                placeholder="Enter complete address"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                rows={3}
                placeholder="Enter hostel rules and regulations"
              />
            </div>

            <div className="col-span-2">
              <Label>Facilities</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="Add facility (e.g., WiFi, Laundry)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                />
                <Button type="button" onClick={addFacility} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {facility}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFacility(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <Label>Images</Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="hostel-image-upload"
                    disabled={uploadingImage}
                  />
                  <label 
                    htmlFor="hostel-image-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploadingImage ? (
                      <div className="text-sm text-gray-600">Uploading...</div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Click to upload images or drag and drop</span>
                        <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</span>
                      </>
                    )}
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="foodIncluded"
                checked={formData.foodIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, foodIncluded: checked })}
              />
              <Label htmlFor="foodIncluded">Food Included</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {hostelPg ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}