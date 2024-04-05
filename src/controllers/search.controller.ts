import { Request, Response } from "express";
import GeoSearchService from "../services/search.service";
import logger from "../lib/logger";

/**
 * Fetch search data.
 * @param req {Request} The Express request object.
 * @param res {Response} The Express response object.
 */
const getSearchResults = async (req: Request, res: Response): Promise<any> => {
  try {
    const geoSearchService = new GeoSearchService();
    const suggestions = await geoSearchService.searchByGeo(req.query);

    if (suggestions) res.json({ suggestions });
  } catch (error: any) {
    logger.error(`An error occurred: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

export { getSearchResults };
