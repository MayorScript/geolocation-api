import express, { Request, Response, NextFunction } from "express";
import multer, { MulterError, FileFilterCallback } from "multer";
import { uploadCSVFile } from "../controllers/upload.controller";
import logger from "../lib/logger";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post("/", upload.single("file"), uploadCSVFile);

// Multer error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Check if the error is a Multer error
  if (err instanceof MulterError) {
    // Handle Multer errors here
    const message = `Multer error: ${err.message}`;
    logger.error(message);
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // If not a Multer error, continue to the next error handler
  next(err);
});

export default router;
