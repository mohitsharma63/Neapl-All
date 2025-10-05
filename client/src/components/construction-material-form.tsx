
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConstructionMaterialFormProps {
  material?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ConstructionMaterialForm({ material, onCancel, onSuccess }: ConstructionMaterialFormProps) {
  const [formData, setFormData] = useState({
    name: material?.name || '',
    category: material?.category || 'cement',
    description: material?.description || '',
    price: material?.price || '',
    unit: material?.unit || 'bag',
    brand: material?.brand || '',
    specifications: material?.specifications || {},
    images: material?.images || [],
    supplierId: material?.supplierId || '',
    supplierName: material?.supplierName || '',
    supplierContact: material?.supplierContact || '',
    locationId: material?.locationId || '',
    stockStatus: material?.stockStatus || 'in_stock',
    minimumOrder: material?.minimumOrder || '',
    isActive: material?.isActive ?? true,
    isFeatured: material?.isFeatured ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = material ? `/api/construction-materials/${material.id}` : '/api/construction-materials';
    const method = material ? 'PUT' : 'POST';

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
        alert(`Error: ${error.message || 'Failed to save material'}`);
      }
    } catch (error) {
      console.error('Error saving construction material:', error);
      alert('Failed to save construction material');
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
            <Label htmlFor="name">Material Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Portland Cement"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the material..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cement">Cement</SelectItem>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="bricks">Bricks</SelectItem>
                  <SelectItem value="sand">Sand</SelectItem>
                  <SelectItem value="aggregates">Aggregates</SelectItem>
                  <SelectItem value="tiles">Tiles</SelectItem>
                  <SelectItem value="paint">Paint</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Brand name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="cft">CFT</SelectItem>
                  <SelectItem value="sqft">Sq.Ft</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockStatus">Stock Status</Label>
              <Select
                value={formData.stockStatus}
                onValueChange={(value) => setFormData({ ...formData, stockStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="limited">Limited Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumOrder">Minimum Order Quantity</Label>
            <Input
              id="minimumOrder"
              type="number"
              value={formData.minimumOrder}
              onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
              placeholder="10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                placeholder="Supplier name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierContact">Supplier Contact</Label>
              <Input
                id="supplierContact"
                value={formData.supplierContact}
                onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                placeholder="9800000000"
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
              <p className="text-sm text-muted-foreground">Make this material visible to users</p>
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
              <p className="text-sm text-muted-foreground">Show this material in featured section</p>
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
          {material ? 'Update Material' : 'Create Material'}
        </Button>
      </div>
    </form>
  );
}
