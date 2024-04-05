import express, { Request, Response, NextFunction } from "express";
import multer, { MulterError, FileFilterCallback } from "multer";
import logger from "../lib/logger";

/**
 * File filter function to check the file type
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  // Check if the file is a CSV
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file and provide an error message
    logger.error("Only CSV files are allowed!");
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

export const upload = multer({ dest: "uploads/", fileFilter });
