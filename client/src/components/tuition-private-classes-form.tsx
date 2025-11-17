
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface TuitionPrivateClassesFormProps {
  onSuccess: () => void;
  editingClass?: any;
}

export default function TuitionPrivateClassesForm({ onSuccess, editingClass }: TuitionPrivateClassesFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: editingClass || {
      listingType: "tuition",
      subjectCategory: "academic",
      teachingMode: "offline",
      classType: "group",
      country: "India",
      isActive: true,
    }
  });

  const [subjects, setSubjects] = useState<string[]>(editingClass?.subjectsOffered || []);
  const [newSubject, setNewSubject] = useState("");

  const onSubmit = async (data: any) => {
    try {
      const url = editingClass 
        ? `/api/admin/tuition-private-classes/${editingClass.id}`
        : '/api/admin/tuition-private-classes';
      
      const response = await fetch(url, {
        method: editingClass ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subjectsOffered: subjects,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving tuition class:', error);
    }
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
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
            <Label>Title *</Label>
            <Input {...register("title", { required: true })} placeholder="e.g., Mathematics Tuition for Class 10" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subject Category *</Label>
              <Select onValueChange={(value) => setValue("subjectCategory", value)} defaultValue={watch("subjectCategory")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="competitive_exam">Competitive Exam</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="computer">Computer</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Teaching Mode *</Label>
              <Select onValueChange={(value) => setValue("teachingMode", value)} defaultValue={watch("teachingMode")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Subjects Offered</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add subject"
              />
              <Button type="button" onClick={addSubject}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, idx) => (
                <Badge key={idx} variant="secondary">
                  {subject}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSubjects(subjects.filter((_, i) => i !== idx))}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tutor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tutor Name *</Label>
              <Input {...register("tutorName", { required: true })} />
            </div>

            <div>
              <Label>Qualification</Label>
              <Input {...register("tutorQualification")} placeholder="e.g., M.Sc. Mathematics" />
            </div>
          </div>

          <div>
            <Label>Experience (Years)</Label>
            <Input type="number" {...register("tutorExperienceYears")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Class Type *</Label>
              <Select onValueChange={(value) => setValue("classType", value)} defaultValue={watch("classType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Batch Size</Label>
              <Input type="number" {...register("batchSize")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Grade Level</Label>
              <Input {...register("gradeLevel")} placeholder="e.g., Class 10-12" />
            </div>

            <div>
              <Label>Min Grade</Label>
              <Input type="number" {...register("minGrade")} />
            </div>

            <div>
              <Label>Max Grade</Label>
              <Input type="number" {...register("maxGrade")} />
            </div>
          </div>

          <div>
            <Label>Board</Label>
            <Input {...register("board")} placeholder="e.g., CBSE, ICSE, State Board" />
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
              <Label>Fee Per Hour (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerHour")} />
            </div>

            <div>
              <Label>Fee Per Month (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerMonth")} />
            </div>

            <div>
              <Label>Fee Per Subject (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerSubject")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features & Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch {...register("demoClassAvailable")} />
              <Label>Demo Class Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("studyMaterialProvided")} />
              <Label>Study Material Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("testSeriesIncluded")} />
              <Label>Test Series Included</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("doubtClearingSessions")} />
              <Label>Doubt Clearing Sessions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("flexibleTimings")} />
              <Label>Flexible Timings</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("weekendClasses")} />
              <Label>Weekend Classes</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("homeTuitionAvailable")} />
              <Label>Home Tuition Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("onlineClassesAvailable")} />
              <Label>Online Classes Available</Label>
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
              <Label>Contact Person *</Label>
              <Input {...register("contactPerson", { required: true })} />
            </div>

            <div>
              <Label>Contact Phone *</Label>
              <Input {...register("contactPhone", { required: true })} />
            </div>
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input type="email" {...register("contactEmail")} />
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
              <Label>City</Label>
              <Input {...register("city")} />
            </div>

            <div>
              <Label>Area</Label>
              <Input {...register("areaName")} />
            </div>
          </div>

          <div>
            <Label>State/Province</Label>
            <Input {...register("stateProvince")} />
          </div>

          <div>
            <Label>Full Address</Label>
            <Textarea {...register("fullAddress")} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch {...register("isActive")} defaultChecked />
            <Label>Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch {...register("isFeatured")} />
            <Label>Featured</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">{editingClass ? 'Update' : 'Create'} Tuition Class</Button>
      </div>
    </form>
  );
}
