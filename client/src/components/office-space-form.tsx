
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OfficeSpaceFormProps {
  office?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export function OfficeSpaceForm({ office, onCancel, onSuccess }: OfficeSpaceFormProps) {
  const [formData, setFormData] = useState({
    title: office?.title || '',
    description: office?.description || '',
    listingType: office?.listingType || 'rent',
    price: office?.price || '',
    priceType: office?.priceType || 'monthly',
    area: office?.area || '',
    officeType: office?.officeType || 'private',
    capacity: office?.capacity || '',
    cabins: office?.cabins || '',
    workstations: office?.workstations || '',
    meetingRooms: office?.meetingRooms || '',
    furnishingStatus: office?.furnishingStatus || 'unfurnished',
    images: office?.images || [],
    amenities: office?.amenities || [],
    parkingSpaces: office?.parkingSpaces || '',
    floor: office?.floor || '',
    totalFloors: office?.totalFloors || '',
    availableFrom: office?.availableFrom || '',
    locationId: office?.locationId || '',
    agencyId: office?.agencyId || '',
    isActive: office?.isActive ?? true,
    isFeatured: office?.isFeatured ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = office ? `/api/office-spaces/${office.id}` : '/api/office-spaces';
    const method = office ? 'PUT' : 'POST';

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
        alert(`Error: ${error.message || 'Failed to save office space'}`);
      }
    } catch (error) {
      console.error('Error saving office space:', error);
      alert('Failed to save office space');
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Modern Office Space in Business District"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the office space..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listingType">Listing Type *</Label>
              <Select
                value={formData.listingType}
                onValueChange={(value) => setFormData({ ...formData, listingType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="50000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceType">Price Type</Label>
              <Select
                value={formData.priceType}
                onValueChange={(value) => setFormData({ ...formData, priceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Office Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="officeType">Office Type</Label>
              <Select
                value={formData.officeType}
                onValueChange={(value) => setFormData({ ...formData, officeType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private Office</SelectItem>
                  <SelectItem value="shared">Shared Office</SelectItem>
                  <SelectItem value="coworking">Co-working Space</SelectItem>
                  <SelectItem value="virtual">Virtual Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (sq.ft)</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="2000"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cabins">Cabins</Label>
              <Input
                id="cabins"
                type="number"
                value={formData.cabins}
                onChange={(e) => setFormData({ ...formData, cabins: e.target.value })}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workstations">Workstations</Label>
              <Input
                id="workstations"
                type="number"
                value={formData.workstations}
                onChange={(e) => setFormData({ ...formData, workstations: e.target.value })}
                placeholder="15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingRooms">Meeting Rooms</Label>
              <Input
                id="meetingRooms"
                type="number"
                value={formData.meetingRooms}
                onChange={(e) => setFormData({ ...formData, meetingRooms: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="furnishingStatus">Furnishing Status</Label>
              <Select
                value={formData.furnishingStatus}
                onValueChange={(value) => setFormData({ ...formData, furnishingStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnished">Furnished</SelectItem>
                  <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingSpaces">Parking Spaces</Label>
              <Input
                id="parkingSpaces"
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalFloors">Total Floors</Label>
              <Input
                id="totalFloors"
                type="number"
                value={formData.totalFloors}
                onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                placeholder="10"
              />
            </div>
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
          {office ? 'Update Office Space' : 'Create Office Space'}
        </Button>
      </div>
    </form>
  );
}
