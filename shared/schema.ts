import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import * as crypto from 'crypto';

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: text("role").default("user"), // "admin", "agent", "user"
  accountType: text("account_type"), // "individual", "buyer", "seller"
  isActive: boolean("is_active").default(true),
  avatar: text("avatar"),
  country: text("country"),
  state: text("state"),
  city: text("city"),
  area: text("area"),
  address: text("address"),
  postalCode: text("postal_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userCategoryPreferences = pgTable("user_category_preferences", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categorySlug: text("category_slug").notNull(),
  subcategorySlugs: jsonb("subcategory_slugs").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userDocuments = pgTable("user_documents", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url").notNull(),
  documentType: text("document_type"),
  fileSize: integer("file_size"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const agencies = pgTable("agencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerName: text("owner_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  logo: text("logo"),
  description: text("description"),
  verified: boolean("verified").default(false),
  propertyCount: integer("property_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: text("country"),
  state: text("state"),
  city: text("city"),
  area: text("area"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  postalCode: text("postal_code"),
  propertyCount: integer("property_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const propertyCategories = pgTable("property_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  description: text("description"),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceType: text("price_type").notNull(), // "monthly", "yearly", "sale"
  propertyType: text("property_type").notNull(), // "apartment", "villa", "office", "shop"
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: decimal("area", { precision: 8, scale: 2 }),
  furnishingStatus: text("furnishing_status"), // "furnished", "unfurnished", "semi-furnished"
  availabilityStatus: text("availability_status"), // "available", "rented", "sold"
  images: jsonb("images").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  isFeatured: boolean("is_featured").default(false),
  isNegotiable: boolean("is_negotiable").default(false),

  // Relations
  locationId: varchar("location_id").references(() => locations.id),
  categoryId: varchar("category_id").references(() => propertyCategories.id),
  agencyId: varchar("agency_id").references(() => agencies.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(), // "agent", "listing", "looking"
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
});

export const adminCategories = pgTable("admin_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color").default("#1e40af"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminSubcategories = pgTable("admin_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  parentCategoryId: varchar("parent_category_id").notNull().references(() => adminCategories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const agenciesRelations = relations(agencies, ({ many }) => ({
  properties: many(properties),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  properties: many(properties),
}));

export const propertyCategoriesRelations = relations(propertyCategories, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one }) => ({
  location: one(locations, {
    fields: [properties.locationId],
    references: [locations.id],
  }),
  category: one(propertyCategories, {
    fields: [properties.categoryId],
    references: [propertyCategories.id],
  }),
  agency: one(agencies, {
    fields: [properties.agencyId],
    references: [agencies.id],
  }),
}));

export const adminCategoriesRelations = relations(adminCategories, ({ many }) => ({
  subcategories: many(adminSubcategories),
}));

export const adminSubcategoriesRelations = relations(adminSubcategories, ({ one }) => ({
  parentCategory: one(adminCategories, {
    fields: [adminSubcategories.parentCategoryId],
    references: [adminCategories.id],
  }),
}));

export const propertyPages = pgTable("property_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  priceType: text("price_type").notNull(),
  propertyFilter: text("property_filter"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(10),
  accountType: z.enum(["individual", "buyer", "seller"]),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
});

export const insertAgencySchema = createInsertSchema(agencies).omit({
  id: true,
  createdAt: true,
  propertyCount: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  propertyCount: true,
});

export const insertPropertyCategorySchema = createInsertSchema(propertyCategories).omit({
  id: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export const userRelations = relations(users, ({ many }) => ({
  categoryPreferences: many(userCategoryPreferences),
  documents: many(userDocuments),
}));

export const userCategoryPreferencesRelations = relations(userCategoryPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userCategoryPreferences.userId],
    references: [users.id],
  }),
}));

export const userDocumentsRelations = relations(userDocuments, ({ one }) => ({
  user: one(users, {
    fields: [userDocuments.userId],
    references: [users.id],
  }),
}));

