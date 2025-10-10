
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Building, MapPin, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventDecorationService {
  id: string;
  title: string;
  description?: string;
  serviceType: string;
  venueName?: string;
  venueType?: string;
  capacity?: number;
  basePrice: number;
  priceType: string;
  contactPerson: string;
  contactPhone: string;
  city?: string;
  fullAddress: string;
  cateringAvailable: boolean;
  decorationIncluded: boolean;
  parkingAvailable: boolean;
  acAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export function EventDecorationServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventDecorationService | null>(null);
  const [viewingItem, setViewingItem] = useState<EventDecorationService | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "marriage_hall",
    venueName: "",
    venueType: "indoor",
    capacity: "",
    capacitySeating: "",
    hallArea: "",
    basePrice: "",
    priceType: "per_event",
    pricePerDay: "",
    minimumBookingHours: "",
    securityDeposit: "",
    cateringAvailable: false,
    cateringIncluded: false,
    decorationIncluded: false,
    djSoundAvailable: false,
    parkingAvailable: false,
    parkingCapacity: "",
    acAvailable: false,
    powerBackup: false,
    greenRooms: "",
    washrooms: "",
    kitchenFacility: false,
    photographyAllowed: true,
    outsideCateringAllowed: false,
    businessName: "",
    ownerName: "",
    experienceYears: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    whatsappNumber: "",
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    workingHours: "",
    advanceBookingRequired: true,
    minimumAdvanceBookingDays: "7",
    advancePaymentRequired: true,
    advancePaymentPercentage: "",
    isActive: true,
    isFeatured: false,
  });

  const { data: services = [], isLoading } = useQuery<EventDecorationService[]>({
    queryKey: ["/api/admin/event-decoration-services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/event-decoration-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
      toast({ title: "Success", description: "Event service created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/event-decoration-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
      toast({ title: "Success", description: "Event service updated successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/event-decoration-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
      toast({ title: "Success", description: "Event service deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      serviceType: "marriage_hall",
      venueName: "",
      venueType: "indoor",
      capacity: "",
      capacitySeating: "",
      hallArea: "",
      basePrice: "",
      priceType: "per_event",
      pricePerDay: "",
      minimumBookingHours: "",
      securityDeposit: "",
      cateringAvailable: false,
      cateringIncluded: false,
      decorationIncluded: false,
      djSoundAvailable: false,
      parkingAvailable: false,
      parkingCapacity: "",
      acAvailable: false,
      powerBackup: false,
      greenRooms: "",
      washrooms: "",
      kitchenFacility: false,
      photographyAllowed: true,
      outsideCateringAllowed: false,
      businessName: "",
      ownerName: "",
      experienceYears: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      whatsappNumber: "",
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      workingHours: "",
      advanceBookingRequired: true,
      minimumAdvanceBookingDays: "7",
      advancePaymentRequired: true,
      advancePaymentPercentage: "",
      isActive: true,
      isFeatured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (service: EventDecorationService) => {
    setEditingItem(service);
    setFormData(service as any);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await fetch(`/api/admin/event-decoration-services/${id}/toggle-active`, { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
    } catch (error) {
      console.error("Error toggling active status:", error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      await fetch(`/api/admin/event-decoration-services/${id}/toggle-featured`, { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event & Decoration Services</h2>
          <p className="text-muted-foreground">Manage marriage halls, party venues, café setups, and decoration materials</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingItem(null); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Event Service" : "Add New Event Service"}</DialogTitle>
            <DialogDescription>Fill in the details for the event or decoration service</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marriage_hall">Marriage Hall</SelectItem>
                    <SelectItem value="party_venue">Party Venue</SelectItem>
                    <SelectItem value="cafe_setup">Café Setup</SelectItem>
                    <SelectItem value="decoration_materials">Decoration Materials</SelectItem>
                    <SelectItem value="decoration_service">Decoration Service</SelectItem>
                    <SelectItem value="event_planning">Event Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input id="venueName" value={formData.venueName} onChange={(e) => setFormData({ ...formData, venueName: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueType">Venue Type</Label>
                <Select value={formData.venueType} onValueChange={(value) => setFormData({ ...formData, venueType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity</Label>
                <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price *</Label>
                <Input id="basePrice" type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input id="contactPhone" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <Textarea id="fullAddress" value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} required />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formData.cateringAvailable} onCheckedChange={(checked) => setFormData({ ...formData, cateringAvailable: checked })} />
                <Label>Catering Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.parkingAvailable} onCheckedChange={(checked) => setFormData({ ...formData, parkingAvailable: checked })} />
                <Label>Parking Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.acAvailable} onCheckedChange={(checked) => setFormData({ ...formData, acAvailable: checked })} />
                <Label>AC Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                <Label>Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? "Update" : "Create"} Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                  <Badge variant="secondary">{service.serviceType.replace('_', ' ')}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setViewingItem(service); setViewDialogOpen(true); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{service.venueName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{service.city || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{service.contactPhone}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-primary">₹{Number(service.basePrice).toLocaleString()}</span>
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => toggleActive(service.id)} className="flex-1">
                  {service.isActive ? 'Active' : 'Inactive'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleFeatured(service.id)} className="flex-1">
                  {service.isFeatured ? 'Featured' : 'Not Featured'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewingItem && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingItem.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{viewingItem.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Service Type:</strong> {viewingItem.serviceType}</div>
                <div><strong>Base Price:</strong> ₹{Number(viewingItem.basePrice).toLocaleString()}</div>
                <div><strong>Contact:</strong> {viewingItem.contactPhone}</div>
                <div><strong>City:</strong> {viewingItem.city || 'N/A'}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
