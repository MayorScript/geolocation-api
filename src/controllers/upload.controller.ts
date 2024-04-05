import { Request, Response } from "express";
import UploadService from "../services/upload.service";
import logger from "../lib/logger";

const uploadService = new UploadService();

/**
 * Upload CSV data.
 * @param req {Request} The Express request object.
 * @param res {Response} The Express response object.
 */
const uploadCSVFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const response = await uploadService.uploadCSV(req, res);
    if (response) res.json(response);
  } catch (error: any) {
    logger.error(`An error occurred: ${error.message}`);
  }
};

export { uploadCSVFile };
