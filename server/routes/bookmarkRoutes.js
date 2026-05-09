import express from 'express';
import Bookmark from '../models/Bookmark.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const bookmarkRouter = express.Router();

bookmarkRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const bookmarks = await Bookmark.find({ userId });
        res.status(200).json({ success: true, message: "Bookmarks fetched successfully", bookmarks });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

bookmarkRouter.post("/add", auth, upload.single("favicon"), async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { title, url, description, tags } = req.body;
        if (!title || !url || !description || !tags) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const favicon = req.file ? req.file.path : undefined;
        const bookmark = await Bookmark.create({ ...(favicon && { favicon }), title, url, description, tags, userId })
        res.status(201).json({ success: true, message: "Bookmark added successfully", bookmark })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

bookmarkRouter.put('/edit/:id', auth, upload.single("favicon"), async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        const { title, url, description, tags } = req.body;
        let updateData = {};
        if (title) {
            updateData.title = title;
        }
        if (url) {
            updateData.url = url;
        }
        if (description) {
            updateData.description = description;
        }
        if (tags) {
            updateData.tags = tags;
        }
        if (req.file) {
            updateData.favicon = req.file.path;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No data provided to update" });
        }
        const updatedBookmark = await Bookmark.findByIdAndUpdate(
            { _id: id, userId },
            { $set: updateData },
            { returnDocument: "after", runValidators: true }
        )
        if (!updatedBookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        res.status(200).json({ success: true, message: "Bookmark updated successfully", bookmark: updatedBookmark });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

bookmarkRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const bookmark = await Bookmark.findByIdAndDelete(id);
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        res.status(200).json({ success: true, message: "Bookmark deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

bookmarkRouter.put("/pin/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        const bookmark = await Bookmark.findById(id);
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        bookmark.pinned = !bookmark.pinned;
        await bookmark.save();
        res.status(200).json({ success: true, message: "Bookmark pinned successfully", bookmark });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

bookmarkRouter.put("/visit/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        const bookmark = await Bookmark.findById(id);
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        bookmark.visits += 1;
        await bookmark.save();
        res.status(200).json({ success: true, message: "Bookmark visited successfully", bookmark });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

bookmarkRouter.put("/archive/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        const bookmark = await Bookmark.findById(id);
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }
        bookmark.archived = !bookmark.archived;
        await bookmark.save();
        res.status(200).json({ success: true, message: "Bookmark archived successfully", bookmark });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default bookmarkRouter