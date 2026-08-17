const Comment = require("../model/Comment");

// Add Comment
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { blogId } = req.params;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const comment = await Comment.create({
            text: text.trim(),
            user: req.user.id,
            blog: blogId
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("user", "name email");

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        console.error("Add comment error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get Comments
const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        const comments = await Comment.find({
            blog: blogId
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error) {
        console.error("Get comments error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addComment,
    getComments
};