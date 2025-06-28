"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Ticket interface matching what's expected by the TicketDataTable component
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  businessName: string | null;
  contactName: string | null;
  assignee: string | null;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  estimatedTime: number | null;
  tags: string[];
  commentCount: number;
}

/**
 * Helper to get current user's workspace ID
 */
async function getCurrentUserWorkspaceId(): Promise<string> {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { workspaceId: true },
  });

  if (!user?.workspaceId) {
    throw new Error("No workspace found for user");
  }

  return user.workspaceId;
}

/**
 * Helper to get current user ID
 */
async function getCurrentUserId(): Promise<string> {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  return session.user.id;
}

/**
 * Helper to find possible business matches based on email domain and company name
 * Now workspace-aware
 */
async function findPossibleBusinessMatch(
  email: string,
  companyName: string,
  workspaceId: string
) {
  if (!email && !companyName) return null;

  const matches = [];
  let confidence = "low";

  // Try to match by email domain if available
  if (email) {
    const domain = email.split("@")[1];
    if (domain) {
      // Match businesses with the same domain in their email or website
      const emailMatches = await prisma.business.findMany({
        where: {
          OR: [
            { email: { contains: domain } },
            { website: { contains: domain } },
          ],
          workspaceId, // Filter by workspace
        },
        take: 5,
      });

      if (emailMatches.length === 1) {
        // Single match by domain - high confidence
        return {
          confidence: "high",
          businessId: emailMatches[0].id,
          matches: emailMatches,
        };
      } else if (emailMatches.length > 1) {
        matches.push(...emailMatches);
        confidence = "medium";
      }
    }
  }

  // Try to match by company name
  if (companyName) {
    const nameMatches = await prisma.business.findMany({
      where: {
        name: {
          contains: companyName,
          mode: "insensitive",
        },
        workspaceId, // Filter by workspace
      },
      take: 5,
    });

    if (nameMatches.length === 1 && matches.length === 0) {
      // Single match by name only - medium confidence
      return {
        confidence: "medium",
        businessId: nameMatches[0].id,
        matches: nameMatches,
      };
    } else if (nameMatches.length >= 1) {
      // Add any name matches to our results
      for (const match of nameMatches) {
        if (!matches.some((m) => m.id === match.id)) {
          matches.push(match);
        }
      }
    }
  }

  if (matches.length > 0) {
    return {
      confidence,
      businessId: confidence === "medium" ? matches[0].id : null,
      matches,
    };
  }

  return null;
}

/**
 * Get all tickets for the current user's workspace
 */
