const Blog = require("../model/Blog");


// Create Blog
const createBlog = async (req, res) => {
    try {
        const {
            title,
            category,
            image,
            content,
            tags,
            status
        } = req.body;

        const blog = await Blog.create({
            title,
            category,
            image,
            content,
            tags,
            status: status || "published",
            author: req.user.id
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        res.status(500).json({
            message: "Blog creation failed",
            error: error.message
        });
    }
};


// Get All Blogs
const getBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch blogs",
            error: error.message
        });

    }
};


// Get Single Blog
const getBlogById = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id)
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json(blog);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch blog",
            error: error.message
        });

    }
};


// Update Blog
const updateBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own blog"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {

        res.status(500).json({
            message: "Blog update failed",
            error: error.message
        });

    }
};


// Delete Blog
const deleteBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own blog"
            });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.json({
            message: "Blog deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Blog deletion failed",
            error: error.message
        });

    }
};


module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};