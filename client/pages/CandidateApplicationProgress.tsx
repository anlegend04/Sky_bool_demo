import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  MailCheck,
  Phone,
  MapPin,
  Calendar,
  Plus,
  Video,
  User,
  FileText,
  Briefcase,
  Activity,
  Clock,
  MoreHorizontal,
  Building2,
  DollarSign,
  CheckCircle,
  Circle,
  Zap,
  Target,
  Eye,
  Download,
  Copy,
  Forward,
  Star,
  Send,
  AlertCircle,
  TrendingUp,
  Users,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  getJobApplication,
} from "@/data/enhanced-mock-data";
import { JobApplication } from "@/types/enhanced-candidate";
import { getCandidate } from "@/data/hardcoded-data";
import { EmailTrigger } from "@/components/EmailTrigger";
import { EnhancedCandidateData } from "@/types/enhanced-candidate";
import { convertCandidateToEnhanced } from "@/data/enhanced-mock-data";
import {
  EmailTemplate,
  ConfirmationStatus,
  StageTracking,
  getAllEmailTemplates,
  getTemplatesForStage,
} from "@/lib/email-utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface CandidateApplicationProgressProps {
  candidate?: EnhancedCandidateData;
  jobId?: string;
}

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
  // Enhanced email tracking
  stageTracking?: StageTracking;
  confirmationStatus?: ConfirmationStatus;
  requiredEmails?: EmailTemplate[];
  overdue?: boolean;
  autoRejected?: boolean;
};

interface EmailStatusData {
  template: EmailTemplate;
  sent: boolean;
  sentDate?: string;
  confirmed?: boolean;
  confirmedDate?: string;
  overdue: boolean;
  autoRejected: boolean;
  deadline?: string;
}

