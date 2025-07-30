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
  EMAIL_TEMPLATES,
  getCandidate,
  getCandidateTimeline,
} from "@/data/hardcoded-data";
import { EmailTrigger } from "@/components/EmailTrigger";

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

export default function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [currentStage, setCurrentStage] = useState("Interview");
  const [newNote, setNewNote] = useState("");
  const [showStageChangeDialog, setShowStageChangeDialog] = useState(false);
  const [showEmailTrigger, setShowEmailTrigger] = useState(false); // NEW
  const [pendingStage, setPendingStage] = useState(""); // NEW
  const [pendingReason, setPendingReason] = useState(""); // NEW
  const [stageChangeReason, setStageChangeReason] = useState("");
  const [newStage, setNewStage] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedCVEvaluation, setSelectedCVEvaluation] =
    useState<CVEvaluationData | null>(null);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const { toast } = useToast();

  // Load candidate from hardcoded data or localStorage
  useEffect(() => {
    if (id) {
      // First try to get from hardcoded data
      const hardcodedCandidate = HARDCODED_CANDIDATES.find((c) => c.id === id);

      if (hardcodedCandidate) {
        // Convert hardcoded data to storage format
        const convertedCandidate: CandidateData = {
          ...hardcodedCandidate,
          status: hardcodedCandidate.status,
          emails: hardcodedCandidate.emails.map((email) => ({
            ...email,
            status:
              (email.status as any) === "draft" ? "failed" : email.status,
          })),
        };

        setCandidate(convertedCandidate);
        setCurrentStage(convertedCandidate.stage);
      } else {
        // Try localStorage
        const storageCandidate = storage.getCandidate(id);
        if (storageCandidate) {
          setCandidate(convertCandidateStatus(storageCandidate));
          setCurrentStage(storageCandidate.stage);
        }
      }
    }
  }, [id]);

  if (!candidate) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Candidate not found
          </h2>
          <p className="text-slate-600 mt-2">
            The candidate you're looking for doesn't exist.
          </p>
          <Link to="/candidates">
            <Button className="mt-4">Back to Candidates</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert candidate stage history to StageData format
  const stages: StageData[] = [
    {
      name: "Applied",
      completed: candidate.stageHistory.some((s) => s.stage === "Applied"),
      duration:
        candidate.stageHistory.find((s) => s.stage === "Applied")?.duration ||
        0,
      startDate:
        candidate.stageHistory.find((s) => s.stage === "Applied")?.startDate ||
        "",
      endDate: candidate.stageHistory.find((s) => s.stage === "Applied")
        ?.endDate,
      notes:
        candidate.stageHistory.find((s) => s.stage === "Applied")?.notes ||
        "Application submitted",
      mailSent:
        candidate.stageHistory.find((s) => s.stage === "Applied")?.mailSent ||
        false,
      mailConfirmed:
        candidate.stageHistory.find((s) => s.stage === "Applied")
          ?.mailConfirmed || false,
    },
    {
      name: "Screening",
      completed: candidate.stageHistory.some((s) => s.stage === "Screening"),
      duration:
        candidate.stageHistory.find((s) => s.stage === "Screening")?.duration ||
        0,
      startDate:
        candidate.stageHistory.find((s) => s.stage === "Screening")
          ?.startDate || "",
      endDate: candidate.stageHistory.find((s) => s.stage === "Screening")
        ?.endDate,
      notes:
        candidate.stageHistory.find((s) => s.stage === "Screening")?.notes ||
        "Initial screening pending",
      mailSent:
        candidate.stageHistory.find((s) => s.stage === "Screening")?.mailSent ||
        false,
      mailConfirmed:
        candidate.stageHistory.find((s) => s.stage === "Screening")
          ?.mailConfirmed || false,
    },
    {
      name: "Interview",
      completed: candidate.stageHistory.some((s) => s.stage === "Interview"),
      duration:
        candidate.stageHistory.find((s) => s.stage === "Interview")?.duration ||
        0,
      startDate:
        candidate.stageHistory.find((s) => s.stage === "Interview")
          ?.startDate || "",
      endDate: candidate.stageHistory.find((s) => s.stage === "Interview")
        ?.endDate,
      notes:
        candidate.stageHistory.find((s) => s.stage === "Interview")?.notes ||
        "Interview scheduling",
      mailSent:
        candidate.stageHistory.find((s) => s.stage === "Interview")?.mailSent ||
        false,
      mailConfirmed:
        candidate.stageHistory.find((s) => s.stage === "Interview")
          ?.mailConfirmed || false,
    },
    {
      name: "Technical",
      completed: candidate.stageHistory.some((s) => s.stage === "Technical"),
      duration:
        candidate.stageHistory.find((s) => s.stage === "Technical")?.duration ||
        0,
      startDate:
        candidate.stageHistory.find((s) => s.stage === "Technical")
          ?.startDate || "",
      endDate: candidate.stageHistory.find((s) => s.stage === "Technical")
        ?.endDate,
      notes:
        candidate.stageHistory.find((s) => s.stage === "Technical")?.notes ||
        "Technical assessment pending",
      mailSent:
        candidate.stageHistory.find((s) => s.stage === "Technical")?.mailSent ||
        false,
      mailConfirmed:
        candidate.stageHistory.find((s) => s.stage === "Technical")
          ?.mailConfirmed || false,
    },
    {
      name: "Offer",
      completed: candidate.stageHistory.some((s) => s.stage === "Offer"),
      duration:
        candidate.stageHistory.find((s) => s.stage === "Offer")?.duration || 0,
      startDate:
        candidate.stageHistory.find((s) => s.stage === "Offer")?.startDate ||
        "",
      endDate: candidate.stageHistory.find((s) => s.stage === "Offer")?.endDate,
      notes:
        candidate.stageHistory.find((s) => s.stage === "Offer")?.notes ||
        "Offer preparation",
      mailSent:
        candidate.stageHistory.find((s) => s.stage === "Offer")?.mailSent ||
        false,
      mailConfirmed:
        candidate.stageHistory.find((s) => s.stage === "Offer")
          ?.mailConfirmed || false,
    },
    {
      name: "Hired",
      completed: candidate.stageHistory.some((s) => s.stage === "Hired"),
      duration:
        candidate.stageHistory.find((s) => s.stage === "Hired")?.duration || 0,
      startDate:
        candidate.stageHistory.find((s) => s.stage === "Hired")?.startDate ||
        "",
      endDate: candidate.stageHistory.find((s) => s.stage === "Hired")?.endDate,
      notes:
        candidate.stageHistory.find((s) => s.stage === "Hired")?.notes ||
        "Onboarding",
      mailSent:
        candidate.stageHistory.find((s) => s.stage === "Hired")?.mailSent ||
        false,
      mailConfirmed:
        candidate.stageHistory.find((s) => s.stage === "Hired")
          ?.mailConfirmed || false,
    },
  ];

  // Use candidate timeline from centralized data
  type CandidateTimelineItem = {
    type: string;
    date: string;
    description: string;
    details: string;
    reason?: string;
    duration?: number;
  };
  const candidateTimeline: CandidateTimelineItem[] = getCandidateTimeline(candidate.id);
  const activities = candidateTimeline.map((item, index) => ({
    id: index + 1,
    type: item.type,
    action: item.description,
    user:
      item.type === "stage_change"
        ? candidate.stageHistory.find((s) => s.startDate === item.date)
            ?.userName || "System"
        : item.type === "email"
          ? candidate.emails.find((e) => e.timestamp === item.date)?.from ||
            "System"
          : item.type === "note"
            ? candidate.notes.find((n) => n.timestamp === item.date)
                ?.userName || "System"
            : "System",
    timestamp: new Date(item.date).toLocaleString(),
    content: item.details,
    reason: item.reason, // Add this line to include the reason property
    duration: item.duration, // Optionally add duration if used elsewhere
  }));

  // Use candidate emails from centralized data
  const emailHistory: EmailData[] = candidate.emails || [];

  const emailTemplates = EMAIL_TEMPLATES;

  const handleStageChange = () => {
    if (!candidate) return;

    const updatedCandidate = storage.updateCandidate(candidate.id, {
      stage: newStage,
    });

    if (updatedCandidate) {
      setCandidate(convertCandidateStatus(updatedCandidate));
      setCurrentStage(newStage);
      setShowStageChangeDialog(false);
      setStageChangeReason("");

      toast({
        title: "Stage Updated",
        description: `${candidate.name} has been moved to ${newStage} stage.`,
      });

      // Auto-suggest sending email on stage change
      suggestEmailOnStageChange(newStage);
    }
  };

  const suggestEmailOnStageChange = (stage: string) => {
    let template = "";
    let subject = "";

    switch (stage) {
      case "Interview":
        template = "interview_invitation";
        subject = `Interview Invitation - ${candidate.position}`;
        break;
      case "Offer":
        template = "offer_letter";
        subject = `Job Offer - ${candidate.position}`;
        break;
      case "Rejected":
        template = "rejection_notice";
        subject = `Thank you for your application - ${candidate.position}`;
        break;
    }

    if (template) {
      // setSelectedTemplate(template); // No longer needed
      // setEmailSubject(subject); // No longer needed
      // setEmailContent(emailTemplates[template] || ""); // No longer needed
      // setShowEmailDialog(true); // No longer needed

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
                <h4 className="font-medium text-blue-900 truncate">
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
                <div className="text-xs font-medium text-slate-700 truncate px-1">
                  {stage.name}
                </div>

                {/* Duration nếu có */}
                {stage.duration > 0 && (
                  <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="truncate">{stage.duration}d</span>
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
                <span className="text-sm text-slate-600 truncate block">
                  Total Time:{" "}
                  {stages.reduce((acc, stage) => acc + stage.duration, 0)} days
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Target className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 truncate block">
                  Current: {currentStage} (
                  {stages.find((s) => s.name === currentStage)?.duration || 0}{" "}
                  days)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 truncate block">
                  {completedStages} of {totalStages} completed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeftPanel = () => (
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
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {candidate.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 text-wrap">
                  {candidate.position}
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < candidate.rating
                          ? "text-yellow-400 fill-current"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
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
              <span className="text-sm truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.phone}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.location}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <Briefcase className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.position}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.department}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">
                Recruiter: {candidate.recruiter}
              </span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <DollarSign className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.salary}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <GraduationCap className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">
                Experience: {candidate.experience}
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
                  className="truncate max-w-full"
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
                  className="truncate max-w-full"
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
                    <p className="font-medium text-sm truncate">
                      {candidate.resume}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
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

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Button className="w-full justify-start text-sm" variant="outline">
              <Video className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Schedule Video Interview</span>
            </Button>
            <Button className="w-full justify-start text-sm" variant="outline">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Schedule Phone Call</span>
            </Button>
            <Button className="w-full justify-start text-sm" variant="outline">
              <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Schedule In-Person Meeting</span>
            </Button>
            <Button className="w-full justify-start text-sm" variant="outline">
              <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Send Assessment</span>
            </Button>
          </div>
          <Button
            className="w-full justify-start text-sm"
            variant="outline"
            onClick={() => setShowEmailDialog(true)}
          >
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Send Email</span>
          </Button>
        </CardContent>
      </Card> */}

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
            <span className="truncate">Compose Email</span>
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
                  setEmailSubject(
                    `Interview Invitation - ${candidate.position}`,
                  );
                  setShowEmailTrigger(true);
                }}
              >
                <span className="truncate">Interview Invitation</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  handleTemplateSelect("offer_letter");
                  setEmailSubject(`Job Offer - ${candidate.position}`);
                  setShowEmailTrigger(true);
                }}
              >
                <span className="truncate">Offer Letter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  handleTemplateSelect("rejection_notice");
                  setEmailSubject(
                    `Thank you for your application - ${candidate.position}`,
                  );
                  setShowEmailTrigger(true);
                }}
              >
                <span className="truncate">Rejection Notice</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CenterPanel = () => (
    <div className="space-y-4 sm:space-y-6">
      <StatusTracker />

      {/* Notes and Activities */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes" className="text-sm sm:text-base">
            Notes & Timeline
          </TabsTrigger>
          <TabsTrigger value="activities" className="text-sm sm:text-base">
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note about this candidate..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stage Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages
                  .filter((stage) => stage.startDate)
                  .map((stage) => (
                    <div
                      key={stage.name}
                      className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-b-0"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${stage.completed ? "bg-green-500" : "bg-blue-500"}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900">
                            {stage.name}
                          </h4>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {stage.duration} days
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {stage.startDate}{" "}
                          {stage.endDate && `- ${stage.endDate}`}
                        </p>
                        {stage.notes && (
                          <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                            {stage.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      {activity.type === "stage_change" && (
                        <Zap className="w-4 h-4 text-blue-600" />
                      )}
                      {activity.type === "note" && (
                        <FileText className="w-4 h-4 text-green-600" />
                      )}
                      {activity.type === "email" && (
                        <Mail className="w-4 h-4 text-purple-600" />
                      )}
                      {activity.type === "call" && (
                        <Phone className="w-4 h-4 text-orange-600" />
                      )}
                      {activity.type === "interview" && (
                        <Video className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900">
                          {activity.action}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        by {activity.user}
                      </p>
                      {activity.content && (
                        <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                          {activity.content}
                        </p>
                      )}
                      {activity.reason && (
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="font-medium">Reason:</span>{" "}
                          {activity.reason}
                        </p>
                      )}
                      {activity.duration && (
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="font-medium">Duration:</span>{" "}
                          {activity.duration}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const RightPanel = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Send Email Section */}

      {/* Email History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Email History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {emailHistory.map((email) => (
              <div
                key={email.id}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center justify-between mb-2 min-w-0">
                  <h4 className="font-medium text-sm text-slate-900 truncate flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-wrap">{email.subject}</span>
                    {/* <Badge
                      variant={
                        email.status === "sent" ? "default" : "secondary"
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {email.status}
                    </Badge> */}
                  </h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedEmail(email)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Full
                      </DropdownMenuItem>

                      {/* <DropdownMenuItem>
                        <Forward className="w-4 h-4 mr-2" />
                        Forward
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Resend
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-slate-600 mb-1 truncate">
                  From: {email.from}
                </p>
                <p className="text-xs text-slate-600 mb-2">{email.timestamp}</p>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {email.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm font-medium truncate">Resume.pdf</span>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  Cover_Letter.pdf
                </span>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  Portfolio.pdf
                </span>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
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
      </Card>
    </div>
  );

  const handleStageChangeRequest = () => {
    // Called when user clicks 'Update Stage' in dialog
    setShowStageChangeDialog(false);
    setPendingStage(newStage);
    setPendingReason(stageChangeReason);
    setShowEmailTrigger(true); // Open EmailTrigger for double check
  };

  const handleEmailSentOrSkipped = () => {
    // Actually update stage after email is sent or skipped
    if (!candidate) return;
    const updatedCandidate = storage.updateCandidate(candidate.id, {
      stage: pendingStage,
    });
    if (updatedCandidate) {
      setCandidate(convertCandidateStatus(updatedCandidate));
      setCurrentStage(pendingStage);
      setPendingStage("");
      setPendingReason("");
      setShowEmailTrigger(false);
      setStageChangeReason("");
      // Toast
      toast({
        title: "Stage Updated",
        description: `${candidate.name} has been moved to ${pendingStage} stage.`,
      });
    }
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
                Manage candidate information and track progress
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
              variant={
                currentStage === "Hired"
                  ? "default"
                  : currentStage === "Rejected"
                    ? "destructive"
                    : "secondary"
              }
              className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start"
            >
              {currentStage}
              <HelpTooltip content={helpContent.stage} />
            </Badge>
          </div>
        </div>
      </div>

      {/* Responsive Layout */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Left Panel - Full width on mobile, 3 columns on desktop */}
        <div className="lg:col-span-3">
          <LeftPanel />
        </div>

        {/* Center Panel - Full width on mobile, 6 columns on desktop */}
        <div className="lg:col-span-6">
          <CenterPanel />
        </div>

        {/* Right Panel - Full width on mobile, 3 columns on desktop */}
        <div className="lg:col-span-3">
          <RightPanel />
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
                      <span className="text-sm truncate">{skill.skill}</span>
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
              <Input defaultValue={candidate.position} />
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

      {/* Email Trigger Modal */}
      {candidate && (
        <EmailTrigger
          isOpen={showEmailTrigger}
          onClose={() => setShowEmailTrigger(false)}
          candidate={candidate}
          newStage={pendingStage}
          jobTitle={candidate.position}
          onEmailSent={handleEmailSentOrSkipped}
        />
      )}
    </div>
  );
}
