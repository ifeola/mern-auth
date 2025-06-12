import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	verifyOtp: {
		type: String,
		default: "",
	},
	verifyOtpExpiredAt: {
		type: Number,
		default: 0,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	resetOtp: {
		type: String,
		default: "",
	},
	resetOtpExpiredAt: {
		type: Number,
		default: 0,
	},
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
