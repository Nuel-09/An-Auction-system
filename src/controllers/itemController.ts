import { FastifyRequest, FastifyReply } from "fastify";
import { Items } from "../models/Items";
import { handleSuccess, handleError } from "./baseController";

// Helper: Check if item is editable
const isItemEditable = (status: string): boolean => {
  return status === "draft";
};

// CREATE - Add a new item
export const createItem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      title,
      description,
      estimateMin,
      estimateMax,
      category,
      sellerLeadId,
    } = request.body as {
      title: string;
      description: string;
      estimateMin: number;
      estimateMax: number;
      category?: string;
      sellerLeadId?: string;
    };

    // Validation
    if (
      !title ||
      !description ||
      estimateMin === undefined ||
      estimateMax === undefined
    ) {
      return handleError(
        reply,
        new Error("Title, description, and estimates are required"),
        400
      );
    }

    const newItem = new Items({
      title,
      description,
      estimateMin,
      estimateMax,
      category: category || "Uncategorized",
      sellerLeadId,
      status: "draft", // Always create with draft status
    });

    await newItem.save();
    return handleSuccess(reply, newItem, 201);
  } catch (error) {
    return handleError(reply, error);
  }
};

// READ - Get all items
export const listItems = async (
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

    const items = await Items.find(query).sort({ createdAt: -1 });
    return handleSuccess(reply, items);
  } catch (error) {
    return handleError(reply, error);
  }
};

// SEARCH - Search items by category
export const searchItems = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { category } = request.query as { category?: string };

    if (!category) {
      return handleError(
        reply,
        new Error("Category search parameter required"),
        400
      );
    }

    const items = await Items.find({
      category: { $regex: category, $options: "i" },
    }).sort({ createdAt: -1 });

    return handleSuccess(reply, items);
  } catch (error) {
    return handleError(reply, error);
  }
};

// READ - Get single item
export const getItem = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Item ID is required"), 400);
    }

    const item = await Items.findById(id);
    if (!item) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    return handleSuccess(reply, item);
  } catch (error) {
    return handleError(reply, error);
  }
};

// UPDATE - Update an item
export const updateItem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const { title, description, estimateMin, estimateMax, category } =
      request.body as {
        title?: string;
        description?: string;
        estimateMin?: number;
        estimateMax?: number;
        category?: string;
      };

    if (!id) {
      return handleError(reply, new Error("Item ID is required"), 400);
    }

    // Check if item exists and is editable
    const item = await Items.findById(id);
    if (!item) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    // Validate: can only edit draft items
    if (!isItemEditable(item.status)) {
      return handleError(
        reply,
        new Error(`This item is ${item.status} and cannot be edited`),
        403
      );
    }

    const updatedItem = await Items.findByIdAndUpdate(
      id,
      { title, description, estimateMin, estimateMax, category },
      { new: true }
    );

    return handleSuccess(reply, updatedItem);
  } catch (error) {
    return handleError(reply, error);
  }
};

// DELETE - Delete an item
export const deleteItem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Item ID is required"), 400);
    }

    const deletedItem = await Items.findByIdAndDelete(id);
    if (!deletedItem) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    return handleSuccess(reply, { message: "Item deleted", deletedItem });
  } catch (error) {
    return handleError(reply, error);
  }
};

// PUBLISH - Publish an item (change status from draft to published)
export const publishItem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Item ID is required"), 400);
    }

    const item = await Items.findById(id);
    if (!item) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    if (item.status === "published") {
      return handleError(reply, new Error("Item is already published"), 400);
    }

    item.status = "published";
    await item.save();

    return handleSuccess(reply, { message: "Item published", item });
  } catch (error) {
    return handleError(reply, error);
  }
};

// VIEW - Render items list page
export const renderItemsPage = async (
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

    const items = await Items.find(query).sort({ createdAt: -1 });
    return reply.view("admin/items.ejs", {
      title: "Items",
      items,
      admin: request.admin,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// VIEW - Render single item detail page
export const renderItemDetail = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Item ID is required"), 400);
    }

    const item = await Items.findById(id);
    if (!item) {
      return handleError(reply, new Error("Item not found"), 404);
    }

    return reply.view("admin/item-detail.ejs", {
      title: "Item Details",
      item,
      admin: request.admin,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};
