"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/page-header";
import { useSocial } from "@/lib/social/social-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  RefreshCw,
  Clock,
  MessageSquare,
  Target,
  Bell,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  View,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  ArrowRight
} from "lucide-react";

export default function SocialCalendarPage() {
  const { 
    posts, 
    campaigns, 
    calendar, 
    isLoading, 
    refreshCalendar,
    getCalendarEvents,
    setSelectedPost,
    setSelectedCampaign
  } = useSocial();
  
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'campaigns' | 'reminders'>('all');

  // Get events for the selected date range
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendar.filter(event => event.date === dateStr);
  };

  const getEventsForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return getCalendarEvents(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  };

  const getEventsForMonth = (date: Date) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return getCalendarEvents(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  };

  // Filter events based on selected filter
  const filterEvents = (events: any[]) => {
    if (filterType === 'all') return events;
    return events.filter(event => event.type === filterType.slice(0, -1)); // Remove 's' from 'posts', 'campaigns'
  };

  // Handle navigation
  const handleViewPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      router.push(`/dashboard/ceo/social/posts?id=${postId}`);
    }
  };

  const handleViewCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      router.push(`/dashboard/ceo/social/campaigns?id=${campaignId}`);
    }
  };

  const handleCreatePost = () => {
    router.push('/dashboard/ceo/social/posts?action=create');
  };

  const handleCreateCampaign = () => {
    router.push('/dashboard/ceo/social/campaigns?action=create');
  };

  // Get events for current view
  const getCurrentEvents = () => {
    let events = [];
    switch (viewMode) {
      case 'day':
        events = getEventsForDate(selectedDate);
        break;
      case 'week':
        events = getEventsForWeek(selectedDate);
        break;
      case 'month':
        events = getEventsForMonth(selectedDate);
        break;
    }
    return filterEvents(events);
  };

  const currentEvents = getCurrentEvents();

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return getCalendarEvents(
      today.toISOString().split('T')[0],
      nextWeek.toISOString().split('T')[0]
    ).sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  };

  const upcomingEvents = getUpcomingEvents();

  // Get event statistics
  const eventStats = {
    totalEvents: calendar.length,
    scheduledPosts: calendar.filter(e => e.type === 'post' && e.status === 'scheduled').length,
    activeCampaigns: calendar.filter(e => e.type === 'campaign' && e.status === 'scheduled').length,
    pendingReminders: calendar.filter(e => e.type === 'reminder' && e.status === 'scheduled').length
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageSquare className="h-4 w-4" />;
      case 'campaign':
        return <Target className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-blue-100 text-blue-800';
      case 'campaign':
        return 'bg-green-100 text-green-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventTime = (date: string, time: string) => {
    const eventDate = new Date(date + 'T' + time);
    return eventDate.toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Calendar", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Social Calendar</h1>
              </div>
              <p className="text-muted-foreground">
                Schedule and manage your social media content calendar
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => refreshCalendar()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleCreateCampaign}>
                <Target className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
              <Button onClick={handleCreatePost}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{eventStats.totalEvents}</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{eventStats.scheduledPosts}</p>
                  <p className="text-xs text-muted-foreground">Scheduled Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{eventStats.activeCampaigns}</p>
                  <p className="text-xs text-muted-foreground">Active Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{eventStats.pendingReminders}</p>
                  <p className="text-xs text-muted-foreground">Reminders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Calendar View</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === 'posts' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('posts')}
                    >
                      Posts
                    </Button>
                    <Button
                      variant={filterType === 'campaigns' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('campaigns')}
                    >
                      Campaigns
                    </Button>
                    <Button
                      variant={filterType === 'reminders' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('reminders')}
                    >
                      Reminders
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === 'month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('month')}
                      >
                        Month
                      </Button>
                      <Button
                        variant={viewMode === 'week' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('week')}
                      >
                        Week
                      </Button>
                      <Button
                        variant={viewMode === 'day' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('day')}
                      >
                        Day
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          if (viewMode === 'month') {
                            newDate.setMonth(newDate.getMonth() - 1);
                          } else if (viewMode === 'week') {
                            newDate.setDate(newDate.getDate() - 7);
                          } else {
                            newDate.setDate(newDate.getDate() - 1);
                          }
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {selectedDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric',
                          ...(viewMode === 'day' && { day: 'numeric' })
                        })}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          if (viewMode === 'month') {
                            newDate.setMonth(newDate.getMonth() + 1);
                          } else if (viewMode === 'week') {
                            newDate.setDate(newDate.getDate() + 7);
                          } else {
                            newDate.setDate(newDate.getDate() + 1);
                          }
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Component */}
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />

                  {/* Events for Selected Date */}
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      Events for {selectedDate.toLocaleDateString()}
                    </h4>
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
                    ) : (
                      <div className="space-y-2">
                        {filterEvents(getEventsForDate(selectedDate)).map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {getEventIcon(event.type)}
                              <div>
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {event.time} • {event.platforms.join(', ')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getEventColor(event.type)}>
                                {event.type}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (event.type === 'post') {
                                    handleViewPost(event.relatedId);
                                  } else if (event.type === 'campaign') {
                                    handleViewCampaign(event.relatedId);
                                  }
                                }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                ) : (
                  upcomingEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => {
                        if (event.type === 'post') {
                          handleViewPost(event.relatedId);
                        } else if (event.type === 'campaign') {
                          handleViewCampaign(event.relatedId);
                        }
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatEventTime(event.date, event.time)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getEventColor(event.type)} variant="secondary">
                            {event.type}
                          </Badge>
                          {event.platforms.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {event.platforms.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={handleCreatePost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Post
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleCreateCampaign}>
                  <Target className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/ceo/social/analytics')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/ceo/social/accounts')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Accounts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
} 