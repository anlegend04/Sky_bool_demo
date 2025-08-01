import { useState, useEffect, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { HARDCODED_JOBS, JobData } from "@/data/hardcoded-data";
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
  DialogFooter,
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
  UserPlus,
  MapPin,
  Calendar,
  Edit,
  Eye,
  Trash2,
  Share,
  Briefcase,
  Grid3X3,
  List,
  Copy,
  TrendingUp,
  Target,
  CheckCircle,
  Settings,
} from "lucide-react";
import { GripVertical, Trash } from "lucide-react";

// Define initial job form state
const initialJobState = {
  emailAlias: "",
  department: "",
  location: "",
  position: "",
  type: "Full-time" as "Full-time" | "Part-time" | "Contract",
  expectedSkills: [] as string[],
  salaryMin: "",
  salaryMax: "",
  domain: "",
  headcount: 1,
  recruiter: "",
  requester: "",
  description: "",
  priority: "Medium" as "High" | "Medium" | "Low",
  deadline: "",
  estimatedCost: "",
};

// These will be moved inside the AddJobForm component where they belong

function StageItem({
  id,
  index,
  stage,
  updateStage,
  removeStage,
}: {
  id: string;
  index: number;
  stage: any;
  updateStage: (index: number, stage: any) => void;
  removeStage: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <span className="text-slate-400">
          <GripVertical className="w-4 h-4 mt-1" />
        </span>
        <Input
          value={stage.name}
          onChange={(e) =>
            updateStage(index, {
              ...stage,
              name: e.target.value,
            })
          }
          className="flex-1"
          placeholder="Stage name"
        />
        <Input
          type="number"
          min={1}
          value={stage.durationHours || ""}
          onChange={(e) =>
            updateStage(index, {
              ...stage,
              durationHours: e.target.value,
            })
          }
          className="w-36"
          placeholder="Duration (h)"
        />
        {!["Applied", "Screening", "Interview", "Offer", "Hired"].includes(
          stage.name,
        ) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeStage(index)}
            className="text-red-500"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Memoized JobCard to prevent unnecessary re-renders
const JobCard = memo(
  ({
    job,
    onEdit,
    onShare,
    onDelete,
    getStatusBadge,
    getPriorityBadge,
    getPerformanceColor,
  }: {
    job: JobData;
    onEdit: (job: JobData) => void;
    onShare: (jobId: string) => void;
    onDelete: (jobId: string) => void;
    getStatusBadge: (status: JobData["status"]) => JSX.Element;
    getPriorityBadge: (priority: JobData["priority"]) => JSX.Element;
    getPerformanceColor: (performance: number) => string;
  }) => (
    <Card className="hover:shadow-md transition-shadow card-responsive">
      <CardHeader className="pb-3 card-mobile">
        <div className="flex items-start justify-between min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 min-w-0">
              <Link
                to={`/jobs/${job.id}`}
                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-wrap-safe min-w-0 flex-1 break-words"
              >
                {job.position}
              </Link>
              <div className="flex-shrink-0">
                {getPriorityBadge(job.priority)}
              </div>
            </div>
            <p className="text-responsive-sm text-slate-600 mb-2 text-wrap-safe break-words">
              {job.department}
            </p>
            <div className="flex items-center gap-4 text-responsive-sm text-slate-500 min-w-0">
              <span className="flex items-center gap-1 text-wrap-safe min-w-0 flex-1">
                <MapPin className="icon-mobile flex-shrink-0" />
                <span className="break-words">{job.location}</span>
              </span>
              <span className="flex items-center gap-1 text-wrap-safe min-w-0 flex-1">
                <Calendar className="icon-mobile flex-shrink-0" />
                <span className="break-words">{job.deadline}</span>
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="icon-mobile flex-shrink-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dropdown-mobile">
              <Link to={`/jobs/${job.id}`}>
                <DropdownMenuItem className="text-wrap-safe">
                  <Eye className="icon-mobile mr-2" />
                  View Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => onEdit(job)}
                className="text-wrap-safe"
              >
                <Edit className="icon-mobile mr-2" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onShare(job.id)}
                className="text-wrap-safe"
              >
                <Share className="icon-mobile mr-2" />
                Share
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600 text-wrap-safe"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="icon-mobile mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="modal-mobile">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-wrap-safe">
                      Delete Job
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-wrap-safe">
                      Are you sure you want to delete "{job.position}"? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="btn-mobile">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(job.id)}
                      className="btn-mobile"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 card-mobile">
        <div className="flex items-center justify-between">
          <span className="text-responsive-sm text-slate-600 text-wrap-safe">
            Applications
          </span>
          <Badge variant="outline" className="badge-mobile">
            {job.applications}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-responsive-sm">
            <span className="text-wrap-safe">Pipeline Summary</span>
            <span className="text-wrap-safe">
              {job.pipelineSummary.hired}/{job.target} hired
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-responsive-sm">
            <div className="text-center p-1 bg-blue-50 rounded">
              <div className="font-medium text-wrap-safe">
                {job.pipelineSummary.applied}
              </div>
              <div className="text-slate-600 text-wrap-safe">Applied</div>
            </div>
            <div className="text-center p-1 bg-yellow-50 rounded">
              <div className="font-medium text-wrap-safe">
                {job.pipelineSummary.interview}
              </div>
              <div className="text-slate-600 text-wrap-safe">Interview</div>
            </div>
            <div className="text-center p-1 bg-green-50 rounded">
              <div className="font-medium text-wrap-safe">
                {job.pipelineSummary.hired}
              </div>
              <div className="text-slate-600 text-wrap-safe">Hired</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex-shrink-0">{getStatusBadge(job.status)}</div>
            <span className="text-responsive-sm text-slate-500 text-wrap-safe break-words">
              by {job.recruiter}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <TrendingUp
              className={`icon-mobile ${getPerformanceColor(job.performance)}`}
            />
            <span
              className={`text-responsive-sm ${getPerformanceColor(job.performance)} text-wrap-safe`}
            >
              {job.performance}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
);

