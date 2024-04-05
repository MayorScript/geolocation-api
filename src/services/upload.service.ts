import { Request, Response } from "express";
import logger from "../lib/logger";
import { processCsvFile } from "../queues/upload.queue";

class UploadService {
  /**
   * Function to upload a CSV file.
   * @param req
   * @param res
   * @returns
   */
  async uploadCSV(req: Request, res: Response): Promise<any> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
      processCsvFile(req.file.path);
      res.json({ message: "File is being processed." });
    } catch (error: any) {
      logger.error("Error while uploading data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default UploadService;
