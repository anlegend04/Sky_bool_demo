import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Timer,
  TrendingUp,
  User,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  Star,
  AlertCircle,
  Calendar as CalendarIcon,
  Archive,
  Edit3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  HARDCODED_CANDIDATES,
  type CandidateData,
} from "@/data/hardcoded-data";

// Extended types for follow-up dashboard
interface FollowUpCandidate extends CandidateData {
  lastInteraction: string;
  nextFollowUp: string;
  daysInStage: number;
  emailsSent: number;
  lastEmailSent?: string;
  responseRate: number;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  upcomingActions: FollowUpAction[];
  interactions: Interaction[];
  emailHistory: EmailRecord[];
}

interface FollowUpAction {
  id: string;
  type: "email" | "call" | "meeting" | "review";
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  template?: string;
  completed: boolean;
}

interface Interaction {
  id: string;
  type: "call" | "email" | "meeting" | "note";
  date: string;
  duration?: number;
  summary: string;
  outcome: "positive" | "neutral" | "negative";
  nextAction?: string;
}

interface EmailRecord {
  id: string;
  subject: string;
  template: string;
  sentDate: string;
  opened: boolean;
  responded: boolean;
  responseDate?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  stage: string;
  variables: string[];
}

export default function FollowUpDashboard() {
  const { toast } = useToast();

  // Mock data transformation
  const [candidates] = useState<FollowUpCandidate[]>(
    HARDCODED_CANDIDATES.map((candidate, index) => ({
      ...candidate,
      lastInteraction: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      nextFollowUp: new Date(
        Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      daysInStage: Math.floor(Math.random() * 14) + 1,
      emailsSent: Math.floor(Math.random() * 5) + 1,
      lastEmailSent:
        Math.random() > 0.3
          ? new Date(
              Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000,
            ).toISOString()
          : undefined,
      responseRate: Math.floor(Math.random() * 100),
      urgencyLevel: ["low", "medium", "high", "critical"][
        Math.floor(Math.random() * 4)
      ] as any,
      upcomingActions: [
        {
          id: `action-${index}-1`,
          type: "email",
          title: "Send interview confirmation",
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          priority: "high",
          template: "interview_confirmation",
          completed: false,
        },
      ],
      interactions: [
        {
          id: `int-${index}-1`,
          type: "call",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 15,
          summary: "Discussed role requirements and candidate expectations",
          outcome: "positive",
          nextAction: "Send technical assessment",
        },
      ],
      emailHistory: [
        {
          id: `email-${index}-1`,
          subject: "Interview Invitation - " + candidate.position,
          template: "interview_invitation",
          sentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          opened: Math.random() > 0.3,
          responded: Math.random() > 0.5,
          responseDate:
            Math.random() > 0.5
              ? new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
              : undefined,
        },
      ],
    })),
  );

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"pipeline" | "list" | "timeline">(
    "pipeline",
  );
  const [filterStage, setFilterStage] = useState("all");
  const [filterJob, setFilterJob] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<FollowUpCandidate | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [bulkAction, setBulkAction] = useState("");

  // Email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: "interview_invitation",
      name: "Interview Invitation",
      subject: "Interview Invitation - {{position}}",
      body: "Dear {{name}},\n\nWe would like to invite you for an interview for the {{position}} position.\n\nBest regards,\n{{recruiter}}",
      stage: "Interview",
      variables: ["name", "position", "recruiter"],
    },
    {
      id: "follow_up",
      name: "General Follow-up",
      subject: "Following up on your application - {{position}}",
      body: "Hi {{name}},\n\nI wanted to follow up on your application for the {{position}} role.\n\nLet me know if you have any questions.\n\nBest,\n{{recruiter}}",
      stage: "Any",
      variables: ["name", "position", "recruiter"],
    },
    {
      id: "offer_letter",
      name: "Offer Letter",
      subject: "Job Offer - {{position}}",
      body: "Dear {{name}},\n\nWe are pleased to offer you the position of {{position}}.\n\nPlease review the attached offer details.\n\nBest regards,\n{{recruiter}}",
      stage: "Offer",
      variables: ["name", "position", "recruiter"],
    },
  ];

  // Filter and search logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage =
        filterStage === "all" ||
        candidate.stage.toLowerCase() === filterStage.toLowerCase();
      const matchesJob =
        filterJob === "all" ||
        candidate.position.toLowerCase().includes(filterJob.toLowerCase());
      const matchesUrgency =
        filterUrgency === "all" || candidate.urgencyLevel === filterUrgency;

      return matchesSearch && matchesStage && matchesJob && matchesUrgency;
    });
  }, [candidates, searchTerm, filterStage, filterJob, filterUrgency]);

  // Statistics
  const stats = useMemo(() => {
    const total = candidates.length;
    const needingFollowUp = candidates.filter(
      (c) =>
        new Date(c.nextFollowUp) <= new Date(Date.now() + 24 * 60 * 60 * 1000),
    ).length;
    const overdue = candidates.filter((c) => c.daysInStage > 7).length;
    const activeToday = candidates.filter((c) =>
      c.upcomingActions.some((a) => !a.completed),
    ).length;

    return { total, needingFollowUp, overdue, activeToday };
  }, [candidates]);

  // Handlers
  const handleCandidateSelect = useCallback((candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedCandidates(filteredCandidates.map((c) => c.id));
  }, [filteredCandidates]);

  const handleBulkAction = useCallback(
    (action: string) => {
      if (selectedCandidates.length === 0) {
        toast({
          title: "No candidates selected",
          description: "Please select candidates to perform bulk actions.",
          variant: "destructive",
        });
        return;
      }

      switch (action) {
        case "email":
          setShowEmailDialog(true);
          break;
        case "move_stage":
          toast({
            title: "Moving candidates",
            description: `Moving ${selectedCandidates.length} candidates to next stage.`,
          });
          break;
        case "add_note":
          setShowNoteDialog(true);
          break;
        default:
          break;
      }
    },
    [selectedCandidates, toast],
  );

  const sendEmail = useCallback(
    (templateId: string, candidateIds: string[]) => {
      const template = emailTemplates.find((t) => t.id === templateId);
      if (!template) return;

      toast({
        title: "Emails sent",
        description: `Sent "${template.name}" to ${candidateIds.length} candidate(s).`,
      });

      setShowEmailDialog(false);
      setSelectedCandidates([]);
    },
    [emailTemplates, toast],
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - then.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Candidate Card Component
  const CandidateCard = ({ candidate }: { candidate: FollowUpCandidate }) => (
    <Card
      className={`hover:shadow-lg transition-all cursor-pointer ${
        selectedCandidates.includes(candidate.id)
          ? "ring-2 ring-blue-500 bg-blue-50"
          : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={selectedCandidates.includes(candidate.id)}
              onCheckedChange={() => handleCandidateSelect(candidate.id)}
              className="mt-1"
            />
            <Avatar className="w-10 h-10">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-sm truncate">
                  {candidate.name}
                </h3>
                <Badge
                  className={`text-xs ${getUrgencyColor(candidate.urgencyLevel)}`}
                >
                  {candidate.urgencyLevel}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {candidate.position}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {candidate.stage}
                </Badge>
                <span className="text-xs text-gray-500">
                  {candidate.daysInStage}d in stage
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedCandidate(candidate)}>
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="w-4 h-4 mr-2" />
                Schedule Call
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit3 className="w-4 h-4 mr-2" />
                Add Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Last Interaction */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Last contact:</span>
          <span className="font-medium">
            {formatTimeAgo(candidate.lastInteraction)}
          </span>
        </div>

        {/* Next Follow-up */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Next follow-up:</span>
          <span
            className={`font-medium ${
              new Date(candidate.nextFollowUp) <= new Date()
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {new Date(candidate.nextFollowUp) <= new Date()
              ? "Overdue"
              : formatTimeAgo(candidate.nextFollowUp)}
          </span>
        </div>

        {/* Response Rate */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Response rate</span>
            <span className="font-medium">{candidate.responseRate}%</span>
          </div>
          <Progress value={candidate.responseRate} className="h-2" />
        </div>

        {/* Upcoming Actions */}
        {candidate.upcomingActions.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs text-gray-500">Next action:</span>
            <div className="flex items-center space-x-2">
              {candidate.upcomingActions[0].type === "email" && (
                <Mail className="w-3 h-3 text-blue-500" />
              )}
              {candidate.upcomingActions[0].type === "call" && (
                <Phone className="w-3 h-3 text-green-500" />
              )}
              {candidate.upcomingActions[0].type === "meeting" && (
                <Calendar className="w-3 h-3 text-purple-500" />
              )}
              <span className="text-xs font-medium truncate">
                {candidate.upcomingActions[0].title}
              </span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2 border-t">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Mail className="w-3 h-3 mr-1" />
            Email
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <ArrowRight className="w-3 h-3 mr-1" />
            Move
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Pipeline View Component
  const PipelineView = () => {
    const stages = [
      "Applied",
      "Screening",
      "Interview",
      "Technical",
      "Offer",
      "Hired",
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter(
            (c) => c.stage === stage,
          );

          return (
            <div key={stage} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{stage}</h3>
                <Badge variant="outline">{stageCandidates.length}</Badge>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stageCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Follow-Up Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage candidate progress across the hiring pipeline
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Sync Calendar
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Email Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Follow-up
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Need Follow-up</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.needingFollowUp}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </p>
              </div>
              <Timer className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeToday}
                </p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "pipeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("pipeline")}
                >
                  Pipeline
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                >
                  Timeline
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCandidates.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCandidates.length} candidate(s) selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleBulkAction("email")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("move_stage")}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Move Stage
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("add_note")}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCandidates([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === "pipeline" && <PipelineView />}

      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}

      {viewMode === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCandidates.slice(0, 10).map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center space-x-4 p-3 border rounded-lg"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {candidate.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {candidate.stage}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Last contact {formatTimeAgo(candidate.lastInteraction)} •
                      Next follow-up {formatTimeAgo(candidate.nextFollowUp)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
            <DialogDescription>
              Send email to {selectedCandidates.length} selected candidate(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Email Template</Label>
              <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {emailTemplate && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Preview:</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Subject:</strong>{" "}
                    {
                      emailTemplates.find((t) => t.id === emailTemplate)
                        ?.subject
                    }
                  </div>
                  <div>
                    <strong>Body:</strong>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">
                    {emailTemplates.find((t) => t.id === emailTemplate)?.body}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => sendEmail(emailTemplate, selectedCandidates)}
              disabled={!emailTemplate}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Emails
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Candidate Profile Dialog */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedCandidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedCandidate.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedCandidate.position}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Days in stage:</span>
                          <span className="font-medium">
                            {selectedCandidate.daysInStage}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Emails sent:</span>
                          <span className="font-medium">
                            {selectedCandidate.emailsSent}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response rate:</span>
                          <span className="font-medium">
                            {selectedCandidate.responseRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Urgency level:</span>
                          <Badge
                            className={getUrgencyColor(
                              selectedCandidate.urgencyLevel,
                            )}
                          >
                            {selectedCandidate.urgencyLevel}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedCandidate.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedCandidate.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedCandidate.location}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-3">
                    {selectedCandidate.interactions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className="flex space-x-3 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {interaction.type === "call" && (
                            <Phone className="w-5 h-5 text-green-500" />
                          )}
                          {interaction.type === "email" && (
                            <Mail className="w-5 h-5 text-blue-500" />
                          )}
                          {interaction.type === "meeting" && (
                            <Calendar className="w-5 h-5 text-purple-500" />
                          )}
                          {interaction.type === "note" && (
                            <FileText className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {interaction.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(interaction.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {interaction.summary}
                          </p>
                          {interaction.nextAction && (
                            <p className="text-sm text-blue-600 mt-1">
                              Next: {interaction.nextAction}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="emails" className="space-y-4">
                  <div className="space-y-3">
                    {selectedCandidate.emailHistory.map((email) => (
                      <div key={email.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{email.subject}</span>
                          <div className="flex items-center space-x-2">
                            {email.opened && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {email.responded && (
                              <MessageSquare className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(email.sentDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs ${email.opened ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {email.opened ? "Opened" : "Not opened"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${email.responded ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {email.responded ? "Responded" : "No response"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col">
                      <Mail className="w-6 h-6 mb-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Phone className="w-6 h-6 mb-2" />
                      Schedule Call
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Calendar className="w-6 h-6 mb-2" />
                      Book Meeting
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <ArrowRight className="w-6 h-6 mb-2" />
                      Move Stage
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
