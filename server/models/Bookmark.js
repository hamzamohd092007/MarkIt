import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    favicon: { type: String, default: "/defaultFavicon.svg" },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: true },
    visits: { type: Number, default: 0 },
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    userId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Bookmark", bookmarkSchema);
