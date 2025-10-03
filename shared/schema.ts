import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: text("role").default("user"), // "admin", "agent", "user"
  isActive: boolean("is_active").default(true),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agencies = pgTable("agencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  propertyCount: integer("property_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city"),
  area: text("area"),
  propertyCount: integer("property_count").default(0),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
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

export const insertAdminCategorySchema = createInsertSchema(adminCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminSubcategorySchema = createInsertSchema(adminSubcategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
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