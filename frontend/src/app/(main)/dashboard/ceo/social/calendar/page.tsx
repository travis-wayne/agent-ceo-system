"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2, Clock, Users, MessageSquare, Target, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";

interface CalendarEvent {
  id: string;
  title: string;
  content: string;
  platform: string;
  date: string;
  time: string;
  status: 'scheduled' | 'published' | 'draft';
  campaign?: string;
  type: 'post' | 'story' | 'video' | 'article';
}

function SocialCalendarContent() {
  const { accounts, campaigns } = useSocialMedia();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: "event_1",
      title: "AI Trends Article",
      content: "Deep dive into AI trends for 2024...",
      platform: "LinkedIn",
      date: "2024-01-15",
      time: "09:00",
      status: "scheduled",
      campaign: "Thought Leadership Series",
      type: "article"
    },
    {
      id: "event_2",
      title: "Product Demo Video",
      content: "Showcasing our latest features...",
      platform: "YouTube",
      date: "2024-01-16",
      time: "14:00",
      status: "scheduled",
      campaign: "Product Launch",
      type: "video"
    },
    {
      id: "event_3",
      title: "Quick Tip Post",
      content: "5 ways to improve your lead conversion...",
      platform: "Twitter/X",
      date: "2024-01-17",
      time: "10:30",
      status: "draft",
      type: "post"
    }
  ];

  const headerActions = useMemo(() => [
    {
      label: "Schedule Post",
      variant: "default" as const,
      icon: Plus,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts?action=schedule"
    },
    {
      label: "View Posts",
      variant: "outline" as const,
      icon: MessageSquare,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts"
    },
    {
      label: "Analytics",
      variant: "outline" as const,
      icon: Target,
      onClick: () => {},
      href: "/dashboard/ceo/social/analytics"
    }
  ], []);

  const quickActions = useMemo(() => [
    {
      label: "Create Post",
      icon: Plus,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts?action=create"
    },
    {
      label: "Generate Content",
      icon: Target,
      onClick: () => {},
      href: "/dashboard/ceo/social/generator"
    },
    {
      label: "View Campaigns",
      icon: Target,
      onClick: () => {},
      href: "/dashboard/ceo/social/campaigns"
    }
  ], []);

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return 'border-l-blue-600';
      case 'Twitter/X':
        return 'border-l-black';
      case 'Facebook':
        return 'border-l-blue-500';
      case 'Instagram':
        return 'border-l-purple-500';
      case 'YouTube':
        return 'border-l-red-600';
      default:
        return 'border-l-gray-400';
    }
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Content Calendar"
          description="Plan, schedule, and manage your social media content across all platforms"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Calendar" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Scheduled Posts"
            value={events.filter(e => e.status === 'scheduled').length.toString()}
            description="Ready to publish"
            icon={Clock}
            trend={{ value: 3, isPositive: true, period: "new this week" }}
          />
          <StatCard
            title="Draft Posts"
            value={events.filter(e => e.status === 'draft').length.toString()}
            description="Awaiting review"
            icon={Edit}
            trend={{ value: 2, isPositive: false, period: "pending" }}
          />
          <StatCard
            title="Active Campaigns"
            value={campaigns.filter(c => c.status === 'active').length.toString()}
            description="Running campaigns"
            icon={Target}
          />
          <StatCard
            title="Connected Accounts"
            value={accounts.length.toString()}
            description="Social platforms"
            icon={Users}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks for content management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayEvents = getEventsForDate(day.toISOString().split('T')[0]);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          min-h-[80px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50
                          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                          ${isToday ? 'bg-blue-50 border-blue-200' : ''}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold text-blue-600' : ''}`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate border-l-2 ${getPlatformColor(event.platform)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Posts
                </CardTitle>
                <CardDescription>
                  Next scheduled content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {event.platform}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Link href="/dashboard/ceo/social/posts">
                      <Button variant="outline" className="w-full">
                        View All Posts
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SocialCalendarPage() {
  return (
    <SocialMediaProvider>
      <SocialCalendarContent />
    </SocialMediaProvider>
  );
} 