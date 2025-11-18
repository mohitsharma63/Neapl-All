import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface LanguageClassesFormProps {
  onSuccess: () => void;
  editingClass?: any;
}

export default function LanguageClassesForm({ onSuccess, editingClass }: LanguageClassesFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      listingType: "language_class",
      proficiencyLevel: editingClass?.proficiencyLevel || "beginner",
      teachingMode: editingClass?.teachingMode || "offline",
      classType: editingClass?.classType || "group",
      country: editingClass?.country || "India",
      isActive: editingClass?.isActive !== undefined ? editingClass.isActive : true,
      isFeatured: editingClass?.isFeatured || false,
      certificationProvided: editingClass?.certificationProvided || false,
      freeDemoClass: editingClass?.freeDemoClass || false,
      nativeSpeaker: editingClass?.nativeSpeaker || false,
      ...editingClass,
    }
  });

  const [studyMaterials, setStudyMaterials] = useState<string[]>(editingClass?.studyMaterialsProvided || []);
  const [newMaterial, setNewMaterial] = useState("");

  const onSubmit = async (data: any) => {
    try {
      const url = editingClass 
        ? `/api/admin/language-classes/${editingClass.id}`
        : '/api/admin/language-classes';

      const payload = {
        ...data,
        studyMaterialsProvided: Array.isArray(studyMaterials) ? studyMaterials : [],
        userId: user?.id,
        role: user?.role,
        certificationProvided: Boolean(data.certificationProvided),
        freeDemoClass: Boolean(data.freeDemoClass),
        nativeSpeaker: Boolean(data.nativeSpeaker),
        isActive: data.isActive !== false,
        isFeatured: Boolean(data.isFeatured),
      };

      const response = await fetch(url, {
        method: editingClass ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.error('Error creating language class:', error);
        alert(`Error: ${error.message || 'Failed to save language class'}`);
      }
    } catch (error) {
      console.error('Error saving language class:', error);
      alert('Failed to save language class. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="e.g., English Speaking Course" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="languageName">Language *</Label>
              <Input id="languageName" {...register("languageName", { required: true })} placeholder="e.g., English, Spanish" />
            </div>

            <div>
              <Label htmlFor="proficiencyLevel">Proficiency Level *</Label>
              <Select onValueChange={(value) => setValue("proficiencyLevel", value)} defaultValue={editingClass?.proficiencyLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all_levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="classType">Class Type</Label>
              <Select onValueChange={(value) => setValue("classType", value)} defaultValue={editingClass?.classType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="one_on_one">One-on-One</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseDurationMonths">Duration (Months) *</Label>
              <Input id="courseDurationMonths" type="number" {...register("courseDurationMonths", { required: true, valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="classesPerWeek">Classes Per Week</Label>
              <Input id="classesPerWeek" type="number" {...register("classesPerWeek", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="classDurationHours">Class Duration (Hours)</Label>
              <Input id="classDurationHours" type="number" step="0.5" {...register("classDurationHours", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teachingMode">Teaching Mode</Label>
              <Select onValueChange={(value) => setValue("teachingMode", value)} defaultValue={editingClass?.teachingMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input id="batchSize" type="number" {...register("batchSize", { valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <Label>Study Materials Provided</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} placeholder="Add material" />
              <Button type="button" onClick={() => { if (newMaterial.trim()) { setStudyMaterials([...studyMaterials, newMaterial.trim()]); setNewMaterial(""); } }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {studyMaterials.map((material, idx) => (
                <Badge key={idx} variant="secondary">
                  {material}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setStudyMaterials(studyMaterials.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="feePerMonth">Fee Per Month (₹) *</Label>
              <Input id="feePerMonth" type="number" {...register("feePerMonth", { required: true, valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
              <Input id="registrationFee" type="number" {...register("registrationFee", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="totalCourseFee">Total Course Fee (₹)</Label>
              <Input id="totalCourseFee" type="number" {...register("totalCourseFee", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="certificationProvided" onCheckedChange={(checked) => setValue("certificationProvided", checked)} checked={watch("certificationProvided")} />
              <Label htmlFor="certificationProvided">Certification Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="freeDemoClass" onCheckedChange={(checked) => setValue("freeDemoClass", checked)} checked={watch("freeDemoClass")} />
              <Label htmlFor="freeDemoClass">Free Demo Class</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructorName">Instructor Name</Label>
              <Input id="instructorName" {...register("instructorName")} />
            </div>

            <div>
              <Label htmlFor="instructorQualification">Qualification</Label>
              <Input id="instructorQualification" {...register("instructorQualification")} />
            </div>

            <div>
              <Label htmlFor="instructorExperience">Experience (Years)</Label>
              <Input id="instructorExperience" type="number" {...register("instructorExperience", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="nativeSpeaker">Native Speaker</Label>
              <Select onValueChange={(value) => setValue("nativeSpeaker", value === "true")} defaultValue={editingClass?.nativeSpeaker?.toString()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" {...register("contactPerson", { required: true })} />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input id="contactPhone" {...register("contactPhone", { required: true })} />
            </div>
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>

            <div>
              <Label htmlFor="areaName">Area</Label>
              <Input id="areaName" {...register("areaName")} />
            </div>
          </div>

          <div>
            <Label htmlFor="fullAddress">Full Address</Label>
            <Textarea id="fullAddress" {...register("fullAddress")} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="isActive" onCheckedChange={(checked) => setValue("isActive", checked)} checked={watch("isActive")} />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} checked={watch("isFeatured")} />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">{editingClass ? 'Update' : 'Create'} Language Class</Button>
      </div>
    </form>
  );
}