export async function getTickets(
  options: {
    status?: string;
    businessId?: string;
    assigneeId?: string;
  } = {}
): Promise<Ticket[]> {
  try {
    const { status, businessId, assigneeId } = options;
    const workspaceId = await getCurrentUserWorkspaceId();

    // Get workspace users for populating assignee data
    const workspaceUsers = await prisma.user.findMany({
      where: { workspaceId },
      select: { id: true, name: true, image: true },
    });

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(businessId ? { businessId } : {}),
        ...(assigneeId ? { assigneeId } : {}),
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        business: true,
        contact: true,
        tags: true,
        comments: {
          select: { id: true },
        },
      },
    });

    // Format tickets to match the Ticket interface
    return tickets.map((ticket) => {
      const assigneeUser = ticket.assigneeId
        ? workspaceUsers.find((user) => user.id === ticket.assigneeId)
        : null;

      return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        businessName:
          ticket.business?.name || ticket.submittedCompanyName || null,
        contactName: ticket.contact?.name || ticket.submitterName || null,
        assignee: assigneeUser?.name || null,
        creator: ticket.creatorId || "system",
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        dueDate: ticket.dueDate,
        estimatedTime: ticket.estimatedTime,
        tags: ticket.tags.map((tag) => tag.name),
        commentCount: ticket.comments.length,
      };
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

/**
 * Get tickets assigned to the current user
 */
export async function getUserTickets(
  options: {
    status?: string;
  } = {}
): Promise<Ticket[]> {
  try {
    const { status } = options;
    const userId = await getCurrentUserId();
    const workspaceId = await getCurrentUserWorkspaceId();

    // Get workspace users (needed for assignee name)
    const workspaceUsers = await prisma.user.findMany({
      where: { workspaceId },
      select: { id: true, name: true, image: true },
    });

    const tickets = await prisma.ticket.findMany({
      where: {
        assigneeId: userId,
        ...(status ? { status: status as any } : {}),
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        business: true,
        contact: true,
        tags: true,
        comments: {
          select: { id: true },
        },
      },
    });

    // Format tickets to match the Ticket interface
    return tickets.map((ticket) => {
      const assigneeUser = ticket.assigneeId
        ? workspaceUsers.find((user) => user.id === ticket.assigneeId)
        : null;

      return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        businessName:
          ticket.business?.name || ticket.submittedCompanyName || null,
        contactName: ticket.contact?.name || ticket.submitterName || null,
        assignee: assigneeUser?.name || null,
        creator: ticket.creatorId || "system",
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        dueDate: ticket.dueDate,
        estimatedTime: ticket.estimatedTime,
        tags: ticket.tags.map((tag) => tag.name),
        commentCount: ticket.comments.length,
      };
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return [];
  }
}

/**
 * Get all workspace users for assignee selection
 */
export async function getWorkspaceUsers() {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    return prisma.user.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        workspaceRole: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching workspace users:", error);
    return [];
  }
}

/**
 * Get a single ticket with workspace verification
 */
export async function getTicket(id: string) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Get ticket with workspace verification
    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
      include: {
        business: true,
        contact: true,
        tags: true,
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return null;
    }

    // Get assignee details if ticket is assigned
    if (ticket.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: ticket.assigneeId },
        select: { id: true, name: true, email: true, image: true },
      });

      return {
        ...ticket,
        assignee,
      };
    }

    return ticket;
  } catch (error) {
    console.error(`Error fetching ticket ${id}:`, error);
    return null;
  }
}

/**
 * Create a new ticket in the current workspace
 */
export async function createTicket(data: {
  name?: string;
  email?: string;
  companyName?: string;
  subject: string;
  description: string;
  priority?: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  businessId?: string;
  dueDate?: Date;
  estimatedTime?: number;
}) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();
    const userId = await getCurrentUserId();

    const {
      name,
      email,
      companyName,
      subject,
      description,
      priority = "medium",
      assigneeId,
      businessId: providedBusinessId,
      dueDate,
      estimatedTime,
    } = data;

    // Validate required fields
    if (!subject || !description) {
      throw new Error("Subject and description are required");
    }

    // Verify assignee belongs to the workspace if provided
    if (assigneeId) {
      const assignee = await prisma.user.findFirst({
        where: {
          id: assigneeId,
          workspaceId,
        },
      });

      if (!assignee) {
        throw new Error("Invalid assignee");
      }
    }

    // If businessId is provided, verify it belongs to the workspace
    let businessId = providedBusinessId;
    if (businessId) {
      const business = await prisma.business.findFirst({
        where: {
          id: businessId,
          workspaceId,
        },
      });

      if (!business) {
        businessId = undefined; // Clear invalid businessId
      }
    }

    // Try to find business match within the workspace if not explicitly provided
    if (!businessId && (email || companyName)) {
      const possibleBusinessMatch = await findPossibleBusinessMatch(
        email || "",
        companyName || "",
        workspaceId
      );

      // Add business connection if we have a high confidence match
      if (
        possibleBusinessMatch?.confidence === "high" &&
        possibleBusinessMatch.businessId
      ) {
        businessId = possibleBusinessMatch.businessId;
      }
    }

    // Default ticket data
    const ticketData: any = {
      title: subject,
      description,
      status: assigneeId ? "open" : "unassigned", // Set to open if directly assigned
      priority: priority,
      submitterName: name,
      submitterEmail: email,
      submittedCompanyName: companyName,
      assigneeId: assigneeId || null,
      creatorId: userId,
      workspaceId: workspaceId, // Always set workspaceId
      dueDate: dueDate,
      estimatedTime: estimatedTime,
    };

    // Add business connection if we have a match
    if (businessId) {
      ticketData.businessId = businessId;
      // If we have a business match and no assignee, set the status to open
      if (!assigneeId) {
        ticketData.status = "open";
      }
    }

    // Create ticket within the workspace
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });

    revalidatePath("/tickets");

    return {
      success: true,
      ticketId: ticket.id,
      requiresReview: !businessId, // Requires review if no business match
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Failed to create ticket" };
  }
}

