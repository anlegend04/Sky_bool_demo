// Enhanced data types to support multiple job applications per candidate

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  currentStage: "Applied" | "Screening" | "Interview" | "Technical" | "Offer" | "Hired" | "Rejected";
  stageHistory: StageHistoryData[];
  notes: NoteData[];
  emails: EmailData[];
  priority: "High" | "Medium" | "Low";
  recruiter: string;
  status: "Active" | "On Hold" | "Withdrawn" | "Completed";
  salary?: string;
  location?: string;
}

export interface EnhancedCandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  status: "Active" | "Inactive" | "Blacklisted";
  rating: number;
  resume: string;
  avatar: string;
  source: string;
  tags: string[];
  attachments: AttachmentData[];
  linkedInProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  education: EducationData[];
  workExperience: WorkExperienceData[];
  lastActivity: string;
  communicationPreference: "email" | "phone" | "video";
  timezone: string;
  availability: string;
  cvEvaluations?: CVEvaluationData[];
  // Multiple job applications
  jobApplications: JobApplication[];
  // Global candidate notes (not job-specific)
  globalNotes: NoteData[];
  createdAt: string;
  updatedAt: string;
}

// Import existing types
import { 
  StageHistoryData, 
  NoteData, 
  EmailData, 
  AttachmentData, 
  EducationData, 
  WorkExperienceData, 
  CVEvaluationData 
} from '@/data/hardcoded-data';