export const insertUserCategoryPreferenceSchema = createInsertSchema(userCategoryPreferences).omit({
  id: true,
  createdAt: true,
});

export const insertUserDocumentSchema = createInsertSchema(userDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertAdminCategorySchema = createInsertSchema(adminCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  color: z.string().default("#1e40af"),
});

export const insertAdminSubcategorySchema = createInsertSchema(adminSubcategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// export type User = typeof users.$inferSelect;
// export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserCategoryPreference = typeof userCategoryPreferences.$inferSelect;
export type UserDocument = typeof userDocuments.$inferSelect;

// Rental Listings
export const rentalListings = pgTable("rental_listings", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  rentalType: text("rental_type").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: decimal("area", { precision: 8, scale: 2 }),
  furnishingStatus: text("furnishing_status"),
  images: jsonb("images").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  availableFrom: timestamp("available_from"),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  areaName: text("area_name"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  agencyId: varchar("agency_id").references(() => agencies.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hostel PG Listings
export const hostelPgListings = pgTable("hostel_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  pricePerMonth: decimal("price_per_month", { precision: 10, scale: 2 }).notNull(),
  hostelType: text("hostel_type").notNull(),
  roomType: text("room_type").notNull(),
  totalBeds: integer("total_beds").notNull(),
  availableBeds: integer("available_beds").notNull(),
  country: text("country").notNull(),
  stateProvince: text("state_province"),
  city: text("city").notNull(),
  area: text("area"),
  fullAddress: text("full_address").notNull(),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  rules: text("rules"),
  facilities: jsonb("facilities").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  foodIncluded: boolean("food_included").default(false),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  ownerId: varchar("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Construction Materials
export const constructionMaterials = pgTable("construction_materials", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  brand: text("brand"),
  specifications: jsonb("specifications"),
  images: jsonb("images").$type<string[]>().default([]),
  supplierId: varchar("supplier_id"),
  supplierName: text("supplier_name"),
  supplierContact: text("supplier_contact"),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  area: text("area"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  stockStatus: text("stock_status").default("in_stock"),
  minimumOrder: integer("minimum_order"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cars & Bikes
export const carsBikes = pgTable("cars_bikes", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  listingType: text("listing_type").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  kilometersDriven: integer("kilometers_driven"),
  fuelType: text("fuel_type"),
  transmission: text("transmission"),
  ownerNumber: integer("owner_number"),
  registrationNumber: text("registration_number"),
  registrationState: text("registration_state"),
  insuranceValidUntil: timestamp("insurance_valid_until"),
  color: text("color"),
  images: jsonb("images").$type<string[]>().default([]),
  documents: jsonb("documents").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  condition: text("condition"),
  isNegotiable: boolean("is_negotiable").default(false),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  areaName: text("area_name"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  sellerId: varchar("seller_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property Deals
export const propertyDeals = pgTable("property_deals", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  dealType: text("deal_type").notNull(),
  propertyType: text("property_type").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  area: decimal("area", { precision: 10, scale: 2 }),
  areaUnit: text("area_unit").default("sq.ft"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  floors: integer("floors"),
  roadAccess: text("road_access"),
  facingDirection: text("facing_direction"),
  images: jsonb("images").$type<string[]>().default([]),
  documents: jsonb("documents").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  isNegotiable: boolean("is_negotiable").default(false),
  ownershipType: text("ownership_type"),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  areaName: text("area_name"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  agencyId: varchar("agency_id").references(() => agencies.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commercial Properties
export const commercialProperties = pgTable("commercial_properties", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  commercialType: text("commercial_type").notNull(),
  listingType: text("listing_type").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  priceType: text("price_type"),
  area: decimal("area", { precision: 10, scale: 2 }),
  floors: integer("floors"),
  parkingSpaces: integer("parking_spaces"),
  footfall: text("footfall"),
  images: jsonb("images").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  suitableFor: jsonb("suitable_for").$type<string[]>().default([]),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  areaName: text("area_name"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  agencyId: varchar("agency_id").references(() => agencies.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Industrial Land
export const industrialLand = pgTable("industrial_land", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  listingType: text("listing_type").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  area: decimal("area", { precision: 10, scale: 2 }).notNull(),
  areaUnit: text("area_unit").default("ropani"),
  landType: text("land_type"),
  zoning: text("zoning"),
  roadAccess: text("road_access"),
  electricityAvailable: boolean("electricity_available").default(false),
  waterSupply: boolean("water_supply").default(false),
  sewerageAvailable: boolean("sewerage_available").default(false),
  images: jsonb("images").$type<string[]>().default([]),
  documents: jsonb("documents").$type<string[]>().default([]),
  suitableFor: jsonb("suitable_for").$type<string[]>().default([]),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  areaName: text("area_name"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  agencyId: varchar("agency_id").references(() => agencies.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Office Spaces
export const officeSpaces = pgTable("office_spaces", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  listingType: text("listing_type").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  priceType: text("price_type").default("monthly"),
  area: decimal("area", { precision: 10, scale: 2 }),
  officeType: text("office_type"),
  capacity: integer("capacity"),
  cabins: integer("cabins"),
  workstations: integer("workstations"),
  meetingRooms: integer("meeting_rooms"),
  furnishingStatus: text("furnishing_status"),
  images: jsonb("images").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  parkingSpaces: integer("parking_spaces"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  availableFrom: timestamp("available_from"),
  country: text("country").notNull().default("India"),
  stateProvince: text("state_province"),
  city: text("city"),
  areaName: text("area_name"),
  fullAddress: text("full_address"),
  locationId: varchar("location_id").references(() => locations.id),
  agencyId: varchar("agency_id").references(() => agencies.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertPropertyPageSchema = createInsertSchema(propertyPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agencies.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertPropertyCategory = z.infer<typeof insertPropertyCategorySchema>;
export type PropertyCategory = typeof propertyCategories.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

export type InsertAdminCategory = z.infer<typeof insertAdminCategorySchema>;
export type AdminCategory = typeof adminCategories.$inferSelect;

export type InsertAdminSubcategory = z.infer<typeof insertAdminSubcategorySchema>;
export type AdminSubcategory = typeof adminSubcategories.$inferSelect;

export const insertRentalListingSchema = createInsertSchema(rentalListings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRentalListing = z.infer<typeof insertRentalListingSchema>;
export type RentalListing = typeof rentalListings.$inferSelect;

export const insertHostelPgListingSchema = createInsertSchema(hostelPgListings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHostelPgListing = z.infer<typeof insertHostelPgListingSchema>;
export type HostelPgListing = typeof hostelPgListings.$inferSelect;

export const insertConstructionMaterialSchema = createInsertSchema(constructionMaterials).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertConstructionMaterial = z.infer<typeof insertConstructionMaterialSchema>;
export type ConstructionMaterial = typeof constructionMaterials.$inferSelect;

export const insertPropertyDealSchema = createInsertSchema(propertyDeals).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPropertyDeal = z.infer<typeof insertPropertyDealSchema>;
export type PropertyDeal = typeof propertyDeals.$inferSelect;

export const insertCommercialPropertySchema = createInsertSchema(commercialProperties).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCommercialProperty = z.infer<typeof insertCommercialPropertySchema>;
export type CommercialProperty = typeof commercialProperties.$inferSelect;

export const insertIndustrialLandSchema = createInsertSchema(industrialLand).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertIndustrialLand = z.infer<typeof insertIndustrialLandSchema>;
export type IndustrialLand = typeof industrialLand.$inferSelect;

export const insertOfficeSpaceSchema = createInsertSchema(officeSpaces).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOfficeSpace = z.infer<typeof insertOfficeSpaceSchema>;
export type OfficeSpace = typeof officeSpaces.$inferSelect;

export type InsertPropertyPage = z.infer<typeof insertPropertyPageSchema>;
export type PropertyPage = typeof propertyPages.$inferSelect;