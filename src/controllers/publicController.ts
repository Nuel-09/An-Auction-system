import { FastifyRequest, FastifyReply } from "fastify";
import { Auction } from "../models/Auction";
import { Items } from "../models/Items";
import { handleSuccess, handleError } from "./baseController";

// Helper: Get display status for auction (includes runtime status like "active" and "ended")
const getAuctionDisplayStatus = (auction: any): string => {
  const now = new Date();
  if (auction.status === "draft") {
    return "draft";
  } else if (auction.status === "closed") {
    return "closed";
  } else if (auction.status === "published") {
    return now >= new Date(auction.endDate) ? "ended" : "active";
  }
  return "draft";
};

// GET /catalogue - List all published auctions (no auth required)
export const getCatalogueList = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get all published auctions
    const auctions = await Auction.find({ status: "published" }).sort({
      endDate: 1,
    });

    if (!auctions || auctions.length === 0) {
      return reply.view("public/catalogue.ejs", {
        title: "Auction Catalogue",
        auctions: [],
        activeCount: 0,
        endedCount: 0,
      });
    }

    // Separate active and ended auctions
    const now = new Date();
    const active = auctions.filter((a) => now < new Date(a.endDate));
    const ended = auctions.filter((a) => now >= new Date(a.endDate));

    // Sort: active first, then ended
    const sorted = [...active, ...ended];

    return reply.view("public/catalogue.ejs", {
      title: "Auction Catalogue",
      auctions: sorted,
      activeCount: active.length,
      endedCount: ended.length,
      getDisplayStatus: getAuctionDisplayStatus,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET /catalogue/:auctionId - View single auction with items
export const getAuctionCatalogue = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { auctionId } = request.params as { auctionId: string };

    if (!auctionId) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    const auction = await Auction.findById(auctionId);

    // Only show published auctions
    if (!auction || auction.status === "draft") {
      return reply.code(404).view("public/404.ejs", {
        title: "Auction Not Found",
        message: "This auction is not available at this time.",
      });
    }

    // Get all items in this auction
    const items = await Items.find({ auctionId }).sort({ createdAt: -1 });

    // Determine display status
    const displayStatus = getAuctionDisplayStatus(auction);

    return reply.view("public/auction.ejs", {
      title: `${auction.title} - Auction`,
      auction,
      auctionStatus: displayStatus,
      items,
      itemCount: items.length,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET /item/:itemId - View single item detail
export const getItemDetail = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { itemId } = request.params as { itemId: string };

    if (!itemId) {
      return handleError(reply, new Error("Item ID is required"), 400);
    }

    const item = await Items.findById(itemId);

    if (!item || item.status !== "published") {
      return reply.code(404).view("public/404.ejs", {
        title: "Item Not Found",
        message: "This item could not be found or is no longer available.",
      });
    }

    // Get the auction this item belongs to (if assigned)
    let auction = null;
    let auctionStatusDisplay = null;
    if (item.auctionId) {
      auction = await Auction.findById(item.auctionId);

      // Only show if auction is published
      if (!auction || auction.status === "draft") {
        return reply.code(404).view("public/404.ejs", {
          title: "Item Not Available",
          message: "This item is not available for viewing at this time.",
        });
      }
    }

    return reply.view("public/item.ejs", {
      title: `${item.title} - Item Details`,
      item,
      auction,
      auctionStatus: auction ? getAuctionDisplayStatus(auction) : null,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};
