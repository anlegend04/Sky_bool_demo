import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailTrigger } from "@/components/EmailTrigger";
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
  UserPlus,
  Upload,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
  FileCheck,
  Users,
  RefreshCw,
  AlertTriangle,
  GraduationCap,
  Trophy,
  Zap,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { HARDCODED_CANDIDATES, CandidateData } from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

// Types for CV parsing and management
interface ParsedCandidate {
  id: string;
  fileName: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  isEditing: boolean;
  isConfirmed: boolean;
  hasMissingInfo: boolean;
  isPotentialDuplicate: boolean;
  parseStatus: "parsing" | "success" | "error";
  fileSize: number;
  uploadedAt: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "parsing" | "complete" | "error";
}

export default function Candidates() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [candidates] = useState<CandidateData[]>(HARDCODED_CANDIDATES);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // CV Upload States
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [parsedCandidates, setParsedCandidates] = useState<ParsedCandidate[]>(
    [],
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [emailTriggerOpen, setEmailTriggerOpen] = useState(false);
  const [selectedCandidateForEmail, setSelectedCandidateForEmail] =
    useState<CandidateData | null>(null);
  const [newStageForEmail, setNewStageForEmail] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [bulkJobPosition, setBulkJobPosition] = useState("");
  const [bulkSource, setBulkSource] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showParseFilters, setShowParseFilters] = useState(false);
  const [parseFilter, setParseFilter] = useState<
    "all" | "incomplete" | "duplicates"
  >("all");

  // Apply candidate to job states (for ListView component)
  const [applyCandidateId, setApplyCandidateId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Manual entry form states
  const [source, setSource] = useState<string | undefined>();
  const [customSource, setCustomSource] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

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

  const stages = [
    "Applied",
    "Screening",
    "Interview",
    "Technical",
    "Offer",
    "Hired",
    "Rejected",
  ];

  const jobs = [
    { id: "1", position: "Frontend Developer" },
    { id: "2", position: "Backend Engineer" },
    { id: "3", position: "Product Manager" },
    { id: "4", position: "UX Designer" },
  ];

  const applyCandidateToJob = (candidateId: string, jobId: string) => {
    console.log(`Applying candidate ${candidateId} to job ${jobId}`);
    toast({
      title: "Candidate Applied",
      description: `Candidate has been applied to the selected job.`,
    });
  };

  const applyCandidate = candidates.find((c) => c.id === applyCandidateId);

  const stats = [
    {
      title: t("candidates.title"),
      value: candidates.length.toString(),
      change: "+12%",
      color: "blue",
    },
    {
      title: "Active Pipeline",
      value: candidates.filter((c) => c.status === "Active").length.toString(),
      change: "+8%",
      color: "green",
    },
    {
      title: "Interviews Scheduled",
      value: candidates
        .filter((c) => c.stage === "Interview")
        .length.toString(),
      change: "+15%",
      color: "orange",
    },
    {
      title: "Offers Extended",
      value: candidates.filter((c) => c.stage === "Offer").length.toString(),
      change: "+3%",
      color: "purple",
    },
  ];

  // Mock CV parsing function
  const mockParseCV = useCallback(
    async (file: File): Promise<ParsedCandidate> => {
      const fileName = file.name;
      const id = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Simulate parsing delay
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 3000),
      );

      // Mock parsed data - in real app this would come from CV parsing service
      const mockNames = [
        "John Smith",
        "Sarah Wilson",
        "Michael Chen",
        "Emily Davis",
        "David Brown",
        "Lisa Garcia",
      ];
      const mockEmails = [
        "john.smith@email.com",
        "sarah.wilson@email.com",
        "michael.chen@email.com",
      ];
      const mockPhones = [
        "+1 (555) 123-4567",
        "+1 (555) 987-6543",
        "+1 (555) 456-7890",
      ];
      const mockLocations = [
        "San Francisco, CA",
        "New York, NY",
        "Austin, TX",
        "Seattle, WA",
      ];
      const mockSkills = [
        ["React", "JavaScript", "TypeScript", "Node.js"],
        ["Python", "Django", "PostgreSQL", "AWS"],
        ["Figma", "Sketch", "User Research", "Prototyping"],
        ["Product Strategy", "Agile", "Data Analysis"],
      ];

      const randomName =
        mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomEmail =
        mockEmails[Math.floor(Math.random() * mockEmails.length)];
      const randomSkillSet =
        mockSkills[Math.floor(Math.random() * mockSkills.length)];

      // Simulate missing information randomly
      const hasMissingInfo = Math.random() > 0.7;
      const isPotentialDuplicate = Math.random() > 0.8;

      return {
        id,
        fileName,
        name: hasMissingInfo ? "" : randomName,
        email: hasMissingInfo ? "" : randomEmail,
        phone: hasMissingInfo
          ? ""
          : mockPhones[Math.floor(Math.random() * mockPhones.length)],
        location:
          mockLocations[Math.floor(Math.random() * mockLocations.length)],
        summary: `Experienced professional with ${
          3 + Math.floor(Math.random() * 7)
        } years in the industry. Strong background in ${randomSkillSet
          .slice(0, 2)
          .join(
            " and ",
          )} with proven track record of delivering high-quality results.`,
        skills: randomSkillSet,
        experience: [
          {
            company: "Tech Corp Inc.",
            title: "Senior Developer",
            duration: "2021 - Present",
            description:
              "Led development of key features and mentored junior developers.",
          },
          {
            company: "StartupXYZ",
            title: "Developer",
            duration: "2019 - 2021",
            description: "Built and maintained core application features.",
          },
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Computer Science",
            year: "2019",
          },
        ],
        isEditing: false,
        isConfirmed: false,
        hasMissingInfo,
        isPotentialDuplicate,
        parseStatus: "success",
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
    },
    [],
  );

  // Handle single file upload
  const handleSingleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, or DOCX files only.",
        variant: "destructive",
      });
      return;
    }

    // Start upload progress
    const progressId = file.name;
    setUploadProgress([
      { fileName: file.name, progress: 0, status: "uploading" },
    ]);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress([
        { fileName: file.name, progress: i, status: "uploading" },
      ]);
    }

    // Start parsing
    setUploadProgress([
      { fileName: file.name, progress: 100, status: "parsing" },
    ]);

    try {
      const parsed = await mockParseCV(file);
      setParsedCandidates([parsed]);
      setUploadProgress([
        { fileName: file.name, progress: 100, status: "complete" },
      ]);

      toast({
        title: "CV parsed successfully",
        description: `Extracted information from ${file.name}`,
      });
    } catch (error) {
      setUploadProgress([
        { fileName: file.name, progress: 0, status: "error" },
      ]);
      toast({
        title: "Parsing failed",
        description: "Unable to parse the CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    setIsSubmittingForm(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Candidate Added Successfully",
      description: `${formData.name} has been added to the candidate database.`,
    });

    setIsSubmittingForm(false);
    setShowManualEntry(false);

    // Reset form
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
  };

  // Pre-fill form with sample data
  const preFillSampleData = () => {
    setFormData({
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, CA",
      position: "software-engineer",
      department: "engineering",
      source: "linkedin",
      experience: "5",
      salary: "$120,000 - $140,000",
      skills: "React, TypeScript, Node.js, Python",
    });
  };

  // Handle bulk file upload
  const handleBulkFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(file.type);
    });

    if (validFiles.length !== fileArray.length) {
      toast({
        title: "Some files skipped",
        description: "Only PDF, DOC, and DOCX files are supported.",
        variant: "destructive",
      });
    }

    // Initialize upload progress for all files
    const initialProgress = validFiles.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading" as const,
    }));
    setUploadProgress(initialProgress);

    // Process files sequentially
    const newParsedCandidates: ParsedCandidate[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setUploadProgress((prev) =>
          prev.map((p) => (p.fileName === file.name ? { ...p, progress } : p)),
        );
      }

      // Start parsing
      setUploadProgress((prev) =>
        prev.map((p) =>
          p.fileName === file.name ? { ...p, status: "parsing" } : p,
        ),
      );

      try {
        const parsed = await mockParseCV(file);
        newParsedCandidates.push(parsed);
        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name ? { ...p, status: "complete" } : p,
          ),
        );
      } catch (error) {
        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name ? { ...p, status: "error" } : p,
          ),
        );
      }
    }

    setParsedCandidates(newParsedCandidates);
    toast({
      title: "Bulk upload complete",
      description: `Processed ${newParsedCandidates.length} of ${validFiles.length} files successfully.`,
    });
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (uploadMode === "single" && files.length === 1) {
      handleSingleFileUpload(files[0]);
    } else if (uploadMode === "bulk") {
      handleBulkFileUpload(files);
    }
  };

  // Edit candidate inline
  const toggleEdit = (candidateId: string) => {
    setParsedCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, isEditing: !c.isEditing } : c,
      ),
    );
  };

  // Update candidate field
  const updateCandidateField = (
    candidateId: string,
    field: string,
    value: string,
  ) => {
    setParsedCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, [field]: value } : c)),
    );
  };

  // Save candidate
  const saveCandidate = (candidateId: string) => {
    setParsedCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              isEditing: false,
              isConfirmed: true,
              hasMissingInfo: !c.name || !c.email || !c.phone,
            }
          : c,
      ),
    );

    toast({
      title: "Candidate saved",
      description: "Candidate information has been updated.",
    });
  };

  // Remove candidate from parsed list
  const removeCandidate = (candidateId: string) => {
    setParsedCandidates((prev) => prev.filter((c) => c.id !== candidateId));
  };

  // Select/deselect candidates for bulk operations
  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId],
    );
  };

  // Select all candidates
  const selectAllCandidates = () => {
    setSelectedCandidates(parsedCandidates.map((c) => c.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedCandidates([]);
  };

  // Create all candidates
  const createAllCandidates = () => {
    const candidatesToCreate =
      selectedCandidates.length > 0
        ? parsedCandidates.filter((c) => selectedCandidates.includes(c.id))
        : parsedCandidates;

    // In real app, this would save to database
    console.log("Creating candidates:", candidatesToCreate);

    toast({
      title: "Candidates created",
      description: `Successfully created ${candidatesToCreate.length} candidate profiles.`,
    });

    // Reset state
    setParsedCandidates([]);
    setSelectedCandidates([]);
    setUploadProgress([]);
    setShowCVUpload(false);
  };

  // Filter parsed candidates
  const filteredParsedCandidates = parsedCandidates.filter((candidate) => {
    switch (parseFilter) {
      case "incomplete":
        return candidate.hasMissingInfo;
      case "duplicates":
        return candidate.isPotentialDuplicate;
      default:
        return true;
    }
  });

  // Filter existing candidates
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

    return (
      matchesSearch &&
      matchesPosition &&
      matchesStage &&
      matchesLocation &&
      matchesDepartment &&
      matchesRecruiter
    );
  });

  // Skeleton loader component
  const CandidateSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );

  // Candidate preview card component
  const CandidatePreviewCard = ({
    candidate,
  }: {
    candidate: ParsedCandidate;
  }) => (
    <Card
      className={`relative transition-all duration-200 ${
        candidate.isPotentialDuplicate
          ? "border-yellow-300 bg-yellow-50"
          : candidate.hasMissingInfo
            ? "border-red-300 bg-red-50"
            : candidate.isConfirmed
              ? "border-green-300 bg-green-50"
              : "border-gray-200"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedCandidates.includes(candidate.id)}
              onCheckedChange={() => toggleCandidateSelection(candidate.id)}
            />
            <div className="flex items-center space-x-2">
              {candidate.isConfirmed && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              {candidate.hasMissingInfo && (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              {candidate.isPotentialDuplicate && (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleEdit(candidate.id)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCandidate(candidate.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Name</Label>
            {candidate.isEditing ? (
              <Input
                value={candidate.name}
                onChange={(e) =>
                  updateCandidateField(candidate.id, "name", e.target.value)
                }
                placeholder="Full name"
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-1">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span
                  className={`${!candidate.name ? "text-red-500 italic" : ""}`}
                >
                  {candidate.name || "Missing name"}
                </span>
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Email</Label>
            {candidate.isEditing ? (
              <Input
                type="email"
                value={candidate.email}
                onChange={(e) =>
                  updateCandidateField(candidate.id, "email", e.target.value)
                }
                placeholder="Email address"
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-1">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span
                  className={`${!candidate.email ? "text-red-500 italic" : ""}`}
                >
                  {candidate.email || "Missing email"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Phone</Label>
            {candidate.isEditing ? (
              <Input
                value={candidate.phone}
                onChange={(e) =>
                  updateCandidateField(candidate.id, "phone", e.target.value)
                }
                placeholder="Phone number"
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-1">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span
                  className={`${!candidate.phone ? "text-red-500 italic" : ""}`}
                >
                  {candidate.phone || "Missing phone"}
                </span>
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Location</Label>
            {candidate.isEditing ? (
              <Input
                value={candidate.location}
                onChange={(e) =>
                  updateCandidateField(candidate.id, "location", e.target.value)
                }
                placeholder="Location"
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span>{candidate.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <Label className="text-xs text-gray-500">Summary</Label>
          {candidate.isEditing ? (
            <Textarea
              value={candidate.summary}
              onChange={(e) =>
                updateCandidateField(candidate.id, "summary", e.target.value)
              }
              placeholder="Professional summary"
              className="mt-1"
              rows={3}
            />
          ) : (
            <p className="text-sm mt-1 text-gray-700 line-clamp-3">
              {candidate.summary}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <Label className="text-xs text-gray-500">Skills</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {candidate.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience Preview */}
        <div>
          <Label className="text-xs text-gray-500">Experience</Label>
          <div className="space-y-2 mt-1">
            {candidate.experience.slice(0, 2).map((exp, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{exp.title}</div>
                  <div className="text-xs text-gray-500">
                    {exp.company} • {exp.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Preview */}
        <div>
          <Label className="text-xs text-gray-500">Education</Label>
          <div className="space-y-2 mt-1">
            {candidate.education.slice(0, 1).map((edu, index) => (
              <div key={index} className="flex items-start space-x-2">
                <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{edu.degree}</div>
                  <div className="text-xs text-gray-500">
                    {edu.institution} • {edu.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Info */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <FileText className="w-3 h-3" />
              <span>{candidate.fileName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{(candidate.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              <Clock className="w-3 h-3" />
              <span>{new Date(candidate.uploadedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {candidate.isEditing && (
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleEdit(candidate.id)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={() => saveCandidate(candidate.id)}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Handle stage change with email trigger
  const handleStageChange = (candidate: CandidateData, newStage: string) => {
    setSelectedCandidateForEmail(candidate);
    setNewStageForEmail(newStage);
    setEmailTriggerOpen(true);
  };

  // Handle email sent callback
  const handleEmailSent = (emailData: any) => {
    toast({
      title: "Email sent successfully",
      description: `Email sent to ${emailData.recipientName}`,
    });

    // Update candidate stage in the data
    // In a real app, this would be an API call
    console.log("Updating candidate stage and logging email:", emailData);
  };

  // Existing candidate components (simplified for space)
  const CandidateCard = ({ candidate }: { candidate: CandidateData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between min-w-0">
          <Link
            to={`/candidates/${candidate.id}`}
            className="flex items-center space-x-3 hover:bg-slate-100 p-2 rounded-md transition min-w-0 flex-1"
          >
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-slate-900 truncate">
                {candidate.name}
              </h3>
              <p className="text-xs text-slate-600 truncate">
                {candidate.position}
              </p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
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
              <DropdownMenuItem
                onClick={() => {
                  const nextStageIndex =
                    stages.findIndex((s) => s === candidate.stage) + 1;
                  if (nextStageIndex < stages.length) {
                    handleStageChange(candidate, stages[nextStageIndex]);
                  }
                }}
                disabled={
                  stages.findIndex((s) => s === candidate.stage) ===
                  stages.length - 1
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Move to Next Stage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-xs text-slate-600 min-w-0">
          <Building className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{candidate.department}</span>
        </div>
        <div className="flex items-center text-xs text-slate-600 min-w-0">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{candidate.duration} days in stage</span>
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
          <Badge variant="outline" className="text-xs line-clamp-1 max-w-20" title={candidate.recruiter}>
            {candidate.recruiter}
          </Badge>
        </div>
        <div className="flex space-x-1 mt-2">
          <Select
            value={candidate.stage}
            onValueChange={(value) => handleStageChange(candidate, value)}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage} className="text-xs">
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const ListView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* FIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                {visibleFields.name && (
                  <TableHead>{t("candidates.name")}</TableHead>
                )}
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
                        className="flex items-center space-x-3 hover:text-blue-600 min-w-0"
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="text-xs">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium line-clamp-1" title={candidate.name}>
                            {candidate.name}
                          </div>
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
                  {visibleFields.appliedDate && (
                    <TableCell className="truncate max-w-32">
                      {candidate.appliedDate}
                    </TableCell>
                  )}
                  {visibleFields.email && (
                    <TableCell className="truncate max-w-48">
                      {candidate.email}
                    </TableCell>
                  )}
                  {visibleFields.phone && (
                    <TableCell className="truncate max-w-32">
                      {candidate.phone}
                    </TableCell>
                  )}
                  {visibleFields.position && (
                    <TableCell className="truncate max-w-40">
                      {candidate.position}
                    </TableCell>
                  )}
                  {visibleFields.recruiter && (
                    <TableCell className="truncate max-w-32">
                      {candidate.recruiter}
                    </TableCell>
                  )}
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
                        className="truncate max-w-24"
                      >
                        {candidate.stage}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleFields.source && (
                    <TableCell className="truncate max-w-32">
                      {candidate.source}
                    </TableCell>
                  )}
                  {visibleFields.salary && (
                    <TableCell className="truncate max-w-32">
                      {candidate.salary}
                    </TableCell>
                  )}
                  {visibleFields.location && (
                    <TableCell className="truncate max-w-40">
                      {candidate.location}
                    </TableCell>
                  )}
                  {visibleFields.department && (
                    <TableCell className="truncate max-w-40">
                      {candidate.department}
                    </TableCell>
                  )}
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
                        {/* Action apply Job for specific candidate */}
                        <DropdownMenuItem
                          onClick={() => setApplyCandidateId(candidate.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Apply to Job
                        </DropdownMenuItem>

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
          <Dialog
            open={!!applyCandidateId}
            onOpenChange={(open) => !open && setApplyCandidateId(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply to Job</DialogTitle>
                <DialogDescription>
                  Select a job to apply candidate:{" "}
                  <strong>{applyCandidate?.name}</strong>
                </DialogDescription>
              </DialogHeader>

              <Select onValueChange={(value) => setSelectedJobId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setApplyCandidateId(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (applyCandidateId && selectedJobId) {
                      applyCandidateToJob(applyCandidateId, selectedJobId);
                      setApplyCandidateId(null);
                      setSelectedJobId(null);
                    }
                  }}
                  disabled={!selectedJobId}
                >
                  Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {stages.map((stage) => {
        const stageCandidates = filteredCandidates.filter(
          (candidate) => candidate.stage === stage,
        );
        return (
          <div
            key={stage}
            className="border border-slate-300 bg-slate-50 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-100 rounded-t-lg">
              <h3 className="font-semibold text-sm text-slate-900">{stage}</h3>
              <Badge variant="outline" className="text-xs">
                {stageCandidates.length}
              </Badge>
            </div>
            <div className="space-y-3 p-3 min-h-[250px]">
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
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t("candidates.title")}
          </h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            {t("candidates.subtitle")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            size="sm"
            onClick={() => setShowCVUpload(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CVs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowManualEntry(true)} // Trigger the new dialog
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Manually
          </Button>
        </div>
      </div>

      {/* Fill manual entry dialog */}
      <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add Candidate Manually
            </DialogTitle>
            <DialogDescription>
              Enter candidate details to create a new candidate profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                  Job Position
                </label>
                <Select>
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
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Department
                </label>
                <Select>
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
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Source
                </label>
                <Select onValueChange={setSource}>
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
                {source === "customize" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom source"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowManualEntry(false);
                  setSource(undefined);
                  setCustomSource("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In a real app, you would collect form data and save to database
                  toast({
                    title: "Candidate Created",
                    description: "New candidate has been added successfully.",
                  });
                  setShowManualEntry(false);
                  setSource(undefined);
                  setCustomSource("");
                }}
              >
                Create Candidate
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
                        <CandidatePreviewCard
                          key={candidate.id}
                          candidate={candidate}
                        />
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
                        onValueChange={setBulkJobPosition}
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
                    </div>
                    <div>
                      <Label>Default Source</Label>
                      <Select value={bulkSource} onValueChange={setBulkSource}>
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
                              <span className="font-medium truncate">
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
                        {/* Filter dropdown */}
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

                        {/* Bulk actions */}
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
                    {/* Status indicators */}
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
                        <CandidatePreviewCard
                          key={candidate.id}
                          candidate={candidate}
                        />
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
                          setVisibleFields((prev) => ({
                            ...prev,
                            [field]: checked,
                          }))
                        }
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
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
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
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
                <Select
                  value={recruiterFilter}
                  onValueChange={setRecruiterFilter}
                >
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
                <Dialog
                  open={showMoreFilters}
                  onOpenChange={setShowMoreFilters}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advanced Filters</DialogTitle>
                      <DialogDescription>
                        Apply additional filters to refine your candidate
                        search.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700">
                            Experience Level
                          </label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Any experience" />
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
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">
                            Salary Range
                          </label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Any salary" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="50-75">$50k - $75k</SelectItem>
                              <SelectItem value="75-100">
                                $75k - $100k
                              </SelectItem>
                              <SelectItem value="100-150">
                                $100k - $150k
                              </SelectItem>
                              <SelectItem value="150+">$150k+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">
                            Rating
                          </label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Any rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 Stars</SelectItem>
                              <SelectItem value="4+">4+ Stars</SelectItem>
                              <SelectItem value="3+">3+ Stars</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">
                            Application Date
                          </label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Any date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last-week">
                                Last Week
                              </SelectItem>
                              <SelectItem value="last-month">
                                Last Month
                              </SelectItem>
                              <SelectItem value="last-quarter">
                                Last Quarter
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Skills
                        </label>
                        <Input
                          placeholder="Search by specific skills..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowMoreFilters(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setShowMoreFilters(false);
                            toast({
                              title: "Filters Applied",
                              description:
                                "Advanced filters have been applied to the candidate list.",
                            });
                          }}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "list" ? <ListView /> : <GridView />}

      {/* Email Trigger Modal */}
      {selectedCandidateForEmail && (
        <EmailTrigger
          isOpen={emailTriggerOpen}
          onClose={() => {
            setEmailTriggerOpen(false);
            setSelectedCandidateForEmail(null);
            setNewStageForEmail("");
          }}
          candidate={selectedCandidateForEmail}
          newStage={newStageForEmail}
          jobTitle={selectedCandidateForEmail.position}
          onEmailSent={handleEmailSent}
        />
      )}
    </div>
  );
}
