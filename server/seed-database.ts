
import { db } from "./db";
import { adminCategories, adminSubcategories } from "../shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Check if data already exists
    const existingCategories = await db.select().from(adminCategories);
    
    if (existingCategories.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Insert categories
    const categoryData = [
      { name: 'Property Management', slug: 'property-management', description: 'Manage all property related operations', icon: 'building', color: '#1e40af', sortOrder: 1 },
      { name: 'Location Management', slug: 'location-management', description: 'Manage cities, areas and locations', icon: 'map-pin', color: '#059669', sortOrder: 2 },
      { name: 'Agency Management', slug: 'agency-management', description: 'Manage real estate agencies', icon: 'briefcase', color: '#dc2626', sortOrder: 3 },
      { name: 'User Management', slug: 'user-management', description: 'Manage system users and permissions', icon: 'users', color: '#7c3aed', sortOrder: 4 },
      { name: 'Content Management', slug: 'content-management', description: 'Manage FAQs, content and settings', icon: 'file-text', color: '#ea580c', sortOrder: 5 },
      { name: 'Analytics & Reports', slug: 'analytics-reports', description: 'View analytics and generate reports', icon: 'bar-chart', color: '#0891b2', sortOrder: 6 },
    ];

    const insertedCategories = await db.insert(adminCategories).values(categoryData).returning();
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Get category IDs
    const propertyMgmtId = insertedCategories.find(c => c.slug === 'property-management')?.id;
    const locationMgmtId = insertedCategories.find(c => c.slug === 'location-management')?.id;
    const agencyMgmtId = insertedCategories.find(c => c.slug === 'agency-management')?.id;
    const userMgmtId = insertedCategories.find(c => c.slug === 'user-management')?.id;
    const contentMgmtId = insertedCategories.find(c => c.slug === 'content-management')?.id;
    const analyticsId = insertedCategories.find(c => c.slug === 'analytics-reports')?.id;

    // Insert subcategories
    const subcategoryData = [
      // Property Management
      { name: 'Residential Properties', slug: 'residential-properties', description: 'Manage apartments, houses, villas', parentCategoryId: propertyMgmtId!, sortOrder: 1 },
      { name: 'Commercial Properties', slug: 'commercial-properties', description: 'Manage offices, shops, warehouses', parentCategoryId: propertyMgmtId!, sortOrder: 2 },
      { name: 'Property Categories', slug: 'property-categories', description: 'Manage property type categories', parentCategoryId: propertyMgmtId!, sortOrder: 3 },
      { name: 'Property Amenities', slug: 'property-amenities', description: 'Manage available amenities', parentCategoryId: propertyMgmtId!, sortOrder: 4 },
      
      // Location Management
      { name: 'Cities', slug: 'cities', description: 'Manage cities across Nepal', parentCategoryId: locationMgmtId!, sortOrder: 1 },
      { name: 'Areas & Districts', slug: 'areas-districts', description: 'Manage specific areas and districts', parentCategoryId: locationMgmtId!, sortOrder: 2 },
      { name: 'Popular Locations', slug: 'popular-locations', description: 'Manage featured locations', parentCategoryId: locationMgmtId!, sortOrder: 3 },
      
      // Agency Management
      { name: 'Agency Profiles', slug: 'agency-profiles', description: 'Manage agency information and profiles', parentCategoryId: agencyMgmtId!, sortOrder: 1 },
      { name: 'Agency Verification', slug: 'agency-verification', description: 'Verify and approve agencies', parentCategoryId: agencyMgmtId!, sortOrder: 2 },
      { name: 'Agency Performance', slug: 'agency-performance', description: 'Monitor agency performance metrics', parentCategoryId: agencyMgmtId!, sortOrder: 3 },
      
      // User Management
      { name: 'System Users', slug: 'system-users', description: 'Manage admin and regular users', parentCategoryId: userMgmtId!, sortOrder: 1 },
      { name: 'User Roles', slug: 'user-roles', description: 'Manage user permissions and roles', parentCategoryId: userMgmtId!, sortOrder: 2 },
      { name: 'User Activity', slug: 'user-activity', description: 'Monitor user activity and logs', parentCategoryId: userMgmtId!, sortOrder: 3 },
      
      // Content Management
      { name: 'FAQs', slug: 'faqs', description: 'Manage frequently asked questions', parentCategoryId: contentMgmtId!, sortOrder: 1 },
      { name: 'Site Settings', slug: 'site-settings', description: 'Manage global site configurations', parentCategoryId: contentMgmtId!, sortOrder: 2 },
      { name: 'SEO Management', slug: 'seo-management', description: 'Manage SEO settings and metadata', parentCategoryId: contentMgmtId!, sortOrder: 3 },
      
      // Analytics & Reports
      { name: 'Property Analytics', slug: 'property-analytics', description: 'View property performance metrics', parentCategoryId: analyticsId!, sortOrder: 1 },
      { name: 'User Analytics', slug: 'user-analytics', description: 'View user engagement metrics', parentCategoryId: analyticsId!, sortOrder: 2 },
      { name: 'Financial Reports', slug: 'financial-reports', description: 'Generate financial and revenue reports', parentCategoryId: analyticsId!, sortOrder: 3 },
      { name: 'System Reports', slug: 'system-reports', description: 'Generate system usage reports', parentCategoryId: analyticsId!, sortOrder: 4 },
    ];

    const insertedSubcategories = await db.insert(adminSubcategories).values(subcategoryData).returning();
    console.log(`Inserted ${insertedSubcategories.length} subcategories`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
