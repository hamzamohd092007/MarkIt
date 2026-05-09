import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    avatar: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrzK1R5eFyx2t3yRYdFNEMGkucJnl_txpmoQ&s" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
}, { timestamps: true });

export default mongoose.model("User", userSchema);