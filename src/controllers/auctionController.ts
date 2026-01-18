import { FastifyRequest, FastifyReply } from "fastify";
import { Auction } from "../models/Auction";
import { Items } from "../models/Items";
import { handleSuccess, handleError } from "./baseController";

// Helper: Check if auction is editable
const isAuctionEditable = (status: string): boolean => {
  return status === "draft";
};

// Helper: Assign sequential lot number to an item in an auction
const assignLotNumber = async (auctionId: string, itemId: string) => {
  try {
    // Find the highest lot number in this auction
    const highestLotItem = await Items.findOne({ auctionId })
      .sort({ lotNumber: -1 })
      .lean();

    const nextLotNumber = (highestLotItem?.lotNumber || 0) + 1;

    // Update the item with the next lot number
    await Items.findByIdAndUpdate(itemId, { lotNumber: nextLotNumber });

    return nextLotNumber;
  } catch (error) {
    console.error("Error assigning lot number:", error);
    throw error;
  }
};

// CREATE - Add a new auction
export const createAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { title, description, startDate, endDate } = request.body as {
      title: string;
      description: string;
      startDate: string | Date;
      endDate: string | Date;
    };

    // Validation
    if (!title || !description || !startDate || !endDate) {
      return handleError(reply, new Error("All fields are required"), 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return handleError(
        reply,
        new Error("End date must be after start date"),
        400
      );
    }

    const newAuction = new Auction({
      title,
      description,
      startDate: start,
      endDate: end,
      status: "draft",
    });

    await newAuction.save();
    return handleSuccess(reply, newAuction, 201);
  } catch (error) {
    return handleError(reply, error);
  }
};

// READ - Get all auctions
export const listAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { fromDate, toDate } = request.query as {
      fromDate?: string;
      toDate?: string;
    };

    const query: any = {};
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        // Parse date as YYYY-MM-DD and set to start of day (00:00:00 UTC)
        const startDate = new Date(fromDate + "T00:00:00Z");
        query.createdAt.$gte = startDate;
      }
      if (toDate) {
        // Parse date as YYYY-MM-DD and set to end of day (23:59:59 UTC)
        const endDate = new Date(toDate + "T23:59:59Z");
        query.createdAt.$lte = endDate;
      }
    }

    const auctions = await Auction.find(query).sort({ createdAt: -1 });
    return handleSuccess(reply, auctions);
  } catch (error) {
    return handleError(reply, error);
  }
};

// SEARCH - Search auctions by title
export const searchAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { title } = request.query as { title?: string };

    if (!title) {
      return handleError(
        reply,
        new Error("Title search parameter required"),
        400
      );
    }

    const auctions = await Auction.find({
      title: { $regex: title, $options: "i" },
    }).sort({ createdAt: -1 });

    return handleSuccess(reply, auctions);
  } catch (error) {
    return handleError(reply, error);
  }
};

// READ - Get single auction
export const getAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    const auction = await Auction.findById(id);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    return handleSuccess(reply, auction);
  } catch (error) {
    return handleError(reply, error);
  }
};

// UPDATE - Update an auction
export const updateAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const { title, description, startDate, endDate } = request.body as {
      title?: string;
      description?: string;
      startDate?: string | Date;
      endDate?: string | Date;
    };

    if (!id) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    // Check if auction exists and is editable
    const auction = await Auction.findById(id);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    // Validate: can only edit draft auctions
    if (!isAuctionEditable(auction.status)) {
      return handleError(
        reply,
        new Error(`This auction is ${auction.status} and cannot be edited`),
        403
      );
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        return handleError(
          reply,
          new Error("End date must be after start date"),
          400
        );
      }
    }

    const updatedAuction = await Auction.findByIdAndUpdate(
      id,
      { title, description, startDate, endDate },
      { new: true }
    );

    return handleSuccess(reply, updatedAuction);
  } catch (error) {
    return handleError(reply, error);
  }
};

// DELETE - Delete an auction
export const deleteAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    const deletedAuction = await Auction.findByIdAndDelete(id);
    if (!deletedAuction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    return handleSuccess(reply, { message: "Auction deleted", deletedAuction });
  } catch (error) {
    return handleError(reply, error);
  }
};

// PUBLISH - Publish an auction (change status from draft to published)
export const publishAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    const auction = await Auction.findById(id);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    if (auction.status === "published") {
      return handleError(reply, new Error("Auction is already published"), 400);
    }

    auction.status = "published";
    await auction.save();

    return handleSuccess(reply, { message: "Auction published", auction });
  } catch (error) {
    return handleError(reply, error);
  }
};

