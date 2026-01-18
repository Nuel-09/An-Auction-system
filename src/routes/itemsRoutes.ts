import { FastifyInstance } from "fastify";
import { ensureAuthenticated } from "../middleware/auth";
import {
  createItem,
  listItems,
  searchItems,
  getItem,
  updateItem,
  deleteItem,
  publishItem,
  renderItemsPage,
  renderItemDetail,
} from "../controllers/itemController";

export default async (app: FastifyInstance) => {
  // Public API - Create item (admin only in reality, but can be public for now)
  app.post("/api/items", { preHandler: ensureAuthenticated }, createItem);

  // Protected API endpoints
  app.get("/api/items", { preHandler: ensureAuthenticated }, listItems);
  app.get(
    "/api/items/search",
    { preHandler: ensureAuthenticated },
    searchItems
  );
  app.get("/api/items/:id", { preHandler: ensureAuthenticated }, getItem);
  app.put("/api/items/:id", { preHandler: ensureAuthenticated }, updateItem);
  app.delete("/api/items/:id", { preHandler: ensureAuthenticated }, deleteItem);
  app.post(
    "/api/items/:id/publish",
    { preHandler: ensureAuthenticated },
    publishItem
  );

  // Protected View endpoints (admin pages)
  app.get("/admin/items", { preHandler: ensureAuthenticated }, renderItemsPage);
  app.get(
    "/admin/items/:id",
    { preHandler: ensureAuthenticated },
    renderItemDetail
  );
};
