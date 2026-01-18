import { FastifyRequest, FastifyReply } from "fastify";
import { SellerLead } from "../models/SellersLead";
import { Items } from "../models/Items";
import { handleSuccess, handleError } from "./baseController";

// Helper: Check if lead is editable
const isLeadEditable = (status: string): boolean => {
  return status === "draft";
};

// CREATE - Add a new sellerLead
export const createLead = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { name, email, phone, companyName, itemDetails } = request.body as {
      name: string;
      email: string;
      phone: string;
      companyName: string;
      itemDetails: string;
    };

    // Validation
    if (!name || !email || !phone || !companyName || !itemDetails) {
      return handleError(reply, new Error("All fields are required"), 400);
    }

    const newLead = new SellerLead({
      name,
      email,
      phone,
      companyName,
      itemDetails,
      status: "draft", // Always create with draft status
    });

    await newLead.save();
    return handleSuccess(reply, newLead, 201);
  } catch (error) {
    return handleError(reply, error);
  }
};

// READ - Get all seller leads
export const listLead = async (
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

    const leads = await SellerLead.find(query).sort({ createdAt: -1 });
    return handleSuccess(reply, leads);
  } catch (error) {
    return handleError(reply, error);
  }
};

// SEARCH - Search seller leads by email
export const searchLeads = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email } = request.query as { email?: string };

    if (!email) {
      return handleError(
        reply,
        new Error("Email search parameter required"),
        400
      );
    }

    const leads = await SellerLead.find({
      email: { $regex: email, $options: "i" },
    }).sort({ createdAt: -1 });

    return handleSuccess(reply, leads);
  } catch (error) {
    return handleError(reply, error);
  }
};

// READ - Get single seller lead
export const getLead = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Lead ID is required"), 400);
    }
    const lead = await SellerLead.findById(id);
    if (!lead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }
    return handleSuccess(reply, lead);
  } catch (error) {
    return handleError(reply, error);
  }
};

// PATCH - Partial update of a seller lead
export const updateLead = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const { name, email, phone, companyName, itemDetails, status } =
      request.body as {
        name?: string;
        email?: string;
        phone?: string;
        companyName?: string;
        itemDetails?: string;
        status?: string;
      };

    if (!id) {
      return handleError(reply, new Error("Lead ID is required"), 400);
    }

    // Check if lead exists
    const lead = await SellerLead.findById(id);
    if (!lead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }

    // If only updating status (admin action), allow it regardless of current status
    if (
      status !== undefined &&
      !name &&
      !email &&
      !phone &&
      !companyName &&
      !itemDetails
    ) {
      // Admin-only status update - no validation needed
      const updatedLead = await SellerLead.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      // If status is being set to 'locked', automatically link all unlinked items to this lead
      if (status === "locked" && updatedLead) {
        // Find all items that don't have a sellerLeadId assigned yet
        const unlinkedItems = await Items.find({
          sellerLeadId: { $exists: false },
        });
        if (unlinkedItems.length > 0) {
          await Items.updateMany(
            { _id: { $in: unlinkedItems.map((item) => item._id) } },
            { sellerLeadId: id }
          );
          console.log(`Linked ${unlinkedItems.length} items to lead ${id}`);
        }
      }

      return handleSuccess(reply, updatedLead);
    }

    // For content updates, validate: can only edit draft leads
    if (!isLeadEditable(lead.status)) {
      return handleError(
        reply,
        new Error(`This lead is ${lead.status} and cannot be edited`),
        403
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (itemDetails !== undefined) updateData.itemDetails = itemDetails;
    if (status !== undefined) updateData.status = status;

    const updatedLead = await SellerLead.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Returns updated document
    );

    if (!updatedLead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }

    return handleSuccess(reply, updatedLead);
  } catch (error) {
    return handleError(reply, error);
  }
};

// PUT - Full replacement of a seller lead (all fields required)
export const updateLeadFull = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const { name, email, phone, companyName, itemDetails } = request.body as {
      name: string;
      email: string;
      phone: string;
      companyName: string;
      itemDetails: string;
    };

    if (!id) {
      return handleError(reply, new Error("Lead ID is required"), 400);
    }

    // Validation: all fields required for PUT
    if (!name || !email || !phone || !companyName || !itemDetails) {
      return handleError(
        reply,
        new Error(
          "All fields (name, email, phone, companyName, itemDetails) are required for PUT"
        ),
        400
      );
    }

    // Check if lead exists and is editable
    const lead = await SellerLead.findById(id);
    if (!lead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }

    // Validate: can only edit draft leads
    if (!isLeadEditable(lead.status)) {
      return handleError(
        reply,
        new Error(`This lead is ${lead.status} and cannot be edited`),
        403
      );
    }

    const updatedLead = await SellerLead.findByIdAndUpdate(
      id,
      { name, email, phone, companyName, itemDetails },
      { new: true }
    );

    if (!updatedLead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }

    return handleSuccess(reply, updatedLead);
  } catch (error) {
    return handleError(reply, error);
  }
};

// DELETE - Delete a seller lead
export const DeleteLead = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Lead ID is required"), 400);
    }

    const deleteLead = await SellerLead.findByIdAndDelete(id);
    if (!deleteLead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }
    return handleSuccess(reply, deleteLead);
  } catch (error) {
    return handleError(reply, error);
  }
};

// VIEW - Render seller leads list page
export const renderLeadsPage = async (
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

    const leads = await SellerLead.find(query).sort({ createdAt: -1 });
    return reply.view("admin/leads.ejs", {
      title: "Seller Leads",
      leads,
      admin: request.admin,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// VIEW - Render single lead detail page
export const renderLeadDetail = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return handleError(reply, new Error("Lead ID is required"), 400);
    }

    const lead = await SellerLead.findById(id);
    if (!lead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }

    return reply.view("admin/lead-detail.ejs", {
      title: "Lead Details",
      lead,
      admin: request.admin,
    });
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET ITEMS FROM LEAD - Get all items created from a seller lead
export const getLeadItems = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { leadId } = request.params as { leadId: string };

    if (!leadId) {
      return handleError(reply, new Error("Lead ID is required"), 400);
    }

    // Verify lead exists
    const lead = await SellerLead.findById(leadId);
    if (!lead) {
      return handleError(reply, new Error("Lead not found"), 404);
    }

    // Get all items linked to this lead
    const items = await Items.find({ sellerLeadId: leadId }).sort({
      createdAt: -1,
    });

    return handleSuccess(reply, items);
  } catch (error) {
    return handleError(reply, error);
  }
};