// CLOSE - Close an auction (change status to closed)
export const closeAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    const auction = await Auction.findById(id);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    if (auction.status === "closed") {
      return handleError(reply, new Error("Auction is already closed"), 400);
    }

    auction.status = "closed";
    await auction.save();

    return handleSuccess(reply, { message: "Auction closed", auction });
  } catch (error) {
    return handleError(reply, error);
  }
};

// VIEW - Render auctions list page
export const renderAuctionsPage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { fromDate, toDate } = request.query as {
      fromDate?: string;
      toDate?: string;
    };

    const query: any = {};
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        // Parse date as YYYY-MM-DD and set to start of day (00:00:00 UTC)
        const startDate = new Date(fromDate + "T00:00:00Z");
        query.createdAt.$gte = startDate;
      }
      if (toDate) {
        // Parse date as YYYY-MM-DD and set to end of day (23:59:59 UTC)
        const endDate = new Date(toDate + "T23:59:59Z");
        query.createdAt.$lte = endDate;
      }
    }

    const auctions = await Auction.find(query).sort({ createdAt: -1 });
    return reply.view("admin/auctions.ejs", {
      title: "Auctions",
      auctions,
      admin: request.admin,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// VIEW - Render single auction detail page
export const renderAuctionDetail = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    const auction = await Auction.findById(id);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    // Get items in this auction
    const items = await Items.find({ auctionId: id });

    return reply.view("admin/auction-detail.ejs", {
      title: "Auction Details",
      auction,
      items,
      admin: request.admin,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// ASSIGN - Assign a single item to auction
export const assignItemToAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { auctionId, itemId } = request.params as {
      auctionId: string;
      itemId: string;
    };

    if (!auctionId || !itemId) {
      return handleError(
        reply,
        new Error("Auction ID and Item ID are required"),
        400
      );
    }

    // Verify auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    // Only draft auctions can receive items
    if (auction.status !== "draft") {
      return handleError(
        reply,
        new Error("Only draft auctions can receive items"),
        400
      );
    }

    // Verify item exists
    const item = await Items.findById(itemId);
    if (!item) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    // Assign item to auction
    item.auctionId = auctionId;
    await item.save();

    // Assign lot number to the item
    const lotNumber = await assignLotNumber(auctionId, itemId);

    return handleSuccess(reply, {
      message: "Item assigned to auction",
      item,
      lotNumber,
    });
  } catch (error) {
    console.error("Error in assignItemToAuction:", error);
    return handleError(reply, error);
  }
};

// BULK ASSIGN - Assign multiple items to auction
export const bulkAssignItemsToAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { auctionId } = request.params as { auctionId: string };
    const { itemIds } = request.body as { itemIds: string[] };

    if (!auctionId) {
      return handleError(reply, new Error("Auction ID is required"), 400);
    }

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return handleError(
        reply,
        new Error("itemIds array is required and must contain at least one ID"),
        400
      );
    }

    // Verify auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return handleError(reply, new Error("Auction not found"), 404);
    }

    // Only draft auctions can receive items
    if (auction.status !== "draft") {
      return handleError(
        reply,
        new Error("Only draft auctions can receive items"),
        400
      );
    }

    // Validate and trim all item IDs to ensure exact matches
    const trimmedItemIds = itemIds
      .map((id) => String(id).trim())
      .filter((id) => id.length > 0);

    if (trimmedItemIds.length === 0) {
      return handleError(reply, new Error("No valid item IDs provided"), 400);
    }

    console.log("Searching for items with lotRefNumbers:", trimmedItemIds);

    // Find items by lotRefNumber and update them
    const updateResult = await Items.updateMany(
      { lotRefNumber: { $in: trimmedItemIds } },
      { auctionId }
    );

    if (updateResult.matchedCount === 0) {
      return handleError(
        reply,
        new Error(
          `No items found with the provided lot reference numbers. Looking for: ${trimmedItemIds.join(
            ", "
          )}`
        ),
        404
      );
    }

    // Get the items that were updated to assign lot numbers
    const updatedItems = await Items.find({
      lotRefNumber: { $in: trimmedItemIds },
    });

    // Assign lot numbers to all items sequentially
    for (const item of updatedItems) {
      await assignLotNumber(auctionId, item._id.toString());
    }

    return handleSuccess(reply, {
      message: `${updateResult.modifiedCount} items assigned to auction with lot numbers`,
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// UNASSIGN - Remove item from auction
export const unassignItemFromAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { auctionId, itemId } = request.params as {
      auctionId: string;
      itemId: string;
    };

    if (!auctionId || !itemId) {
      return handleError(
        reply,
        new Error("Auction ID and Item ID are required"),
        400
      );
    }

    const item = await Items.findById(itemId);
    if (!item) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    // Remove assignment and clear lot number
    item.auctionId = undefined;
    item.lotNumber = undefined;
    await item.save();

    return handleSuccess(reply, {
      message: "Item unassigned from auction",
      item,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};