/**
 * Update a ticket with workspace verification
 */
export async function updateTicket(
  id: string,
  data: {
    status?: string;
    priority?: string;
    businessId?: string;
    assigneeId?: string;
    dueDate?: Date | null;
    estimatedTime?: number | null;
    [key: string]: any;
  }
) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Verify ticket exists and belongs to workspace
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    if (!existingTicket) {
      throw new Error("Ticket not found in workspace");
    }

    // Verify business belongs to workspace if updating
    if (data.businessId) {
      const business = await prisma.business.findFirst({
        where: {
          id: data.businessId,
          workspaceId,
        },
      });

      if (!business) {
        throw new Error("Invalid business");
      }
    }

    // Verify assignee belongs to workspace if updating
    if (data.assigneeId) {
      const assignee = await prisma.user.findFirst({
        where: {
          id: data.assigneeId,
          workspaceId,
        },
      });

      if (!assignee) {
        throw new Error("Invalid assignee");
      }
    }

    // Check if we're resolving the ticket
    if (data.status === "resolved" && existingTicket.status !== "resolved") {
      data.resolvedAt = new Date();
    }

    // Update ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: data as any,
      include: {
        business: true,
        tags: true,
      },
    });

    revalidatePath(`/tickets/${id}`);
    revalidatePath("/tickets");

    return {
      success: true,
      ticket: updatedTicket,
    };
  } catch (error) {
    console.error(`Error updating ticket ${id}:`, error);
    return { success: false, error: "Failed to update ticket" };
  }
}

/**
 * Add a comment to a ticket with workspace verification
 */
export async function addComment(
  ticketId: string,
  data: {
    content: string;
    isInternal?: boolean;
  }
) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();
    const userId = await getCurrentUserId();
    const { content, isInternal = false } = data;

    // Validate content
    if (!content) {
      throw new Error("Comment content is required");
    }

    // Verify ticket exists and belongs to workspace
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    if (!ticket) {
      throw new Error("Ticket not found in workspace");
    }

    // Create the comment
    const comment = await prisma.ticketComment.create({
      data: {
        content,
        isInternal,
        authorId: userId,
        ticket: {
          connect: { id: ticketId },
        },
      },
    });

    revalidatePath(`/tickets/${ticketId}`);

    return {
      success: true,
      comment,
    };
  } catch (error) {
    console.error(`Error adding comment to ticket ${ticketId}:`, error);
    return { success: false, error: "Failed to add comment" };
  }
}

/**
 * Delete a ticket with workspace verification
 */
export async function deleteTicket(id: string) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Verify ticket exists and belongs to workspace
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    if (!existingTicket) {
      throw new Error("Ticket not found in workspace");
    }

    // Delete the ticket
    await prisma.ticket.delete({
      where: { id },
    });

    revalidatePath("/tickets");

    return { success: true };
  } catch (error) {
    console.error(`Error deleting ticket ${id}:`, error);
    return { success: false, error: "Failed to delete ticket" };
  }
}

/**
 * Delete multiple tickets with workspace verification
 */
