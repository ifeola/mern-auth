import express from "express";
import cors from "cors";
import dotev from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import authRouter from "./routes/authRoutes.js";

dotev.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API Endpoints
app.get("/", (request, response) => {
	response.send("API working");
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
	connectDB();
	console.log(`Server started on http://localhost:${PORT}`);
});
