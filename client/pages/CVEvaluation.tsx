import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  TrendingUp,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Filter,
  RefreshCw,
  FileCheck,
  ThumbsUp,
  ThumbsDown,
  Target,
} from "lucide-react";
import {
  HARDCODED_CANDIDATES,
  HARDCODED_JOBS,
  type CandidateData,
  type JobData,
} from "@/data/hardcoded-data";

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
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export default function CVEvaluation() {
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateData | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [evaluation, setEvaluation] = useState<CVEvaluation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [candidateFilter, setCandidateFilter] = useState<string>("all");
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [evaluationNotes, setEvaluationNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter candidates based on search and filters
  const filteredCandidates = HARDCODED_CANDIDATES.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      candidateFilter === "all" ||
      candidate.stage.toLowerCase() === candidateFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Mock CV analysis function
  const analyzeCV = useCallback(async () => {
    if (!selectedCandidate && !uploadedFile) return;
    if (!selectedJob) {
      alert("Please select a job position to evaluate against");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const candidate = selectedCandidate;
    const job = selectedJob;

    // Mock evaluation based on candidate and job data
    const mockEvaluation: CVEvaluation = {
      summary: candidate
        ? `${candidate.name} is a ${candidate.experience} professional with expertise in ${candidate.skills.slice(0, 3).join(", ")}. Currently in ${candidate.stage} stage with a ${candidate.rating}/5 rating. Strong background in ${candidate.position} with proven track record.`
        : "Uploaded resume shows a skilled professional with relevant experience in the target domain. Good educational background and diverse skill set.",

      strengths: candidate
        ? [
            `Strong technical skills in ${candidate.skills[0]}`,
            `${candidate.experience} of relevant experience`,
            `High rating (${candidate.rating}/5) from previous evaluations`,
            `Successfully reached ${candidate.stage} stage`,
            ...(candidate.tags.length > 0
              ? [`Tagged as: ${candidate.tags.join(", ")}`]
              : []),
          ]
        : [
            "Relevant technical skills for the position",
            "Strong educational background",
            "Good communication skills evident in resume structure",
            "Professional experience in similar roles",
          ],

      weaknesses: [
        "Limited experience with some required technologies",
        "Could benefit from more leadership experience",
        "Portfolio could be more comprehensive",
        "Some skill gaps in advanced frameworks",
      ],

      jobFitScore: candidate
        ? Math.min(95, candidate.rating * 20 + Math.random() * 15)
        : Math.floor(Math.random() * 40) + 60,

      suggestedImprovements: [
        "Consider gaining experience with additional frameworks mentioned in job requirements",
        "Develop leadership and mentoring skills",
        "Create a more comprehensive portfolio showcasing recent projects",
        "Obtain relevant certifications in the domain",
        "Improve technical writing and documentation skills",
      ],

      finalVerdict: candidate
        ? candidate.rating >= 4
          ? "Good Fit"
          : candidate.rating >= 3
            ? "Needs Improvement"
            : "Not Suitable"
        : "Needs Improvement",

      skillsMatch: job.expectedSkills.map((skill) => ({
        skill,
        hasSkill: candidate
          ? candidate.skills.includes(skill)
          : Math.random() > 0.3,
        level: ["Beginner", "Intermediate", "Advanced", "Expert"][
          Math.floor(Math.random() * 4)
        ] as any,
      })),

      experienceMatch: candidate
        ? Math.min(100, parseInt(candidate.experience) * 20)
        : 70,
      educationMatch: Math.floor(Math.random() * 30) + 70,

      recommendations: [
        "Schedule technical interview to assess practical skills",
        "Conduct behavioral interview to evaluate cultural fit",
        "Request code samples or portfolio review",
        "Check references from previous employers",
        "Consider probationary period to evaluate performance",
      ],
    };

    setEvaluation(mockEvaluation);
    setIsAnalyzing(false);
  }, [selectedCandidate, selectedJob, uploadedFile]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    // Create uploaded file object
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    };

    setUploadedFile(uploadedFile);
    setSelectedCandidate(null); // Clear candidate selection when uploading file
  };

  // Handle save evaluation
  const handleSaveEvaluation = () => {
    if (!evaluation) return;

    const evaluationData = {
      candidate: selectedCandidate?.name || uploadedFile?.name || "Unknown",
      job: selectedJob?.position || "No job selected",
      evaluation,
      notes: evaluationNotes,
      tags: selectedTags,
      savedAt: new Date().toISOString(),
    };

    // In a real app, this would save to a database
    console.log("Saving evaluation:", evaluationData);
    alert("Evaluation saved successfully!");
  };

  // Handle share evaluation
  const handleShareEvaluation = () => {
    if (!evaluation) return;

    const shareData = {
      title: `CV Evaluation: ${selectedCandidate?.name || uploadedFile?.name}`,
      text: `Job Fit Score: ${evaluation.jobFitScore}% - ${evaluation.finalVerdict}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`,
      );
      alert("Evaluation details copied to clipboard!");
    }
  };

  // Get verdict color
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Good Fit":
        return "text-green-600 bg-green-50 border-green-200";
      case "Needs Improvement":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Not Suitable":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <TooltipProvider>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              CV Evaluation Tool
            </h1>
            <p className="text-gray-600 mt-2">
              Analyze and evaluate candidate resumes with AI-powered insights
            </p>
          </div>

          {/*<div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div> */}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - CV Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Select Job Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    const job = HARDCODED_JOBS.find((j) => j.id === value);
                    setSelectedJob(job || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a job to evaluate against" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDCODED_JOBS.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{job.position}</span>
                           {/* <span className="text-sm text-gray-500">
                            {job.department}
                          </span> */}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedJob && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {selectedJob.position}
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>Department: {selectedJob.department}</div>
                      <div>Location: {selectedJob.location}</div>
                      <div>Type: {selectedJob.type}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload CV</TabsTrigger>
                <TabsTrigger value="select">Select Candidate</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {uploadedFile && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">
                              {uploadedFile.name}
                            </span>
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {uploadedFile.type}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="select" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Select from Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search candidates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select
                        value={candidateFilter}
                        onValueChange={setCandidateFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="screening">Screening</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedCandidate?.id === candidate.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setUploadedFile(null);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {candidate.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {candidate.position}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {candidate.email}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    candidate.stage === "Hired"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {candidate.stage}
                                </Badge>
                                <div className="text-xs text-gray-500 mt-1">
                                  Rating: {candidate.rating}/5
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Analysis Button */}
            <Button
              onClick={analyzeCV}
              disabled={
                (!selectedCandidate && !uploadedFile) ||
                !selectedJob ||
                isAnalyzing
              }
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing CV...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Start AI Analysis
                </>
              )}
            </Button>
          </div>

          {/* Right Panel - Evaluation Results */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCandidate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Candidate Information
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResumeViewer(true)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {selectedCandidate.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {selectedCandidate.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {selectedCandidate.phone}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {selectedCandidate.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {selectedCandidate.experience}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Applied: {selectedCandidate.appliedDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Badge
                        variant={
                          selectedCandidate.stage === "Hired"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedCandidate.stage}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        Rating: {selectedCandidate.rating}/5
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedCandidate.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {selectedCandidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{selectedCandidate.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {evaluation ? (
              <div className="space-y-6">
                {/* AI Analysis Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Job Fit Score */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-medium">
                          Job Fit Score
                        </Label>
                        <span className="text-2xl font-bold text-blue-600">
                          {evaluation.jobFitScore}%
                        </span>
                      </div>
                      <Progress
                        value={evaluation.jobFitScore}
                        className="h-3"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Overall compatibility with the selected position
                      </p>
                    </div>

                    {/* Final Verdict */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        Final Verdict
                      </Label>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getVerdictColor(evaluation.finalVerdict)}`}
                      >
                        {evaluation.finalVerdict === "Good Fit" && (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        {evaluation.finalVerdict === "Needs Improvement" && (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                        {evaluation.finalVerdict === "Not Suitable" && (
                          <XCircle className="w-5 h-5" />
                        )}
                        {evaluation.finalVerdict}
                      </div>
                    </div>

                    {/* CV Summary */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        CV Summary
                      </Label>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {evaluation.summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analysis Tabs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="strengths" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="strengths">Strengths</TabsTrigger>
                        <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
                        <TabsTrigger value="skills">Skills Match</TabsTrigger>
                        <TabsTrigger value="recommendations">
                          Suggestions
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="strengths" className="space-y-3 mt-4">
                        {evaluation.strengths.map((strength, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <ThumbsUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-green-900">{strength}</span>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent
                        value="weaknesses"
                        className="space-y-3 mt-4"
                      >
                        {evaluation.weaknesses.map((weakness, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <ThumbsDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-red-900">{weakness}</span>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="skills" className="space-y-3 mt-4">
                        <div className="grid gap-3">
                          {evaluation.skillsMatch.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div className="flex items-center gap-3">
                                {skill.hasSkill ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className="font-medium">
                                  {skill.skill}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {skill.hasSkill && skill.level && (
                                  <Badge variant="outline">{skill.level}</Badge>
                                )}
                                <Badge
                                  variant={
                                    skill.hasSkill ? "default" : "secondary"
                                  }
                                >
                                  {skill.hasSkill ? "Match" : "Missing"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="recommendations"
                        className="space-y-3 mt-4"
                      >
                        {evaluation.suggestedImprovements.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-900">
                                {suggestion}
                              </span>
                            </div>
                          ),
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Experience & Education Match */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Experience Match
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Experience Alignment</span>
                          <span className="font-medium">
                            {evaluation.experienceMatch}%
                          </span>
                        </div>
                        <Progress value={evaluation.experienceMatch} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Education Match
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Education Alignment</span>
                          <span className="font-medium">
                            {evaluation.educationMatch}%
                          </span>
                        </div>
                        <Progress value={evaluation.educationMatch} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Bar */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes" className="text-base font-medium">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Add your evaluation notes and comments..."
                        value={evaluationNotes}
                        onChange={(e) => setEvaluationNotes(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        Tags
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "High Potential",
                          "Technical Expert",
                          "Cultural Fit",
                          "Needs Training",
                          "Follow Up",
                          "Quick Hire",
                        ].map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              selectedTags.includes(tag) ? "default" : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedTags((prev) =>
                                prev.includes(tag)
                                  ? prev.filter((t) => t !== tag)
                                  : [...prev, tag],
                              );
                            }}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleSaveEvaluation}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Evaluation
                      </Button>
                      <Button variant="outline" onClick={handleShareEvaluation}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Results
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Select a job position and upload a CV or choose a candidate
                    from the database to start the AI-powered evaluation
                    process.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Resume Viewer Dialog */}
        <Dialog open={showResumeViewer} onOpenChange={setShowResumeViewer}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Resume Viewer</DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Resume preview would be displayed here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedCandidate?.resume || uploadedFile?.name}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
