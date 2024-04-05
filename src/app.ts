import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import searchRoute from "./routes/search.route";
import uploadRoute from "./routes/upload.route";
import rateLimit from "express-rate-limit";

const app: Application = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: function (req: Request, res: Response /*, next */) {
    res.status(this.statusCode as number).json({
      message: "Too many requests, please try again later.",
    });
  },
});

// Assign rate limiter to all requests
app.use(apiLimiter);

// Middleware
app.use(express.json()); // Parse application/json
app.use(express.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(cors(config.cors)); // Enable CORS requests

// API Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Server is Healthy!");
});
app.use("/search", searchRoute);
app.use("/upload", uploadRoute);

export default app;
