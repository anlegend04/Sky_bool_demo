import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Phone,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState("month"); // month, week, day
  const [popupDate, setPopupDate] = useState<Date | null>(null);
const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);


  const events = [
    {
      id: 1,
      title: "Technical Interview - Sarah Johnson",
      type: "interview",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      date: "2024-01-15",
      candidate: "Sarah Johnson",
      interviewer: "John Smith",
      position: "Senior Frontend Developer",
      location: "Conference Room A",
      meetingType: "in-person",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Phone Screening - Michael Chen",
      type: "screening",
      startTime: "2:00 PM",
      endTime: "2:30 PM",
      date: "2024-01-15",
      candidate: "Michael Chen",
      interviewer: "Lisa Garcia",
      position: "Product Manager",
      location: "Phone Call",
      meetingType: "phone",
      status: "confirmed",
    },
    {
      id: 3,
      title: "Final Round - Emily Davis",
      type: "final",
      startTime: "3:30 PM",
      endTime: "4:30 PM",
      date: "2024-01-16",
      candidate: "Emily Davis",
      interviewer: "David Kim",
      position: "UX Designer",
      location: "Zoom Meeting",
      meetingType: "video",
      status: "pending",
    },
    {
      id: 4,
      title: "Team Meeting - Engineering",
      type: "meeting",
      startTime: "9:00 AM",
      endTime: "10:00 AM",
      date: "2024-01-17",
      attendees: 8,
      location: "Conference Room B",
      meetingType: "in-person",
      status: "confirmed",
    },
    {
      id: 5,
      title: "Offer Discussion - Robert Taylor",
      type: "offer",
      startTime: "11:00 AM",
      endTime: "11:30 AM",
      date: "2024-01-17",
      candidate: "Robert Taylor",
      interviewer: "Jessica Brown",
      position: "Data Scientist",
      location: "HR Office",
      meetingType: "in-person",
      status: "confirmed",
    },
  ];

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .slice(0, 5);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "screening":
        return "bg-green-100 text-green-800 border-green-200";
      case "final":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "meeting":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "offer":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "in-person":
        return <MapPin className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(2024, 0, i - 6); // January 2024 calendar
    return date;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">
            Schedule interviews, meetings, and track all your appointments.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter Events
          </Button>
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
                <DialogDescription>
                  Create a new interview, meeting, or appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Type</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interview">
                          Technical Interview
                        </SelectItem>
                        <SelectItem value="screening">
                          Phone Screening
                        </SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                        <SelectItem value="meeting">Team Meeting</SelectItem>
                        <SelectItem value="offer">Offer Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Meeting Type</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Event Title</Label>
                  <Input
                    placeholder="e.g. Technical Interview - John Doe"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input type="time" className="mt-1" />
                  </div>
                  <div>
                    <Label>Location/Link</Label>
                    <Input
                      placeholder="Conference Room A or Zoom link"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Participants</Label>
                  <Input
                    placeholder="Add attendees by email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes or agenda items..."
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Schedule Event</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span>January 2024</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={view === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={view === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={view === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("day")}
                  >
                    Day
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {view === "month" && (
                <div className="grid grid-cols-7 gap-2">
                  {/* Header */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center font-medium text-slate-600 text-sm"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Calendar Days */}
                  {calendarDays.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === 0; // January
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    const dayEvents = events.filter(
                      (event) =>
                        event.date === date.toISOString().split("T")[0],
                    );

                    return (
                      <div
                        key={index}
                        onClick={(e) => {
                          setSelectedDate(date);
                          setPopupDate(date);
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          setPopupPosition({ x: rect.left, y: rect.bottom });
                        }}                        className={`p-2 min-h-[80px] border rounded-md cursor-pointer hover:bg-slate-50 ${
                          !isCurrentMonth ? "text-slate-400 bg-slate-50" : ""
                        } ${isToday ? "bg-blue-50 border-blue-200" : "border-slate-200"}`}
                      >
                        <div
                          className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-1 mt-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                            >
                              {event.startTime} {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {view === "week" && (
                <div className="space-y-4">
                  {[...Array(7)].map((_, i) => {
                    const currentDate = new Date(selectedDate);
                    currentDate.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
                    const dateStr = currentDate.toISOString().split("T")[0];
                    const dailyEvents = events.filter((e) => e.date === dateStr);

                    return (
                      <div key={i}>
                        <h3 className="text-slate-800 font-medium">
                          {currentDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </h3>
                        {dailyEvents.length > 0 ? (
                          <ul className="ml-4 list-disc text-sm text-slate-700">
                            {dailyEvents.map((event) => (
                              <li key={event.id}>
                                {event.startTime} - {event.title}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-slate-400 text-sm">No events</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}


              {view === "day" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-700">
                    {selectedDate.toDateString()}
                  </h2>
                  {events
                    .filter((event) => event.date === selectedDate.toISOString().split("T")[0])
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded border ${getEventTypeColor(event.type)}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-slate-600">
                          {event.startTime} - {event.endTime} @ {event.location}
                        </div>
                      </div>
                    ))}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Events</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Interviews</span>
                  <span className="font-medium text-blue-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Meetings</span>
                  <span className="font-medium text-orange-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Free Time</span>
                  <span className="font-medium text-green-600">4 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getMeetingIcon(event.meetingType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center text-sm text-slate-600 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      {event.candidate && (
                        <div className="flex items-center text-sm text-slate-600">
                          <User className="w-3 h-3 mr-1" />
                          {event.candidate}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          View Attendees
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancel Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Types Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">Technical Interview</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm">Phone Screening</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm">Final Round</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-sm">Team Meeting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm">Offer Discussion</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Date popup overlay */}
      {popupDate && popupPosition && (
        <div
          className="absolute z-50 bg-white border border-slate-300 rounded shadow-lg p-4 w-72"
          style={{
            top: popupPosition.y + 5,
            left: popupPosition.x,
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-slate-700">
              Events on {popupDate.toDateString()}
            </h4>
            <button
              className="text-slate-500 hover:text-slate-800 text-xs"
              onClick={() => setPopupDate(null)}
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.filter(e => e.date === popupDate.toISOString().split("T")[0]).length === 0 ? (
              <p className="text-slate-400 text-sm">No events</p>
            ) : (
              events
                .filter(e => e.date === popupDate.toISOString().split("T")[0])
                .map(event => (
                  <div
                    key={event.id}
                    className={`p-2 border rounded ${getEventTypeColor(event.type)} text-sm`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-slate-600">
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="text-slate-500 text-xs">{event.location}</div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
