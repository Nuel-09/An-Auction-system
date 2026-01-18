import { FastifyInstance } from "fastify";
import * as publicSellerController from "../controllers/publicSellerController";

export async function registerPublicSellerRoutes(fastify: FastifyInstance) {
  // Home page - public, no auth required
  fastify.get("/", publicSellerController.getHome);

  // Seller form submission
  fastify.post(
    "/api/public/submit-items",
    publicSellerController.submitSellerItems
  );

  // Seller login page
  fastify.get("/seller/login", publicSellerController.getSellerLogin);

  // Seller login (email verification)
  fastify.post("/api/public/seller/login", publicSellerController.sellerLogin);

  // Seller dashboard (protected by email param)
  fastify.get("/seller/my-items", publicSellerController.getSellerDashboard);

  // Update seller submission (draft only)
  fastify.put(
    "/api/public/seller/:email",
    publicSellerController.updateSellerSubmission
  );

  // Submit for verification
  fastify.put(
    "/api/public/seller/:email/submit",
    publicSellerController.submitForVerification
  );

  // QR Code verification endpoint
  fastify.post("/api/public/verify-qr", publicSellerController.verifyQRCode);

  // Access auction by QR code
  fastify.get("/qr/:code", publicSellerController.getAuctionByQR);
}
