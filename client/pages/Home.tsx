import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  MoreHorizontal,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Mail,
  UserPlus,
  Building,
  Search,
  Eye,
  Download,
  Share2,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bell,
  MessageSquare,
  Activity,
  Zap,
  Award,
  BookOpen,
  MapPin,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Timer,
  Upload,
  User,
  RefreshCw,
  Save,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import {
  HARDCODED_JOBS,
  HARDCODED_CANDIDATES,
  HARDCODED_INTERVIEWS,
} from "@/data/hardcoded-data";

export default function Home() {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [isAddCandidateDialogOpen, setIsAddCandidateDialogOpen] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Array<{
    fileName: string;
    progress: number;
    status: "uploading" | "parsing" | "complete" | "error";
  }>>([]);
  const [parsedCandidates, setParsedCandidates] = useState<any[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [parseFilter, setParseFilter] = useState<"all" | "incomplete" | "duplicates">("all");
  const [bulkJobPosition, setBulkJobPosition] = useState("");
  const [bulkSource, setBulkSource] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bulkFileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Job form state
  const [newJob, setNewJob] = useState({
    emailAlias: '',
    department: '',
    location: '',
    position: '',
    type: '',
    domain: '',
    priority: '',
    deadline: '',
    expectedSkills: [] as string[],
    salaryMin: '',
    salaryMax: '',
    description: '',
    headcount: 1,
    recruiter: '',
    estimatedCost: '',
  });

  // Job stages state
  const [jobStages, setJobStages] = useState([
    { id: 1, name: 'Applied', order: 1 },
    { id: 2, name: 'Screening', order: 2 },
    { id: 3, name: 'Interview', order: 3 },
    { id: 4, name: 'Technical', order: 4 },
    { id: 5, name: 'Offer', order: 5 },
    { id: 6, name: 'Hired', order: 6 },
  ]);

  // Candidate form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    position: "",
    department: "",
    source: "",
    experience: "",
    salary: "",
    skills: "",
  });

  // Schedule form state
  const [newSchedule, setNewSchedule] = useState({
    eventType: '',
    meetingType: '',
    title: '',
    date: '',
    duration: '',
    startTime: '',
    location: '',
    description: '',
  });

  // Help content for tooltips
  const helpContent = {
    emailAlias: "Email address where job applications will be received",
    employmentType: "Type of employment contract",
    domain: "Industry or domain the job belongs to",
    priority: "How urgent this hiring need is",
    headcount: "Number of positions to fill",
    estimatedBudget: "Estimated cost for this hiring process",
  };

  // Job stages helper functions
  const updateStage = (id: number, updates: any) => {
    setJobStages(stages => 
      stages.map(stage => 
        stage.id === id ? { ...stage, ...updates } : stage
      )
    );
  };

  const removeStage = (id: number) => {
    setJobStages(stages => stages.filter(stage => stage.id !== id));
  };

  const addNewStage = () => {
    const newId = Math.max(...jobStages.map(s => s.id)) + 1;
    const newOrder = Math.max(...jobStages.map(s => s.order)) + 1;
    setJobStages(stages => [...stages, { id: newId, name: 'New Stage', order: newOrder }]);
  };

  // StageItem component
  const StageItem = ({ id, index, stage, updateStage, removeStage }: any) => (
    <div className="flex items-center space-x-2 p-2 border rounded">
      <Input
        value={stage.name}
        onChange={(e) => updateStage(id, { name: e.target.value })}
        className="flex-1"
        placeholder="Stage name"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => removeStage(id)}
        className="text-red-600 hover:text-red-700"
      >
        Remove
      </Button>
    </div>
  );
  
  // Add error boundary for useLanguage hook
  let t;
  try {
    const { t: translate } = useLanguage();
    t = translate;
  } catch (error) {
    console.warn("LanguageProvider not available in Home, using fallback");
    // Fallback translation function
    t = (key: string, fallback?: string) => {
      const parts = key.split(".");
      const lastPart = parts[parts.length - 1];
      return (
        fallback ||
        lastPart.charAt(0).toUpperCase() +
          lastPart.slice(1).replace(/([A-Z])/g, " $1")
      );
    };
  }

  // Quick Actions
  const quickActions = [
    {
      title: "Add New Job",
      description: "Create a new job posting",
      icon: Plus,
      color: "blue",
      action: "job-dialog",
      badge: "New",
    },
    {
      title: "Add Candidate",
      description: "Add a new candidate to the system",
      icon: UserPlus,
      color: "green",
      action: "candidate-dialog",
      badge: "Quick",
    },
    {
      title: "Add Schedule",
      description: "Quickly schedule interviews and meetings",
      icon: Calendar,
      color: "pink",
      action: "schedule-dialog",
      badge: "Quick",
    },
  ];

  // Dashboard stats
  const dashboardStats = {
    activeJobs: HARDCODED_JOBS.filter((job) => job.status === "Open").length,
    totalCandidates: HARDCODED_CANDIDATES.length,
    interviewsThisWeek: HARDCODED_CANDIDATES.filter((c) =>
      c.jobApplications.some((app) =>
        ["Interview", "Technical"].includes(app.currentStage),
      ),
    ).length,
    avgTimeToHire: 25, // Mock average
  };

  const stats = [
    {
      titleKey: "dashboard.activeJobs",
      value: dashboardStats.activeJobs.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Briefcase,
      color: "blue",
    },
    {
      titleKey: "dashboard.totalCandidates",
      value: dashboardStats.totalCandidates.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "green",
    },
    {
      titleKey: "dashboard.interviewsThisWeek",
      value: dashboardStats.interviewsThisWeek.toString(),
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
      color: "orange",
    },
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      type: "urgent",
      title: "Interview Reminder",
      message: "Technical interview with John Doe in 30 minutes",
      time: "30 min ago",
      read: false,
      icon: Clock,
      color: "red",
    },
    {
      id: 2,
      type: "info",
      title: "New Application",
      message: "Sarah Johnson applied for Senior Frontend Developer",
      time: "2 hours ago",
      read: false,
      icon: UserPlus,
      color: "blue",
    },
    {
      id: 3,
      type: "success",
      title: "Offer Accepted",
      message: "Mike Chen accepted the offer for Product Manager",
      time: "1 day ago",
      read: true,
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 4,
      type: "warning",
      title: "Overdue Follow-up",
      message: "3 candidates need follow-up emails",
      time: "2 days ago",
      read: false,
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  // Recent Jobs data
  const recentJobs = HARDCODED_JOBS.slice(0, 5).map((job) => ({
    id: job.id,
    title: job.position,
    location: job.location,
    applicants: job.applications,
    status: job.status,
    postedDate: job.createdAt,
  }));

  // Recent Candidates data
  const recentCandidates = HARDCODED_CANDIDATES.slice(0, 5).map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    avatar: candidate.avatar,
    currentStage: candidate.jobApplications[0]?.currentStage || "Applied",
    appliedJob: candidate.jobApplications[0]?.jobTitle || "Unknown Position",
    appliedDate: candidate.jobApplications[0]?.appliedDate || new Date(),
  }));

  // My Activity data
  const myActivities = [
    {
      id: 1,
      type: "interview_conducted",
      title: "Conducted Technical Interview",
      description: "Interviewed Sarah Johnson for Senior Frontend Developer",
      time: "2 hours ago",
      icon: Users,
      color: "blue",
      status: "completed",
    },
    {
      id: 2,
      type: "candidate_reviewed",
      title: "Reviewed CV",
      description: "Reviewed and shortlisted 5 candidates for Product Manager",
      time: "4 hours ago",
      icon: FileText,
      color: "green",
      status: "completed",
    },
    {
      id: 3,
      type: "job_published",
      title: "Published Job Posting",
      description: "Published Senior Backend Developer position",
      time: "1 day ago",
      icon: Building,
      color: "purple",
      status: "completed",
    },
    {
      id: 4,
      type: "offer_sent",
      title: "Sent Offer Letter",
      description: "Sent offer to Mike Chen for Product Manager role",
      time: "2 days ago",
      icon: Mail,
      color: "orange",
      status: "pending",
    },
    {
      id: 5,
      type: "meeting_scheduled",
      title: "Scheduled Team Meeting",
      description: "Scheduled hiring team meeting for next week",
      time: "3 days ago",
      icon: Calendar,
      color: "pink",
      status: "scheduled",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "candidate_added",
      title: "New candidate added",
      description: "Sarah Johnson applied for Senior Frontend Developer",
      time: "2 hours ago",
      icon: UserPlus,
      color: "green",
    },
    {
      id: 2,
      type: "interview_scheduled",
      title: "Interview scheduled",
      description: "Technical interview with Mike Chen tomorrow at 2 PM",
      time: "4 hours ago",
      icon: Calendar,
      color: "blue",
    },
    {
      id: 3,
      type: "job_published",
      title: "Job published",
      description: "Product Manager position is now live",
      time: "1 day ago",
      icon: Building,
      color: "purple",
    },
    {
      id: 4,
      type: "candidate_hired",
      title: "Candidate hired",
      description: "Emily Rodriguez accepted the offer for UX Designer",
      time: "2 days ago",
      icon: CheckCircle,
      color: "green",
    },
  ];

  // Calculate pipeline data
  const totalCandidates = HARDCODED_CANDIDATES.length;
  const appliedCount = HARDCODED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Applied"),
  ).length;
  const screeningCount = HARDCODED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Screening"),
  ).length;
  const interviewCount = HARDCODED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Interview"),
  ).length;
  const technicalCount = HARDCODED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Technical"),
  ).length;
  const offerCount = HARDCODED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Offer"),
  ).length;
  const hiredCount = HARDCODED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Hired"),
  ).length;

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
      pink: "bg-pink-100 text-pink-600 border-pink-200",
      red: "bg-red-100 text-red-600 border-red-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: "default" | "secondary" | "destructive" | "outline"; color: string } } = {
      Open: { variant: "default", color: "bg-green-100 text-green-800" },
      Closed: { variant: "secondary", color: "bg-gray-100 text-gray-800" },
      Draft: { variant: "outline", color: "bg-yellow-100 text-yellow-800" },
      completed: { variant: "default", color: "bg-green-100 text-green-800" },
      pending: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      scheduled: { variant: "outline", color: "bg-blue-100 text-blue-800" },
    };
    return statusMap[status] || { variant: "secondary", color: "bg-gray-100 text-gray-800" };
  };

  // Handler functions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "job-dialog":
        setIsAddJobDialogOpen(true);
        break;
      case "candidate-dialog":
        setIsAddCandidateDialogOpen(true);
        break;
      case "schedule-dialog":
        setIsScheduleDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleJobSubmit = () => {
    // Handle job submission logic here
    console.log("New job:", newJob);
    console.log("Job stages:", jobStages);
    setIsAddJobDialogOpen(false);
    // Reset form
    setNewJob({
      emailAlias: '',
      department: '',
      location: '',
      position: '',
      type: '',
      domain: '',
      priority: '',
      deadline: '',
      expectedSkills: [],
      salaryMin: '',
      salaryMax: '',
      description: '',
      headcount: 1,
      recruiter: '',
      estimatedCost: '',
    });
  };

  // Candidate handling functions
  const handleFormSubmit = async () => {
    setIsSubmittingForm(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("New candidate:", formData);
      setShowManualEntry(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        position: "",
        department: "",
        source: "",
        experience: "",
        salary: "",
        skills: "",
      });
    } catch (error) {
      console.error("Error creating candidate:", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const preFillSampleData = () => {
    setFormData({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      position: "software-engineer",
      department: "engineering",
      source: "linkedin",
      experience: "5 years",
      salary: "120000",
      skills: "React, TypeScript, Node.js",
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (uploadMode === "single" && files.length > 0) {
      handleSingleFileUpload(files[0]);
    } else if (uploadMode === "bulk") {
      handleBulkFileUpload(files);
    }
  };

  const handleSingleFileUpload = (file: File) => {
    // Simulate file upload and parsing
    setUploadProgress([{
      fileName: file.name,
      progress: 0,
      status: "uploading"
    }]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev.find(p => p.fileName === file.name);
        if (current && current.progress < 100) {
          return prev.map(p => 
            p.fileName === file.name 
              ? { ...p, progress: p.progress + 10 }
              : p
          );
        }
        clearInterval(interval);
        return prev.map(p => 
          p.fileName === file.name 
            ? { ...p, status: "parsing" }
            : p
        );
      });
    }, 200);

    // Simulate parsing completion
    setTimeout(() => {
      setUploadProgress(prev => 
        prev.map(p => 
          p.fileName === file.name 
            ? { ...p, status: "complete" }
            : p
        )
      );
      
      // Add mock parsed candidate
      const mockCandidate = {
        id: Date.now().toString(),
        name: "Extracted from CV",
        email: "extracted@example.com",
        phone: "+1 (555) 000-0000",
        position: "Software Engineer",
        department: "Engineering",
        source: "CV Upload",
        experience: "3 years",
        salary: "100000",
        skills: "JavaScript, React, Node.js",
        isConfirmed: true,
        hasMissingInfo: false,
        isPotentialDuplicate: false,
      };
      setParsedCandidates([mockCandidate]);
    }, 3000);
  };

  const handleBulkFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newProgress = fileArray.map(file => ({
      fileName: file.name,
      progress: 0,
      status: "uploading" as const
    }));
    setUploadProgress(prev => [...prev, ...newProgress]);

    // Simulate bulk upload
    fileArray.forEach((file, index) => {
      setTimeout(() => {
        handleSingleFileUpload(file);
      }, index * 1000);
    });
  };

  const createAllCandidates = () => {
    console.log("Creating candidates:", parsedCandidates);
    setParsedCandidates([]);
    setUploadProgress([]);
    setShowCVUpload(false);
  };

  const selectAllCandidates = () => {
    setSelectedCandidates(parsedCandidates.map(c => c.id));
  };

  const clearSelection = () => {
    setSelectedCandidates([]);
  };

  const filteredParsedCandidates = parsedCandidates.filter(candidate => {
    switch (parseFilter) {
      case "incomplete":
        return candidate.hasMissingInfo;
      case "duplicates":
        return candidate.isPotentialDuplicate;
      default:
        return true;
    }
  });

  const handleScheduleSubmit = () => {
    // Handle schedule submission logic here
    console.log("New schedule:", newSchedule);
    setIsScheduleDialogOpen(false);
    // Reset form
    setNewSchedule({
      eventType: '',
      meetingType: '',
      title: '',
      date: '',
      duration: '',
      startTime: '',
      location: '',
      description: '',
    });
  };

  return (
    <div className="padding-responsive space-mobile">
      {/* Header */}
      <div className="flex-responsive justify-responsive items-responsive space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="heading-responsive text-wrap-safe">
            Welcome to Recruitment Hub
          </h1>
          <p className="text-responsive-base text-slate-600 mt-1 text-wrap-safe">
            Manage your recruitment process efficiently with our comprehensive
            tools
          </p>
        </div>
        <div className="btn-group-mobile"></div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-slate-300"
                onClick={() => handleQuickAction(action.action)}
              >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${getColorClasses(action.color)}`}
                      >
                        <action.icon className="w-6 h-6" />
                      </div>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {t(stat.titleKey)}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ml-1 ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">
                      {t("dashboard.vsLastMonth")}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <Badge variant="destructive" className="ml-2">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  notification.read ? "bg-gray-50" : "bg-blue-50"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${getColorClasses(notification.color)}`}
                >
                  <notification.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Recent Jobs</span>
              </div>
              <Link to="/jobs">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                      {job.title}
                    </p>
                    <Badge
                      variant={getStatusBadge(job.status).variant}
                      className={`text-xs ${getStatusBadge(job.status).color}`}
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{job.applicants} applicants</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Recent Candidates</span>
              </div>
              <Link to="/candidates">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={candidate.avatar} />
                  <AvatarFallback>
                    {candidate.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                      {candidate.name}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {candidate.currentStage}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{candidate.appliedJob}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>My Activity</span>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${getColorClasses(activity.color)}`}
                >
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.title}
                    </p>
                    <Badge
                      variant={getStatusBadge(activity.status).variant}
                      className={`text-xs ${getStatusBadge(activity.status).color}`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-responsive-lg text-wrap-safe">
                Recent Activities
              </span>
              <Button variant="ghost" size="sm" className="icon-mobile">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-mobile">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${getColorClasses(activity.color)}`}
                  >
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 text-wrap-safe">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-600 text-wrap-safe">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Access Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/candidates">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Candidates</h3>
              <p className="text-sm text-slate-600">Manage all candidates</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/jobs">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Briefcase className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Jobs</h3>
              <p className="text-sm text-slate-600">View all job postings</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reports">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Reports</h3>
              <p className="text-sm text-slate-600">Analytics & insights</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/follow-up">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Timer className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-2">Follow-up</h3>
              <p className="text-sm text-slate-600">Recruitment process</p>
            </CardContent>
          </Card>
        </Link>
      </div> */}

      {/* Add Job Dialog */}
      <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
        <DialogContent className="modal-mobile max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-wrap-safe">
              Add New Job
            </DialogTitle>
            <DialogDescription className="text-wrap-safe">
              Create a new job posting with all the necessary details.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="text-wrap-safe">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="details" className="text-wrap-safe">
                Job Details
              </TabsTrigger>
              <TabsTrigger value="team" className="text-wrap-safe">
                Team & Budget
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="text-wrap-safe">
                Stages
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="form-responsive">
              <div className="form-grid-responsive">
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 flex items-center gap-2 text-wrap-safe">
                    Email Alias
                    <HelpTooltip content={helpContent.emailAlias} />
                  </label>
                  <Input
                    placeholder="jobs@company.com"
                    value={newJob.emailAlias}
                    onChange={(e) =>
                      setNewJob({ ...newJob, emailAlias: e.target.value })
                    }
                    className="mt-1 text-wrap-safe"
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Department
                  </label>
                  <Select
                    value={newJob.department}
                    onValueChange={(value) =>
                      setNewJob({ ...newJob, department: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-mobile">
                      <SelectItem
                        value="Engineering"
                        className="text-wrap-safe"
                      >
                        Engineering
                      </SelectItem>
                      <SelectItem value="Product" className="text-wrap-safe">
                        Product
                      </SelectItem>
                      <SelectItem value="Design" className="text-wrap-safe">
                        Design
                      </SelectItem>
                      <SelectItem value="Marketing" className="text-wrap-safe">
                        Marketing
                      </SelectItem>
                      <SelectItem value="Data" className="text-wrap-safe">
                        Data
                      </SelectItem>
                      <SelectItem value="Sales" className="text-wrap-safe">
                        Sales
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Job Location
                  </label>
                  <Input
                    placeholder="San Francisco, CA or Remote"
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                    className="mt-1 text-wrap-safe"
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Job Position
                  </label>
                  <Input
                    placeholder="Senior Software Engineer"
                    value={newJob.position}
                    onChange={(e) =>
                      setNewJob({ ...newJob, position: e.target.value })
                    }
                    className="mt-1 text-wrap-safe"
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 flex items-center gap-2 text-wrap-safe">
                    Employment Type
                    <HelpTooltip content={helpContent.employmentType} />
                  </label>
                  <Select
                    value={newJob.type}
                    onValueChange={(value: any) =>
                      setNewJob({ ...newJob, type: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-mobile">
                      <SelectItem value="Full-time" className="text-wrap-safe">
                        Full-time
                      </SelectItem>
                      <SelectItem value="Part-time" className="text-wrap-safe">
                        Part-time
                      </SelectItem>
                      <SelectItem value="Contract" className="text-wrap-safe">
                        Contract
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 flex items-center gap-2 text-wrap-safe">
                    Domain/Industry
                    <HelpTooltip content={helpContent.domain} />
                  </label>
                  <Input
                    placeholder="Technology, Finance, Healthcare"
                    value={newJob.domain}
                    onChange={(e) =>
                      setNewJob({ ...newJob, domain: e.target.value })
                    }
                    className="mt-1 text-wrap-safe"
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 flex items-center gap-2 text-wrap-safe">
                    Priority
                    <HelpTooltip content={helpContent.priority} />
                  </label>
                  <Select
                    value={newJob.priority}
                    onValueChange={(value: any) =>
                      setNewJob({ ...newJob, priority: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-mobile">
                      <SelectItem value="High" className="text-wrap-safe">
                        High
                      </SelectItem>
                      <SelectItem value="Medium" className="text-wrap-safe">
                        Medium
                      </SelectItem>
                      <SelectItem value="Low" className="text-wrap-safe">
                        Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) =>
                      setNewJob({ ...newJob, deadline: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="form-responsive">
              <div className="space-y-4">
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Expected Skills
                  </label>
                  <Input
                    placeholder="React, TypeScript, Node.js (comma separated)"
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        expectedSkills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 text-wrap-safe"
                  />
                </div>
                <div className="form-grid-responsive">
                  <div>
                    <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                      Salary Min
                    </label>
                    <Input
                      placeholder="80000"
                      type="number"
                      value={newJob.salaryMin}
                      onChange={(e) =>
                        setNewJob({ ...newJob, salaryMin: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                      Salary Max
                    </label>
                    <Input
                      placeholder="120000"
                      type="number"
                      value={newJob.salaryMax}
                      onChange={(e) =>
                        setNewJob({ ...newJob, salaryMax: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Job Description
                  </label>
                  <Textarea
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob({ ...newJob, description: e.target.value })
                    }
                    className="mt-1 text-wrap-safe"
                    rows={6}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="team" className="form-responsive">
              <div className="form-grid-responsive">
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 flex items-center gap-2 text-wrap-safe">
                    Headcount
                    <HelpTooltip content={helpContent.headcount} />
                  </label>
                  <Input
                    placeholder="2"
                    type="number"
                    value={newJob.headcount}
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        headcount: parseInt(e.target.value) || 1,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                    Recruiter
                  </label>
                  <Select
                    value={newJob.recruiter}
                    onValueChange={(value) =>
                      setNewJob({ ...newJob, recruiter: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select recruiter" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-mobile">
                      <SelectItem value="Alex Chen" className="text-wrap-safe">
                        Alex Chen
                      </SelectItem>
                      <SelectItem value="Sarah Kim" className="text-wrap-safe">
                        Sarah Kim
                      </SelectItem>
                      <SelectItem
                        value="Mike Wilson"
                        className="text-wrap-safe"
                      >
                        Mike Wilson
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                  Requester
                </label>
                <Input
                  placeholder="Select requester who requested this job"
                  className="mt-1 text-wrap-safe"
                />
              </div>
              <div>
                <label className="text-responsive-sm font-medium text-slate-700 flex items-center gap-2 text-wrap-safe">
                  Estimated Budget
                  <HelpTooltip content={helpContent.estimatedBudget} />
                </label>
                <Input
                  placeholder="15000"
                  type="number"
                  value={newJob.estimatedCost}
                  onChange={(e) =>
                    setNewJob({ ...newJob, estimatedCost: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 btn-group-mobile">
                <Button
                  variant="outline"
                  onClick={() => setIsAddJobDialogOpen(false)}
                  className="btn-mobile"
                >
                  Cancel
                </Button>
                <Button onClick={handleJobSubmit} className="btn-mobile">
                  Create Job
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="pipeline" className="form-responsive">
              <div className="space-y-3">
                <label className="text-responsive-sm font-medium text-slate-700">
                  Recruitment Stages
                </label>

                <div className="space-y-2">
                  {jobStages.map((stage, index) => (
                    <StageItem
                      key={stage.id}
                      id={stage.id}
                      index={index}
                      stage={stage}
                      updateStage={updateStage}
                      removeStage={removeStage}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addNewStage}
                  className="text-sm"
                >
                  + Add Stage
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Choice Dialog */}
      <Dialog open={isAddCandidateDialogOpen} onOpenChange={setIsAddCandidateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New Candidate
            </DialogTitle>
            <DialogDescription>
              Choose how you want to add a new candidate to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  setIsAddCandidateDialogOpen(false);
                  setShowCVUpload(true);
                }}
              >
                <Upload className="w-6 h-6" />
                <span>Upload CVs</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  setIsAddCandidateDialogOpen(false);
                  setShowManualEntry(true);
                }}
              >
                <Plus className="w-6 h-6" />
                <span>Add Manually</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Entry Dialog */}
      <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add Candidate Manually
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <span>
                Enter candidate details to create a new candidate profile.
              </span>
              <Button variant="outline" size="sm" onClick={preFillSampleData}>
                Fill Sample Data
              </Button>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <Input
                  placeholder="John Doe"
                  className="mt-1"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>
                <Input 
                  placeholder="+1 (555) 123-4567" 
                  className="mt-1"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Location
                </label>
                <Input 
                  placeholder="City, State" 
                  className="mt-1"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Job Position
                </label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => {
                    if (value === "customize") {
                      setFormData(prev => ({ ...prev, position: "customize" }));
                      setTimeout(() => {
                        const customInput = document.getElementById("custom-position");
                        if (customInput) {
                          (customInput as HTMLInputElement).focus();
                        }
                      }, 100);
                    } else {
                      setFormData(prev => ({ ...prev, position: value }));
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software-engineer">
                      Software Engineer
                    </SelectItem>
                    <SelectItem value="product-manager">
                      Product Manager
                    </SelectItem>
                    <SelectItem value="ux-designer">UX Designer</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="marketing-specialist">
                      Marketing Specialist
                    </SelectItem>
                    <SelectItem
                      value="customize"
                      className="text-blue-600 font-semibold hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-2 pl-1">
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Customize</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.position === "customize" && (
                  <Input
                    id="custom-position"
                    className="mt-2"
                    placeholder="Enter custom job position"
                    value=""
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Department
                </label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => {
                    if (value === "customize") {
                      setFormData(prev => ({ ...prev, department: "customize" }));
                      setTimeout(() => {
                        const customInput = document.getElementById("custom-department");
                        if (customInput) {
                          (customInput as HTMLInputElement).focus();
                        }
                      }, 100);
                    } else {
                      setFormData(prev => ({ ...prev, department: value }));
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem
                      value="customize"
                      className="text-blue-600 font-semibold hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-2 pl-1">
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Customize</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.department === "customize" && (
                  <Input
                    id="custom-department"
                    className="mt-2"
                    placeholder="Enter custom department"
                    value=""
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Source
                </label>
                <Select 
                  value={formData.source}
                  onValueChange={(value) => {
                    if (value === "customize") {
                      setFormData(prev => ({ ...prev, source: "customize" }));
                      setTimeout(() => {
                        const customInput = document.getElementById("custom-source-manual");
                        if (customInput) {
                          (customInput as HTMLInputElement).focus();
                        }
                      }, 100);
                    } else {
                      setFormData(prev => ({ ...prev, source: value }));
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="topcv">TopCV</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="third-party">Third Party</SelectItem>
                    <SelectItem
                      value="customize"
                      className="text-blue-600 font-semibold hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-2 pl-1">
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Customize</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.source === "customize" && (
                  <Input
                    id="custom-source-manual"
                    className="mt-2"
                    placeholder="Enter custom source"
                    value=""
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowManualEntry(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    location: "",
                    position: "",
                    department: "",
                    source: "",
                    experience: "",
                    salary: "",
                    skills: "",
                  });
                }}
                disabled={isSubmittingForm}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                disabled={isSubmittingForm || !formData.name || !formData.email}
              >
                {isSubmittingForm ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Candidate
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Upload Dialog */}
      <Dialog open={showCVUpload} onOpenChange={setShowCVUpload}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              CV Upload & Management
            </DialogTitle>
            <DialogDescription>
              Upload single or multiple CVs to automatically extract candidate
              information
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={uploadMode}
            onValueChange={(value) => setUploadMode(value as "single" | "bulk")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">
                <FileText className="w-4 h-4 mr-2" />
                Single CV Upload
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Users className="w-4 h-4 mr-2" />
                Bulk CV Upload
              </TabsTrigger>
            </TabsList>

            {/* Single Upload Tab */}
            <TabsContent value="single" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Add Candidate via CV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Resume/CV
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Drag and drop your CV here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF, DOC, DOCX up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleSingleFileUpload(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadProgress.map((progress) => (
                        <div key={progress.fileName} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {progress.fileName}
                            </span>
                            <span className="text-gray-500">
                              {progress.status === "uploading" &&
                                `${progress.progress}%`}
                              {progress.status === "parsing" && "Parsing..."}
                              {progress.status === "complete" && "Complete"}
                              {progress.status === "error" && "Error"}
                            </span>
                          </div>
                          <Progress
                            value={
                              progress.status === "parsing"
                                ? 100
                                : progress.progress
                            }
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Single CV Preview */}
              {parsedCandidates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Candidate Preview</CardTitle>
                    <p className="text-sm text-gray-600">
                      Review and edit the extracted information before saving
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {parsedCandidates.map((candidate) => (
                        <div key={candidate.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{candidate.name}</h4>
                            <Badge variant="outline">{candidate.position}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Email:</span> {candidate.email}
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span> {candidate.phone}
                            </div>
                            <div>
                              <span className="text-gray-500">Department:</span> {candidate.department}
                            </div>
                            <div>
                              <span className="text-gray-500">Source:</span> {candidate.source}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setParsedCandidates([])}
                      >
                        Clear
                      </Button>
                      <Button onClick={createAllCandidates}>
                        <Save className="w-4 h-4 mr-2" />
                        Create Candidate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Bulk Upload Tab */}
            <TabsContent value="bulk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Multiple CVs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => bulkFileInputRef.current?.click()}
                  >
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Multiple Resumes
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Drag and drop multiple CVs here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF, DOC, DOCX files up to 10MB each
                    </p>
                    <input
                      ref={bulkFileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={(e) =>
                        e.target.files && handleBulkFileUpload(e.target.files)
                      }
                      className="hidden"
                    />
                  </div>

                  {/* Bulk Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Default Job Position</Label>
                      <Select
                        value={bulkJobPosition}
                        onValueChange={(value) => {
                          if (value === "customize") {
                            setBulkJobPosition("customize");
                            setTimeout(() => {
                              const customInput = document.getElementById("custom-job-position");
                              if (customInput) {
                                (customInput as HTMLInputElement).focus();
                              }
                            }, 100);
                          } else {
                            setBulkJobPosition(value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select position for all CVs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="software-engineer">
                            Software Engineer
                          </SelectItem>
                          <SelectItem value="product-manager">
                            Product Manager
                          </SelectItem>
                          <SelectItem value="ux-designer">
                            UX Designer
                          </SelectItem>
                          <SelectItem value="data-analyst">
                            Data Analyst
                          </SelectItem>
                          <SelectItem
                            value="customize"
                            className="text-blue-600 font-semibold hover:bg-blue-50"
                          >
                            <div className="flex items-center gap-2 pl-1">
                              <Plus className="w-4 h-4 stroke-[3]" />
                              <span>Customize</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {bulkJobPosition === "customize" && (
                        <Input
                          id="custom-job-position"
                          placeholder="Enter custom job position"
                          className="mt-2"
                          value=""
                          onChange={(e) => setBulkJobPosition(e.target.value)}
                        />
                      )}
                    </div>
                    <div>
                      <Label>Default Source</Label>
                      <Select 
                        value={bulkSource} 
                        onValueChange={(value) => {
                          if (value === "customize") {
                            setBulkSource("customize");
                            setTimeout(() => {
                              const customInput = document.getElementById("custom-source");
                              if (customInput) {
                                (customInput as HTMLInputElement).focus();
                              }
                            }, 100);
                          } else {
                            setBulkSource(value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select source (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="indeed">Indeed</SelectItem>
                          <SelectItem value="jobboard">Job Board</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem
                            value="customize"
                            className="text-blue-600 font-semibold hover:bg-blue-50"
                          >
                            <div className="flex items-center gap-2 pl-1">
                              <Plus className="w-4 h-4 stroke-[3]" />
                              <span>Customize</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {bulkSource === "customize" && (
                        <Input
                          id="custom-source"
                          placeholder="Enter custom source"
                          className="mt-2"
                          value=""
                          onChange={(e) => setBulkSource(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Upload Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {uploadProgress.map((progress) => (
                          <div key={progress.fileName} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium break-words">
                                {progress.fileName}
                              </span>
                              <div className="flex items-center space-x-2">
                                {progress.status === "parsing" && (
                                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                                )}
                                {progress.status === "complete" && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {progress.status === "error" && (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-gray-500 text-xs">
                                  {progress.status === "uploading" &&
                                    `${progress.progress}%`}
                                  {progress.status === "parsing" &&
                                    "Parsing..."}
                                  {progress.status === "complete" && "Complete"}
                                  {progress.status === "error" && "Error"}
                                </span>
                              </div>
                            </div>
                            <Progress
                              value={
                                progress.status === "parsing"
                                  ? 100
                                  : progress.progress
                              }
                              className="h-2"
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Bulk Preview */}
              {parsedCandidates.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Parsed Candidates
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Review and edit candidates before creating profiles
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Select
                          value={parseFilter}
                          onValueChange={(value) =>
                            setParseFilter(value as any)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Candidates</SelectItem>
                            <SelectItem value="incomplete">
                              Missing Info
                            </SelectItem>
                            <SelectItem value="duplicates">
                              Potential Duplicates
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={
                              selectedCandidates.length > 0
                                ? clearSelection
                                : selectAllCandidates
                            }
                          >
                            {selectedCandidates.length > 0
                              ? "Clear All"
                              : "Select All"}
                          </Button>
                          <span className="text-sm text-gray-500">
                            {selectedCandidates.length} of{" "}
                            {filteredParsedCandidates.length} selected
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>
                          Confirmed (
                          {parsedCandidates.filter((c) => c.isConfirmed).length}
                          )
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>
                          Missing Info (
                          {
                            parsedCandidates.filter((c) => c.hasMissingInfo)
                              .length
                          }
                          )
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span>
                          Potential Duplicates (
                          {
                            parsedCandidates.filter(
                              (c) => c.isPotentialDuplicate,
                            ).length
                          }
                          )
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {filteredParsedCandidates.map((candidate) => (
                        <div key={candidate.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{candidate.name}</h4>
                            <Badge variant="outline">{candidate.position}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Email:</span> {candidate.email}
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span> {candidate.phone}
                            </div>
                            <div>
                              <span className="text-gray-500">Department:</span> {candidate.department}
                            </div>
                            <div>
                              <span className="text-gray-500">Source:</span> {candidate.source}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {selectedCandidates.length > 0
                          ? `${selectedCandidates.length} candidates selected for creation`
                          : `${parsedCandidates.length} candidates ready for creation`}
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setParsedCandidates([])}
                        >
                          Clear All
                        </Button>
                        <Button onClick={createAllCandidates}>
                          <Save className="w-4 h-4 mr-2" />
                          Create{" "}
                          {selectedCandidates.length > 0
                            ? selectedCandidates.length
                            : parsedCandidates.length}{" "}
                          Candidates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Schedule Event Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
            <DialogDescription>
              Create a new interview, meeting, or appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select
                  value={newSchedule.eventType}
                  onValueChange={(value) =>
                    setNewSchedule({ ...newSchedule, eventType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview">Technical Interview</SelectItem>
                    <SelectItem value="screening">Phone Screening</SelectItem>
                    <SelectItem value="final">Final Round</SelectItem>
                    <SelectItem value="meeting">Team Meeting</SelectItem>
                    <SelectItem value="offer">Offer Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Meeting Type</Label>
                <Select
                  value={newSchedule.meetingType}
                  onValueChange={(value) =>
                    setNewSchedule({ ...newSchedule, meetingType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In Person</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Event Title</Label>
              <Input
                placeholder="e.g. Technical Interview - John Doe"
                value={newSchedule.title}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, title: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, date: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Select
                  value={newSchedule.duration}
                  onValueChange={(value) =>
                    setNewSchedule({ ...newSchedule, duration: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSchedule.startTime}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, startTime: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Location/Link</Label>
                <Input
                  placeholder="Conference Room A or Zoom link"
                  value={newSchedule.location}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, location: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Add any additional details about the event..."
                value={newSchedule.description}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, description: e.target.value })
                }
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleScheduleSubmit}>
                Schedule Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
