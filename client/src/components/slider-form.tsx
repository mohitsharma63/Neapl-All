
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronUp, ChevronDown } from "lucide-react";

interface SliderFormProps {
  slider?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SliderForm({ slider, onSuccess, onCancel }: SliderFormProps) {
  const [formData, setFormData] = useState({
    title: slider?.title || "",
    description: slider?.description || "",
    imageUrl: slider?.imageUrl || "",
    linkUrl: slider?.linkUrl || "",
    buttonText: slider?.buttonText || "",
    sortOrder: slider?.sortOrder || 0,
    isActive: slider?.isActive ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(
    slider?.imageUrl ? [slider.imageUrl] : []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const readFile = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const results = await Promise.all(files.map(readFile));
      const newImages = [...images, ...results];
      setImages(newImages);
      // Keep compatibility with existing API which expects `imageUrl`.
      setFormData({ ...formData, imageUrl: newImages[0] || "" });
      setSelectedIndex(newImages.length - results.length);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImageAt = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    const nextIndex = Math.max(0, Math.min(selectedIndex, next.length - 1));
    setSelectedIndex(nextIndex);
    setFormData({ ...formData, imageUrl: next[0] || "" });
  };

  const selectIndex = (idx: number) => {
    setSelectedIndex(idx);
    const thumb = thumbsRef.current?.children[idx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const prevImage = () => {
    if (images.length === 0) return;
    selectIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    selectIndex((selectedIndex + 1) % images.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = slider
        ? `/api/admin/sliders/${slider.id}`
        : "/api/admin/sliders";
      const method = slider ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving slider:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[90vh] overflow-hidden flex flex-col">
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Slider Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto p-4 max-h-[72vh]">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Slider Image *</Label>
            <Input
              id="imageUrl"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {images.length > 0 && (
              <div className="mt-2 flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <Button type="button" variant="ghost" size="icon" onClick={prevImage}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>

                  <div
                    ref={thumbsRef}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") prevImage();
                      if (e.key === "ArrowDown") nextImage();
                    }}
                    className="mt-2 flex flex-col gap-2 overflow-y-auto h-48 w-28 p-1"
                  >
                    {images.map((src, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectIndex(idx)}
                        className={`flex-shrink-0 rounded-md overflow-hidden border ${
                          idx === selectedIndex ? "ring-2 ring-offset-2 ring-indigo-400" : ""
                        }`}
                      >
                        <img src={src} className="w-28 h-16 object-cover" />
                      </button>
                    ))}
                  </div>

                  <Button type="button" variant="ghost" size="icon" onClick={nextImage} className="mt-2">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 relative">
                  <img
                    src={images[selectedIndex]}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImageAt(selectedIndex)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="linkUrl">Link URL</Label>
            <Input
              id="linkUrl"
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              placeholder="Learn More"
            />
          </div>

          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label>Active</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex-shrink-0 flex justify-end gap-2 pt-2 bg-white">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading || images.length === 0}>
          {slider ? "Update" : "Create"} Slider
        </Button>
      </div>
    </form>
  );
}
