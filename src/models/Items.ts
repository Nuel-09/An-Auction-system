import mongoose, { Schema, Document } from "mongoose";
import { IItem } from "../types";

interface ItemDocument extends IItem, Document {}

const itemSchema = new Schema<ItemDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimateMin: { type: Number, required: true },
    estimateMax: { type: Number, required: true },
    category: { type: String, default: "Uncategorized" },
    artist: { type: String },
    periodDate: { type: String }, // e.g., "2006", "18th Century"
    dimensions: { type: String }, // e.g., "1.5m x 1.5m"
    condition: { type: String }, // condition/framing details
    auctionSession: { type: String, enum: ["morning", "afternoon", "evening"] },
    lotRefNumber: {
      type: String,
      unique: true,
      sparse: true,
      default: function (this: any) {
        // Auto-generate as timestamp-based unique ID
        return `LOT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      },
    },
    lotNumber: { type: Number }, // Sequential per auction, will be set when assigning to auction
    auctionId: { type: String, ref: "Auction" },
    sellerLeadId: { type: String, ref: "SellerLead" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    auctionType: {
      type: String,
      enum: ["online", "physical"],
      default: function (this: any) {
        return this.estimateMax < 20000 ? "online" : "physical";
      },
    },
  },
  { timestamps: true }
);

export const Items = mongoose.model<ItemDocument>("item", itemSchema);
