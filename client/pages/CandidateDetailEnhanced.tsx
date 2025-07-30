import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  ArrowLeft,
  Mail,
  MailCheck,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Circle,
  Clock,
  Target,
  Building2,
  User,
  DollarSign,
  GraduationCap,
  Briefcase,
  FileText,
  Eye,
  MoreHorizontal,
  Edit,
  Download,
  Share,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Enhanced imports
import { JobSelector } from "@/components/JobSelector";
import { 
  EnhancedCandidateData, 
  JobApplication 
} from "@/types/enhanced-candidate";
import { 
  ENHANCED_CANDIDATE_SAMPLE, 
  getJobApplication, 
  getCurrentJobApplication 
} from "@/data/enhanced-mock-data";

// Temporary - use enhanced mock data
const MOCK_ENHANCED_CANDIDATES = [ENHANCED_CANDIDATE_SAMPLE];

export default function CandidateDetailEnhanced() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<EnhancedCandidateData | null>(null);
  const [selectedJobApplicationId, setSelectedJobApplicationId] = useState<string>("");
  const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const { toast } = useToast();

  // Load candidate data
  useEffect(() => {
    if (id) {
      // For demo, use mock data
      const mockCandidate = MOCK_ENHANCED_CANDIDATES.find(c => c.id === id);
      if (mockCandidate) {
        setCandidate(mockCandidate);
        // Set initial job application (highest priority active or first one)
        const currentJob = getCurrentJobApplication(mockCandidate);
        if (currentJob) {
          setSelectedJobApplicationId(currentJob.id);
          setSelectedJobApplication(currentJob);
        }
      }
    }
  }, [id]);

  // Update selected job application when ID changes
  useEffect(() => {
    if (candidate && selectedJobApplicationId) {
      const jobApp = getJobApplication(candidate, selectedJobApplicationId);
      setSelectedJobApplication(jobApp || null);
    }
  }, [candidate, selectedJobApplicationId]);

  if (!candidate) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Candidate not found
          </h2>
          <p className="text-slate-600 mt-2">
            The candidate you're looking for doesn't exist.
          </p>
          <Link to="/candidates">
            <Button className="mt-4">Back to Candidates</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleJobSelect = (jobId: string) => {
    setSelectedJobApplicationId(jobId);
    setShowAllJobs(false);
  };

  // Enhanced StatusTracker that shows progress for selected job
  const StatusTracker = () => {
    if (!selectedJobApplication) return null;

    const stages = ["Applied", "Screening", "Interview", "Technical", "Offer", "Hired"];
    const currentStageIndex = stages.findIndex(stage => stage === selectedJobApplication.currentStage);
    const completedStages = selectedJobApplication.stageHistory.length;
    const totalStages = stages.length;

    return (
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">Application Progress</span>
              <Badge variant="outline" className="text-sm">
                {selectedJobApplication.jobTitle}
              </Badge>
              <HelpTooltip content={helpContent.effortTime} />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Update Stage
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Job Context Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{selectedJobApplication.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{selectedJobApplication.recruiter}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{selectedJobApplication.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{selectedJobApplication.priority} Priority</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Overall Progress
              </span>
              <span className="text-sm text-slate-500">
                {completedStages} of {totalStages} stages
              </span>
            </div>
            <Progress
              value={(completedStages / totalStages) * 100}
              className="h-2"
            />
          </div>

          {/* Current Stage Highlight */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Circle className="w-5 h-5 fill-current text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-green-900 truncate">
                  Current: {selectedJobApplication.currentStage}
                </h4>
                <p className="text-sm text-green-700 text-wrap">
                  {selectedJobApplication.stageHistory[selectedJobApplication.stageHistory.length - 1]?.notes || 
                   "Stage in progress"}
                </p>
              </div>
            </div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((stageName, index) => {
              const stageData = selectedJobApplication.stageHistory.find(s => s.stage === stageName);
              const isCompleted = !!stageData;
              const isCurrent = stageName === selectedJobApplication.currentStage;
              
              return (
                <div key={stageName} className="text-center relative">
                  {/* Email status indicator */}
                  <div className="flex justify-center mb-1">
                    {stageData?.mailSent ? (
                      stageData.mailConfirmed ? (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      ) : (
                        <MailCheck className="w-4 h-4 text-green-500" />
                      )
                    ) : (
                      <Mail className="w-4 h-4 text-slate-300" />
                    )}
                  </div>

                  {/* Circle stage */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mx-auto mb-2 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isCurrent
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Circle className="w-4 h-4 fill-current" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>

                  {/* Stage name */}
                  <div className="text-xs font-medium text-slate-700 truncate px-1">
                    {stageName}
                  </div>

                  {/* Duration */}
                  {stageData && stageData.duration > 0 && (
                    <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span className="truncate">{stageData.duration}d</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 truncate block">
                  Total Time: {selectedJobApplication.stageHistory.reduce((acc, stage) => acc + stage.duration, 0)} days
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Target className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 truncate block">
                  Status: {selectedJobApplication.status}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-600 truncate block">
                  {completedStages} of {totalStages} completed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeftPanel = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Candidate Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Avatar className="w-16 h-16 mx-auto sm:mx-0">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-lg">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {candidate.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 text-wrap">
                  {candidate.jobApplications.length} Job Applications
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
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
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.phone}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">{candidate.location}</span>
            </div>
            <div className="flex items-center space-x-3 min-w-0">
              <GraduationCap className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm truncate">
                Experience: {candidate.experience}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="truncate max-w-full"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="truncate max-w-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Job Applications Summary */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-slate-900 mb-3">Job Applications Overview</h4>
            <div className="space-y-2">
              {candidate.jobApplications.map((job) => {
                const isSelected = job.id === selectedJobApplicationId;
                return (
                  <div
                    key={job.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => handleJobSelect(job.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">{job.jobTitle}</span>
                      <Badge 
                        variant={job.status === "Active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {job.currentStage}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600">
                      {job.department} • {job.priority} Priority
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/candidates">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Enhanced Candidate Profile
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Multiple job applications with individual progress tracking
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-slate-600">{candidate.source}</span>
            </Badge>
            <Badge
              variant="default"
              className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start"
            >
              {candidate.jobApplications.length} Applications
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-6">
        {/* Job Selector */}
        <JobSelector
          jobApplications={candidate.jobApplications}
          selectedJobId={selectedJobApplicationId}
          onJobSelect={handleJobSelect}
          showAllJobs={showAllJobs}
          onToggleShowAll={() => setShowAllJobs(!showAllJobs)}
        />

        {/* Main Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 space-y-6 lg:space-y-0">
          {/* Left Panel */}
          <div className="lg:col-span-4">
            <LeftPanel />
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-8">
            <StatusTracker />

            {/* Notes and Timeline for Selected Job */}
            {selectedJobApplication && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Job-Specific Notes & Timeline
                    <Badge variant="outline">{selectedJobApplication.jobTitle}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="timeline">Stage Timeline</TabsTrigger>
                      <TabsTrigger value="notes">Notes ({selectedJobApplication.notes.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline" className="space-y-4">
                      <div className="space-y-4">
                        {selectedJobApplication.stageHistory.map((stage) => (
                          <div
                            key={stage.id}
                            className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="w-3 h-3 rounded-full bg-green-500 mt-2" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-slate-900">
                                  {stage.stage}
                                </h4>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {stage.duration} days
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {stage.startDate} {stage.endDate && `- ${stage.endDate}`}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                by {stage.userName}
                              </p>
                              {stage.notes && (
                                <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                                  {stage.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4">
                      <div className="space-y-4">
                        {selectedJobApplication.notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{note.userName}</span>
                              <span className="text-xs text-slate-500">
                                {new Date(note.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{note.content}</p>
                            {note.tags && (
                              <div className="flex gap-1 mt-2">
                                {note.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
