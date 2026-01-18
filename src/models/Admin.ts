import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";
import { IAdmin } from "../types";

interface AdminDocument extends IAdmin, Document {
  verifyPassword(plainPassword: string): Promise<boolean>;
}

const adminSchema = new Schema<AdminDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre<AdminDocument>("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw Error;
  }
});

// Method to verify password
adminSchema.methods.verifyPassword = async function (plainPassword: string) {
  return bcryptjs.compare(plainPassword, this.password);
};

export const Admin = mongoose.model<AdminDocument>("Admin", adminSchema);
export { AdminDocument };
