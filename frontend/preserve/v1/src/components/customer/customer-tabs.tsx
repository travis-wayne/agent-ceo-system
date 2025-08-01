"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MessageSquare, Mail, FileText } from "lucide-react";
import { CustomerContacts } from "./customer-contacts";
import { CustomerActivities } from "./customer-activities";
import { CustomerSmsHistory } from "./customer-sms-history";
import { CustomerEmailHistory } from "./customer-email-history";
import { Business } from "@prisma/client";

interface CustomerTabsProps {
  customer: Business;
}

export function CustomerTabs({ customer }: CustomerTabsProps) {
  const [activeTab, setActiveTab] = useState("contacts");

  return (
    <Tabs
      defaultValue="contacts"
      className="w-full mt-6"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid grid-cols-5 md:w-[750px] mb-6">
        <TabsTrigger value="contacts" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Kontakter</span>
        </TabsTrigger>
        <TabsTrigger value="activities" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Aktiviteter</span>
        </TabsTrigger>
        <TabsTrigger value="sms" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">SMS</span>
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">E-post</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contacts" className="space-y-4">
        <CustomerContacts customerId={customer.id} />
      </TabsContent>

      <TabsContent value="activities" className="space-y-4">
        <CustomerActivities customerId={customer.id} />
      </TabsContent>

      <TabsContent value="sms" className="space-y-4">
        <CustomerSmsHistory customerId={customer.id} />
      </TabsContent>

      <TabsContent value="email" className="space-y-4">
        <CustomerEmailHistory customerId={customer.id} />
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">Notes</h3>
          <p className="text-muted-foreground text-sm">
            Customer notes go here.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