export async function deleteTickets(ids: string[]) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Verify all tickets exist and belong to workspace
    const existingTickets = await prisma.ticket.findMany({
      where: {
        id: { in: ids },
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
      select: { id: true },
    });

    // Get the IDs of existing tickets
    const validTicketIds = existingTickets.map((ticket) => ticket.id);

    // Check if any tickets were not found
    if (validTicketIds.length !== ids.length) {
      const missingTickets = ids.filter((id) => !validTicketIds.includes(id));
      console.warn(`Some tickets were not found: ${missingTickets.join(", ")}`);
    }

    if (validTicketIds.length === 0) {
      return {
        success: false,
        error: "No valid tickets to delete",
      };
    }

    // Delete the tickets that exist and belong to the workspace
    const result = await prisma.ticket.deleteMany({
      where: {
        id: { in: validTicketIds },
      },
    });

    revalidatePath("/tickets");

    return {
      success: true,
      count: result.count,
      deleted: validTicketIds,
    };
  } catch (error) {
    console.error(`Error deleting tickets: ${error}`);
    return {
      success: false,
      error: "Failed to delete tickets",
    };
  }
}

/**
 * Search for businesses within the workspace
 */
export async function searchBusinesses(query: string) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    if (!query || query.length < 2) {
      return [];
    }

    const businesses = await prisma.business.findMany({
      where: {
        workspaceId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        orgNumber: true,
      },
    });

    return businesses;
  } catch (error) {
    console.error("Error searching businesses:", error);
    return [];
  }
}

/**
 * Assign a ticket to a user with workspace verification
 */
export async function assignTicket(ticketId: string, assigneeId: string) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Verify ticket exists and belongs to workspace
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    if (!existingTicket) {
      throw new Error("Ticket not found in workspace");
    }

    // Verify assignee belongs to workspace
    const assignee = await prisma.user.findFirst({
      where: {
        id: assigneeId,
        workspaceId,
      },
    });

    if (!assignee) {
      throw new Error("Invalid assignee");
    }

    // Update ticket status to open if it was unassigned
    const status =
      existingTicket.status === "unassigned" ? "open" : existingTicket.status;

    // Update ticket
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assigneeId,
        status: status as any,
      },
    });

    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");

    return { success: true };
  } catch (error) {
    console.error(`Error assigning ticket ${ticketId}:`, error);
    return { success: false, error: "Failed to assign ticket" };
  }
}

/**
 * Update a ticket's status with workspace verification
 */
export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Verify ticket exists and belongs to workspace
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    if (!existingTicket) {
      throw new Error("Ticket not found in workspace");
    }

    // Prepare update data
    const updateData: any = { status };

    // If resolving or closing, set resolvedAt
    if (status === "resolved" || status === "closed") {
      updateData.resolvedAt = new Date();
    }

    // Update ticket
    await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
    });

    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");

    return { success: true };
  } catch (error) {
    console.error(`Error updating ticket status ${ticketId}:`, error);
    return { success: false, error: "Failed to update ticket status" };
  }
}

/**
 * Add a comment to a ticket
 */
export async function addTicketComment(
  ticketId: string,
  content: string,
  authorId?: string,
  isInternal: boolean = false
) {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();
    const userId = authorId || (await getCurrentUserId());

    // Verify ticket exists and belongs to workspace
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    if (!ticket) {
      throw new Error("Ticket not found in workspace");
    }

    // Create the comment
    await prisma.ticketComment.create({
      data: {
        content,
        isInternal,
        authorId: userId,
        ticketId,
      },
    });

    revalidatePath(`/tickets/${ticketId}`);

    return { success: true };
  } catch (error) {
    console.error(`Error adding comment to ticket ${ticketId}:`, error);
    return { success: false, error: "Failed to add comment" };
  }
}

/**
 * Get the count of open tickets for the current user's workspace
 */
