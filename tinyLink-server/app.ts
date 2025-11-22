// app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());


app.get("/", (_req, res) => {
	try {
		res.status(200).json({
			message: "Welcome to the tinyLink API",
			success: true,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Internal Server Error",
			success: false,
			data: err,
		});
	}
});

export default app;
