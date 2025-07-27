import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  MapPin,
  Calendar,
  Edit,
  Eye,
  Trash2,
  Share,
  DollarSign,
  TrendingUp,
  Target,
  Building,
  Clock,
  Settings,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
  Grid3X3,
  List,
  ExternalLink,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HARDCODED_JOBS, JobData } from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";

export default function Jobs() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [shareJobId, setShareJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state for new job
  const [newJob, setNewJob] = useState({
    emailAlias: "",
    department: "",
    location: "",
    position: "",
    type: "Full-time" as const,
    expectedSkills: [] as string[],
    salaryMin: "",
    salaryMax: "",
    domain: "",
    headcount: 1,
    recruiter: "",
    interviewers: [] as string[],
    description: "",
    priority: "Medium" as const,
    deadline: "",
    estimatedCost: "",
  });

  // Customizable field visibility
  const [visibleFields, setVisibleFields] = useState({
    position: true,
    department: true,
    recruiter: true,
    applications: true,
    target: true,
    hired: true,
    process: true,
    openDate: true,
    deadline: true,
    estimatedCost: false,
    actualCost: false,
    performance: true,
    priority: true,
    pipelineSummary: true,
  });

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const storedJobs = storage.getJobs();
    setJobs(storedJobs);
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.recruiter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" ||
      job.department.toLowerCase() === departmentFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      job.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "all" ||
      job.priority.toLowerCase() === priorityFilter.toLowerCase();

    const matchesRecruiter =
      recruiterFilter === "all" ||
      job.recruiter.toLowerCase().includes(recruiterFilter.toLowerCase());

    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority && matchesRecruiter;
  });

  const stats = [
    { title: "Active Jobs", value: jobs.filter(j => j.status === "Open").length.toString(), change: "+3", color: "blue" },
    { title: "Total Applications", value: jobs.reduce((acc, job) => acc + job.applications, 0).toString(), change: "+45", color: "green" },
    { title: "Positions Filled", value: jobs.reduce((acc, job) => acc + job.hired, 0).toString(), change: "+2", color: "purple" },
    { title: "Avg. Time to Fill", value: "28 days", change: "-5", color: "orange" },
  ];

  const handleAddJob = () => {
    try {
      const jobData = {
        ...newJob,
        applications: 0,
        target: newJob.headcount,
        hired: 0,
        openDate: new Date().toISOString().split('T')[0],
        actualCost: "0",
        performance: 0,
        status: "Open" as const,
        pipelineSummary: {
          applied: 0,
          screening: 0,
          interview: 0,
          technical: 0,
          offer: 0,
          hired: 0,
          rejected: 0,
        },
      };

      const createdJob = storage.addJob(jobData);
      setJobs(storage.getJobs());
      setShowAddJobDialog(false);
      
      // Reset form
      setNewJob({
        emailAlias: "",
        department: "",
        location: "",
        position: "",
        type: "Full-time",
        expectedSkills: [],
        salaryMin: "",
        salaryMax: "",
        domain: "",
        headcount: 1,
        recruiter: "",
        interviewers: [],
        description: "",
        priority: "Medium",
        deadline: "",
        estimatedCost: "",
      });

      toast({
        title: "Job Created",
        description: `"${createdJob.position}" has been successfully created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditJob = (job: JobData) => {
    setEditingJob(job);
    setNewJob({
      emailAlias: job.emailAlias,
      department: job.department,
      location: job.location,
      position: job.position,
      type: job.type,
      expectedSkills: job.expectedSkills,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      domain: job.domain,
      headcount: job.headcount,
      recruiter: job.recruiter,
      interviewers: job.interviewers,
      description: job.description,
      priority: job.priority,
      deadline: job.deadline,
      estimatedCost: job.estimatedCost,
    });
    setShowAddJobDialog(true);
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;

    try {
      const updatedJob = storage.updateJob(editingJob.id, {
        ...newJob,
        target: newJob.headcount,
      });

      if (updatedJob) {
        setJobs(storage.getJobs());
        setShowAddJobDialog(false);
        setEditingJob(null);
        
        toast({
          title: "Job Updated",
          description: `"${updatedJob.position}" has been successfully updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = (jobId: string) => {
    try {
      const success = storage.deleteJob(jobId);
      if (success) {
        setJobs(storage.getJobs());
        toast({
          title: "Job Deleted",
          description: "The job has been successfully deleted.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareJob = (jobId: string) => {
    const shareUrl = `${window.location.origin}/jobs/${jobId}/public`;
    navigator.clipboard.writeText(shareUrl);
    setShareJobId(null);
    toast({
      title: "Link Copied",
      description: "Job sharing link has been copied to clipboard.",
    });
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return "text-green-600";
    if (performance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: JobData["status"]) => {
    switch (status) {
      case "Open":
        return <Badge variant="default">Open</Badge>;
      case "Closed":
        return <Badge variant="outline">Closed</Badge>;
      case "In Progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "Paused":
        return <Badge variant="destructive">Paused</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: JobData["priority"]) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case "Medium":
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case "Low":
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return <Badge className="text-xs">{priority}</Badge>;
    }
  };

  const JobCard = ({ job }: { job: JobData }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/jobs/${job.id}`}
                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {job.position}
              </Link>
              {getPriorityBadge(job.priority)}
            </div>
            <p className="text-sm text-slate-600 mb-2">{job.department}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {job.deadline}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to={`/jobs/${job.id}`}>
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => handleEditJob(job)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShareJobId(job.id)}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Job</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{job.position}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Applications</span>
          <Badge variant="outline">{job.applications}</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Pipeline Summary</span>
            <span>{job.pipelineSummary.hired}/{job.target} hired</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center p-1 bg-blue-50 rounded">
              <div className="font-medium">{job.pipelineSummary.applied}</div>
              <div className="text-slate-600">Applied</div>
            </div>
            <div className="text-center p-1 bg-yellow-50 rounded">
              <div className="font-medium">{job.pipelineSummary.interview}</div>
              <div className="text-slate-600">Interview</div>
            </div>
            <div className="text-center p-1 bg-green-50 rounded">
              <div className="font-medium">{job.pipelineSummary.hired}</div>
              <div className="text-slate-600">Hired</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {getStatusBadge(job.status)}
            <span className="text-xs text-slate-500">by {job.recruiter}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${getPerformanceColor(job.performance)}`} />
            <span className={`text-xs ${getPerformanceColor(job.performance)}`}>
              {job.performance}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ListView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleFields.position && <TableHead>Job Position</TableHead>}
              {visibleFields.department && <TableHead>Department</TableHead>}
              {visibleFields.recruiter && <TableHead>Recruiter</TableHead>}
              {visibleFields.priority && <TableHead>Priority</TableHead>}
              {visibleFields.applications && <TableHead>Applications</TableHead>}
              {visibleFields.target && <TableHead>Target</TableHead>}
              {visibleFields.hired && <TableHead>Hired</TableHead>}
              {visibleFields.process && <TableHead>Process</TableHead>}
              {visibleFields.pipelineSummary && <TableHead>Pipeline Summary</TableHead>}
              {visibleFields.openDate && <TableHead>Open Date</TableHead>}
              {visibleFields.deadline && <TableHead>Deadline</TableHead>}
              {visibleFields.estimatedCost && <TableHead>Est. Cost</TableHead>}
              {visibleFields.actualCost && <TableHead>Actual Cost</TableHead>}
              {visibleFields.performance && <TableHead>Performance</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-slate-50">
                {visibleFields.position && (
                  <TableCell>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {job.position}
                    </Link>
                  </TableCell>
                )}
                {visibleFields.department && <TableCell>{job.department}</TableCell>}
                {visibleFields.recruiter && <TableCell>{job.recruiter}</TableCell>}
                {visibleFields.priority && <TableCell>{getPriorityBadge(job.priority)}</TableCell>}
                {visibleFields.applications && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>{job.applications}</span>
                    </div>
                  </TableCell>
                )}
                {visibleFields.target && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-slate-500" />
                      <span>{job.target}</span>
                    </div>
                  </TableCell>
                )}
                {visibleFields.hired && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{job.hired}</span>
                    </div>
                  </TableCell>
                )}
                {visibleFields.process && (
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{job.hired}/{job.target}</span>
                        <span>{Math.round((job.hired / job.target) * 100)}%</span>
                      </div>
                      <Progress
                        value={(job.hired / job.target) * 100}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                )}
                {visibleFields.pipelineSummary && (
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>{job.pipelineSummary.applied} Applied</div>
                      <div>{job.pipelineSummary.interview} Interviewing</div>
                      <div className="font-medium text-green-600">{job.pipelineSummary.hired} Hired</div>
                    </div>
                  </TableCell>
                )}
                {visibleFields.openDate && <TableCell>{job.openDate}</TableCell>}
                {visibleFields.deadline && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{job.deadline}</span>
                    </div>
                  </TableCell>
                )}
                {visibleFields.estimatedCost && <TableCell>${job.estimatedCost}</TableCell>}
                {visibleFields.actualCost && <TableCell>${job.actualCost}</TableCell>}
                {visibleFields.performance && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`w-4 h-4 ${getPerformanceColor(job.performance)}`} />
                      <span className={getPerformanceColor(job.performance)}>
                        {job.performance}%
                      </span>
                    </div>
                  </TableCell>
                )}
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link to={`/jobs/${job.id}`}>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => handleEditJob(job)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShareJobId(job.id)}>
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Job</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{job.position}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );

  const AddJobForm = () => (
    <Dialog open={showAddJobDialog} onOpenChange={(open) => {
      setShowAddJobDialog(open);
      if (!open) {
        setEditingJob(null);
      }
    }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingJob ? "Edit Job" : "Add New Job"}</DialogTitle>
          <DialogDescription>
            {editingJob ? "Update the job details below." : "Create a new job posting with all the necessary details."}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="team">Team & Budget</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Email Alias
                  <HelpTooltip content={helpContent.emailAlias} />
                </label>
                <Input
                  placeholder="jobs@company.com"
                  value={newJob.emailAlias}
                  onChange={(e) => setNewJob({...newJob, emailAlias: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Department</label>
                <Select value={newJob.department} onValueChange={(value) => setNewJob({...newJob, department: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Job Location</label>
                <Input
                  placeholder="San Francisco, CA or Remote"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Job Position</label>
                <Input
                  placeholder="Senior Software Engineer"
                  value={newJob.position}
                  onChange={(e) => setNewJob({...newJob, position: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Employment Type
                  <HelpTooltip content={helpContent.employmentType} />
                </label>
                <Select value={newJob.type} onValueChange={(value: any) => setNewJob({...newJob, type: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Domain/Industry
                  <HelpTooltip content={helpContent.domain} />
                </label>
                <Input
                  placeholder="Technology, Finance, Healthcare"
                  value={newJob.domain}
                  onChange={(e) => setNewJob({...newJob, domain: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Priority
                  <HelpTooltip content={helpContent.priority} />
                </label>
                <Select value={newJob.priority} onValueChange={(value: any) => setNewJob({...newJob, priority: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Deadline</label>
                <Input
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Expected Skills</label>
                <Input
                  placeholder="React, TypeScript, Node.js (comma separated)"
                  onChange={(e) => setNewJob({...newJob, expectedSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Salary Min</label>
                  <Input
                    placeholder="80000"
                    type="number"
                    value={newJob.salaryMin}
                    onChange={(e) => setNewJob({...newJob, salaryMin: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Salary Max</label>
                  <Input
                    placeholder="120000"
                    type="number"
                    value={newJob.salaryMax}
                    onChange={(e) => setNewJob({...newJob, salaryMax: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Job Description</label>
                <Textarea
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="mt-1"
                  rows={6}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Headcount
                  <HelpTooltip content={helpContent.headcount} />
                </label>
                <Input
                  placeholder="2"
                  type="number"
                  value={newJob.headcount}
                  onChange={(e) => setNewJob({...newJob, headcount: parseInt(e.target.value) || 1})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Recruiter</label>
                <Select value={newJob.recruiter} onValueChange={(value) => setNewJob({...newJob, recruiter: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select recruiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                    <SelectItem value="Sarah Kim">Sarah Kim</SelectItem>
                    <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Interviewers</label>
              <Input
                placeholder="Select team members who will conduct interviews"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Estimated Budget
                <HelpTooltip content={helpContent.estimatedBudget} />
              </label>
              <Input
                placeholder="15000"
                type="number"
                value={newJob.estimatedCost}
                onChange={(e) => setNewJob({...newJob, estimatedCost: e.target.value})}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddJobDialog(false)}>
                Cancel
              </Button>
              <Button onClick={editingJob ? handleUpdateJob : handleAddJob}>
                {editingJob ? "Update Job" : "Create Job"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Management</h1>
          <p className="text-slate-600 mt-1">
            Manage job postings, track applications, and monitor hiring performance.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" onClick={() => setShowAddJobDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-green-600">
                    {stat.change} vs last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Briefcase className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
              </div>

              {/* Field Visibility Settings (only for list view) */}
              {viewMode === "list" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {Object.entries(visibleFields).map(([field, visible]) => (
                      <DropdownMenuCheckboxItem
                        key={field}
                        checked={visible}
                        onCheckedChange={(checked) =>
                          setVisibleFields((prev) => ({ ...prev, [field]: checked }))
                        }
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs by position, department, recruiter..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "list" ? <ListView /> : <GridView />}

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
            1
          </Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>

      <AddJobForm />

      {/* Share Job Dialog */}
      <Dialog open={!!shareJobId} onOpenChange={() => setShareJobId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Job</DialogTitle>
            <DialogDescription>
              Generate a shareable link for this job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded">
              <Input
                value={shareJobId ? `${window.location.origin}/jobs/${shareJobId}/public` : ""}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => shareJobId && handleShareJob(shareJobId)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShareJobId(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
