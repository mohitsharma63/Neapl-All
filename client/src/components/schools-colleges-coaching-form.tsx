
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

interface SchoolsCollegesCoachingFormProps {
  onSuccess: () => void;
}

export default function SchoolsCollegesCoachingForm({ onSuccess }: SchoolsCollegesCoachingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "school",
    institutionCategory: "primary_school",
    institutionName: "",
    institutionType: "private",
    affiliation: "",
    accreditation: "",
    establishmentYear: new Date().getFullYear(),
    boardAffiliation: "",
    universityAffiliation: "",
    annualTuitionFee: "",
    totalFeePerYear: "",
    scholarshipAvailable: false,
    hostelFacility: false,
    transportFacility: false,
    libraryAvailable: false,
    computerLab: false,
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    city: "",
    areaName: "",
    fullAddress: "",
    country: "India",
    stateProvince: "",
    isActive: true,
    isFeatured: false,
  });

  const [coursesOffered, setCoursesOffered] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState("");
  const [examPreparation, setExamPreparation] = useState<string[]>([]);
  const [newExam, setNewExam] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/schools-colleges-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coursesOffered,
          examPreparationFor: examPreparation,
          establishmentYear: parseInt(formData.establishmentYear.toString()),
          annualTuitionFee: formData.annualTuitionFee ? parseFloat(formData.annualTuitionFee) : null,
          totalFeePerYear: formData.totalFeePerYear ? parseFloat(formData.totalFeePerYear) : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating institution:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Listing Type *</Label>
              <Select value={formData.listingType} onValueChange={(value) => setFormData(prev => ({ ...prev, listingType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="coaching_institute">Coaching Institute</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="training_center">Training Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Institution Category *</Label>
              <Select value={formData.institutionCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, institutionCategory: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary_school">Primary School</SelectItem>
                  <SelectItem value="secondary_school">Secondary School</SelectItem>
                  <SelectItem value="higher_secondary">Higher Secondary</SelectItem>
                  <SelectItem value="engineering_college">Engineering College</SelectItem>
                  <SelectItem value="medical_college">Medical College</SelectItem>
                  <SelectItem value="management_college">Management College</SelectItem>
                  <SelectItem value="competitive_exams">Competitive Exams</SelectItem>
                  <SelectItem value="skill_development">Skill Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Institution Name *</Label>
            <Input
              value={formData.institutionName}
              onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g., Best CBSE School in Delhi"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Institution Type</Label>
              <Select value={formData.institutionType} onValueChange={(value) => setFormData(prev => ({ ...prev, institutionType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="aided">Aided</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Establishment Year</Label>
              <Input
                type="number"
                value={formData.establishmentYear}
                onChange={(e) => setFormData(prev => ({ ...prev, establishmentYear: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Board Affiliation</Label>
              <Input
                value={formData.boardAffiliation}
                onChange={(e) => setFormData(prev => ({ ...prev, boardAffiliation: e.target.value }))}
                placeholder="e.g., CBSE, ICSE, State Board"
              />
            </div>

            <div>
              <Label>University Affiliation</Label>
              <Input
                value={formData.universityAffiliation}
                onChange={(e) => setFormData(prev => ({ ...prev, universityAffiliation: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Accreditation</Label>
            <Input
              value={formData.accreditation}
              onChange={(e) => setFormData(prev => ({ ...prev, accreditation: e.target.value }))}
              placeholder="e.g., NAAC, NBA, ISO"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses & Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Courses & Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Courses Offered</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Add course name"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newCourse.trim()) {
                    setCoursesOffered([...coursesOffered, newCourse.trim()]);
                    setNewCourse("");
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {coursesOffered.map((course, idx) => (
                <Badge key={idx} variant="secondary">
                  {course}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setCoursesOffered(coursesOffered.filter((_, i) => i !== idx))}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Exam Preparation For (For Coaching)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newExam}
                onChange={(e) => setNewExam(e.target.value)}
                placeholder="e.g., JEE, NEET, UPSC"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newExam.trim()) {
                    setExamPreparation([...examPreparation, newExam.trim()]);
                    setNewExam("");
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {examPreparation.map((exam, idx) => (
                <Badge key={idx} variant="secondary">
                  {exam}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setExamPreparation(examPreparation.filter((_, i) => i !== idx))}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Annual Tuition Fee (₹)</Label>
              <Input
                type="number"
                value={formData.annualTuitionFee}
                onChange={(e) => setFormData(prev => ({ ...prev, annualTuitionFee: e.target.value }))}
              />
            </div>

            <div>
              <Label>Total Fee Per Year (₹)</Label>
              <Input
                type="number"
                value={formData.totalFeePerYear}
                onChange={(e) => setFormData(prev => ({ ...prev, totalFeePerYear: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.scholarshipAvailable}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, scholarshipAvailable: checked }))}
            />
            <Label>Scholarship Available</Label>
          </div>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.libraryAvailable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, libraryAvailable: checked }))}
              />
              <Label>Library Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.computerLab}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, computerLab: checked }))}
              />
              <Label>Computer Lab</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.hostelFacility}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hostelFacility: checked }))}
              />
              <Label>Hostel Facility</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.transportFacility}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, transportFacility: checked }))}
              />
              <Label>Transport Facility</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Person *</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Contact Phone *</Label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>

            <div>
              <Label>Area</Label>
              <Input
                value={formData.areaName}
                onChange={(e) => setFormData(prev => ({ ...prev, areaName: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>State/Province</Label>
            <Input
              value={formData.stateProvince}
              onChange={(e) => setFormData(prev => ({ ...prev, stateProvince: e.target.value }))}
            />
          </div>

          <div>
            <Label>Full Address *</Label>
            <Textarea
              value={formData.fullAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
              required
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label>Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
            />
            <Label>Featured</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">Create Institution</Button>
      </div>
    </form>
  );
}