export async function getOpenTicketsCount(): Promise<number> {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    const count = await prisma.ticket.count({
      where: {
        status: "open", // Assuming "open" is the status for open tickets
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get open tickets count:", error);
    return 0;
  }
}

/**
 * Get tickets assigned to the current user
 */
export async function getUserAssignedTickets(): Promise<Ticket[]> {
  try {
    const userId = await getCurrentUserId();
    const workspaceId = await getCurrentUserWorkspaceId();

    // Get workspace users for populating assignee data
    const workspaceUsers = await prisma.user.findMany({
      where: { workspaceId },
      select: { id: true, name: true, image: true },
    });

    const tickets = await prisma.ticket.findMany({
      where: {
        assigneeId: userId,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
      orderBy: { updatedAt: "desc" },
      include: {
        business: true,
        contact: true,
        tags: true,
        comments: {
          select: { id: true },
        },
      },
    });

    // Format tickets to match the Ticket interface
    return tickets.map((ticket) => {
      const assignee = workspaceUsers.find(
        (user) => user.id === ticket.assigneeId
      );

      return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description || "",
        status: ticket.status,
        priority: ticket.priority,
        businessName: ticket.business?.name || null,
        contactName: ticket.contact?.name || null,
        assignee: assignee?.name || null,
        creator: ticket.creatorId || "",
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        dueDate: ticket.dueDate || null,
        estimatedTime: ticket.estimatedTime || null,
        tags: ticket.tags.map((tag) => tag.name),
        commentCount: ticket.comments.length,
      };
    });
  } catch (error) {
    console.error("Failed to get assigned tickets:", error);
    return [];
  }
}

/**
 * Get the count of tickets assigned to the current user
 */
export async function getUserAssignedTicketsCount(): Promise<number> {
  try {
    const userId = await getCurrentUserId();
    const workspaceId = await getCurrentUserWorkspaceId();

    const count = await prisma.ticket.count({
      where: {
        assigneeId: userId,
        OR: [
          { workspaceId },
          {
            business: {
              workspaceId,
            },
          },
        ],
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get assigned tickets count:", error);
    return 0;
  }
}

/**
 * Get ticket distribution statistics by status and priority
 * Returns data formatted for charting
 */
export async function getTicketDistributionStats() {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();

    // Get all tickets for the workspace
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [{ workspaceId }, { business: { workspaceId } }],
      },
      select: {
        status: true,
        priority: true,
      },
    });

    // Get unique statuses and priorities
    const statuses = [...new Set(tickets.map((ticket) => ticket.status))];

    // For each status, count tickets by priority
    const distributionData = statuses.map((status) => {
      const statusTickets = tickets.filter(
        (ticket) => ticket.status === status
      );

      // Count by priority
      const lowCount = statusTickets.filter((t) => t.priority === "low").length;
      const mediumCount = statusTickets.filter(
        (t) => t.priority === "medium"
      ).length;
      const highCount = statusTickets.filter(
        (t) => t.priority === "high"
      ).length;
      const urgentCount = statusTickets.filter(
        (t) => t.priority === "urgent"
      ).length;

      // Return data point for the chart
      return {
        status,
        low: lowCount,
        medium: mediumCount,
        high: highCount,
        urgent: urgentCount,
        total: statusTickets.length,
      };
    });

    return {
      distributionData,
      totalTickets: tickets.length,
      statusCounts: statuses.map((status) => ({
        status,
        count: tickets.filter((t) => t.status === status).length,
      })),
      priorityCounts: [
        {
          priority: "low",
          count: tickets.filter((t) => t.priority === "low").length,
        },
        {
          priority: "medium",
          count: tickets.filter((t) => t.priority === "medium").length,
        },
        {
          priority: "high",
          count: tickets.filter((t) => t.priority === "high").length,
        },
        {
          priority: "urgent",
          count: tickets.filter((t) => t.priority === "urgent").length,
        },
      ],
    };
  } catch (error) {
    console.error("Error getting ticket distribution stats:", error);
    throw error;
  }
}

/**
 * Get support metrics for dashboard
 * Returns key metrics about ticket system health
 */
export async function getSupportMetrics() {
  try {
    const workspaceId = await getCurrentUserWorkspaceId();
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get all tickets for the workspace
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [{ workspaceId }, { business: { workspaceId } }],
      },
      include: {
        comments: {
          select: {
            id: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Calculate upcoming/overdue tickets
    const overdueTickets = tickets.filter(
      (ticket) =>
        ticket.status !== "resolved" &&
        ticket.status !== "closed" &&
        ticket.dueDate &&
        new Date(ticket.dueDate) < now
    );

    const upcomingDueTickets = tickets.filter(
      (ticket) =>
        ticket.status !== "resolved" &&
        ticket.status !== "closed" &&
        ticket.dueDate &&
        new Date(ticket.dueDate) >= now &&
        new Date(ticket.dueDate) <= new Date(now.setDate(now.getDate() + 3))
    );

    // Calculate tickets by status
    const openTickets = tickets.filter(
      (ticket) => ticket.status !== "resolved" && ticket.status !== "closed"
    );

    const resolvedLastWeek = tickets.filter(
      (ticket) =>
        (ticket.status === "resolved" || ticket.status === "closed") &&
        ticket.resolvedAt &&
        new Date(ticket.resolvedAt) >= oneWeekAgo
    );

    // Calculate average first response time
    let totalFirstResponseTime = 0;
    let ticketsWithFirstResponse = 0;

    tickets.forEach((ticket) => {
      if (ticket.comments.length > 0) {
        const ticketCreatedAt = new Date(ticket.createdAt);
        const firstCommentAt = new Date(ticket.comments[0].createdAt);
        const responseTimeHours =
          (firstCommentAt.getTime() - ticketCreatedAt.getTime()) /
          (1000 * 60 * 60);

        if (responseTimeHours >= 0) {
          totalFirstResponseTime += responseTimeHours;
          ticketsWithFirstResponse++;
        }
      }
    });

    const avgFirstResponseHours =
      ticketsWithFirstResponse > 0
        ? totalFirstResponseTime / ticketsWithFirstResponse
        : 0;

    // Calculate average resolution time
    let totalResolutionTime = 0;
    let ticketsResolved = 0;

    tickets.forEach((ticket) => {
      if (ticket.resolvedAt) {
        const ticketCreatedAt = new Date(ticket.createdAt);
        const resolvedAt = new Date(ticket.resolvedAt);
        const resolutionTimeHours =
          (resolvedAt.getTime() - ticketCreatedAt.getTime()) / (1000 * 60 * 60);

        if (resolutionTimeHours >= 0) {
          totalResolutionTime += resolutionTimeHours;
          ticketsResolved++;
        }
      }
    });

    const avgResolutionHours =
      ticketsResolved > 0 ? totalResolutionTime / ticketsResolved : 0;

    // Top priority tickers
    const highPriorityTickets = tickets.filter(
      (ticket) =>
        ticket.status !== "resolved" &&
        ticket.status !== "closed" &&
        (ticket.priority === "high" || ticket.priority === "urgent")
    );

    return {
      totalTickets: tickets.length,
      openTickets: openTickets.length,
      resolvedLastWeek: resolvedLastWeek.length,
      overdueTickets: overdueTickets.length,
      upcomingDueTickets: upcomingDueTickets.length,
      highPriorityTickets: highPriorityTickets.length,
      avgFirstResponseHours,
      avgResolutionHours,
      resolutionRate:
        tickets.length > 0 ? (ticketsResolved / tickets.length) * 100 : 0,
      // Get sample of urgent tickets for display
      urgentTickets: highPriorityTickets
        .sort(
          (a, b) =>
            new Date(a.dueDate || 0).getTime() -
            new Date(b.dueDate || 0).getTime()
        )
        .slice(0, 3)
        .map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          priority: ticket.priority,
          dueDate: ticket.dueDate,
          businessName: ticket.submittedCompanyName || "",
        })),
    };
  } catch (error) {
    console.error("Error getting support metrics:", error);
    return {
      totalTickets: 0,
      openTickets: 0,
      resolvedLastWeek: 0,
      overdueTickets: 0,
      upcomingDueTickets: 0,
      highPriorityTickets: 0,
      avgFirstResponseHours: 0,
      avgResolutionHours: 0,
      resolutionRate: 0,
      urgentTickets: [],
    };
  }
}
