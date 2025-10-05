
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories?: any[];
}

export default function Signup() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Categories & Subcategories
    selectedCategories: [] as string[],
    selectedSubcategories: [] as string[],
    
    // Step 3: Account Type & Details
    accountType: "",
    // Buyer specific
    buyerBudget: "",
    buyerPreferredLocation: "",
    buyerPropertyType: "",
    // Seller specific
    sellerPropertyCount: "",
    sellerExperience: "",
    sellerCompanyName: "",
    
    termsAccepted: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedCategories.includes(categoryId);
      
      // If deselecting, also remove all subcategories of this category
      if (isSelected) {
        const category = categories.find(c => c.id === categoryId);
        const subcategoryIds = category?.subcategories?.map((s: any) => s.id) || [];
        
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(id => id !== categoryId),
          selectedSubcategories: prev.selectedSubcategories.filter(id => !subcategoryIds.includes(id))
        };
      }
      
      return {
        ...prev,
        selectedCategories: [...prev.selectedCategories, categoryId]
      };
    });
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSubcategories: prev.selectedSubcategories.includes(subcategoryId)
        ? prev.selectedSubcategories.filter(id => id !== subcategoryId)
        : [...prev.selectedSubcategories, subcategoryId]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.password || !formData.confirmPassword) {
          alert("कृपया सबै आवश्यक फिल्डहरू भर्नुहोस् | Please fill all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          alert("पासवर्ड मेल खाएन | Passwords do not match");
          return false;
        }
        if (formData.password.length < 6) {
          alert("पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ | Password must be at least 6 characters");
          return false;
        }
        return true;
      
      case 2:
        if (formData.selectedCategories.length === 0) {
          alert("कृपया कम्तिमा एउटा श्रेणी छान्नुहोस् | Please select at least one category");
          return false;
        }
        if (formData.selectedSubcategories.length === 0) {
          alert("कृपया कम्तिमा एउटा सेवा छान्नुहोस् | Please select at least one service");
          return false;
        }
        return true;
      
      case 3:
        if (!formData.accountType) {
          alert("कृपया खाता प्रकार छान्नुहोस् | Please select account type");
          return false;
        }
        if (!formData.termsAccepted) {
          alert("कृपया नियम र सर्तहरू स्वीकार गर्नुहोस् | Please accept terms and conditions");
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          selectedCategories: formData.selectedCategories,
          selectedSubcategories: formData.selectedSubcategories,
          accountType: formData.accountType,
          buyerBudget: formData.buyerBudget,
          buyerPreferredLocation: formData.buyerPreferredLocation,
          buyerPropertyType: formData.buyerPropertyType,
          sellerPropertyCount: formData.sellerPropertyCount,
          sellerExperience: formData.sellerExperience,
          sellerCompanyName: formData.sellerCompanyName,
          termsAccepted: formData.termsAccepted,
          status: "pending", // Waiting for admin approval
        }),
      });

      if (response.ok) {
        alert("साइन अप सफल! प्रशासक स्वीकृतिको लागि कृपया प्रतीक्षा गर्नुहोस् | Signup successful! Please wait for admin approval.");
        setLocation("/login");
      } else {
        const error = await response.json();
        alert(error.message || "साइन अप असफल भयो | Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("त्रुटि भयो | An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "आधारभूत जानकारी | Basic Information";
      case 2:
        return "रुचि छान्नुहोस् | Select Your Interests";
      case 3:
        return "खाता प्रकार | Account Type";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-signup">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                साइन अप | Sign Up
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {getStepTitle()}
              </p>
              
              {/* Progress Indicator */}
              <div className="flex justify-center items-center gap-2 mt-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 ${
                        currentStep > step ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">पहिलो नाम | First Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First name"
                            className="pl-10"
                            data-testid="input-firstName"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lastName">अन्तिम नाम | Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                          data-testid="input-lastName"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">इमेल | Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="pl-10"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">फोन नम्बर | Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+977-9800000000"
                          className="pl-10"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password">पासवर्ड | Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">पासवर्ड पुष्टि | Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          data-testid="input-confirmPassword"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Category & Subcategory Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Categories */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        तपाईंको रुचि छान्नुहोस् | Select Your Interests
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.selectedCategories.includes(category.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                formData.selectedCategories.includes(category.id)
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {category.icon ? (
                                  <span className="text-xl">{category.icon}</span>
                                ) : (
                                  <span className="text-xl">🏠</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{category.name}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  . {category.name}
                                </p>
                              </div>
                              {formData.selectedCategories.includes(category.id) && (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subcategories - Show only for selected categories */}
                    {formData.selectedCategories.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">
                          तपाईंको रुचिका क्षेत्रहरू छान्नुहोस् | Select your areas of interest
                        </p>
                        <div className="space-y-4">
                          {categories
                            .filter(cat => formData.selectedCategories.includes(cat.id))
                            .map(category => (
                              <div key={category.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${category.color}20` }}
                                  >
                                    <span className="text-lg">{category.icon || '🏠'}</span>
                                  </div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {category.name}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 gap-2 ml-10">
                                  {category.subcategories && category.subcategories.length > 0 ? (
                                    category.subcategories
                                      .filter((sub: any) => sub.isActive)
                                      .map((subcategory: any) => (
                                        <div
                                          key={subcategory.id}
                                          onClick={() => toggleSubcategory(subcategory.id)}
                                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            formData.selectedSubcategories.includes(subcategory.id)
                                              ? 'border-primary bg-primary/5'
                                              : 'border-gray-200 hover:border-primary/50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div 
                                              className="p-2 rounded-lg"
                                              style={{ backgroundColor: `${category.color}15` }}
                                            >
                                              <span className="text-sm" style={{ color: category.color }}>
                                                {subcategory.icon || '📋'}
                                              </span>
                                            </div>
                                            <div className="flex-1">
                                              <h5 className="font-medium text-sm">{subcategory.name}</h5>
                                              {subcategory.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                  {subcategory.description}
                                                </p>
                                              )}
                                            </div>
                                            {formData.selectedSubcategories.includes(subcategory.id) && (
                                              <CheckCircle className="w-4 h-4 text-primary" />
                                            )}
                                          </div>
                                        </div>
                                      ))
                                  ) : (
                                    <p className="text-xs text-muted-foreground py-2">No services available</p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Account Type */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-4">
                      <Label>खाता प्रकार | Account Type *</Label>
                      <RadioGroup
                        value={formData.accountType}
                        onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                          <RadioGroupItem value="buyer" id="buyer" />
                          <Label htmlFor="buyer" className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-semibold">खरिदार | Buyer</p>
                              <p className="text-xs text-muted-foreground">सम्पत्ति खोज्दै हुनुहुन्छ | Looking to buy property</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                          <RadioGroupItem value="seller" id="seller" />
                          <Label htmlFor="seller" className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-semibold">बिक्रेता | Seller</p>
                              <p className="text-xs text-muted-foreground">सम्पत्ति बेच्न चाहनुहुन्छ | Want to sell property</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                          <RadioGroupItem value="agency" id="agency" />
                          <Label htmlFor="agency" className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-semibold">एजेन्सी | Agency</p>
                              <p className="text-xs text-muted-foreground">सम्पत्ति व्यवसाय चलाउनुहुन्छ | Running property business</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Location Selection */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold text-sm">स्थान विवरण | Location Details</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="location">स्थान | Location *</Label>
                          <Input
                            id="location"
                            value={formData.buyerPreferredLocation}
                            onChange={(e) => setFormData({ ...formData, buyerPreferredLocation: e.target.value })}
                            placeholder="e.g., Kathmandu, Lalitpur, Bhaktapur"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Buyer Specific Fields */}
                    {formData.accountType === "buyer" && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-sm">खरिदार विवरण | Buyer Details</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="buyerBudget">बजेट रेन्ज | Budget Range</Label>
                            <Select
                              value={formData.buyerBudget}
                              onValueChange={(value) => setFormData({ ...formData, buyerBudget: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0-50L">Up to 50 Lakhs</SelectItem>
                                <SelectItem value="50L-1Cr">50 Lakhs - 1 Crore</SelectItem>
                                <SelectItem value="1Cr-2Cr">1 Crore - 2 Crores</SelectItem>
                                <SelectItem value="2Cr+">Above 2 Crores</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="buyerPreferredLocation">पसन्दको स्थान | Preferred Location</Label>
                            <Input
                              id="buyerPreferredLocation"
                              value={formData.buyerPreferredLocation}
                              onChange={(e) => setFormData({ ...formData, buyerPreferredLocation: e.target.value })}
                              placeholder="e.g., Kathmandu, Pokhara"
                            />
                          </div>
                          <div>
                            <Label htmlFor="buyerPropertyType">सम्पत्ति प्रकार | Property Type</Label>
                            <Select
                              value={formData.buyerPropertyType}
                              onValueChange={(value) => setFormData({ ...formData, buyerPropertyType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="apartment">Apartment</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="land">Land</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Seller Specific Fields */}
                    {formData.accountType === "seller" && (
                      <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-sm">बिक्रेता विवरण | Seller Details</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="sellerPropertyCount">सम्पत्ति संख्या | Number of Properties</Label>
                            <Input
                              id="sellerPropertyCount"
                              type="number"
                              value={formData.sellerPropertyCount}
                              onChange={(e) => setFormData({ ...formData, sellerPropertyCount: e.target.value })}
                              placeholder="e.g., 1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="sellerExperience">अनुभव | Experience (Years)</Label>
                            <Select
                              value={formData.sellerExperience}
                              onValueChange={(value) => setFormData({ ...formData, sellerExperience: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0-1">Less than 1 year</SelectItem>
                                <SelectItem value="1-3">1-3 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="5+">5+ years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="sellerCompanyName">कम्पनी नाम (वैकल्पिक) | Company Name (Optional)</Label>
                            <Input
                              id="sellerCompanyName"
                              value={formData.sellerCompanyName}
                              onChange={(e) => setFormData({ ...formData, sellerCompanyName: e.target.value })}
                              placeholder="Your company name"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Agency Specific Fields */}
                    {formData.accountType === "agency" && (
                      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-sm">एजेन्सी विवरण | Agency Details</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="agencyName">एजेन्सी नाम | Agency Name *</Label>
                            <Input
                              id="agencyName"
                              value={formData.sellerCompanyName}
                              onChange={(e) => setFormData({ ...formData, sellerCompanyName: e.target.value })}
                              placeholder="Your agency name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="agencyLicense">लाइसेन्स नम्बर | License Number</Label>
                            <Input
                              id="agencyLicense"
                              value={formData.sellerExperience}
                              onChange={(e) => setFormData({ ...formData, sellerExperience: e.target.value })}
                              placeholder="e.g., REA-2024-001"
                            />
                          </div>
                          <div>
                            <Label htmlFor="agencyAddress">कार्यालय ठेगाना | Office Address</Label>
                            <Textarea
                              id="agencyAddress"
                              value={formData.buyerPreferredLocation}
                              onChange={(e) => setFormData({ ...formData, buyerPreferredLocation: e.target.value })}
                              placeholder="Full office address"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="agencyEstablished">स्थापना वर्ष | Established Year</Label>
                            <Input
                              id="agencyEstablished"
                              type="number"
                              value={formData.sellerPropertyCount}
                              onChange={(e) => setFormData({ ...formData, sellerPropertyCount: e.target.value })}
                              placeholder="e.g., 2020"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, termsAccepted: checked as boolean })
                        }
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        मैले <Link href="/terms" className="text-primary hover:underline">नियम र सर्तहरू</Link> र{" "}
                        <Link href="/privacy" className="text-primary hover:underline">गोपनीयता नीति</Link> पढेको छु र सहमत छु | 
                        I agree to the Terms and Conditions and Privacy Policy
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      पछाडि | Back
                    </Button>
                  )}
                  
                  <div className="flex-1" />
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      अगाडि | Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? "प्रक्रिया भइरहेको छ... | Processing..." : "साइन अप | Sign Up"}
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  पहिले देखि खाता छ? | Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    लगइन गर्नुहोस् | Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
