import mongoose, { Schema, Document } from "mongoose";
import { ISellerLead } from "../types";

interface SellerLeadDocument extends ISellerLead, Document {}

const sellerLeadSchema = new Schema<SellerLeadDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    itemDetails: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "submitted", "locked"],
      default: "draft",
      required: true,
    },
  },
  { timestamps: true }
);

export const SellerLead = mongoose.model<SellerLeadDocument>(
  "SellerLead",
  sellerLeadSchema
);
