
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface OfficeSpacesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  office?: any;
  onSuccess: () => void;
}

export function OfficeSpacesForm({ open, onOpenChange, office, onSuccess }: OfficeSpacesFormProps) {
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
    parkingSpaces: office?.parkingSpaces || '',
    floor: office?.floor || '',
    totalFloors: office?.totalFloors || '',
    country: office?.country || 'India',
    stateProvince: office?.stateProvince || '',
    city: office?.city || '',
    areaName: office?.areaName || '',
    fullAddress: office?.fullAddress || '',
    isActive: office?.isActive !== undefined ? office.isActive : true,
    isFeatured: office?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = office?.id
        ? `/api/admin/office-spaces/${office.id}`
        : '/api/admin/office-spaces';
      
      const method = office?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving office space:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{office?.id ? 'Edit' : 'Add'} Office Space</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Listing Type *</Label>
              <Select value={formData.listingType} onValueChange={(value) => setFormData({ ...formData, listingType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Price Type</Label>
              <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
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

            <div>
              <Label>Area (sq.ft)</Label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>

            <div>
              <Label>Office Type</Label>
              <Select value={formData.officeType} onValueChange={(value) => setFormData({ ...formData, officeType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="coworking">Co-working</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div>
              <Label>Cabins</Label>
              <Input
                type="number"
                value={formData.cabins}
                onChange={(e) => setFormData({ ...formData, cabins: e.target.value })}
              />
            </div>

            <div>
              <Label>Workstations</Label>
              <Input
                type="number"
                value={formData.workstations}
                onChange={(e) => setFormData({ ...formData, workstations: e.target.value })}
              />
            </div>

            <div>
              <Label>Meeting Rooms</Label>
              <Input
                type="number"
                value={formData.meetingRooms}
                onChange={(e) => setFormData({ ...formData, meetingRooms: e.target.value })}
              />
            </div>

            <div>
              <Label>Furnishing Status</Label>
              <Select value={formData.furnishingStatus} onValueChange={(value) => setFormData({ ...formData, furnishingStatus: value })}>
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

            <div>
              <Label>Parking Spaces</Label>
              <Input
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
              />
            </div>

            <div>
              <Label>Floor</Label>
              <Input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>

            <div>
              <Label>Total Floors</Label>
              <Input
                type="number"
                value={formData.totalFloors}
                onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
              />
            </div>

            <div>
              <Label>Country *</Label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>State/Province</Label>
              <Input
                value={formData.stateProvince}
                onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <Label>Area</Label>
              <Input
                value={formData.areaName}
                onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label>Full Address</Label>
              <Input
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label>Featured</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
