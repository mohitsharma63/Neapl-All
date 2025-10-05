
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface RentalListingsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rental?: any;
  onSuccess: () => void;
}

export function RentalListingsForm({ open, onOpenChange, rental, onSuccess }: RentalListingsFormProps) {
  const [formData, setFormData] = useState({
    title: rental?.title || '',
    description: rental?.description || '',
    rentalType: rental?.rentalType || 'room',
    price: rental?.price || '',
    bedrooms: rental?.bedrooms || '',
    bathrooms: rental?.bathrooms || '',
    area: rental?.area || '',
    furnishingStatus: rental?.furnishingStatus || 'unfurnished',
    depositAmount: rental?.depositAmount || '',
    country: rental?.country || 'India',
    stateProvince: rental?.stateProvince || '',
    city: rental?.city || '',
    areaName: rental?.areaName || '',
    fullAddress: rental?.fullAddress || '',
    isActive: rental?.isActive !== undefined ? rental.isActive : true,
    isFeatured: rental?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = rental?.id
        ? `/api/admin/rental-listings/${rental.id}`
        : '/api/admin/rental-listings';
      
      const method = rental?.id ? 'PUT' : 'POST';

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
      console.error('Error saving rental listing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rental?.id ? 'Edit' : 'Add'} Rental Listing</DialogTitle>
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
              <Label>Rental Type *</Label>
              <Select value={formData.rentalType} onValueChange={(value) => setFormData({ ...formData, rentalType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price (per month) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>

            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
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
              <Label>Deposit Amount</Label>
              <Input
                type="number"
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
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
