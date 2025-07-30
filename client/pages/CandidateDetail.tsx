import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import { Progress } from "@/components/ui/progress";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  ArrowLeft,
  Mail,
  MailCheck,
  Phone,
  MapPin,
  Calendar,
  Plus,
  MessageCircle,
  Video,
  User,
  FileText,
  Briefcase,
  Star,
  Activity,
  Paperclip,
  Clock,
  MoreHorizontal,
  Building2,
  GraduationCap,
  Share,
  Edit,
  Download,
  CheckCircle,
  Circle,
  Send,
  Zap,
  Target,
  Users,
  DollarSign,
  Calendar as CalendarIcon,
  AlertCircle,
  Eye,
  Forward,
  Save,
  Trash2,
  Copy,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { storage, EmailData, StageHistoryData } from "@/lib/storage";
import { CandidateData, CVEvaluationData } from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";
import {
  HARDCODED_CANDIDATES,
  HARDCODED_JOBS,
  HARDCODED_INTERVIEWS,
  getCandidate,
  getJob,
  getCandidateInterviews,
} from "@/data/hardcoded-data";
import { useLanguage } from "@/hooks/use-language";
import { EmailTrigger } from "@/components/EmailTrigger";

// Helper functions for badge styling
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Completed":
      return "default";
    case "On Hold":
      return "secondary";
    case "Withdrawn":
      return "destructive";
    default:
      return "outline";
  }
};

