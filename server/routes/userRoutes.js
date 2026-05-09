import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const userRouter = express.Router();

userRouter.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

userRouter.post('/signup', upload.single("avatar"), async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password too short" });
        }
        const avatar = req.file ? req.file.path : undefined;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, ...(avatar && { avatar }), email, password: hashed });
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(201).json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

userRouter.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(200).json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

userRouter.post('/update', auth, upload.single("avatar"), async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { fullName, email } = req.body;
        let updateData = {};
        if (fullName) {
            updateData.fullName = fullName;
        }
        if (email) {
            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== userId) {
                return res.status(409).json({ success: false, message: "Email already in use" });
            }
            updateData.email = email;
        }
        if (req.file) {
            updateData.avatar = req.file.path;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No data provided to update" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { returnDocument: "after", runValidators: true }
        )
        res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

userRouter.post('/verify-old-password', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { oldPassword } = req.body;
        if (!oldPassword) {
            return res.status(400).json({ success: false, message: "Old password is required" });
        }
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }
        res.status(200).json({ success: true, message: "Password verified" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

userRouter.post('/change-password', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ success: false, message: "New password is required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
        }
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({ success: false, message: "New password must be different from old password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

userRouter.delete('/delete', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default userRouter;