import { 
  type User, 
  type InsertUser,
  type Agency,
  type InsertAgency,
  type Location,
  type InsertLocation,
  type PropertyCategory,
  type InsertPropertyCategory,
  type Property,
  type InsertProperty,
  type Faq,
  type InsertFaq,
  users,
  agencies,
  locations,
  propertyCategories,
  properties,
  faqs
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, or, gte, lte, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Agencies
  getAgencies(): Promise<Agency[]>;
  getAgency(id: string): Promise<Agency | undefined>;
  createAgency(agency: InsertAgency): Promise<Agency>;

  // Locations
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Property Categories
  getPropertyCategories(): Promise<PropertyCategory[]>;
  getPropertyCategory(id: string): Promise<PropertyCategory | undefined>;
  createPropertyCategory(category: InsertPropertyCategory): Promise<PropertyCategory>;

  // Properties
  getProperties(filters?: {
    locationId?: string;
    categoryId?: string;
    agencyId?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    furnishingStatus?: string;
    isFeatured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;

  // FAQs
  getFaqs(category?: string): Promise<Faq[]>;
  getFaq(id: string): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;

  // Statistics
  getStats(): Promise<{
    totalProperties: number;
    totalAgencies: number;
    totalLocations: number;
    featuredProperties: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAgencies(): Promise<Agency[]> {
    return await db.select().from(agencies).orderBy(desc(agencies.propertyCount));
  }

  async getAgency(id: string): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency || undefined;
  }

  async createAgency(insertAgency: InsertAgency): Promise<Agency> {
    const [agency] = await db.insert(agencies).values(insertAgency).returning();
    return agency;
  }

  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).orderBy(asc(locations.name));
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(insertLocation).returning();
    return location;
  }

  async getPropertyCategories(): Promise<PropertyCategory[]> {
    return await db.select().from(propertyCategories).orderBy(asc(propertyCategories.name));
  }

  async getPropertyCategory(id: string): Promise<PropertyCategory | undefined> {
    const [category] = await db.select().from(propertyCategories).where(eq(propertyCategories.id, id));
    return category || undefined;
  }

  async createPropertyCategory(insertCategory: InsertPropertyCategory): Promise<PropertyCategory> {
    const [category] = await db.insert(propertyCategories).values(insertCategory).returning();
    return category;
  }

  async getProperties(filters?: {
    locationId?: string;
    categoryId?: string;
    agencyId?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    furnishingStatus?: string;
    isFeatured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Property[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.locationId) {
        conditions.push(eq(properties.locationId, filters.locationId));
      }
      if (filters.categoryId) {
        conditions.push(eq(properties.categoryId, filters.categoryId));
      }
      if (filters.agencyId) {
        conditions.push(eq(properties.agencyId, filters.agencyId));
      }
      if (filters.propertyType) {
        conditions.push(eq(properties.propertyType, filters.propertyType));
      }
      if (filters.minPrice) {
        conditions.push(gte(properties.price, filters.minPrice.toString()));
      }
      if (filters.maxPrice) {
        conditions.push(lte(properties.price, filters.maxPrice.toString()));
      }
      if (filters.bedrooms) {
        conditions.push(eq(properties.bedrooms, filters.bedrooms));
      }
      if (filters.bathrooms) {
        conditions.push(eq(properties.bathrooms, filters.bathrooms));
      }
      if (filters.furnishingStatus) {
        conditions.push(eq(properties.furnishingStatus, filters.furnishingStatus));
      }
      if (filters.isFeatured !== undefined) {
        conditions.push(eq(properties.isFeatured, filters.isFeatured));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(properties.title, `%${filters.search}%`),
            ilike(properties.description, `%${filters.search}%`)
          )
        );
      }
    }

    let queryBuilder = db.select().from(properties);

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    queryBuilder = queryBuilder.orderBy(desc(properties.isFeatured), desc(properties.createdAt));

    if (filters?.limit) {
      queryBuilder = queryBuilder.limit(filters.limit);
    }
    if (filters?.offset) {
      queryBuilder = queryBuilder.offset(filters.offset);
    }

    return await queryBuilder;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getFeaturedProperties(limit = 10): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.isFeatured, true))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async getFaqs(category?: string): Promise<Faq[]> {
    const conditions = [eq(faqs.isActive, true)];
    
    if (category) {
      conditions.push(eq(faqs.category, category));
    }
    
    return await db
      .select()
      .from(faqs)
      .where(and(...conditions))
      .orderBy(asc(faqs.order), asc(faqs.question));
  }

  async getFaq(id: string): Promise<Faq | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq || undefined;
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const [faq] = await db.insert(faqs).values(insertFaq).returning();
    return faq;
  }

  async getStats(): Promise<{
    totalProperties: number;
    totalAgencies: number;
    totalLocations: number;
    featuredProperties: number;
  }> {
    const [propertyCount] = await db.select({ count: sql<number>`count(*)` }).from(properties);
    const [agencyCount] = await db.select({ count: sql<number>`count(*)` }).from(agencies);
    const [locationCount] = await db.select({ count: sql<number>`count(*)` }).from(locations);
    const [featuredCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.isFeatured, true));

    return {
      totalProperties: propertyCount?.count || 0,
      totalAgencies: agencyCount?.count || 0,
      totalLocations: locationCount?.count || 0,
      featuredProperties: featuredCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
