import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertAgencySchema, insertLocationSchema, insertPropertyCategorySchema, insertFaqSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        locationId: req.query.locationId as string,
        categoryId: req.query.categoryId as string,
        agencyId: req.query.agencyId as string,
        propertyType: req.query.propertyType as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
        bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
        furnishingStatus: req.query.furnishingStatus as string,
        isFeatured: req.query.isFeatured === "true" ? true : undefined,
        search: req.query.search as string,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const properties = await storage.getFeaturedProperties(limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const data = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(data);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Agencies
  app.get("/api/agencies", async (req, reply) => {
    const agencies = await storage.getAgencies();
    return agencies;
  });

  // Get schools
  app.get("/api/schools", async (req, reply) => {
    // Mock data for now - replace with real database query when schools table is added
    const schools = [
      {
        id: "1",
        name: "Kathmandu Model High School",
        type: "Private",
        level: "Secondary",
        address: "Bagbazar, Kathmandu",
        phone: "+977-1-4567890",
        email: "info@kmhs.edu.np",
        website: "www.kmhs.edu.np",
        established: "1985",
        students: 1200,
        rating: 4.8,
        description: "A premier educational institution providing quality education since 1985.",
        facilities: ["Library", "Computer Lab", "Sports Ground", "Science Lab"]
      },
      {
        id: "2",
        name: "Budhanilkantha School",
        type: "Public",
        level: "Secondary",
        address: "Budhanilkantha, Kathmandu",
        phone: "+977-1-4567891",
        email: "admin@bns.edu.np",
        established: "1972",
        students: 2000,
        rating: 4.6,
        description: "One of Nepal's most prestigious schools with excellent academic record.",
        facilities: ["Hostel", "Swimming Pool", "Library", "Labs", "Sports Complex"]
      },
      {
        id: "3",
        name: "St. Mary's High School",
        type: "Private",
        level: "Secondary",
        address: "Jawalakhel, Lalitpur",
        phone: "+977-1-4567892",
        email: "contact@stmarys.edu.np",
        established: "1990",
        students: 800,
        rating: 4.7,
        description: "English medium school focused on holistic development of students.",
        facilities: ["Chapel", "Art Room", "Music Room", "Computer Lab"]
      },
      {
        id: "4",
        name: "Sunshine Secondary School",
        type: "Private",
        level: "Secondary",
        address: "Thamel, Kathmandu",
        phone: "+977-1-4567893",
        email: "info@sunshine.edu.np",
        established: "1995",
        students: 600,
        rating: 4.5,
        description: "Modern educational institution with focus on technology integration.",
        facilities: ["Smart Classrooms", "Computer Lab", "Science Lab", "Library"]
      },
      {
        id: "5",
        name: "Himalayan International School",
        type: "Private",
        level: "Secondary",
        address: "Dhulikhel, Kavre",
        phone: "+977-1-4567894",
        email: "admissions@his.edu.np",
        established: "2000",
        students: 900,
        rating: 4.9,
        description: "International curriculum school with world-class facilities.",
        facilities: ["Boarding", "International Curriculum", "Sports Complex", "Arts Center"]
      }
    ];
    return schools;
  });

  app.get("/api/agencies/:id", async (req, res) => {
    try {
      const agency = await storage.getAgency(req.params.id);
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      res.json(agency);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agency" });
    }
  });

  app.post("/api/agencies", async (req, res) => {
    try {
      const data = insertAgencySchema.parse(req.body);
      const agency = await storage.createAgency(data);
      res.status(201).json(agency);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agency data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create agency" });
    }
  });

  // Locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const data = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(data);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  // Property Categories
  app.get("/api/property-categories", async (req, res) => {
    try {
      const categories = await storage.getPropertyCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property categories" });
    }
  });

  app.get("/api/property-categories/:id", async (req, res) => {
    try {
      const category = await storage.getPropertyCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Property category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property category" });
    }
  });

  app.post("/api/property-categories", async (req, res) => {
    try {
      const data = insertPropertyCategorySchema.parse(req.body);
      const category = await storage.createPropertyCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property category" });
    }
  });

  // FAQs
  app.get("/api/faqs", async (req, res) => {
    try {
      const category = req.query.category as string;
      const faqs = await storage.getFaqs(category);
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.get("/api/faqs/:id", async (req, res) => {
    try {
      const faq = await storage.getFaq(req.params.id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const data = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(data);
      res.status(201).json(faq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid FAQ data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create FAQ" });
    }
  });

  // Statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // In a real app, you would integrate with a newsletter service like Mailchimp
      // For now, just return success
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}