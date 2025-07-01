"use client";

import Link from "next/link";
import { IconCirclePlusFilled, IconMail, IconChevronRight, type Icon } from "@tabler/icons-react";
import { ReactNode, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useCommandPalette } from "@/providers/command-palette-provider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: Icon;
    isActive?: boolean;
    badge?: number | ReactNode;
    items?: {
      title: string;
      url: string;
      icon?: Icon;
      isActive?: boolean;
    }[];
  }[];
}

const STORAGE_KEY = 'sidebar-open-sections';

export function NavMain({ items }: NavMainProps) {
  const { toggle } = useCommandPalette();
  
  // Initialize state from localStorage or default to active items
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse stored sidebar state:', e);
        }
      }
    }
    
    // Default: Auto-open items that have active sub-items or are marked as active
    return items
      .filter(item => item.isActive || (item.items && item.items.some(subItem => subItem.isActive)))
      .map(item => item.title);
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(openItems));
    }
  }, [openItems]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Hurtigvalg (⌘K)"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={toggle}
            >
              <IconCirclePlusFilled />
              <span>Hurtigvalg</span>
              <span className="ml-auto hidden md:inline-flex">
                <kbd className="h-5 select-none items-center gap-0.5 rounded border bg-primary-foreground/20 px-1.5 font-mono text-[10px] font-medium text-primary-foreground flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openItems.includes(item.title);
            const hasSubItems = item.items && item.items.length > 0;

            if (hasSubItems) {
              return (
                <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton data-active={item.isActive}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <IconChevronRight 
                          className={`ml-auto transition-transform duration-200 ${
                            isOpen ? 'rotate-90' : ''
                          }`} 
                        />
                        {item.badge && (
                          <span className="ml-auto">
                            {typeof item.badge === "number" && item.badge > 0 ? (
                              <Badge
                                variant="secondary"
                                className="bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center text-xs"
                              >
                                {item.badge}
                              </Badge>
                            ) : (
                              item.badge
                            )}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild data-active={subItem.isActive}>
                              <Link href={subItem.url}>
                                {subItem.icon && <subItem.icon className="!size-4" />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // Render simple items without sub-items
            return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild data-active={item.isActive}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto">
                      {typeof item.badge === "number" && item.badge > 0 ? (
                        <Badge
                          variant="secondary"
                          className="bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center text-xs"
                        >
                          {item.badge}
                        </Badge>
                      ) : (
                        item.badge
                      )}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
