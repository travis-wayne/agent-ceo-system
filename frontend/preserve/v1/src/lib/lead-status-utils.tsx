import { CustomerStage } from "@prisma/client";
import {
  Info,
  Clock,
  CheckCircle,
  ArrowUpCircle,
  AlertCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import React from "react";

export function getStatusBadgeProps(stage: CustomerStage) {
  const stageMap: Record<
    CustomerStage,
    {
      label: string;
      variant: "default" | "outline" | "secondary" | "destructive" | "success";
      icon: React.ReactNode;
      description: string;
    }
  > = {
    lead: {
      label: "New",
      variant: "secondary",
      icon: <Info className="h-4 w-4" />,
      description: "New lead that hasn't been contacted",
    },
    prospect: {
      label: "Contacted",
      variant: "default",
      icon: <Clock className="h-4 w-4" />,
      description: "Lead that is in dialogue",
    },
    qualified: {
      label: "Qualified",
      variant: "default",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Qualified lead ready for offer",
    },
    offer_sent: {
      label: "Offer Sent",
      variant: "default",
      icon: <Send className="h-4 w-4" />,
      description: "Offer has been sent to customer",
    },
    offer_accepted: {
      label: "Offer Accepted",
      variant: "success",
      icon: <ThumbsUp className="h-4 w-4" />,
      description: "Customer has accepted the offer",
    },
    declined: {
      label: "Declined",
      variant: "destructive",
      icon: <ThumbsDown className="h-4 w-4" />,
      description: "Customer declined or wrong match",
    },
    customer: {
      label: "Customer",
      variant: "success",
      icon: <ArrowUpCircle className="h-4 w-4" />,
      description: "Converted to active customer",
    },
    churned: {
      label: "Lost",
      variant: "destructive",
      icon: <AlertCircle className="h-4 w-4" />,
      description: "Lost lead",
    },
  };

  return stageMap[stage];
}
