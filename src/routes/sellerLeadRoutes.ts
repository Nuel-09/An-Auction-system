import { FastifyInstance } from "fastify";
import { ensureAuthenticated } from "../middleware/auth";
import {
  createLead,
  listLead,
  searchLeads,
  getLead,
  updateLead,
  updateLeadFull,
  DeleteLead,
  renderLeadsPage,
  renderLeadDetail,
  getLeadItems,
} from "../controllers/sellerLeadController";

export default async (app: FastifyInstance) => {
  // Public API - Create seller lead (form submission)
  app.post("/api/leads", createLead);

  // Protected API endpoints
  app.get("/api/leads", { preHandler: ensureAuthenticated }, listLead);
  app.get(
    "/api/leads/search",
    { preHandler: ensureAuthenticated },
    searchLeads
  );
  app.get("/api/leads/:id", { preHandler: ensureAuthenticated }, getLead);

  // PATCH - Partial update (some fields)
  app.patch("/api/leads/:id", { preHandler: ensureAuthenticated }, updateLead);

  // PUT - Full replacement (all fields required)
  app.put(
    "/api/leads/:id",
    { preHandler: ensureAuthenticated },
    updateLeadFull
  );

  app.delete("/api/leads/:id", { preHandler: ensureAuthenticated }, DeleteLead);

  // GET items from a lead
  app.get(
    "/api/leads/:leadId/items",
    { preHandler: ensureAuthenticated },
    getLeadItems
  );

  // Protected View endpoints (admin pages)
  app.get("/admin/leads", { preHandler: ensureAuthenticated }, renderLeadsPage);
  app.get(
    "/admin/leads/:id",
    { preHandler: ensureAuthenticated },
    renderLeadDetail
  );
};
