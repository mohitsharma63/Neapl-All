
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyDealFormProps {
  deal?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export function PropertyDealForm({ deal, onCancel, onSuccess }: PropertyDealFormProps) {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    description: deal?.description || '',
    dealType: deal?.dealType || 'sale',
    propertyType: deal?.propertyType || 'residential',
    price: deal?.price || '',
    area: deal?.area || '',
    areaUnit: deal?.areaUnit || 'sq.ft',
    bedrooms: deal?.bedrooms || '',
    bathrooms: deal?.bathrooms || '',
    floors: deal?.floors || '',
    roadAccess: deal?.roadAccess || '',
    facingDirection: deal?.facingDirection || '',
    images: deal?.images || [],
    documents: deal?.documents || [],
    features: deal?.features || [],
    isNegotiable: deal?.isNegotiable ?? false,
    ownershipType: deal?.ownershipType || 'freehold',
    locationId: deal?.locationId || '',
    agencyId: deal?.agencyId || '',
    isActive: deal?.isActive ?? true,
    isFeatured: deal?.isFeatured ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = deal ? `/api/property-deals/${deal.id}` : '/api/property-deals';
    const method = deal ? 'PUT' : 'POST';

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
        alert(`Error: ${error.message || 'Failed to save deal'}`);
      }
    } catch (error) {
      console.error('Error saving property deal:', error);
      alert('Failed to save property deal');
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
              placeholder="e.g., 3 Bedroom House for Sale in Kathmandu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the property..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dealType">Deal Type *</Label>
              <Select
                value={formData.dealType}
                onValueChange={(value) => setFormData({ ...formData, dealType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="5000000"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaUnit">Area Unit</Label>
              <Select
                value={formData.areaUnit}
                onValueChange={(value) => setFormData({ ...formData, areaUnit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sq.ft">Sq.Ft</SelectItem>
                  <SelectItem value="aana">Aana</SelectItem>
                  <SelectItem value="ropani">Ropani</SelectItem>
                  <SelectItem value="dhur">Dhur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floors">Floors</Label>
              <Input
                id="floors"
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                placeholder="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roadAccess">Road Access</Label>
              <Input
                id="roadAccess"
                value={formData.roadAccess}
                onChange={(e) => setFormData({ ...formData, roadAccess: e.target.value })}
                placeholder="e.g., 13 feet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facingDirection">Facing Direction</Label>
              <Select
                value={formData.facingDirection}
                onValueChange={(value) => setFormData({ ...formData, facingDirection: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownershipType">Ownership Type</Label>
            <Select
              value={formData.ownershipType}
              onValueChange={(value) => setFormData({ ...formData, ownershipType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freehold">Freehold</SelectItem>
                <SelectItem value="leasehold">Leasehold</SelectItem>
              </SelectContent>
            </Select>
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
              <Label htmlFor="isNegotiable">Price Negotiable</Label>
              <p className="text-sm text-muted-foreground">Allow price negotiation</p>
            </div>
            <Switch
              id="isNegotiable"
              checked={formData.isNegotiable}
              onCheckedChange={(checked) => setFormData({ ...formData, isNegotiable: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">Make this deal visible to users</p>
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
              <p className="text-sm text-muted-foreground">Show this deal in featured section</p>
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
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  );
}