export default function CandidateApplicationProgress(props: CandidateApplicationProgressProps) {
  const params = useParams();
  const candidateId = params.candidateId || params.id;
  
  // Get candidate from hardcoded data and convert to enhanced format
  const hardcodedCandidate = candidateId ? getCandidate(candidateId) : null;
  const candidate = props.candidate ?? (hardcodedCandidate ? convertCandidateToEnhanced(hardcodedCandidate) : null);
  
  const jobId = props.jobId ?? params.jobId ?? params.candidateId;

  const [jobApplication, setJobApplication] = useState<JobApplication | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showEmailTrigger, setShowEmailTrigger] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobId);
  const [emailTemplates] = useState<EmailTemplate[]>(getAllEmailTemplates());
  const [emailStatuses, setEmailStatuses] = useState<EmailStatusData[]>([]);
  const { toast } = useToast();

  // Handle case when no candidate is found
  if (!candidate) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Candidate Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The candidate you're looking for could not be found.
          </p>
          <div className="flex gap-2 justify-center">
            <Link to="/follow-up">
              <Button variant="outline">Back to Recuitment Process</Button>
            </Link>
            <Link to="/candidates">
              <Button variant="outline">View All Candidates</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (selectedJobId) {
      const app = getJobApplication(candidate, selectedJobId);
      setJobApplication(app || null);
    }
  }, [selectedJobId, candidate]);

  // Update email statuses when job application changes
  useEffect(() => {
    if (jobApplication) {
      const statuses = analyzeEmailStatuses();
      setEmailStatuses(statuses);
    }
  }, [jobApplication]);

  // Handle email actions
  const handleEmailAction = (action: 'send' | 'confirm' | 'autoReject', templateId: number) => {
    const status = emailStatuses.find(s => s.template.id === templateId);
    if (!status) return;

    switch (action) {
      case 'send':
        setShowEmailTrigger(true);
        toast({
          title: "Email Trigger",
          description: `Preparing to send ${status.template.name} email.`,
        });
        break;
      case 'confirm':
        // Update the email status to confirmed
        setEmailStatuses(prev => prev.map(s => 
          s.template.id === templateId 
            ? { ...s, confirmed: true, confirmedDate: new Date().toISOString(), overdue: false, autoRejected: false }
            : s
        ));
        toast({
          title: "Email Confirmed",
          description: `${status.template.name} has been marked as confirmed.`,
        });
        break;
      case 'autoReject':
        // Update the email status to auto-rejected
        setEmailStatuses(prev => prev.map(s => 
          s.template.id === templateId 
            ? { ...s, autoRejected: true, overdue: true }
            : s
        ));
        toast({
          title: "Candidate Auto-Rejected",
          description: `Candidate has been auto-rejected due to overdue ${status.template.name}.`,
        });
        break;
    }
  };

  // Auto-select job if candidate has only one application
  useEffect(() => {
    const availableJobs = candidate.jobApplications || [];
    
    // If no job is selected and candidate has exactly one job application, auto-select it
    if (!selectedJobId && availableJobs.length === 1) {
      setSelectedJobId(availableJobs[0].id);
    }
  }, [candidate, selectedJobId]);

  if (!jobApplication) {
    // Get available job applications for this candidate
    const availableJobs = candidate.jobApplications || [];
    
    // If candidate has only one job application, show loading while auto-selecting
    if (availableJobs.length === 1) {
      return (
        <div className="p-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Loading Application Progress...
              </h2>
              <p className="text-slate-600">
                Redirecting to {availableJobs[0].jobTitle} application
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Select Job Application
            </h2>
            <p className="text-slate-600 mt-2">
              Choose a job application to view the recruitment process for {candidate.name}
            </p>
          </div>
          
          {availableJobs.length > 0 ? (
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{job.jobTitle}</h3>
                        <p className="text-sm text-slate-600">
                          Current Stage: {job.currentStage}
                        </p>
                        <p className="text-sm text-slate-600">
                          Applied: {new Date(job.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setSelectedJobId(job.id)}
                        className="ml-4"
                      >
                        View Process
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                No job applications found for this candidate.
              </p>
            </div>
          )}
          
          <div className="flex gap-2 mt-6 justify-center">
            <Link to="/follow-up">
              <Button variant="outline">Back to Recuitment Process</Button>
            </Link>
            <Link to={`/candidates/${candidate.id}`}>
              <Button variant="outline">View Candidate Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Analyze email statuses for the current application
  const analyzeEmailStatuses = (): EmailStatusData[] => {
    if (!jobApplication) return [];
    
    const statuses: EmailStatusData[] = [];
    const currentStage = jobApplication.currentStage.toLowerCase();
    
    // Get required emails for each stage
    const stageTemplates = getTemplatesForStage(currentStage);
    
    stageTemplates.forEach(template => {
      // Tìm email đã gửi cho template này - cải thiện logic matching
      const existingEmail = jobApplication.emails.find(email => {
        // So sánh theo template name hoặc subject chứa template name hoặc stage name
        const templateNameMatch = email.template === template.name;
        const subjectMatch = email.subject.toLowerCase().includes(template.name.toLowerCase());
        const stageMatch = email.subject.toLowerCase().includes(template.stage?.toLowerCase() || '');
        const genericStageMatch = email.subject.toLowerCase().includes(currentStage);
        
        return templateNameMatch || subjectMatch || stageMatch || genericStageMatch;
      });
      
      const status: EmailStatusData = {
        template,
        sent: !!existingEmail,
        sentDate: existingEmail?.timestamp,
        confirmed: existingEmail?.repliedAt ? true : false,
        confirmedDate: existingEmail?.repliedAt,
        overdue: false,
        autoRejected: false,
        deadline: template.confirmationDeadline && existingEmail?.timestamp
          ? new Date(new Date(existingEmail.timestamp).getTime() + template.confirmationDeadline * 24 * 60 * 60 * 1000).toISOString()
          : undefined
      };
      
      // Check if overdue
      if (template.requiresConfirmation && status.sent && !status.confirmed && status.deadline) {
        const deadline = new Date(status.deadline);
        const now = new Date();
        status.overdue = now > deadline;
        status.autoRejected = template.autoRejectOnOverdue && status.overdue;
      }
      
      statuses.push(status);
    });
    
    return statuses;
  };

  // Convert stage history to StageData format with improved logic
  const stageNames = [
    "Applied",
    "Screening",
    "Interview",
    "Technical",
    "Offer",
    "Hired",
  ];

  const currentStageIndex = stageNames.findIndex(s => s === jobApplication.currentStage);

  const stages: StageData[] = stageNames.map((stageName, index) => {
    const stageData = jobApplication.stageHistory.find(
      (s) => s.stage === stageName,
    );

    // Tính toán trạng thái completion dựa trên stage history và current stage
    const thisStageIndex = index;
    const isCompleted = stageData && stageData.endDate;
    const isCurrentStage = stageName === jobApplication.currentStage;
    const isPastStage = thisStageIndex < currentStageIndex;

    // Xác định trạng thái completion
    let completionStatus: 'completed' | 'current' | 'pending' | 'not_started';
    if (isCompleted) {
      completionStatus = 'completed';
    } else if (isCurrentStage) {
      completionStatus = 'current';
    } else if (isPastStage) {
      completionStatus = 'completed'; // Nếu đã qua stage này nhưng không có endDate, coi như completed
    } else {
      completionStatus = 'not_started';
    }

    return {
      name: stageName,
      completed: completionStatus === 'completed',
      duration: stageData?.duration || 0,
      startDate: stageData?.startDate || "",
      endDate: stageData?.endDate,
      notes: stageData?.notes || `${stageName} stage`,
      reason: stageData?.reason,
      mailSent: stageData?.mailSent || false,
      mailConfirmed: stageData?.mailConfirmed || false,
    };
  });


  const completedStages = stages.filter((s) => s.completed).length;
  const totalStages = stages.length;

  // Activity timeline combining stage changes, notes, and emails
  const activities = [
    ...jobApplication.stageHistory.map((stage, index) => ({
      id: `stage-${index}`,
      type: "stage_change",
      action: `Moved to ${stage.stage}`,
      user: stage.userName,
      timestamp: new Date(stage.startDate).toLocaleString(),
      content: stage.notes,
      reason: stage.reason,
      duration: stage.duration,
    })),
    ...jobApplication.notes.map((note, index) => ({
      id: `note-${index}`,
      type: "note",
      action: "Added note",
      user: note.userName,
      timestamp: new Date(note.timestamp).toLocaleString(),
      content: note.content,
    })),
    ...jobApplication.emails.map((email, index) => ({
      id: `email-${index}`,
      type: "email",
      action: `Email: ${email.subject}`,
      user: email.from,
      timestamp: new Date(email.timestamp).toLocaleString(),
      content: email.content,
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const StatusTracker = () => (
    <Card className="mb-4 sm:mb-6">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">Application Progress</span>
            <HelpTooltip content="Track the candidate's progress through different stages for this specific job application" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {jobApplication.department}
            </Badge>
            <Badge
              variant={
                jobApplication.status === "Active"
                  ? "default"
                  : jobApplication.status === "On Hold"
                    ? "secondary"
                    : jobApplication.status === "Completed"
                      ? "default"
                      : "destructive"
              }
              className="flex items-center gap-1"
            >
              <Activity className="w-3 h-3" />
              {jobApplication.status}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Job Application Header */}
        <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 break-words">
                  {jobApplication.jobTitle}
                </h3>
              </div>
              <Badge
                variant={
                  jobApplication.priority === "High"
                    ? "destructive"
                    : jobApplication.priority === "Medium"
                      ? "secondary"
                      : "outline"
                }
                className="flex items-center gap-1 w-fit self-start sm:self-center"
              >
                <TrendingUp className="w-3 h-3" />
                {jobApplication.priority} Priority
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-1 min-w-0">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">
                  Applied:{" "}
                  {new Date(jobApplication.appliedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">
                  Recruiter: {jobApplication.recruiter}
                </span>
              </div>
              {/* {jobApplication.salary && (
                <div className="flex items-center gap-1 min-w-0">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{jobApplication.salary}</span>
                </div>
              )} */}
              {/* {jobApplication.location && (
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{jobApplication.location}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>

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
                Current: {jobApplication.currentStage}
              </h4>
              <p className="text-sm text-blue-700 text-wrap">
                {stages.find((s) => s.name === jobApplication.currentStage)
                  ?.notes || "Stage in progress"}
              </p>
            </div>
          </div>
        </div>

        {/* Stages Grid */}
        <TooltipProvider>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, index) => {
            // Lấy tất cả template cho stage này
            const stageTemplates = getTemplatesForStage(stage.name.toLowerCase());
            // Lấy tất cả email đã gửi cho stage này - cải thiện logic matching
            const emailsForStage = jobApplication.emails.filter(email => {
              return stageTemplates.some(tpl => {
                const templateNameMatch = email.template === tpl.name;
                const subjectMatch = email.subject.toLowerCase().includes(tpl.name.toLowerCase());
                const stageMatch = email.subject.toLowerCase().includes(tpl.stage?.toLowerCase() || '');
                const genericStageMatch = email.subject.toLowerCase().includes(stage.name.toLowerCase());
                
                return templateNameMatch || subjectMatch || stageMatch || genericStageMatch;
              });
            });
            return (
              <div key={stage.name} className="text-center relative group">
                {/* Email status indicators */}
                <div className="flex justify-center mb-1 gap-1">
                  {stageTemplates.length > 0 ? (
                    stageTemplates.map((template, templateIdx) => {
                      // Tìm email đã gửi gần nhất cho template này
                      const sentEmails = emailsForStage.filter(email => {
                        const templateNameMatch = email.template === template.name;
                        const subjectMatch = email.subject.toLowerCase().includes(template.name.toLowerCase());
                        const stageMatch = email.subject.toLowerCase().includes(template.stage?.toLowerCase() || '');
                        const genericStageMatch = email.subject.toLowerCase().includes(stage.name.toLowerCase());
                        
                        return templateNameMatch || subjectMatch || stageMatch || genericStageMatch;
                      });
                      const latestEmail = sentEmails.length > 0 ? sentEmails.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b) : undefined;
                      // Xác định trạng thái
                      const sent = !!latestEmail;
                      const confirmed = latestEmail?.repliedAt ? true : false;
                      const sentDate = latestEmail?.timestamp;
                      const confirmedDate = latestEmail?.repliedAt;
                      // Deadline xác nhận
                      let deadline: string | undefined = undefined;
                      if (template.confirmationDeadline && sentDate) {
                        const sentTime = new Date(sentDate).getTime();
                        deadline = new Date(sentTime + template.confirmationDeadline * 24 * 60 * 60 * 1000).toISOString();
                      }
                      // Overdue
                      const overdue = template.requiresConfirmation && sent && !confirmed && deadline && (new Date() > new Date(deadline));
                      const autoRejected = template.autoRejectOnOverdue && overdue;
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
                              {template.requiresConfirmation && sent && !confirmed && !autoRejected && !overdue && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white"></span>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="text-xs font-semibold mb-1">{template.name}</div>
                            <div className="text-xs">
                              Trạng thái: {autoRejected ? "Auto-Rejected" : overdue ? "Overdue" : confirmed ? "Đã xác nhận" : sent ? "Đã gửi" : "Chưa gửi"}
                            </div>
                            {sentDate && (
                              <div className="text-xs">Gửi lúc: {new Date(sentDate).toLocaleString()}</div>
                            )}
                            {template.requiresConfirmation && deadline && (
                              <div className="text-xs">Deadline xác nhận: {new Date(deadline).toLocaleDateString()}</div>
                            )}
                            {confirmedDate && (
                              <div className="text-xs">Xác nhận: {new Date(confirmedDate).toLocaleString()}</div>
                            )}
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
                  // Tính trạng thái tổng hợp cho stage
                  let circleStatus: 'autoRejected' | 'overdue' | 'completed' | 'current' | 'default' = 'default';
                  if (stageTemplates.length > 0) {
                    // Lặp qua từng template để xác định trạng thái
                    let foundAutoRejected = false;
                    let foundOverdue = false;
                    let allConfirmed = true;
                    let hasSentEmails = false;
                    
                    stageTemplates.forEach((template) => {
                      const sentEmails = emailsForStage.filter(email => {
                        const templateNameMatch = email.template === template.name;
                        const subjectMatch = email.subject.toLowerCase().includes(template.name.toLowerCase());
                        const stageMatch = email.subject.toLowerCase().includes(template.stage?.toLowerCase() || '');
                        const genericStageMatch = email.subject.toLowerCase().includes(stage.name.toLowerCase());
                        
                        return templateNameMatch || subjectMatch || stageMatch || genericStageMatch;
                      });
                      
                      const latestEmail = sentEmails.length > 0 ? sentEmails.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b) : undefined;
                      const sent = !!latestEmail;
                      const confirmed = latestEmail?.repliedAt ? true : false;
                      const sentDate = latestEmail?.timestamp;
                      
                      if (sent) hasSentEmails = true;
                      
                      let deadline: string | undefined = undefined;
                      if (template.confirmationDeadline && sentDate) {
                        const sentTime = new Date(sentDate).getTime();
                        deadline = new Date(sentTime + template.confirmationDeadline * 24 * 60 * 60 * 1000).toISOString();
                      }
                      
                      const overdue = template.requiresConfirmation && sent && !confirmed && deadline && (new Date() > new Date(deadline));
                      const autoRejected = template.autoRejectOnOverdue && overdue;
                      
                      if (autoRejected) foundAutoRejected = true;
                      if (overdue) foundOverdue = true;
                      if (template.requiresConfirmation && sent && !confirmed) allConfirmed = false;
                    });
                    
                    if (foundAutoRejected) circleStatus = 'autoRejected';
                    else if (foundOverdue) circleStatus = 'overdue';
                    else if (stage.completed) circleStatus = 'completed';
                    else if (index === currentStageIndex) circleStatus = 'current';
                    else if (hasSentEmails) circleStatus = 'completed'; // Có email đã gửi nhưng chưa hoàn thành
                  } else {
                    // Không có template, dựa vào stage completion
                    if (stage.completed) circleStatus = 'completed';
                    else if (index === currentStageIndex) circleStatus = 'current';
                  }
                  return (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mx-auto mb-2 ${
                        circleStatus === 'autoRejected'
                          ? 'bg-red-500 border-red-500 text-white'
                          : circleStatus === 'overdue'
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : circleStatus === 'completed'
                              ? 'bg-green-500 border-green-500 text-white'
                              : circleStatus === 'current'
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {circleStatus === 'autoRejected' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : circleStatus === 'overdue' ? (
                        <Clock className="w-4 h-4" />
                      ) : circleStatus === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : circleStatus === 'current' ? (
                        <Circle className="w-4 h-4 fill-current" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
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

                {/* Email status tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {stageTemplates.length > 0 ? (
                    <div>
                      {stageTemplates.map((template) => {
                        const sentEmails = emailsForStage.filter(email => {
                          const templateNameMatch = email.template === template.name;
                          const subjectMatch = email.subject.toLowerCase().includes(template.name.toLowerCase());
                          const stageMatch = email.subject.toLowerCase().includes(template.stage?.toLowerCase() || '');
                          const genericStageMatch = email.subject.toLowerCase().includes(stage.name.toLowerCase());
                          
                          return templateNameMatch || subjectMatch || stageMatch || genericStageMatch;
                        });
                        const latestEmail = sentEmails.length > 0 ? sentEmails.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b) : undefined;
                        const sent = !!latestEmail;
                        const confirmed = latestEmail?.repliedAt ? true : false;
                        const sentDate = latestEmail?.timestamp;
                        const confirmedDate = latestEmail?.repliedAt;
                        const deadline: string | undefined = template.confirmationDeadline && sentDate ? new Date(new Date(sentDate).getTime() + template.confirmationDeadline * 24 * 60 * 60 * 1000).toISOString() : undefined;
                        const overdue = template.requiresConfirmation && sent && !confirmed && deadline && (new Date() > new Date(deadline));
                        const autoRejected = template.autoRejectOnOverdue && overdue;
                        return (
                          <div key={template.id}>
                            {template.name}: {
                              autoRejected ? "Auto-Rejected" :
                              overdue ? "Overdue" :
                              confirmed ? "Confirmed" :
                              sent ? "Sent" : "Required"
                            }
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    "No email requirements"
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </TooltipProvider>

        {/* Email Status Overview */}
        {emailStatuses.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Status & Required Actions
            </h4>
            <div className="space-y-3">
              {emailStatuses.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-slate-900">
                        {status.template.name}
                      </span>
                      <Badge 
                        variant={
                          status.autoRejected ? "destructive" :
                          status.overdue ? "destructive" :
                          status.confirmed ? "default" :
                          status.sent ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {status.autoRejected ? "Auto-Rejected" :
                         status.overdue ? "Overdue" :
                         status.confirmed ? "Confirmed" :
                         status.sent ? "Sent" : "Required"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      {status.template.subject}
                    </p>
                    {status.sentDate && (
                      <p className="text-xs text-slate-500 mt-1">
                        Sent: {new Date(status.sentDate).toLocaleDateString()}
                      </p>
                    )}
                    {status.deadline && status.template.requiresConfirmation && (
                      <p className="text-xs text-slate-500">
                        Deadline: {new Date(status.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!status.sent && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleEmailAction('send', status.template.id)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                    )}
                    {status.sent && !status.confirmed && status.template.requiresConfirmation && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleEmailAction('confirm', status.template.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Confirmed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
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
                Current: {jobApplication.currentStage} (
                {stages.find((s) => s.name === jobApplication.currentStage)
                  ?.duration || 0}{" "}
                days)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
            <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-sm text-slate-600 break-words block">
                Emails Sent: {jobApplication.emails.length}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/follow-up">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Recuitment Process
                </Button>
              </Link>
              <Link to={`/candidates/${candidate.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
              </Link>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <span>Recuitment Process</span>
                <span>•</span>
                <span>Applicant Progress</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Application Progress
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Track {candidate.name}'s progress for {jobApplication.jobTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-medium text-slate-900">{candidate.name}</p>
              <p className="text-sm text-slate-600">
                {jobApplication.jobTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Email Status Alerts */}
        {emailStatuses.some(s => s.overdue || s.autoRejected) && (
          <div className="lg:col-span-12">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-900">Action Required</h3>
              </div>
              <div className="text-sm text-red-700">
                <p className="mb-2">
                  {emailStatuses.filter(s => s.autoRejected).length} email(s) auto-rejected, 
                  {emailStatuses.filter(s => s.overdue && !s.autoRejected).length} email(s) overdue
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-700 border-red-300 hover:bg-red-100"
                    onClick={() => {
                      const trackingTab = document.querySelector('[data-value="tracking"]') as HTMLElement;
                      if (trackingTab) trackingTab.click();
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Left Panel - Status & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <StatusTracker />

          {/* Email Tracking Summary */}
          {emailStatuses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-700">
                      {emailStatuses.filter(s => s.sent).length}
                    </div>
                    <div className="text-xs text-green-600">Sent</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-700">
                      {emailStatuses.filter(s => s.confirmed).length}
                    </div>
                    <div className="text-xs text-blue-600">Confirmed</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-700">
                      {emailStatuses.filter(s => s.overdue && !s.autoRejected).length}
                    </div>
                    <div className="text-xs text-yellow-600">Overdue</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-700">
                      {emailStatuses.filter(s => s.autoRejected).length}
                    </div>
                    <div className="text-xs text-red-600">Auto-Rejected</div>
                  </div>
                </div>
                {emailStatuses.some(s => s.overdue || s.autoRejected) && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700 font-medium">
                      ⚠️ Action Required: {emailStatuses.filter(s => s.overdue || s.autoRejected).length} emails need attention
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start text-sm"
                onClick={() => setShowEmailTrigger(true)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button
                className="w-full justify-start text-sm"
                variant="outline"
              >
                <Video className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button
                className="w-full justify-start text-sm"
                variant="outline"
              >
                <Phone className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
              <Button
                className="w-full justify-start text-sm"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Add Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Timeline & Communications */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger
                value="timeline"
                className="text-xs sm:text-sm px-2 py-2"
              >
                <span className="hidden sm:inline">Timeline & Notes</span>
                <span className="sm:hidden">Timeline</span>
              </TabsTrigger>
              <TabsTrigger
                value="emails"
                className="text-xs sm:text-sm px-2 py-2"
              >
                <span className="hidden sm:inline">Email History</span>
                <span className="sm:hidden">Emails</span>
              </TabsTrigger>
              <TabsTrigger
                value="tracking"
                className="text-xs sm:text-sm px-2 py-2"
              >
                <span className="hidden sm:inline">Email Tracking</span>
                <span className="sm:hidden">Tracking</span>
              </TabsTrigger>
              <TabsTrigger
                value="stages"
                className="text-xs sm:text-sm px-2 py-2"
              >
                <span className="hidden sm:inline">Stage Details</span>
                <span className="sm:hidden">Stages</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              {/* Add Note Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a note about this application..."
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

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
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
                          {(activity as any).reason && (
                            <p className="text-sm text-slate-600 mt-1">
                              <span className="font-medium">Reason:</span>{" "}
                              {(activity as any).reason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emails" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Communications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobApplication.emails.map((email) => (
                      <div
                        key={email.id}
                        className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-slate-900 break-words flex-1">
                            {email.subject}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {/* Email status indicators */}
                            <div className="flex items-center space-x-1">
                              {email.openedAt && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              {email.repliedAt && (
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => setSelectedEmail(email)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Full
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Forward className="w-4 h-4 mr-2" />
                                  Forward
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-1">
                          From: {email.from}
                        </p>
                        <p className="text-xs text-slate-600 mb-2">
                          {new Date(email.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {email.content}
                        </p>
                        {/* Email status badges */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              email.openedAt 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {email.openedAt ? "Opened" : "Not opened"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              email.repliedAt 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {email.repliedAt ? "Responded" : "No response"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Tracking & Required Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Current Stage Email Requirements */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">
                        Current Stage: {jobApplication.currentStage}
                      </h4>
                      <div className="space-y-3">
                        {emailStatuses.length > 0 ? (
                          emailStatuses.map((status, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-sm">
                                      {status.template.name}
                                    </span>
                                    <Badge 
                                      variant={
                                        status.autoRejected ? "destructive" :
                                        status.overdue ? "destructive" :
                                        status.confirmed ? "default" :
                                        status.sent ? "secondary" : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {status.autoRejected ? "Auto-Rejected" :
                                       status.overdue ? "Overdue" :
                                       status.confirmed ? "Confirmed" :
                                       status.sent ? "Sent" : "Required"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-slate-600 mb-2">
                                    {status.template.subject}
                                  </p>
                                  {status.template.requiresConfirmation && (
                                    <div className="text-xs text-slate-500">
                                      <p>Requires confirmation: Yes</p>
                                      {status.deadline && (
                                        <p>Deadline: {new Date(status.deadline).toLocaleDateString()}</p>
                                      )}
                                    </div>
                                  )}
                                  {status.sentDate && (
                                    <p className="text-xs text-slate-500 mt-1">
                                      Sent: {new Date(status.sentDate).toLocaleDateString()}
                                    </p>
                                  )}
                                  {status.confirmedDate && (
                                    <p className="text-xs text-green-600 mt-1">
                                      Confirmed: {new Date(status.confirmedDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  {!status.sent && (
                                    <Button 
                                      size="sm" 
                                      variant="default" 
                                      className="text-xs"
                                      onClick={() => handleEmailAction('send', status.template.id)}
                                    >
                                      <Send className="w-3 h-3 mr-1" />
                                      Send Email
                                    </Button>
                                  )}
                                  {status.sent && !status.confirmed && status.template.requiresConfirmation && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-xs"
                                      onClick={() => handleEmailAction('confirm', status.template.id)}
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Mark Confirmed
                                    </Button>
                                  )}
                                  {status.overdue && !status.autoRejected && (
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      className="text-xs"
                                      onClick={() => handleEmailAction('autoReject', status.template.id)}
                                    >
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Auto-Reject
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-600">
                            No email requirements for current stage.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* All Stage Email Templates */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-3">
                        All Stage Email Templates
                      </h4>
                      <div className="space-y-2">
                        {["applied", "interview", "technical", "offer", "hired"].map((stage) => {
                          const templates = getTemplatesForStage(stage);
                          return (
                            <div key={stage} className="bg-white p-3 rounded-lg border border-slate-100">
                              <h5 className="font-medium text-sm text-slate-900 mb-2 capitalize">
                                {stage} Stage
                              </h5>
                              <div className="space-y-1">
                                {templates.map((template) => (
                                  <div key={template.id} className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600">{template.name}</span>
                                    <div className="flex items-center gap-1">
                                      {template.requiresConfirmation && (
                                        <Badge variant="outline" className="text-xs">Confirmation Required</Badge>
                                      )}
                                      {template.autoRejectOnOverdue && (
                                        <Badge variant="outline" className="text-xs">Auto-Reject</Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stage Details</CardTitle>
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
                            className={`w-3 h-3 rounded-full mt-2 ${
                              stage.completed ? "bg-green-500" : "bg-blue-500"
                            }`}
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
                            {stage.reason && (
                              <p className="text-sm text-slate-600 mt-1">
                                <span className="font-medium">Reason:</span>{" "}
                                {stage.reason}
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
      </div>

      {/* Email Dialog */}
      <Dialog
        open={!!selectedEmail}
        onOpenChange={() => setSelectedEmail(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <DialogDescription>
              Sent on{" "}
              {selectedEmail?.timestamp &&
                new Date(selectedEmail.timestamp).toLocaleString()}
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
          newStage={jobApplication.currentStage}
          jobTitle={jobApplication.jobTitle}
          onEmailSent={() => {
            setShowEmailTrigger(false);
            toast({
              title: "Email Sent",
              description: `Email sent successfully for ${jobApplication.jobTitle} application.`,
            });
          }}
        />
      )}
    </div>
  );
}
