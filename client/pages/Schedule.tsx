import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import {
  HARDCODED_SCHEDULE,
  HARDCODED_INTERVIEWS,
  HARDCODED_USERS,
  HARDCODED_CANDIDATES,
  HARDCODED_JOBS,
  ScheduleData,
  InterviewData,
  getUser,
  getCandidate,
  getJob,
} from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";

export default function Schedule() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);

  // Combine schedule and interview data
  const allEvents = [
    ...HARDCODED_SCHEDULE.map((schedule) => ({
      ...schedule,
      eventType: "schedule" as const,
    })),
    ...HARDCODED_INTERVIEWS.map((interview) => ({
      id: interview.id,
      title: `Interview: ${interview.candidateName}`,
      description: `${interview.type} interview for ${interview.jobTitle}`,
      startDate: `${interview.scheduledDate}T${interview.scheduledTime}:00`,
      endDate: `${interview.scheduledDate}T${String(parseInt(interview.scheduledTime.split(":")[0]) + Math.floor(interview.duration / 60)).padStart(2, "0")}:${String(interview.duration % 60).padStart(2, "0")}:00`,
      type: "Interview" as const,
      attendees: [interview.candidateId, ...interview.interviewerIds],
      location: interview.location,
      meetingLink: interview.meetingLink,
      status: interview.status as any,
      relatedEntityType: "candidate" as const,
      relatedEntityId: interview.candidateId,
      createdBy: interview.createdBy,
      createdAt: interview.createdAt,
      eventType: "interview" as const,
      interviewData: interview,
    })),
  ].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const filteredEvents = allEvents.filter((event) => {
    if (filterType === "all") return true;
    if (filterType === "interviews") return event.eventType === "interview";
    if (filterType === "meetings") return event.type === "Meeting";
    if (filterType === "deadlines") return event.type === "Deadline";
    return event.type === filterType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "Rescheduled":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Interview":
        return <User className="w-4 h-4" />;
      case "Meeting":
        return <Users className="w-4 h-4" />;
      case "Deadline":
        return <AlertCircle className="w-4 h-4" />;
      case "Event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getAttendeeNames = (attendeeIds: string[]) => {
    return attendeeIds
      .map((id) => {
        const user = getUser(id);
        const candidate = getCandidate(id);
        return user?.name || candidate?.name || "Unknown";
      })
      .join(", ");
  };

  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.startDate) > new Date())
    .slice(0, 5);

  const todayEvents = filteredEvents.filter((event) => {
    const eventDate = new Date(event.startDate).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Schedule & Interviews
          </h1>
          <p className="text-slate-600 mt-1">
            Manage interviews, meetings, and important deadlines
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="interviews">Interviews</SelectItem>
              <SelectItem value="meetings">Meetings</SelectItem>
              <SelectItem value="deadlines">Deadlines</SelectItem>
            </SelectContent>
          </Select>
          <Dialog
            open={isNewEventDialogOpen}
            onOpenChange={setIsNewEventDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
                <DialogDescription>
                  Create a new interview, meeting, or event
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input placeholder="Event title" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Event description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewEventDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Event Scheduled",
                      description: "Your event has been added to the schedule",
                    });
                    setIsNewEventDialogOpen(false);
                  }}
                >
                  Schedule Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Today's Events</p>
                <p className="text-2xl font-bold">{todayEvents.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Upcoming Interviews</p>
                <p className="text-2xl font-bold">
                  {
                    HARDCODED_INTERVIEWS.filter((i) => i.status === "Scheduled")
                      .length
                  }
                </p>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">This Week</p>
                <p className="text-2xl font-bold">
                  {
                    filteredEvents.filter((event) => {
                      const eventDate = new Date(event.startDate);
                      const weekFromNow = new Date();
                      weekFromNow.setDate(weekFromNow.getDate() + 7);
                      return eventDate <= weekFromNow;
                    }).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold">
                  {
                    filteredEvents.filter(
                      (event) => event.status === "Completed",
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const { date, time } = formatDateTime(event.startDate);
                  const candidate =
                    event.eventType === "interview"
                      ? getCandidate(event.relatedEntityId!)
                      : null;
                  const job =
                    event.eventType === "interview" && candidate
                      ? getJob(candidate.jobId!)
                      : null;

                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(event.type)}
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-900 break-words">
                              {event.title}
                            </h3>
                            <Badge variant="outline">{event.type}</Badge>
                            {event.eventType === "interview" && (
                              <Badge variant="secondary">
                                {event.interviewData?.type}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{time}</span>
                            </span>
                            {event.attendees.length > 0 && (
                              <span className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{event.attendees.length} attendees</span>
                              </span>
                            )}
                            {(event.location || event.meetingLink) && (
                              <span className="flex items-center space-x-1">
                                {event.meetingLink ? (
                                  <Video className="w-3 h-3" />
                                ) : (
                                  <MapPin className="w-3 h-3" />
                                )}
                                <span>{event.location || "Video Call"}</span>
                              </span>
                            )}
                          </div>
                          {candidate && job && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Link
                                to={`/candidates/${candidate.id}`}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Candidate →
                              </Link>
                              <Link
                                to={`/jobs/${job.id}`}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Job →
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map((event) => {
                  const { date, time } = formatDateTime(event.startDate);
                  return (
                    <div key={event.id} className="flex items-center space-x-3">
                      {getTypeIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 break-words">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {date} at {time}
                        </p>
                      </div>
                      {getStatusIcon(event.status)}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Interview Types Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Technical", "Phone", "Video", "In-Person"].map((type) => {
                  const count = HARDCODED_INTERVIEWS.filter(
                    (interview) => interview.type === type,
                  ).length;
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-600">{type}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Create Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Add Event
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Set Deadline
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
