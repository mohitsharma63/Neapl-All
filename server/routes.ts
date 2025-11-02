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
  heavyEquipment,
  showrooms,
  secondHandCarsBikes,
  insertAdminCategorySchema,
  insertAdminSubcategorySchema,
  carBikeRentals,
  transportationMovingServices,
  vehicleLicenseClasses,
  electronicsGadgets,
  phonesTabletsAccessories,
  secondHandPhonesTabletsAccessories,
  computerMobileLaptopRepairServices,
  furnitureInteriorDecor,
  householdServices,
  eventDecorationServices,
  fashionBeautyProducts,
  sareeClothingShopping,
  ebooksOnlineCourses,
  cricketSportsTraining,
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

      // Build selected services array from category and subcategory IDs
      let selectedServicesArray: string[] = [];
      
      if (categoryIds && Array.isArray(categoryIds)) {
        // Get all categories with their subcategories
        const allCategories = await db.query.adminCategories.findMany({
          with: {
            subcategories: true,
          },
        });

        // Add category slugs
        categoryIds.forEach((categoryId: string) => {
          const category = allCategories.find(c => c.id === categoryId);
          if (category) {
            selectedServicesArray.push(category.slug);
          }
        });

        // Add subcategory slugs
        if (subcategoryIds && Array.isArray(subcategoryIds)) {
          subcategoryIds.forEach((subId: string) => {
            for (const cat of allCategories) {
              const subcategory = cat.subcategories.find(sub => sub.id === subId);
              if (subcategory) {
                selectedServicesArray.push(subcategory.slug);
                break;
              }
            }
          });
        }
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
          selectedServices: selectedServicesArray,
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
        // Get all categories with their subcategories (reuse if already fetched)
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

      // Fetch all categories with subcategories for mapping
      const allCategories = await db.query.adminCategories.findMany({
        with: {
          subcategories: true,
        },
      });

      // Fetch selected services details if selectedServices exists
      let selectedServicesDetails = [];
      if (user.selectedServices && Array.isArray(user.selectedServices) && user.selectedServices.length > 0) {
        selectedServicesDetails = user.selectedServices.map(serviceSlug => {
          // Check if it's a category
          const category = allCategories.find(cat => cat.slug === serviceSlug);
          if (category) {
            return {
              slug: category.slug,
              name: category.name,
              type: 'category'
            };
          }
          
          // Check if it's a subcategory
          for (const cat of allCategories) {
            const subcategory = cat.subcategories.find(sub => sub.slug === serviceSlug);
            if (subcategory) {
              return {
                slug: subcategory.slug,
                name: subcategory.name,
                type: 'subcategory',
                parentCategory: cat.name
              };
            }
          }
          
          // Return the slug if not found
          return {
            slug: serviceSlug,
            name: serviceSlug,
            type: 'unknown'
          };
        });
      }

      // Enrich categoryPreferences with actual names
      const categoryPreferencesWithNames = user.categoryPreferences.map(pref => {
        const category = allCategories.find(cat => cat.id === pref.categorySlug || cat.slug === pref.categorySlug);
        
        const subcategoriesWithNames = pref.subcategorySlugs.map((subSlug: string) => {
          if (category) {
            const subcategory = category.subcategories.find(sub => sub.id === subSlug || sub.slug === subSlug);
            if (subcategory) {
              return {
                id: subcategory.id,
                slug: subcategory.slug,
                name: subcategory.name
              };
            }
          }
          // Fallback: search in all categories
          for (const cat of allCategories) {
            const subcategory = cat.subcategories.find(sub => sub.id === subSlug || sub.slug === subSlug);
            if (subcategory) {
              return {
                id: subcategory.id,
                slug: subcategory.slug,
                name: subcategory.name
              };
            }
          }
          return {
            id: subSlug,
            slug: subSlug,
            name: subSlug
          };
        });

        return {
          ...pref,
          categoryName: category?.name || pref.categorySlug,
          categoryId: category?.id,
          subcategoriesWithNames
        };
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        ...userWithoutPassword,
        categoryPreferences: categoryPreferencesWithNames,
        selectedServicesDetails
      });
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
      const {
        title,
        description,
        listingType,
        vehicleType,
        brand,
        model,
        year,
        price,
        kilometersDriven,
        fuelType,
        transmission,
        ownerNumber,
        registrationNumber,
        registrationState,
        insuranceValidUntil,
        color,
        images,
        documents,
        features,
        condition,
        isNegotiable,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        isActive,
        isFeatured,
      } = req.body;

      // Validate required fields
      if (!title || !listingType || !vehicleType || !brand || !model || !year || !price) {
        return res.status(400).json({
          message: "Missing required fields: title, listingType, vehicleType, brand, model, year, price"
        });
      }

      // Convert date string to Date object if provided
      const insuranceValidUntilDate = insuranceValidUntil ? new Date(insuranceValidUntil) : null;

      const [newVehicle] = await db
        .insert(carsBikes)
        .values({
          title,
          description: description || null,
          listingType,
          vehicleType,
          brand,
          model,
          year: parseInt(year.toString()),
          price: parseFloat(price.toString()),
          kilometersDriven: kilometersDriven ? parseInt(kilometersDriven.toString()) : null,
          fuelType: fuelType || null,
          transmission: transmission || null,
          ownerNumber: ownerNumber ? parseInt(ownerNumber.toString()) : null,
          registrationNumber: registrationNumber || null,
          registrationState: registrationState || null,
          insuranceValidUntil: insuranceValidUntilDate,
          color: color || null,
          images: images || [],
          documents: documents || [],
          features: features || [],
          condition: condition || null,
          isNegotiable: isNegotiable || false,
          country: country || "India",
          stateProvince: stateProvince || null,
          city: city || null,
          areaName: areaName || null,
          fullAddress: fullAddress || null,
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
        })
        .returning();

      res.status(201).json(newVehicle);
    } catch (error: any) {
      console.error("Error creating car/bike:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle
  app.put("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        listingType,
        vehicleType,
        brand,
        model,
        year,
        price,
        kilometersDriven,
        fuelType,
        transmission,
        ownerNumber,
        registrationNumber,
        registrationState,
        insuranceValidUntil,
        color,
        images,
        documents,
        features,
        condition,
        isNegotiable,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        isActive,
        isFeatured,
      } = req.body;

      // Convert date string to Date object if provided, handle invalid dates
      let insuranceValidUntilDate = null;
      if (insuranceValidUntil) {
        try {
          insuranceValidUntilDate = new Date(insuranceValidUntil);
          if (isNaN(insuranceValidUntilDate.getTime())) {
            insuranceValidUntilDate = null;
          }
        } catch (e) {
          insuranceValidUntilDate = null;
        }
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description || null;
      if (listingType !== undefined) updateData.listingType = listingType;
      if (vehicleType !== undefined) updateData.vehicleType = vehicleType;
      if (brand !== undefined) updateData.brand = brand;
      if (model !== undefined) updateData.model = model;
      if (year !== undefined) updateData.year = parseInt(year.toString());
      if (price !== undefined) updateData.price = parseFloat(price.toString());
      if (kilometersDriven !== undefined) updateData.kilometersDriven = kilometersDriven ? parseInt(kilometersDriven.toString()) : null;
      if (fuelType !== undefined) updateData.fuelType = fuelType || null;
      if (transmission !== undefined) updateData.transmission = transmission || null;
      if (ownerNumber !== undefined) updateData.ownerNumber = ownerNumber ? parseInt(ownerNumber.toString()) : null;
      if (registrationNumber !== undefined) updateData.registrationNumber = registrationNumber || null;
      if (registrationState !== undefined) updateData.registrationState = registrationState || null;
      if (insuranceValidUntil !== undefined) updateData.insuranceValidUntil = insuranceValidUntilDate;
      if (color !== undefined) updateData.color = color || null;
      if (images !== undefined) updateData.images = images || [];
      if (documents !== undefined) updateData.documents = documents || [];
      if (features !== undefined) updateData.features = features || [];
      if (condition !== undefined) updateData.condition = condition || null;
      if (isNegotiable !== undefined) updateData.isNegotiable = isNegotiable;
      if (country !== undefined) updateData.country = country;
      if (stateProvince !== undefined) updateData.stateProvince = stateProvince || null;
      if (city !== undefined) updateData.city = city || null;
      if (areaName !== undefined) updateData.areaName = areaName || null;
      if (fullAddress !== undefined) updateData.fullAddress = fullAddress || null;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

      const [updatedVehicle] = await db
        .update(carsBikes)
        .set(updateData)
        .where(eq(carsBikes.id, id))
        .returning();

      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(updatedVehicle);
    } catch (error: any) {
      console.error("Error updating car/bike:", error);
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
      console.error("Error deleting car/bike:", error);
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
      console.error("Error toggling active status for car/bike:", error);
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
      console.error("Error toggling featured status for car/bike:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Showrooms Routes - Full CRUD

  // GET all showrooms
  app.get("/api/admin/showrooms", async (_req, res) => {
    try {
      const showroomsList = await db.query.showrooms.findMany({
        orderBy: desc(showrooms.createdAt),
      });
      res.json(showroomsList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single showroom by ID
  app.get("/api/admin/showrooms/:id", async (req, res) => {
    try {
      const showroom = await db.query.showrooms.findFirst({
        where: eq(showrooms.id, req.params.id),
      });

      if (!showroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      res.json(showroom);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new showroom
  app.post("/api/admin/showrooms", async (req, res) => {
    try {
      const [newShowroom] = await db
        .insert(showrooms)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newShowroom);
    } catch (error: any) {
      console.error("Error creating showroom:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE showroom
  app.put("/api/admin/showrooms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const [updatedShowroom] = await db
        .update(showrooms)
        .set(updateData)
        .where(eq(showrooms.id, id))
        .returning();

      if (!updatedShowroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      res.json(updatedShowroom);
    } catch (error: any) {
      console.error("Error updating showroom:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE showroom
  app.delete("/api/admin/showrooms/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(showrooms)
        .where(eq(showrooms.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      res.json({ message: "Showroom deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting showroom:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/showrooms/:id/toggle-active", async (req, res) => {
    try {
      const showroom = await db.query.showrooms.findFirst({
        where: eq(showrooms.id, req.params.id),
      });

      if (!showroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      const [updated] = await db
        .update(showrooms)
        .set({ isActive: !showroom.isActive, updatedAt: new Date() })
        .where(eq(showrooms.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/showrooms/:id/toggle-featured", async (req, res) => {
    try {
      const showroom = await db.query.showrooms.findFirst({
        where: eq(showrooms.id, req.params.id),
      });

      if (!showroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      const [updated] = await db
        .update(showrooms)
        .set({ isFeatured: !showroom.isFeatured, updatedAt: new Date() })
        .where(eq(showrooms.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Heavy Equipment Routes - Full CRUD

  // GET all heavy equipment
  app.get("/api/admin/heavy-equipment", async (_req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findMany({
        orderBy: desc(heavyEquipment.createdAt),
      });
      res.json(equipment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single equipment by ID
  app.get("/api/admin/heavy-equipment/:id", async (req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findFirst({
        where: eq(heavyEquipment.id, req.params.id),
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json(equipment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new equipment
  app.post("/api/admin/heavy-equipment", async (req, res) => {
    try {
      const {
        title,
        description,
        listingType,
        equipmentType,
        category,
        brand,
        model,
        year,
        price,
        priceType,
        condition,
        hoursUsed,
        serialNumber,
        specifications,
        images,
        documents,
        features,
        maintenanceHistory,
        warrantyInfo,
        isNegotiable,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        isActive,
        isFeatured,
      } = req.body;

      if (!title || !listingType || !equipmentType || !category || !price) {
        return res.status(400).json({
          message: "Missing required fields: title, listingType, equipmentType, category, price"
        });
      }

      const [newEquipment] = await db
        .insert(heavyEquipment)
        .values({
          title,
          description: description || null,
          listingType,
          equipmentType,
          category,
          brand: brand || null,
          model: model || null,
          year: year ? parseInt(year.toString()) : null,
          price: parseFloat(price.toString()),
          priceType: priceType || "total",
          condition: condition || null,
          hoursUsed: hoursUsed ? parseInt(hoursUsed.toString()) : null,
          serialNumber: serialNumber || null,
          specifications: specifications || {},
          images: images || [],
          documents: documents || [],
          features: features || [],
          maintenanceHistory: maintenanceHistory || null,
          warrantyInfo: warrantyInfo || null,
          isNegotiable: isNegotiable || false,
          country: country || "India",
          stateProvince: stateProvince || null,
          city: city || null,
          areaName: areaName || null,
          fullAddress: fullAddress || null,
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
        })
        .returning();

      res.status(201).json(newEquipment);
    } catch (error: any) {
      console.error("Error creating heavy equipment:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE equipment
  app.put("/api/admin/heavy-equipment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const [updatedEquipment] = await db
        .update(heavyEquipment)
        .set(updateData)
        .where(eq(heavyEquipment.id, id))
        .returning();

      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json(updatedEquipment);
    } catch (error: any) {
      console.error("Error updating heavy equipment:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE equipment
  app.delete("/api/admin/heavy-equipment/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(heavyEquipment)
        .where(eq(heavyEquipment.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json({ message: "Equipment deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting heavy equipment:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/heavy-equipment/:id/toggle-active", async (req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findFirst({
        where: eq(heavyEquipment.id, req.params.id),
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const [updated] = await db
        .update(heavyEquipment)
        .set({ isActive: !equipment.isActive, updatedAt: new Date() })
        .where(eq(heavyEquipment.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status for heavy equipment:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/heavy-equipment/:id/toggle-featured", async (req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findFirst({
        where: eq(heavyEquipment.id, req.params.id),
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const [updated] = await db
        .update(heavyEquipment)
        .set({ isFeatured: !equipment.isFeatured, updatedAt: new Date() })
        .where(eq(heavyEquipment.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status for heavy equipment:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Cars & Bikes Routes - Full CRUD

  // GET all second hand cars & bikes
  app.get("/api/admin/second-hand-cars-bikes", async (_req, res) => {
    try {
      const vehicles = await db.query.secondHandCarsBikes.findMany({
        orderBy: desc(secondHandCarsBikes.createdAt),
      });
      res.json(vehicles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single vehicle by ID
  app.get("/api/admin/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const vehicle = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
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
  app.post("/api/admin/second-hand-cars-bikes", async (req, res) => {
    try {
      const [newVehicle] = await db
        .insert(secondHandCarsBikes)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newVehicle);
    } catch (error: any) {
      console.error("Error creating second hand vehicle:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle
  app.put("/api/admin/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const [updatedVehicle] = await db
        .update(secondHandCarsBikes)
        .set(updateData)
        .where(eq(secondHandCarsBikes.id, id))
        .returning();

      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(updatedVehicle);
    } catch (error: any) {
      console.error("Error updating second hand vehicle:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE vehicle
  app.delete("/api/admin/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(secondHandCarsBikes)
        .where(eq(secondHandCarsBikes.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json({ message: "Vehicle deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting second hand vehicle:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/second-hand-cars-bikes/:id/toggle-active", async (req, res) => {
    try {
      const vehicle = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(secondHandCarsBikes)
        .set({ isActive: !vehicle.isActive, updatedAt: new Date() })
        .where(eq(secondHandCarsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/second-hand-cars-bikes/:id/toggle-featured", async (req, res) => {
    try {
      const vehicle = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(secondHandCarsBikes)
        .set({ isFeatured: !vehicle.isFeatured, updatedAt: new Date() })
        .where(eq(secondHandCarsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Cars & Bikes routes
  app.get("/api/second-hand-cars-bikes", async (req, res) => {
    const listings = await db.select().from(secondHandCarsBikes);
    res.json(listings);
  });

  app.post("/api/second-hand-cars-bikes", async (req, res) => {
    const newListing = await db.insert(secondHandCarsBikes).values(req.body).returning();
    res.json(newListing[0]);
  });

  app.get("/api/second-hand-cars-bikes/:id", async (req, res) => {
    const listing = await db.select().from(secondHandCarsBikes).where(eq(secondHandCarsBikes.id, req.params.id));
    if (listing.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing[0]);
  });

  app.put("/api/second-hand-cars-bikes/:id", async (req, res) => {
    const updated = await db.update(secondHandCarsBikes).set(req.body).where(eq(secondHandCarsBikes.id, req.params.id)).returning();
    if (updated.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(updated[0]);
  });

  app.delete("/api/second-hand-cars-bikes/:id", async (req, res) => {
    await db.delete(secondHandCarsBikes).where(eq(secondHandCarsBikes.id, req.params.id));
    res.json({ success: true });
  });

  // Car & Bike Rentals routes
  app.get("/api/car-bike-rentals", async (req, res) => {
    const rentals = await db.select().from(carBikeRentals);
    res.json(rentals);
  });

  app.post("/api/car-bike-rentals", async (req, res) => {
    const newRental = await db.insert(carBikeRentals).values(req.body).returning();
    res.json(newRental[0]);
  });

  app.get("/api/car-bike-rentals/:id", async (req, res) => {
    const rental = await db.select().from(carBikeRentals).where(eq(carBikeRentals.id, req.params.id));
    if (rental.length === 0) {
      return res.status(404).json({ error: "Rental not found" });
    }
    res.json(rental[0]);
  });

  app.put("/api/car-bike-rentals/:id", async (req, res) => {
    try {
      // Sanitize the update data to ensure proper Date handling
      const {
        insuranceValidUntil,
        availableFrom,
        ...restData
      } = req.body;

      const updateData: any = {
        ...restData,
        updatedAt: new Date(),
      };

      // Handle timestamp fields - convert to Date if valid, otherwise set to null
      if (insuranceValidUntil !== undefined) {
        try {
          const date = new Date(insuranceValidUntil);
          updateData.insuranceValidUntil = isNaN(date.getTime()) ? null : date;
        } catch {
          updateData.insuranceValidUntil = null;
        }
      }

      if (availableFrom !== undefined) {
        try {
          const date = new Date(availableFrom);
          updateData.availableFrom = isNaN(date.getTime()) ? null : date;
        } catch {
          updateData.availableFrom = null;
        }
      }

      const updated = await db.update(carBikeRentals).set(updateData).where(eq(carBikeRentals.id, req.params.id)).returning();
      if (updated.length === 0) {
        return res.status(404).json({ error: "Rental not found" });
      }
      res.json(updated[0]);
    } catch (error: any) {
      console.error("Error updating car-bike rental:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/car-bike-rentals/:id", async (req, res) => {
    await db.delete(carBikeRentals).where(eq(carBikeRentals.id, req.params.id));
    res.json({ success: true });
  });

  // Transportation/Moving Services Routes - Full CRUD

  // GET all transportation services
  app.get("/api/admin/transportation-moving-services", async (_req, res) => {
    try {
      const services = await db.query.transportationMovingServices.findMany({
        orderBy: desc(transportationMovingServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single service by ID
  app.get("/api/admin/transportation-moving-services/:id", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: eq(transportationMovingServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new service
  app.post("/api/admin/transportation-moving-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(transportationMovingServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE service
  app.put("/api/admin/transportation-moving-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(transportationMovingServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE service
  app.delete("/api/admin/transportation-moving-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(transportationMovingServices)
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json({ message: "Service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/transportation-moving-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: eq(transportationMovingServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(transportationMovingServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/transportation-moving-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: eq(transportationMovingServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(transportationMovingServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(transportationMovingServices.id, req.params.id))
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

  // Vehicle License Classes Routes - Full CRUD

  // GET all vehicle license classes
  app.get("/api/admin/vehicle-license-classes", async (_req, res) => {
    try {
      const classes = await db.query.vehicleLicenseClasses.findMany({
        orderBy: desc(vehicleLicenseClasses.createdAt),
      });
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single vehicle license class by ID
  app.get("/api/admin/vehicle-license-classes/:id", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: eq(vehicleLicenseClasses.id, req.params.id),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      res.json(licenseClass);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new vehicle license class
  app.post("/api/admin/vehicle-license-classes", async (req, res) => {
    try {
      const { nextBatchStartDate, ...restData } = req.body;

      // Handle date field - convert to Date if valid, otherwise set to null
      let nextBatchStartDateValue = null;
      if (nextBatchStartDate) {
        try {
          const date = new Date(nextBatchStartDate);
          nextBatchStartDateValue = isNaN(date.getTime()) ? null : date;
        } catch {
          nextBatchStartDateValue = null;
        }
      }

      const [newClass] = await db
        .insert(vehicleLicenseClasses)
        .values({
          ...restData,
          nextBatchStartDate: nextBatchStartDateValue,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newClass);
    } catch (error: any) {
      console.error("Error creating vehicle license class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle license class
  app.put("/api/admin/vehicle-license-classes/:id", async (req, res) => {
    try {
      const { nextBatchStartDate, ...restData } = req.body;

      // Handle date field - convert to Date if valid, otherwise set to null
      let nextBatchStartDateValue = null;
      if (nextBatchStartDate) {
        try {
          const date = new Date(nextBatchStartDate);
          nextBatchStartDateValue = isNaN(date.getTime()) ? null : date;
        } catch {
          nextBatchStartDateValue = null;
        }
      }

      const updateData = {
        ...restData,
        nextBatchStartDate: nextBatchStartDateValue,
        updatedAt: new Date(),
      };

      const [updatedClass] = await db
        .update(vehicleLicenseClasses)
        .set(updateData)
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      if (!updatedClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      res.json(updatedClass);
    } catch (error: any) {
      console.error("Error updating vehicle license class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE vehicle license class
  app.delete("/api/admin/vehicle-license-classes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(vehicleLicenseClasses)
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "License class not found" });
      }

      res.json({ message: "License class deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/vehicle-license-classes/:id/toggle-active", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: eq(vehicleLicenseClasses.id, req.params.id),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      const [updated] = await db
        .update(vehicleLicenseClasses)
        .set({ isActive: !licenseClass.isActive, updatedAt: new Date() })
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/vehicle-license-classes/:id/toggle-featured", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: eq(vehicleLicenseClasses.id, req.params.id),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      const [updated] = await db
        .update(vehicleLicenseClasses)
        .set({ isFeatured: !licenseClass.isFeatured, updatedAt: new Date() })
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Electronics & Gadgets Routes - Full CRUD

  // GET all electronics & gadgets
  app.get("/api/admin/electronics-gadgets", async (_req, res) => {
    try {
      const gadgets = await db.query.electronicsGadgets.findMany({
        orderBy: desc(electronicsGadgets.createdAt),
      });
      res.json(gadgets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single electronics gadget by ID
  app.get("/api/admin/electronics-gadgets/:id", async (req, res) => {
    try {
      const gadget = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, req.params.id),
      });

      if (!gadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      res.json(gadget);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new electronics gadget
  app.post("/api/admin/electronics-gadgets", async (req, res) => {
    try {
      const [newGadget] = await db
        .insert(electronicsGadgets)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newGadget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE electronics gadget
  app.put("/api/admin/electronics-gadgets/:id", async (req, res) => {
    try {
      const [updatedGadget] = await db
        .update(electronicsGadgets)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      if (!updatedGadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      res.json(updatedGadget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE electronics gadget
  app.delete("/api/admin/electronics-gadgets/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(electronicsGadgets)
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      res.json({ message: "Electronics gadget deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/electronics-gadgets/:id/toggle-active", async (req, res) => {
    try {
      const gadget = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, req.params.id),
      });

      if (!gadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      const [updated] = await db
        .update(electronicsGadgets)
        .set({ isActive: !gadget.isActive, updatedAt: new Date() })
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/electronics-gadgets/:id/toggle-featured", async (req, res) => {
    try {
      const gadget = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, req.params.id),
      });

      if (!gadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      const [updated] = await db
        .update(electronicsGadgets)
        .set({ isFeatured: !gadget.isFeatured, updatedAt: new Date() })
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Phones, Tablets & Accessories Routes - Full CRUD

  // GET all phones, tablets & accessories
  app.get("/api/admin/phones-tablets-accessories", async (_req, res) => {
    try {
      const products = await db.query.phonesTabletsAccessories.findMany({
        orderBy: desc(phonesTabletsAccessories.createdAt),
      });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single product by ID
  app.get("/api/admin/phones-tablets-accessories/:id", async (req, res) => {
    try {
      const product = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new product
  app.post("/api/admin/phones-tablets-accessories", async (req, res) => {
    try {
      const [newProduct] = await db
        .insert(phonesTabletsAccessories)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE product
  app.put("/api/admin/phones-tablets-accessories/:id", async (req, res) => {
    try {
      const [updatedProduct] = await db
        .update(phonesTabletsAccessories)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE product
  app.delete("/api/admin/phones-tablets-accessories/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(phonesTabletsAccessories)
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/phones-tablets-accessories/:id/toggle-active", async (req, res) => {
    try {
      const product = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(phonesTabletsAccessories)
        .set({ isActive: !product.isActive, updatedAt: new Date() })
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/phones-tablets-accessories/:id/toggle-featured", async (req, res) => {
    try {
      const product = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(phonesTabletsAccessories)
        .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Phones, Tablets & Accessories Routes - Full CRUD

  // GET all second hand phones, tablets & accessories
  app.get("/api/admin/second-hand-phones-tablets-accessories", async (_req, res) => {
    try {
      const products = await db.query.secondHandPhonesTabletsAccessories.findMany({
        orderBy: desc(secondHandPhonesTabletsAccessories.createdAt),
      });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single product by ID
  app.get("/api/admin/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const product = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: eq(secondHandPhonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new product
  app.post("/api/admin/second-hand-phones-tablets-accessories", async (req, res) => {
    try {
      const [newProduct] = await db
        .insert(secondHandPhonesTabletsAccessories)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE product
  app.put("/api/admin/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const [updatedProduct] = await db
        .update(secondHandPhonesTabletsAccessories)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE product
  app.delete("/api/admin/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(secondHandPhonesTabletsAccessories)
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/second-hand-phones-tablets-accessories/:id/toggle-active", async (req, res) => {
    try {
      const product = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: eq(secondHandPhonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(secondHandPhonesTabletsAccessories)
        .set({ isActive: !product.isActive, updatedAt: new Date() })
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/second-hand-phones-tablets-accessories/:id/toggle-featured", async (req, res) => {
    try {
      const product = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: eq(secondHandPhonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(secondHandPhonesTabletsAccessories)
        .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Event & Decoration Services Routes - Full CRUD

  // GET all event decoration services
  app.get("/api/admin/event-decoration-services", async (_req, res) => {
    try {
      const services = await db.query.eventDecorationServices.findMany({
        orderBy: desc(eventDecorationServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single event decoration service by ID
  app.get("/api/admin/event-decoration-services/:id", async (req, res) => {
    try {
      const service = await db.query.eventDecorationServices.findFirst({
        where: eq(eventDecorationServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new event decoration service
  app.post("/api/admin/event-decoration-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(eventDecorationServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      console.error("Error creating event decoration service:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE event decoration service
  app.put("/api/admin/event-decoration-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(eventDecorationServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      console.error("Error updating event decoration service:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE event decoration service
  app.delete("/api/admin/event-decoration-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(eventDecorationServices)
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      res.json({ message: "Event decoration service deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting event decoration service:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/event-decoration-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.eventDecorationServices.findFirst({
        where: eq(eventDecorationServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      const [updated] = await db
        .update(eventDecorationServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/event-decoration-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.eventDecorationServices.findFirst({
        where: eq(eventDecorationServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      const [updated] = await db
        .update(eventDecorationServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Computer, Mobile & Laptop Repair Services Routes - Full CRUD

  // GET all repair services
  app.get("/api/admin/computer-mobile-laptop-repair-services", async (_req, res) => {
    try {
      const services = await db.query.computerMobileLaptopRepairServices.findMany({
        orderBy: desc(computerMobileLaptopRepairServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single repair service by ID
  app.get("/api/admin/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const service = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: eq(computerMobileLaptopRepairServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new repair service
  app.post("/api/admin/computer-mobile-laptop-repair-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(computerMobileLaptopRepairServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE repair service
  app.put("/api/admin/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(computerMobileLaptopRepairServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE repair service
  app.delete("/api/admin/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(computerMobileLaptopRepairServices)
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      res.json({ message: "Repair service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/computer-mobile-laptop-repair-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: eq(computerMobileLaptopRepairServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      const [updated] = await db
        .update(computerMobileLaptopRepairServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/computer-mobile-laptop-repair-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: eq(computerMobileLaptopRepairServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      const [updated] = await db
        .update(computerMobileLaptopRepairServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Household Services Routes - Full CRUD

  // GET all household services
  app.get("/api/admin/household-services", async (_req, res) => {
    try {
      const services = await db.query.householdServices.findMany({
        orderBy: desc(householdServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single household service by ID
  app.get("/api/admin/household-services/:id", async (req, res) => {
    try {
      const service = await db.query.householdServices.findFirst({
        where: eq(householdServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Household service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new household service
  app.post("/api/admin/household-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(householdServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE household service
  app.put("/api/admin/household-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(householdServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(householdServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Household service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE household service
  app.delete("/api/admin/household-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(householdServices)
        .where(eq(householdServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Household service not found" });
      }

      res.json({ message: "Household service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/household-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.householdServices.findFirst({
        where: eq(householdServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Household service not found" });
      }

      const [updated] = await db
        .update(householdServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(householdServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/household-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.householdServices.findFirst({
        where: eq(householdServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Household service not found" });
      }

      const [updated] = await db
        .update(householdServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(householdServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Furniture & Interior Decor Routes - Full CRUD

  // GET all furniture & interior decor
  app.get("/api/admin/furniture-interior-decor", async (_req, res) => {
    try {
      const items = await db.query.furnitureInteriorDecor.findMany({
        orderBy: desc(furnitureInteriorDecor.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single furniture item by ID
  app.get("/api/admin/furniture-interior-decor/:id", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new furniture item
  app.post("/api/admin/furniture-interior-decor", async (req, res) => {
    try {
      const [newItem] = await db
        .insert(furnitureInteriorDecor)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE furniture item
  app.put("/api/admin/furniture-interior-decor/:id", async (req, res) => {
    try {
      const [updatedItem] = await db
        .update(furnitureInteriorDecor)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE furniture item
  app.delete("/api/admin/furniture-interior-decor/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(furnitureInteriorDecor)
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      res.json({ message: "Furniture item deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/furniture-interior-decor/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      const [updated] = await db
        .update(furnitureInteriorDecor)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/furniture-interior-decor/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      const [updated] = await db
        .update(furnitureInteriorDecor)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Fashion & Beauty Products Routes - Full CRUD

  // GET all fashion & beauty products
  app.get("/api/admin/fashion-beauty-products", async (_req, res) => {
    try {
      const products = await db.query.fashionBeautyProducts.findMany({
        orderBy: desc(fashionBeautyProducts.createdAt),
      });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single fashion & beauty product by ID
  app.get("/api/admin/fashion-beauty-products/:id", async (req, res) => {
    try {
      const product = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new fashion & beauty product
  app.post("/api/admin/fashion-beauty-products", async (req, res) => {
    try {
      const [newProduct] = await db
        .insert(fashionBeautyProducts)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE fashion & beauty product
  app.put("/api/admin/fashion-beauty-products/:id", async (req, res) => {
    try {
      const [updatedProduct] = await db
        .update(fashionBeautyProducts)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE fashion & beauty product
  app.delete("/api/admin/fashion-beauty-products/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(fashionBeautyProducts)
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/fashion-beauty-products/:id/toggle-active", async (req, res) => {
    try {
      const product = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(fashionBeautyProducts)
        .set({ isActive: !product.isActive, updatedAt: new Date() })
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/fashion-beauty-products/:id/toggle-featured", async (req, res) => {
    try {
      const product = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(fashionBeautyProducts)
        .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cricket Sports Training Routes - Full CRUD

  // GET all cricket training programs
  app.get("/api/admin/cricket-sports-training", async (_req, res) => {
    try {
      const programs = await db.query.cricketSportsTraining.findMany({
        orderBy: desc(cricketSportsTraining.createdAt),
      });
      res.json(programs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single program by ID
  app.get("/api/admin/cricket-sports-training/:id", async (req, res) => {
    try {
      const program = await db.query.cricketSportsTraining.findFirst({
        where: eq(cricketSportsTraining.id, req.params.id),
      });

      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }

      res.json(program);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new program
  app.post("/api/admin/cricket-sports-training", async (req, res) => {
    try {
      const [newProgram] = await db
        .insert(cricketSportsTraining)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProgram);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE program
  app.put("/api/admin/cricket-sports-training/:id", async (req, res) => {
    try {
      const [updatedProgram] = await db
        .update(cricketSportsTraining)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      if (!updatedProgram) {
        return res.status(404).json({ message: "Training program not found" });
      }

      res.json(updatedProgram);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE program
  app.delete("/api/admin/cricket-sports-training/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(cricketSportsTraining)
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Training program not found" });
      }

      res.json({ message: "Training program deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/cricket-sports-training/:id/toggle-active", async (req, res) => {
    try {
      const program = await db.query.cricketSportsTraining.findFirst({
        where: eq(cricketSportsTraining.id, req.params.id),
      });

      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }

      const [updated] = await db
        .update(cricketSportsTraining)
        .set({ isActive: !program.isActive, updatedAt: new Date() })
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/cricket-sports-training/:id/toggle-featured", async (req, res) => {
    try {
      const program = await db.query.cricketSportsTraining.findFirst({
        where: eq(cricketSportsTraining.id, req.params.id),
      });

      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }

      const [updated] = await db
        .update(cricketSportsTraining)
        .set({ isFeatured: !program.isFeatured, updatedAt: new Date() })
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // E-Books & Online Courses Routes - Full CRUD

  // GET all ebooks & online courses
  app.get("/api/admin/ebooks-online-courses", async (_req, res) => {
    try {
      const items = await db.query.ebooksOnlineCourses.findMany({
        orderBy: desc(ebooksOnlineCourses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single item by ID
  app.get("/api/admin/ebooks-online-courses/:id", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: eq(ebooksOnlineCourses.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new item
  app.post("/api/admin/ebooks-online-courses", async (req, res) => {
    try {
      const [newItem] = await db
        .insert(ebooksOnlineCourses)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating ebook/course:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE item
  app.put("/api/admin/ebooks-online-courses/:id", async (req, res) => {
    try {
      const [updatedItem] = await db
        .update(ebooksOnlineCourses)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating ebook/course:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE item
  app.delete("/api/admin/ebooks-online-courses/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(ebooksOnlineCourses)
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting ebook/course:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/ebooks-online-courses/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: eq(ebooksOnlineCourses.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(ebooksOnlineCourses)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/ebooks-online-courses/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: eq(ebooksOnlineCourses.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(ebooksOnlineCourses)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Saree/Clothing/Shopping Routes - Full CRUD

  // GET all saree/clothing/shopping items
  app.get("/api/admin/saree-clothing-shopping", async (_req, res) => {
    try {
      const items = await db.query.sareeClothingShopping.findMany({
        orderBy: desc(sareeClothingShopping.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single item by ID
  app.get("/api/admin/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new item
  app.post("/api/admin/saree-clothing-shopping", async (req, res) => {
    try {
      const [newItem] = await db
        .insert(sareeClothingShopping)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating item:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE item
  app.put("/api/admin/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const [updatedItem] = await db
        .update(sareeClothingShopping)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating item:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE item
  app.delete("/api/admin/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(sareeClothingShopping)
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/saree-clothing-shopping/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(sareeClothingShopping)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/saree-clothing-shopping/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(sareeClothingShopping)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Household Services Routes - Full CRUD

  // GET all household services
  app.get("/api/admin/household-services", async (_req, res) => {
    try {
      const services = await db.query.householdServices.findMany({
        orderBy: desc(householdServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Educational Consultancy Study Abroad Routes - Full CRUD

  // GET all educational consultancy services
  app.get("/api/admin/educational-consultancy-study-abroad", async (_req, res) => {
    try {
      const services = await db.query.educationalConsultancyStudyAbroad.findMany({
        orderBy: desc(educationalConsultancyStudyAbroad.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single service by ID
  app.get("/api/admin/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const service = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: eq(educationalConsultancyStudyAbroad.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new service
  app.post("/api/admin/educational-consultancy-study-abroad", async (req, res) => {
    try {
      const [newService] = await db
        .insert(educationalConsultancyStudyAbroad)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE service
  app.put("/api/admin/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(educationalConsultancyStudyAbroad)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE service
  app.delete("/api/admin/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(educationalConsultancyStudyAbroad)
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json({ message: "Service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/educational-consultancy-study-abroad/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: eq(educationalConsultancyStudyAbroad.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(educationalConsultancyStudyAbroad)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/educational-consultancy-study-abroad/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: eq(educationalConsultancyStudyAbroad.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(educationalConsultancyStudyAbroad)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}