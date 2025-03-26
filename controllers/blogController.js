const Blog = require('./../models/Blog');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find()
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await Blog.countDocuments();
    
    res.status(200).json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const newBlog = new Blog({
      title,
      content,
      user: userId,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Delete a blog


exports.deleteBlog = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Only admins can delete blogs." });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};




