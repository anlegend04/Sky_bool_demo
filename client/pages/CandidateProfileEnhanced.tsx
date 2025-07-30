import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  FileText,
  Briefcase,
  Building2,
  GraduationCap,
  DollarSign,
  MoreHorizontal,
  Edit,
  Download,
  Share,
  Eye,
  Star,
  ExternalLink,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  Circle,
  ArrowRight,
  ChevronRight,
  Target,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ENHANCED_CANDIDATE_SAMPLE,
  getCurrentJobApplication,
} from "@/data/enhanced-mock-data";
import { JobApplication } from "@/types/enhanced-candidate";

export default function CandidateProfileEnhanced() {
  const { id } = useParams();
  const [candidate] = useState(ENHANCED_CANDIDATE_SAMPLE);
  const [selectedCVEvaluation, setSelectedCVEvaluation] = useState<any>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const { toast } = useToast();

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

  const primaryApplication = getCurrentJobApplication(candidate);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "default";
      case "On Hold":
        return "secondary";
      case "Withdrawn":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "Hired":
        return "default";
      case "Rejected":
        return "destructive";
      case "Offer":
        return "default";
      case "Technical":
      case "Interview":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const JobApplicationCard = ({
    application,
  }: {
    application: JobApplication;
  }) => {
    const completedStages = application.stageHistory.length;
    const totalStages = 6; // Applied, Screening, Interview, Technical, Offer, Hired
    const progressPercentage = (completedStages / totalStages) * 100;

    return (
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary group">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between sm:justify-start gap-2">
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors text-base sm:text-lg flex-1 min-w-0">
                    {application.jobTitle}
                  </h3>
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/candidates/${candidate.id}/jobs/${application.id}/progress`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Progress
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Application
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 mt-2 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-1 min-w-0">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{application.department}</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{application.recruiter}</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <Badge
                  className={`${getPriorityColor(application.priority)} border font-medium`}
                >
                  {application.priority}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/candidates/${candidate.id}/jobs/${application.id}/progress`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Progress
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Application
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Export Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Status and Stage */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={getStatusBadgeVariant(application.status)}
                  className={`sm:hidden ${getPriorityColor(application.priority)} border font-medium`}
                >
                  {application.priority}
                </Badge>
                <Badge variant={getStatusBadgeVariant(application.status)}>
                  <Activity className="w-3 h-3 mr-1" />
                  {application.status}
                </Badge>
                <Badge variant={getStageBadgeVariant(application.currentStage)}>
                  <Target className="w-3 h-3 mr-1" />
                  {application.currentStage}
                </Badge>
              </div>
              {application.salary && (
                <Badge variant="outline" className="w-fit">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Salary: </span>
                  {application.salary}
                </Badge>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="text-slate-500">
                  {completedStages}/{totalStages} stages
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Recent Activity */}
            {application.stageHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      Last updated:{" "}
                      {new Date(
                        application.stageHistory[
                          application.stageHistory.length - 1
                        ]?.startDate || "",
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    to={`/candidates/${candidate.id}/jobs/${application.id}/progress`}
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 group w-fit"
                  >
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CandidateOverview = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-20 h-20 mx-auto sm:mx-0">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-xl">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900 truncate">
                {candidate.name}
              </h2>
              <p className="text-lg text-slate-600 mt-1">
                {primaryApplication?.jobTitle || "Multiple Positions"}
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < candidate.rating
                        ? "text-yellow-400 fill-current"
                        : "text-slate-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-slate-600">
                  ({candidate.rating}/5)
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowResumePreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Resume
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="w-4 h-4 mr-2" />
                Share Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.phone}</span>
            </div>
            <div className="flex items-center space-x-3 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{candidate.location}</span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">
            Professional Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span className="text-sm">
                Experience: {candidate.experience}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Status: {candidate.status}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm">
                Availability: {candidate.availability}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Timezone: {candidate.timezone}</span>
            </div>
          </div>
        </div>

        {/* External Links */}
        {(candidate.linkedInProfile ||
          candidate.githubProfile ||
          candidate.portfolioUrl) && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              External Links
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.linkedInProfile && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={candidate.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
              {candidate.githubProfile && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={candidate.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
              {candidate.portfolioUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={candidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/candidates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Candidate Profile
              </h1>
              <p className="text-slate-600">
                Comprehensive view of {candidate.name}'s applications and
                progress
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <span>{candidate.source}</span>
              <HelpTooltip content="Source where the candidate was found" />
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              {candidate.jobApplications.length} Application
              {candidate.jobApplications.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Panel - Candidate Overview */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <CandidateOverview />
          </div>

          {/* Right Panel - Job Applications */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger
                  value="applications"
                  className="text-xs sm:text-sm px-2 py-2"
                >
                  <span className="hidden sm:inline">Job Applications</span>
                  <span className="sm:hidden">Jobs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="text-xs sm:text-sm px-2 py-2"
                >
                  <span className="hidden sm:inline">
                    Education & Experience
                  </span>
                  <span className="sm:hidden">Experience</span>
                </TabsTrigger>
                <TabsTrigger
                  value="evaluations"
                  className="text-xs sm:text-sm px-2 py-2"
                >
                  <span className="hidden sm:inline">CV Evaluations</span>
                  <span className="sm:hidden">CV Eval</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        Active Applications ({candidate.jobApplications.length})
                      </span>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Apply to New Job
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidate.jobApplications.map((application) => (
                        <JobApplicationCard
                          key={application.id}
                          application={application}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                {/* Education */}
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidate.education.map((edu) => (
                        <div
                          key={edu.id}
                          className="border-l-4 border-l-primary pl-4"
                        >
                          <h4 className="font-medium text-slate-900">
                            {edu.degree} in {edu.field}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-slate-500">
                            Graduated: {edu.graduationYear}{" "}
                            {edu.gpa && `• GPA: ${edu.gpa}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Work Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidate.workExperience.map((work) => (
                        <div
                          key={work.id}
                          className="border-l-4 border-l-secondary pl-4"
                        >
                          <h4 className="font-medium text-slate-900">
                            {work.position}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {work.company}
                          </p>
                          <p className="text-sm text-slate-500">
                            {work.startDate} - {work.endDate || "Present"}
                          </p>
                          <p className="text-sm text-slate-600 mt-2">
                            {work.description}
                          </p>
                          {work.achievements &&
                            work.achievements.length > 0 && (
                              <ul className="text-sm text-slate-600 mt-2 list-disc list-inside">
                                {work.achievements.map((achievement, index) => (
                                  <li key={index}>{achievement}</li>
                                ))}
                              </ul>
                            )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>CV Evaluations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candidate.cvEvaluations &&
                    candidate.cvEvaluations.length > 0 ? (
                      <div className="space-y-4">
                        {candidate.cvEvaluations.map((evaluation) => (
                          <div
                            key={evaluation.id}
                            className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    evaluation.finalVerdict === "Good Fit"
                                      ? "bg-green-500"
                                      : evaluation.finalVerdict ===
                                          "Needs Improvement"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                />
                                <span className="font-medium">
                                  {evaluation.finalVerdict}
                                </span>
                                <Badge variant="outline">
                                  {evaluation.jobFitScore}% match
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedCVEvaluation(evaluation)
                                }
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {evaluation.summary}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {evaluation.strengths
                                .slice(0, 3)
                                .map((strength, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {strength}
                                  </Badge>
                                ))}
                              {evaluation.strengths.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{evaluation.strengths.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">
                          No CV evaluations available
                        </p>
                        <Button className="mt-4" size="sm">
                          Start CV Evaluation
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Resume Preview Dialog */}
      <Dialog open={showResumePreview} onOpenChange={setShowResumePreview}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
            <DialogDescription>{candidate.resume}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 rounded-lg p-4 min-h-[60vh] flex items-center justify-center">
            <div className="text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="mb-2">Resume Preview</p>
              <p className="text-sm">PDF viewer would be integrated here</p>
              <Button className="mt-4">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Evaluation Dialog */}
      <Dialog
        open={!!selectedCVEvaluation}
        onOpenChange={() => setSelectedCVEvaluation(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              CV Evaluation Details
              <Badge
                variant={
                  selectedCVEvaluation?.finalVerdict === "Good Fit"
                    ? "default"
                    : selectedCVEvaluation?.finalVerdict === "Needs Improvement"
                      ? "secondary"
                      : "destructive"
                }
              >
                {selectedCVEvaluation?.finalVerdict}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Analysis for {selectedCVEvaluation?.fileName} •{" "}
              {selectedCVEvaluation?.jobFitScore}% job fit score
            </DialogDescription>
          </DialogHeader>
          {selectedCVEvaluation && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm text-slate-600">
                  {selectedCVEvaluation.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {selectedCVEvaluation.strengths.map(
                      (strength: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-slate-600 flex items-start gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {selectedCVEvaluation.weaknesses.map(
                      (weakness: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-slate-600 flex items-start gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {weakness}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills Match</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCVEvaluation.skillsMatch.map(
                    (skill: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            skill.hasSkill ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm truncate">{skill.skill}</span>
                        {skill.hasSkill && skill.level && (
                          <Badge variant="outline" className="text-xs">
                            {skill.level}
                          </Badge>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {selectedCVEvaluation.recommendations.map(
                    (rec: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-slate-600 flex items-start gap-2"
                      >
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {selectedCVEvaluation.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    {selectedCVEvaluation.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
