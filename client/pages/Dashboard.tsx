import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { HARDCODED_JOBS, JobData } from "@/data/hardcoded-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
export default function Dashboard() {
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);

  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
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
    interviewers: [] as string[],
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    deadline: "",
    estimatedCost: "",
  });

  const handleAddJob = () => {
    try {
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

      // In a real app, this would create the job
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
        description: `"${newJob.position}" has been successfully created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;

    try {
      // In a real app, this would update the job
      setShowAddJobDialog(false);
      setEditingJob(null);

      toast({
        title: "Job Updated",
        description: `"${newJob.position}" has been successfully updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      });
    }
  };

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
  const stats = [
    {
      title: "Active Jobs",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Briefcase,
      color: "blue",
    },
    {
      title: "Total Candidates",
      value: "1,847",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "green",
    },
    {
      title: "Interviews This Week",
      value: "67",
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
      color: "orange",
    },
    {
      title: "Avg. Time to Hire",
      value: "18 days",
      change: "-2 days",
      changeType: "positive" as const,
      icon: Target,
      color: "purple",
    },
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      applicants: 45,
      status: "Active",
      priority: "High",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      applicants: 32,
      status: "Active",
      priority: "Medium",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      applicants: 28,
      status: "Draft",
      priority: "Low",
    },
    {
      id: 4,
      title: "Data Scientist",
      department: "Analytics",
      applicants: 19,
      status: "Active",
      priority: "High",
    },
  ];

  const pipeline = [
    { stage: "Applied", count: 145, percentage: 100 },
    { stage: "Screening", count: 67, percentage: 46 },
    { stage: "Interview", count: 23, percentage: 16 },
    { stage: "Offer", count: 8, percentage: 6 },
    { stage: "Hired", count: 5, percentage: 3 },
  ];

  const AddJobForm = () => (
    <Dialog
      open={showAddJobDialog}
      onOpenChange={(open) => {
        setShowAddJobDialog(open);
        if (!open) {
          setEditingJob(null);
        }
      }}
    >
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="text-wrap-safe">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="text-wrap-safe">
              Job Details
            </TabsTrigger>
            <TabsTrigger value="team" className="text-wrap-safe">
              Team & Budget
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
                    <SelectItem value="Engineering" className="text-wrap-safe">
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
                    <SelectItem value="Mike Wilson" className="text-wrap-safe">
                      Mike Wilson
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-responsive-sm font-medium text-slate-700 text-wrap-safe">
                Interviewers
              </label>
              <Input
                placeholder="Select team members who will conduct interviews"
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
                onClick={() => setShowAddJobDialog(false)}
                className="btn-mobile"
              >
                Cancel
              </Button>
              <Button
                onClick={editingJob ? handleUpdateJob : handleAddJob}
                className="btn-mobile"
              >
                {editingJob ? "Update Job" : "Create Job"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="padding-responsive space-mobile">
      {/* Header */}
      <div className="flex-responsive justify-responsive items-responsive space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="heading-responsive text-wrap-safe">Dashboard</h1>
          <p className="text-responsive-base text-slate-600 mt-1 text-wrap-safe">
            Welcome back! Here's what's happening with your recruitment.
          </p>
        </div>
        <div className="btn-group-mobile">
          <Button variant="outline" size="sm" className="btn-mobile">
            
            <Filter className="icon-mobile mr-2" />
            Filter
          </Button>
          <Button size="sm" asChild className="btn-mobile">
            {/* <Link to="/jobs/create">
              <Plus className="icon-mobile mr-2" />
              New Jobbbb
            </Link> */}
          </Button>

          <Button
            size="sm"
            
            onClick={() => {
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
              setEditingJob(null);
              setShowAddJobDialog(true);
              {console.log("Rendering Add Job Dialog")}
              {console.log("showAddJobDialog:", showAddJobDialog)}

            }}
            className="btn-mobile"
          >
            <Plus className="icon-mobile mr-2" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-mobile">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden card-responsive"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg bg-${stat.color}-100 flex-shrink-0`}
              >
                <stat.icon className={`icon-mobile text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent className="card-mobile">
              <div className="text-responsive-xl font-bold text-slate-900 text-wrap-safe">
                {stat.value}
              </div>
              <div className="flex items-center mt-1">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="icon-mobile text-green-500" />
                ) : (
                  <ArrowDownRight className="icon-mobile text-red-500" />
                )}
                <span
                  className={`text-responsive-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  } text-wrap-safe`}
                >
                  {stat.change}
                </span>
                <span className="text-responsive-sm text-slate-500 ml-2 hidden sm:inline text-wrap-safe">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recruitment Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-responsive-lg text-wrap-safe">
                Recruitment Pipeline
              </span>
              <Button variant="ghost" size="sm" className="icon-mobile">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="card-mobile">
            <div className="space-mobile">
              {pipeline.map((stage) => (
                <div
                  key={stage.stage}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-slate-700 text-responsive-base truncate-mobile text-wrap-safe">
                      {stage.stage}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0 badge-mobile"
                    >
                      {stage.count}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 w-24 sm:w-32 flex-shrink-0">
                    <Progress
                      value={stage.percentage}
                      className="progress-mobile flex-1"
                    />
                    <span className="text-responsive-sm text-slate-500 w-8 sm:w-10 text-right text-wrap-safe">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-responsive-lg text-wrap-safe">
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-mobile">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                Cost per Hire
              </span>
              <span className="font-semibold text-responsive-base text-wrap-safe">
                $3,200
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                Hiring Success Rate
              </span>
              <span className="font-semibold text-green-600 text-responsive-base text-wrap-safe">
                85%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                Source Effectiveness
              </span>
              <span className="font-semibold text-responsive-base text-wrap-safe">
                LinkedIn: 45%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                Pending Interviews
              </span>
              <span className="font-semibold text-orange-600 text-responsive-base text-wrap-safe">
                12
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-responsive-lg text-wrap-safe">
              Recent Job Postings
            </span>
            <Button variant="ghost" size="sm" asChild className="btn-mobile">
              <Link to="/jobs">View All</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="card-mobile">
          {/* Mobile Card View */}
          <div className="table-mobile-card space-mobile">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="border border-slate-200 rounded-lg p-4 space-y-3 card-responsive"
              >
                <div className="flex justify-between items-start min-w-0">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600 text-responsive-base text-wrap-safe min-w-0 flex-1 truncate"
                  >
                    {job.title}
                  </Link>
                  <Badge
                    variant={job.status === "Active" ? "default" : "secondary"}
                    className="badge-mobile flex-shrink-0"
                  >
                    {job.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-responsive-sm text-slate-600 min-w-0">
                  <span className="text-wrap-safe truncate flex-1">
                    {job.department}
                  </span>
                  <span className="text-wrap-safe flex-shrink-0 ml-2">
                    {job.applicants} applicants
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge
                    variant={
                      job.priority === "High"
                        ? "destructive"
                        : job.priority === "Medium"
                          ? "default"
                          : "secondary"
                    }
                    className="badge-mobile"
                  >
                    {job.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="table-desktop overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    Job Title
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    Department
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    Applicants
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    Status
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600 text-wrap-safe truncate max-w-48 block"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600 text-wrap-safe truncate max-w-32">
                      {job.department}
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary" className="badge-mobile">
                        {job.applicants}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          job.status === "Active" ? "default" : "secondary"
                        }
                        className="badge-mobile"
                      >
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          job.priority === "High"
                            ? "destructive"
                            : job.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="badge-mobile"
                      >
                        {job.priority}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
