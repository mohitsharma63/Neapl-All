
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Check if tables exist
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admin_categories'
    `);

    if (result.rows.length === 0) {
      console.log("Creating admin_categories and admin_subcategories tables...");
      
      // Create admin_categories table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS admin_categories (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon TEXT,
          color TEXT DEFAULT '#1e40af',
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create admin_subcategories table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS admin_subcategories (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon TEXT,
          color TEXT,
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          parent_category_id VARCHAR NOT NULL REFERENCES admin_categories(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_categories_slug ON admin_categories(slug)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_categories_active ON admin_categories(is_active)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_slug ON admin_subcategories(slug)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_parent ON admin_subcategories(parent_category_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_active ON admin_subcategories(is_active)`);

      // Create update trigger function
      await db.execute(sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `);

      // Create triggers
      await db.execute(sql`
        DROP TRIGGER IF EXISTS update_admin_categories_updated_at ON admin_categories
      `);
      await db.execute(sql`
        CREATE TRIGGER update_admin_categories_updated_at 
        BEFORE UPDATE ON admin_categories 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `);

      await db.execute(sql`
        DROP TRIGGER IF EXISTS update_admin_subcategories_updated_at ON admin_subcategories
      `);
      await db.execute(sql`
        CREATE TRIGGER update_admin_subcategories_updated_at 
        BEFORE UPDATE ON admin_subcategories 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `);

      console.log("Database tables created successfully!");
    } else {
      console.log("Tables already exist, skipping creation...");
    }

    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
