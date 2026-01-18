import { ObjectId } from "mongodb";
// User (Admin)
export interface IAdmin {
  email: string;
  password: string; // hashed
  createdAt?: Date;
}

// Seller Lead (form submission)
export interface ISellerLead {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  itemDetails: string;
  status: string;
  createdAt?: Date;
}

// Item (Lot)
export interface IItem {
  title: string;
  description: string;
  estimateMin: number;
  estimateMax: number;
  category: string;
  artist?: string; // creator of the piece
  periodDate?: string; // date/period of production (e.g., "2006", "18th Century")
  dimensions?: string; // physical dimensions (e.g., "1.5m x 1.5m")
  condition?: string; // condition/framing info
  auctionSession?: "morning" | "afternoon" | "evening"; // which session in the auction
  lotRefNumber?: string; // auto-generated unique lot reference (e.g., 35784798)
  lotNumber?: number; // sequential lot number within auction (e.g., 92)
  auctionId?: string; // assigned to which auction
  sellerLeadId?: string; // from which seller lead
  status: "draft" | "published"; // draft or published
  auctionType?: "online" | "physical"; // automatically set based on estimateMax < 20000
  createdAt?: Date;
  updatedAt?: Date;
}

// Auction
export interface IAuction {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string; // auction location (e.g., "London", "New York")
  status: "draft" | "published" | "closed";
  qrCode?: string; // unique QR code for private access
  auctionType?: "online" | "physical"; // type of auction
  createdAt?: Date;
  updatedAt?: Date;
}

// For API responses, if you need to expose ID as string
export interface IAdminResponse extends IAdmin {
  _id: string;
}

export interface ISellerLeadResponse extends ISellerLead {
  _id: string;
}

export interface IItemResponse extends IItem {
  _id: string;
}

export interface IAuctionResponse extends IAuction {
  _id: string;
}
