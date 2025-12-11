import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Home as HomeIcon, MapPin, Filter, LayoutGrid, LayoutList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryListingCard } from "@/components/category-listing-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";

// Map subcategory slugs to their API endpoints
const SUBCATEGORY_API_MAP: Record<string, string> = {
  'TuitionPrivatClasses': '/api/admin/tuition-private-classes',
  'Tuition & Private Classes': '/api/admin/tuition-private-classes',
  'RentalListings': '/api/admin/rental-listings',
  'Rental Listings': '/api/admin/rental-listings',
  'HostelPG': '/api/admin/hostel-pg',
  'Hostel & PG': '/api/admin/hostel-pg',
  'ConstructionMaterials': '/api/admin/construction-materials',
  'Construction Materials': '/api/admin/construction-materials',
  'Construction & Building Materials': '/api/admin/construction-materials',
  'PropertyDeals': '/api/admin/property-deals',
  'Property Deals': '/api/admin/property-deals',
  'CommercialProperties': '/api/admin/commercial-properties',
  'Commercial Properties': '/api/admin/commercial-properties',
  'IndustrialLand': '/api/admin/industrial-land',
  'Industrial Land': '/api/admin/industrial-land',
  'OfficeSpaces': '/api/admin/office-spaces',
  'Office Spaces': '/api/admin/office-spaces',
  'CarsBikes': '/api/admin/cars-bikes',
  'Cars & Bikes': '/api/admin/cars-bikes',
  'HeavyEquipment': '/api/admin/heavy-equipment',
  'Heavy Equipment': '/api/admin/heavy-equipment',
  'Showrooms': '/api/admin/showrooms',
  'SecondHandCarsBikes': '/api/admin/second-hand-cars-bikes',
  'Second Hand Cars & Bikes': '/api/admin/second-hand-cars-bikes',
  'CarBikeRentals': '/api/car-bike-rentals',
  'Car & Bike Rentals': '/api/car-bike-rentals',
  'TransportationMovingServices': '/api/admin/transportation-moving-services',
  'Transportation & Moving Services': '/api/admin/transportation-moving-services',
  'VehicleLicenseClasses': '/api/admin/vehicle-license-classes',
  'Vehicle License Classes': '/api/admin/vehicle-license-classes',
  'ElectronicsGadgets': '/api/admin/electronics-gadgets',
  'Electronics & Gadgets': '/api/admin/electronics-gadgets',
  'PhonesTabletsAccessories': '/api/admin/phones-tablets-accessories',
  'Phones, Tablets & Accessories': '/api/admin/phones-tablets-accessories',
  'New Phones & Tablets & Accessories': '/api/admin/phones-tablets-accessories',
  'SecondHandPhonesTabletsAccessories': '/api/admin/second-hand-phones-tablets-accessories',
  'Second Hand Phones & Accessories': '/api/admin/second-hand-phones-tablets-accessories',
  'Second-Hand Phones & Tablets & Accessories': '/api/admin/second-hand-phones-tablets-accessories',
  'ComputerMobileLaptopRepairServices': '/api/admin/computer-mobile-laptop-repair-services',
  'Computer & Mobile Repair Services': '/api/admin/computer-mobile-laptop-repair-services',
  'Computer, Mobile & Laptop Repair Services': '/api/admin/computer-mobile-laptop-repair-services',
  'CyberCafeInternetServices': '/api/admin/cyber-cafe-internet-services',
  'Cyber Café / Internet Services': '/api/admin/cyber-cafe-internet-services',
  'ServiceCentreWarranty': '/api/admin/service-centre-warranty',
  'Service Centre / Warranty': '/api/admin/service-centre-warranty',
  'Service Centre % Warranty': '/api/admin/service-centre-warranty',
  'FurnitureInteriorDecor': '/api/admin/furniture-interior-decor',
  'Furniture & Interior Decor': '/api/admin/furniture-interior-decor',
  'HouseholdServices': '/api/admin/household-services',
  'Household Services': '/api/admin/household-services',
  'EventDecorationServices': '/api/admin/event-decoration-services',
  'Event & Decoration Services': '/api/admin/event-decoration-services',
  'Event & Decoration Services (Marriage Halls, Parties, Café Setup, Decoration Materials)': '/api/admin/event-decoration-services',
  'FashionBeautyProducts': '/api/admin/fashion-beauty-products',
  'Fashion & Beauty Products': '/api/admin/fashion-beauty-products',
  'SareeClothingShopping': '/api/admin/saree-clothing-shopping',
  'Saree & Clothing Shopping': '/api/admin/saree-clothing-shopping',
  'EbooksOnlineCourses': '/api/admin/ebooks-online-courses',
  'E-Books & Online Courses': '/api/admin/ebooks-online-courses',
  'CricketSportsTraining': '/api/admin/cricket-sports-training',
  'Cricket & Sports Training': '/api/admin/cricket-sports-training',
  'PharmacyMedicalStores': '/api/admin/pharmacy-medical-stores',
  'Pharmacy & Medical Stores': '/api/admin/pharmacy-medical-stores',
  'DanceKarateGymYoga': '/api/admin/dance-karate-gym-yoga',
  'Dance, Karate, Gym & Yoga': '/api/admin/dance-karate-gym-yoga',
  'DanceKarateGymYoga Classes': '/api/admin/dance-karate-gym-yoga',
  'LanguageClasses': '/api/admin/language-classes',
  'Language Classes': '/api/admin/language-classes',
  'AcademiesMusicArtsSports': '/api/admin/academies-music-arts-sports',
  'Academies - Music, Arts, Sports': '/api/admin/academies-music-arts-sports',
  'Academies-Music-Arts-Sports': '/api/admin/academies-music-arts-sports',
  'SkillTrainingCertification': '/api/admin/skill-training-certification',
  'Skill Training & Certification': '/api/admin/skill-training-certification',
  'Skill-Training -Certification': '/api/admin/skill-training-certification',
  'SchoolsCollegesCoaching': '/api/admin/schools-colleges-coaching',
  'Schools, Colleges & Coaching': '/api/admin/schools-colleges-coaching',
  'Schools, Colleges, Coaching Institutes': '/api/admin/schools-colleges-coaching',
  'CricketSportsTraining': '/api/admin/cricket-sports-training',
  'Cricket & Sports Training': '/api/admin/cricket-sports-training',
  'Cricket-Sports Training': '/api/admin/cricket-sports-training',
  'EducationalConsultancyStudyAbroad': '/api/admin/educational-consultancy-study-abroad',
  'Educational Consultancy & Study Abroad': '/api/admin/educational-consultancy-study-abroad',
  'educational-consultancy-study-abroad': '/api/admin/educational-consultancy-study-abroad',
  'JewelryAccessories': '/api/admin/jewelry-accessories',
  'Jewelry & Accessories': '/api/admin/jewelry-accessories',
  'HealthWellnessServices': '/api/admin/health-wellness-services',
  'Health & Wellness Services': '/api/admin/health-wellness-services',
  'TelecommunicationServices': '/api/admin/telecommunication-services',
  'Telecommunication Services': '/api/admin/telecommunication-services',
  'ServiceCentreWarranty': '/api/admin/service-centre-warranty',
  'Service Centre & Warranty': '/api/admin/service-centre-warranty',
};

