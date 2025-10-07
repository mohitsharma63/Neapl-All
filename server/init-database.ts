import { db } from "./db";
import { sql } from "drizzle-orm";

export async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Test database connection first
    try {
      await db.execute(sql`SELECT 1`);
      console.log("✅ Database connection successful");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError);
      throw new Error("Cannot connect to database. Please ensure DATABASE_URL is correct and the database is accessible.");
    }

    // Create update trigger function first (if not exists)
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

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

    // Create industrial_land table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS industrial_land (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        listing_type TEXT NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        area NUMERIC(10,2) NOT NULL,
        area_unit TEXT DEFAULT 'ropani',
        land_type TEXT,
        zoning TEXT,
        road_access TEXT,
        electricity_available BOOLEAN DEFAULT FALSE,
        water_supply BOOLEAN DEFAULT FALSE,
        sewerage_available BOOLEAN DEFAULT FALSE,
        images JSONB DEFAULT '[]',
        documents JSONB DEFAULT '[]',
        suitable_for JSONB DEFAULT '[]',
        country TEXT NOT NULL DEFAULT 'India',
        state_province TEXT,
        city TEXT,
        area_name TEXT,
        full_address TEXT,
        location_id VARCHAR,
        agency_id VARCHAR,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create cars_bikes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cars_bikes (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        listing_type TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        kilometers_driven INTEGER,
        fuel_type TEXT,
        transmission TEXT,
        owner_number INTEGER,
        registration_number TEXT,
        registration_state TEXT,
        insurance_valid_until TIMESTAMP,
        color TEXT,
        images JSONB DEFAULT '[]',
        documents JSONB DEFAULT '[]',
        features JSONB DEFAULT '[]',
        condition TEXT,
        is_negotiable BOOLEAN DEFAULT FALSE,
        country TEXT NOT NULL DEFAULT 'India',
        state_province TEXT,
        city TEXT,
        area_name TEXT,
        full_address TEXT,
        location_id VARCHAR,
        seller_id VARCHAR,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
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
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_city ON industrial_land(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_is_active ON industrial_land(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_is_featured ON industrial_land(is_featured)`);

    // Create cars_bikes indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_listing_type ON cars_bikes(listing_type)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_vehicle_type ON cars_bikes(vehicle_type)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_brand ON cars_bikes(brand)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_city ON cars_bikes(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_is_active ON cars_bikes(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_is_featured ON cars_bikes(is_featured)`);

    // Create triggers
    await db.execute(sql`DROP TRIGGER IF EXISTS update_admin_categories_updated_at ON admin_categories`);
    await db.execute(sql`
      CREATE TRIGGER update_admin_categories_updated_at 
      BEFORE UPDATE ON admin_categories 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_admin_subcategories_updated_at ON admin_subcategories`);
    await db.execute(sql`
      CREATE TRIGGER update_admin_subcategories_updated_at 
      BEFORE UPDATE ON admin_subcategories 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_industrial_land_updated_at ON industrial_land`);
    await db.execute(sql`
      CREATE TRIGGER update_industrial_land_updated_at 
      BEFORE UPDATE ON industrial_land 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    // Create cars_bikes trigger
    await db.execute(sql`DROP TRIGGER IF EXISTS update_cars_bikes_updated_at ON cars_bikes`);
    await db.execute(sql`
      CREATE TRIGGER update_cars_bikes_updated_at 
      BEFORE UPDATE ON cars_bikes 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    console.log("✅ Database tables created successfully!");
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}