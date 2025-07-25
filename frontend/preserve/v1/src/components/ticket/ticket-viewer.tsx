"use client";

import * as React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Ticket,
  updateTicket,
  updateTicketStatus,
  addTicketComment,
  assignTicket,
} from "@/app/actions/tickets";
import { UserAssignSelect } from "./user-assign-select";
import { useIsMobile } from "@/hooks/use-mobile";
import { DatePicker } from "@/components/ui/date-picker";

interface TicketViewerProps {
  ticket: Ticket;
  onTicketUpdated?: () => void;
}

// Status text mapping
const statusMap: Record<string, string> = {
  unassigned: "Unassigned",
  open: "Open",
  in_progress: "In Progress",
  waiting_on_customer: "Waiting for customer",
  waiting_on_third_party: "Waiting on Third Party",
  resolved: "Resolved",
  closed: "Closed",
};

// Priority text mapping
const priorityMap: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Critical",
};

// Handler for ticket assignee
async function handleTicketAssignee(ticketId: string, assigneeId: string) {
  toast.promise(assignTicket(ticketId, assigneeId), {
    loading: `Assigning ticket...`,
    success: `Ticket assigned`,
    error: "Could not assign ticket",
  });
}

// Handler for adding comments
async function handleAddComment(ticketId: string, content: string) {
  if (!content.trim()) {
    toast.error("Kommentar kan ikke være tom");
    return;
  }

  toast.promise(addTicketComment(ticketId, content, undefined, false), {
    loading: "Legger til kommentar...",
    success: "Kommentar lagt til",
    error: "Kunne ikke legge til kommentar",
  });
}

