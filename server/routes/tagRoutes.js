import express from 'express';
import Tag from '../models/Tag.js';
import auth from '../middlewares/auth.js';

const tagRouter = express.Router();

tagRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const tags = await Tag.find({ userId });
        res.status(200).json({ success: true, message: "Tags fetched successfully", tags });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

tagRouter.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Tag name cannot be empty" });
        }
        const existing = await Tag.findOne({ name });
        if (existing) {
            return res.status(409).json({ success: false, message: "Tag already exists" });
        }
        const tag = await Tag.create({ name, userId });
        res.status(201).json({ success: true, message: "Tag added successfully", tag });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

tagRouter.put("/check/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Tag not found" });
        }
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ success: false, message: "Tag not found" });
        }
        tag.checked = !tag.checked;
        await tag.save();
        res.status(200).json({ success: true, message: "Tag checked successfully", tag });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

tagRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Tag not found" });
        }
        const tag = await Tag.findByIdAndDelete(id);
        if (!tag) {
            return res.status(404).json({ success: false, message: "Tag not found" });
        }
        res.status(200).json({ success: true, message: "Tag deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default tagRouter