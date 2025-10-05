
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HostelPGFormProps {
  listing?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export function HostelPGForm({ listing, onCancel, onSuccess }: HostelPGFormProps) {
  const [formData, setFormData] = useState({
    name: listing?.name || '',
    description: listing?.description || '',
    pricePerMonth: listing?.pricePerMonth || '',
    hostelType: listing?.hostelType || 'hostel',
    roomType: listing?.roomType || 'shared',
    totalBeds: listing?.totalBeds || '',
    availableBeds: listing?.availableBeds || '',
    facilities: listing?.facilities || [],
    foodIncluded: listing?.foodIncluded ?? false,
    images: listing?.images || [],
    rules: listing?.rules || '',
    locationId: listing?.locationId || '',
    contactPerson: listing?.contactPerson || '',
    contactPhone: listing?.contactPhone || '',
    isActive: listing?.isActive ?? true,
    isFeatured: listing?.isFeatured ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = listing ? `/api/hostel-pg/${listing.id}` : '/api/hostel-pg';
    const method = listing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save listing'}`);
      }
    } catch (error) {
      console.error('Error saving hostel/PG listing:', error);
      alert('Failed to save hostel/PG listing');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Sunrise Hostel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the hostel/PG..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerMonth">Monthly Price (₹) *</Label>
              <Input
                id="pricePerMonth"
                type="number"
                step="0.01"
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                placeholder="8000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostelType">Hostel Type *</Label>
              <Select
                value={formData.hostelType}
                onValueChange={(value) => setFormData({ ...formData, hostelType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hostel">Hostel</SelectItem>
                  <SelectItem value="pg">PG</SelectItem>
                  <SelectItem value="boys">Boys Only</SelectItem>
                  <SelectItem value="girls">Girls Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData({ ...formData, roomType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBeds">Total Beds</Label>
              <Input
                id="totalBeds"
                type="number"
                value={formData.totalBeds}
                onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableBeds">Available Beds</Label>
              <Input
                id="availableBeds"
                type="number"
                value={formData.availableBeds}
                onChange={(e) => setFormData({ ...formData, availableBeds: e.target.value })}
                placeholder="5"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="foodIncluded">Food Included</Label>
              <p className="text-sm text-muted-foreground">Meals provided with accommodation</p>
            </div>
            <Switch
              id="foodIncluded"
              checked={formData.foodIncluded}
              onCheckedChange={(checked) => setFormData({ ...formData, foodIncluded: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="9800000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Rules & Regulations</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              placeholder="List hostel rules..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">Make this listing visible to users</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured">Featured</Label>
              <p className="text-sm text-muted-foreground">Show this listing in featured section</p>
            </div>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {listing ? 'Update Listing' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}
