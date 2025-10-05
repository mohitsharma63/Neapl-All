import type { Express } from "express";
import { createServer } from "http";
import { db } from "./db";
import {
  properties,
  agencies,
  locations,
  faqs,
  adminCategories,
  adminSubcategories,
  users,
  userCategoryPreferences,
  userDocuments,
  rentalListings,
  hostelPgListings,
  constructionMaterials,
  propertyDeals,
  commercialProperties,
  industrialLand,
  officeSpaces,
  insertAdminCategorySchema,
  insertAdminSubcategorySchema,
} from "../shared/schema";
import { eq, sql, desc } from "drizzle-orm";

export function registerRoutes(app: Express) {
  app.get("/api/stats", async (_req, res) => {
    try {
      const [propertiesCount, agenciesCount, locationsCount] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(properties),
        db.select({ count: sql<number>`count(*)::int` }).from(agencies),
        db.select({ count: sql<number>`count(*)::int` }).from(locations),
      ]);

      res.json({
        totalProperties: propertiesCount[0]?.count || 0,
        totalAgencies: agenciesCount[0]?.count || 0,
        totalLocations: locationsCount[0]?.count || 0,
        activeListings: propertiesCount[0]?.count || 0,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const allProperties = await db.query.properties.findMany({
        with: {
          location: true,
          category: true,
          agency: true,
        },
        orderBy: desc(properties.createdAt),
      });

      res.json(allProperties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, req.params.id),
        with: {
          location: true,
          category: true,
          agency: true,
        },
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/agencies", async (_req, res) => {
    try {
      const allAgencies = await db.query.agencies.findMany({
        orderBy: desc(agencies.createdAt),
      });

      res.json(allAgencies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/locations", async (_req, res) => {
    try {
      const allLocations = await db.query.locations.findMany();
      res.json(allLocations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/faqs", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;

      const allFaqs = category
        ? await db.query.faqs.findMany({
            where: eq(faqs.category, category),
          })
        : await db.query.faqs.findMany();

      res.json(allFaqs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/schools", async (_req, res) => {
    try {
      res.json([]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/categories", async (_req, res) => {
    try {
      const categories = await db.query.adminCategories.findMany({
        with: {
          subcategories: true,
        },
        orderBy: [adminCategories.sortOrder, adminCategories.name],
      });

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const validatedData = insertAdminCategorySchema.parse(req.body);

      const [newCategory] = await db
        .insert(adminCategories)
        .values(validatedData)
        .returning();

      res.json(newCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const validatedData = insertAdminCategorySchema.parse(req.body);

      const [updatedCategory] = await db
        .update(adminCategories)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(adminCategories.id, req.params.id))
        .returning();

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(updatedCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      await db
        .delete(adminCategories)
        .where(eq(adminCategories.id, req.params.id));

      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/subcategories", async (req, res) => {
    try {
      const validatedData = insertAdminSubcategorySchema.parse(req.body);

      const [newSubcategory] = await db
        .insert(adminSubcategories)
        .values(validatedData)
        .returning();

      res.json(newSubcategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/subcategories/:id", async (req, res) => {
    try {
      const validatedData = insertAdminSubcategorySchema.parse(req.body);

      const [updatedSubcategory] = await db
        .update(adminSubcategories)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(adminSubcategories.id, req.params.id))
        .returning();

      if (!updatedSubcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      res.json(updatedSubcategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/subcategories/:id", async (req, res) => {
    try {
      await db
        .delete(adminSubcategories)
        .where(eq(adminSubcategories.id, req.params.id));

      res.json({ message: "Subcategory deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/users", async (_req, res) => {
    try {
      const allUsers = await db.query.users.findMany({
        orderBy: desc(users.createdAt),
      });

      const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User Login (Public Endpoint) - /api/auth/login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password (in production, use bcrypt.compare)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive. Please contact support." });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: "Login successful",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Registration (Public Endpoint) - /api/auth/signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        accountType,
        categoryIds,
        subcategoryIds,
        location,
        documents,
        additionalInfo,
      } = req.body;

      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate username from email
      const username = email.split('@')[0];

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(eq(users.email, email), eq(users.username, username)),
      });

      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password, // In production, hash this password!
          firstName,
          lastName,
          phone,
          accountType,
          country: location?.country,
          state: location?.state,
          city: location?.city,
          area: location?.area,
          address: location?.address,
          postalCode: location?.postalCode,
          role: "user",
        })
        .returning();

      // Add category preferences if provided
      if (categoryIds && Array.isArray(categoryIds)) {
        // Get all categories with their subcategories
        const allCategories = await db.query.adminCategories.findMany({
          with: {
            subcategories: true,
          },
        });

        const preferences = categoryIds.map((categoryId: string) => {
          // Find the category
          const category = allCategories.find(c => c.id === categoryId);
          
          // Filter subcategories that belong to this category and are selected
          const categorySubcategories = subcategoryIds && Array.isArray(subcategoryIds)
            ? subcategoryIds.filter((subId: string) => 
                category?.subcategories.some(sub => sub.id === subId)
              )
            : [];
          
          return {
            userId: newUser.id,
            categorySlug: categoryId,
            subcategorySlugs: categorySubcategories,
          };
        });

        if (preferences.length > 0) {
          await db.insert(userCategoryPreferences).values(preferences);
        }
      }

      // Add documents if provided
      if (documents && Array.isArray(documents) && documents.length > 0) {
        const docs = documents
          .filter((doc: any) => doc && doc.name && doc.url) // Filter out invalid documents
          .map((doc: any) => ({
            userId: newUser.id,
            documentName: doc.name,
            documentUrl: doc.url,
            documentType: doc.type || 'unknown',
            fileSize: doc.size || 0,
          }));

        if (docs.length > 0) {
          await db.insert(userDocuments).values(docs);
        }
      }

      const { password: _, ...userWithoutPassword } = newUser;
      res.json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // User Registration (Public Endpoint) - /api/users/register (legacy)
  app.post("/api/users/register", async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        accountType,
        country,
        state,
        city,
        area,
        address,
        postalCode,
        categoryPreferences,
        documents,
      } = req.body;

      if (!username || !email || !password || !firstName || !lastName || !phone) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(eq(users.email, email), eq(users.username, username)),
      });

      if (existingUser) {
        return res.status(400).json({ message: "User with this email or username already exists" });
      }

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password, // In production, hash this password!
          firstName,
          lastName,
          phone,
          accountType,
          country,
          state,
          city,
          area,
          address,
          postalCode,
          role: "user",
        })
        .returning();

      // Add category preferences if provided
      if (categoryPreferences && Array.isArray(categoryPreferences)) {
        await db.insert(userCategoryPreferences).values(
          categoryPreferences.map((pref: any) => ({
            userId: newUser.id,
            categorySlug: pref.categorySlug,
            subcategorySlugs: pref.subcategorySlugs || [],
          }))
        );
      }

      // Add documents if provided
      if (documents && Array.isArray(documents)) {
        await db.insert(userDocuments).values(
          documents.map((doc: any) => ({
            userId: newUser.id,
            documentName: doc.documentName,
            documentUrl: doc.documentUrl,
            documentType: doc.documentType,
            fileSize: doc.fileSize,
          }))
        );
      }

      const { password: _, ...userWithoutPassword } = newUser;
      res.json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user by ID with preferences and documents
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.params.id),
        with: {
          categoryPreferences: true,
          documents: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        country,
        state,
        city,
        area,
        address,
        postalCode,
        avatar,
      } = req.body;

      const [updatedUser] = await db
        .update(users)
        .set({
          firstName,
          lastName,
          phone,
          country,
          state,
          city,
          area,
          address,
          postalCode,
          avatar,
          updatedAt: new Date(),
        })
        .where(eq(users.id, req.params.id))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      await db.delete(users).where(eq(users.id, req.params.id));
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user category preferences
  app.put("/api/users/:id/preferences", async (req, res) => {
    try {
      const { categoryPreferences } = req.body;

      // Delete existing preferences
      await db.delete(userCategoryPreferences).where(eq(userCategoryPreferences.userId, req.params.id));

      // Insert new preferences
      if (categoryPreferences && Array.isArray(categoryPreferences)) {
        await db.insert(userCategoryPreferences).values(
          categoryPreferences.map((pref: any) => ({
            userId: req.params.id,
            categorySlug: pref.categorySlug,
            subcategorySlugs: pref.subcategorySlugs || [],
          }))
        );
      }

      res.json({ message: "Preferences updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Create user
  app.post("/api/admin/users", async (req, res) => {
    try {
      const { username, email, password, role, firstName, lastName, phone } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password,
          role,
          firstName,
          lastName,
          phone,
        })
        .returning();

      const { password: _, ...userWithoutPassword } = newUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Update user
  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { role, isActive } = req.body;

      const [updatedUser] = await db
        .update(users)
        .set({
          role,
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(users.id, req.params.id))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Delete user
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      await db.delete(users).where(eq(users.id, req.params.id));
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rental Listings Routes
  app.get("/api/admin/rental-listings", async (_req, res) => {
    try {
      const listings = await db.query.rentalListings.findMany({
        orderBy: desc(rentalListings.createdAt),
      });
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hostel PG Routes
  app.get("/api/admin/hostel-pg", async (_req, res) => {
    try {
      const listings = await db.query.hostelPgListings.findMany({
        orderBy: desc(hostelPgListings.createdAt),
      });
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Construction Materials Routes
  app.get("/api/admin/construction-materials", async (_req, res) => {
    try {
      const materials = await db.query.constructionMaterials.findMany({
        orderBy: desc(constructionMaterials.createdAt),
      });
      res.json(materials);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Property Deals Routes
  app.get("/api/admin/property-deals", async (_req, res) => {
    try {
      const deals = await db.query.propertyDeals.findMany({
        orderBy: desc(propertyDeals.createdAt),
      });
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Commercial Properties Routes
  app.get("/api/admin/commercial-properties", async (_req, res) => {
    try {
      const properties = await db.query.commercialProperties.findMany({
        orderBy: desc(commercialProperties.createdAt),
      });
      res.json(properties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Industrial Land Routes
  app.get("/api/admin/industrial-land", async (_req, res) => {
    try {
      const lands = await db.query.industrialLand.findMany({
        orderBy: desc(industrialLand.createdAt),
      });
      res.json(lands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Office Spaces Routes
  app.get("/api/admin/office-spaces", async (_req, res) => {
    try {
      const offices = await db.query.officeSpaces.findMany({
        orderBy: desc(officeSpaces.createdAt),
      });
      res.json(offices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await db.query.adminCategories.findMany({
        with: {
          subcategories: true,
        },
        orderBy: [adminCategories.sortOrder, adminCategories.name],
      });

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}