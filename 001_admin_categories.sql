
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

-- Create indexes for better performance
CREATE INDEX idx_admin_categories_slug ON admin_categories(slug);
CREATE INDEX idx_admin_categories_active ON admin_categories(is_active);
CREATE INDEX idx_admin_subcategories_slug ON admin_subcategories(slug);
CREATE INDEX idx_admin_subcategories_parent ON admin_subcategories(parent_category_id);
CREATE INDEX idx_admin_subcategories_active ON admin_subcategories(is_active);

-- Insert default categories for Nepal property system
INSERT INTO admin_categories (name, slug, description, icon, color, sort_order) VALUES
('Property Management', 'property-management', 'Manage all property related operations', 'building', '#1e40af', 1),
('Location Management', 'location-management', 'Manage cities, areas and locations', 'map-pin', '#059669', 2),
('Agency Management', 'agency-management', 'Manage real estate agencies', 'briefcase', '#dc2626', 3),
('User Management', 'user-management', 'Manage system users and permissions', 'users', '#7c3aed', 4),
('Content Management', 'content-management', 'Manage FAQs, content and settings', 'file-text', '#ea580c', 5),
('Analytics & Reports', 'analytics-reports', 'View analytics and generate reports', 'bar-chart', '#0891b2', 6);

-- Insert subcategories for Property Management
INSERT INTO admin_subcategories (name, slug, description, parent_category_id, sort_order) VALUES
('Residential Properties', 'residential-properties', 'Manage apartments, houses, villas', 
  (SELECT id FROM admin_categories WHERE slug = 'property-management'), 1),
('Commercial Properties', 'commercial-properties', 'Manage offices, shops, warehouses', 
  (SELECT id FROM admin_categories WHERE slug = 'property-management'), 2),
('Property Categories', 'property-categories', 'Manage property type categories', 
  (SELECT id FROM admin_categories WHERE slug = 'property-management'), 3),
('Property Amenities', 'property-amenities', 'Manage available amenities', 
  (SELECT id FROM admin_categories WHERE slug = 'property-management'), 4);

-- Insert subcategories for Location Management
INSERT INTO admin_subcategories (name, slug, description, parent_category_id, sort_order) VALUES
('Cities', 'cities', 'Manage cities across Nepal', 
  (SELECT id FROM admin_categories WHERE slug = 'location-management'), 1),
('Areas & Districts', 'areas-districts', 'Manage specific areas and districts', 
  (SELECT id FROM admin_categories WHERE slug = 'location-management'), 2),
('Popular Locations', 'popular-locations', 'Manage featured locations', 
  (SELECT id FROM admin_categories WHERE slug = 'location-management'), 3);

-- Insert subcategories for Agency Management
INSERT INTO admin_subcategories (name, slug, description, parent_category_id, sort_order) VALUES
('Agency Profiles', 'agency-profiles', 'Manage agency information and profiles', 
  (SELECT id FROM admin_categories WHERE slug = 'agency-management'), 1),
('Agency Verification', 'agency-verification', 'Verify and approve agencies', 
  (SELECT id FROM admin_categories WHERE slug = 'agency-management'), 2),
('Agency Performance', 'agency-performance', 'Monitor agency performance metrics', 
  (SELECT id FROM admin_categories WHERE slug = 'agency-management'), 3);

-- Insert subcategories for User Management
INSERT INTO admin_subcategories (name, slug, description, parent_category_id, sort_order) VALUES
('System Users', 'system-users', 'Manage admin and regular users', 
  (SELECT id FROM admin_categories WHERE slug = 'user-management'), 1),
('User Roles', 'user-roles', 'Manage user permissions and roles', 
  (SELECT id FROM admin_categories WHERE slug = 'user-management'), 2),
('User Activity', 'user-activity', 'Monitor user activity and logs', 
  (SELECT id FROM admin_categories WHERE slug = 'user-management'), 3);

-- Insert subcategories for Content Management
INSERT INTO admin_subcategories (name, slug, description, parent_category_id, sort_order) VALUES
('FAQs', 'faqs', 'Manage frequently asked questions', 
  (SELECT id FROM admin_categories WHERE slug = 'content-management'), 1),
('Site Settings', 'site-settings', 'Manage global site configurations', 
  (SELECT id FROM admin_categories WHERE slug = 'content-management'), 2),
('SEO Management', 'seo-management', 'Manage SEO settings and metadata', 
  (SELECT id FROM admin_categories WHERE slug = 'content-management'), 3);

-- Insert subcategories for Analytics & Reports
INSERT INTO admin_subcategories (name, slug, description, parent_category_id, sort_order) VALUES
('Property Analytics', 'property-analytics', 'View property performance metrics', 
  (SELECT id FROM admin_categories WHERE slug = 'analytics-reports'), 1),
('User Analytics', 'user-analytics', 'View user engagement metrics', 
  (SELECT id FROM admin_categories WHERE slug = 'analytics-reports'), 2),
('Financial Reports', 'financial-reports', 'Generate financial and revenue reports', 
  (SELECT id FROM admin_categories WHERE slug = 'analytics-reports'), 3),
('System Reports', 'system-reports', 'Generate system usage reports', 
  (SELECT id FROM admin_categories WHERE slug = 'analytics-reports'), 4);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_admin_categories_updated_at 
  BEFORE UPDATE ON admin_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_subcategories_updated_at 
  BEFORE UPDATE ON admin_subcategories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
