import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchableSelect,
  SelectOption,
} from "@/components/ui/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  FileText,
  Search,
  Eye,
  Save,
  Share2,
  Tag,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Brain,
  Briefcase,
  GraduationCap,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Filter,
  RefreshCw,
  FileCheck,
  ThumbsUp,
  ThumbsDown,
  Target,
  ChevronDown,
  Trash2,
  Plus,
  Star,
  Copy,
  ExternalLink,
  NotebookPen,
} from "lucide-react";
import {
  HARDCODED_CANDIDATES,
  HARDCODED_JOBS,
  type CandidateData,
  type JobData,
  type CVEvaluationData,
} from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";

interface CVEvaluation {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  jobFitScore: number;
  suggestedImprovements: string[];
  finalVerdict: "Good Fit" | "Needs Improvement" | "Not Suitable";
  skillsMatch: {
    skill: string;
    hasSkill: boolean;
    level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  }[];
  experienceMatch: number;
  educationMatch: number;
  recommendations: string[];
  extractedData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    education: string[];
    workExperience: string[];
    skills: string[];
  };
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  content?: string;
}

export default function CVEvaluation() {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateData | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [evaluation, setEvaluation] = useState<CVEvaluation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [analysisNotes, setAnalysisNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [savedEvaluations, setSavedEvaluations] = useState<CVEvaluationData[]>(
    [],
  );
  const [showSavedEvaluations, setShowSavedEvaluations] = useState(false);
  const [selectedSavedEvaluation, setSelectedSavedEvaluation] =
    useState<CVEvaluationData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved evaluations from candidates' cvEvaluations data
  useEffect(() => {
    const allEvaluations: CVEvaluationData[] = [];
    HARDCODED_CANDIDATES.forEach((candidate) => {
      if (candidate.cvEvaluations) {
        allEvaluations.push(...candidate.cvEvaluations);
      }
    });
    setSavedEvaluations(allEvaluations);
  }, []);

  // Prepare job options for enhanced dropdown
  const jobOptions: SelectOption[] = HARDCODED_JOBS.map((job) => ({
    value: job.id,
    label: job.position,
    description: `${job.department} • ${job.location}`,
    badge: job.priority,
  }));

  // Mock file upload simulation
  const handleFileUpload = useCallback(
    async (file: File) => {
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        content: await readFileContent(file),
      };

      setUploadedFiles((prev) => [...prev, uploadedFile]);
      setSelectedFile(uploadedFile);

      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} has been uploaded and is ready for analysis.`,
      });
    },
    [toast],
  );

  // Read file content (simulated)
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate file reading delay
      setTimeout(() => {
        resolve(`
          John Doe
          Software Engineer
          
          Email: john.doe@email.com
          Phone: +1 (555) 123-4567
          Location: San Francisco, CA
          
          EXPERIENCE:
          • Senior Software Engineer at TechCorp (2020-2024)
            - Led development of React-based web applications
            - Implemented CI/CD pipelines with Docker and Jenkins
            - Mentored junior developers and conducted code reviews
          
          • Software Engineer at StartupXYZ (2018-2020)
            - Developed full-stack applications using Node.js and React
            - Collaborated with product managers to deliver user-focused features
          
          EDUCATION:
          • Bachelor of Science in Computer Science
            University of California, Berkeley (2014-2018)
          
          SKILLS:
          JavaScript, TypeScript, React, Node.js, Python, SQL, Docker, AWS, Git
        `);
      }, 1000);
    });
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        if (file.type === "application/pdf" || file.type.includes("document")) {
          handleFileUpload(file);
        }
      });
    },
    [handleFileUpload],
  );

  // Mock CV analysis with progress
  const analyzeCV = async () => {
    if (!selectedFile || !selectedJob) {
      toast({
        title: "Missing Information",
        description:
          "Please select both a CV file and a job position for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressSteps = [
      { step: 20, message: "Extracting text from CV..." },
      { step: 40, message: "Analyzing skills and experience..." },
      { step: 60, message: "Matching with job requirements..." },
      { step: 80, message: "Generating recommendations..." },
      { step: 100, message: "Analysis complete!" },
    ];

    for (const { step, message } of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAnalysisProgress(step);

      if (step < 100) {
        toast({
          title: message,
          description: `Progress: ${step}%`,
        });
      }
    }

    // Generate mock evaluation
    const mockEvaluation: CVEvaluation = {
      summary:
        "This candidate shows strong technical skills with relevant experience in software development. Their background aligns well with the job requirements, particularly in React and Node.js development.",
      strengths: [
        "5+ years of experience in software development",
        "Strong proficiency in React and JavaScript/TypeScript",
        "Experience with modern development tools and practices",
        "Leadership and mentoring experience",
        "Full-stack development capabilities",
      ],
      weaknesses: [
        "Limited experience with Python (job requirement)",
        "No specific AWS certification mentioned",
        "Could benefit from more UI/UX design experience",
      ],
      jobFitScore: 85,
      finalVerdict: "Good Fit",
      suggestedImprovements: [
        "Consider additional Python training for backend development",
        "Pursue AWS certification to strengthen cloud skills",
        "Gain more experience with design systems and UI/UX principles",
      ],
      skillsMatch: selectedJob.expectedSkills.map((skill) => ({
        skill,
        hasSkill: ["React", "JavaScript", "TypeScript", "Node.js"].includes(
          skill,
        ),
        level: ["React", "JavaScript"].includes(skill)
          ? "Advanced"
          : ["TypeScript", "Node.js"].includes(skill)
            ? "Intermediate"
            : "Beginner",
      })),
      experienceMatch: 85,
      educationMatch: 90,
      recommendations: [
        "Schedule technical interview to assess coding skills",
        "Discuss Python learning plan during interview",
        "Consider for senior-level position based on leadership experience",
      ],
      extractedData: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        education: ["Bachelor of Science in Computer Science - UC Berkeley"],
        workExperience: [
          "Senior Software Engineer at TechCorp (2020-2024)",
          "Software Engineer at StartupXYZ (2018-2020)",
        ],
        skills: [
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Python",
          "SQL",
          "Docker",
          "AWS",
        ],
      },
    };

    setEvaluation(mockEvaluation);
    setIsAnalyzing(false);
    setIsSaved(false); // Reset save status when new analysis is done

    toast({
      title: "Analysis Complete!",
      description: "CV analysis has been completed successfully.",
    });
  };

  // Quick analysis with pre-selected candidate and job
  const quickAnalysis = () => {
    const candidate = HARDCODED_CANDIDATES[0]; // Marissa Torres
    const job = HARDCODED_JOBS[0]; // Senior Frontend Developer

    setSelectedCandidate(candidate);
    setSelectedJob(job);

    // Create mock file from candidate data
    const mockFile: UploadedFile = {
      name: `${candidate.name}_resume.pdf`,
      size: 245760,
      type: "application/pdf",
      url: candidate.avatar, // Use avatar as placeholder
      uploadedAt: new Date().toISOString(),
      content: `Resume content for ${candidate.name}`,
    };

    setUploadedFiles([mockFile]);
    setSelectedFile(mockFile);

    toast({
      title: "Demo Data Loaded",
      description: "Sample candidate and job data loaded for quick analysis.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Good Fit":
        return <ThumbsUp className="w-5 h-5 text-green-600" />;
      case "Needs Improvement":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "Not Suitable":
        return <ThumbsDown className="w-5 h-5 text-red-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleSaveAnalysis = () => {
    if (!evaluation) {
      toast({
        title: "No Analysis to Save",
        description: "Please run an analysis first before saving.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to backend
    const analysisData = {
      ...evaluation,
      notes: analysisNotes,
      savedAt: new Date().toISOString(),
      candidateName: selectedCandidate?.name,
      jobTitle: selectedJob?.position,
      fileName: selectedFile?.name,
    };

    // In a real app, this would save to backend and update the candidate's cvEvaluations
    const newEvaluation: CVEvaluationData = {
      id: `eval_${Date.now()}`,
      candidateId: selectedCandidate?.id || "unknown",
      jobId: selectedJob?.id || "unknown",
      fileName: selectedFile?.name || "unknown",
      ...evaluation,
      notes: analysisNotes,
      savedAt: new Date().toISOString(),
      createdBy: "Current User",
      isShared: false,
    };

    // Update local saved evaluations
    setSavedEvaluations((prev) => [newEvaluation, ...prev]);
    localStorage.setItem(
      `cv-analysis-${Date.now()}`,
      JSON.stringify(analysisData),
    );
    setIsSaved(true);

    toast({
      title: "Analysis Saved",
      description: "Your CV analysis has been saved successfully.",
    });
  };

  const handleShareAnalysis = () => {
    if (!evaluation) {
      toast({
        title: "No Analysis to Share",
        description: "Please run an analysis first before sharing.",
        variant: "destructive",
      });
      return;
    }

    // Generate a shareable URL and mark evaluation as shared
    const shareId = Math.random().toString(36).substring(2, 15);
    const generatedUrl = `${window.location.origin}/cv-analysis/shared/${shareId}`;
    setShareUrl(generatedUrl);

    // In a real app, this would update the backend to mark evaluation as shared
    if (evaluation) {
      setSavedEvaluations((prev) =>
        prev.map((evalItem) =>
          evalItem.id === selectedSavedEvaluation?.id
            ? { ...evalItem, isShared: true, shareUrl: generatedUrl }
            : evalItem,
        ),
      );
    }

    setShowShareDialog(true);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleExportToPDF = async () => {
    if (!evaluation) {
      toast({
        title: "No Analysis to Export",
        description: "Please run an analysis first before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    // Simulate PDF generation delay
    setTimeout(() => {
      // In a real app, this would generate a PDF with jsPDF or similar
      const candidateName = selectedCandidate?.name || "Candidate";
      const jobTitle = selectedJob?.position || "Position";
      const fileName = `CV_Analysis_${candidateName}_${jobTitle}_${new Date().toISOString().split("T")[0]}.pdf`;

      // Create a downloadable blob (simulated)
      const pdfContent = generatePDFContent(
        evaluation!,
        candidateName,
        jobTitle,
      );
      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Export Complete",
        description: `Downloaded ${fileName}`,
      });

      setIsExporting(false);
    }, 2000);
  };

  // Generate PDF content (simulated)
  const generatePDFContent = (
    evaluation: CVEvaluation,
    candidateName: string,
    jobTitle: string,
  ) => {
    return `
CV ANALYSIS REPORT
==================

Candidate: ${candidateName}
Job Position: ${jobTitle}
Analysis Date: ${new Date().toLocaleDateString()}

OVERALL SCORE: ${evaluation.jobFitScore}%
VERDICT: ${evaluation.finalVerdict}

SUMMARY:
${evaluation.summary}

STRENGTHS:
${evaluation.strengths.map((s) => `• ${s}`).join("\n")}

AREAS FOR IMPROVEMENT:
${evaluation.weaknesses.map((w) => `• ${w}`).join("\n")}

RECOMMENDATIONS:
${evaluation.recommendations.map((r) => `• ${r}`).join("\n")}

SKILLS MATCH:
${evaluation.skillsMatch.map((s) => `• ${s.skill}: ${s.hasSkill ? "✓" : "✗"} ${s.level || ""}`).join("\n")}

Generated by CV Evaluation System
`;
  };

  const loadSavedEvaluation = (savedEval: CVEvaluationData) => {
    // Find the candidate and job for this evaluation
    const candidate = HARDCODED_CANDIDATES.find(
      (c) => c.id === savedEval.candidateId,
    );
    const job = HARDCODED_JOBS.find((j) => j.id === savedEval.jobId);

    if (candidate && job) {
      setSelectedCandidate(candidate);
      setSelectedJob(job);

      // Create mock file
      const mockFile: UploadedFile = {
        name: savedEval.fileName,
        size: 245760,
        type: "application/pdf",
        url: candidate.avatar,
        uploadedAt: savedEval.savedAt,
        content: `Resume content for ${candidate.name}`,
      };

      setUploadedFiles([mockFile]);
      setSelectedFile(mockFile);

      // Convert saved evaluation to current format
      const loadedEvaluation: CVEvaluation = {
        summary: savedEval.summary,
        strengths: savedEval.strengths,
        weaknesses: savedEval.weaknesses,
        jobFitScore: savedEval.jobFitScore,
        suggestedImprovements: savedEval.suggestedImprovements,
        finalVerdict: savedEval.finalVerdict,
        skillsMatch: savedEval.skillsMatch,
        experienceMatch: savedEval.experienceMatch,
        educationMatch: savedEval.educationMatch,
        recommendations: savedEval.recommendations,
        extractedData: savedEval.extractedData,
      };

      setEvaluation(loadedEvaluation);
      setAnalysisNotes(savedEval.notes || "");
      setSelectedSavedEvaluation(savedEval);
      setIsSaved(true);

      toast({
        title: "Evaluation Loaded",
        description: `Loaded analysis for ${candidate.name}`,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            CV Evaluation & Analysis
          </h1>
          <p className="text-slate-600 mt-1">
            Upload and analyze CVs against job requirements with AI-powered
            insights
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={quickAnalysis}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Demo Analysis
          </Button>
          <Button
            onClick={() => setShowSavedEvaluations(true)}
            variant="outline"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            Saved Evaluations ({savedEvaluations.length})
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CV
          </Button>
          {evaluation && (
            <>
              <Button
                onClick={handleSaveAnalysis}
                variant="outline"
                disabled={isAnalyzing}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                onClick={handleShareAnalysis}
                variant="outline"
                disabled={isAnalyzing}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleExportToPDF}
                variant="outline"
                disabled={isAnalyzing || isExporting}
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0])
            }
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Upload & Configuration */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload CV</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Upload CV File
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop your CV here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, DOC, DOCX up to 10MB
                </p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files</Label>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                        selectedFile?.name === file.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFilePreview(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            if (selectedFile?.name === file.name) {
                              setSelectedFile(null);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Job Position</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Job Position</Label>
                <SearchableSelect
                  value={selectedJob?.id || ""}
                  onValueChange={(value) => {
                    const job = HARDCODED_JOBS.find((j) => j.id === value);
                    setSelectedJob(job || null);
                  }}
                  options={jobOptions}
                  placeholder="Choose a job position..."
                  searchPlaceholder="Search job positions..."
                  emptyMessage="No job positions found."
                  clearable={true}
                  className="mt-1"
                />
              </div>

              {selectedJob && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">
                      Required Skills
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedJob.expectedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Job Description
                    </Label>
                    <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                      {selectedJob.description}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={analyzeCV}
                disabled={!selectedFile || !selectedJob || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze CV
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Progress</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}

              {evaluation && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Overall Score</Label>
                    <Badge
                      className={`${getScoreColor(evaluation.jobFitScore)} border-0`}
                    >
                      {evaluation.jobFitScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getVerdictIcon(evaluation.finalVerdict)}
                    <span className="text-sm font-medium">
                      {evaluation.finalVerdict}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-2">
          {isAnalyzing ? (
            <Card>
              <CardHeader>
                <CardTitle>Analyzing CV...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : evaluation ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills Match</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Analysis Notes Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <NotebookPen className="w-5 h-5" />
                      <span>Analysis Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add your notes about this analysis..."
                      value={analysisNotes}
                      onChange={(e) => setAnalysisNotes(e.target.value)}
                      className="min-h-[100px]"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-sm text-gray-500">
                        {analysisNotes.length}/500 characters
                      </p>
                      <Button
                        size="sm"
                        onClick={handleSaveAnalysis}
                        disabled={!analysisNotes.trim()}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Overview Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Evaluation Summary</span>
                      <div className="flex items-center space-x-2">
                        {getVerdictIcon(evaluation.finalVerdict)}
                        <Badge
                          className={`${getScoreColor(evaluation.jobFitScore)} border-0`}
                        >
                          {evaluation.jobFitScore}% Match
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {evaluation.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(evaluation.experienceMatch).split(" ")[0]}`}
                        >
                          {evaluation.experienceMatch}%
                        </div>
                        <p className="text-sm text-gray-600">
                          Experience Match
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(evaluation.educationMatch).split(" ")[0]}`}
                        >
                          {evaluation.educationMatch}%
                        </div>
                        <p className="text-sm text-gray-600">Education Match</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(evaluation.jobFitScore).split(" ")[0]}`}
                        >
                          {evaluation.jobFitScore}%
                        </div>
                        <p className="text-sm text-gray-600">Overall Fit</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Strengths</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {evaluation.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-orange-700">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Areas for Improvement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {evaluation.weaknesses.map((weakness, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5" />
                      <span>Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {evaluation.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {evaluation.skillsMatch.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {skill.hasSkill ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="font-medium">{skill.skill}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {skill.hasSkill && skill.level && (
                              <Badge variant="outline">{skill.level}</Badge>
                            )}
                            <Badge
                              variant={skill.hasSkill ? "default" : "secondary"}
                            >
                              {skill.hasSkill ? "Match" : "Missing"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Suggested Improvements
                      </Label>
                      <ul className="mt-2 space-y-1">
                        {evaluation.suggestedImprovements.map(
                          (improvement, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start space-x-2"
                            >
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{improvement}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="extracted" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Personal Information
                        </Label>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{evaluation.extractedData.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>{evaluation.extractedData.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{evaluation.extractedData.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{evaluation.extractedData.location}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Skills</Label>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {evaluation.extractedData.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Education</Label>
                      <ul className="mt-2 space-y-1">
                        {evaluation.extractedData.education.map(
                          (edu, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start space-x-2"
                            >
                              <GraduationCap className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span>{edu}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">
                        Work Experience
                      </Label>
                      <ul className="mt-2 space-y-1">
                        {evaluation.extractedData.workExperience.map(
                          (exp, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start space-x-2"
                            >
                              <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span>{exp}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                  <p className="mb-4">
                    Upload a CV and select a job position to begin analysis
                  </p>
                  <Button onClick={quickAnalysis} variant="outline">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Try Demo Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* File Preview Dialog */}
      <Dialog open={showFilePreview} onOpenChange={setShowFilePreview}>
        <DialogContent className="sm:max-w-4xl sm:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>File Preview - {selectedFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile?.content && (
              <ScrollArea className="h-96 w-full border rounded-lg p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {selectedFile.content}
                </pre>
              </ScrollArea>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFilePreview(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                // Simulate download
                toast({
                  title: "Download Started",
                  description: `Downloading ${selectedFile?.name}`,
                });
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Evaluations Dialog */}
      <Dialog
        open={showSavedEvaluations}
        onOpenChange={setShowSavedEvaluations}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5" />
              <span>Saved CV Evaluations ({savedEvaluations.length})</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {savedEvaluations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileCheck className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No saved evaluations yet</p>
                  <p className="text-sm">
                    Complete and save an analysis to see it here
                  </p>
                </div>
              ) : (
                savedEvaluations.map((savedEval) => {
                  const candidate = HARDCODED_CANDIDATES.find(
                    (c) => c.id === savedEval.candidateId,
                  );
                  const job = HARDCODED_JOBS.find(
                    (j) => j.id === savedEval.jobId,
                  );

                  return (
                    <Card
                      key={savedEval.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {candidate?.name || "Unknown Candidate"}
                              </h3>
                              <Badge
                                variant={
                                  savedEval.finalVerdict === "Good Fit"
                                    ? "default"
                                    : savedEval.finalVerdict ===
                                        "Needs Improvement"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {savedEval.finalVerdict}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {savedEval.jobFitScore}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              <strong>Job:</strong>{" "}
                              {job?.position || "Unknown Position"}
                            </p>
                            <p className="text-sm text-slate-600 mb-2">
                              <strong>File:</strong> {savedEval.fileName}
                            </p>
                            <p className="text-xs text-slate-500">
                              Saved on{" "}
                              {new Date(savedEval.savedAt).toLocaleDateString()}{" "}
                              by {savedEval.createdBy}
                            </p>
                            {savedEval.isShared && (
                              <Badge variant="outline" className="mt-2">
                                <Share2 className="w-3 h-3 mr-1" />
                                Shared
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                loadSavedEvaluation(savedEval);
                                setShowSavedEvaluations(false);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Quick export for this evaluation
                                const candidateName =
                                  candidate?.name || "Candidate";
                                const jobTitle = job?.position || "Position";
                                const fileName = `CV_Analysis_${candidateName}_${jobTitle}_${savedEval.savedAt.split("T")[0]}.pdf`;

                                toast({
                                  title: "PDF Export Started",
                                  description: `Downloading ${fileName}`,
                                });
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            {savedEval.shareUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    savedEval.shareUrl!,
                                  );
                                  toast({
                                    title: "Share Link Copied",
                                    description: "Link copied to clipboard",
                                  });
                                }}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {savedEval.summary}
                          </p>
                        </div>

                        {savedEval.notes && (
                          <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                            <strong>Notes:</strong> {savedEval.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSavedEvaluations(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share Analysis</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Shareable Link</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  size="sm"
                  onClick={handleCopyShareLink}
                  variant="outline"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This link allows view-only access to the
                analysis results. The shared analysis will be available for 30
                days.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowShareDialog(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(shareUrl, "_blank");
                }}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
