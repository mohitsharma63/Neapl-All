
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PropertyDealsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyDeal?: any;
  onSuccess: () => void;
}

export function PropertyDealsForm({ open, onOpenChange, propertyDeal, onSuccess }: PropertyDealsFormProps) {
  const [formData, setFormData] = useState({
    title: propertyDeal?.title || '',
    description: propertyDeal?.description || '',
    dealType: propertyDeal?.dealType || 'buy',
    propertyType: propertyDeal?.propertyType || 'residential',
    price: propertyDeal?.price || '',
    area: propertyDeal?.area || '',
    areaUnit: propertyDeal?.areaUnit || 'sq.ft',
    bedrooms: propertyDeal?.bedrooms || '',
    bathrooms: propertyDeal?.bathrooms || '',
    floors: propertyDeal?.floors || '',
    roadAccess: propertyDeal?.roadAccess || '',
    facingDirection: propertyDeal?.facingDirection || '',
    features: propertyDeal?.features || [],
    isNegotiable: propertyDeal?.isNegotiable || false,
    ownershipType: propertyDeal?.ownershipType || '',
    country: propertyDeal?.country || 'India',
    stateProvince: propertyDeal?.stateProvince || '',
    city: propertyDeal?.city || '',
    areaName: propertyDeal?.areaName || '',
    fullAddress: propertyDeal?.fullAddress || '',
    isActive: propertyDeal?.isActive !== undefined ? propertyDeal.isActive : true,
    isFeatured: propertyDeal?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = propertyDeal?.id
        ? `/api/admin/property-deals/${propertyDeal.id}`
        : '/api/admin/property-deals';
      
      const method = propertyDeal?.id ? 'PUT' : 'POST';

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
      console.error('Error saving property deal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{propertyDeal?.id ? 'Edit' : 'Add'} Property Deal</DialogTitle>
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
              <Label>Deal Type *</Label>
              <Select value={formData.dealType} onValueChange={(value) => setFormData({ ...formData, dealType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Property Type *</Label>
              <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
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
              <Label>Area</Label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>

            <div>
              <Label>Area Unit</Label>
              <Select value={formData.areaUnit} onValueChange={(value) => setFormData({ ...formData, areaUnit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sq.ft">Sq. Ft</SelectItem>
                  <SelectItem value="sq.m">Sq. M</SelectItem>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="ropani">Ropani</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Floors</Label>
              <Input
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
              />
            </div>

            <div>
              <Label>Road Access</Label>
              <Input
                value={formData.roadAccess}
                onChange={(e) => setFormData({ ...formData, roadAccess: e.target.value })}
              />
            </div>

            <div>
              <Label>Facing Direction</Label>
              <Input
                value={formData.facingDirection}
                onChange={(e) => setFormData({ ...formData, facingDirection: e.target.value })}
              />
            </div>

            <div>
              <Label>Ownership Type</Label>
              <Input
                value={formData.ownershipType}
                onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
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
                checked={formData.isNegotiable}
                onCheckedChange={(checked) => setFormData({ ...formData, isNegotiable: checked })}
              />
              <Label>Negotiable</Label>
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
