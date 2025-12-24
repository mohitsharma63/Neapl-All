export type ListingConfig = {
  apiBase: string; // base endpoint e.g. /api/tuition-private-classes
  titleField?: string;
  subtitleField?: string;
  defaultFields?: string[];
  featureKeys?: string[];
};

// Centralized config for known listing types
export const listingConfigs: Record<string, ListingConfig> = {
  "tuition-private-classes": {
    apiBase: "/api/admin/tuition-private-classes",
    titleField: "title",
    subtitleField: "tutorName",
    defaultFields: [
      "listingType",
      "subjectCategory",
      "teachingMode",
      "classType",
      "tutorQualification",
      "tutorExperienceYears",
      "gradeLevel",
      "minGrade",
      "maxGrade",
      "board",
      "batchSize",
      "feePerMonth",
      "feePerHour",
      "feePerSubject",
      "country",
      "stateProvince",
      "city",
      "areaName",
      "fullAddress",
      "isActive",
      "isFeatured",
      "viewCount",
      "createdAt",
      "updatedAt",
    ],
    featureKeys: [
      "demoClassAvailable",
      "studyMaterialProvided",
      "testSeriesIncluded",
      "doubtClearingSessions",
      "flexibleTimings",
      "weekendClasses",
      "homeTuitionAvailable",
      "onlineClassesAvailable",
    ],
  },
  // Cars & Bikes
  "cars-bikes": {
    apiBase: "/api/admin/cars-bikes",
    titleField: "title",
    subtitleField: "model",
    defaultFields: ["listingType", "vehicleType", "brand", "model", "year", "price", "kilometersDriven", "fuelType", "transmission", "color", "city", "fullAddress", "isActive", "isFeatured", "viewCount", "createdAt"],
  },
  // Car & Bike Rentals
  "car-bike-rentals": {
    apiBase: "/api/admin/car-bike-rentals",
    titleField: "title",
    subtitleField: "brand",
    defaultFields: ["rentalType", "brand", "model", "rentalPricePerDay", "rentalPricePerHour", "minimumRentalDuration", "licenseRequired", "driverAvailable", "city", "fullAddress", "isActive", "isFeatured", "viewCount", "createdAt"],
  },
  // Add other mapping entries as needed. Fallback: infer from type param
};

export const getConfigForType = (type: string) => {
  return listingConfigs[type];
};
