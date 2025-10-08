
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Wifi, Monitor, Printer } from "lucide-react";

type CyberCafeFormData = {
  title: string;
  description?: string;
  cafeName: string;
  serviceType: string;
  internetPricePerHour: number;
  internetPricePerDay?: number;
  printingPriceBw?: number;
  printingPriceColor?: number;
  scanningPrice?: number;
  photocopyingPrice?: number;
  gamingPricePerHour?: number;
  totalComputers?: number;
  availableComputers?: number;
  internetSpeed?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  city?: string;
  fullAddress: string;
  workingHours?: string;
  internetBrowsing?: boolean;
  printingService?: boolean;
  scanningService?: boolean;
  photocopyingService?: boolean;
  gamingAvailable?: boolean;
  wifiAvailable?: boolean;
  acAvailable?: boolean;
  parkingAvailable?: boolean;
  open24_7?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function CyberCafeInternetServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<CyberCafeFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["cyber-cafe-internet-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/cyber-cafe-internet-services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CyberCafeFormData) => {
      const response = await fetch("/api/admin/cyber-cafe-internet-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyber-cafe-internet-services"] });
      toast({ title: "Success", description: "Service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CyberCafeFormData }) => {
      const response = await fetch(`/api/admin/cyber-cafe-internet-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyber-cafe-internet-services"] });
      toast({ title: "Success", description: "Service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cyber-cafe-internet-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyber-cafe-internet-services"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    reset();
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    Object.keys(service).forEach((key) => {
      setValue(key as any, service[key]);
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CyberCafeFormData) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'cyber_cafe':
        return <Monitor className="h-5 w-5 text-blue-600" />;
      case 'gaming_cafe':
        return <Wifi className="h-5 w-5 text-purple-600" />;
      case 'internet_cafe':
        return <Wifi className="h-5 w-5 text-green-600" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cyber Café / Internet Services</h2>
          <p className="text-muted-foreground">Manage cyber café and internet service providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      {getServiceIcon(service.serviceType)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.cafeName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.serviceType.replace('_', ' ')}</Badge>
                          {service.wifiAvailable && <Badge className="bg-blue-600">WiFi</Badge>}
                          {service.acAvailable && <Badge className="bg-green-600">AC</Badge>}
                          {service.open24_7 && <Badge className="bg-purple-600">24/7</Badge>}
                          {service.gamingAvailable && <Badge className="bg-orange-600">Gaming</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          ₹{Number(service.internetPricePerHour).toLocaleString()}/hour
                          {service.internetSpeed && <span className="ml-2 text-green-600 font-semibold">• {service.internetSpeed}</span>}
                        </p>
                        {service.city && <p className="text-sm text-muted-foreground">{service.city}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingService(service)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this service?")) {
                          deleteMutation.mutate(service.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Cyber Café Service</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input id="title" {...register("title", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cafeName">Café Name *</Label>
                    <Input id="cafeName" {...register("cafeName", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select onValueChange={(value) => setValue("serviceType", value)} defaultValue={editingService?.serviceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cyber_cafe">Cyber Café</SelectItem>
                        <SelectItem value="internet_cafe">Internet Café</SelectItem>
                        <SelectItem value="gaming_cafe">Gaming Café</SelectItem>
                        <SelectItem value="business_center">Business Center</SelectItem>
                        <SelectItem value="coworking_with_internet">Coworking with Internet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="internetPricePerHour">Internet Price/Hour (₹) *</Label>
                    <Input id="internetPricePerHour" type="number" {...register("internetPricePerHour", { required: true, valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internetPricePerDay">Internet Price/Day (₹)</Label>
                    <Input id="internetPricePerDay" type="number" {...register("internetPricePerDay", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingPriceBw">B&W Printing/Page (₹)</Label>
                    <Input id="printingPriceBw" type="number" {...register("printingPriceBw", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingPriceColor">Color Printing/Page (₹)</Label>
                    <Input id="printingPriceColor" type="number" {...register("printingPriceColor", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scanningPrice">Scanning Price (₹)</Label>
                    <Input id="scanningPrice" type="number" {...register("scanningPrice", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gamingPricePerHour">Gaming Price/Hour (₹)</Label>
                    <Input id="gamingPricePerHour" type="number" {...register("gamingPricePerHour", { valueAsNumber: true })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalComputers">Total Computers</Label>
                    <Input id="totalComputers" type="number" {...register("totalComputers", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internetSpeed">Internet Speed</Label>
                    <Input id="internetSpeed" {...register("internetSpeed")} placeholder="e.g., 100 Mbps" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="internetBrowsing" defaultChecked onCheckedChange={(checked) => setValue("internetBrowsing", checked)} />
                    <Label htmlFor="internetBrowsing">Internet Browsing</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="printingService" defaultChecked onCheckedChange={(checked) => setValue("printingService", checked)} />
                    <Label htmlFor="printingService">Printing Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="scanningService" defaultChecked onCheckedChange={(checked) => setValue("scanningService", checked)} />
                    <Label htmlFor="scanningService">Scanning Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="photocopyingService" defaultChecked onCheckedChange={(checked) => setValue("photocopyingService", checked)} />
                    <Label htmlFor="photocopyingService">Photocopying</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="gamingAvailable" onCheckedChange={(checked) => setValue("gamingAvailable", checked)} />
                    <Label htmlFor="gamingAvailable">Gaming Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="wifiAvailable" onCheckedChange={(checked) => setValue("wifiAvailable", checked)} />
                    <Label htmlFor="wifiAvailable">WiFi Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="acAvailable" onCheckedChange={(checked) => setValue("acAvailable", checked)} />
                    <Label htmlFor="acAvailable">AC Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="parkingAvailable" onCheckedChange={(checked) => setValue("parkingAvailable", checked)} />
                    <Label htmlFor="parkingAvailable">Parking Available</Label>
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
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
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
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input id="workingHours" {...register("workingHours")} placeholder="e.g., 9 AM - 9 PM" />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="fullAddress">Full Address *</Label>
                    <Input id="fullAddress" {...register("fullAddress", { required: true })} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="open24_7" onCheckedChange={(checked) => setValue("open24_7", checked)} />
                    <Label htmlFor="open24_7">Open 24/7</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingService && (
        <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingService.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Café Name</p>
                  <p className="text-sm text-muted-foreground">{viewingService.cafeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Service Type</p>
                  <p className="text-sm text-muted-foreground">{viewingService.serviceType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Internet Price/Hour</p>
                  <p className="text-sm text-muted-foreground">₹{Number(viewingService.internetPricePerHour).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{viewingService.contactPhone}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
