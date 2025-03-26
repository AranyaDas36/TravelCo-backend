const express = require('express');
const { 
  getAllPackages, 
  createPackage, 
  updatePackage, 
  deletePackage, 
  getPackageById,
  addGalleryImage,
  removeGalleryImage
} = require('./../controllers/packageController');
const { authMiddleware, adminMiddleware } = require('./../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', getPackageById);
router.get('/', getAllPackages);
router.post('/', authMiddleware, adminMiddleware, createPackage);
router.put('/:id', authMiddleware, adminMiddleware, updatePackage);
router.delete('/:id', authMiddleware, adminMiddleware, deletePackage);

// Update these routes to match the frontend request
router.post('/:id/images', authMiddleware, adminMiddleware, addGalleryImage);
router.delete('/:id/images/:index', authMiddleware, adminMiddleware, removeGalleryImage);

module.exports = router;

