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
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ENHANCED_CANDIDATE_SAMPLE,
  getJobApplication,
} from "@/data/enhanced-mock-data";
import { JobApplication } from "@/types/enhanced-candidate";
import { CandidateData } from "@/data/hardcoded-data";
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

export default function CandidateApplicationProgress() {
  const { candidateId, jobId } = useParams();
  const [candidate] = useState(ENHANCED_CANDIDATE_SAMPLE);
  const [jobApplication, setJobApplication] = useState<JobApplication | null>(
    null,
  );
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showEmailTrigger, setShowEmailTrigger] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (jobId) {
      const app = getJobApplication(candidate, jobId);
      setJobApplication(app || null);
    }
  }, [jobId, candidate]);

  if (!jobApplication) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Application not found
          </h2>
          <p className="text-slate-600 mt-2">
            The job application you're looking for doesn't exist.
          </p>
          <Link to={`/candidates/${candidateId}`}>
            <Button className="mt-4">Back to Candidate Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert stage history to StageData format
  const stages: StageData[] = [
    "Applied",
    "Screening",
    "Interview",
    "Technical",
    "Offer",
    "Hired",
  ].map((stageName) => {
    const stageData = jobApplication.stageHistory.find(
      (s) => s.stage === stageName,
    );
    return {
      name: stageName,
      completed: !!stageData,
      duration: stageData?.duration || 0,
      startDate: stageData?.startDate || "",
      endDate: stageData?.endDate,
      notes: stageData?.notes || `${stageName} stage`,
      reason: stageData?.reason,
      mailSent: stageData?.mailSent || false,
      mailConfirmed: stageData?.mailConfirmed || false,
    };
  });

  const currentStageIndex = stages.findIndex(
    (stage) => stage.name === jobApplication.currentStage,
  );
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-sm text-slate-600">
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
              {jobApplication.salary && (
                <div className="flex items-center gap-1 min-w-0">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{jobApplication.salary}</span>
                </div>
              )}
              {jobApplication.location && (
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{jobApplication.location}</span>
                </div>
              )}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, index) => (
            <div key={stage.name} className="text-center relative">
              <div className="flex justify-center mb-1">
                {stage.mailSent ? (
                  stage.mailConfirmed ? (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  ) : (
                    <MailCheck className="w-4 h-4 text-green-500" />
                  )
                ) : (
                  <Mail className="w-4 h-4 text-slate-300" />
                )}
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

              {/* Duration */}
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
                Current: {jobApplication.currentStage} (
                {stages.find((s) => s.name === jobApplication.currentStage)
                  ?.duration || 0}{" "}
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
                  Back to Follow-up Dashboard
                </Button>
              </Link>
              <Link to={`/candidates/${candidateId}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <User className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
              </Link>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <span>Follow-up Dashboard</span>
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
        {/* Left Panel - Status & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <StatusTracker />

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
            <TabsList className="grid w-full grid-cols-3 h-auto">
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
                        <p className="text-xs text-slate-600 mb-1">
                          From: {email.from}
                        </p>
                        <p className="text-xs text-slate-600 mb-2">
                          {new Date(email.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {email.content}
                        </p>
                      </div>
                    ))}
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
          candidate={candidate as unknown as CandidateData}
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