// Map subcategory slugs to readable names
const SUBCATEGORY_NAMES: Record<string, string> = {
  'TuitionPrivatClasses': 'Tuition & Private Classes',
  'RentalListings': 'Rental Listings',
  'HostelPG': 'Hostel & PG',
  'ConstructionMaterials': 'Construction Materials',
  'Construction & Building Materials': 'Construction & Building Materials',
  'PropertyDeals': 'Property Deals',
  'CommercialProperties': 'Commercial Properties',
  'IndustrialLand': 'Industrial Land',
  'OfficeSpaces': 'Office Spaces',
  'CarsBikes': 'Cars & Bikes',
  'HeavyEquipment': 'Heavy Equipment',
  'Showrooms': 'Showrooms',
  'SecondHandCarsBikes': 'Second Hand Cars & Bikes',
  'CarBikeRentals': 'Car & Bike Rentals',
  'TransportationMovingServices': 'Transportation & Moving Services',
  'VehicleLicenseClasses': 'Vehicle License Classes',
  'ElectronicsGadgets': 'Electronics & Gadgets',
  'PhonesTabletsAccessories': 'Phones, Tablets & Accessories',
  'New Phones & Tablets & Accessories': 'New Phones, Tablets & Accessories',
  'SecondHandPhonesTabletsAccessories': 'Second Hand Phones & Accessories',
  'Second-Hand Phones & Tablets & Accessories': 'Second Hand Phones, Tablets & Accessories',
  'ComputerMobileLaptopRepairServices': 'Computer & Mobile Repair Services',
  'Computer, Mobile & Laptop Repair Services': 'Computer, Mobile & Laptop Repair Services',
  'CyberCafeInternetServices': 'Cyber Café / Internet Services',
  'Cyber Café / Internet Services': 'Cyber Café / Internet Services',
  'FurnitureInteriorDecor': 'Furniture & Interior Decor',
  'HouseholdServices': 'Household Services',
  'EventDecorationServices': 'Event & Decoration Services',
  'Event & Decoration Services (Marriage Halls, Parties, Café Setup, Decoration Materials)': 'Event & Decoration Services',
  'FashionBeautyProducts': 'Fashion & Beauty Products',
  'SareeClothingShopping': 'Saree & Clothing Shopping',
  'EbooksOnlineCourses': 'E-Books & Online Courses',
  'CricketSportsTraining': 'Cricket & Sports Training',
  'PharmacyMedicalStores': 'Pharmacy & Medical Stores',
  'DanceKarateGymYoga': 'Dance, Karate, Gym & Yoga',
  'DanceKarateGymYoga Classes': 'Dance, Karate, Gym & Yoga',
  'LanguageClasses': 'Language Classes',
  'AcademiesMusicArtsSports': 'Academies - Music, Arts, Sports',
  'Academies-Music-Arts-Sports': 'Academies - Music, Arts, Sports',
  'SkillTrainingCertification': 'Skill Training & Certification',
  'Skill-Training -Certification': 'Skill Training & Certification',
  'SchoolsCollegesCoaching': 'Schools, Colleges & Coaching',
  'Schools, Colleges, Coaching Institutes': 'Schools, Colleges & Coaching',
  'CricketSportsTraining': 'Cricket & Sports Training',
  'Cricket-Sports Training': 'Cricket & Sports Training',
  'EducationalConsultancyStudyAbroad': 'Educational Consultancy & Study Abroad',
  'educational-consultancy-study-abroad': 'Educational Consultancy & Study Abroad',
  'JewelryAccessories': 'Jewelry & Accessories',
  'HealthWellnessServices': 'Health & Wellness Services',
  'TelecommunicationServices': 'Telecommunication Services',
  'ServiceCentreWarranty': 'Service Centre & Warranty',
  'Service Centre / Warranty': 'Service Centre / Warranty',
};

