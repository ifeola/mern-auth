import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
	const mongoURI = process.env.DATABASE_URI;
	try {
		const comm = await mongoose.connect(mongoURI);
		console.log("Database connected successfully", comm.connection.host);
	} catch (error) {
		console.log("Failed to connect to Database", error.message);
		process.exit(1);
	}
};

export default connectDB;
