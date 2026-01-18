import { FastifyInstance } from "fastify";
import { ensureAuthenticated } from "../middleware/auth";
import {
  createAuction,
  listAuctions,
  searchAuctions,
  getAuction,
  updateAuction,
  deleteAuction,
  publishAuction,
  closeAuction,
  assignItemToAuction,
  bulkAssignItemsToAuction,
  unassignItemFromAuction,
  renderAuctionsPage,
  renderAuctionDetail,
} from "../controllers/auctionController";

export default async (app: FastifyInstance) => {
  // Protected API endpoints
  app.post("/api/auctions", { preHandler: ensureAuthenticated }, createAuction);
  app.get("/api/auctions", { preHandler: ensureAuthenticated }, listAuctions);
  app.get(
    "/api/auctions/search",
    { preHandler: ensureAuthenticated },
    searchAuctions
  );

  // Item assignment endpoints (must come BEFORE generic :id route)
  app.put(
    "/api/auctions/:auctionId/items/:itemId",
    { preHandler: ensureAuthenticated },
    assignItemToAuction
  );
  app.post(
    "/api/auctions/:auctionId/items/bulk-assign",
    { preHandler: ensureAuthenticated },
    bulkAssignItemsToAuction
  );
  app.delete(
    "/api/auctions/:auctionId/items/:itemId",
    { preHandler: ensureAuthenticated },
    unassignItemFromAuction
  );

  // Generic auction routes (comes AFTER specific routes)
  app.get("/api/auctions/:id", { preHandler: ensureAuthenticated }, getAuction);
  app.put(
    "/api/auctions/:id",
    { preHandler: ensureAuthenticated },
    updateAuction
  );
  app.delete(
    "/api/auctions/:id",
    { preHandler: ensureAuthenticated },
    deleteAuction
  );
  app.post(
    "/api/auctions/:id/publish",
    { preHandler: ensureAuthenticated },
    publishAuction
  );
  app.post(
    "/api/auctions/:id/close",
    { preHandler: ensureAuthenticated },
    closeAuction
  );

  // Protected View endpoints (admin pages)
  app.get(
    "/admin/auctions",
    { preHandler: ensureAuthenticated },
    renderAuctionsPage
  );
  app.get(
    "/admin/auctions/:id",
    { preHandler: ensureAuthenticated },
    renderAuctionDetail
  );
};
