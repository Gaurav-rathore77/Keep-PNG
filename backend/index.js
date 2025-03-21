const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const router = require("./routes/user.routes");

// Import User model
const Post = require("./models/post.model");


const app = express();
const port = process.env.PORT || 8000;

// Ensure 'uploads/' directory exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

app.use(cors({
    origin: "http://localhost:5173", // 
    credentials: true,  // ✅ 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadPath));
// app.use("/uploads", express.static(uploadPath));

// Debugging middleware (logs incoming requests)
app.use((req, res, next) => {
    console.log("Incoming Request:", req.headers["content-type"], req.body);
    next();
});


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((error) => console.error("❌ MongoDB connection error:", error));

// Routes
app.get("/", (req, res) => {
    res.send("Hello, API is working!");
});

app.use("/api", router);
// Fetch all posts
app.get("/api/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error("❌ Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new post with file upload
app.post('/api/posts', upload.single('file'), async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const file = req.file ? req.file.filename : null;
        const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required fields' });
        }

        const post = new Post({ title, content, file, tags: tagArray });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// DELETE a post by ID
app.delete("/api/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // If the post contains a file, delete it from the uploads folder
        if (post.file) {
            const filePath = path.join(__dirname, "uploads", post.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete post from database
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
 
// Route to download a file by filename
app.get("/api/download/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath); // Triggers file download
    } else {
        res.status(404).json({ error: "File not found" });
    }
});



app.get('/api/posts/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Search by title OR tags (partial match, case-insensitive)
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: "i" } },  // Match title
                { tags: { $regex: query, $options: "i" } }    // Match tags
            ]
        });

        res.json(posts);
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Backend server is running at http://localhost:${port}`);
});
