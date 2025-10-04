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

  const httpServer = createServer(app);
  return httpServer;
}