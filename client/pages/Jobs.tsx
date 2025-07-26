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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Copy,
  Trash2,
  Share,
  DollarSign,
  TrendingUp,
  Target,
  Building,
  User,
  Clock,
  Settings,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type JobData = {
  id: number;
  position: string;
  department: string;
  recruiter: string;
  applications: number;
  target: number;
  hired: number;
  openDate: string;
  deadline: string;
  estimatedCost: string;
  actualCost: string;
  performance: number;
  status: "Open" | "Closed" | "In Progress";
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
  priority: "High" | "Medium" | "Low";
};

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);

  // Form state for new job
  const [newJob, setNewJob] = useState({
    emailAlias: "",
    department: "",
    location: "",
    position: "",
    employmentType: "",
    expectedSkills: [] as string[],
    salaryMin: "",
    salaryMax: "",
    domain: "",
    headcount: "",
    recruiter: "",
    interviewers: [] as string[],
    description: "",
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
  });

  const jobs: JobData[] = [
    {
      id: 1,
      position: "Senior Frontend Developer",
      department: "Engineering",
      recruiter: "Alex Chen",
      applications: 45,
      target: 2,
      hired: 1,
      openDate: "2024-01-10",
      deadline: "2024-02-15",
      estimatedCost: "$15,000",
      actualCost: "$12,500",
      performance: 85,
      status: "Open",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "We are looking for a Senior Frontend Developer to join our team...",
      priority: "High",
    },
    {
      id: 2,
      position: "Product Manager",
      department: "Product",
      recruiter: "Sarah Kim",
      applications: 67,
      target: 1,
      hired: 0,
      openDate: "2024-01-05",
      deadline: "2024-02-20",
      estimatedCost: "$18,000",
      actualCost: "$16,200",
      performance: 72,
      status: "In Progress",
      location: "New York, NY",
      type: "Full-time",
      description: "Seeking an experienced Product Manager to drive product strategy...",
      priority: "High",
    },
    {
      id: 3,
      position: "UX Designer",
      department: "Design",
      recruiter: "Mike Wilson",
      applications: 28,
      target: 1,
      hired: 1,
      openDate: "2023-12-20",
      deadline: "2024-01-25",
      estimatedCost: "$10,000",
      actualCost: "$8,500",
      performance: 95,
      status: "Closed",
      location: "Remote",
      type: "Full-time",
      description: "Join our design team as a UX Designer to create exceptional user experiences...",
      priority: "Medium",
    },
    {
      id: 4,
      position: "Data Scientist",
      department: "Data",
      recruiter: "Alex Chen",
      applications: 34,
      target: 2,
      hired: 0,
      openDate: "2024-01-15",
      deadline: "2024-03-01",
      estimatedCost: "$20,000",
      actualCost: "$14,000",
      performance: 68,
      status: "Open",
      location: "Seattle, WA",
      type: "Full-time",
      description: "We're hiring a Data Scientist to help us leverage data for business insights...",
      priority: "Medium",
    },
    {
      id: 5,
      position: "DevOps Engineer",
      department: "Engineering",
      recruiter: "Sarah Kim",
      applications: 23,
      target: 1,
      hired: 0,
      openDate: "2024-01-12",
      deadline: "2024-02-28",
      estimatedCost: "$16,000",
      actualCost: "$11,000",
      performance: 78,
      status: "Open",
      location: "Austin, TX",
      type: "Full-time",
      description: "Looking for a DevOps Engineer to optimize our infrastructure and deployment processes...",
      priority: "Low",
    },
  ];

  const stats = [
    { title: "Active Jobs", value: "12", change: "+3", color: "blue" },
    { title: "Total Applications", value: "487", change: "+45", color: "green" },
    { title: "Positions Filled", value: "8", change: "+2", color: "purple" },
    { title: "Avg. Time to Fill", value: "28 days", change: "-5", color: "orange" },
  ];

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

    const matchesRecruiter =
      recruiterFilter === "all" ||
      job.recruiter.toLowerCase().includes(recruiterFilter.toLowerCase());

    return matchesSearch && matchesDepartment && matchesStatus && matchesRecruiter;
  });

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
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const AddJobForm = () => (
    <Dialog open={showAddJobDialog} onOpenChange={setShowAddJobDialog}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Create a new job posting with all the necessary details.
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
                <label className="text-sm font-medium text-slate-700">Email Alias</label>
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
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
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
                <label className="text-sm font-medium text-slate-700">Employment Type</label>
                <Select value={newJob.employmentType} onValueChange={(value) => setNewJob({...newJob, employmentType: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Domain/Industry</label>
                <Input
                  placeholder="Technology, Finance, Healthcare"
                  value={newJob.domain}
                  onChange={(e) => setNewJob({...newJob, domain: e.target.value})}
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
                <label className="text-sm font-medium text-slate-700">Headcount</label>
                <Input
                  placeholder="2"
                  type="number"
                  value={newJob.headcount}
                  onChange={(e) => setNewJob({...newJob, headcount: e.target.value})}
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
                    <SelectItem value="alex-chen">Alex Chen</SelectItem>
                    <SelectItem value="sarah-kim">Sarah Kim</SelectItem>
                    <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
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
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddJobDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddJobDialog(false)}>
                Create Job
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
              {/* Field Visibility Settings */}
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
                  </SelectContent>
                </Select>
                <Select value={recruiterFilter} onValueChange={setRecruiterFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Recruiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Recruiters</SelectItem>
                    <SelectItem value="alex chen">Alex Chen</SelectItem>
                    <SelectItem value="sarah kim">Sarah Kim</SelectItem>
                    <SelectItem value="mike wilson">Mike Wilson</SelectItem>
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

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleFields.position && <TableHead>Job Position</TableHead>}
                {visibleFields.department && <TableHead>Department</TableHead>}
                {visibleFields.recruiter && <TableHead>Recruiter</TableHead>}
                {visibleFields.applications && <TableHead>Applications</TableHead>}
                {visibleFields.target && <TableHead>Target</TableHead>}
                {visibleFields.hired && <TableHead>Hired</TableHead>}
                {visibleFields.process && <TableHead>Process</TableHead>}
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
                  {visibleFields.openDate && <TableCell>{job.openDate}</TableCell>}
                  {visibleFields.deadline && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{job.deadline}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleFields.estimatedCost && <TableCell>{job.estimatedCost}</TableCell>}
                  {visibleFields.actualCost && <TableCell>{job.actualCost}</TableCell>}
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
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </div>
  );
}