const getStageBadgeVariant = (stage: string) => {
  switch (stage) {
    case "Hired":
      return "default";
    case "Rejected":
      return "destructive";
    case "Offer":
      return "default";
    case "Technical":
    case "Interview":
      return "secondary";
    default:
      return "outline";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "text-red-600 bg-red-50 border-red-200";
    case "Medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Low":
      return "text-blue-600 bg-blue-50 border-blue-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

// JobApplicationCard component
const JobApplicationCard = ({ application }: { application: any }) => {
  const completedStages = application.stageHistory?.length || 0;
  const totalStages = 6; // Applied, Screening, Interview, Technical, Offer, Hired
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary group">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between sm:justify-start gap-2">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors text-base sm:text-lg flex-1 min-w-0">
                  {application.jobTitle}
                </h3>
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Application
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Export Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 mt-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1 min-w-0">
                  <Building2 className="w-3 h-3 flex-shrink-0" />
                  <span className="break-words">
                    {application.department || "Unknown Department"}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="break-words">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="break-words">{application.recruiter}</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2">
              <Badge
                className={`${getPriorityColor(application.priority || "Low")} border font-medium`}
              >
                {application.priority || "Low"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Application
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status and Stage */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={getStatusBadgeVariant(application.status)}
                className={`sm:hidden ${getPriorityColor(application.priority || "Low")} border font-medium`}
              >
                {application.priority || "Low"}
              </Badge>
              <Badge variant={getStatusBadgeVariant(application.status)}>
                <Activity className="w-3 h-3 mr-1" />
                {application.status}
              </Badge>
              <Badge variant={getStageBadgeVariant(application.currentStage)}>
                <Target className="w-3 h-3 mr-1" />
                {application.currentStage}
              </Badge>
            </div>
            {application.salary && (
              <Badge variant="outline" className="w-fit">
                <DollarSign className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Salary: </span>
                {application.salary}
              </Badge>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="text-slate-500">
                {completedStages}/{totalStages} stages
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Recent Activity */}
          {application.stageHistory && application.stageHistory.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="break-words">
                    Last updated:{" "}
                    {new Date(
                      application.stageHistory[
                        application.stageHistory.length - 1
                      ]?.startDate || "",
                    ).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 group w-fit"
                >
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                  <ArrowLeft className="w-3 h-3 group-hover:translate-x-0.5 transition-transform rotate-180" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

type StageData = {
  name: string;
  completed: boolean;
  duration: number;
  startDate: string;
  endDate?: string;
  notes?: string;
  reason?: string;
  mailSent?: boolean;
  mailConfirmed?: boolean;
};

type ActivityData = {
  id: string;
  type: "stage_change" | "note" | "email" | "call" | "interview";
  action: string;
  user: string;
  timestamp: string;
  content?: string;
  reason?: string;
  duration?: string;
};

// Utility function to convert status
function convertCandidateStatus(candidate: any): CandidateData {
  return {
    ...candidate,
    status:
      candidate.status === "Active" ||
      candidate.status === "Inactive" ||
      candidate.status === "Blacklisted"
        ? candidate.status
        : "Active", // fallback/default
  };
}

// Helper function to get candidate's jobs
function getCandidateJobs(candidate: CandidateData) {
  // Return the job applications directly from the candidate
  return candidate.jobApplications || [];
}

export default function CandidateDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();

  // State variables
  const [showStageChangeDialog, setShowStageChangeDialog] = useState(false);
  const [showEmailTrigger, setShowEmailTrigger] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [selectedCVEvaluation, setSelectedCVEvaluation] =
    useState<CVEvaluationData | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showJobProgress, setShowJobProgress] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [pendingStage, setPendingStage] = useState("");
  const [stageChangeReason, setStageChangeReason] = useState("");
  const [newNote, setNewNote] = useState("");

  // Get candidate data
  const candidate = HARDCODED_CANDIDATES.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Candidate Not Found
          </h2>
          <p className="text-slate-600">
            The candidate you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Get the primary job application for display
  const primaryJob = candidate.jobApplications[0];

  // Define stages based on the primary job
  const stages: StageData[] = [
    {
      name: "Applied",
      completed:
        primaryJob?.stageHistory?.some((s) => s.stage === "Applied") || false,
      duration:
        primaryJob?.stageHistory?.find((s) => s.stage === "Applied")
          ?.duration || 0,
      startDate: primaryJob?.appliedDate || "",
      mailSent:
        primaryJob?.emails?.some(
          (e) => e.template === "application_confirmation",
        ) || false,
      mailConfirmed:
        primaryJob?.emails?.some(
          (e) => e.template === "application_confirmation" && e.repliedAt,
        ) || false,
    },
    {
      name: "Screening",
      completed:
        primaryJob?.stageHistory?.some((s) => s.stage === "Screening") || false,
      duration:
        primaryJob?.stageHistory?.find((s) => s.stage === "Screening")
          ?.duration || 0,
      startDate:
        primaryJob?.stageHistory?.find((s) => s.stage === "Screening")
          ?.startDate || "",
      mailSent:
        primaryJob?.emails?.some(
          (e) => e.template === "screening_invitation",
        ) || false,
      mailConfirmed:
        primaryJob?.emails?.some(
          (e) => e.template === "screening_invitation" && e.repliedAt,
        ) || false,
    },
    {
      name: "Interview",
      completed:
        primaryJob?.stageHistory?.some((s) => s.stage === "Interview") || false,
      duration:
        primaryJob?.stageHistory?.find((s) => s.stage === "Interview")
          ?.duration || 0,
      startDate:
        primaryJob?.stageHistory?.find((s) => s.stage === "Interview")
          ?.startDate || "",
      mailSent:
        primaryJob?.emails?.some(
          (e) => e.template === "interview_invitation",
        ) || false,
      mailConfirmed:
        primaryJob?.emails?.some(
          (e) => e.template === "interview_invitation" && e.repliedAt,
        ) || false,
    },
    {
      name: "Technical",
      completed:
        primaryJob?.stageHistory?.some((s) => s.stage === "Technical") || false,
      duration:
        primaryJob?.stageHistory?.find((s) => s.stage === "Technical")
          ?.duration || 0,
      startDate:
        primaryJob?.stageHistory?.find((s) => s.stage === "Technical")
          ?.startDate || "",
      mailSent:
        primaryJob?.emails?.some((e) => e.template === "technical_interview") ||
        false,
      mailConfirmed:
        primaryJob?.emails?.some(
          (e) => e.template === "technical_interview" && e.repliedAt,
        ) || false,
    },
    {
      name: "Offer",
      completed:
        primaryJob?.stageHistory?.some((s) => s.stage === "Offer") || false,
      duration:
        primaryJob?.stageHistory?.find((s) => s.stage === "Offer")?.duration ||
        0,
      startDate:
        primaryJob?.stageHistory?.find((s) => s.stage === "Offer")?.startDate ||
        "",
      mailSent:
        primaryJob?.emails?.some((e) => e.template === "offer_letter") || false,
      mailConfirmed:
        primaryJob?.emails?.some(
          (e) => e.template === "offer_letter" && e.repliedAt,
        ) || false,
    },
    {
      name: "Hired",
      completed:
        primaryJob?.stageHistory?.some((s) => s.stage === "Hired") || false,
      duration:
        primaryJob?.stageHistory?.find((s) => s.stage === "Hired")?.duration ||
        0,
      startDate:
        primaryJob?.stageHistory?.find((s) => s.stage === "Hired")?.startDate ||
        "",
      mailSent:
        primaryJob?.emails?.some((e) => e.template === "welcome_email") ||
        false,
      mailConfirmed:
        primaryJob?.emails?.some(
          (e) => e.template === "welcome_email" && e.repliedAt,
        ) || false,
    },
  ];

  const currentStage = primaryJob?.currentStage || "Applied";

  // Mock activities data
  const activities: ActivityData[] = [
    {
      id: "1",
      type: "stage_change",
      action: "Moved to Technical stage",
      user: "Sarah Johnson",
      timestamp: "2 hours ago",
      reason: "Passed initial screening",
    },
    {
      id: "2",
      type: "email",
      action: "Interview invitation sent",
      user: "Sarah Johnson",
      timestamp: "1 day ago",
      content: "Technical interview scheduled for next week",
    },
    {
      id: "3",
      type: "note",
      action: "Recruiter note added",
      user: "Sarah Johnson",
      timestamp: "2 days ago",
      content: "Candidate shows strong technical skills",
    },
  ];

  const stats = [
    {
      title: "Current Stage",
      value: primaryJob?.currentStage || "Unknown",
      change: "+2 days",
      changeType: "positive" as const,
      icon: Target,
      color: "blue",
    },
    {
      title: "Days in Stage",
      value: `${primaryJob?.stageHistory?.[primaryJob.stageHistory.length - 1]?.duration || 0} days`,
      change: "+2 days",
      changeType: "positive" as const,
      icon: Clock,
      color: "green",
    },
    {
      title: "Emails Sent",
      value: `${primaryJob?.emails?.length || 0}`,
      change: "+1",
      changeType: "positive" as const,
      icon: Mail,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "email" as const,
      title: "Interview invitation sent",
      description: "Technical interview scheduled for next week",
      timestamp: "2 hours ago",
      icon: Mail,
    },
    {
      id: "2",
      type: "note" as const,
      title: "Recruiter note added",
      description: "Candidate shows strong technical skills",
      timestamp: "1 day ago",
      icon: FileText,
    },
    {
      id: "3",
      type: "stage" as const,
      title: "Moved to Technical stage",
      description: "Passed initial screening",
      timestamp: "2 days ago",
      icon: Target,
    },
  ];

  // Convert candidate stage history to StageData format
  const stageHistory =
    primaryJob?.stageHistory?.map((stage) => ({
      id: stage.id,
      stage: stage.stage,
      date: stage.startDate, // Use startDate instead of date
      duration: stage.duration,
      notes: stage.notes,
    })) || [];

  // Get candidate notes
  const candidateNotes = [
    ...(candidate.globalNotes || []),
    ...(primaryJob?.notes || []),
  ];

  // Get candidate emails
  const candidateEmails = primaryJob?.emails || [];

  // Get candidate interviews
  const candidateInterviews = getCandidateInterviews(candidate.id);

  // Use candidate emails from centralized data
  const emails = candidateEmails.map((email) => ({
    id: email.id,
    subject: email.subject,
    from: email.from,
    to: email.to,
    timestamp: email.timestamp,
    status: email.status,
    template: email.template,
    openedAt: email.openedAt,
    repliedAt: email.repliedAt,
    content: email.content || "",
  }));

  // Use candidate notes from centralized data
  const notes = candidateNotes.map((note) => ({
    id: note.id,
    content: note.content,
    userId: note.userId,
    userName: note.userName,
    timestamp: note.timestamp,
    type: note.type,
  }));

  // Use candidate interviews from centralized data
  const interviews = candidateInterviews.map((interview) => ({
    id: interview.id,
    candidateId: interview.candidateId,
    jobId: interview.jobId,
    type: interview.type,
    scheduledDate: interview.scheduledDate,
    duration: interview.duration,
    interviewer: interview.interviewerIds?.[0] || "Unknown", // Use interviewerIds instead of interviewer
    status: interview.status,
    notes: interview.notes,
    feedback: interview.feedback,
  }));

  // Mock timeline data
  const timeline = [
    {
      id: "1",
      type: "application",
      title: "Application Submitted",
      description: "Candidate applied for the position",
      timestamp: primaryJob?.appliedDate || "Unknown",
      icon: FileText,
    },
    {
      id: "2",
      type: "screening",
      title: "Initial Screening",
      description: "Resume reviewed and passed initial screening",
      timestamp: "2024-01-15",
      icon: CheckCircle,
    },
    {
      id: "3",
      type: "interview",
      title: "Technical Interview",
      description: "Technical interview scheduled",
      timestamp: "2024-01-20",
      icon: Users,
    },
  ];

  // Mock email templates
  const emailTemplates = [
    {
      id: "interview_invitation",
      name: "Interview Invitation",
      subject: "Interview Invitation - {position}",
      body: "Dear {candidate_name},\n\nWe are pleased to invite you for an interview...",
    },
    {
      id: "offer_letter",
      name: "Offer Letter",
      subject: "Job Offer - {position}",
      body: "Dear {candidate_name},\n\nWe are delighted to offer you the position...",
    },
  ];

  const handleStageChange = () => {
    // Simplified stage change handler
    toast({
      title: "Stage Change",
      description: "Stage change functionality would be implemented here.",
    });
  };

  const suggestEmailOnStageChange = (stage: string) => {
    let template = "";
    let subject = "";

    switch (stage) {
      case "Interview":
        template = "interview_invitation";
        subject = `Interview Invitation - ${primaryJob?.jobTitle || "Position"}`;
        break;
      case "Offer":
        template = "offer_letter";
        subject = `Job Offer - ${primaryJob?.jobTitle || "Position"}`;
        break;
      case "Rejected":
        template = "rejection_notice";
        subject = `Thank you for your application - ${primaryJob?.jobTitle || "Position"}`;
        break;
    }

    if (template) {
      toast({
        title: "Email Suggested",
        description: `Would you like to send a ${stage.toLowerCase()} email to ${candidate.name}?`,
      });
    }
  };

  const handleTemplateSelect = (template: string) => {
    // Handle template selection logic
    console.log("Template selected:", template);
  };

  const StatusTracker = () => {
    const currentStageIndex = stages.findIndex(
      (stage) => stage.name === currentStage,
    );
    const completedStages = stages.filter((s) => s.completed).length;
    const totalStages = stages.length;

    return (
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">Application Progress</span>
              <HelpTooltip content={helpContent.effortTime} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Update Stage
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {stages.map((stage) => (
                  <DropdownMenuItem
                    key={stage.name}
                    onClick={() => {
                      setNewStage(stage.name);
                      setShowStageChangeDialog(true);
                    }}
                    disabled={stage.name === currentStage}
                  >
                    {stage.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Overall Progress
              </span>
              <span className="text-sm text-slate-500">
                {completedStages} of {totalStages} stages
              </span>
            </div>
            <Progress
              value={(completedStages / totalStages) * 100}
              className="h-2"
            />
          </div>

          {/* Current Stage Highlight */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Circle className="w-5 h-5 fill-current text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-blue-900 break-words">
                  Current: {currentStage}
                </h4>
                <p className="text-sm text-blue-700 text-wrap">
                  {stages.find((s) => s.name === currentStage)?.notes ||
                    "Stage in progress"}
                </p>
              </div>
            </div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((stage, index) => (
              <div key={stage.name} className="text-center relative">
                <div className="flex justify-center mb-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {stage.mailSent ? (
                          stage.mailConfirmed ? (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          ) : (
                            <MailCheck className="w-4 h-4 text-green-500" />
                          )
                        ) : (
                          <Mail className="w-4 h-4 text-slate-300" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {stage.mailSent ? (
                          stage.mailConfirmed ? (
                            <p>Email sent and confirmed by recipient</p>
                          ) : (
                            <p>Email sent, waiting for confirmation</p>
                          )
                        ) : (
                          <p>Email not sent</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Circle stage */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mx-auto mb-2 ${
                    stage.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : index === currentStageIndex
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {stage.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : index === currentStageIndex ? (
                    <Circle className="w-4 h-4 fill-current" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>

                {/* Stage name */}
                <div className="text-xs font-medium text-slate-700 break-words px-1">
                  {stage.name}
                </div>

                {/* Duration nếu có */}
                {stage.duration > 0 && (
                  <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="break-words">{stage.duration}d</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stage Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 break-words block">
                  Total Time:{" "}
                  {stages.reduce((acc, stage) => acc + stage.duration, 0)} days
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Target className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 break-words block">
                  Current: {currentStage} (
                  {stages.find((s) => s.name === currentStage)?.duration || 0}{" "}
                  days)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 break-words block">
                  {completedStages} of {totalStages} completed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CandidateInfoPanel = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Candidate Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Avatar className="w-16 h-16 mx-auto sm:mx-0">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-lg">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 break-words">
                  {candidate.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 text-wrap">
                  {candidate.experience} Experience
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                  {/* Rating removed */}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowEditProfileDialog(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadResume()}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShareProfile()}>
                  <Share className="w-4 h-4 mr-2" />
                  Share Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm break-words">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm break-words">{candidate.phone}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm break-words">{candidate.location}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <GraduationCap className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm break-words">
                Experience: {candidate.experience}
              </span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm break-words">
                Recruiter: {primaryJob?.recruiter || "Unknown"}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="break-words max-w-full"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="break-words max-w-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Resume Preview */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
              Resume Preview
              <HelpTooltip content="Click to view the full resume document" />
            </h4>
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="w-8 h-8 text-slate-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm break-words">
                      {candidate.resume}
                    </p>
                    <p className="text-xs text-slate-500 break-words">
                      PDF Document
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => setShowResumePreview(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>

          {/* CV Evaluation Section */}
          {candidate.cvEvaluations && candidate.cvEvaluations.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                CV Evaluation
                <HelpTooltip content="AI-powered analysis of candidate's CV" />
              </h4>
              <div className="space-y-3">
                {candidate.cvEvaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            evaluation.finalVerdict === "Good Fit"
                              ? "bg-green-500"
                              : evaluation.finalVerdict === "Needs Improvement"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {evaluation.finalVerdict}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {evaluation.jobFitScore}% match
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCVEvaluation(evaluation)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {evaluation.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {evaluation.strengths
                        .slice(0, 2)
                        .map((strength, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {strength}
                          </Badge>
                        ))}
                      {evaluation.strengths.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{evaluation.strengths.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            Send Email
            <HelpTooltip content={helpContent.template} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <Button
            className="w-full justify-start text-sm"
            onClick={() => setShowEmailTrigger(true)}
          >
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="break-words">Compose Email</span>
          </Button>

          <div className="pt-3 sm:pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
              Quick Templates
              <HelpTooltip content={helpContent.template} />
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  handleTemplateSelect("interview_invitation");
                  setShowEmailTrigger(true);
                }}
              >
                <span className="break-words">Interview Invitation</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  handleTemplateSelect("offer_letter");
                  setShowEmailTrigger(true);
                }}
              >
                <span className="break-words">Offer Letter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  handleTemplateSelect("rejection_notice");
                  setShowEmailTrigger(true);
                }}
              >
                <span className="break-words">Rejection Notice</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const JobsPanel = () => {
    const candidateJobs = getCandidateJobs(candidate);
    const selectedJob = candidateJobs.find((job) => job.id === selectedJobId);

    return (
      <div className="lg:col-span-2 order-1 lg:order-2">
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger
              value="applications"
              className="text-xs sm:text-sm px-2 py-2"
            >
              <span className="hidden sm:inline">Job Applications</span>
              <span className="sm:hidden">Jobs</span>
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="text-xs sm:text-sm px-2 py-2"
            >
              <span className="hidden sm:inline">Education & Experience</span>
              <span className="sm:hidden">Experience</span>
            </TabsTrigger>
            <TabsTrigger
              value="evaluations"
              className="text-xs sm:text-sm px-2 py-2"
            >
              <span className="hidden sm:inline">CV Evaluations</span>
              <span className="sm:hidden">CV Eval</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Active Applications ({candidate.jobApplications.length})
                  </span>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply to New Job
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.jobApplications.map((application) => (
                    <JobApplicationCard
                      key={application.id}
                      application={application}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-4 border-l-primary pl-4"
                    >
                      <h4 className="font-medium text-slate-900">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-slate-500">
                        Graduated: {edu.graduationYear}{" "}
                        {edu.gpa && `• GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.workExperience.map((work) => (
                    <div
                      key={work.id}
                      className="border-l-4 border-l-secondary pl-4"
                    >
                      <h4 className="font-medium text-slate-900">
                        {work.position}
                      </h4>
                      <p className="text-sm text-slate-600">{work.company}</p>
                      <p className="text-sm text-slate-500">
                        {work.startDate} - {work.endDate || "Present"}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        {work.description}
                      </p>
                      {work.achievements && work.achievements.length > 0 && (
                        <ul className="text-sm text-slate-600 mt-2 list-disc list-inside">
                          {work.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CV Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.cvEvaluations &&
                candidate.cvEvaluations.length > 0 ? (
                  <div className="space-y-4">
                    {candidate.cvEvaluations.map((evaluation) => (
                      <div
                        key={evaluation.id}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                evaluation.finalVerdict === "Good Fit"
                                  ? "bg-green-500"
                                  : evaluation.finalVerdict ===
                                      "Needs Improvement"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <span className="font-medium">
                              {evaluation.finalVerdict}
                            </span>
                            <Badge variant="outline">
                              {evaluation.jobFitScore}% match
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCVEvaluation(evaluation)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {evaluation.summary}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {evaluation.strengths
                            .slice(0, 3)
                            .map((strength, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {strength}
                              </Badge>
                            ))}
                          {evaluation.strengths.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{evaluation.strengths.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">
                      No CV evaluations available
                    </p>
                    <Button className="mt-4" size="sm">
                      Start CV Evaluation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const handleStageChangeRequest = () => {
    // Called when user clicks 'Update Stage' in dialog
    setShowStageChangeDialog(false);
    setPendingStage(newStage);
    setShowEmailTrigger(true); // Open EmailTrigger for double check
  };

  const handleEmailSentOrSkipped = () => {
    // Simplified email sent handler
    setPendingStage("");
    setShowEmailTrigger(false);
    setStageChangeReason("");
    toast({
      title: "Email Sent",
      description: `Email has been sent to ${candidate.name}.`,
    });
  };

  const handleDownloadResume = () => {
    // Create a mock download
    const link = document.createElement("a");
    link.href = `/files/resumes/${candidate.resume}`;
    link.download = candidate.resume;
    link.click();

    toast({
      title: "Download Started",
      description: `Downloading ${candidate.resume}`,
    });
  };

  const handleDownloadAttachment = (attachment: any) => {
    // Create a mock download
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();

    toast({
      title: "Download Started",
      description: `Downloading ${attachment.name}`,
    });
  };

  const handleShareProfile = () => {
    // Copy profile link to clipboard
    const profileUrl = `${window.location.origin}/candidates/${candidate.id}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast({
        title: "Profile Link Copied",
        description: "Profile URL copied to clipboard",
      });
    });
  };

  const handleSaveProfile = () => {
    // Mock save functionality
    toast({
      title: "Profile Updated",
      description: "Candidate profile has been successfully updated",
    });
    setShowEditProfileDialog(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/candidates">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Candidate Profile
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                View candidate information and manage job applications
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-slate-600">{candidate.source}</span>
              <HelpTooltip content={helpContent.source} />
            </Badge>
            <Badge
              variant="default"
              className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start"
            >
              {getCandidateJobs(candidate).length} Job Applications
            </Badge>
          </div>
        </div>
      </div>

      {/* Responsive Layout */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Left Panel - Candidate Info */}
        <div className="lg:col-span-4">
          <CandidateInfoPanel />
        </div>

        {/* Center Panel - Jobs and Progress */}
        <div className="lg:col-span-8">
          <JobsPanel />
        </div>
      </div>

      {/* Stage Change Dialog */}
      <Dialog
        open={showStageChangeDialog}
        onOpenChange={setShowStageChangeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Candidate Stage</DialogTitle>
            <DialogDescription>
              {newStage &&
                `Moving candidate to ${newStage} stage. Please provide a reason for this change.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Reason for stage change
              </label>
              <Textarea
                placeholder="Explain why you're moving this candidate to the next stage..."
                value={stageChangeReason}
                onChange={(e) => setStageChangeReason(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStageChangeDialog(false);
                  setStageChangeReason("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleStageChangeRequest}>Update Stage</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Evaluation Dialog */}
      <Dialog
        open={!!selectedCVEvaluation}
        onOpenChange={() => setSelectedCVEvaluation(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              CV Evaluation Details
              <Badge
                variant={
                  selectedCVEvaluation?.finalVerdict === "Good Fit"
                    ? "default"
                    : selectedCVEvaluation?.finalVerdict === "Needs Improvement"
                      ? "secondary"
                      : "destructive"
                }
              >
                {selectedCVEvaluation?.finalVerdict}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Analysis for {selectedCVEvaluation?.fileName} •{" "}
              {selectedCVEvaluation?.jobFitScore}% job fit score
            </DialogDescription>
          </DialogHeader>
          {selectedCVEvaluation && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm text-slate-600">
                  {selectedCVEvaluation.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {selectedCVEvaluation.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-600 flex items-start gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {selectedCVEvaluation.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-600 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills Match</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCVEvaluation.skillsMatch.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          skill.hasSkill ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm break-words">{skill.skill}</span>
                      {skill.hasSkill && skill.level && (
                        <Badge variant="outline" className="text-xs">
                          {skill.level}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {selectedCVEvaluation.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCVEvaluation.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    {selectedCVEvaluation.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resume Preview Dialog */}
      <Dialog open={showResumePreview} onOpenChange={setShowResumePreview}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
            <DialogDescription>{candidate.resume}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 rounded-lg p-4 min-h-[60vh] flex items-center justify-center">
            <div className="text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="mb-2">Resume Preview</p>
              <p className="text-sm">PDF viewer would be integrated here</p>
              <Button className="mt-4" onClick={() => handleDownloadResume()}>
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={showEditProfileDialog}
        onOpenChange={setShowEditProfileDialog}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Candidate Profile</DialogTitle>
            <DialogDescription>
              Update candidate information and details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input defaultValue={candidate.name} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={candidate.email} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input defaultValue={candidate.phone} />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input defaultValue={candidate.location} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Position</label>
              <Input defaultValue={primaryJob?.jobTitle || "No Position"} />
            </div>
            <div>
              <label className="text-sm font-medium">Experience</label>
              <Input defaultValue={candidate.experience} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEditProfileDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleSaveProfile()}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog
        open={!!selectedEmail}
        onOpenChange={() => setSelectedEmail(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <DialogDescription>
              Sent on {selectedEmail?.timestamp}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <strong>From:</strong> {selectedEmail?.from}
            </p>
            <p className="text-sm text-slate-600 whitespace-pre-line">
              {selectedEmail?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Trigger Modal */}
      {candidate && (
        <EmailTrigger
          isOpen={showEmailTrigger}
          onClose={() => setShowEmailTrigger(false)}
          candidate={candidate}
          newStage={pendingStage}
          jobTitle={primaryJob?.jobTitle || "Unknown Position"}
          onEmailSent={handleEmailSentOrSkipped}
        />
      )}
    </div>
  );
}
