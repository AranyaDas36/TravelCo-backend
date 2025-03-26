const express = require('express');
const { getAllBlogs, createBlog, deleteBlog } = require('./../controllers/blogController');
const { protect, authMiddleware, adminMiddleware } = require('./../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllBlogs);
router.post('/', authMiddleware, protect, createBlog);
router.delete('/:id', adminMiddleware, protect, deleteBlog);

module.exports = router;
