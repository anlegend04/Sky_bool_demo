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
import {
  storage,
  CandidateData,
  EmailData,
  StageHistoryData,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { HARDCODED_CANDIDATES, EMAIL_TEMPLATES } from "@/data/hardcoded-data";
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
          status: hardcodedCandidate.status as string,
          emails: hardcodedCandidate.emails.map((email) => ({
            ...email,
            status:
              email.status === "pending"
                ? "sent"
                : (email.status as "sent" | "draft" | "failed"),
          })),
        };

        setCandidate(convertedCandidate);
        setCurrentStage(convertedCandidate.stage);
      } else {
        // Try localStorage
        const storageCandidate = storage.getCandidate(id);
        if (storageCandidate) {
          setCandidate(storageCandidate);
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

  // Enhanced demo stages data
  const stages: StageData[] = [
    {
      name: "Applied",
      completed: true,
      duration: 1,
      startDate: "2024-01-15",
      endDate: "2024-01-16",
      notes:
        "Application received via LinkedIn. Strong profile match with required skills.",
      mailSent: true,
    },
    {
      name: "Screening",
      completed: true,
      duration: 3,
      startDate: "2024-01-16",
      endDate: "2024-01-19",
      notes:
        "Initial screening call completed. Excellent communication skills and cultural fit.",
      mailSent: true,
    },
    {
      name: "Interview",
      completed: false,
      duration: 5,
      startDate: "2024-01-19",
      notes:
        "Scheduled for panel interview on Jan 25th. Technical assessment completed successfully.",
      mailSent: true,
      mailConfirmed: true,
    },
    {
      name: "Technical",
      completed: false,
      duration: 0,
      startDate: "",
      notes:
        "Technical round pending - coding challenge and system design discussion.",
      mailSent: false,
      mailConfirmed: false,
    },
    {
      name: "Offer",
      completed: false,
      duration: 0,
      startDate: "",
      notes: "Final offer stage - salary negotiation and benefits discussion.",
      mailSent: false,
      mailConfirmed: false,
    },
    {
      name: "Hired",
      completed: false,
      duration: 0,
      startDate: "",
      notes: "Onboarding and start date coordination.",
      mailSent: false,
      mailConfirmed: false,
    },
  ];

  // Enhanced demo activities data
  const activities = [
    {
      id: 1,
      type: "stage_change",
      action: "Moved to Interview stage",
      user: "Alex Chen",
      timestamp: "2024-01-19 10:30 AM",
      reason:
        "Passed initial screening successfully with strong technical background",
      content:
        "Candidate demonstrated excellent problem-solving skills during screening call.",
    },
    {
      id: 2,
      type: "note",
      action: "Added detailed note",
      user: "Sarah Kim",
      timestamp: "2024-01-18 2:15 PM",
      content:
        "Great cultural fit, strong technical background. Portfolio shows impressive React projects. Recommended for technical interview.",
    },
    {
      id: 3,
      type: "email",
      action: "Sent interview invitation",
      user: "Alex Chen",
      timestamp: "2024-01-17 9:00 AM",
      content:
        "Interview invitation sent with calendar link and preparation materials.",
    },
    {
      id: 4,
      type: "call",
      action: "Phone screening completed",
      user: "Alex Chen",
      timestamp: "2024-01-16 3:30 PM",
      duration: "45 minutes",
      content:
        "Discussed technical background, career goals, and company culture. Very positive impression.",
    },
    {
      id: 5,
      type: "interview",
      action: "Technical assessment scheduled",
      user: "Sarah Kim",
      timestamp: "2024-01-20 11:00 AM",
      content:
        "Scheduled technical round with senior developers for Jan 25th, 2:00 PM.",
    },
    {
      id: 6,
      type: "note",
      action: "Resume review completed",
      user: "Mike Wilson",
      timestamp: "2024-01-15 4:45 PM",
      content:
        "Resume shows strong React/TypeScript experience. Previous work at top tech companies is impressive.",
    },
  ];

  // Enhanced demo email history
  const emailHistory: EmailData[] = [
    {
      id: "email_1",
      subject: "Interview Invitation - Senior Product Manager",
      content:
        "Hi Marissa, Thank you for your interest in the Senior Product Manager position. We would like to invite you for an interview on January 25th at 2:00 PM. Please find the calendar invitation attached. We'll be discussing your background, technical skills, and how you approach product challenges. Looking forward to meeting you!",
      from: "alex.chen@company.com",
      to: candidate.email,
      timestamp: "2024-01-17 9:00 AM",
      status: "sent",
      template: "interview_invitation",
    },
    {
      id: "email_2",
      subject: "Application Received - Senior Product Manager",
      content:
        "Thank you for applying to our Senior Product Manager position. We have received your application and will review it shortly. You can expect to hear from us within 3-5 business days. In the meantime, feel free to explore our company culture and values on our website.",
      from: "noreply@company.com",
      to: candidate.email,
      timestamp: "2024-01-15 2:30 PM",
      status: "sent",
      template: "application_received",
    },
    {
      id: "email_3",
      subject: "Technical Assessment Details",
      content:
        "Hi Marissa, Following our successful initial interview, we'd like to proceed with the technical assessment. This will include a coding challenge and system design discussion. Please find the assessment materials attached. You have 48 hours to complete this. Good luck!",
      from: "sarah.kim@company.com",
      to: candidate.email,
      timestamp: "2024-01-20 3:15 PM",
      status: "sent",
      template: "technical_assessment",
    },
  ];

  const emailTemplates = EMAIL_TEMPLATES;

  const handleStageChange = () => {
    if (!candidate) return;

    const updatedCandidate = storage.updateCandidate(candidate.id, {
      stage: newStage,
    });

    if (updatedCandidate) {
      setCandidate(updatedCandidate);
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
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </DropdownMenuItem>
                <DropdownMenuItem>
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
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
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
      setCandidate(updatedCandidate);
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
              Moving candidate to {newStage} stage. Please provide a reason for
              this change.
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

      {/* Email Trigger Modal */}
      <EmailTrigger
        isOpen={showEmailTrigger}
        onClose={handleEmailSentOrSkipped}
        candidate={candidate}
        newStage={pendingStage}
        jobTitle={candidate.position}
        onEmailSent={handleEmailSentOrSkipped}
      />
    </div>
  );
}
