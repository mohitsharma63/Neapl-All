
import { Router } from "express";
import { db } from "./db";
import { adminCategories, adminSubcategories, insertAdminCategorySchema, insertAdminSubcategorySchema } from "@shared/schema";
import { eq } from "drizzle-orm";

export const router = Router();

// Get all categories with subcategories
router.get("/api/admin/categories", async (req, res) => {
  try {
    const categories = await db.query.adminCategories.findMany({
      with: {
        subcategories: true
      },
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Create new category
router.post("/api/admin/categories", async (req, res) => {
  try {
    const validatedData = insertAdminCategorySchema.parse(req.body);
    const [newCategory] = await db.insert(adminCategories).values(validatedData).returning();
    res.json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "Invalid category data" });
  }
});

// Update category
router.put("/api/admin/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertAdminCategorySchema.parse(req.body);
    const [updatedCategory] = await db.update(adminCategories)
      .set(validatedData)
      .where(eq(adminCategories.id, id))
      .returning();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: "Failed to update category" });
  }
});

// Delete category
router.delete("/api/admin/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(adminCategories).where(eq(adminCategories.id, id));
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
});

// Create new subcategory
router.post("/api/admin/subcategories", async (req, res) => {
  try {
    const validatedData = insertAdminSubcategorySchema.parse(req.body);
    const [newSubcategory] = await db.insert(adminSubcategories).values(validatedData).returning();
    res.json(newSubcategory);
  } catch (error) {
    res.status(400).json({ message: "Invalid subcategory data" });
  }
});

// Update subcategory
router.put("/api/admin/subcategories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertAdminSubcategorySchema.parse(req.body);
    const [updatedSubcategory] = await db.update(adminSubcategories)
      .set(validatedData)
      .where(eq(adminSubcategories.id, id))
      .returning();
    res.json(updatedSubcategory);
  } catch (error) {
    res.status(400).json({ message: "Failed to update subcategory" });
  }
});

// Delete subcategory
router.delete("/api/admin/subcategories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(adminSubcategories).where(eq(adminSubcategories.id, id));
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
});
