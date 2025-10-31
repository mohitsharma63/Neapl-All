
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'vehicles');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `vehicle-${uniqueSuffix}${ext}`);
  }
});

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload handler
export const handleImageUpload = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/vehicles/${req.file.filename}`;
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload image' });
  }
};

// Multiple images upload handler
export const handleMultipleImageUpload = (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map((file: Express.Multer.File) => ({
      url: `/uploads/vehicles/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error: any) {
    console.error('Multiple image upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload images' });
  }
};
