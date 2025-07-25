"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

// New interface for the items prop
interface NewPageHeaderProps {
  items: BreadcrumbItem[];
  className?: string;
  title?: never;
  description?: never;
  breadcrumbItems?: never;
}

// Legacy interface for backward compatibility
interface LegacyPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  className?: string;
  items?: never;
}

type PageHeaderProps = NewPageHeaderProps | LegacyPageHeaderProps;

export function PageHeader(props: PageHeaderProps) {
  const { className } = props;
  
  // Handle legacy props
  let items: BreadcrumbItem[];
  if ('items' in props && props.items) {
    items = props.items;
  } else if ('breadcrumbItems' in props && props.breadcrumbItems) {
    // Convert legacy breadcrumbItems to new format and add current page
    items = [
      ...props.breadcrumbItems.slice(0, -1), // All but last item
      { label: props.title, isCurrentPage: true } // Current page from title
    ];
  } else {
    items = [];
  }

  return (
    <header
      className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ${
        className || ""
      }`}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {items && items.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                <BreadcrumbItem
                  className={index === 0 ? "hidden md:block" : ""}
                >
                  {item.isCurrentPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href || "#"}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
