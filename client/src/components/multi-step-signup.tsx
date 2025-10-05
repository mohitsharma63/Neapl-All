import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, User, Briefcase, Eye, EyeOff, CheckCircle2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const step2Schema = z.object({
  accountType: z.enum(["user", "buyer", "seller"], {
    required_error: "Please select account type",
  }),
});

const step3Schema = z.object({
  categoryIds: z.array(z.string()).min(1, "Please select at least one category"),
  subcategoryIds: z.array(z.string()).min(1, "Please select at least one subcategory"),
});

const step4Schema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  postalCode: z.string().optional(),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number()
  })).optional(),
  additionalInfo: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  parentCategoryId: string;
}
type Step4Data = z.infer<typeof step4Schema>;

export default function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data & Step4Data>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData,
  });

  const step4Form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: formData,
  });

  const onStep1Submit = (data: Step1Data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const onStep2Submit = (data: Step2Data) => {
    setFormData({ ...formData, ...data });
    // Skip category selection for regular users
    if (data.accountType === 'user') {
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
  };

  const onStep3Submit = async (data: Step3Data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(4);
  };

  const onStep4Submit = async (data: Step4Data) => {
    const finalData = { ...formData, ...data };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: finalData.firstName,
          lastName: finalData.lastName,
          email: finalData.email,
          phone: finalData.phone,
          password: finalData.password,
          accountType: finalData.accountType,
          categoryIds: finalData.accountType === 'user' ? [] : finalData.categoryIds,
          subcategoryIds: finalData.accountType === 'user' ? [] : finalData.subcategoryIds,
          location: {
            country: finalData.country,
            state: finalData.state,
            city: finalData.city,
            area: finalData.area,
            address: finalData.address,
            postalCode: finalData.postalCode,
          },
          documents: finalData.documents,
          additionalInfo: finalData.additionalInfo,
        }),
      });

      if (response.ok) {
        toast({
          title: "Signup successful!",
          description: "Your account has been created.",
        });
        setLocation("/login");
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Signup failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const accountTypes = [
    { value: "user", label: "Individual", icon: User, description: "Personal account for browsing" },
    { value: "buyer", label: "Buyer", icon: User, description: "Looking to buy or rent property" },
    { value: "seller", label: "Seller", icon: Briefcase, description: "List and sell properties" },
  ];

  // Fetch categories when step 3 is reached
  useEffect(() => {
    if (currentStep === 3) {
      fetch("/api/admin/categories")
        .then(res => res.json())
        .then(data => {
          const activeCategories = data.filter((cat: Category) => cat.isActive);
          setCategories(activeCategories);
        })
        .catch(err => console.error("Error loading categories:", err));
    }
  }, [currentStep]);

  // Initialize selected categories from form data
  useEffect(() => {
    if (formData.categoryIds) {
      setSelectedCategories(formData.categoryIds);
    }
    if (formData.subcategoryIds) {
      setSelectedSubcategories(formData.subcategoryIds);
    }
  }, [formData.categoryIds, formData.subcategoryIds]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];

      step3Form.setValue("categoryIds", newSelection);

      // Remove subcategories of deselected category
      if (!newSelection.includes(categoryId)) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          const subcategoryIdsToRemove = category.subcategories.map(s => s.id);
          setSelectedSubcategories(prev => {
            const filtered = prev.filter(id => !subcategoryIdsToRemove.includes(id));
            step3Form.setValue("subcategoryIds", filtered);
            return filtered;
          });
        }
      }

      return newSelection;
    });
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      const newSelection = prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId];

      step3Form.setValue("subcategoryIds", newSelection);
      return newSelection;
    });
  };

  const getAvailableSubcategories = (): Subcategory[] => {
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .flatMap(cat => cat.subcategories.filter(sub => sub.isActive));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    const fileObjects = files.map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type,
      size: f.size
    }));
    step4Form.setValue("documents", [...(formData.documents || []), ...fileObjects]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    const currentDocs = step4Form.getValues("documents") || [];
    step4Form.setValue("documents", currentDocs.filter((_, i) => i !== index));
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white pb-8">
            <CardTitle className="text-3xl text-center font-bold">Sign Up</CardTitle>
            <CardDescription className="text-center text-blue-50 text-lg mt-2">
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Account Type"}
              {currentStep === 3 && formData.accountType === 'user' ? "Skipping Category" : "Category Selection"}
              {currentStep === 4 && "Location & Details"}
            </CardDescription>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center w-full">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-white text-blue-600 shadow-lg scale-110"
                            : "bg-blue-400/30 text-white"
                        }`}
                      >
                        {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                      </div>
                      {step < 4 && (
                        <div className={`h-1 w-full mt-6 transition-all duration-300 ${
                          currentStep > step ? "bg-white" : "bg-blue-400/30"
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {currentStep === 1 && (
              <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">First Name *</Label>
                    <Input
                      {...step1Form.register("firstName")}
                      placeholder="Enter first name"
                      className="h-11 border-2 focus:border-blue-500 transition-colors"
                    />
                    {step1Form.formState.errors.firstName && (
                      <p className="text-sm text-red-500">{step1Form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Last Name *</Label>
                    <Input
                      {...step1Form.register("lastName")}
                      placeholder="Enter last name"
                      className="h-11 border-2 focus:border-blue-500 transition-colors"
                    />
                    {step1Form.formState.errors.lastName && (
                      <p className="text-sm text-red-500">{step1Form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email Address *</Label>
                  <Input
                    {...step1Form.register("email")}
                    type="email"
                    placeholder="your.email@example.com"
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                  />
                  {step1Form.formState.errors.email && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Phone Number *</Label>
                  <Input
                    {...step1Form.register("phone")}
                    placeholder="+977-9800000000"
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                  />
                  {step1Form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Password *</Label>
                  <div className="relative">
                    <Input
                      {...step1Form.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 border-2 focus:border-blue-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {step1Form.formState.errors.password && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      {...step1Form.register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="h-11 border-2 focus:border-blue-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {step1Form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                  Next →
                </Button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
                <div>
                  <Label className="text-xl font-bold mb-6 block">Select Account Type</Label>
                  <RadioGroup
                    onValueChange={(value) => step2Form.setValue("accountType", value as any)}
                    defaultValue={formData.accountType}
                    className="grid gap-4"
                  >
                    {accountTypes.map((type) => (
                      <div key={type.value} className="relative">
                        <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                        <Label
                          htmlFor={type.value}
                          className="flex items-start gap-4 cursor-pointer p-6 border-2 rounded-xl hover:bg-blue-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all duration-200"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center peer-data-[state=checked]:bg-blue-600 peer-data-[state=checked]:text-white">
                            <type.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg mb-1">{type.label}</div>
                            <div className="text-sm text-gray-600">{type.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {step2Form.formState.errors.accountType && (
                    <p className="text-sm text-red-500 mt-2">{step2Form.formState.errors.accountType.message}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 h-12">
                    ← Back
                  </Button>
                  <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                    Next →
                  </Button>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xl font-bold">Select Categories *</Label>
                    <span className="text-sm text-gray-500">
                      {selectedCategories.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                    {categories.map((category) => {
                      const isSelected = selectedCategories.includes(category.id);
                      const CategoryIcon = Building;

                      return (
                        <div
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`
                            relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                            ${isSelected 
                              ? 'border-blue-600 bg-blue-50 shadow-md scale-105' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all
                                ${isSelected ? 'scale-110' : ''}
                              `}
                              style={{ 
                                backgroundColor: isSelected ? category.color : `${category.color}20`,
                                color: isSelected ? 'white' : category.color
                              }}
                            >
                              <CategoryIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-base mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                {category.name}
                              </h4>
                              {category.subcategories && category.subcategories.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  {category.subcategories.filter(s => s.isActive).length} subcategories
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {step3Form.formState.errors.categoryIds && (
                    <p className="text-sm text-red-500">{step3Form.formState.errors.categoryIds.message}</p>
                  )}
                </div>

                {getAvailableSubcategories().length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xl font-bold">Select Subcategories *</Label>
                      <span className="text-sm text-gray-500">
                        {selectedSubcategories.length} selected
                      </span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                      {selectedCategories.map(categoryId => {
                        const category = categories.find(c => c.id === categoryId);
                        if (!category) return null;

                        const activeSubcategories = category.subcategories.filter(s => s.isActive);
                        if (activeSubcategories.length === 0) return null;

                        return (
                          <div key={categoryId} className="space-y-2">
                            <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm font-semibold text-gray-700">
                                {category.name}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                              {activeSubcategories.map(subcategory => {
                                const isSelected = selectedSubcategories.includes(subcategory.id);

                                return (
                                  <div
                                    key={subcategory.id}
                                    onClick={() => toggleSubcategory(subcategory.id)}
                                    className={`
                                      flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                                      ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                      }
                                    `}
                                  >
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                      style={{ 
                                        backgroundColor: isSelected ? category.color : `${category.color}15`,
                                        color: isSelected ? 'white' : category.color
                                      }}
                                    >
                                      <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm flex-1 ${isSelected ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>
                                      {subcategory.name}
                                    </span>
                                    {isSelected && (
                                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {step3Form.formState.errors.subcategoryIds && (
                      <p className="text-sm text-red-500">{step3Form.formState.errors.subcategoryIds.message}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 h-12">
                    ← Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    disabled={selectedCategories.length === 0 || selectedSubcategories.length === 0}
                  >
                    Next →
                  </Button>
                </div>
              </form>
            )}

            {/* Show message for user account type */}
            {currentStep === 3 && formData.accountType === 'user' && (
              <div className="text-center py-8">
                <p className="text-gray-600">Regular users don't need to select categories. Proceeding to location details...</p>
              </div>
            )}

            {currentStep === 4 && (
              <form onSubmit={step4Form.handleSubmit(onStep4Submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Country *</Label>
                    <Input {...step4Form.register("country")} placeholder="Nepal" defaultValue="Nepal" className="h-11 border-2" />
                    {step4Form.formState.errors.country && (
                      <p className="text-sm text-red-500">{step4Form.formState.errors.country.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">State *</Label>
                    <Input {...step4Form.register("state")} placeholder="Province" className="h-11 border-2" />
                    {step4Form.formState.errors.state && (
                      <p className="text-sm text-red-500">{step4Form.formState.errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">City *</Label>
                    <Input {...step4Form.register("city")} placeholder="City" className="h-11 border-2" />
                    {step4Form.formState.errors.city && (
                      <p className="text-sm text-red-500">{step4Form.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Area</Label>
                    <Input {...step4Form.register("area")} placeholder="Area" className="h-11 border-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Address *</Label>
                  <Input {...step4Form.register("address")} placeholder="Full Address" className="h-11 border-2" />
                  {step4Form.formState.errors.address && (
                    <p className="text-sm text-red-500">{step4Form.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Postal Code</Label>
                  <Input {...step4Form.register("postalCode")} placeholder="Postal Code" className="h-11 border-2" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Upload Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</span>
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm truncate flex-1">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Additional Information</Label>
                  <textarea
                    {...step4Form.register("additionalInfo")}
                    className="w-full p-4 border-2 rounded-xl min-h-[120px] focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter any additional information here..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => formData.accountType === 'user' ? setCurrentStep(2) : setCurrentStep(3)} 
                    className="flex-1 h-12"
                  >
                    ← Back
                  </Button>
                  <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                    Sign Up
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}