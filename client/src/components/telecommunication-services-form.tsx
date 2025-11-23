
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Edit, Trash2, Eye, Wifi } from "lucide-react";

export default function TelecommunicationServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "broadband",
    companyName: "",
    providerType: "ISP",
    serviceCategory: "",
    planName: "",
    monthlyPrice: "",
    yearlyPrice: "",
    installationCharges: "",
    securityDeposit: "",
    broadbandSpeed: "",
    dataLimit: "",
    unlimitedData: false,
    fiberOptic: false,
    dthChannels: "",
    hdChannels: "",
    ottAppsIncluded: [] as string[],
    mobileNetwork: "",
    callsUnlimited: false,
    smsUnlimited: false,
    roamingAvailable: false,
    validity: "",
    contractPeriod: "",
    freeInstallation: false,
    routerProvided: false,
    staticIp: false,
    customerSupport24_7: false,
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    alternatePhone: "",
    whatsappNumber: "",
    websiteUrl: "",
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    serviceAreas: [] as string[],
    isActive: true,
    isFeatured: false,
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["telecommunication-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/telecommunication-services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/telecommunication-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telecommunication-services"] });
      toast({ title: "Success", description: "Service created successfully" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/telecommunication-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telecommunication-services"] });
      toast({ title: "Success", description: "Service updated successfully" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/telecommunication-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telecommunication-services"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      serviceType: "broadband",
      companyName: "",
      providerType: "ISP",
      serviceCategory: "",
      planName: "",
      monthlyPrice: "",
      yearlyPrice: "",
      installationCharges: "",
      securityDeposit: "",
      broadbandSpeed: "",
      dataLimit: "",
      unlimitedData: false,
      fiberOptic: false,
      dthChannels: "",
      hdChannels: "",
      ottAppsIncluded: [],
      mobileNetwork: "",
      callsUnlimited: false,
      smsUnlimited: false,
      roamingAvailable: false,
      validity: "",
      contractPeriod: "",
      freeInstallation: false,
      routerProvided: false,
      staticIp: false,
      customerSupport24_7: false,
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      alternatePhone: "",
      whatsappNumber: "",
      websiteUrl: "",
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      serviceAreas: [],
      isActive: true,
      isFeatured: false,
    });
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Telecommunication Services</h2>
          <p className="text-muted-foreground">Manage broadband, mobile, DTH and telecom services</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Telecommunication Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Service Title *</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="broadband">Broadband</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="dth">DTH</SelectItem>
                        <SelectItem value="landline">Landline</SelectItem>
                        <SelectItem value="fiber">Fiber Optic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company Name *</Label>
                    <Input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
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
                    <Label>Monthly Price (₹) *</Label>
                    <Input type="number" value={formData.monthlyPrice} onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Yearly Price (₹)</Label>
                    <Input type="number" value={formData.yearlyPrice} onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })} />
                  </div>
                  <div>
                    <Label>Installation Charges (₹)</Label>
                    <Input type="number" value={formData.installationCharges} onChange={(e) => setFormData({ ...formData, installationCharges: e.target.value })} />
                  </div>
                  <div>
                    <Label>Security Deposit (₹)</Label>
                    <Input type="number" value={formData.securityDeposit} onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })} />
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
                    <Label>Contact Person *</Label>
                    <Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Contact Phone *</Label>
                    <Input value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div>
                    <Label>Full Address</Label>
                    <Input value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{editingService ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {services.map((service: any) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-4">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.companyName}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{service.serviceType}</Badge>
                        {service.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">₹{service.monthlyPrice}/month</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setViewingService(service); setShowDetailsDialog(true); }}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(service.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingService?.title}</DialogTitle>
          </DialogHeader>
          {viewingService && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{viewingService.companyName}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline">{viewingService.serviceType}</Badge>
                    {viewingService.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">₹{viewingService.monthlyPrice}/month</p>
                </div>
              </div>

              {viewingService.description && (
                <div>
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-sm text-muted-foreground">{viewingService.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold">Contact</h4>
                <p className="text-sm">{viewingService.contactPerson} — {viewingService.contactPhone}</p>
                {viewingService.contactEmail && <p className="text-sm">{viewingService.contactEmail}</p>}
                {viewingService.fullAddress && <p className="text-sm text-muted-foreground">{viewingService.fullAddress}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
