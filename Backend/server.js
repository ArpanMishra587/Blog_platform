const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "BlogSphere API is running successfully!"
    });
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server running on port ${process.env.PORT || 5000}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

