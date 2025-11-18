import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Pill, Clock, Truck } from "lucide-react";

type PharmacyFormData = {
  title: string;
  description?: string;
  listingType: string;
  storeName: string;
  pharmacyName?: string;
  licenseNumber?: string;
  establishmentYear?: number;
  ownerName?: string;
  pharmacistName?: string;
  pharmacistQualification?: string;
  pharmacistRegistrationNumber?: string;
  prescriptionMedicines?: boolean;
  otcMedicines?: boolean;
  ayurvedicProducts?: boolean;
  homeopathicMedicines?: boolean;
  surgicalItems?: boolean;
  medicalDevices?: boolean;
  healthcareProducts?: boolean;
  babyCareProducts?: boolean;
  homeDelivery?: boolean;
  freeHomeDelivery?: boolean;
  minimumOrderForFreeDelivery?: number;
  deliveryCharges?: number;
  sameDayDelivery?: boolean;
  emergencyDelivery?: boolean;
  prescriptionUpload?: boolean;
  onlineConsultation?: boolean;
  medicineReminderService?: boolean;
  chronicDiseaseMedicines?: boolean;
  cancerMedicines?: boolean;
  diabeticCare?: boolean;
  cardiacCare?: boolean;
  pediatricMedicines?: boolean;
  geriatricCare?: boolean;
  discountAvailable?: boolean;
  discountPercentage?: number;
  seniorCitizenDiscount?: boolean;
  seniorCitizenDiscountPercentage?: number;
  loyaltyProgram?: boolean;
  subscriptionAvailable?: boolean;
  genericMedicinesAvailable?: boolean;
  coldStorageAvailable?: boolean;
  refrigeratedMedicines?: boolean;
  vaccineStorage?: boolean;
  drugLicenseNumber?: string;
  fssaiLicense?: string;
  isoCertified?: boolean;
  authenticMedicinesGuaranteed?: boolean;
  open24_7?: boolean;
  workingHours?: string;
  workingDays?: string;
  emergencyServices?: boolean;
  nightServiceAvailable?: boolean;
  cashPayment?: boolean;
  cardPayment?: boolean;
  upiPayment?: boolean;
  digitalWallets?: boolean;
  insuranceAccepted?: boolean;
  creditFacility?: boolean;
  bloodPressureCheck?: boolean;
  bloodSugarCheck?: boolean;
  temperatureCheck?: boolean;
  nebulizationService?: boolean;
  injectionService?: boolean;
  firstAidAvailable?: boolean;
  healthSupplements?: boolean;
  vitaminsMinerals?: boolean;
  proteinSupplements?: boolean;
  immunityBoosters?: boolean;
  herbalProducts?: boolean;
  wheelchairsAvailable?: boolean;
  walkersCrutches?: boolean;
  bpMonitors?: boolean;
  glucometers?: boolean;
  thermometers?: boolean;
  nebulizers?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  alternatePhone?: string;
  whatsappAvailable?: boolean;
  whatsappNumber?: string;
  landlineNumber?: string;
  emergencyContact?: string;
  country?: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress: string;
  landmark?: string;
  pincode?: string;
  deliveryRadiusKm?: number;
  parkingAvailable?: boolean;
  wheelchairAccessible?: boolean;
  acStore?: boolean;
  sanitizedStore?: boolean;
  covidSafetyMeasures?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  userId?: string | null; // Added userId
  role?: string | null; // Added role
};

interface PharmacyMedicalStoresFormProps {
  onSuccess?: () => void;
  editingStore?: any;
  onCancel?: () => void;
}

