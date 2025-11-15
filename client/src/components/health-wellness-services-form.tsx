
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

interface HealthWellnessServicesFormProps {
  onSuccess?: () => void;
  editingService?: any;
}

export default function HealthWellnessServicesForm({ onSuccess, editingService }: HealthWellnessServicesFormProps) {
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
    defaultValues: editingService || {
      serviceType: 'clinic',
      consultationType: 'in_person',
      isActive: true,
      isFeatured: false,
      emergencyService: false,
      homeVisit: false,
      onlineConsultation: false,
      appointmentRequired: true,
      insuranceAccepted: false,
      wheelchairAccessible: false,
      parkingAvailable: false,
      available24_7: false,
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

      const url = editingService
        ? `/api/admin/health-wellness-services/${editingService.id}`
        : '/api/admin/health-wellness-services';

      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save service');
      }

      toast({
        title: "Success",
        description: editingService ? "Service updated successfully" : "Service created successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save service",
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
          <CardTitle>Service Information</CardTitle>
          <CardDescription>Enter the basic details of your health & wellness service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Service Title *</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="e.g., General Health Clinic" />
            {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Describe your services..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select onValueChange={(value) => setValue("serviceType", value)} defaultValue={watch("serviceType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="diagnostic_center">Diagnostic Center</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="yoga_center">Yoga Center</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="spa">Spa</SelectItem>
                  <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                  <SelectItem value="dental_clinic">Dental Clinic</SelectItem>
                  <SelectItem value="eye_care">Eye Care</SelectItem>
                  <SelectItem value="mental_health">Mental Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" {...register("specialization")} placeholder="e.g., Cardiology" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consultationType">Consultation Type</Label>
              <Select onValueChange={(value) => setValue("consultationType", value)} defaultValue={watch("consultationType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
              <Input id="consultationFee" type="number" {...register("consultationFee")} placeholder="500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctorName">Doctor/Practitioner Name</Label>
              <Input id="doctorName" {...register("doctorName")} placeholder="Dr. John Doe" />
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
              <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="clinic@example.com" />
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
            <Label htmlFor="fullAddress">Full Address *</Label>
            <Textarea id="fullAddress" {...register("fullAddress", { required: true })} placeholder="Complete address" />
            {errors.fullAddress && <span className="text-red-500 text-sm">Address is required</span>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city", { required: true })} placeholder="Mumbai" />
            </div>

            <div>
              <Label htmlFor="stateProvince">State</Label>
              <Input id="stateProvince" {...register("stateProvince")} placeholder="Maharashtra" />
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
          <CardTitle>Service Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="emergencyService" onCheckedChange={(checked) => setValue("emergencyService", checked)} defaultChecked={watch("emergencyService")} />
              <Label htmlFor="emergencyService">Emergency Service</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="homeVisit" onCheckedChange={(checked) => setValue("homeVisit", checked)} defaultChecked={watch("homeVisit")} />
              <Label htmlFor="homeVisit">Home Visit</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="onlineConsultation" onCheckedChange={(checked) => setValue("onlineConsultation", checked)} defaultChecked={watch("onlineConsultation")} />
              <Label htmlFor="onlineConsultation">Online Consultation</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="appointmentRequired" onCheckedChange={(checked) => setValue("appointmentRequired", checked)} defaultChecked={watch("appointmentRequired")} />
              <Label htmlFor="appointmentRequired">Appointment Required</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="insuranceAccepted" onCheckedChange={(checked) => setValue("insuranceAccepted", checked)} defaultChecked={watch("insuranceAccepted")} />
              <Label htmlFor="insuranceAccepted">Insurance Accepted</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="wheelchairAccessible" onCheckedChange={(checked) => setValue("wheelchairAccessible", checked)} defaultChecked={watch("wheelchairAccessible")} />
              <Label htmlFor="wheelchairAccessible">Wheelchair Accessible</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="parkingAvailable" onCheckedChange={(checked) => setValue("parkingAvailable", checked)} defaultChecked={watch("parkingAvailable")} />
              <Label htmlFor="parkingAvailable">Parking Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} defaultChecked={watch("available24_7")} />
              <Label htmlFor="available24_7">24/7 Available</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workingHours">Working Hours</Label>
              <Input id="workingHours" {...register("workingHours")} placeholder="9:00 AM - 6:00 PM" />
            </div>

            <div>
              <Label htmlFor="experienceYears">Experience (Years)</Label>
              <Input id="experienceYears" type="number" {...register("experienceYears")} placeholder="10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editingService ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
