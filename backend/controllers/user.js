const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
// const momgoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const { response } = require("express");
const JWT_SECRET  = "edarfesarfaerwr";
exports.register = async (req, res) => {
    try {
        const { username  , email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hasshedPassword = await bcrypt.hash(password, 10);
        const payload = {
            ...req.body,
            // role: "user",
            password: hasshedPassword,
        };
        const userData = new User(payload);
        await userData.save();

        res.status(201).json(userData); // Send the saved user data in the response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const tokenData = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "1h" });

        // Set cookie options
        const tokenOptions = {
            httpOnly: true, // Secure from client-side JS access
            // Credential : true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        };

        // Set the cookie
        res.cookie("token", token, tokenOptions);

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



