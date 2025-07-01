"use client";

import * as React from "react";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { UserAssignSelect } from "./user-assign-select";
import { createTicket } from "@/app/actions/tickets";
import { getAllBusinesses } from "@/app/actions/businesses/actions";
import { DatePicker } from "@/components/ui/date-picker";

interface AddTicketSheetProps {
  onTicketCreated?: () => void;
}

export function AddTicketSheet({ onTicketCreated }: AddTicketSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    subject: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    companyName: "",
    status: "open" as string,
    businessId: "",
    assigneeId: "",
    dueDate: undefined as Date | undefined,
    estimatedTime: "" as string,
  });
  const [businesses, setBusinesses] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = React.useState(false);
  const [showCustomBusiness, setShowCustomBusiness] = React.useState(false);

  // Fetch businesses when the form opens
  React.useEffect(() => {
    if (open && businesses.length === 0) {
      fetchBusinesses();
    }
  }, [open, businesses.length]);

  // Function to fetch businesses
  const fetchBusinesses = async () => {
    try {
      setIsLoadingBusinesses(true);
      const businessList = await getAllBusinesses();
      setBusinesses(businessList.map((b) => ({ id: b.id, name: b.name })));
    } catch (error) {
      console.error("Error loading businesses:", error);
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      priority: value as "low" | "medium" | "high" | "urgent",
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleBusinessChange = (value: string) => {
    if (value === "custom") {
      setShowCustomBusiness(true);
      setFormData((prev) => ({ ...prev, businessId: "" }));
    } else {
      setShowCustomBusiness(false);
      setFormData((prev) => ({ ...prev, businessId: value, companyName: "" }));
    }
  };

  const handleAssign = (_ticketId: string, userId: string) => {
    setFormData((prev) => ({ ...prev, assigneeId: userId }));
  };

  const handleDueDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
  };

  const handleEstimatedTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, estimatedTime: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assigneeId: formData.assigneeId || undefined,
        dueDate: formData.dueDate,
        estimatedTime: formData.estimatedTime
          ? parseInt(formData.estimatedTime, 10)
          : undefined,
        // Include either businessId or companyName
        ...(formData.businessId
          ? { businessId: formData.businessId }
          : { companyName: formData.companyName }),
      };

      const response = await createTicket(ticketData);

      await toast.promise(Promise.resolve(response), {
                      loading: "Creating ticket...",
                      success: "Ticket created",
                      error: "Could not create ticket",
      });

      if (response.success) {
        setFormData({
          subject: "",
          description: "",
          priority: "medium" as "low" | "medium" | "high" | "urgent",
          companyName: "",
          status: "open",
          businessId: "",
          assigneeId: "",
          dueDate: undefined,
          estimatedTime: "",
        });
        setOpen(false);

        // Call the onTicketCreated callback if provided
        if (onTicketCreated) {
          onTicketCreated();
        }
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Add ticket</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md w-[90vw]">
        <SheetHeader>
          <SheetTitle>Create new ticket</SheetTitle>
          <SheetDescription>
            Fill out the information to create a new ticket.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="subject" className="required">
              Tittel
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of the ticket"
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="description" className="required">
              Beskrivelse
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the ticket"
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
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
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={handlePriorityChange}
              >
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

          <div className="flex flex-col gap-3">
                            <Label htmlFor="business">Business</Label>
            <Select
              value={
                formData.businessId || (showCustomBusiness ? "custom" : "")
              }
              onValueChange={handleBusinessChange}
            >
              <SelectTrigger id="business" className="w-full">
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBusinesses ? (
                  <SelectItem value="loading" disabled>
                                          Loading businesses...
                  </SelectItem>
                ) : (
                  <>
                    {businesses.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Other business</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            {showCustomBusiness && (
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                                    placeholder="Enter business name"
                className="mt-2"
              />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="assignee">Assigned to</Label>
            <div className="w-full">
              <UserAssignSelect ticketId="new-ticket" onAssign={handleAssign} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="dueDate">Frist</Label>
              <DatePicker
                date={formData.dueDate}
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
                value={formData.estimatedTime}
                onChange={handleEstimatedTimeChange}
                                    placeholder="Estimated time in minutes"
              />
            </div>
          </div>

          <SheetFooter className="pt-4">
            <Button
              type="submit"
              disabled={
                isSubmitting || !formData.subject || !formData.description
              }
              className="w-full"
            >
              {isSubmitting ? "Creating..." : "Create ticket"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
