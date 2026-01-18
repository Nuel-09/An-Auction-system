import mongoose, { Schema, Document } from "mongoose";
import { IAuction } from "../types";

interface AuctionDocument extends IAuction, Document {}

const auctionSchema = new Schema<AuctionDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String }, // auction location (e.g., "London")
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
    qrCode: { type: String, unique: true, sparse: true },
    auctionType: {
      type: String,
      enum: ["online", "physical"],
      default: "physical",
    },
  },
  { timestamps: true }
);

export const Auction = mongoose.model<AuctionDocument>(
  "Auction",
  auctionSchema
);
