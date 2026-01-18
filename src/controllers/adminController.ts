import { FastifyRequest, FastifyReply } from "fastify";
import { Admin } from "../models/Admin";
import { Auction } from "../models/Auction";
import { Items } from "../models/Items";
import QRCode from "qrcode";
import { handleSuccess, handleError } from "./baseController";

// Add at top of adminController.ts or in a shared types file
declare module "../models/Admin" {
  interface AdminDocument {
    verifyPassword(plainPassword: string): Promise<boolean>;
  }
}

export const createDefaultAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      return handleError(reply, new Error("Admin already exists"), 404);
    }

    const newAdmin = new Admin({
      email: "admin@fotherbys.com",
      password: "admin123", // Remember: this gets hashed by the model's pre-save hook
    });

    await newAdmin.save();

    return handleSuccess(
      reply,
      {
        message: "Default admin created",
        email: newAdmin.email,
        password: "admin123",
      },
      201
    );
  } catch (error) {
    return handleError(reply, error);
  }
};

export const postLogin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return handleError(reply, new Error("Email and password required"));
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return handleError(reply, new Error("Email and password required"));
    }

    const isPasswordValid = await admin.verifyPassword(password);
    if (!isPasswordValid) {
      return handleError(reply, new Error("Invalid credentials"), 401);
    }

    // store admin ID in session
    request.session.adminId = admin._id.toString();
    return handleSuccess(reply, {
      message: "Login successful",
      adminId: admin._id,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

export const postLogout = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await new Promise<void>((resolve, reject) => {
      request.session.destroy((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
    return handleSuccess(reply, { message: "Logged out successfully" });
  } catch (error) {
    return handleError(reply, error);
  }
};

export const getLoginPage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("admin/login.ejs", { title: "Admin Login" });
};

export const getDashboard = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("admin/dashboard.ejs", {
    title: "Admin Dashboard",
    admin: request.admin, // Pass the loaded admin data
  });
};

export const getProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("admin/profile.ejs", {
    title: "Admin Profile",
    admin: request.admin,
  });
};

export const changePassword = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { currentPassword, newPassword } = request.body as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      return handleError(
        reply,
        new Error("Current password and new password are required"),
        400
      );
    }

    if (newPassword.length < 6) {
      return handleError(
        reply,
        new Error("New password must be at least 6 characters"),
        400
      );
    }

    // Get current admin from session
    const admin = await Admin.findById(request.session.adminId);
    if (!admin) {
      return handleError(reply, new Error("Admin not found"), 404);
    }

    // Verify current password
    const isPasswordValid = await admin.verifyPassword(currentPassword);
    if (!isPasswordValid) {
      return handleError(
        reply,
        new Error("Current password is incorrect"),
        401
      );
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return handleSuccess(reply, { message: "Password changed successfully" });
  } catch (error) {
    return handleError(reply, error);
  }
};

export const getCataloguePreview = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get all published auctions with their item counts
    const auctions = await Auction.find({ status: "published" }).sort({
      createdAt: -1,
    });

    // Get item counts for each auction
    const auctionsWithCounts = await Promise.all(
      auctions.map(async (auction) => {
        const itemCount = await Items.countDocuments({
          auctionId: auction._id.toString(),
        });
        return {
          ...auction.toObject(),
          itemCount,
        };
      })
    );

    return reply.view("admin/catalogue-preview.ejs", {
      title: "Catalogue Preview",
      auctions: auctionsWithCounts,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

export const getQRCodeDisplay = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { auctionId } = request.params as { auctionId: string };

    const auction = await Auction.findById(auctionId);
    if (!auction || !auction.qrCode) {
      return handleError(reply, new Error("Auction or QR code not found"), 404);
    }

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(auction.qrCode);

    return handleSuccess(reply, {
      qrCode: auction.qrCode,
      qrCodeImage: qrCodeUrl,
      auctionTitle: auction.title,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};
