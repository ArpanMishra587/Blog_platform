const express = require("express");

const {
    addComment,
    getComments
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Add comment
router.post("/:blogId", protect, addComment);


// Get comments
router.get("/:blogId", getComments);



module.exports = router;