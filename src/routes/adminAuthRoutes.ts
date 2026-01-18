import { FastifyInstance } from "fastify";
import {
  createDefaultAdmin,
  postLogin,
  postLogout,
  getLoginPage,
  getDashboard,
  getProfile,
  changePassword,
  getCataloguePreview,
  getQRCodeDisplay,
} from "../controllers/adminController";
import { ensureAuthenticated } from "../middleware/auth";

export default async (app: FastifyInstance) => {
  // GET /admin/login - shows login form
  app.get("/admin/login", getLoginPage);

  // POST /admin/login - handles login submission
  app.post("/admin/login", postLogin);

  // GET /admin/dashboard - shows dashboard page
  app.get(
    "/admin/dashboard",
    { preHandler: ensureAuthenticated },
    getDashboard
  );

  // GET /admin/profile - shows profile page
  app.get("/admin/profile", { preHandler: ensureAuthenticated }, getProfile);

  // POST /admin/profile/change-password - change admin password
  app.post(
    "/admin/profile/change-password",
    { preHandler: ensureAuthenticated },
    changePassword
  );

  // POST /admin/logout - handles logout
  app.post("/admin/logout", postLogout);

  // GET /admin/catalogue-preview - preview published auctions with QR codes
  app.get(
    "/admin/catalogue-preview",
    { preHandler: ensureAuthenticated },
    getCataloguePreview
  );

  // GET /api/admin/qr/:auctionId - get QR code as data URL
  app.get(
    "/api/admin/qr/:auctionId",
    { preHandler: ensureAuthenticated },
    getQRCodeDisplay
  );

  // POST /admin/seed - creates default admin (temporary route)
  app.post("/admin/seed", createDefaultAdmin);
};
