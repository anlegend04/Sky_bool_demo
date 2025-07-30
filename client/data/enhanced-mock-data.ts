// Enhanced mock data utilities for multiple job applications
import { CandidateData, JobApplicationData } from "@/data/hardcoded-data";
import { JobApplication, EnhancedCandidateData } from "@/types/enhanced-candidate";

// Helper function to get a specific job application from enhanced candidate data
export function getJobApplication(
  candidateData: EnhancedCandidateData,
  jobApplicationId: string,
): JobApplication | undefined {
  return candidateData.jobApplications.find((app) => app.id === jobApplicationId);
}

// Helper function to get the current/primary job application
export function getCurrentJobApplication(
  candidateData: EnhancedCandidateData,
): JobApplication | undefined {
  // Return the highest priority active application, or the first one
  const activeApplications = candidateData.jobApplications.filter(
    (app) => app.status === "Active",
  );
  
  if (activeApplications.length === 0) {
    return candidateData.jobApplications[0];
  }

  // Sort by priority (High > Medium > Low) and return the first
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  return activeApplications.sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
  )[0];
}

// Convert CandidateData to EnhancedCandidateData format
export function convertCandidateToEnhanced(
  candidate: CandidateData,
): EnhancedCandidateData {
  return {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    experience: candidate.experience,
    skills: candidate.skills,
    status: candidate.status,
    resume: candidate.resume,
    avatar: candidate.avatar,
    source: candidate.source,
    tags: candidate.tags,
    attachments: candidate.attachments,
    linkedInProfile: candidate.linkedInProfile,
    githubProfile: candidate.githubProfile,
    portfolioUrl: candidate.portfolioUrl,
    education: candidate.education,
    workExperience: candidate.workExperience,
    lastActivity: candidate.lastActivity,
    communicationPreference: candidate.communicationPreference,
    timezone: candidate.timezone,
    availability: candidate.availability,
    cvEvaluations: candidate.cvEvaluations,
    jobApplications: candidate.jobApplications.map(app => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      department: app.department,
      appliedDate: app.appliedDate,
      currentStage: app.currentStage,
      stageHistory: app.stageHistory,
      notes: app.notes,
      emails: app.emails,
      priority: app.priority,
      recruiter: app.recruiter,
      status: app.status,
      salary: app.salary,
      location: app.location,
    })),
    globalNotes: candidate.globalNotes,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
}

// Get enhanced candidate data from the main hardcoded data
export function getEnhancedCandidate(candidateId: string): EnhancedCandidateData | null {
  const { getCandidate } = require("@/data/hardcoded-data");
  const candidate = getCandidate(candidateId);
  
  if (!candidate) {
    return null;
  }

  return convertCandidateToEnhanced(candidate);
}

// Get all enhanced candidates
export function getAllEnhancedCandidates(): EnhancedCandidateData[] {
  const { HARDCODED_CANDIDATES } = require("@/data/hardcoded-data");
  return HARDCODED_CANDIDATES.map(convertCandidateToEnhanced);
}
