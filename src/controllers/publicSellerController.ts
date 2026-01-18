import { FastifyRequest, FastifyReply } from "fastify";
import { SellerLead } from "../models/SellersLead";
import { Auction } from "../models/Auction";
import { Items } from "../models/Items";
import { handleSuccess, handleError } from "./baseController";

// GET / - Home page with all published items and auctions
export const getHome = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Fetch all published items
    const publishedItems = await Items.find({ status: "published" }).sort({
      createdAt: -1,
    });

    // Fetch all published auctions
    const publishedAuctions = await Auction.find({ status: "published" }).sort({
      createdAt: -1,
    });

    // Build auction map for quick lookup
    const auctionMap: any = {};
    publishedAuctions.forEach((auction) => {
      auctionMap[auction._id.toString()] = auction;
    });

    // Enrich items with auction info
    const enrichedItems = publishedItems.map((item) => {
      const auction = item.auctionId
        ? auctionMap[item.auctionId.toString()]
        : null;
      const now = new Date();
      const auctionStatus = auction
        ? auction.status === "closed"
          ? "closed"
          : now >= new Date(auction.endDate)
          ? "ended"
          : "active"
        : null;

      return {
        ...item.toObject(),
        auction,
        auctionStatus,
      };
    });

    // Filter items: only show those with published auctions OR standalone items
    // Remove items whose assigned auction is no longer published
    const validItems = enrichedItems.filter((item) => {
      if (item.auctionId && !item.auction) {
        // Item has an auction assigned but auction is deleted/unpublished - skip
        return false;
      }
      return true;
    });

    // Separate items by auction type (public vs private)
    const publicItems = validItems.filter((item) => item.auction);
    const privateItems = validItems.filter((item) => !item.auction);

    return reply.view("public/home.ejs", {
      title: "Fotherbys - Premier Auction House",
      publishedItems: validItems,
      publicItems,
      privateItems,
      publishedAuctions,
      itemCount: validItems.length,
      auctionCount: publishedAuctions.length,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// POST /api/public/submit-items - Seller submits their items
export const submitSellerItems = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    console.log("Request body:", request.body);
    console.log("Request content-type:", request.headers["content-type"]);

    const body = request.body as any;
    const { name, email, phone, companyName, itemDetails } = body || {};

    console.log("Extracted data:", {
      name,
      email,
      phone,
      companyName,
      itemDetails,
    });

    // Validation
    if (!name || !email || !phone || !itemDetails) {
      console.log("Validation failed - missing fields");
      return handleError(
        reply,
        new Error("Name, email, phone, and item details are required"),
        400
      );
    }

    // Check if seller already submitted (prevent duplicates)
    const existingLead = await SellerLead.findOne({ email });
    if (existingLead && existingLead.status !== "locked") {
      return handleError(
        reply,
        new Error(
          "You have already submitted items. Use the tracking link in your email to manage your submission."
        ),
        400
      );
    }

    // Create new seller lead
    const newLead = new SellerLead({
      name,
      email,
      phone,
      companyName: companyName || "Private Seller",
      itemDetails,
      status: "draft",
    });

    await newLead.save();

    return handleSuccess(
      reply,
      {
        message: "Items submitted successfully!",
        leadId: newLead._id,
        email: newLead.email,
      },
      201
    );
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET /seller/my-items - Seller views their submitted items
export const getSellerDashboard = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email } = request.query as { email?: string };

    if (!email) {
      return reply.code(400).view("public/seller-login.ejs", {
        title: "Track Your Items",
        error: "Please provide your email address",
      });
    }

    const leads = await SellerLead.find({ email }).sort({ createdAt: -1 });

    if (!leads || leads.length === 0) {
      return reply.code(404).view("public/seller-login.ejs", {
        title: "Track Your Items",
        error: "No submission found with this email address",
      });
    }

    return reply.view("public/seller-dashboard.ejs", {
      title: "Your Auction Items",
      leads,
      email,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET /seller/login - Seller login page
export const getSellerLogin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("public/seller-login.ejs", {
    title: "Track Your Items",
    error: null,
  });
};

// POST /api/public/seller/login - Email-based login
export const sellerLogin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email } = request.body as { email: string };

    if (!email) {
      return handleError(reply, new Error("Email is required"), 400);
    }

    const lead = await SellerLead.findOne({ email });

    if (!lead) {
      // For security, don't reveal if email exists or not
      return handleSuccess(reply, {
        message: "If an email is registered, a link will be sent.",
      });
    }

    // In production, send email with login link
    // For now, just return success with redirect info
    return handleSuccess(reply, {
      message: "Check your email for your tracking link",
      redirectTo: `/seller/my-items?email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// PUT /api/public/seller/:email - Seller updates their submission (draft only)
export const updateSellerSubmission = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email } = request.params as { email: string };
    const { name, phone, companyName, itemDetails } = request.body as {
      name?: string;
      phone?: string;
      companyName?: string;
      itemDetails?: string;
    };

    const lead = await SellerLead.findOne({ email });

    if (!lead) {
      return handleError(reply, new Error("Submission not found"), 404);
    }

    // Only allow editing if in draft status
    if (lead.status !== "draft") {
      return handleError(
        reply,
        new Error("You can only edit submissions in draft status"),
        400
      );
    }

    // Update allowed fields
    if (name) lead.name = name;
    if (phone) lead.phone = phone;
    if (companyName) lead.companyName = companyName;
    if (itemDetails) lead.itemDetails = itemDetails;

    await lead.save();

    return handleSuccess(reply, {
      message: "Submission updated successfully",
      lead,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// PUT /api/public/seller/:email/submit - Seller submits for verification (draft -> submitted)
export const submitForVerification = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email } = request.params as { email: string };

    const lead = await SellerLead.findOne({ email });

    if (!lead) {
      return handleError(reply, new Error("Submission not found"), 404);
    }

    if (lead.status !== "draft") {
      return handleError(
        reply,
        new Error("This submission has already been submitted"),
        400
      );
    }

    lead.status = "submitted";
    await lead.save();

    return handleSuccess(reply, {
      message: "Your submission has been sent for verification",
      lead,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// POST /api/public/verify-qr - Verify QR code and return auction redirect
export const verifyQRCode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { qrCode } = request.body as { qrCode: string };

    if (!qrCode || qrCode.trim() === "") {
      return handleError(reply, new Error("QR code is required"), 400);
    }

    // Find auction by QR code
    const auction = await Auction.findOne({ qrCode: qrCode.trim() });
    if (!auction) {
      return handleError(
        reply,
        new Error("Invalid QR code. Auction not found."),
        404
      );
    }

    // Return redirect URL
    return handleSuccess(reply, {
      message: "QR code verified",
      redirectTo: `/qr/${auction.qrCode}`,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET /qr/:code - Access auction by QR code
export const getAuctionByQR = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { code } = request.params as { code: string };

    // Find auction by QR code
    const auction = await Auction.findOne({ qrCode: code });
    if (!auction) {
      return reply.view("public/qr-not-found.ejs", {
        title: "Auction Not Found",
      });
    }

    // Get items in this auction
    const items = await Items.find({ auctionId: auction._id.toString() }).sort({
      createdAt: -1,
    });

    return reply.view("public/qr-auction.ejs", {
      title: auction.title,
      auction: auction.toObject(),
      items: items.map((item) => item.toObject()),
    });
  } catch (error) {
    return handleError(reply, error);
  }
};
