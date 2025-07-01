"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { nb } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { updateTicket, addComment } from "@/app/actions/tickets";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  email: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  isInternal: boolean;
}

interface Tag {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  dueDate: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  submittedCompanyName: string | null;
  business: Business | null;
  contact: Contact | null;
  assigneeId: string | null;
  creatorId: string | null;
  comments: Comment[];
  tags: Tag[];
  estimatedTime?: string;
}

interface TicketDetailProps {
  ticket: Ticket;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalComment, setInternalComment] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    ticket.dueDate ? new Date(ticket.dueDate) : undefined
  );
  const [estimatedTime, setEstimatedTime] = useState(
    ticket.estimatedTime || ""
  );
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [isEditingEstimatedTime, setIsEditingEstimatedTime] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === status) return;

    try {
      await updateTicket(ticket.id, { status: newStatus });
      setStatus(newStatus);
              toast.success("Status updated", {
                  description: `Ticket status changed to ${newStatus}`,
      });
      router.refresh();
    } catch (error) {
              toast.error("Error updating status", {
                  description: "Could not update ticket status.",
      });
    }
  }

  async function handlePriorityChange(newPriority: string) {
    if (newPriority === priority) return;

    try {
      await updateTicket(ticket.id, { priority: newPriority });
      setPriority(newPriority);
              toast.success("Priority updated", {
                  description: `Ticket priority changed to ${newPriority}`,
      });
      router.refresh();
    } catch (error) {
              toast.error("Error updating priority", {
                  description: "Could not update ticket priority.",
      });
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(ticket.id, {
        content: comment,
        isInternal: internalComment,
      });

      setComment("");
      setInternalComment(false);
              toast.success("Comment added", {
          description: "Your comment has been added to the ticket",
      });
      router.refresh();
    } catch (error) {
              toast.error("Error adding comment", {
                  description: "Could not add comment to the ticket.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAssignBusiness() {
    router.push(`/tickets/${ticket.id}/assign-business`);
  }

  async function handleDueDateChange(date: Date | undefined) {
    try {
      const response = await updateTicket(ticket.id, { dueDate: date });

      if (response.success) {
        setDueDate(date);
        setIsEditingDueDate(false);
        toast.success("Due date updated");
        router.refresh();
      } else {
        toast.error("Error updating due date", {
          description: response.error || "Could not update due date",
        });
      }
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Error updating due date");
    }
  }

  async function handleEstimatedTimeChange(e: React.FormEvent) {
    e.preventDefault();
    const value = parseInt(estimatedTime as string, 10) || null;

    try {
      const response = await updateTicket(ticket.id, { estimatedTime: value });

      if (response.success) {
        // Only close editing mode and show toast if successful
        setIsEditingEstimatedTime(false);
        toast.success("Estimated time updated");
        router.refresh();
      } else {
        toast.error("Error updating estimated time", {
          description: response.error || "Could not update estimated time",
        });
      }
    } catch (error) {
      console.error("Error updating estimated time:", error);
      toast.error("Error updating estimated time");
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <div className="flex items-center gap-2">
                <StatusBadge status={status} />
                <PriorityBadge priority={priority} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>{ticket.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <Separator />

              <Tabs defaultValue="comments">
                <TabsList>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="space-y-4 mt-4">
                  {ticket.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No comments yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {ticket.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {comment.authorId.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                User {comment.authorId.substring(0, 6)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(comment.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                              {comment.isInternal && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-amber-100 text-amber-800"
                                >
                                  Intern
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm rounded-md bg-muted p-3">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleCommentSubmit} className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="internal-comment"
                          checked={internalComment}
                          onChange={(e) => setInternalComment(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label
                          htmlFor="internal-comment"
                          className="text-sm text-muted-foreground"
                        >
                          Internal note (not visible to customer)
                        </label>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !comment.trim()}
                      >
                        {isSubmitting ? "Adding..." : "Add comment"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="activity">
                  <p className="text-sm text-muted-foreground">
                    Activity Log will be available soon
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Status</div>
              <div className="text-right">
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Not assigned</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="waiting_on_customer">
                      Waiting on customer
                    </SelectItem>
                    <SelectItem value="waiting_on_third_party">
                      Waiting on third party
                    </SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                              <div className="text-muted-foreground">Priority</div>
              <div className="text-right">
                <Select value={priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                              <div className="text-muted-foreground">Created</div>
              <div className="text-right">
                {format(new Date(ticket.createdAt), "d. MMM yyyy", {
                  locale: nb,
                })}
              </div>

              {ticket.resolvedAt && (
                <>
                  <div className="text-muted-foreground">Resolved</div>
                  <div className="text-right">
                    {format(new Date(ticket.resolvedAt), "d. MMM yyyy", {
                      locale: nb,
                    })}
                  </div>
                </>
              )}

              {/* Due Date section with edit capability */}
              <div className="text-muted-foreground">Due Date</div>
              <div className="text-right flex justify-end items-center gap-2">
                {isEditingDueDate ? (
                  <div className="w-[180px]">
                    <DatePicker
                      date={dueDate}
                      onDateChange={handleDueDateChange}
                                              placeholder="No deadline set"
                    />
                  </div>
                ) : (
                  <>
                    {ticket.dueDate
                      ? format(new Date(ticket.dueDate), "d. MMM yyyy", {
                          locale: nb,
                        })
                      : "No deadline set"}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditingDueDate(true)}
                      className="h-5 w-5"
                    >
                      ✏️
                    </Button>
                  </>
                )}
              </div>

              {/* Estimated Time section with edit capability */}
              <div className="text-muted-foreground">Estimated time</div>
              <div className="text-right flex justify-end items-center gap-2">
                {isEditingEstimatedTime ? (
                  <form
                    onSubmit={handleEstimatedTimeChange}
                    className="flex w-[180px]"
                  >
                    <Input
                      type="number"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="Minutes"
                      className="h-8"
                    />
                    <Button type="submit" size="sm" className="ml-1 h-8">
                      OK
                    </Button>
                  </form>
                ) : (
                  <>
                    {ticket.estimatedTime
                      ? `${ticket.estimatedTime} minutes`
                                              : "Not set"}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditingEstimatedTime(true)}
                      className="h-5 w-5"
                    >
                      ✏️
                    </Button>
                  </>
                )}
              </div>

              <div className="col-span-2 mt-2">
                <Separator />
              </div>
            </div>

            <div className="space-y-2">
                              <div className="text-sm font-medium">Business</div>
              {ticket.business ? (
                <div className="text-sm">
                  <Link
                    href={`/businesses/${ticket.business.id}`}
                    className="font-medium hover:underline text-primary"
                  >
                    {ticket.business.name}
                  </Link>
                  <div className="text-muted-foreground">
                    {ticket.business.email}
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="text-muted-foreground">
                    {ticket.submittedCompanyName || "Unknown"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handleAssignBusiness}
                  >
                                            Assign to business
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Contact</div>
              {ticket.contact ? (
                <div className="text-sm">
                  <div className="font-medium">{ticket.contact.name}</div>
                  <div className="text-muted-foreground">
                    {ticket.contact.email}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {ticket.submitterName || "No contact assigned"}
                  {ticket.submitterEmail && <div>{ticket.submitterEmail}</div>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              Assign to agent
            </Button>
            <Button className="w-full" variant="outline">
              Merge tickets
            </Button>
            <Button className="w-full" variant="destructive">
              Delete ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
