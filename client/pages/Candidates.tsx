import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Filter,
  Download,
  Star,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  MoreHorizontal,
  User,
  Briefcase,
  Eye,
  Edit,
  Trash2,
  Share,
  Grid3X3,
  List,
  Settings,
  Clock,
  DollarSign,
  Building,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

type CandidateData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  experience: string;
  skills: string[];
  status: string;
  stage: string;
  rating: number;
  appliedDate: string;
  resume: string;
  avatar: string;
  salary: string;
  source: string;
  recruiter: string;
  department: string;
  duration: number; // days in current stage
};

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { toast } = useToast();

  // Load candidates and user preferences
  useEffect(() => {
    let storedCandidates = storage.getCandidates();

    // Add demo data if we don't have enough candidates
    if (storedCandidates.length < 5) {
      storage.addDemoData();
      storedCandidates = storage.getCandidates();
    }

    setCandidates(storedCandidates);

    // Load user preferences
    const prefs = storage.getUserPreferences();
    setDepartmentFilter(prefs.selectedFilters.candidates.department);
    setStageFilter(prefs.selectedFilters.candidates.stage);
    setLocationFilter(prefs.selectedFilters.candidates.location);
    setRecruiterFilter(prefs.selectedFilters.candidates.recruiter);
    setViewMode(prefs.viewPreferences.candidatesView);
  }, []);

  // Save user preferences when filters change
  useEffect(() => {
    storage.updateUserPreferences({
      selectedFilters: {
        ...storage.getUserPreferences().selectedFilters,
        candidates: {
          department: departmentFilter,
          stage: stageFilter,
          recruiter: recruiterFilter,
          location: locationFilter,
        }
      },
      viewPreferences: {
        ...storage.getUserPreferences().viewPreferences,
        candidatesView: viewMode,
      }
    });
  }, [departmentFilter, stageFilter, recruiterFilter, locationFilter, viewMode]);

  // Customizable field visibility for list view
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    appliedDate: true,
    email: true,
    phone: true,
    position: true,
    recruiter: true,
    stage: true,
    source: true,
    salary: false,
    location: false,
    department: false,
  });



  const stages = ["Applied", "Screening", "Interview", "Technical", "Offer", "Hired", "Rejected"];

  const stats = [
    { title: "Total Candidates", value: "1,847", change: "+12%", color: "blue" },
    { title: "Active Pipeline", value: "156", change: "+8%", color: "green" },
    { title: "Interviews Scheduled", value: "23", change: "+15%", color: "orange" },
    { title: "Offers Extended", value: "8", change: "+3%", color: "purple" },
  ];

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesPosition =
      positionFilter === "all" ||
      candidate.position.toLowerCase().includes(positionFilter.toLowerCase());
    const matchesStage =
      stageFilter === "all" ||
      candidate.stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesLocation =
      locationFilter === "all" ||
      candidate.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" ||
      candidate.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesRecruiter =
      recruiterFilter === "all" ||
      candidate.recruiter.toLowerCase().includes(recruiterFilter.toLowerCase());

    return matchesSearch && matchesPosition && matchesStage && matchesLocation && 
           matchesDepartment && matchesRecruiter;
  });

  const CandidateCard = ({ candidate }: { candidate: CandidateData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Link
            to={`/candidates/${candidate.id}`}
            className="flex items-center space-x-3 hover:bg-slate-100 p-2 rounded-md transition"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">{candidate.name}</h3>
              <p className="text-xs text-slate-600">{candidate.position}</p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to={`/candidates/${candidate.id}`}>
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Candidate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="w-4 h-4 mr-2" />
                Share Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Candidate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-xs text-slate-600">
          <Building className="w-3 h-3 mr-1" />
          {candidate.department}
        </div>
        <div className="flex items-center text-xs text-slate-600">
          <Clock className="w-3 h-3 mr-1" />
          {candidate.duration} days in stage
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < candidate.rating
                    ? "text-yellow-400 fill-current"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <Badge variant="outline" className="text-xs">
            {candidate.recruiter}
          </Badge>
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
              {visibleFields.name && <TableHead>Candidate Name</TableHead>}
              {visibleFields.appliedDate && <TableHead>Applied On</TableHead>}
              {visibleFields.email && <TableHead>Email</TableHead>}
              {visibleFields.phone && <TableHead>Phone</TableHead>}
              {visibleFields.position && <TableHead>Job Position</TableHead>}
              {visibleFields.recruiter && <TableHead>Recruiter</TableHead>}
              {visibleFields.stage && <TableHead>Current Stage</TableHead>}
              {visibleFields.source && <TableHead>Source</TableHead>}
              {visibleFields.salary && <TableHead>Salary</TableHead>}
              {visibleFields.location && <TableHead>Location</TableHead>}
              {visibleFields.department && <TableHead>Department</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-slate-50">
                {visibleFields.name && (
                  <TableCell>
                    <Link
                      to={`/candidates/${candidate.id}`}
                      className="flex items-center space-x-3 hover:text-blue-600"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback className="text-xs">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < candidate.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                )}
                {visibleFields.appliedDate && <TableCell>{candidate.appliedDate}</TableCell>}
                {visibleFields.email && <TableCell>{candidate.email}</TableCell>}
                {visibleFields.phone && <TableCell>{candidate.phone}</TableCell>}
                {visibleFields.position && <TableCell>{candidate.position}</TableCell>}
                {visibleFields.recruiter && <TableCell>{candidate.recruiter}</TableCell>}
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
                    >
                      {candidate.stage}
                    </Badge>
                  </TableCell>
                )}
                {visibleFields.source && <TableCell>{candidate.source}</TableCell>}
                {visibleFields.salary && <TableCell>{candidate.salary}</TableCell>}
                {visibleFields.location && <TableCell>{candidate.location}</TableCell>}
                {visibleFields.department && <TableCell>{candidate.department}</TableCell>}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link to={`/candidates/${candidate.id}`}>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Candidate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
      </CardContent>
    </Card>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {stages.map((stage) => {
        const stageCandidates = filteredCandidates.filter(
          (candidate) => candidate.stage === stage
        );
        return (
          <div key={stage} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900">{stage}</h3>
              <Badge variant="outline" className="text-xs">
                {stageCandidates.length}
              </Badge>
            </div>
            <div className="space-y-3 min-h-[200px] bg-slate-50 rounded-lg p-3">
              {stageCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
              {stageCandidates.length === 0 && (
                <div className="text-center text-slate-400 text-xs py-8">
                  No candidates
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-600 mt-1">
            Manage candidate profiles, applications, and track their progress through your pipeline.
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
                <DialogDescription>
                  Create a new candidate profile manually or upload their resume.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <Input placeholder="John Doe" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <Input type="email" placeholder="john@example.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Phone</label>
                      <Input placeholder="+1 (555) 123-4567" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Location</label>
                      <Input placeholder="City, State" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Position</label>
                      <Input placeholder="Software Engineer" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Department</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="data">Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Candidate</Button>
                  </div>
                </TabsContent>
                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-slate-900 mb-2">Upload Resume/CV</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      We'll automatically extract candidate information from the resume
                    </p>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
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
                  <p className="text-sm text-green-600">{stat.change} vs last month</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <User className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Toggle and Filters */}
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
                      Fields
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
                    placeholder="Search candidates by name, position, skills..."
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
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage.toLowerCase()}>
                        {stage}
                      </SelectItem>
                    ))}
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
    </div>
  );
}
