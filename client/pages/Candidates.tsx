import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Plus,
  Search,
  Filter,
  Upload,
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
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Candidates() {
  const [selectedView, setSelectedView] = useState("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 0123",
      location: "San Francisco, CA",
      position: "Senior Frontend Developer",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      status: "Active",
      stage: "Interview",
      rating: 5,
      appliedDate: "2024-01-15",
      resume: "sarah_johnson_resume.pdf",
      avatar: "",
      salary: "$120k - $140k",
      source: "LinkedIn",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 0124",
      location: "New York, NY",
      position: "Product Manager",
      experience: "4+ years",
      skills: ["Product Strategy", "Agile", "Data Analysis", "UX Design"],
      status: "Active",
      stage: "Offer",
      rating: 4,
      appliedDate: "2024-01-12",
      resume: "michael_chen_resume.pdf",
      avatar: "",
      salary: "$110k - $130k",
      source: "Website",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 0125",
      location: "Austin, TX",
      position: "UX Designer",
      experience: "3+ years",
      skills: ["Figma", "Sketch", "User Research", "Prototyping"],
      status: "Active",
      stage: "Screening",
      rating: 4,
      appliedDate: "2024-01-10",
      resume: "emily_davis_resume.pdf",
      avatar: "",
      salary: "$85k - $105k",
      source: "Indeed",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.k@email.com",
      phone: "+1 (555) 0126",
      location: "Seattle, WA",
      position: "Data Scientist",
      experience: "6+ years",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      status: "Active",
      stage: "Technical",
      rating: 5,
      appliedDate: "2024-01-08",
      resume: "david_kim_resume.pdf",
      avatar: "",
      salary: "$130k - $150k",
      source: "Referral",
    },
    {
      id: 5,
      name: "Lisa Garcia",
      email: "lisa.g@email.com",
      phone: "+1 (555) 0127",
      location: "Remote",
      position: "DevOps Engineer",
      experience: "5+ years",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
      status: "Active",
      stage: "Final",
      rating: 4,
      appliedDate: "2024-01-05",
      resume: "lisa_garcia_resume.pdf",
      avatar: "",
      salary: "$115k - $135k",
      source: "LinkedIn",
    },
    {
      id: 6,
      name: "Robert Taylor",
      email: "robert.t@email.com",
      phone: "+1 (555) 0128",
      location: "Boston, MA",
      position: "Marketing Specialist",
      experience: "2+ years",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      status: "Inactive",
      stage: "Rejected",
      rating: 2,
      appliedDate: "2024-01-03",
      resume: "robert_taylor_resume.pdf",
      avatar: "",
      salary: "$60k - $75k",
      source: "Website",
    },
  ];

  const stats = [
    {
      title: "Total Candidates",
      value: "1,847",
      change: "+12%",
      color: "blue",
    },
    { title: "Active Pipeline", value: "156", change: "+8%", color: "green" },
    {
      title: "Interviews Scheduled",
      value: "23",
      change: "+15%",
      color: "orange",
    },
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

    return matchesSearch && matchesPosition && matchesStage && matchesLocation;
  });

  const CandidateCard = ({
    candidate,
  }: {
    candidate: (typeof candidates)[0];
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Link
            to={`/candidates/${candidate.id}`}
            className="flex items-center space-x-3 hover:bg-slate-100 p-2 rounded-md transition"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
              <p className="text-sm text-slate-600">{candidate.position}</p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to={`/Candidate/${candidates.id}`}>
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
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-slate-600">
          <Mail className="w-4 h-4 mr-2" />
          {candidate.email}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Phone className="w-4 h-4 mr-2" />
          {candidate.phone}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <MapPin className="w-4 h-4 mr-2" />
          {candidate.location}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Briefcase className="w-4 h-4 mr-2" />
          {candidate.experience}
        </div>

        <div className="flex flex-wrap gap-1 pt-2">
          {candidate.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{candidate.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1">
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
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                candidate.stage === "Offer"
                  ? "default"
                  : candidate.stage === "Final"
                    ? "secondary"
                    : candidate.stage === "Technical"
                      ? "outline"
                      : candidate.stage === "Interview"
                        ? "default"
                        : candidate.stage === "Screening"
                          ? "secondary"
                          : "destructive"
              }
              className="text-xs"
            >
              {candidate.stage}
            </Badge>
            <Badge
              variant={candidate.status === "Active" ? "default" : "outline"}
              className="text-xs"
            >
              {candidate.status}
            </Badge>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-600 mt-1">
            Manage candidate profiles, applications, and track their progress
            through your pipeline.
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Candidates</DialogTitle>
                <DialogDescription>
                  Upload a CSV or JSON file to import multiple candidates at
                  once.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">
                    Drop your file here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button size="sm" className="flex-1">
                    Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                  Create a new candidate profile manually or upload their
                  resume.
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
                      <label className="text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <Input placeholder="John Doe" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Phone
                      </label>
                      <Input placeholder="+1 (555) 123-4567" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Location
                      </label>
                      <Input placeholder="City, State" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Position
                      </label>
                      <Input placeholder="Software Engineer" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Experience
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">
                            Entry Level (0-2 years)
                          </SelectItem>
                          <SelectItem value="mid">
                            Mid Level (3-5 years)
                          </SelectItem>
                          <SelectItem value="senior">
                            Senior Level (5+ years)
                          </SelectItem>
                          <SelectItem value="lead">
                            Lead/Principal (8+ years)
                          </SelectItem>
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
                    <h4 className="text-lg font-medium text-slate-900 mb-2">
                      Upload Resume/CV
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      We'll automatically extract candidate information from the
                      resume
                    </p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
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
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600">
                    {stat.change} vs last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <User className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="fullstack">
                    Full Stack Developer
                  </SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="product">Product Manager</SelectItem>
                  <SelectItem value="data">Data Scientist</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No candidates found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search or filters to find candidates.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 text-blue-600"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
