// app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import LinkRoutes from "./routes/link.route";
import RedirectRoutes from "./routes/redirect.route";
dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      process.env["FRONTEND_URL"] || "https://tinylink.daksh.dev",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", LinkRoutes);
app.use("/", RedirectRoutes);

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
