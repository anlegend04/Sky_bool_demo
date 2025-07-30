import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  ArrowLeft,
  Share,
  Edit,
  MoreHorizontal,
  Star,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Building,
  Target,
  TrendingUp,
  Plus,
  Grid3X3,
  List,
  AlertCircle,
  CheckCircle,
  Pause,
  User,
  Activity,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getJob,
  getJobCandidates,
  JobData,
  CandidateData,
} from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";
import BudgetPanel from "@/components/BudgetPanel";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<JobData | null>(null);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [showAddStageDialog, setShowAddStageDialog] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [draggedCandidate, setDraggedCandidate] =
    useState<CandidateData | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [showEditJobDialog, setShowEditJobDialog] = useState(false);
  const [selectedCandidatePopup, setSelectedCandidatePopup] =
    useState<CandidateData | null>(null);
  const [showMoreCandidates, setShowMoreCandidates] = useState<{
    [key: string]: boolean;
  }>({});
  const { toast } = useToast();

  const stages = [
    "Applied",
    "Screening",
    "Interview",
    "Technical",
    "Offer",
    "Hired",
    "Rejected",
  ];

  // Load job and candidates from hardcoded data
  useEffect(() => {
    if (id) {
      const jobData = getJob(id);
      if (jobData) {
        setJob(jobData);

        // Get candidates for this job
        const jobCandidates = getJobCandidates(id);
        setCandidates(jobCandidates);
      }
    }
  }, [id]);

  if (!job) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
          <p className="text-slate-600 mt-2">
            The job you're looking for doesn't exist.
          </p>
          <Link to="/jobs">
            <Button className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInlineEdit = (field: string, value: any) => {
    if (!job) return;

    // In a real app, this would update the job
    setJob({ ...job, [field]: value });
    setEditingField(null);
    toast({
      title: "Updated",
      description: `${field} has been updated successfully.`,
    });
  };

  // Drag and drop handlers
  const handleDragStart = (candidate: CandidateData) => {
    setDraggedCandidate(candidate);
  };

  const handleDragEnd = () => {
    setDraggedCandidate(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (draggedCandidate) {
      // Update the candidate's stage
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c.id === draggedCandidate.id ? { ...c, stage: newStage as CandidateData['stage'] } : c
        )
      );

      toast({
        title: "Candidate moved",
        description: `${draggedCandidate.name} moved to ${newStage} stage.`,
      });

      setDraggedCandidate(null);
      setDragOverStage(null);
    }
  };

  // Handle send email
  const handleSendEmail = (candidate: CandidateData) => {
    console.log("Sending email to:", candidate.name);
    toast({
      title: "Email sent",
      description: `Email sent to ${candidate.name}.`,
    });
  };

  // Handle schedule interview
  const handleScheduleInterview = (candidate: CandidateData) => {
    console.log("Scheduling interview with:", candidate.name);
    toast({
      title: "Interview scheduled",
      description: `Interview scheduled with ${candidate.name}.`,
    });
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Applied":
        return "bg-blue-50 border-blue-200";
      case "Screening":
        return "bg-yellow-50 border-yellow-200";
      case "Interview":
        return "bg-purple-50 border-purple-200";
      case "Technical":
        return "bg-orange-50 border-orange-200";
      case "Offer":
        return "bg-green-50 border-green-200";
      case "Hired":
        return "bg-emerald-50 border-emerald-200";
      case "Rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const getCandidateStatusColor = (candidate: CandidateData) => {
    // Green = progressing, Red = blocked, Gray = in review
    if (candidate.stage === "Hired") return "border-l-green-500";
    if (candidate.stage === "Rejected") return "border-l-red-500";
    if (["Interview", "Technical", "Offer"].includes(candidate.stage))
      return "border-l-green-500";
    if (candidate.duration > 7) return "border-l-red-500"; // Blocked if more than 7 days
    return "border-l-gray-500"; // In review
  };

  const CandidateCard = ({ candidate }: { candidate: CandidateData }) => (
    <Card
      className={`hover:shadow-md transition-shadow border-l-4 cursor-move ${getCandidateStatusColor(candidate)} ${
        draggedCandidate?.id === candidate.id ? "opacity-50 scale-95" : ""
      }`}
      draggable
      onDragStart={() => handleDragStart(candidate)}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-3 min-w-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-xs sm:text-sm">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <Link
                to={`/candidates/${candidate.id}`}
                className="font-medium text-slate-900 hover:text-blue-600 text-sm sm:text-base break-words block"
              >
                {candidate.name}
              </Link>
              <p className="text-xs text-slate-600 break-words">
                {candidate.experience}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to={`/candidates/${candidate.id}`}>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => handleSendEmail(candidate)}>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScheduleInterview(candidate)}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="break-words">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="break-words">{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs break-words">
              {candidate.duration} days in stage
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            {/* Rating removed */}
          </div>
          <Badge
            variant="outline"
            className="text-xs flex-shrink-0 break-words max-w-20"
          >
            {candidate.source}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const CompactCandidateCard = ({
    candidate,
  }: {
    candidate: CandidateData;
  }) => (
    <div
      className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
      onClick={() => setSelectedCandidatePopup(candidate)}
      draggable
      onDragStart={() => handleDragStart(candidate)}
      onDragEnd={handleDragEnd}
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
        <p className="text-sm font-medium text-slate-900 break-words">
          {candidate.name}
        </p>
        <p className="text-xs text-slate-500 break-words">
          {candidate.duration} days
        </p>
      </div>
      {/* Rating removed */}
    </div>
  );

  // const PipelineGridView = () => (
  //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto">
  //     {stages.map((stage) => {
  //       const stageCandidates = candidates.filter((c) => c.stage === stage);
  //       const isDropTarget = dragOverStage === stage;
  //       const maxVisible = 5;
  //       const showingMore = showMoreCandidates[stage] || false;
  //       const visibleCandidates = showingMore
  //         ? stageCandidates
  //         : stageCandidates.slice(0, maxVisible);
  //       const hasMore = stageCandidates.length > maxVisible;

  //       return (
  //         <div
  //           key={stage}
  //           className={`rounded-lg border p-4 transition-all ${getStageColor(stage)} min-w-[200px] ${
  //             isDropTarget
  //               ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50"
  //               : ""
  //           }`}
  //           onDragOver={(e) => handleDragOver(e, stage)}
  //           onDragLeave={handleDragLeave}
  //           onDrop={(e) => handleDrop(e, stage)}
  //         >
  //           <div className="flex items-center justify-between mb-4 min-w-0">
  //             <h3 className="font-semibold text-sm text-slate-900 truncate flex-1">
  //               {stage}
  //             </h3>
  //             <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
  //               {stageCandidates.length}
  //             </Badge>
  //           </div>
  //           <div className="space-y-2 min-h-[200px] relative">
  //             {visibleCandidates.map((candidate) => (
  //               <CompactCandidateCard
  //                 key={candidate.id}
  //                 candidate={candidate}
  //               />
  //             ))}
  //             {stageCandidates.length === 0 && (
  //               <div className="text-center text-slate-400 text-xs py-8">
  //                 {isDropTarget ? "Drop candidate here" : "No candidates"}
  //               </div>
  //             )}
  //             {hasMore && (
  //               <Button
  //                 variant="ghost"
  //                 size="sm"
  //                 className="w-full text-xs"
  //                 onClick={() =>
  //                   setShowMoreCandidates((prev) => ({
  //                     ...prev,
  //                     [stage]: !showingMore,
  //                   }))
  //                 }
  //               >
  //                 {showingMore
  //                   ? `Show Less`
  //                   : `Show ${stageCandidates.length - maxVisible} More`}
  //               </Button>
  //             )}
  //             {isDropTarget && (
  //               <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-50" />
  //             )}
  //           </div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  const PipelineGridView = ({
    stages,
    candidates,
    dragOverStage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }) => {
    const [expandedStage, setExpandedStage] = useState(null);
    const [candidatesPerStage, setCandidatesPerStage] = useState<Record<string, number>>({});

    const showMoreCandidates = (stage: string) => {
      setCandidatesPerStage(prev => ({
        ...prev,
        [stage]: (prev[stage] || 5) + 5
      }));
    };

    const resetStagePagination = (stage: string) => {
      setCandidatesPerStage(prev => ({
        ...prev,
        [stage]: 5
      }));
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto p-2">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);
          const isDropTarget = dragOverStage === stage;
          const isExpanded = expandedStage === stage;
          const maxVisible = candidatesPerStage[stage] || 5;
          const visibleCandidates = stageCandidates.slice(0, maxVisible);
          const hasMore = stageCandidates.length > maxVisible;

          return (
            <div
              key={stage}
              className={`rounded border p-2 ${isDropTarget ? "ring-2 ring-blue-300 bg-blue-50" : "bg-white"} min-w-[150px]`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
              onClick={() => {
                setExpandedStage(isExpanded ? null : stage);
                if (!isExpanded) {
                  resetStagePagination(stage);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-xs text-gray-800 break-words">
                  {stage}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {stageCandidates.length}
                </Badge>
              </div>
              {isExpanded && (
                <div className="mt-2 space-y-1">
                  {stageCandidates.length > 0 ? (
                    <>
                      {visibleCandidates.map((candidate) => (
                        <CompactCandidateCard
                          key={candidate.id}
                          candidate={candidate}
                        />
                      ))}
                      {hasMore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            showMoreCandidates(stage);
                          }}
                        >
                          Show {stageCandidates.length - maxVisible} More
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-2">
                      No candidates
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const PipelineListView = () => (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead>
              <tr className="text-slate-600 border-b">
                <th className="px-4 py-2">Candidate</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Stage</th>
                <th className="px-4 py-2">Days in Stage</th>
                                    <th className="px-4 py-2">Actions</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{candidate.email}</td>
                    <td className="px-4 py-2">{candidate.location}</td>
                    <td className="px-4 py-2">{candidate.stage}</td>
                    <td className="px-4 py-2">{candidate.duration} days</td>
                    <td className="px-4 py-2">
                      {/* Rating removed */}
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="text-xs">
                        {candidate.source}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`/candidates/${candidate.id}`}>
                            <DropdownMenuItem>
                              <User className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-slate-400 py-6">
                    No candidates available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const EditableField = ({
    field,
    value,
    type = "text",
  }: {
    field: string;
    value: any;
    type?: string;
  }) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="h-8"
            type={type}
            autoFocus
          />
          <Button size="sm" onClick={() => handleInlineEdit(field, tempValue)}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingField(null)}
          >
            Cancel
          </Button>
        </div>
      );
    }

    return (
      <span
        className="cursor-pointer hover:bg-slate-100 px-2 py-1 rounded"
        onClick={() => {
          setEditingField(field);
          setTempValue(value?.toString() || "");
        }}
      >
        {value || "Click to edit"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/jobs">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {job.position}
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                {job.department} • {job.location}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Badge
              variant={
                job.priority === "High"
                  ? "destructive"
                  : job.priority === "Medium"
                    ? "secondary"
                    : "outline"
              }
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              {job.priority} Priority
            </Badge>
            <Badge
              variant={
                job.status === "Open"
                  ? "default"
                  : job.status === "Closed"
                    ? "outline"
                    : "secondary"
              }
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              {job.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Applications</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {job.applications}
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">In Interview</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {
                      candidates.filter((c) =>
                        ["Interview", "Technical"].includes(c.stage),
                      ).length
                    }
                  </p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Hired / Target</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {job.hired} / {job.target}
                  </p>
                </div>
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Budget Used</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {Math.round(
                      (parseInt(job.actualCost) / parseInt(job.estimatedCost)) *
                        100,
                    )}
                    %
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Job Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Job Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Job Summary
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditJobDialog(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <p className="text-sm text-slate-600 mt-1">{job.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <p className="text-sm text-slate-600">{job.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Domain
                  </label>
                  <p className="text-sm text-slate-600">{job.domain}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Skills Required
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.expectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Team & Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Recruiter
                  </label>
                  <EditableField field="recruiter" value={job.recruiter} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Interviewers
                  </label>
                  <p className="text-sm text-slate-600">{job.requester}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Headcount
                    <HelpTooltip content={helpContent.headcount} />
                  </label>
                  <EditableField
                    field="headcount"
                    value={job.headcount}
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Hired
                  </label>
                  <p className="text-sm text-slate-600">{job.hired}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Est. Budget
                    <HelpTooltip content={helpContent.estimatedBudget} />
                  </label>
                  <EditableField
                    field="estimatedCost"
                    value={`$${job.estimatedCost}`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Actual Cost
                    <HelpTooltip content={helpContent.actualBudget} />
                  </label>
                  <EditableField
                    field="actualCost"
                    value={`$${job.actualCost}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Salary Range
                </label>
                <p className="text-sm text-slate-600">
                  ${job.salaryMin} - ${job.salaryMax}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Performance & Timeline
                <HelpTooltip content={helpContent.performanceIndicator} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Performance Score</span>
                  <span className="font-medium">{job.performance}%</span>
                </div>
                <Progress value={job.performance} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Open Date
                  </label>
                  <p className="text-sm text-slate-600">{job.openDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Deadline
                  </label>
                  <p className="text-sm text-slate-600">{job.deadline}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Duration Since Created
                </label>
                <p className="text-sm text-slate-600">
                  {Math.floor(
                    (new Date().getTime() - new Date(job.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </p>
              </div>
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Recent Activity
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Job updated{" "}
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(job.updatedAt).getTime()) /
                        (1000 * 60 * 60),
                    )}{" "}
                    hours ago
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {job.applications} applications received
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidate Pipeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Candidate Pipeline
                  <HelpTooltip content={helpContent.pipelineSummary} />
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Manage candidates grouped by recruitment stages
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Kanban
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                </div>
                {/* <Button size="sm" onClick={() => setShowAddStageDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stage
                </Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <PipelineGridView
                stages={stages}
                candidates={candidates}
                dragOverStage={dragOverStage}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
              />
            ) : (
              <PipelineListView />
            )}
          </CardContent>
        </Card>

        {/* Budget Panel */}
        <BudgetPanel job={job} onJobUpdate={setJob} />
      </div>

      {/* Edit Job Dialog */}
      <Dialog open={showEditJobDialog} onOpenChange={setShowEditJobDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job Details</DialogTitle>
            <DialogDescription>
              Update job information and requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Position</label>
                <Input defaultValue={job.position} />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Input defaultValue={job.department} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input defaultValue={job.location} />
              </div>
              <div>
                <label className="text-sm font-medium">Job Type</label>
                <Select defaultValue={job.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea defaultValue={job.description} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Salary Min</label>
                <Input defaultValue={job.salaryMin} type="number" />
              </div>
              <div>
                <label className="text-sm font-medium">Salary Max</label>
                <Input defaultValue={job.salaryMax} type="number" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEditJobDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Job Updated",
                    description: "Job details have been successfully updated",
                  });
                  setShowEditJobDialog(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Details Popup */}
      <Dialog
        open={!!selectedCandidatePopup}
        onOpenChange={() => setSelectedCandidatePopup(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedCandidatePopup?.avatar} />
                <AvatarFallback>
                  {selectedCandidatePopup?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {selectedCandidatePopup?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedCandidatePopup?.position}
            </DialogDescription>
          </DialogHeader>
          {selectedCandidatePopup && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <p className="text-sm text-slate-600">
                    {selectedCandidatePopup.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <p className="text-sm text-slate-600">
                    {selectedCandidatePopup.phone}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Location
                </label>
                <p className="text-sm text-slate-600">
                  {selectedCandidatePopup.location}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Experience
                </label>
                <p className="text-sm text-slate-600">
                  {selectedCandidatePopup.experience}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Current Stage
                </label>
                <Badge className="mt-1">{selectedCandidatePopup.stage}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Skills
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCandidatePopup.skills.slice(0, 6).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {selectedCandidatePopup.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedCandidatePopup.skills.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Link
                  to={`/candidates/${selectedCandidatePopup.id}`}
                  className="flex-1"
                >
                  <Button className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </Link>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Custom Stage Dialog */}
      <Dialog open={showAddStageDialog} onOpenChange={setShowAddStageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Stage</DialogTitle>
            <DialogDescription>
              Add a new stage to the recruitment pipeline for this job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Stage Name
              </label>
              <Input
                placeholder="e.g., Portfolio Review, Final Interview"
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddStageDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In a real app, you'd add this to the stages array
                  toast({
                    title: "Stage Added",
                    description: `"${newStage}" has been added to the pipeline.`,
                  });
                  setShowAddStageDialog(false);
                  setNewStage("");
                }}
              >
                Add Stage
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
