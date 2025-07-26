import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  ArrowLeft,
  Mail,
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
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

type StageData = {
  name: string;
  completed: boolean;
  duration: number;
  startDate: string;
  endDate?: string;
  notes?: string;
  reason?: string;
};

export default function CandidateDetail() {
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState("Interview");
  const [newNote, setNewNote] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [showStageChangeDialog, setShowStageChangeDialog] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [stageChangeReason, setStageChangeReason] = useState("");

  const candidate = {
    id: 1,
    name: "Marissa Mayer",
    email: "marissa.mayer@lumilabs.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco Bay Area",
    currentCompany: "Lumi Labs",
    currentPosition: "Co-Founder",
    appliedPosition: "Senior Product Manager",
    department: "Product",
    recruiter: "Alex Chen",
    source: "LinkedIn",
    appliedDate: "2024-01-15",
    expectedSalary: "$150k - $180k",
    experience: "8+ years",
    skills: ["Product Strategy", "Team Leadership", "Data Analysis", "UX Design"],
    rating: 5,
    resume: "marissa_mayer_resume.pdf",
    avatar: "",
    tags: ["High Priority", "Cultural Fit", "Leadership"],
  };

  const stages: StageData[] = [
    {
      name: "Applied",
      completed: true,
      duration: 1,
      startDate: "2024-01-15",
      endDate: "2024-01-16",
      notes: "Application received via LinkedIn. Strong profile match.",
    },
    {
      name: "Screening",
      completed: true,
      duration: 3,
      startDate: "2024-01-16",
      endDate: "2024-01-19",
      notes: "Initial screening call completed. Excellent communication skills.",
    },
    {
      name: "Interview",
      completed: false,
      duration: 5,
      startDate: "2024-01-19",
      notes: "Scheduled for panel interview on Jan 25th.",
    },
    {
      name: "Technical",
      completed: false,
      duration: 0,
      startDate: "",
    },
    {
      name: "Offer",
      completed: false,
      duration: 0,
      startDate: "",
    },
    {
      name: "Hired",
      completed: false,
      duration: 0,
      startDate: "",
    },
  ];

  const activities = [
    {
      id: 1,
      type: "stage_change",
      action: "Moved to Interview stage",
      user: "Alex Chen",
      timestamp: "2024-01-19 10:30 AM",
      reason: "Passed initial screening successfully",
    },
    {
      id: 2,
      type: "note",
      action: "Added note",
      user: "Sarah Kim",
      timestamp: "2024-01-18 2:15 PM",
      content: "Great cultural fit, strong technical background",
    },
    {
      id: 3,
      type: "email",
      action: "Sent email",
      user: "Alex Chen",
      timestamp: "2024-01-17 9:00 AM",
      content: "Interview invitation sent",
    },
    {
      id: 4,
      type: "call",
      action: "Phone screening completed",
      user: "Alex Chen",
      timestamp: "2024-01-16 3:30 PM",
      duration: "45 minutes",
    },
  ];

  const emailHistory = [
    {
      id: 1,
      subject: "Interview Invitation - Senior Product Manager",
      from: "alex.chen@company.com",
      to: "marissa.mayer@lumilabs.com",
      timestamp: "2024-01-17 9:00 AM",
      content: "Hi Marissa, Thank you for your interest in the Senior Product Manager position...",
    },
    {
      id: 2,
      subject: "Application Received - Senior Product Manager",
      from: "noreply@company.com",
      to: "marissa.mayer@lumilabs.com",
      timestamp: "2024-01-15 2:30 PM",
      content: "Thank you for applying to our Senior Product Manager position...",
    },
  ];

  const StatusTracker = () => {
    const currentStageIndex = stages.findIndex(stage => stage.name === currentStage);
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Application Progress</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
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
          <div className="flex items-center justify-between mb-4">
            {stages.map((stage, index) => (
              <div key={stage.name} className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    stage.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : index === currentStageIndex
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {stage.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : index === currentStageIndex ? (
                    <Circle className="w-5 h-5 fill-current" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs font-medium mt-2 text-center">{stage.name}</div>
                {stage.duration > 0 && (
                  <div className="text-xs text-slate-500 mt-1">
                    {stage.duration} day{stage.duration !== 1 ? "s" : ""}
                  </div>
                )}
                {index < stages.length - 1 && (
                  <div
                    className={`absolute top-5 left-10 w-full h-0.5 ${
                      stage.completed ? "bg-green-500" : "bg-slate-300"
                    }`}
                    style={{ width: "calc(100% + 20px)" }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Stage Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                Total Time: {stages.reduce((acc, stage) => acc + stage.duration, 0)} days
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                Current: {currentStage} ({stages.find(s => s.name === currentStage)?.duration || 0} days)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-600">
                {stages.filter(s => s.completed).length} of {stages.length} completed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeftPanel = () => (
    <div className="space-y-6">
      {/* Candidate Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-lg">
                  {candidate.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
                <p className="text-slate-600">{candidate.currentPosition} at {candidate.currentCompany}</p>
                <div className="flex items-center space-x-1 mt-1">
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
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
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
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.appliedPosition}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.department}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Recruiter: {candidate.recruiter}</span>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.expectedSalary}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Schedule Video Interview
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Schedule Phone Call
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule In-Person Meeting
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Send Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const CenterPanel = () => (
    <div className="space-y-6">
      <StatusTracker />

      {/* Notes and Activities */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Notes & Timeline</TabsTrigger>
          <TabsTrigger value="activities">Activity Log</TabsTrigger>
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
                {stages.filter(stage => stage.startDate).map((stage) => (
                  <div key={stage.name} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-b-0">
                    <div className={`w-3 h-3 rounded-full mt-2 ${stage.completed ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900">{stage.name}</h4>
                        <span className="text-xs text-slate-500">{stage.duration} days</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {stage.startDate} {stage.endDate && `- ${stage.endDate}`}
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
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      {activity.type === "stage_change" && <Zap className="w-4 h-4 text-blue-600" />}
                      {activity.type === "note" && <FileText className="w-4 h-4 text-green-600" />}
                      {activity.type === "email" && <Mail className="w-4 h-4 text-purple-600" />}
                      {activity.type === "call" && <Phone className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900">{activity.action}</h4>
                        <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-600">by {activity.user}</p>
                      {activity.content && (
                        <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                          {activity.content}
                        </p>
                      )}
                      {activity.reason && (
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="font-medium">Reason:</span> {activity.reason}
                        </p>
                      )}
                      {activity.duration && (
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="font-medium">Duration:</span> {activity.duration}
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
    <div className="space-y-6">
      {/* Send Message */}
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input placeholder="Subject line..." />
            <Textarea
              placeholder="Compose your message..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <Paperclip className="w-4 h-4 mr-2" />
                Attach File
              </Button>
              <Button size="sm">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Email Templates</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Interview Invitation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Offer Letter
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Rejection Notice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email History */}
      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailHistory.map((email) => (
              <div key={email.id} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-slate-900 truncate">{email.subject}</h4>
                  <span className="text-xs text-slate-500">{email.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mb-1">
                  From: {email.from}
                </p>
                <p className="text-xs text-slate-600 mb-2">
                  To: {email.to}
                </p>
                <p className="text-xs text-slate-600 truncate">
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
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">Resume.pdf</span>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">Cover_Letter.pdf</span>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/candidates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Candidate Profile</h1>
              <p className="text-slate-600">Manage candidate information and track progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{candidate.source}</Badge>
            <Badge
              variant={currentStage === "Hired" ? "default" : currentStage === "Rejected" ? "destructive" : "secondary"}
            >
              {currentStage}
            </Badge>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-3">
          <LeftPanel />
        </div>

        {/* Center Panel */}
        <div className="lg:col-span-6">
          <CenterPanel />
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-3">
          <RightPanel />
        </div>
      </div>

      {/* Stage Change Dialog */}
      <Dialog open={showStageChangeDialog} onOpenChange={setShowStageChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Candidate Stage</DialogTitle>
            <DialogDescription>
              Moving candidate to {newStage} stage. Please provide a reason for this change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Reason for stage change</label>
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
              <Button
                onClick={() => {
                  setCurrentStage(newStage);
                  setShowStageChangeDialog(false);
                  setStageChangeReason("");
                }}
              >
                Update Stage
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