export default function PharmacyMedicalStoresForm({ onSuccess, editingStore, onCancel }: PharmacyMedicalStoresFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<any>(null);
  const [viewingPharmacy, setViewingPharmacy] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<PharmacyFormData>();

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
    if (editingStore) {
      setEditingPharmacy(editingStore); // Set editingPharmacy here
      Object.keys(editingStore).forEach((key) => {
        setValue(key as any, editingStore[key]);
      });
      setIsDialogOpen(true); // Open dialog if editingStore is provided
    } else {
      // If not editing, ensure the dialog is closed and state is reset
      setIsDialogOpen(false);
      setEditingPharmacy(null);
      reset();
    }
  }, [editingStore, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: async (data: PharmacyFormData) => {
      const response = await fetch("/api/admin/pharmacy-medical-stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create pharmacy");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-medical-stores"] });
      toast({ title: "Success", description: "Pharmacy created successfully" });
      handleCloseDialog();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PharmacyFormData }) => {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update pharmacy");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-medical-stores"] });
      toast({ title: "Success", description: "Pharmacy updated successfully" });
      handleCloseDialog();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete pharmacy");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-medical-stores"] });
      toast({ title: "Success", description: "Pharmacy deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPharmacy(null);
    reset();
    onCancel?.();
  };

  const handleEdit = (pharmacy: any) => {
    setEditingPharmacy(pharmacy);
    Object.keys(pharmacy).forEach((key) => {
      setValue(key as any, pharmacy[key]);
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: PharmacyFormData) => {
    const dataWithUser = {
      ...data,
      userId,
      role: userRole,
    };

    if (editingPharmacy) {
      updateMutation.mutate({ id: editingPharmacy.id, data: dataWithUser });
    } else {
      createMutation.mutate(dataWithUser);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Pharmacy
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPharmacy ? "Edit" : "Add New"} Pharmacy/Medical Store</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" {...register("title", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listingType">Listing Type *</Label>
                    <Select onValueChange={(value) => setValue("listingType", value)} defaultValue={watch("listingType") || editingPharmacy?.listingType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="medical_store">Medical Store</SelectItem>
                        <SelectItem value="medicine_shop">Medicine Shop</SelectItem>
                        <SelectItem value="online_pharmacy">Online Pharmacy</SelectItem>
                        <SelectItem value="veterinary_pharmacy">Veterinary Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input id="storeName" {...register("storeName", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                    <Input id="pharmacyName" {...register("pharmacyName")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input id="licenseNumber" {...register("licenseNumber")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishmentYear">Establishment Year</Label>
                    <Input id="establishmentYear" type="number" {...register("establishmentYear", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" {...register("ownerName")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pharmacistName">Pharmacist Name</Label>
                    <Input id="pharmacistName" {...register("pharmacistName")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products & Services */}
            <Card>
              <CardHeader>
                <CardTitle>Products & Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="prescriptionMedicines" {...register("prescriptionMedicines")} defaultChecked={watch("prescriptionMedicines") || editingPharmacy?.prescriptionMedicines} />
                    <Label htmlFor="prescriptionMedicines">Prescription Medicines</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="otcMedicines" {...register("otcMedicines")} defaultChecked={watch("otcMedicines") || editingPharmacy?.otcMedicines} />
                    <Label htmlFor="otcMedicines">OTC Medicines</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="ayurvedicProducts" {...register("ayurvedicProducts")} defaultChecked={watch("ayurvedicProducts") || editingPharmacy?.ayurvedicProducts} />
                    <Label htmlFor="ayurvedicProducts">Ayurvedic Products</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="homeopathicMedicines" {...register("homeopathicMedicines")} defaultChecked={watch("homeopathicMedicines") || editingPharmacy?.homeopathicMedicines} />
                    <Label htmlFor="homeopathicMedicines">Homeopathic</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="surgicalItems" {...register("surgicalItems")} defaultChecked={watch("surgicalItems") || editingPharmacy?.surgicalItems} />
                    <Label htmlFor="surgicalItems">Surgical Items</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="medicalDevices" {...register("medicalDevices")} defaultChecked={watch("medicalDevices") || editingPharmacy?.medicalDevices} />
                    <Label htmlFor="medicalDevices">Medical Devices</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="homeDelivery" {...register("homeDelivery")} defaultChecked={watch("homeDelivery") || editingPharmacy?.homeDelivery} />
                    <Label htmlFor="homeDelivery">Home Delivery</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="sameDayDelivery" {...register("sameDayDelivery")} defaultChecked={watch("sameDayDelivery") || editingPharmacy?.sameDayDelivery} />
                    <Label htmlFor="sameDayDelivery">Same Day Delivery</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryCharges">Delivery Charges (₹)</Label>
                    <Input id="deliveryCharges" type="number" {...register("deliveryCharges", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadiusKm">Delivery Radius (KM)</Label>
                    <Input id="deliveryRadiusKm" type="number" {...register("deliveryRadiusKm", { valueAsNumber: true })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input id="contactPerson" {...register("contactPerson", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" {...register("contactPhone", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" {...register("whatsappNumber")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaName">Area</Label>
                    <Input id="areaName" {...register("areaName")} />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="fullAddress">Full Address *</Label>
                    <Textarea id="fullAddress" {...register("fullAddress", { required: true })} rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" {...register("pincode")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input id="landmark" {...register("landmark")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="open24_7" {...register("open24_7")} defaultChecked={watch("open24_7") || editingPharmacy?.open24_7} />
                    <Label htmlFor="open24_7">24/7 Open</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="emergencyServices" {...register("emergencyServices")} defaultChecked={watch("emergencyServices") || editingPharmacy?.emergencyServices} />
                    <Label htmlFor="emergencyServices">Emergency Services</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="parkingAvailable" {...register("parkingAvailable")} defaultChecked={watch("parkingAvailable") || editingPharmacy?.parkingAvailable} />
                    <Label htmlFor="parkingAvailable">Parking Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingPharmacy ? "Update Pharmacy" : "Add Pharmacy"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}