
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface IndustrialLandFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  land?: any;
  onSuccess: () => void;
}

export function IndustrialLandForm({ open, onOpenChange, land, onSuccess }: IndustrialLandFormProps) {
  const [formData, setFormData] = useState({
    title: land?.title || '',
    description: land?.description || '',
    listingType: land?.listingType || 'sale',
    price: land?.price || '',
    area: land?.area || '',
    areaUnit: land?.areaUnit || 'ropani',
    landType: land?.landType || 'industrial',
    zoning: land?.zoning || '',
    roadAccess: land?.roadAccess || '',
    electricityAvailable: land?.electricityAvailable || false,
    waterSupply: land?.waterSupply || false,
    sewerageAvailable: land?.sewerageAvailable || false,
    country: land?.country || 'India',
    stateProvince: land?.stateProvince || '',
    city: land?.city || '',
    areaName: land?.areaName || '',
    fullAddress: land?.fullAddress || '',
    isActive: land?.isActive !== undefined ? land.isActive : true,
    isFeatured: land?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = land?.id
        ? `/api/admin/industrial-land/${land.id}`
        : '/api/admin/industrial-land';
      
      const method = land?.id ? 'PUT' : 'POST';

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
      console.error('Error saving industrial land:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{land?.id ? 'Edit' : 'Add'} Industrial Land</DialogTitle>
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
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
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
              <Label>Area *</Label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Area Unit</Label>
              <Select value={formData.areaUnit} onValueChange={(value) => setFormData({ ...formData, areaUnit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ropani">Ropani</SelectItem>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="bigha">Bigha</SelectItem>
                  <SelectItem value="sq.m">Sq. M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Land Type</Label>
              <Input
                value={formData.landType}
                onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
              />
            </div>

            <div>
              <Label>Zoning</Label>
              <Input
                value={formData.zoning}
                onChange={(e) => setFormData({ ...formData, zoning: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label>Road Access</Label>
              <Input
                value={formData.roadAccess}
                onChange={(e) => setFormData({ ...formData, roadAccess: e.target.value })}
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
                checked={formData.electricityAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, electricityAvailable: checked })}
              />
              <Label>Electricity Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.waterSupply}
                onCheckedChange={(checked) => setFormData({ ...formData, waterSupply: checked })}
              />
              <Label>Water Supply</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.sewerageAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, sewerageAvailable: checked })}
              />
              <Label>Sewerage Available</Label>
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
