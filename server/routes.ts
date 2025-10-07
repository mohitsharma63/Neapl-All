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
  carsBikes,
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

  // Rental Listings Routes - Full CRUD
  
  // GET all rental listings
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

  // GET single rental listing by ID
  app.get("/api/admin/rental-listings/:id", async (req, res) => {
    try {
      const listing = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });

      if (!listing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new rental listing
  app.post("/api/admin/rental-listings", async (req, res) => {
    try {
      const [newListing] = await db
        .insert(rentalListings)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newListing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE rental listing
  app.put("/api/admin/rental-listings/:id", async (req, res) => {
    try {
      const [updatedListing] = await db
        .update(rentalListings)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      if (!updatedListing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      res.json(updatedListing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE rental listing
  app.delete("/api/admin/rental-listings/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(rentalListings)
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      res.json({ message: "Rental listing deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/rental-listings/:id/toggle-active", async (req, res) => {
    try {
      const listing = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });

      if (!listing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      const [updated] = await db
        .update(rentalListings)
        .set({ isActive: !listing.isActive, updatedAt: new Date() })
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/rental-listings/:id/toggle-featured", async (req, res) => {
    try {
      const listing = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });

      if (!listing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      const [updated] = await db
        .update(rentalListings)
        .set({ isFeatured: !listing.isFeatured, updatedAt: new Date() })
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hostel Listings Routes - Full CRUD
  
  // GET all hostels (with optional filters)
  app.get("/api/admin/hostel-pg", async (req, res) => {
    try {
      const { active, featured, ownerId } = req.query;
      
      let query = db.query.hostelPgListings.findMany({
        orderBy: desc(hostelPgListings.createdAt),
      });

      const listings = await query;
      
      // Apply filters if provided
      let filtered = listings;
      if (active !== undefined) {
        filtered = filtered.filter(h => h.active === (active === 'true'));
      }
      if (featured !== undefined) {
        filtered = filtered.filter(h => h.featured === (featured === 'true'));
      }
      if (ownerId) {
        filtered = filtered.filter(h => h.ownerId === ownerId);
      }
      
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single hostel by ID
  app.get("/api/admin/hostel-pg/:id", async (req, res) => {
    try {
      const hostel = await db.query.hostelPgListings.findFirst({
        where: eq(hostelPgListings.id, req.params.id),
      });

      if (!hostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      res.json(hostel);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new hostel
  app.post("/api/admin/hostel-pg", async (req, res) => {
    try {
      const {
        name,
        description,
        pricePerMonth,
        hostelType,
        roomType,
        totalBeds,
        availableBeds,
        country,
        stateProvince,
        city,
        area,
        fullAddress,
        contactPerson,
        contactPhone,
        rules,
        facilities,
        images,
        foodIncluded,
        featured,
        active,
        ownerId,
      } = req.body;

      // Validate required fields
      if (!name || !pricePerMonth || !hostelType || !roomType || !totalBeds || 
          !availableBeds || !country || !city || !fullAddress) {
        return res.status(400).json({ 
          message: "Missing required fields: name, pricePerMonth, hostelType, roomType, totalBeds, availableBeds, country, city, fullAddress" 
        });
      }

      // Validate availableBeds <= totalBeds
      if (parseInt(availableBeds) > parseInt(totalBeds)) {
        return res.status(400).json({ 
          message: "Available beds cannot exceed total beds" 
        });
      }

      const [newHostel] = await db
        .insert(hostelPgListings)
        .values({
          name,
          description: description || null,
          pricePerMonth,
          hostelType,
          roomType,
          totalBeds: parseInt(totalBeds),
          availableBeds: parseInt(availableBeds),
          country,
          stateProvince: stateProvince || null,
          city,
          area: area || null,
          fullAddress,
          contactPerson: contactPerson || null,
          contactPhone: contactPhone || null,
          rules: rules || null,
          facilities: facilities || [],
          images: images || [],
          foodIncluded: foodIncluded || false,
          featured: featured || false,
          active: active !== undefined ? active : true,
          ownerId: ownerId || null,
        })
        .returning();

      res.status(201).json(newHostel);
    } catch (error: any) {
      console.error("Error creating hostel:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE hostel
  app.put("/api/admin/hostel-pg/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      // Validate availableBeds <= totalBeds if both are provided
      if (updateData.availableBeds !== undefined && updateData.totalBeds !== undefined) {
        if (parseInt(updateData.availableBeds) > parseInt(updateData.totalBeds)) {
          return res.status(400).json({ 
            message: "Available beds cannot exceed total beds" 
          });
        }
      }

      const [updatedHostel] = await db
        .update(hostelPgListings)
        .set(updateData)
        .where(eq(hostelPgListings.id, id))
        .returning();

      if (!updatedHostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      res.json(updatedHostel);
    } catch (error: any) {
      console.error("Error updating hostel:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE hostel
  app.delete("/api/admin/hostel-pg/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(hostelPgListings)
        .where(eq(hostelPgListings.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      res.json({ message: "Hostel/PG deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting hostel:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/hostel-pg/:id/toggle-active", async (req, res) => {
    try {
      const hostel = await db.query.hostelPgListings.findFirst({
        where: eq(hostelPgListings.id, req.params.id),
      });

      if (!hostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      const [updated] = await db
        .update(hostelPgListings)
        .set({ active: !hostel.active, updatedAt: new Date() })
        .where(eq(hostelPgListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/hostel-pg/:id/toggle-featured", async (req, res) => {
    try {
      const hostel = await db.query.hostelPgListings.findFirst({
        where: eq(hostelPgListings.id, req.params.id),
      });

      if (!hostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      const [updated] = await db
        .update(hostelPgListings)
        .set({ featured: !hostel.featured, updatedAt: new Date() })
        .where(eq(hostelPgListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Construction Materials Routes - Full CRUD
  
  // GET all materials (with optional filters)
  app.get("/api/admin/construction-materials", async (req, res) => {
    try {
      const { isActive, isFeatured, category, city } = req.query;
      
      let query = db.query.constructionMaterials.findMany({
        orderBy: desc(constructionMaterials.createdAt),
      });

      const materials = await query;
      
      // Apply filters if provided
      let filtered = materials;
      if (isActive !== undefined) {
        filtered = filtered.filter(m => m.isActive === (isActive === 'true'));
      }
      if (isFeatured !== undefined) {
        filtered = filtered.filter(m => m.isFeatured === (isFeatured === 'true'));
      }
      if (category) {
        filtered = filtered.filter(m => m.category === category);
      }
      if (city) {
        filtered = filtered.filter(m => m.city === city);
      }
      
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single material by ID
  app.get("/api/admin/construction-materials/:id", async (req, res) => {
    try {
      const material = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });

      if (!material) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      res.json(material);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new material
  app.post("/api/admin/construction-materials", async (req, res) => {
    try {
      const {
        name,
        category,
        description,
        price,
        unit,
        brand,
        specifications,
        images,
        supplierId,
        supplierName,
        supplierContact,
        country,
        stateProvince,
        city,
        area,
        fullAddress,
        locationId,
        stockStatus,
        minimumOrder,
        isActive,
        isFeatured,
      } = req.body;

      // Validate required fields
      if (!name || !category || !price || !unit) {
        return res.status(400).json({ 
          message: "Missing required fields: name, category, price, unit" 
        });
      }

      const [newMaterial] = await db
        .insert(constructionMaterials)
        .values({
          name,
          category,
          description: description || null,
          price,
          unit,
          brand: brand || null,
          specifications: specifications || {},
          images: images || [],
          supplierId: supplierId || null,
          supplierName: supplierName || null,
          supplierContact: supplierContact || null,
          country: country || "India",
          stateProvince: stateProvince || null,
          city: city || null,
          area: area || null,
          fullAddress: fullAddress || null,
          locationId: locationId || null,
          stockStatus: stockStatus || "in_stock",
          minimumOrder: minimumOrder ? parseInt(minimumOrder) : null,
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
        })
        .returning();

      res.status(201).json(newMaterial);
    } catch (error: any) {
      console.error("Error creating material:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE material
  app.put("/api/admin/construction-materials/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const [updatedMaterial] = await db
        .update(constructionMaterials)
        .set(updateData)
        .where(eq(constructionMaterials.id, id))
        .returning();

      if (!updatedMaterial) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      res.json(updatedMaterial);
    } catch (error: any) {
      console.error("Error updating material:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE material
  app.delete("/api/admin/construction-materials/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(constructionMaterials)
        .where(eq(constructionMaterials.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      res.json({ message: "Construction material deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting material:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/construction-materials/:id/toggle-active", async (req, res) => {
    try {
      const material = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });

      if (!material) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      const [updated] = await db
        .update(constructionMaterials)
        .set({ isActive: !material.isActive, updatedAt: new Date() })
        .where(eq(constructionMaterials.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/construction-materials/:id/toggle-featured", async (req, res) => {
    try {
      const material = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });

      if (!material) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      const [updated] = await db
        .update(constructionMaterials)
        .set({ isFeatured: !material.isFeatured, updatedAt: new Date() })
        .where(eq(constructionMaterials.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Property Deals Routes - Full CRUD
  
  // GET all property deals
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

  // GET single property deal by ID
  app.get("/api/admin/property-deals/:id", async (req, res) => {
    try {
      const deal = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });

      if (!deal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      res.json(deal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new property deal
  app.post("/api/admin/property-deals", async (req, res) => {
    try {
      const [newDeal] = await db
        .insert(propertyDeals)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newDeal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE property deal
  app.put("/api/admin/property-deals/:id", async (req, res) => {
    try {
      const [updatedDeal] = await db
        .update(propertyDeals)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      if (!updatedDeal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      res.json(updatedDeal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE property deal
  app.delete("/api/admin/property-deals/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(propertyDeals)
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      res.json({ message: "Property deal deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/property-deals/:id/toggle-active", async (req, res) => {
    try {
      const deal = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });

      if (!deal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      const [updated] = await db
        .update(propertyDeals)
        .set({ isActive: !deal.isActive, updatedAt: new Date() })
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/property-deals/:id/toggle-featured", async (req, res) => {
    try {
      const deal = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });

      if (!deal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      const [updated] = await db
        .update(propertyDeals)
        .set({ isFeatured: !deal.isFeatured, updatedAt: new Date() })
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Commercial Properties Routes - Full CRUD
  
  // GET all commercial properties
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

  // GET single commercial property by ID
  app.get("/api/admin/commercial-properties/:id", async (req, res) => {
    try {
      const property = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });

      if (!property) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      res.json(property);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new commercial property
  app.post("/api/admin/commercial-properties", async (req, res) => {
    try {
      const [newProperty] = await db
        .insert(commercialProperties)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProperty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE commercial property
  app.put("/api/admin/commercial-properties/:id", async (req, res) => {
    try {
      const [updatedProperty] = await db
        .update(commercialProperties)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      if (!updatedProperty) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      res.json(updatedProperty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE commercial property
  app.delete("/api/admin/commercial-properties/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(commercialProperties)
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      res.json({ message: "Commercial property deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/commercial-properties/:id/toggle-active", async (req, res) => {
    try {
      const property = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });

      if (!property) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      const [updated] = await db
        .update(commercialProperties)
        .set({ isActive: !property.isActive, updatedAt: new Date() })
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/commercial-properties/:id/toggle-featured", async (req, res) => {
    try {
      const property = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });

      if (!property) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      const [updated] = await db
        .update(commercialProperties)
        .set({ isFeatured: !property.isFeatured, updatedAt: new Date() })
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Industrial Land Routes - Full CRUD
  
  // GET all industrial land
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

  // GET single industrial land by ID
  app.get("/api/admin/industrial-land/:id", async (req, res) => {
    try {
      const land = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });

      if (!land) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      res.json(land);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new industrial land
  app.post("/api/admin/industrial-land", async (req, res) => {
    try {
      const [newLand] = await db
        .insert(industrialLand)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newLand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE industrial land
  app.put("/api/admin/industrial-land/:id", async (req, res) => {
    try {
      const [updatedLand] = await db
        .update(industrialLand)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      if (!updatedLand) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      res.json(updatedLand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE industrial land
  app.delete("/api/admin/industrial-land/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(industrialLand)
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      res.json({ message: "Industrial land deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/industrial-land/:id/toggle-active", async (req, res) => {
    try {
      const land = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });

      if (!land) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      const [updated] = await db
        .update(industrialLand)
        .set({ isActive: !land.isActive, updatedAt: new Date() })
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/industrial-land/:id/toggle-featured", async (req, res) => {
    try {
      const land = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });

      if (!land) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      const [updated] = await db
        .update(industrialLand)
        .set({ isFeatured: !land.isFeatured, updatedAt: new Date() })
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Office Spaces Routes - Full CRUD
  
  // GET all office spaces
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

  // GET single office space by ID
  app.get("/api/admin/office-spaces/:id", async (req, res) => {
    try {
      const office = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });

      if (!office) {
        return res.status(404).json({ message: "Office space not found" });
      }

      res.json(office);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new office space
  app.post("/api/admin/office-spaces", async (req, res) => {
    try {
      const [newOffice] = await db
        .insert(officeSpaces)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newOffice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE office space
  app.put("/api/admin/office-spaces/:id", async (req, res) => {
    try {
      const [updatedOffice] = await db
        .update(officeSpaces)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      if (!updatedOffice) {
        return res.status(404).json({ message: "Office space not found" });
      }

      res.json(updatedOffice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE office space
  app.delete("/api/admin/office-spaces/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(officeSpaces)
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Office space not found" });
      }

      res.json({ message: "Office space deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/office-spaces/:id/toggle-active", async (req, res) => {
    try {
      const office = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });

      if (!office) {
        return res.status(404).json({ message: "Office space not found" });
      }

      const [updated] = await db
        .update(officeSpaces)
        .set({ isActive: !office.isActive, updatedAt: new Date() })
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/office-spaces/:id/toggle-featured", async (req, res) => {
    try {
      const office = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });

      if (!office) {
        return res.status(404).json({ message: "Office space not found" });
      }

      const [updated] = await db
        .update(officeSpaces)
        .set({ isFeatured: !office.isFeatured, updatedAt: new Date() })
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cars & Bikes Routes - Full CRUD

  // GET all cars & bikes
  app.get("/api/admin/cars-bikes", async (_req, res) => {
    try {
      const vehicles = await db.query.carsBikes.findMany({
        orderBy: desc(carsBikes.createdAt),
      });
      res.json(vehicles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single vehicle by ID
  app.get("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const vehicle = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(vehicle);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new vehicle
  app.post("/api/admin/cars-bikes", async (req, res) => {
    try {
      const [newVehicle] = await db
        .insert(carsBikes)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newVehicle);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle
  app.put("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const [updatedVehicle] = await db
        .update(carsBikes)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(updatedVehicle);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE vehicle
  app.delete("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(carsBikes)
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json({ message: "Vehicle deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/cars-bikes/:id/toggle-active", async (req, res) => {
    try {
      const vehicle = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(carsBikes)
        .set({ isActive: !vehicle.isActive, updatedAt: new Date() })
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/cars-bikes/:id/toggle-featured", async (req, res) => {
    try {
      const vehicle = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(carsBikes)
        .set({ isFeatured: !vehicle.isFeatured, updatedAt: new Date() })
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      res.json(updated);
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