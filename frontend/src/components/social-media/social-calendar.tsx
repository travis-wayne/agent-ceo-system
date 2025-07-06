"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Plus,
  Clock,
  MessageSquare,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Filter
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  content: string;
  date: Date;
  time: string;
  platforms: string[];
  status: "PLANNED" | "SCHEDULED" | "PUBLISHED";
  type: "POST" | "STORY" | "CAMPAIGN_START" | "CAMPAIGN_END";
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "AI Product Launch Post",
    content: "🚀 Exciting news! Our new AI features are now live...",
    date: new Date("2024-01-20"),
    time: "10:00",
    platforms: ["LINKEDIN", "TWITTER"],
    status: "SCHEDULED",
    type: "POST"
  },
  {
    id: "2",
    title: "Weekly Industry Insights",
    content: "💡 This week in tech: Key trends and developments...", 
    date: new Date("2024-01-22"),
    time: "14:00",
    platforms: ["LINKEDIN"],
    status: "PLANNED",
    type: "POST"
  },
  {
    id: "3",
    title: "Behind the Scenes Story",
    content: "👀 A look inside our development process...",
    date: new Date("2024-01-23"),
    time: "16:30",
    platforms: ["INSTAGRAM"],
    status: "PLANNED", 
    type: "STORY"
  },
  {
    id: "4",
    title: "Q1 Campaign Launch",
    content: "Campaign: Q1 Product Launch begins",
    date: new Date("2024-01-25"),
    time: "09:00",
    platforms: ["LINKEDIN", "TWITTER", "FACEBOOK"],
    status: "PLANNED",
    type: "CAMPAIGN_START"
  }
];

const PLATFORM_ICONS = {
  LINKEDIN: "in",
  TWITTER: "𝕏", 
  FACEBOOK: "f",
  INSTAGRAM: "📷"
};

const STATUS_COLORS = {
  PLANNED: "bg-gray-100 text-gray-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  PUBLISHED: "bg-green-100 text-green-800"
};

const TYPE_COLORS = {
  POST: "bg-purple-100 text-purple-800",
  STORY: "bg-pink-100 text-pink-800", 
  CAMPAIGN_START: "bg-green-100 text-green-800",
  CAMPAIGN_END: "bg-red-100 text-red-800"
};

export default function SocialCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get events for the current month
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  // Get days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Content Calendar</h2>
            <p className="text-slate-600">Plan and schedule your social media content</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="month" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Month
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h3 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Scheduled
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Planned
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Published
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {view === "month" ? (
            <div className="space-y-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map((date, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg ${
                      date ? 'bg-white hover:bg-slate-50 cursor-pointer' : 'bg-transparent'
                    } ${
                      date && date.toDateString() === new Date().toDateString()
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200'
                    }`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-medium mb-2">{date.getDate()}</div>
                        <div className="space-y-1">
                          {getEventsForDate(date).slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-center truncate ${STATUS_COLORS[event.status]}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {getEventsForDate(date).length > 3 && (
                            <div className="text-xs text-slate-500 text-center">
                              +{getEventsForDate(date).length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMonthEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No events scheduled</h3>
                  <p className="text-sm text-slate-500">Add your first event to get started</p>
                </div>
              ) : (
                currentMonthEvents
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => (
                    <Card key={event.id} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge className={STATUS_COLORS[event.status]}>
                                {event.status}
                              </Badge>
                              <Badge className={TYPE_COLORS[event.type]}>
                                {event.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {event.content}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {event.date.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {event.time}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              {event.platforms.map(platform => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS]} {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Scheduled This Month</p>
                <p className="text-2xl font-bold text-slate-900">
                  {currentMonthEvents.filter(e => e.status === 'SCHEDULED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Planned</p>
                <p className="text-2xl font-bold text-slate-900">
                  {currentMonthEvents.filter(e => e.status === 'PLANNED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">{currentMonthEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 