// Memoized AddJobForm to prevent re-renders when parent state changes
const AddJobForm = memo(
  ({
    open,
    onOpenChange,
    onAddJob,
    onUpdateJob,
    editingJob,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddJob: (job: any) => void;
    onUpdateJob: (job: any) => void;
    editingJob: JobData | null;
  }) => {
    const [newJob, setNewJob] = useState(initialJobState);
    const [jobStages, setJobStages] = useState(
      ["Applied", "Screening", "Interview", "Offer", "Hired"].map(
        (name, index) => ({
          id: `stage-${index}`,
          name,
          durationHours: "",
        }),
      ),
    );

    // Reset form when editingJob changes
    useEffect(() => {
      if (editingJob) {
        setNewJob({
          emailAlias: editingJob.emailAlias,
          department: editingJob.department,
          location: editingJob.location,
          position: editingJob.position,
          type: editingJob.type as "Full-time" | "Part-time" | "Contract",
          expectedSkills: editingJob.expectedSkills,
          salaryMin: editingJob.salaryMin,
          salaryMax: editingJob.salaryMax,
          domain: editingJob.domain,
          headcount: editingJob.headcount,
          recruiter: editingJob.recruiter,
          requester: editingJob.requester,
          description: editingJob.description,
          priority: editingJob.priority as "High" | "Medium" | "Low",
          deadline: editingJob.deadline,
          estimatedCost: editingJob.estimatedCost,
        });
      } else {
        setNewJob(initialJobState);
      }
    }, [editingJob]);

    const updateStage = useCallback(
      (index: number, newStage: {id: string; name: string; durationHours: string }) => {
        setJobStages((prev) => {
          const updated = [...prev];
          updated[index] = newStage;
          return updated;
        });
      },
      [],
    );

    const addNewStage = useCallback(() => {
      setJobStages((prev) => [
        ...prev,
        { id: `stage-${Date.now()}`, name: "", durationHours: "" },
      ]);
    }, []);

    const removeStage = useCallback((index: number) => {
      setJobStages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = useCallback(() => {
      const jobData = {
        ...newJob,
        applications: 0,
        target: newJob.headcount,
        hired: 0,
        openDate: new Date().toISOString().split("T")[0],
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

      if (editingJob) {
        onUpdateJob(jobData);
      } else {
        onAddJob(jobData);
      }

      setNewJob(initialJobState);
      setJobStages(
        ["Applied", "Screening", "Interview", "Offer", "Hired"].map(
          (name, index) => ({
            id: `stage-${index}`,
            name,
            durationHours: "",
          }),
        ),
      );
      onOpenChange(false);
    }, [newJob, editingJob, onAddJob, onUpdateJob, onOpenChange]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="modal-mobile max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-wrap-safe">
              {editingJob ? "Edit Job" : "Add New Job"}
            </DialogTitle>
            <DialogDescription className="text-wrap-safe">
              {editingJob
                ? "Update the job details below."
                : "Create a new job posting with all the necessary details."}
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
                  onClick={() => onOpenChange(false)}
                  className="btn-mobile"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="btn-mobile">
                  {editingJob ? "Update Job" : "Create Job"}
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
    );
  },
);

export default function Jobs() {
  const { t } = useLanguage();
  const [jobs] = useState<JobData[]>(HARDCODED_JOBS);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [shareJobId, setShareJobId] = useState<string | null>(null);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  
  const { toast } = useToast();

  // Mock candidates data for the apply functionality
  const candidates = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Mike Johnson" },
  ];

  // Handle applying candidate to job
  const handleApplyCandidate = () => {
    if (applyJobId && selectedCandidateId) {
      const selectedCandidate = candidates.find(
        (c) => c.id === selectedCandidateId,
      );
      const selectedJob = jobs.find((j) => j.id === applyJobId);

      toast({
        title: "Candidate Applied",
        description: `${selectedCandidate?.name} has been applied to ${selectedJob?.position}`,
      });

      setApplyJobId(null);
      setSelectedCandidateId(null);
    }
  };

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

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus &&
      matchesPriority &&
      matchesRecruiter
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, statusFilter, priorityFilter, recruiterFilter]);

  const applyJob = filteredJobs.find((job) => job.id === applyJobId);

  const stats = [
    {
      title: "Active Jobs",
      value: jobs.filter((j) => j.status === "Open").length.toString(),
      change: "+3",
      color: "blue",
    },
    {
      title: "Total Applications",
      value: jobs.reduce((acc, job) => acc + job.applications, 0).toString(),
      change: "+45",
      color: "green",
    },
    {
      title: "Positions Filled",
      value: jobs.reduce((acc, job) => acc + job.hired, 0).toString(),
      change: "+2",
      color: "purple",
    },
    // {
    //   title: "Avg. Time to Fill",
    //   value: "28 days",
    //   change: "-5",
    //   color: "orange",
    // },
  ];

  const handleAddJob = useCallback(
    (jobData: any) => {
      try {
        // In a real app, this would create the job
        toast({
          title: "Job Created",
          description: `"${jobData.position}" has been successfully created.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create job. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const handleUpdateJob = useCallback(
    (jobData: any) => {
      try {
        // In a real app, this would update the job
        toast({
          title: "Job Updated",
          description: `"${jobData.position}" has been successfully updated.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update job. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const handleEditJob = useCallback((job: JobData) => {
    setEditingJob(job);
    setShowAddJobDialog(true);
  }, []);

  const handleDeleteJob = useCallback(
    (jobId: string) => {
      try {
        // In a real app, this would delete the job
        toast({
          title: "Job Deleted",
          description: "The job has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const handleShareJob = useCallback(
    (jobId: string) => {
      const shareUrl = `${window.location.origin}/jobs/${jobId}/public`;
      navigator.clipboard.writeText(shareUrl);
      setShareJobId(null);
      toast({
        title: "Link Copied",
        description: "Job sharing link has been copied to clipboard.",
      });
    },
    [toast],
  );

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
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return <Badge className="text-xs">{priority}</Badge>;
    }
  };

  const ListView = memo(() => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleFields.position && <TableHead>Job Position</TableHead>}
                {visibleFields.department && <TableHead>Department</TableHead>}
                {visibleFields.recruiter && <TableHead>Recruiter</TableHead>}
                {visibleFields.priority && <TableHead>Priority</TableHead>}
                {visibleFields.applications && (
                  <TableHead>Applications</TableHead>
                )}
                {visibleFields.target && <TableHead>Target</TableHead>}
                {visibleFields.hired && <TableHead>Hired</TableHead>}
                {visibleFields.process && <TableHead>Process</TableHead>}
                {visibleFields.pipelineSummary && (
                  <TableHead>Pipeline Summary</TableHead>
                )}
                {visibleFields.openDate && <TableHead>Open Date</TableHead>}
                {visibleFields.deadline && <TableHead>Deadline</TableHead>}
                {visibleFields.estimatedCost && (
                  <TableHead>Est. Cost</TableHead>
                )}
                {visibleFields.actualCost && <TableHead>Actual Cost</TableHead>}
                {visibleFields.performance && (
                  <TableHead>Performance</TableHead>
                )}
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-slate-50">
                  {visibleFields.position && (
                    <TableCell>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-medium hover:text-blue-600 break-words max-w-48 block"
                      >
                        {job.position}
                      </Link>
                    </TableCell>
                  )}
                  {visibleFields.department && (
                    <TableCell className="break-words max-w-32">
                      {job.department}
                    </TableCell>
                  )}
                  {visibleFields.recruiter && (
                    <TableCell className="break-words max-w-32">
                      {job.recruiter}
                    </TableCell>
                  )}
                  {visibleFields.priority && (
                    <TableCell>
                      <div className="flex-shrink-0">
                        {getPriorityBadge(job.priority)}
                      </div>
                    </TableCell>
                  )}
                  {visibleFields.applications && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span>{job.applications}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleFields.target && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span>{job.target}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleFields.hired && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{job.hired}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleFields.process && (
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>
                            {job.hired}/{job.target}
                          </span>
                          <span>
                            {Math.round((job.hired / job.target) * 100)}%
                          </span>
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
                        <div className="font-medium text-green-600">
                          {job.pipelineSummary.hired} Hired
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleFields.openDate && (
                    <TableCell className="break-words max-w-32">
                      {job.openDate}
                    </TableCell>
                  )}
                  {visibleFields.deadline && (
                    <TableCell className="break-words max-w-32">
                      {job.deadline}
                    </TableCell>
                  )}
                  {visibleFields.estimatedCost && (
                    <TableCell className="break-words max-w-32">
                      {job.estimatedCost}
                    </TableCell>
                  )}
                  {visibleFields.actualCost && (
                    <TableCell className="break-words max-w-32">
                      {job.actualCost}
                    </TableCell>
                  )}
                  {visibleFields.performance && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TrendingUp
                          className={`w-4 h-4 ${getPerformanceColor(job.performance)} flex-shrink-0`}
                        />
                        <span className={getPerformanceColor(job.performance)}>
                          {job.performance}%
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex-shrink-0">
                      {getStatusBadge(job.status)}
                    </div>
                  </TableCell>
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
                        {/* Action add to apply specific candidate on this job */}
                        <DropdownMenuItem onClick={() => setApplyJobId(job.id)}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Apply Candidate
                        </DropdownMenuItem>

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
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Job</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{job.position}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteJob(job.id)}
                              >
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
          <Dialog
            open={!!applyJobId}
            onOpenChange={(open) => !open && setApplyJobId(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply Candidate</DialogTitle>
                <DialogDescription>
                  Select a candidate to apply to job:{" "}
                  <strong>{applyJob?.position}</strong>
                </DialogDescription>
              </DialogHeader>

              <Select onValueChange={(value) => setSelectedCandidateId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DialogFooter>
                <Button variant="outline" onClick={() => setApplyJobId(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyCandidate}
                  disabled={!selectedCandidateId}
                >
                  Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  ));

  const GridView = memo(() => (
    <div className="grid-responsive">
      {currentJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={handleEditJob}
          onShare={setShareJobId}
          onDelete={handleDeleteJob}
          getPerformanceColor={getPerformanceColor}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
        />
      ))}
    </div>
  ));

  return (
    <div className="padding-responsive space-mobile">
      {/* Header */}
      <div className="flex-responsive justify-responsive items-responsive space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="heading-responsive text-wrap-safe">
            {t("jobs.title")}
          </h1>
          <p className="text-responsive-base text-slate-600 mt-1 text-wrap-safe">
            {t("jobs.subtitle")}
          </p>
        </div>
        <div className="btn-group-mobile">
          <Button
            size="sm"
            onClick={() => setShowAddJobDialog(true)}
            className="btn-mobile"
          >
            <Plus className="icon-mobile mr-2" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-mobile grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6 card-mobile">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-responsive-sm text-slate-600 text-wrap-safe">
                    {stat.title}
                  </p>
                  <p className="text-responsive-xl font-bold text-slate-900 text-wrap-safe">
                    {stat.value}
                  </p>
                  <p className="text-responsive-sm text-green-600 text-wrap-safe">
                    {stat.change} vs last month
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full bg-${stat.color}-100 flex-shrink-0`}
                >
                  <Briefcase className={`icon-mobile text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6 card-mobile">
          <div className="flex-responsive gap-4 justify-responsive">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="btn-mobile"
                >
                  <List className="icon-mobile mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="btn-mobile"
                >
                  <Grid3X3 className="icon-mobile mr-2" />
                  Grid
                </Button>
              </div>
              {viewMode === "list" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="btn-mobile">
                      <Settings className="icon-mobile mr-2" />
                      Fields
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 dropdown-mobile">
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
                        className="text-wrap-safe"
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="filters-mobile">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs by position, department, recruiter..."
                    className="pl-10 search-mobile text-wrap-safe"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="filters-mobile">
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-32 btn-mobile">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-mobile">
                    <SelectItem value="all" className="text-wrap-safe">
                      All Departments
                    </SelectItem>
                    <SelectItem value="engineering" className="text-wrap-safe">
                      Engineering
                    </SelectItem>
                    <SelectItem value="product" className="text-wrap-safe">
                      Product
                    </SelectItem>
                    <SelectItem value="design" className="text-wrap-safe">
                      Design
                    </SelectItem>
                    <SelectItem value="marketing" className="text-wrap-safe">
                      Marketing
                    </SelectItem>
                    <SelectItem value="data" className="text-wrap-safe">
                      Data
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 btn-mobile">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-mobile">
                    <SelectItem value="all" className="text-wrap-safe">
                      All Status
                    </SelectItem>
                    <SelectItem value="open" className="text-wrap-safe">
                      Open
                    </SelectItem>
                    <SelectItem value="closed" className="text-wrap-safe">
                      Closed
                    </SelectItem>
                    <SelectItem value="in progress" className="text-wrap-safe">
                      In Progress
                    </SelectItem>
                    <SelectItem value="paused" className="text-wrap-safe">
                      Paused
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-32 btn-mobile">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-mobile">
                    <SelectItem value="all" className="text-wrap-safe">
                      All Priority
                    </SelectItem>
                    <SelectItem value="high" className="text-wrap-safe">
                      High
                    </SelectItem>
                    <SelectItem value="medium" className="text-wrap-safe">
                      Medium
                    </SelectItem>
                    <SelectItem value="low" className="text-wrap-safe">
                      Low
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="btn-mobile">
                  <Filter className="icon-mobile mr-2" />
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
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="btn-mobile"
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
                    className="btn-mobile"
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="px-2 py-1">...</span>;
              }
              return null;
            })}
            
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn-mobile"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AddJobForm
        open={showAddJobDialog}
        onOpenChange={(open) => {
          setShowAddJobDialog(open);
          if (!open) setEditingJob(null);
        }}
        onAddJob={handleAddJob}
        onUpdateJob={handleUpdateJob}
        editingJob={editingJob}
      />

      {/* Share Job Dialog */}
      <Dialog open={!!shareJobId} onOpenChange={() => setShareJobId(null)}>
        <DialogContent className="modal-mobile">
          <DialogHeader>
            <DialogTitle className="text-wrap-safe">Share Job</DialogTitle>
            <DialogDescription className="text-wrap-safe">
              Generate a shareable link for this job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded">
              <Input
                value={
                  shareJobId
                    ? `${window.location.origin}/jobs/${shareJobId}/public`
                    : ""
                }
                readOnly
                className="flex-1 text-wrap-safe"
              />
              <Button
                size="sm"
                onClick={() => shareJobId && handleShareJob(shareJobId)}
                className="btn-mobile"
              >
                <Copy className="icon-mobile mr-2" />
                Copy
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShareJobId(null)}
                className="btn-mobile"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
