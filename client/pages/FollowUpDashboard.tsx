import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  Check,
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
  X,
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
  Settings,
  Edit,
  Download,
  UserPlus,
  Activity,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  HARDCODED_CANDIDATES,
  type CandidateData,
} from "@/data/hardcoded-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmailTrigger } from "@/components/EmailTrigger";
import {
  EmailTemplate,
  ConfirmationStatus,
  StageTracking,
  createStageTracking,
  createConfirmationStatus,
  checkOverdueStatus
} from "@/lib/email-utils";

// Các type definitions giữ nguyên như trước
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
  // Add computed properties for backward compatibility
  position: string;
  stage: string;
  appliedDate: string;
  recruiter: string;
  salary: string;
  department: string;
  // New fields for confirmation tracking
  stageTracking?: StageTracking;
  confirmationStatus?: ConfirmationStatus;
  autoRejected?: boolean;
  overdue?: boolean;
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



interface Job {
  id: string;
  position: string;
}

export default function FollowUpDashboard() {
  const { toast } = useToast();

  // Mock job data
  const jobs: Job[] = [
    { id: "job1", position: "Software Engineer" },
    { id: "job2", position: "Product Manager" },
    { id: "job3", position: "Data Scientist" },
  ];

  // Cập nhật trạng thái visibleFields để chỉ hiển thị các field liên quan đến follow-up stage
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    stage: true,
    daysInStage: true,
    lastInteraction: true,
    nextFollowUp: true,
    urgencyLevel: true,
    appliedDate: false,
    email: false,
    phone: false,
    position: false,
    recruiter: false,
    source: false,
    salary: false,
    location: false,
    department: false,
  });

  // State cho job application dialog
  const [applyCandidateId, setApplyCandidateId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // State cho EmailTrigger
  const [showEmailTrigger, setShowEmailTrigger] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    candidate: FollowUpCandidate;
    newStage: string;
  } | null>(null);

  // Transform candidates to FollowUpCandidate format
  const [candidates, setCandidates] = useState<FollowUpCandidate[]>(
    HARDCODED_CANDIDATES.map((candidate, index) => {
      // Get the primary job application for this candidate
      const primaryJob = candidate.jobApplications[0];
      
      return {
        ...candidate,
        // Add computed properties for backward compatibility
        position: primaryJob?.jobTitle || "Unknown Position",
        stage: primaryJob?.currentStage || "Applied",
        appliedDate: primaryJob?.appliedDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recruiter: primaryJob?.recruiter || "Unknown Recruiter",
        salary: primaryJob?.salary || "$0 - $0",
        department: primaryJob?.department || "Unknown Department",
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
            subject: "Interview Invitation - " + (primaryJob?.jobTitle || "Position"),
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
      };
    }),
  );

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"pipeline" | "list" | "timeline">(
    "list",
  );
  const [filterStage, setFilterStage] = useState("all");
  const [filterJob, setFilterJob] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10);
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<FollowUpCandidate | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<number | null>(null);
  const [bulkAction, setBulkAction] = useState("");

  // Handle send email
  const handleSendEmail = (candidate: FollowUpCandidate) => {
    console.log("Sending email to:", candidate.name);
    toast({
      title: "Email sent",
      description: `Email sent to ${candidate.name}.`,
    });
  };

  // Handle schedule call
  const handleScheduleCall = (candidate: FollowUpCandidate) => {
    console.log("Scheduling call with:", candidate.name);
    toast({
      title: "Call scheduled",
      description: `Call scheduled with ${candidate.name}.`,
    });
  };

  // Handle add note
  const handleAddNote = (candidate: FollowUpCandidate) => {
    console.log("Adding note for:", candidate.name);
    toast({
      title: "Note added",
      description: `Note added for ${candidate.name}.`,
    });
  };

  // Handle stage change with email trigger
  const handleStageChange = (candidate: FollowUpCandidate, newStage: string) => {
    // Set pending stage change and show EmailTrigger
    setPendingStageChange({ candidate, newStage });
    setShowEmailTrigger(true);
  };

  // Handle email sent or skipped from EmailTrigger
  const handleConfirmationResponse = (candidateId: string, confirmed: boolean) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((c) =>
        c.id === candidateId && c.confirmationStatus ? {
          ...c,
          confirmationStatus: {
            ...c.confirmationStatus,
            confirmed,
            confirmedDate: new Date().toISOString(),
            overdue: false,
            autoRejected: false,
          },
          overdue: false,
          autoRejected: false,
        } : c
      )
    );

    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      toast({
        title: "Confirmation Updated",
        description: `${candidate.name} ${confirmed ? 'confirmed' : 'rejected'} the ${candidate.confirmationStatus?.type || 'request'}.`,
      });
    }
  };

  const handleEmailSentOrSkipped = (emailData?: any) => {
    if (pendingStageChange) {
      const { candidate, newStage } = pendingStageChange;
      
      // Create stage tracking and confirmation status based on the new stage
      let stageTracking: StageTracking | undefined;
      let confirmationStatus: ConfirmationStatus | undefined;
      
      // Set up stage-specific tracking and confirmation requirements
      switch (newStage.toLowerCase()) {
        case "applied":
          stageTracking = createStageTracking("applied", 5);
          break;
        case "interview":
          stageTracking = createStageTracking("interview", 7);
          stageTracking.confirmationRequired = true;
          confirmationStatus = createConfirmationStatus("interview", 3);
          break;
        case "technical":
          stageTracking = createStageTracking("technical", 7);
          stageTracking.confirmationRequired = false;
          // Technical stage doesn't require confirmation but has deadline
          break;
        case "offer":
          stageTracking = createStageTracking("offer", 5);
          stageTracking.confirmationRequired = true;
          confirmationStatus = createConfirmationStatus("offer", 5);
          break;
        case "hired":
          stageTracking = createStageTracking("hired", 0);
          stageTracking.confirmationRequired = false;
          break;
        default:
          stageTracking = createStageTracking(newStage.toLowerCase(), 5);
      }
      
      // Update the candidate's stage in the main candidates list
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c.id === candidate.id ? {
            ...c,
            stage: newStage,
            stageTracking,
            confirmationStatus,
            autoRejected: false,
            overdue: false,
            // Update email history if email was sent
            ...(emailData && {
              emailsSent: c.emailsSent + 1,
              lastEmailSent: new Date().toISOString(),
              emailHistory: [
                ...c.emailHistory,
                {
                  id: `email_${Date.now()}`,
                  subject: emailData.subject || "Stage Update Email",
                  template: emailData.template || "stage_update",
                  sentDate: new Date().toISOString(),
                  opened: false,
                  responded: false,
                }
              ]
            })
          } : c
        )
      );
      
      // In a real app, this would be an API call
      const currentStage = candidate.stage || "Unknown";
      console.log(`Moving candidate ${candidate.name} from ${currentStage} to ${newStage}`);
      
      // Show success message
      if (emailData) {
        toast({
          title: "Stage updated & Email sent",
          description: `${candidate.name} moved to ${newStage} stage and email sent.`,
        });
      } else {
        toast({
          title: "Stage updated",
          description: `${candidate.name} moved to ${newStage} stage.`,
        });
      }
    }
    
    // Reset state
    setPendingStageChange(null);
    setShowEmailTrigger(false);
  };

  // Email templates (giữ nguyên)
  const emailTemplates: EmailTemplate[] = [
    {
      id: 1,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}}",
      content: "Dear {{candidate_name}},\n\nWe would like to invite you for an interview for the {{job_title}} position.\n\nBest regards,\n{{recruiter_name}}",
      type: "interview",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{recruiter_name}}"],
      requiresConfirmation: true,
      confirmationDeadline: 3,
      autoRejectOnOverdue: true,
    },
    {
      id: 2,
      name: "General Follow-up",
      subject: "Following up on your application - {{job_title}}",
      content: "Hi {{candidate_name}},\n\nI wanted to follow up on your application for the {{job_title}} role.\n\nLet me know if you have any questions.\n\nBest,\n{{recruiter_name}}",
      type: "follow-up",
      stage: "any",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{recruiter_name}}"],
      requiresConfirmation: false,
      confirmationDeadline: 5,
      autoRejectOnOverdue: false,
    },
    {
      id: 3,
      name: "Offer Letter",
      subject: "Job Offer - {{job_title}}",
      content: "Dear {{candidate_name}},\n\nWe are pleased to offer you the position of {{job_title}}.\n\nPlease review the attached offer details.\n\nBest regards,\n{{recruiter_name}}",
      type: "offer",
      stage: "offer",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{recruiter_name}}"],
      requiresConfirmation: true,
      confirmationDeadline: 5,
      autoRejectOnOverdue: true,
    },
  ];

  // Filter and search logic (giữ nguyên)
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

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate,
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStage, filterJob, filterUrgency]);

  // Check for overdue confirmations and update candidates
  useEffect(() => {
    const checkOverdueConfirmations = () => {
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) => {
          if (!candidate.confirmationStatus) return candidate;
          
          const updatedConfirmationStatus = checkOverdueStatus(candidate.confirmationStatus);
          
          // If candidate is overdue and should be auto-rejected
          if (updatedConfirmationStatus.autoRejected && !candidate.autoRejected) {
            return {
              ...candidate,
              confirmationStatus: updatedConfirmationStatus,
              autoRejected: true,
              overdue: true,
              stage: "Rejected", // Auto-reject by moving to rejected stage
            };
          }
          
          return {
            ...candidate,
            confirmationStatus: updatedConfirmationStatus,
            overdue: updatedConfirmationStatus.overdue,
          };
        })
      );
    };

    // Check every hour for overdue confirmations
    const interval = setInterval(checkOverdueConfirmations, 60 * 60 * 1000);
    
    // Initial check
    checkOverdueConfirmations();
    
    return () => clearInterval(interval);
  }, []);

  // Statistics (giữ nguyên)
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

  // Handlers (giữ nguyên)
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
    (templateId: number, candidateIds: string[]) => {
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

  const applyCandidateToJob = useCallback(
    (candidateId: string, jobId: string) => {
      const candidate = candidates.find((c) => c.id === candidateId);
      const job = jobs.find((j) => j.id === jobId);
      if (candidate && job) {
        toast({
          title: "Application Submitted",
          description: `${candidate.name} applied to ${job.position}`,
        });
      }
    },
    [candidates, jobs, toast],
  );

  // Candidate Card Component (giữ nguyên)
  const CandidateCard = ({ candidate }: { candidate: FollowUpCandidate }) => {
    const stages = [
      "Applied",
      "Screening",
      "Interview",
      "Technical",
      "Offer",
      "Hired",
    ];
    
    return (
    <Card
      className={`hover:shadow-lg transition-all border-l-4 cursor-pointer rounded-lg ${
        selectedCandidates.includes(candidate.id)
          ? "ring-2 ring-blue-500 bg-blue-50"
          : ""
      } border-slate-200 hover:border-blue-300 group`}
      style={{ minHeight: 80 }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
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
              <h3
                className="font-semibold text-sm group-hover:text-blue-700 transition-colors "
                title={candidate.name}
              >
                {candidate.name}
              </h3>
              {/* <p
                className="text-xs text-gray-600 line-clamp-1"
                title={candidate.email}
              >
                {candidate.email}
              </p> */}
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {candidate.stage}
                </Badge>
                {/* Show confirmation status badges */}
                {candidate.confirmationStatus && (
                  <Badge 
                    variant={candidate.confirmationStatus.confirmed === true ? "default" : 
                           candidate.confirmationStatus.confirmed === false ? "destructive" :
                           candidate.confirmationStatus.overdue ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {candidate.confirmationStatus.confirmed === true ? "Confirmed" :
                     candidate.confirmationStatus.confirmed === false ? "Rejected" :
                     candidate.confirmationStatus.overdue ? "Overdue" : "Pending"}
                  </Badge>
                )}
                {candidate.autoRejected && (
                  <Badge variant="destructive" className="text-xs">
                    Auto-Rejected
                  </Badge>
                )}
                {candidate.overdue && !candidate.autoRejected && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
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
              <Link to={`/candidates/${candidate.id}/progress`}>
                <DropdownMenuItem>
                  <Activity className="w-4 h-4 mr-2" />
                  View Process of Stage
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => handleSendEmail(candidate)}>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScheduleCall(candidate)}>
                <Phone className="w-4 h-4 mr-2" />
                Schedule Call
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNote(candidate)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              {/* Confirmation actions */}
              {candidate.confirmationStatus && candidate.confirmationStatus.confirmed === null && (
                <>
                  <DropdownMenuItem onClick={() => handleConfirmationResponse(candidate.id, true)}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Confirmed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleConfirmationResponse(candidate.id, false)}>
                    <X className="w-4 h-4 mr-2" />
                    Mark as Rejected
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={() => {
                  const currentStage = candidate.stage || "Applied";
                  const nextStageIndex =
                    stages.findIndex((s) => s === currentStage) + 1;
                  if (nextStageIndex < stages.length) {
                    handleStageChange(candidate, stages[nextStageIndex]);
                  }
                }}
                disabled={
                  stages.findIndex((s) => s === (candidate.stage || "Applied")) ===
                  stages.length - 1
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Move to Next Stage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-xs text-slate-600 min-w-0">
          <Building className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="break-words">{candidate.department || "No Department"}</span>
        </div>
        <div className="flex items-center text-xs text-slate-600 min-w-0">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {candidate.daysInStage} days in stage
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            {/* Rating removed */}
          </div>
          <Badge
            variant="outline"
            className="text-xs line-clamp-1 max-w-20"
            title={candidate.recruiter || "No Recruiter"}
          >
            {candidate.recruiter || "No Recruiter"}
          </Badge>
        </div>
        <div className="flex space-x-1 mt-2">
          <Select
            value={candidate.stage || "Applied"}
            onValueChange={(value) => handleStageChange(candidate, value)}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage} className="text-xs">
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
    );
  };

  // Pipeline View Component (giữ nguyên)
  const PipelineView = () => {
    const stages = [
      "Applied",
      "Screening",
      "Interview",
      "Technical",
      "Offer",
      "Hired",
    ];

    const [candidatesPerStage, setCandidatesPerStage] = useState<
      Record<string, number>
    >({});

    const showMoreCandidates = (stage: string) => {
      setCandidatesPerStage((prev) => ({
        ...prev,
        [stage]: (prev[stage] || 5) + 5,
      }));
    };

    const getStageColor = (stage: string) => {
      switch (stage) {
        case "Applied":
          return "bg-blue-50 border-blue-200";
        case "Screening":
          return "bg-yellow-50 border-yellow-200";
        case "Interview":
          return "bg-purple-50 border-purple-200";
        case "Technical":
          return "bg-orange-50 border-orange-200";
        case "Offer":
          return "bg-green-50 border-green-200";
        case "Hired":
          return "bg-emerald-50 border-emerald-200";
        default:
          return "bg-slate-50 border-slate-200";
      }
    };

    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter(
            (c) => c.stage === stage,
          );
          const maxVisible = candidatesPerStage[stage] || 5;
          const visibleCandidates = stageCandidates.slice(0, maxVisible);
          const hasMore = stageCandidates.length > maxVisible;

          return (
            <div
              key={stage}
              className={`rounded-xl border shadow-sm min-w-[260px] flex-1 flex flex-col transition-all ${getStageColor(stage)}`}
              style={{ maxWidth: 340 }}
            >
              <div className="flex items-center justify-between mb-4 p-4 pb-2 border-b border-slate-100">
                <h3 className="font-semibold text-base text-slate-900 break-words flex-1">
                  {stage}
                </h3>
                <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
                  {stageCandidates.length}
                </Badge>
              </div>
              <div className="space-y-3 px-4 pb-4 pt-2 min-h-[180px] relative flex-1">
                {stageCandidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-8">
                    <svg
                      className="w-8 h-8 mb-2 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    No candidates
                  </div>
                ) : (
                  <>
                    {visibleCandidates.map((candidate) => (
                      <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                    {hasMore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={() => showMoreCandidates(stage)}
                      >
                        Show {stageCandidates.length - maxVisible} More
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Cập nhật Pipeline List View Component
  const PipelineListView = () => {
    const applyCandidate = candidates.find((c) => c.id === applyCandidateId);

    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields.name && <TableHead>Name</TableHead>}
                  {visibleFields.stage && <TableHead>Current Stage</TableHead>}
                  {visibleFields.daysInStage && (
                    <TableHead>Days in Stage</TableHead>
                  )}
                  {visibleFields.lastInteraction && (
                    <TableHead>Last Interaction</TableHead>
                  )}
                  {visibleFields.nextFollowUp && (
                    <TableHead>Next Follow-Up</TableHead>
                  )}
                  {visibleFields.urgencyLevel && (
                    <TableHead>Urgency Level</TableHead>
                  )}
                  {visibleFields.appliedDate && (
                    <TableHead>Applied On</TableHead>
                  )}
                  {visibleFields.email && <TableHead>Email</TableHead>}
                  {visibleFields.phone && <TableHead>Phone</TableHead>}
                  {visibleFields.position && (
                    <TableHead>Job Position</TableHead>
                  )}
                  {visibleFields.recruiter && <TableHead>Recruiter</TableHead>}
                  {visibleFields.source && <TableHead>Source</TableHead>}
                  {visibleFields.salary && <TableHead>Salary</TableHead>}
                  {visibleFields.location && <TableHead>Location</TableHead>}
                  {visibleFields.department && (
                    <TableHead>Department</TableHead>
                  )}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-slate-50">
                    {visibleFields.name && (
                      <TableCell>
                        <Link
                          to={`/candidates/${candidate.id}`}
                          className="flex items-center space-x-3 hover:text-blue-600 min-w-0"
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback className="text-xs">
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium break-words">
                              {candidate.name}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {/* Rating removed */}
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                    )}
                    {visibleFields.stage && (
                      <TableCell>
                        <Badge
                          variant={
                            candidate.stage === "Offer"
                              ? "default"
                              : candidate.stage === "Hired"
                                ? "default"
                                : candidate.stage === "Technical"
                                  ? "secondary"
                                  : candidate.stage === "Interview"
                                    ? "outline"
                                    : candidate.stage === "Screening"
                                      ? "secondary"
                                      : candidate.stage === "Applied"
                                        ? "outline"
                                        : "destructive"
                          }
                          className="break-words max-w-24"
                        >
                          {candidate.stage}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleFields.daysInStage && (
                      <TableCell className="break-words max-w-32">
                        {candidate.daysInStage} days
                      </TableCell>
                    )}
                    {visibleFields.lastInteraction && (
                      <TableCell className="break-words max-w-32">
                        {formatTimeAgo(candidate.lastInteraction)}
                      </TableCell>
                    )}
                    {visibleFields.nextFollowUp && (
                      <TableCell className="break-words max-w-32">
                        {formatTimeAgo(candidate.nextFollowUp)}
                      </TableCell>
                    )}
                    {visibleFields.urgencyLevel && (
                      <TableCell>
                        <Badge
                          className={`break-words max-w-24 ${getUrgencyColor(
                            candidate.urgencyLevel,
                          )}`}
                        >
                          {candidate.urgencyLevel}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleFields.appliedDate && (
                      <TableCell className="break-words max-w-32">
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </TableCell>
                    )}
                    {visibleFields.email && (
                      <TableCell className="break-words max-w-48">
                        {candidate.email}
                      </TableCell>
                    )}
                    {visibleFields.phone && (
                      <TableCell className="break-words max-w-32">
                        {candidate.phone}
                      </TableCell>
                    )}
                    {visibleFields.position && (
                      <TableCell className="break-words max-w-40">
                        {candidate.position}
                      </TableCell>
                    )}
                    {visibleFields.recruiter && (
                      <TableCell className="break-words max-w-32">
                        {candidate.recruiter}
                      </TableCell>
                    )}
                    {visibleFields.source && (
                      <TableCell className="break-words max-w-32">
                        {candidate.source}
                      </TableCell>
                    )}
                    {visibleFields.salary && (
                      <TableCell className="break-words max-w-32">
                        {candidate.salary}
                      </TableCell>
                    )}
                    {visibleFields.location && (
                      <TableCell className="break-words max-w-40">
                        {candidate.location}
                      </TableCell>
                    )}
                    {visibleFields.department && (
                      <TableCell className="break-words max-w-40">
                        {candidate.department}
                      </TableCell>
                    )}
                    <TableCell>
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
                          {/* <DropdownMenuItem
                            onClick={() => setApplyCandidateId(candidate.id)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Apply to Job
                          </DropdownMenuItem> */}
                          <Link to={`/candidates/${candidate.id}`}>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/candidates/${candidate.id}/progress`}>
                            <DropdownMenuItem>
                              <Activity className="w-4 h-4 mr-2" />
                              View Process of Stage
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Edit Candidate",
                                description: `Editing ${candidate.name}`,
                              });
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Candidate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Downloading CV",
                                description: `Downloading CV for ${candidate.name}`,
                              });
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download CV
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              open={!!applyCandidateId}
              onOpenChange={(open) => !open && setApplyCandidateId(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply to Job</DialogTitle>
                  <DialogDescription>
                    Select a job to apply candidate:{" "}
                    <strong>{applyCandidate?.name}</strong>
                  </DialogDescription>
                </DialogHeader>
                <Select onValueChange={(value) => setSelectedJobId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setApplyCandidateId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (applyCandidateId && selectedJobId) {
                        applyCandidateToJob(applyCandidateId, selectedJobId);
                        setApplyCandidateId(null);
                        setSelectedJobId(null);
                      }
                    }}
                    disabled={!selectedJobId}
                  >
                    Apply
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Phần còn lại của component giữ nguyên
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
          {/* <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Follow-up
          </Button> */}
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
            <div className="flex items-center space-x-2">
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "pipeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("pipeline")}
                >
                  Pipeline
                </Button>
              </div>
              {viewMode === "list" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Fields
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {Object.entries(visibleFields).map(([field, visible]) => (
                      <DropdownMenuCheckboxItem
                        key={field}
                        checked={visible}
                        onCheckedChange={(checked) =>
                          setVisibleFields((prev) => ({
                            ...prev,
                            [field]: checked,
                          }))
                        }
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
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
      {viewMode === "list" && <PipelineListView />}
      {viewMode === "timeline" && (
        <Card>

          <CardContent>
            <div className="space-y-4">
              {currentCandidates.map((candidate) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2 py-1">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
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
              <Select 
                value={emailTemplate?.toString() || ""} 
                onValueChange={(value) => setEmailTemplate(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
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
                    {emailTemplates.find((t) => t.id === emailTemplate)?.content}
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

      {/* Email Trigger Modal */}
      {pendingStageChange && (
        <EmailTrigger
          isOpen={showEmailTrigger}
          onClose={() => {
            setShowEmailTrigger(false);
            setPendingStageChange(null);
          }}
          candidate={pendingStageChange.candidate}
          newStage={pendingStageChange.newStage}
          jobTitle={pendingStageChange.candidate.position}
          onEmailSent={handleEmailSentOrSkipped}
        />
      )}
    </div>
  );
}