export function TicketViewer({ ticket, onTicketUpdated }: TicketViewerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");

  // State for ticket update form
  const [title, setTitle] = React.useState(ticket.title);
  const [status, setStatus] = React.useState(ticket.status);
  const [priority, setPriority] = React.useState(ticket.priority);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    ticket.dueDate ? new Date(ticket.dueDate) : undefined
  );
  const [estimatedTime, setEstimatedTime] = React.useState<string>(
    ticket.estimatedTime?.toString() || ""
  );
  const [businessName, setBusinessName] = React.useState(
    ticket.businessName || ""
  );
  const [description, setDescription] = React.useState(ticket.description);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Track changes when editing fields - only for fields that don't auto-save
  React.useEffect(() => {
    const changes =
      businessName !== (ticket.businessName || "") ||
      description !== ticket.description;

    setHasChanges(changes);
  }, [businessName, description, ticket]);

  const handleSubmitComment = async () => {
    await handleAddComment(ticket.id, commentText);
    setCommentText(""); // Clear the comment field after submission
    if (onTicketUpdated) onTicketUpdated();
  };

  // Status change handler with immediate save
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setStatus(newStatus);
    try {
      await toast.promise(updateTicketStatus(ticket.id, newStatus), {
        loading: "Updating status...",
        success: `Status updated to ${statusMap[newStatus] || newStatus}`,
        error: "Could not update status",
      });
      if (onTicketUpdated) onTicketUpdated();
    } catch (error) {
      console.error("Error updating status:", error);
      // Reset to original value on error
      setStatus(ticket.status);
    }
  };

  // Due date change handler with immediate save
  const handleDueDateChange = async (newDate: Date | undefined) => {
    setDueDate(newDate);
    try {
      // First perform the update
      const response = await updateTicket(ticket.id, { dueDate: newDate });

      // Then show toast based on the result
      if (newDate) {
        toast.success("Frist satt");
      } else {
        toast.success("Frist fjernet");
      }

      // Trigger refresh if provided
      if (onTicketUpdated) {
        onTicketUpdated();
      }
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Kunne ikke oppdatere frist");
      // Reset to original value on error
      setDueDate(ticket.dueDate ? new Date(ticket.dueDate) : undefined);
    }
  };

  // Estimated time change handler - updates DB when input loses focus
  const handleEstimatedTimeBlur = async () => {
    const valueAsNumber = estimatedTime ? parseInt(estimatedTime, 10) : null;

    // Only update if the value has actually changed
    if (valueAsNumber !== ticket.estimatedTime) {
      try {
        // First perform the update
        await updateTicket(ticket.id, { estimatedTime: valueAsNumber });

        // Then show appropriate toast
        if (valueAsNumber) {
          toast.success("Estimated time set");
        } else {
          toast.success("Estimated time removed");
        }

        // Trigger refresh if provided
        if (onTicketUpdated) {
          onTicketUpdated();
        }
      } catch (error) {
        console.error("Error updating estimated time:", error);
        toast.error("Could not update estimated time");
        // Reset to original value on error
        setEstimatedTime(ticket.estimatedTime?.toString() || "");
      }
    }
  };

  // Priority change handler with immediate save
  const handlePriorityChange = async (newPriority: string) => {
    if (newPriority === priority) return;

    setPriority(newPriority);
    try {
      const result = await toast.promise(
        updateTicket(ticket.id, { priority: newPriority }),
        {
          loading: "Updating priority...",
          success: `Priority updated to ${
            priorityMap[newPriority] || newPriority
          }`,
          error: "Kunne ikke oppdatere prioritet",
        }
      );
      if (onTicketUpdated) onTicketUpdated();
    } catch (error) {
      console.error("Error updating priority:", error);
      // Reset to original value on error
      setPriority(ticket.priority);
    }
  };

  // Handler for saving text fields
  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    setIsSubmitting(true);
    try {
      // Prepare update data with proper type annotation
      const updateData: Record<string, any> = {
        title,
        status,
        priority,
        dueDate: dueDate,
        estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : null,
        description,
      };

      // Only include businessName if it's been changed and is not empty
      if (businessName && businessName !== ticket.businessName) {
        // Using a more generic Record type to avoid TypeScript errors
        updateData.submittedCompanyName = businessName;
      }

      const response = await updateTicket(ticket.id, updateData);

              toast.success("Ticket updated");

      if (onTicketUpdated) {
        onTicketUpdated();
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Kunne ikke oppdatere sak");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEstimatedTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, "");
    setEstimatedTime(value);
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {ticket.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{ticket.title}</DrawerTitle>
          <DrawerDescription>
            Created {format(ticket.createdAt, "PPP")}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid gap-2">
            <div className="flex gap-2 leading-none font-medium">
              Ticket Details
            </div>
          </div>
          <Separator />
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Velg status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Åpen</SelectItem>
                    <SelectItem value="in_progress">Pågående</SelectItem>
                    <SelectItem value="waiting_on_customer">
                      Waiting on customer
                    </SelectItem>
                    <SelectItem value="waiting_on_third_party">
                      Waiting on third party
                    </SelectItem>
                    <SelectItem value="resolved">Løst</SelectItem>
                    <SelectItem value="closed">Lukket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="business">Business</Label>
                <Input
                  id="business"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Assign to business"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="assignee">Assigned to</Label>
                <UserAssignSelect
                  ticketId={ticket.id}
                  onAssign={handleTicketAssignee}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="dueDate">Frist</Label>
                <DatePicker
                  date={dueDate}
                  onDateChange={handleDueDateChange}
                  placeholder="No deadline set"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="estimatedTime">Estimated time (minutes)</Label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={estimatedTime}
                  onChange={handleEstimatedTimeChange}
                  onBlur={handleEstimatedTimeBlur}
                  placeholder="Estimated time in minutes"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="description">Beskrivelse</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="comment">Add comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Skriv kommentaren din her..."
                  className="min-h-[100px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
            </div>
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex flex-col gap-3">
                <Label>Tagger</Label>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
        <DrawerFooter className="flex flex-col sm:flex-row gap-2">
          {hasChanges && (
            <Button
              onClick={handleSaveChanges}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          )}
          <Button
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="w-full sm:w-auto"
          >
            Send kommentar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Lukk
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
