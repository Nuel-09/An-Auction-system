import { FastifyInstance } from "fastify";
import {
  getCatalogueList,
  getAuctionCatalogue,
  getItemDetail,
} from "../controllers/publicController";

export default async (app: FastifyInstance) => {
  // Public routes - No authentication required

  // GET /catalogue - List all published auctions
  app.get("/catalogue", getCatalogueList);

  // GET /catalogue/:auctionId - View single auction with items
  app.get("/catalogue/:auctionId", getAuctionCatalogue);

  // GET /item/:itemId - View single item detail
  app.get("/item/:itemId", getItemDetail);
};
