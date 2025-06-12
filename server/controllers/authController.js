import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (request, response) => {
	const { name, email, password } = request.body;
	if (!name || !email || !password)
		return response
			.status(500)
			.json({ success: false, message: "Missing Details" });
	try {
		const existingUser = await UserModel.findOne({ email });
		if (existingUser)
			return response.json({ success: false, message: "User already exists." });
		const hashPassword = await bcrypt.hash(password, 10);
		const newUser = new UserModel({ name, email, password: hashPassword });
		await newUser.save();

		// Generate web token
		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Added token in cookie
		response.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			samSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({
			success: true,
			message: "User successfully created",
		});
	} catch (error) {
		response.status(500).json({ success: false, message: error.message });
	}
};

export const login = async (request, response) => {
	const { email, password } = request.body;

	if (!email || !password)
		return response.json({
			success: false,
			message: "Email and Password are required",
		});
	try {
		const user = await UserModel.findOne({ email });
		if (!user)
			return response.json({ success: false, message: "Invalid Email" });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return response.json({ sucess: false, message: "Invalid Password" });

		// Generate web token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Added token in cookie
		response.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			samSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({
			success: true,
			message: "User successfully logged in",
		});
	} catch (error) {
		return response.json({ success: false, message: error.message });
	}
};

export const logout = async (request, response) => {
	try {
		response.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			samSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		});
		return response.json({
			success: true,
			message: "User successfully logged out",
		});
	} catch (error) {
		return response.json({ success: false, message: error.message });
	}
};
