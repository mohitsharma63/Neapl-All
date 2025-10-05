
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface CommercialPropertiesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: any;
  onSuccess: () => void;
}

export function CommercialPropertiesForm({ open, onOpenChange, property, onSuccess }: CommercialPropertiesFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    commercialType: property?.commercialType || 'shop',
    listingType: property?.listingType || 'rent',
    price: property?.price || '',
    priceType: property?.priceType || 'monthly',
    area: property?.area || '',
    floors: property?.floors || '',
    parkingSpaces: property?.parkingSpaces || '',
    footfall: property?.footfall || '',
    country: property?.country || 'India',
    stateProvince: property?.stateProvince || '',
    city: property?.city || '',
    areaName: property?.areaName || '',
    fullAddress: property?.fullAddress || '',
    isActive: property?.isActive !== undefined ? property.isActive : true,
    isFeatured: property?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = property?.id
        ? `/api/admin/commercial-properties/${property.id}`
        : '/api/admin/commercial-properties';
      
      const method = property?.id ? 'PUT' : 'POST';

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
      console.error('Error saving commercial property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property?.id ? 'Edit' : 'Add'} Commercial Property</DialogTitle>
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
              <Label>Commercial Type *</Label>
              <Select value={formData.commercialType} onValueChange={(value) => setFormData({ ...formData, commercialType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="showroom">Showroom</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Floors</Label>
              <Input
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
              />
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
              <Label>Footfall</Label>
              <Input
                value={formData.footfall}
                onChange={(e) => setFormData({ ...formData, footfall: e.target.value })}
                placeholder="e.g., High, Medium, Low"
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