export default function SubcategoryPage() {
  const params = useParams();
  // support both routes:
  // - /category/:categorySlug/subcategory/:subcategorySlug
  // - /subcategory/:name
  const categoryId = (params as any).categorySlug || null;
  const subcategorySlug = (params as any).subcategorySlug || (params as any).name || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch category data
  const { data: categories = [], isLoading: categoryLoading } = useQuery({
    queryKey: ["/api/admin/categories"],
  });

  // Find the current category
  const category = categories.find((cat: any) => cat.id === categoryId);

  // Fetch subcategory data to ensure it exists and get its name/slug
  const { data: subcategoryData } = useQuery({
    queryKey: ["subcategory", categoryId, subcategorySlug],
    queryFn: async () => {
      const response = await fetch(`/api/admin/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const categories = await response.json();

      const category = categories.find((c: any) => c.id === categoryId);
      if (!category) return null;

      // Decode the URL slug to match against database slugs
      const decodedSlug = decodeURIComponent(subcategorySlug || '');

      const subcategory = category.subcategories?.find(
        (s: any) => s.slug === decodedSlug || s.slug === subcategorySlug || s.name === decodedSlug
      );

      return subcategory;
    },
  });

  // Get API endpoint for this subcategory
  const decodedSubcategorySlug = decodeURIComponent(subcategorySlug || '');
  const endpoint = SUBCATEGORY_API_MAP[subcategorySlug || ''] || SUBCATEGORY_API_MAP[decodedSubcategorySlug];
  const subcategoryName = subcategoryData?.name || SUBCATEGORY_NAMES[subcategorySlug || ''] || subcategorySlug;

  // Fetch listings for this subcategory
  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: [endpoint],
    enabled: !!endpoint,
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
  });

  // Filter listings
  const filteredListings = listings.filter((listing: any) => {
    if (!listing.isActive) return false;
    if (searchTerm && !listing.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (cityFilter !== "all" && listing.city !== cityFilter) return false;
    return true;
  });

  const cities = [...new Set(listings.map((l: any) => l.city).filter(Boolean))];

  if (categoryLoading || listingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Subcategory Not Found</h2>
          <Link href="/">
            <Button>
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-100 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span>{'>'}</span>
            {category && (
              <>
                <Link href={`/category/${category.id}`} className="hover:text-foreground transition-colors">
                  {category.name}
                </Link>
                <span>{'>'}</span>
              </>
            )}
            <span className="text-foreground font-medium">{subcategoryName}</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {category && (
                  <Link href={`/category/${category.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to {category.name}
                    </Button>
                  </Link>
                )}
                <Badge variant="secondary" className="text-sm">
                  {filteredListings.length} Listings
                </Badge>
              </div>

            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <LayoutList className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${subcategoryName.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold">{filteredListings.length}</span> results
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No listings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredListings.map((listing: any) => (
              <CategoryListingCard
                key={listing.id}
                listing={listing}
                categorySlug={subcategorySlug || ''}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}