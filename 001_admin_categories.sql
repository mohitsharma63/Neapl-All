CREATE TABLE IF NOT EXISTS public.users
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    username text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    role text COLLATE pg_catalog."default" DEFAULT 'user'::text,
    account_type text COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    avatar text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    state text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
)
TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.user_documents
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    document_name text COLLATE pg_catalog."default" NOT NULL,
    document_url text COLLATE pg_catalog."default" NOT NULL,
    document_type text COLLATE pg_catalog."default",
    file_size integer,
    uploaded_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_documents_pkey PRIMARY KEY (id),
    CONSTRAINT user_documents_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_documents
    OWNER to postgres;
-- Index: idx_user_documents_user

-- DROP INDEX IF EXISTS public.idx_user_documents_user;

CREATE INDEX IF NOT EXISTS idx_user_documents_user
    ON public.user_documents USING btree
    (user_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.user_category_preferences
(
    id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    category_slug text COLLATE pg_catalog."default" NOT NULL,
    subcategory_slugs jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_category_preferences_pkey PRIMARY KEY (id),
    CONSTRAINT user_category_preferences_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_category_preferences
    OWNER to postgres;


CREATE INDEX IF NOT EXISTS idx_user_category_preferences_user
    ON public.user_category_preferences USING btree
    (user_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE TABLE admin_categories (
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
);

-- Create subcategories table with parent relationship
CREATE TABLE admin_subcategories (
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
);


CREATE TABLE IF NOT EXISTS hostel_listings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_month NUMERIC(10,2) NOT NULL CHECK (price_per_month >= 0),
  hostel_type TEXT NOT NULL,
  room_type TEXT NOT NULL,
  total_beds INTEGER NOT NULL CHECK (total_beds >= 0),
  available_beds INTEGER NOT NULL CHECK (available_beds >= 0 AND available_beds <= total_beds),
  country TEXT NOT NULL,
  state_province TEXT,
  city TEXT NOT NULL,
  area TEXT,
  full_address TEXT NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  rules TEXT,
  facilities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  food_included BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  owner_id VARCHAR,  -- ✅ match users.id type
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Fix: Add missing referenced table for location_id (example assumes 'locations' table with 'id')
-- You can change 'locations(id)' to your actual table name and column.

CREATE TABLE IF NOT EXISTS construction_materials (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL,
  brand TEXT,
  specifications JSONB,
  images JSONB DEFAULT '[]',
  supplier_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  supplier_name TEXT,
  supplier_contact TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  stock_status TEXT DEFAULT 'in_stock',
  minimum_order INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ✅ Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_construction_materials_category ON construction_materials(category);
CREATE INDEX IF NOT EXISTS idx_construction_materials_city ON construction_materials(city);
CREATE INDEX IF NOT EXISTS idx_construction_materials_is_active ON construction_materials(is_active);
CREATE INDEX IF NOT EXISTS idx_construction_materials_is_featured ON construction_materials(is_featured);
CREATE INDEX IF NOT EXISTS idx_construction_materials_stock_status ON construction_materials(stock_status);
CREATE INDEX IF NOT EXISTS idx_construction_materials_created_at ON construction_materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_construction_materials_location_id ON construction_materials(location_id);

-- ✅ Create or replace trigger function
CREATE OR REPLACE FUNCTION update_construction_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ Drop trigger if exists (no problem if it doesn’t exist)
DROP TRIGGER IF EXISTS trigger_update_construction_materials_updated_at ON construction_materials;

-- ✅ Create trigger
CREATE TRIGGER trigger_update_construction_materials_updated_at
BEFORE UPDATE ON construction_materials
FOR EACH ROW
EXECUTE FUNCTION update_construction_materials_updated_at();
-- ==========================================================
-- Table: property_deals
-- Description: Stores property listings for Buy/Sell deals
-- ==========================================================

CREATE TABLE IF NOT EXISTS property_deals (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('buy', 'sell')),
  property_type TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  area NUMERIC(10,2),
  area_unit TEXT DEFAULT 'sq.ft',
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  road_access TEXT,
  facing_direction TEXT,
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  is_negotiable BOOLEAN DEFAULT false,
  ownership_type TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR,
  agency_id VARCHAR,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes (for performance optimization)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_property_deals_deal_type ON property_deals(deal_type);
CREATE INDEX IF NOT EXISTS idx_property_deals_property_type ON property_deals(property_type);
CREATE INDEX IF NOT EXISTS idx_property_deals_city ON property_deals(city);
CREATE INDEX IF NOT EXISTS idx_property_deals_is_active ON property_deals(is_active);
CREATE INDEX IF NOT EXISTS idx_property_deals_is_featured ON property_deals(is_featured);
CREATE INDEX IF NOT EXISTS idx_property_deals_created_at ON property_deals(created_at DESC);

-- ==========================================================
-- Trigger function to auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_property_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_property_deals_updated_at
BEFORE UPDATE ON property_deals
FOR EACH ROW
EXECUTE FUNCTION update_property_deals_updated_at();
-- ==========================================================
-- Table: industrial_properties
-- Description: Stores listings for factories, warehouses,
-- industrial land, and related properties
-- ==========================================================

CREATE TABLE IF NOT EXISTS industrial_properties (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  industrial_type TEXT NOT NULL CHECK (industrial_type IN ('factory', 'warehouse', 'industrial land', 'logistics hub', 'manufacturing unit')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('rent', 'sale', 'lease')),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  price_type TEXT CHECK (price_type IN ('monthly', 'yearly', 'total')),
  land_area NUMERIC(12,2),
  built_up_area NUMERIC(12,2),
  area_unit TEXT DEFAULT 'sq.ft',
  floors INTEGER,
  power_supply TEXT, -- e.g., "24/7", "3-phase"
  water_facility BOOLEAN DEFAULT FALSE,
  road_access TEXT,
  loading_docks INTEGER,
  parking_spaces INTEGER,
  crane_facility BOOLEAN DEFAULT FALSE,
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  suitable_for JSONB DEFAULT '[]',
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  agency_id VARCHAR REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes (for performance)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_industrial_properties_industrial_type ON industrial_properties(industrial_type);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_listing_type ON industrial_properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_city ON industrial_properties(city);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_is_active ON industrial_properties(is_active);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_is_featured ON industrial_properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_industrial_properties_created_at ON industrial_properties(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_industrial_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_industrial_properties_updated_at
BEFORE UPDATE ON industrial_properties
FOR EACH ROW
EXECUTE FUNCTION update_industrial_properties_updated_at();
-- ==========================================================
-- Table: office_spaces
-- Description: Stores listings for office spaces (private, shared, coworking, virtual)
-- ==========================================================

CREATE TABLE IF NOT EXISTS office_spaces (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('rent', 'sale', 'lease')),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  price_type TEXT DEFAULT 'monthly' CHECK (price_type IN ('monthly','yearly','total')),
  area NUMERIC(10,2),
  office_type TEXT CHECK (office_type IN ('private', 'shared', 'coworking', 'virtual')),
  capacity INTEGER,
  cabins INTEGER,
  workstations INTEGER,
  meeting_rooms INTEGER,
  furnishing_status TEXT,
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  parking_spaces INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  available_from TIMESTAMPTZ,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  agency_id VARCHAR REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_office_spaces_listing_type ON office_spaces(listing_type);
CREATE INDEX IF NOT EXISTS idx_office_spaces_office_type ON office_spaces(office_type);
CREATE INDEX IF NOT EXISTS idx_office_spaces_city ON office_spaces(city);
CREATE INDEX IF NOT EXISTS idx_office_spaces_is_active ON office_spaces(is_active);
CREATE INDEX IF NOT EXISTS idx_office_spaces_is_featured ON office_spaces(is_featured);
CREATE INDEX IF NOT EXISTS idx_office_spaces_created_at ON office_spaces(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_office_spaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_office_spaces_updated_at
BEFORE UPDATE ON office_spaces
FOR EACH ROW
EXECUTE FUNCTION update_office_spaces_updated_at();
-- ==========================================================
-- Table: rental_listings
-- Description: Stores rental listings for rooms, flats, apartments, houses
-- ==========================================================

CREATE TABLE IF NOT EXISTS rental_listings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  rental_type TEXT NOT NULL CHECK (rental_type IN ('room', 'flat', 'apartment', 'house')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC(8,2),
  furnishing_status TEXT,
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  available_from TIMESTAMPTZ,
  deposit_amount NUMERIC(10,2),
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  agency_id VARCHAR REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_rental_listings_rental_type ON rental_listings(rental_type);
CREATE INDEX IF NOT EXISTS idx_rental_listings_city ON rental_listings(city);
CREATE INDEX IF NOT EXISTS idx_rental_listings_is_active ON rental_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_rental_listings_is_featured ON rental_listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_rental_listings_created_at ON rental_listings(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_rental_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_rental_listings_updated_at
BEFORE UPDATE ON rental_listings
FOR EACH ROW
EXECUTE FUNCTION update_rental_listings_updated_at();



CREATE TABLE IF NOT EXISTS heavy_equipment (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'lease')),
  equipment_type TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  price_type TEXT DEFAULT 'total' CHECK (price_type IN ('hourly', 'daily', 'monthly', 'total')),
  condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
  hours_used INTEGER,
  serial_number TEXT,
  specifications JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  maintenance_history TEXT,
  warranty_info TEXT,
  is_negotiable BOOLEAN DEFAULT false,
  country TEXT NOT NULL DEFAULT 'India',
  state_province TEXT,
  city TEXT,
  area_name TEXT,
  full_address TEXT,
  location_id VARCHAR REFERENCES locations(id) ON DELETE SET NULL,
  seller_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_listing_type ON heavy_equipment(listing_type);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_equipment_type ON heavy_equipment(equipment_type);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_category ON heavy_equipment(category);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_city ON heavy_equipment(city);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_is_active ON heavy_equipment(is_active);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_is_featured ON heavy_equipment(is_featured);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_created_at ON heavy_equipment(created_at DESC);

-- ==========================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ==========================================================
CREATE OR REPLACE FUNCTION update_heavy_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Trigger: Automatically updates updated_at before update
-- ==========================================================
CREATE OR REPLACE TRIGGER trigger_update_heavy_equipment_updated_at
BEFORE UPDATE ON heavy_equipment
FOR EACH ROW
EXECUTE FUNCTION update_heavy_equipment_updated_at();