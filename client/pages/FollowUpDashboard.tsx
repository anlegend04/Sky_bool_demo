import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  Fragment,
} from "react";
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
  MailCheck,
  Circle,
  ChevronDown,
  ChevronUp,
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
  checkOverdueStatus,
  getTemplatesForStage,
} from "@/lib/email-utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import {
  getJobApplication,
  convertCandidateToEnhanced,
} from "@/data/enhanced-mock-data";
import {
  EnhancedCandidateData,
  JobApplication,
} from "@/types/enhanced-candidate";

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

// New interface for job application progress entries
interface JobApplicationProgress {
  id: string; // Unique ID for this progress entry (candidateId + jobId)
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAvatar: string;
  jobId: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  currentStage: string;
  recruiter: string;
  salary: string;
  location: string;
  // Follow-up specific data
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
  // Confirmation tracking
  stageTracking?: StageTracking;
  confirmationStatus?: ConfirmationStatus;
  autoRejected?: boolean;
  overdue?: boolean;
}

// Recruitment Stages Component
const RecruitmentStagesDropdown = ({
  progressEntry,
  isExpanded,
  onToggle,
}: {
  progressEntry: JobApplicationProgress;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  // Create a mock job application object for compatibility
  const mockJobApplication = {
    id: progressEntry.jobId,
    jobId: progressEntry.jobId,
    jobTitle: progressEntry.jobTitle,
    department: progressEntry.department,
    appliedDate: progressEntry.appliedDate,
    currentStage: progressEntry.currentStage as any,
    stageHistory: [], // We'll need to get this from the actual data
    notes: [],
    emails: progressEntry.emailHistory.map((email) => ({
      id: email.id,
      template: email.template,
      subject: email.subject,
      timestamp: email.sentDate,
      repliedAt: email.responseDate,
    })),
    priority: "Medium" as any,
    recruiter: progressEntry.recruiter,
    status: "Active" as any,
    salary: progressEntry.salary,
    location: progressEntry.location,
  };

  const stageNames = [
    "Applied",
    "Screening",
    "Interview",
    "Technical",
    "Offer",
    "Hired",
  ];

  const currentStageIndex = stageNames.findIndex(
    (s) => s === mockJobApplication.currentStage
  );

  const stages = stageNames.map((stageName, index) => {
    const stageData = mockJobApplication.stageHistory.find(
      (s) => s.stage === stageName
    );

    // Calculate completion status based on stage history and current stage
    const thisStageIndex = index;
    const isCompleted = stageData && stageData.endDate;
    const isCurrentStage = stageName === mockJobApplication.currentStage;
    const isPastStage = thisStageIndex < currentStageIndex;

    // Determine completion status
    let completionStatus: "completed" | "current" | "pending" | "not_started";
    if (isCompleted) {
      completionStatus = "completed";
    } else if (isCurrentStage) {
      completionStatus = "current";
    } else if (isPastStage) {
      completionStatus = "completed"; // If already passed this stage but no endDate, consider as completed
    } else {
      completionStatus = "not_started";
    }

    return {
      name: stageName,
      completed: completionStatus === "completed",
      duration: stageData?.duration || 0,
      startDate: stageData?.startDate || "",
      endDate: stageData?.endDate,
      notes: stageData?.notes || `${stageName} stage`,
      reason: stageData?.reason,
      mailSent: stageData?.mailSent || false,
      mailConfirmed: stageData?.mailConfirmed || false,
    };
  });

  return (
    <div className="border-t border-slate-100 pt-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2"></div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 bg-white border border-slate-200 rounded-lg">
          <TooltipProvider>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stages.map((stage, index) => {
                // Get all templates for this stage
                const stageTemplates = getTemplatesForStage(
                  stage.name.toLowerCase()
                );
                // Get all emails sent for this stage - improved matching logic
                const emailsForStage = mockJobApplication.emails.filter(
                  (email) => {
                    return stageTemplates.some((tpl) => {
                      const templateNameMatch = email.template === tpl.name;
                      const subjectMatch = email.subject
                        .toLowerCase()
                        .includes(tpl.name.toLowerCase());
                      const stageMatch = email.subject
                        .toLowerCase()
                        .includes(tpl.stage?.toLowerCase() || "");
                      const genericStageMatch = email.subject
                        .toLowerCase()
                        .includes(stage.name.toLowerCase());

                      return (
                        templateNameMatch ||
                        subjectMatch ||
                        stageMatch ||
                        genericStageMatch
                      );
                    });
                  }
                );
                return (
                  <div key={stage.name} className="text-center relative group">
                    {/* Email status indicators */}
                    <div className="flex justify-center mb-1 gap-1">
                      {stageTemplates.length > 0 ? (
                        stageTemplates.map((template, templateIdx) => {
                          // Find the most recent email sent for this template
                          const sentEmails = emailsForStage.filter((email) => {
                            const templateNameMatch =
                              email.template === template.name;
                            const subjectMatch = email.subject
                              .toLowerCase()
                              .includes(template.name.toLowerCase());
                            const stageMatch = email.subject
                              .toLowerCase()
                              .includes(template.stage?.toLowerCase() || "");
                            const genericStageMatch = email.subject
                              .toLowerCase()
                              .includes(stage.name.toLowerCase());

                            return (
                              templateNameMatch ||
                              subjectMatch ||
                              stageMatch ||
                              genericStageMatch
                            );
                          });
                          const latestEmail =
                            sentEmails.length > 0
                              ? sentEmails.reduce((a, b) =>
                                  new Date(a.timestamp) > new Date(b.timestamp)
                                    ? a
                                    : b
                                )
                              : undefined;
                          // Determine status
                          const sent = !!latestEmail;
                          const confirmed = latestEmail?.repliedAt
                            ? true
                            : false;
                          const sentDate = latestEmail?.timestamp;
                          const confirmedDate = latestEmail?.repliedAt;
                          // Confirmation deadline
                          let deadline: string | undefined = undefined;
                          if (template.confirmationDeadline && sentDate) {
                            const sentTime = new Date(sentDate).getTime();
                            deadline = new Date(
                              sentTime +
                                template.confirmationDeadline *
                                  24 *
                                  60 *
                                  60 *
                                  1000
                            ).toISOString();
                          }
                          // Overdue
                          const overdue =
                            template.requiresConfirmation &&
                            sent &&
                            !confirmed &&
                            deadline &&
                            new Date() > new Date(deadline);
                          const autoRejected =
                            template.autoRejectOnOverdue && overdue;
                          return (
                            <Tooltip key={templateIdx}>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  {autoRejected ? (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                  ) : overdue ? (
                                    <Clock className="w-4 h-4 text-orange-500" />
                                  ) : confirmed ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : sent ? (
                                    <MailCheck className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Mail className="w-4 h-4 text-slate-300" />
                                  )}
                                  {/* Chấm vàng nếu cần xác nhận và chưa xác nhận */}
                                  {template.requiresConfirmation &&
                                    sent &&
                                    !confirmed &&
                                    !autoRejected &&
                                    !overdue && (
                                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white"></span>
                                    )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-sm z-50 p-4"
                              >
                                <div className="space-y-3">
                                  {/* Icon Legend */}
                                  <div className="border-b border-slate-200 pb-2">
                                    <div className="font-semibold text-slate-900 text-sm mb-2">
                                      Email Status Icons:
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-slate-300" />
                                        <span>Not sent</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MailCheck className="w-3 h-3 text-blue-500" />
                                        <span>Sent</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Confirmed</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-orange-500" />
                                        <span>Overdue</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                        <span>Auto-rejected</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-yellow-400 rounded-full border border-white"></span>
                                        <span>Needs confirmation</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stage Header */}
                                  <div className="border-b border-slate-200 pb-2">
                                    <div className="font-semibold text-slate-900 text-sm mb-1">
                                      {stage.name} Stage
                                    </div>
                                    <div className="text-xs text-slate-600">
                                      {(() => {
                                        // Stage descriptions based on stage name
                                        const stageDescriptions: {
                                          [key: string]: string;
                                        } = {
                                          Applied:
                                            "Initial application received and under review",
                                          Screening:
                                            "Phone screening to assess basic qualifications",
                                          Interview:
                                            "In-depth interview with hiring team",
                                          Technical:
                                            "Technical assessment and skills evaluation",
                                          Offer:
                                            "Job offer extended and under negotiation",
                                          Hired:
                                            "Candidate successfully hired and onboarded",
                                          Rejected:
                                            "Application not selected for this position",
                                        };
                                        return (
                                          stageDescriptions[stage.name] ||
                                          `${stage.name} stage in recruitment process`
                                        );
                                      })()}
                                    </div>
                                  </div>

                                  {/* Stage Status */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-slate-600">
                                        Stage Status:
                                      </span>
                                      <span
                                        className={`font-medium ${
                                          stage.completed
                                            ? "text-green-600"
                                            : index === currentStageIndex
                                            ? "text-blue-600"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        {stage.completed
                                          ? "Completed"
                                          : index === currentStageIndex
                                          ? "Current"
                                          : "Pending"}
                                      </span>
                                    </div>

                                    {stage.duration > 0 && (
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">
                                          Duration:
                                        </span>
                                        <span className="text-slate-700">
                                          {stage.duration} days
                                        </span>
                                      </div>
                                    )}

                                    {stage.startDate && (
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">
                                          Started:
                                        </span>
                                        <span className="text-slate-700">
                                          {new Date(
                                            stage.startDate
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}

                                    {stage.endDate && (
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">
                                          Completed:
                                        </span>
                                        <span className="text-slate-700">
                                          {new Date(
                                            stage.endDate
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Email Template Details */}
                                  <div className="border-t border-slate-200 pt-2">
                                    <div className="text-xs font-medium text-slate-700 mb-2">
                                      Email: {template.name}
                                    </div>
                                    <div className="bg-slate-50 rounded p-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs font-medium text-slate-800">
                                          {(() => {
                                            try {
                                              // Provide specific descriptions for each email type
                                              const emailDescriptions: {
                                                [key: string]: string;
                                              } = {
                                                "Application Received - Thank You":
                                                  "Thank you email when application is received",
                                                "Interview Invitation":
                                                  "Interview invitation with detailed information",
                                                "Interview Reminder":
                                                  "Reminder email for interview confirmation",
                                                "Post-Interview Thank You":
                                                  "Thank you email after interview and result announcement time",
                                                "Technical Test Assignment":
                                                  "Technical test assignment email",
                                                "Technical Results":
                                                  "Technical assessment results with confirmation required",
                                                "Job Offer":
                                                  "Job offer email with acceptance confirmation required",
                                                "Onboarding Instructions":
                                                  "Onboarding instructions with confirmation required",
                                              };
                                              return (
                                                emailDescriptions[
                                                  template.name
                                                ] ||
                                                template.subject ||
                                                "Email template"
                                              );
                                            } catch (error) {
                                              return (
                                                template.subject ||
                                                "Email template"
                                              );
                                            }
                                          })()}
                                        </div>
                                        <div
                                          className={`text-xs px-2 py-1 rounded-full ${
                                            autoRejected
                                              ? "bg-red-100 text-red-700"
                                              : overdue
                                              ? "bg-orange-100 text-orange-700"
                                              : confirmed
                                              ? "bg-green-100 text-green-700"
                                              : sent
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-slate-100 text-slate-700"
                                          }`}
                                        >
                                          {autoRejected
                                            ? "Auto-Rejected"
                                            : overdue
                                            ? "Overdue"
                                            : confirmed
                                            ? "Confirmed"
                                            : sent
                                            ? "Sent"
                                            : "Required"}
                                        </div>
                                      </div>
                                      {sentDate && (
                                        <div className="text-xs text-slate-600">
                                          Sent:{" "}
                                          {new Date(
                                            sentDate
                                          ).toLocaleDateString()}
                                        </div>
                                      )}
                                      {template.requiresConfirmation &&
                                        deadline && (
                                          <div className="text-xs text-slate-600">
                                            Deadline:{" "}
                                            {new Date(
                                              deadline
                                            ).toLocaleDateString()}
                                          </div>
                                        )}
                                      {confirmedDate && (
                                        <div className="text-xs text-slate-600">
                                          Confirmed:{" "}
                                          {new Date(
                                            confirmedDate
                                          ).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Stage Notes */}
                                  {stage.notes && (
                                    <div className="border-t border-slate-200 pt-2">
                                      <div className="text-xs font-medium text-slate-700 mb-1">
                                        Notes:
                                      </div>
                                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                        {stage.notes}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })
                      ) : (
                        <Mail className="w-4 h-4 text-slate-300" />
                      )}
                    </div>

                    {/* Circle stage */}
                    {(() => {
                      // Calculate overall status for stage
                      let circleStatus:
                        | "autoRejected"
                        | "overdue"
                        | "completed"
                        | "current"
                        | "default" = "default";
                      if (stageTemplates.length > 0) {
                        // Loop through each template to determine status
                        let foundAutoRejected = false;
                        let foundOverdue = false;
                        let allConfirmed = true;
                        let hasSentEmails = false;

                        stageTemplates.forEach((template) => {
                          const sentEmails = emailsForStage.filter((email) => {
                            const templateNameMatch =
                              email.template === template.name;
                            const subjectMatch = email.subject
                              .toLowerCase()
                              .includes(template.name.toLowerCase());
                            const stageMatch = email.subject
                              .toLowerCase()
                              .includes(template.stage?.toLowerCase() || "");
                            const genericStageMatch = email.subject
                              .toLowerCase()
                              .includes(stage.name.toLowerCase());

                            return (
                              templateNameMatch ||
                              subjectMatch ||
                              stageMatch ||
                              genericStageMatch
                            );
                          });

                          const latestEmail =
                            sentEmails.length > 0
                              ? sentEmails.reduce((a, b) =>
                                  new Date(a.timestamp) > new Date(b.timestamp)
                                    ? a
                                    : b
                                )
                              : undefined;
                          const sent = !!latestEmail;
                          const confirmed = latestEmail?.repliedAt
                            ? true
                            : false;
                          const sentDate = latestEmail?.timestamp;

                          if (sent) hasSentEmails = true;

                          let deadline: string | undefined = undefined;
                          if (template.confirmationDeadline && sentDate) {
                            const sentTime = new Date(sentDate).getTime();
                            deadline = new Date(
                              sentTime +
                                template.confirmationDeadline *
                                  24 *
                                  60 *
                                  60 *
                                  1000
                            ).toISOString();
                          }

                          const overdue =
                            template.requiresConfirmation &&
                            sent &&
                            !confirmed &&
                            deadline &&
                            new Date() > new Date(deadline);
                          const autoRejected =
                            template.autoRejectOnOverdue && overdue;

                          if (autoRejected) foundAutoRejected = true;
                          if (overdue) foundOverdue = true;
                          if (
                            template.requiresConfirmation &&
                            sent &&
                            !confirmed
                          )
                            allConfirmed = false;
                        });

                        if (foundAutoRejected) circleStatus = "autoRejected";
                        else if (foundOverdue) circleStatus = "overdue";
                        else if (stage.completed) circleStatus = "completed";
                        else if (index === currentStageIndex)
                          circleStatus = "current";
                        else if (hasSentEmails) circleStatus = "completed"; // Has sent emails but not completed
                      } else {
                        // No templates, rely on stage completion
                        if (stage.completed) circleStatus = "completed";
                        else if (index === currentStageIndex)
                          circleStatus = "current";
                      }
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mx-auto mb-2 cursor-help ${
                                circleStatus === "autoRejected"
                                  ? "bg-red-500 border-red-500 text-white"
                                  : circleStatus === "overdue"
                                  ? "bg-orange-500 border-orange-500 text-white"
                                  : circleStatus === "completed"
                                  ? "bg-green-500 border-green-500 text-white"
                                  : circleStatus === "current"
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "bg-white border-slate-300 text-slate-400"
                              }`}
                            >
                              {circleStatus === "autoRejected" ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : circleStatus === "overdue" ? (
                                <Clock className="w-4 h-4" />
                              ) : circleStatus === "completed" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : circleStatus === "current" ? (
                                <Circle className="w-4 h-4 fill-current" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-2">
                              <div className="font-semibold text-sm">
                                Stage Status: {stage.name}
                              </div>
                              <div className="text-xs space-y-1">
                                {circleStatus === "autoRejected" && (
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                    <span>
                                      Auto-rejected: Candidate did not confirm
                                      within deadline
                                    </span>
                                  </div>
                                )}
                                {circleStatus === "overdue" && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-orange-500" />
                                    <span>
                                      Overdue: Waiting for candidate
                                      confirmation
                                    </span>
                                  </div>
                                )}
                                {circleStatus === "completed" && (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>
                                      Completed: Stage finished successfully
                                    </span>
                                  </div>
                                )}
                                {circleStatus === "current" && (
                                  <div className="flex items-center gap-2">
                                    <Circle className="w-3 h-3 text-blue-500 fill-current" />
                                    <span>
                                      Current: Currently in this stage
                                    </span>
                                  </div>
                                )}
                                {circleStatus === "default" && (
                                  <div className="flex items-center gap-2">
                                    <Circle className="w-3 h-3 text-slate-400" />
                                    <span>Pending: Stage not started yet</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })()}

                    {/* Stage name */}
                    <div className="text-xs font-medium text-slate-700 break-words px-1">
                      {stage.name}
                    </div>

                    {/* Duration */}
                    {stage.duration > 0 && (
                      <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span className="break-words">{stage.duration}d</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

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
    appliedDate: true,
    email: false,
    phone: false,
    position: true,
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

  // State cho Recruitment Stages dropdown
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(
    null
  );

  // Transform candidates to JobApplicationProgress format - one entry per job application
  const [progressEntries, setProgressEntries] = useState<
    JobApplicationProgress[]
  >(
    HARDCODED_CANDIDATES.flatMap((candidate, candidateIndex) => {
      return candidate.jobApplications.map((jobApp, jobIndex) => {
        const uniqueId = `${candidate.id}-${jobApp.jobId}`;

        return {
          id: uniqueId,
          candidateId: candidate.id,
          candidateName: candidate.name,
          candidateEmail: candidate.email,
          candidatePhone: candidate.phone,
          candidateAvatar: candidate.avatar,
          jobId: jobApp.jobId,
          jobTitle: jobApp.jobTitle,
          department: jobApp.department,
          appliedDate: jobApp.appliedDate,
          currentStage: jobApp.currentStage,
          recruiter: jobApp.recruiter,
          salary: jobApp.salary || "$0 - $0",
          location: jobApp.location || "Unknown",
          // Follow-up specific data
          lastInteraction: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          nextFollowUp: new Date(
            Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          daysInStage: Math.floor(Math.random() * 14) + 1,
          emailsSent: Math.floor(Math.random() * 5) + 1,
          lastEmailSent:
            Math.random() > 0.3
              ? new Date(
                  Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000
                ).toISOString()
              : undefined,
          responseRate: Math.floor(Math.random() * 100),
          urgencyLevel: ["low", "medium", "high", "critical"][
            Math.floor(Math.random() * 4)
          ] as any,
          upcomingActions: [
            {
              id: `action-${uniqueId}-1`,
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
              id: `int-${uniqueId}-1`,
              type: "call",
              date: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              duration: 15,
              summary: "Discussed role requirements and candidate expectations",
              outcome: "positive",
              nextAction: "Send technical assessment",
            },
          ],
          emailHistory: [
            {
              id: `email-${uniqueId}-1`,
              subject: "Interview Invitation - " + jobApp.jobTitle,
              template: "interview_invitation",
              sentDate: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(),
              opened: Math.random() > 0.3,
              responded: Math.random() > 0.5,
              responseDate:
                Math.random() > 0.5
                  ? new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
                  : undefined,
            },
          ],
        };
      });
    })
  );

  const [selectedProgressEntries, setSelectedProgressEntries] = useState<
    string[]
  >([]);
  const [viewMode, setViewMode] = useState<"pipeline" | "list" | "timeline">(
    "list"
  );
  const [filterStage, setFilterStage] = useState("all");
  const [filterJob, setFilterJob] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [progressEntriesPerPage] = useState(10);
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgressEntry, setSelectedProgressEntry] =
    useState<JobApplicationProgress | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<number | null>(null);
  const [bulkAction, setBulkAction] = useState("");

  // Handle send email
  const handleSendEmail = (progressEntry: JobApplicationProgress) => {
    console.log("Sending email to:", progressEntry.candidateName);
    toast({
      title: "Email sent",
      description: `Email sent to ${progressEntry.candidateName}.`,
    });
  };

  // Handle schedule call
  const handleScheduleCall = (progressEntry: JobApplicationProgress) => {
    console.log("Scheduling call with:", progressEntry.candidateName);
    toast({
      title: "Call scheduled",
      description: `Call scheduled with ${progressEntry.candidateName}.`,
    });
  };

  // Handle add note
  const handleAddNote = (progressEntry: JobApplicationProgress) => {
    console.log("Adding note for:", progressEntry.candidateName);
    toast({
      title: "Note added",
      description: `Note added for ${progressEntry.candidateName}.`,
    });
  };

  // Handle stage change with email trigger
  const handleStageChange = (
    progressEntry: JobApplicationProgress,
    newStage: string
  ) => {
    const currentStage = progressEntry.currentStage || "Applied";

    // Define the proper stage transitions and their corresponding email templates
    const stageTransitions = {
      Applied: "Screening", // Applied → Screening: Send confirmation email
      Screening: "Interview", // Screening → Interview: Send interview invitation
      Interview: "Technical", // Interview → Technical: Send interview results + technical test
      Technical: "Offer", // Technical → Offer: Send offer letter
      Offer: "Hired", // Offer → Hired: Send onboarding instructions
    };

    // Check if this is a valid stage transition
    if (stageTransitions[currentStage] === newStage) {
      // Set pending stage change and show EmailTrigger
      setPendingStageChange({ candidate: progressEntry as any, newStage });
      setShowEmailTrigger(true);
    } else {
      // Invalid transition - show warning
      toast({
        title: "Invalid Stage Transition",
        description: `Cannot move from ${currentStage} to ${newStage}. Please follow the proper recruitment flow.`,
        variant: "destructive",
      });
    }
  };

  // Handle email sent or skipped from EmailTrigger
  const handleConfirmationResponse = (
    progressEntryId: string,
    confirmed: boolean
  ) => {
    setProgressEntries((prevProgressEntries) =>
      prevProgressEntries.map((p) =>
        p.id === progressEntryId && p.confirmationStatus
          ? {
              ...p,
              confirmationStatus: {
                ...p.confirmationStatus,
                confirmed,
                confirmedDate: new Date().toISOString(),
                overdue: false,
                autoRejected: false,
              },
              overdue: false,
              autoRejected: false,
            }
          : p
      )
    );

    const progressEntry = progressEntries.find((p) => p.id === progressEntryId);
    if (progressEntry) {
      toast({
        title: "Confirmation Updated",
        description: `${progressEntry.candidateName} ${
          confirmed ? "confirmed" : "rejected"
        } the ${progressEntry.confirmationStatus?.type || "request"}.`,
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

      // Update the progress entry's stage in the main progress entries list
      setProgressEntries((prevProgressEntries) =>
        prevProgressEntries.map((p) =>
          p.id === candidate.id
            ? {
                ...p,
                currentStage: newStage,
                stageTracking,
                confirmationStatus,
                autoRejected: false,
                overdue: false,
                // Update email history if email was sent
                ...(emailData && {
                  emailsSent: p.emailsSent + 1,
                  lastEmailSent: new Date().toISOString(),
                  emailHistory: [
                    ...p.emailHistory,
                    {
                      id: `email_${Date.now()}`,
                      subject: emailData.subject || "Stage Update Email",
                      template: emailData.template || "stage_update",
                      sentDate: new Date().toISOString(),
                      opened: false,
                      responded: false,
                    },
                  ],
                }),
              }
            : p
        )
      );

      // In a real app, this would be an API call
      const currentStage = candidate.currentStage || "Unknown";
      console.log(
        `Moving progress entry ${candidate.candidateName} from ${currentStage} to ${newStage}`
      );

      // Show success message
      if (emailData) {
        toast({
          title: "Stage updated & Email sent",
          description: `${candidate.candidateName} moved to ${newStage} stage and email sent.`,
        });
      } else {
        toast({
          title: "Stage updated",
          description: `${candidate.candidateName} moved to ${newStage} stage.`,
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
      content:
        "Dear {{candidate_name}},\n\nWe would like to invite you for an interview for the {{job_title}} position.\n\nBest regards,\n{{recruiter_name}}",
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
      content:
        "Hi {{candidate_name}},\n\nI wanted to follow up on your application for the {{job_title}} role.\n\nLet me know if you have any questions.\n\nBest,\n{{recruiter_name}}",
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
      content:
        "Dear {{candidate_name}},\n\nWe are pleased to offer you the position of {{job_title}}.\n\nPlease review the attached offer details.\n\nBest regards,\n{{recruiter_name}}",
      type: "offer",
      stage: "offer",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{recruiter_name}}"],
      requiresConfirmation: true,
      confirmationDeadline: 5,
      autoRejectOnOverdue: true,
    },
  ];

  // Filter and search logic (giữ nguyên)
  const filteredProgressEntries = useMemo(() => {
    return progressEntries.filter((progressEntry) => {
      const matchesSearch =
        progressEntry.candidateName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        progressEntry.jobTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        progressEntry.candidateEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStage =
        filterStage === "all" ||
        progressEntry.currentStage.toLowerCase() === filterStage.toLowerCase();
      const matchesJob =
        filterJob === "all" ||
        progressEntry.jobTitle.toLowerCase().includes(filterJob.toLowerCase());
      const matchesUrgency =
        filterUrgency === "all" || progressEntry.urgencyLevel === filterUrgency;

      return matchesSearch && matchesStage && matchesJob && matchesUrgency;
    });
  }, [progressEntries, searchTerm, filterStage, filterJob, filterUrgency]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredProgressEntries.length / progressEntriesPerPage
  );
  const indexOfLastProgressEntry = currentPage * progressEntriesPerPage;
  const indexOfFirstProgressEntry =
    indexOfLastProgressEntry - progressEntriesPerPage;
  const currentProgressEntries = filteredProgressEntries.slice(
    indexOfFirstProgressEntry,
    indexOfLastProgressEntry
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStage, filterJob, filterUrgency]);

  // Check for overdue confirmations and update candidates
  useEffect(() => {
    const checkOverdueConfirmations = () => {
      setProgressEntries((prevProgressEntries) =>
        prevProgressEntries.map((progressEntry) => {
          if (!progressEntry.confirmationStatus) return progressEntry;

          const updatedConfirmationStatus = checkOverdueStatus(
            progressEntry.confirmationStatus
          );

          // If progress entry is overdue and should be auto-rejected
          if (
            updatedConfirmationStatus.autoRejected &&
            !progressEntry.autoRejected
          ) {
            return {
              ...progressEntry,
              confirmationStatus: updatedConfirmationStatus,
              autoRejected: true,
              overdue: true,
              currentStage: "Rejected", // Auto-reject by moving to rejected stage
            };
          }

          return {
            ...progressEntry,
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
    const total = progressEntries.length;
    const needingFollowUp = progressEntries.filter(
      (p) =>
        new Date(p.nextFollowUp) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
    ).length;
    const overdue = progressEntries.filter((p) => p.daysInStage > 7).length;
    const activeToday = progressEntries.filter((p) =>
      p.upcomingActions.some((a) => !a.completed)
    ).length;

    return { total, needingFollowUp, overdue, activeToday };
  }, [progressEntries]);

  // Handlers (giữ nguyên)
  const handleProgressEntrySelect = useCallback((progressEntryId: string) => {
    setSelectedProgressEntries((prev) =>
      prev.includes(progressEntryId)
        ? prev.filter((id) => id !== progressEntryId)
        : [...prev, progressEntryId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedProgressEntries(filteredProgressEntries.map((p) => p.id));
  }, [filteredProgressEntries]);

  const handleBulkAction = useCallback(
    (action: string) => {
      if (selectedProgressEntries.length === 0) {
        toast({
          title: "No progress entries selected",
          description:
            "Please select progress entries to perform bulk actions.",
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
            title: "Moving progress entries",
            description: `Moving ${selectedProgressEntries.length} progress entries to next stage.`,
          });
          break;
        case "add_note":
          setShowNoteDialog(true);
          break;
        default:
          break;
      }
    },
    [selectedProgressEntries, toast]
  );

  const sendEmail = useCallback(
    (templateId: number, progressEntryIds: string[]) => {
      const template = emailTemplates.find((t) => t.id === templateId);
      if (!template) return;

      toast({
        title: "Emails sent",
        description: `Sent "${template.name}" to ${progressEntryIds.length} progress entry(s).`,
      });

      setShowEmailDialog(false);
      setSelectedProgressEntries([]);
    },
    [emailTemplates, toast]
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
      (now.getTime() - then.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const applyCandidateToJob = useCallback(
    (candidateId: string, jobId: string) => {
      const progressEntry = progressEntries.find(
        (p) => p.candidateId === candidateId && p.jobId === jobId
      );
      const job = jobs.find((j) => j.id === jobId);
      if (progressEntry && job) {
        toast({
          title: "Application Submitted",
          description: `${progressEntry.candidateName} applied to ${job.position}`,
        });
      }
    },
    [progressEntries, jobs, toast]
  );

  // Progress Entry Card Component (giữ nguyên)
  const ProgressEntryCard = ({
    progressEntry,
  }: {
    progressEntry: JobApplicationProgress;
  }) => {
    const stages = [
      "Applied",
      "Screening",
      "Interview",
      "Technical",
      "Offer",
      "Hired",
    ];

    const isExpanded = expandedCandidateId === progressEntry.id;

    return (
      <Card
        className={`hover:shadow-lg transition-all border-l-4 cursor-pointer rounded-lg ${
          selectedProgressEntries.includes(progressEntry.id)
            ? "ring-2 ring-blue-500 bg-blue-50"
            : ""
        } border-slate-200 hover:border-blue-300 group`}
        style={{ minHeight: 80 }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="w-10 h-10">
                <AvatarImage src={progressEntry.candidateAvatar} />
                <AvatarFallback>
                  {progressEntry.candidateName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-sm group-hover:text-blue-700 transition-colors "
                  title={progressEntry.candidateName}
                >
                  {progressEntry.candidateName}
                </h3>
                <p
                  className="text-xs text-gray-600 line-clamp-1"
                  title={progressEntry.jobTitle}
                >
                  {progressEntry.jobTitle}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {progressEntry.currentStage}
                  </Badge>
                  {/* Show confirmation status badges */}
                  {progressEntry.confirmationStatus && (
                    <Badge
                      variant={
                        progressEntry.confirmationStatus.confirmed === true
                          ? "default"
                          : progressEntry.confirmationStatus.confirmed === false
                          ? "destructive"
                          : progressEntry.confirmationStatus.overdue
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {progressEntry.confirmationStatus.confirmed === true
                        ? "Confirmed"
                        : progressEntry.confirmationStatus.confirmed === false
                        ? "Rejected"
                        : progressEntry.confirmationStatus.overdue
                        ? "Overdue"
                        : "Pending"}
                    </Badge>
                  )}
                  {progressEntry.autoRejected && (
                    <Badge variant="destructive" className="text-xs">
                      Auto-Rejected
                    </Badge>
                  )}
                  {progressEntry.overdue && !progressEntry.autoRejected && (
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
                <DropdownMenuItem
                  onClick={() => setSelectedProgressEntry(progressEntry)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <Link
                  to={`/candidates/${progressEntry.candidateId}/progress?jobId=${progressEntry.jobId}`}
                >
                  <DropdownMenuItem>
                    <Activity className="w-4 h-4 mr-2" />
                    View Process of Stage
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => handleSendEmail(progressEntry)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleScheduleCall(progressEntry)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNote(progressEntry)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Add Note
                </DropdownMenuItem>
                {/* Confirmation actions */}
                {progressEntry.confirmationStatus &&
                  progressEntry.confirmationStatus.confirmed === null && (
                    <>
                      <DropdownMenuItem
                        onClick={() =>
                          handleConfirmationResponse(progressEntry.id, true)
                        }
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleConfirmationResponse(progressEntry.id, false)
                        }
                      >
                        <X className="w-4 h-4 mr-2" />
                        Mark as Rejected
                      </DropdownMenuItem>
                    </>
                  )}
                <DropdownMenuItem
                  onClick={() => {
                    const currentStage =
                      progressEntry.currentStage || "Applied";
                    const stageTransitions = {
                      Applied: "Screening",
                      Screening: "Interview",
                      Interview: "Technical",
                      Technical: "Offer",
                      Offer: "Hired",
                    };
                    const nextStage = stageTransitions[currentStage];
                    if (nextStage) {
                      handleStageChange(progressEntry, nextStage);
                    }
                  }}
                  disabled={
                    ![
                      "Applied",
                      "Screening",
                      "Interview",
                      "Technical",
                      "Offer",
                    ].includes(progressEntry.currentStage || "Applied")
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
            <span className="break-words">
              {progressEntry.department || "No Department"}
            </span>
          </div>
          <div className="flex items-center text-xs text-slate-600 min-w-0">
            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {progressEntry.daysInStage} days in stage
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-1">
              {/* Rating removed */}
            </div>
            <Badge
              variant="outline"
              className="text-xs line-clamp-1 max-w-20"
              title={progressEntry.recruiter || "No Recruiter"}
            >
              {progressEntry.recruiter || "No Recruiter"}
            </Badge>
          </div>
          <div className="flex space-x-1 mt-2">
            <Select
              value={progressEntry.currentStage || "Applied"}
              onValueChange={(value) => handleStageChange(progressEntry, value)}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => {
                  const currentStage = progressEntry.currentStage || "Applied";
                  const stageTransitions = {
                    Applied: "Screening",
                    Screening: "Interview",
                    Interview: "Technical",
                    Technical: "Offer",
                    Offer: "Hired",
                  };
                  const isNextStage = stageTransitions[currentStage] === stage;
                  const isCurrentStage = stage === currentStage;

                  return (
                    <SelectItem
                      key={stage}
                      value={stage}
                      className={`text-xs ${
                        isNextStage ? "font-semibold text-blue-600" : ""
                      }`}
                      disabled={!isCurrentStage && !isNextStage}
                    >
                      {stage} {isNextStage ? "(Next)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {/* Recruitment Stages Dropdown */}
        <RecruitmentStagesDropdown
          progressEntry={progressEntry}
          isExpanded={isExpanded}
          onToggle={() =>
            setExpandedCandidateId(isExpanded ? null : progressEntry.id)
          }
        />
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
        {stages.map((stage, index) => {
          const stageProgressEntries = filteredProgressEntries.filter(
            (p) => p.currentStage === stage
          );
          const maxVisible = candidatesPerStage[stage] || 5;
          const visibleProgressEntries = stageProgressEntries.slice(
            0,
            maxVisible
          );
          const hasMore = stageProgressEntries.length > maxVisible;

          return (
            <div
              key={stage}
              className={`rounded-xl border shadow-sm min-w-[260px] flex-1 flex flex-col transition-all ${getStageColor(
                stage
              )}`}
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
                    {visibleProgressEntries.map((progressEntry) => (
                      <ProgressEntryCard
                        key={progressEntry.id}
                        progressEntry={progressEntry}
                      />
                    ))}
                    {hasMore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={() => showMoreCandidates(stage)}
                      >
                        Show {stageProgressEntries.length - maxVisible} More
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
    const applyProgressEntry = progressEntries.find(
      (p) => p.id === applyCandidateId
    );

    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields.name && <TableHead>Name</TableHead>}
                  {visibleFields.stage && <TableHead>Current Stage</TableHead>}
                  {visibleFields.position && (
                    <TableHead>Job Position</TableHead>
                  )}
                  {visibleFields.appliedDate && (
                    <TableHead>Applied On</TableHead>
                  )}
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

                  {visibleFields.email && <TableHead>Email</TableHead>}
                  {visibleFields.phone && <TableHead>Phone</TableHead>}
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
                {currentProgressEntries.map((progressEntry) => {
                  const isExpanded = expandedCandidateId === progressEntry.id;
                  return (
                    <React.Fragment key={progressEntry.id}>
                      <TableRow
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() =>
                          setExpandedCandidateId(
                            isExpanded ? null : progressEntry.id
                          )
                        }
                      >
                        {visibleFields.name && (
                          <TableCell>
                            <Link
                              to={`/candidates/${progressEntry.candidateId}`}
                              className="flex items-center space-x-3 hover:text-blue-600 min-w-0"
                            >
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage
                                  src={progressEntry.candidateAvatar}
                                />
                                <AvatarFallback className="text-xs">
                                  {progressEntry.candidateName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium break-words">
                                  {progressEntry.candidateName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {progressEntry.jobTitle}
                                </div>
                              </div>
                            </Link>
                          </TableCell>
                        )}
                        {visibleFields.stage && (
                          <TableCell>
                            <Badge
                              variant={
                                progressEntry.currentStage === "Offer"
                                  ? "default"
                                  : progressEntry.currentStage === "Hired"
                                  ? "default"
                                  : progressEntry.currentStage === "Technical"
                                  ? "secondary"
                                  : progressEntry.currentStage === "Interview"
                                  ? "outline"
                                  : progressEntry.currentStage === "Screening"
                                  ? "secondary"
                                  : progressEntry.currentStage === "Applied"
                                  ? "outline"
                                  : "destructive"
                              }
                              className="break-words max-w-24"
                            >
                              {progressEntry.currentStage}
                            </Badge>
                          </TableCell>
                        )}{" "}
                        {visibleFields.position && (
                          <TableCell className="break-words max-w-40">
                            {progressEntry.jobTitle}
                          </TableCell>
                        )}
                        {visibleFields.appliedDate && (
                          <TableCell className="break-words max-w-32">
                            {new Date(
                              progressEntry.appliedDate
                            ).toLocaleDateString()}
                          </TableCell>
                        )}
                        {visibleFields.daysInStage && (
                          <TableCell className="break-words max-w-32">
                            {progressEntry.daysInStage} days
                          </TableCell>
                        )}
                        {visibleFields.lastInteraction && (
                          <TableCell className="break-words max-w-32">
                            {formatTimeAgo(progressEntry.lastInteraction)}
                          </TableCell>
                        )}
                        {visibleFields.nextFollowUp && (
                          <TableCell className="break-words max-w-32">
                            {formatTimeAgo(progressEntry.nextFollowUp)}
                          </TableCell>
                        )}
                        {visibleFields.urgencyLevel && (
                          <TableCell>
                            <Badge
                              className={`break-words max-w-24 ${getUrgencyColor(
                                progressEntry.urgencyLevel
                              )}`}
                            >
                              {progressEntry.urgencyLevel}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleFields.email && (
                          <TableCell className="break-words max-w-48">
                            {progressEntry.candidateEmail}
                          </TableCell>
                        )}
                        {visibleFields.phone && (
                          <TableCell className="break-words max-w-32">
                            {progressEntry.candidatePhone}
                          </TableCell>
                        )}
                        {visibleFields.recruiter && (
                          <TableCell className="break-words max-w-32">
                            {progressEntry.recruiter}
                          </TableCell>
                        )}
                        {visibleFields.source && (
                          <TableCell className="break-words max-w-32">
                            {/* Source not available in progress entry */}
                            N/A
                          </TableCell>
                        )}
                        {visibleFields.salary && (
                          <TableCell className="break-words max-w-32">
                            {progressEntry.salary}
                          </TableCell>
                        )}
                        {visibleFields.location && (
                          <TableCell className="break-words max-w-40">
                            {progressEntry.location}
                          </TableCell>
                        )}
                        {visibleFields.department && (
                          <TableCell className="break-words max-w-40">
                            {progressEntry.department}
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
                              <Link
                                to={`/candidates/${progressEntry.candidateId}`}
                              >
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </Link>
                              <Link
                                to={`/candidates/${progressEntry.candidateId}/progress?jobId=${progressEntry.jobId}`}
                              >
                                <DropdownMenuItem>
                                  <Activity className="w-4 h-4 mr-2" />
                                  View Process of Stage
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Edit Candidate",
                                    description: `Editing ${progressEntry.candidateName}`,
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
                                    description: `Downloading CV for ${progressEntry.candidateName}`,
                                  });
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download CV
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const currentStage =
                                    progressEntry.currentStage || "Applied";
                                  const stageTransitions = {
                                    Applied: "Screening",
                                    Screening: "Interview",
                                    Interview: "Technical",
                                    Technical: "Offer",
                                    Offer: "Hired",
                                  };
                                  const nextStage =
                                    stageTransitions[currentStage];
                                  if (nextStage) {
                                    handleStageChange(progressEntry, nextStage);
                                  }
                                }}
                                disabled={
                                  ![
                                    "Applied",
                                    "Screening",
                                    "Interview",
                                    "Technical",
                                    "Offer",
                                  ].includes(
                                    progressEntry.currentStage || "Applied"
                                  )
                                }
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Move to Next Stage
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* Recruitment Stages Dropdown Row */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              Object.values(visibleFields).filter(Boolean)
                                .length + 1
                            }
                            className="p-0"
                          >
                            <RecruitmentStagesDropdown
                              progressEntry={progressEntry}
                              isExpanded={isExpanded}
                              onToggle={() => setExpandedCandidateId(null)}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
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
                    <strong>{applyProgressEntry?.candidateName}</strong>
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
            Recruitment Process
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage candidate progress across the hiring pipeline
          </p>
          {/* <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Recruitment Flow Rules:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• <strong>Applied → Screening:</strong> Send confirmation email</div>
              <div>• <strong>Screening → Interview:</strong> Send interview invitation</div>
              <div>• <strong>Interview → Technical:</strong> Send interview results + technical test (if needed)</div>
              <div>• <strong>Technical → Offer:</strong> Send offer letter</div>
              <div>• <strong>Offer → Hired:</strong> Send onboarding instructions</div>
            </div>
          </div> */}
        </div>
        <div className="flex flex-wrap gap-3">
          {/* <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Sync Calendar
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Email Settings
          </Button> */}
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
          {selectedProgressEntries.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProgressEntries.length} progress entry(s) selected
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
                    onClick={() => setSelectedProgressEntries([])}
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
              {currentProgressEntries.map((progressEntry) => (
                <div
                  key={progressEntry.id}
                  className="flex items-center space-x-4 p-3 border rounded-lg"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {progressEntry.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {progressEntry.candidateName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {progressEntry.currentStage}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      {progressEntry.jobTitle} • Last contact{" "}
                      {formatTimeAgo(progressEntry.lastInteraction)} • Next
                      follow-up {formatTimeAgo(progressEntry.nextFollowUp)}
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
              Send email to {selectedProgressEntries.length} selected progress
              entry(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Template</Label>
              <Select
                value={emailTemplate?.toString() || ""}
                onValueChange={(value) =>
                  setEmailTemplate(value ? parseInt(value) : null)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
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
                    {
                      emailTemplates.find((t) => t.id === emailTemplate)
                        ?.content
                    }
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
              onClick={() => sendEmail(emailTemplate, selectedProgressEntries)}
              disabled={!emailTemplate}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Emails
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Entry Profile Dialog */}
      <Dialog
        open={!!selectedProgressEntry}
        onOpenChange={() => setSelectedProgressEntry(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProgressEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedProgressEntry.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedProgressEntry.candidateName}</div>
                    <div className="text-sm text-gray-600">
                      {selectedProgressEntry.jobTitle}
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
                              selectedCandidate.urgencyLevel
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
                            className={`px-2 py-1 rounded text-xs ${
                              email.opened
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {email.opened ? "Opened" : "Not opened"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              email.responded
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
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
