import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  MoreHorizontal,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCheck,
  Eye,
  ExternalLink,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HARDCODED_NOTIFICATIONS,
  NotificationData,
} from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [notifications] = useState<NotificationData[]>(HARDCODED_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Notifications loaded from hardcoded data

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.read) ||
      (statusFilter === "unread" && !notification.read);

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = [
    {
      title: "Total Notifications",
      value: notifications.length.toString(),
      color: "blue",
      icon: Bell,
    },
    {
      title: "Unread",
      value: notifications.filter((n) => !n.read).length.toString(),
      color: "red",
      icon: AlertTriangle,
    },
    {
      title: "Today",
      value: notifications
        .filter((n) => {
          const today = new Date().toDateString();
          return new Date(n.timestamp).toDateString() === today;
        })
        .length.toString(),
      color: "green",
      icon: Clock,
    },
    {
      title: "This Week",
      value: notifications
        .filter((n) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(n.timestamp) > weekAgo;
        })
        .length.toString(),
      color: "purple",
      icon: Calendar,
    },
  ];

  const handleMarkAsRead = (notificationId: string) => {
    // In a real app, this would mark notification as read
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const getNotificationIcon = (type: NotificationData["type"]) => {
    switch (type) {
      case "candidate_moved":
        return <User className="w-5 h-5 text-blue-600" />;
      case "interview_scheduled":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "application_received":
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case "budget_exceeded":
        return <DollarSign className="w-5 h-5 text-red-600" />;
      case "deadline_approaching":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationTypeBadge = (type: NotificationData["type"]) => {
    switch (type) {
      case "candidate_moved":
        return <Badge variant="secondary">Candidate Update</Badge>;
      case "interview_scheduled":
        return <Badge variant="default">Interview</Badge>;
      case "application_received":
        return <Badge variant="outline">Application</Badge>;
      case "budget_exceeded":
        return <Badge variant="destructive">Budget Alert</Badge>;
      case "deadline_approaching":
        return <Badge variant="secondary">Deadline</Badge>;
      default:
        return <Badge variant="destructive">Unknown Type</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString();
  };

  const NotificationCard = ({
    notification,
  }: {
    notification: NotificationData;
  }) => (
    <Card
      className={`hover:shadow-md transition-shadow ${!notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`text-sm font-medium ${!notification.read ? "text-slate-900" : "text-slate-700"}`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{formatTimestamp(notification.timestamp)}</span>
                  {getNotificationTypeBadge(notification.type)}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Read
                    </DropdownMenuItem>
                  )}
                  {notification.actionUrl && (
                    <Link to={notification.actionUrl}>
                      <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Full
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {notification.actionUrl && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to={notification.actionUrl}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View {notification.entityType === "job" ? "Job" : "Candidate"}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">
            Stay updated with system notifications and important updates.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="candidate_moved">
                    Candidate Update
                  </SelectItem>
                  <SelectItem value="interview_scheduled">Interview</SelectItem>
                  <SelectItem value="application_received">
                    Application
                  </SelectItem>
                  <SelectItem value="budget_exceeded">Budget Alert</SelectItem>
                  <SelectItem value="deadline_approaching">Deadline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No notifications found
              </h3>
              <p className="text-slate-600">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "You're all caught up! No new notifications."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {filteredNotifications.length > 20 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
