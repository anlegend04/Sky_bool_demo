// Comprehensive Mock Data for Recruitment System
// This file contains realistic, interconnected data for all system features

export interface JobData {
  id: string;
  position: string;
  department: string;
  recruiter: string;
  applications: number;
  target: number;
  hired: number;
  openDate: string;
  deadline: string;
  estimatedCost: string;
  actualCost: string;
  performance: number;
  status: "Open" | "Closed" | "In Progress" | "Paused";
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
  priority: "High" | "Medium" | "Low";
  emailAlias: string;
  expectedSkills: string[];
  salaryMin: string;
  salaryMax: string;
  domain: string;
  headcount: number;
  requester: string;
  interviewers?: string[];
  pipelineSummary: {
    applied: number;
    screening: number;
    interview: number;
    technical: number;
    offer: number;
    hired: number;
    rejected: number;
  };
  budget?: {
    estimated: number;
    actual: number;
    expenses: ExpenseData[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  status: "Active" | "Inactive" | "Blacklisted";
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
  // Job applications - supporting multiple applications per candidate
  jobApplications: JobApplicationData[];
  // Global candidate notes (not job-specific)
  globalNotes: NoteData[];
  createdAt: string;
  updatedAt: string;
}

// Job application data for candidates
export interface JobApplicationData {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  currentStage:
    | "Applied"
    | "Screening"
    | "Interview"
    | "Technical"
    | "Offer"
    | "Hired"
    | "Rejected";
  stageHistory: StageHistoryData[];
  notes: NoteData[];
  emails: EmailData[];
  priority: "High" | "Medium" | "Low";
  recruiter: string;
  status: "Active" | "On Hold" | "Withdrawn" | "Completed";
  salary?: string;
  location?: string;
}

// CV Evaluation Interfaces
export interface CVEvaluationData {
  id: string;
  candidateId: string;
  jobId: string;
  fileName: string;
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
  notes?: string;
  savedAt: string;
  createdBy: string;
  isShared: boolean;
  shareUrl?: string;
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
}

export interface WorkExperienceData {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface ExpenseData {
  id: string;
  amount: number;
  category:
    | "Job Boards"
    | "Recruitment Agency"
    | "Events"
    | "Tools"
    | "Social Media Ads"
    | "Referral Bonus"
    | "Assessment Tools"
    | "Interview Software"
    | "Background Checks"
    | "Other";
  description: string;
  expectedOutcome: string;
  evaluationPeriod: string;
  effectiveness?: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
  jobId?: string;
}

export interface StageHistoryData {
  id: string;
  stage: string;
  startDate: string;
  endDate?: string;
  duration: number;
  reason: string;
  notes: string;
  userId: string;
  userName: string;
  mailSent?: boolean;
  mailConfirmed?: boolean;
}

export interface NoteData {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
  type: "note" | "system";
  tags?: string[];
}

export interface EmailData {
  id: string;
  subject: string;
  content: string;
  from: string;
  to: string;
  timestamp: string;
  status: "sent" | "draft" | "failed";
  template: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
}

export interface AttachmentData {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface InterviewData {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerIds: string[];
  interviewerNames: string[];
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  type: "Phone" | "Video" | "In-Person" | "Technical";
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled" | "No-Show";
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: InterviewFeedbackData[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface InterviewFeedbackData {
  id: string;
  interviewId: string;
  interviewerId: string;
  interviewerName: string;
  overallRating: number; // 1-5
  technicalSkills: number;
  communicationSkills: number;
  culturalFit: number;
  problemSolving: number;
  comments: string;
  recommendation: "Strong Hire" | "Hire" | "No Hire" | "Strong No Hire";
  createdAt: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer" | "HR";
  department: string;
  avatar: string;
  phone: string;
  timezone: string;
  status: "Active" | "Inactive";
  permissions: string[];
  lastLogin: string;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type:
    | "candidate_moved"
    | "interview_scheduled"
    | "application_received"
    | "budget_exceeded"
    | "deadline_approaching"
    | "system"
    | "reminder";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  entityType?:
    | "job"
    | "candidate"
    | "interview"
    | "budget"
    | "deadline"
    | "other"
    | "schedule";
  entityId?: string;
  recipientId: string;
  senderId?: string;
  priority: "High" | "Medium" | "Low";
}

export interface ScheduleData {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: "Interview" | "Meeting" | "Deadline" | "Event" | "Reminder";
  attendees: string[];
  location?: string;
  meetingLink?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  relatedEntityType?: "job" | "candidate" | "interview";
  relatedEntityId?: string;
  createdBy: string;
  createdAt: string;
}

export interface ActivityData {
  id: string;
  type:
    | "stage_change"
    | "note_added"
    | "email_sent"
    | "interview_scheduled"
    | "application_received"
    | "file_uploaded"
    | "user_login";
  description: string;
  entityType: "job" | "candidate" | "interview" | "user" | "system";
  entityId: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: any;
}

export interface DashboardStatsData {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  activeCandidates: number;
  interviewsThisWeek: number;
  offersExtended: number;
  hiredThisMonth: number;
  avgTimeToHire: number;
  topPerformingJobs: string[];
  recentActivities: ActivityData[];
  upcomingInterviews: InterviewData[];
  pendingTasks: number;
  conversionRates: {
    applicationToScreening: number;
    screeningToInterview: number;
    interviewToOffer: number;
    offerToHire: number;
  };
}

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString().split('T')[0];
};

const getRandomDateTime = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString();
};

// Sample job applications for different scenarios
const createJobApplication = (
  id: string,
  jobId: string,
  jobTitle: string,
  department: string,
  currentStage: JobApplicationData['currentStage'],
  status: JobApplicationData['status'],
  priority: JobApplicationData['priority'],
  recruiter: string,
  appliedDate: string,
  salary?: string,
  location?: string
): JobApplicationData => {
  const stageHistory: StageHistoryData[] = [];
  const notes: NoteData[] = [];
  const emails: EmailData[] = [];

  // Create stage history based on current stage
  const stages = ["Applied", "Screening", "Interview", "Technical", "Offer", "Hired"];
  const currentStageIndex = stages.findIndex(stage => stage === currentStage);
  
  for (let i = 0; i <= currentStageIndex; i++) {
    const stage = stages[i];
    const startDate = getRandomDate(30 - i * 5);
    const endDate = i < currentStageIndex ? getRandomDate(25 - i * 5) : undefined;
    
    stageHistory.push({
      id: `stage_${id}_${i}`,
      stage,
      startDate,
      endDate,
      duration: endDate ? 3 + Math.floor(Math.random() * 7) : 0,
      reason: `Moved to ${stage} stage`,
      notes: `Candidate progressed to ${stage}`,
      userId: "user_1",
      userName: recruiter,
      mailSent: true,
      mailConfirmed: Math.random() > 0.3,
    });

    // Add emails for each stage
    emails.push({
      id: `email_${id}_${i}`,
      subject: `${stage} Stage Notification`,
      content: `You have been moved to the ${stage} stage for ${jobTitle}`,
      from: "hr@company.com",
      to: "candidate@email.com",
      timestamp: getRandomDateTime(20 - i * 3),
      status: "sent",
      template: `${stage.toLowerCase()}_notification`,
      openedAt: Math.random() > 0.2 ? getRandomDateTime(15 - i * 3) : undefined,
      repliedAt: Math.random() > 0.5 ? getRandomDateTime(10 - i * 3) : undefined,
    });
  }

  // Add some notes
  notes.push({
    id: `note_${id}_1`,
    content: `Strong candidate for ${jobTitle} position`,
    userId: "user_1",
    userName: recruiter,
    timestamp: getRandomDateTime(25),
    type: "note",
  });

  return {
    id,
    jobId,
    jobTitle,
    department,
    appliedDate,
    currentStage,
    stageHistory,
    notes,
    emails,
    priority,
    recruiter,
    status,
    salary,
    location,
  };
};

// Updated candidate data with multiple job applications
export const HARDCODED_CANDIDATES: CandidateData[] = [
  {
    id: "candidate_1",
    name: "Marissa Torres",
    email: "marissa.torres@email.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    experience: "5 years",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "Redux",
      "CSS3",
      "HTML5",
      "JavaScript",
    ],
    status: "Active",
    resume: "marissa_torres_resume.pdf",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b077?w=150&h=150&fit=crop&crop=face",
    source: "LinkedIn",
    tags: ["Strong Technical Skills", "Cultural Fit", "Fast Learner"],
    attachments: [
      {
        id: "att_1",
        name: "Resume.pdf",
        type: "application/pdf",
        size: 245760,
        url: "/files/marissa-torres-resume.pdf",
        uploadedAt: "2024-01-15T08:30:00Z",
        uploadedBy: "marissa.torres@email.com",
      },
    ],
    linkedInProfile: "https://linkedin.com/in/marissa-torres",
    githubProfile: "https://github.com/marissa-torres",
    portfolioUrl: "https://marissatorres.dev",
    education: [
      {
        id: "edu_1",
        institution: "UC Berkeley",
        degree: "Bachelor's",
        field: "Computer Science",
        graduationYear: "2019",
        gpa: "3.8",
      },
    ],
    workExperience: [
      {
        id: "work_1",
        company: "StartupCo",
        position: "Frontend Developer",
        startDate: "2019-06",
        endDate: "2022-12",
        description: "Developed responsive web applications using React and TypeScript",
        achievements: [
          "Reduced page load time by 40%",
          "Led UI/UX redesign project",
        ],
      },
      {
        id: "work_2",
        company: "TechFirm",
        position: "Senior Frontend Developer",
        startDate: "2023-01",
        description: "Lead frontend development for enterprise applications",
        achievements: [
          "Mentored 3 junior developers",
          "Implemented design system",
        ],
      },
    ],
    lastActivity: getRandomDateTime(2),
    communicationPreference: "email",
    timezone: "PST",
    availability: "Immediate",
    jobApplications: [
      createJobApplication(
        "app_1",
        "job_1",
        "Senior Frontend Developer",
        "Engineering",
        "Hired",
        "Completed",
        "High",
        "Alex Chen",
        getRandomDate(45),
        "$125,000 - $140,000",
        "San Francisco, CA"
      ),
    ],
    globalNotes: [
      {
        id: "global_note_1",
        content: "Excellent candidate with strong technical skills and cultural fit",
        userId: "user_1",
        userName: "Alex Chen",
        timestamp: getRandomDateTime(30),
        type: "note",
      },
    ],
    cvEvaluations: [
      {
        id: "cv_eval_1",
        candidateId: "candidate_1",
        jobId: "job_1",
        fileName: "marissa_torres_resume.pdf",
        summary: "Strong frontend developer with excellent React and TypeScript skills",
        strengths: ["React expertise", "TypeScript proficiency", "Strong portfolio"],
        weaknesses: ["Limited backend experience"],
        jobFitScore: 85,
        suggestedImprovements: ["Gain more backend experience"],
        finalVerdict: "Good Fit",
        skillsMatch: [
          { skill: "React", hasSkill: true, level: "Expert" },
          { skill: "TypeScript", hasSkill: true, level: "Advanced" },
        ],
        experienceMatch: 90,
        educationMatch: 85,
        recommendations: ["Proceed to interview"],
        extractedData: {
          name: "Marissa Torres",
          email: "marissa.torres@email.com",
          phone: "+1 (555) 987-6543",
          location: "San Francisco, CA",
          education: ["UC Berkeley - Computer Science"],
          workExperience: ["StartupCo - Frontend Developer", "TechFirm - Senior Frontend Developer"],
          skills: ["React", "TypeScript", "Node.js"],
        },
        savedAt: getRandomDateTime(30),
        createdBy: "user_1",
        isShared: false,
      },
    ],
    createdAt: getRandomDateTime(45),
    updatedAt: getRandomDateTime(2),
  },
  {
    id: "candidate_2",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    experience: "3 years",
    skills: [
      "Python",
      "Django",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Kubernetes",
      "REST APIs",
    ],
    status: "Active",
    resume: "david_kim_resume.pdf",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    source: "Indeed",
    tags: ["Backend Developer", "Cloud Experience", "Team Player"],
    attachments: [
      {
        id: "att_2",
        name: "Resume.pdf",
        type: "application/pdf",
        size: 198432,
        url: "/files/david-kim-resume.pdf",
        uploadedAt: "2024-01-20T10:15:00Z",
        uploadedBy: "david.kim@email.com",
      },
    ],
    linkedInProfile: "https://linkedin.com/in/david-kim",
    githubProfile: "https://github.com/david-kim",
    education: [
      {
        id: "edu_2",
        institution: "NYU",
        degree: "Master's",
        field: "Computer Science",
        graduationYear: "2021",
        gpa: "3.9",
      },
    ],
    workExperience: [
      {
        id: "work_3",
        company: "TechCorp",
        position: "Backend Developer",
        startDate: "2021-06",
        endDate: "2023-12",
        description: "Developed scalable backend services using Python and Django",
        achievements: [
          "Improved API response time by 60%",
          "Implemented microservices architecture",
        ],
      },
    ],
    lastActivity: getRandomDateTime(1),
    communicationPreference: "email",
    timezone: "EST",
    availability: "2 weeks notice",
    jobApplications: [
      createJobApplication(
        "app_2",
        "job_2",
        "Backend Developer",
        "Engineering",
        "Interview",
        "Active",
        "Medium",
        "Sarah Johnson",
        getRandomDate(20),
        "$100,000 - $120,000",
        "New York, NY"
      ),
      createJobApplication(
        "app_3",
        "job_3",
        "DevOps Engineer",
        "Engineering",
        "Screening",
        "Active",
        "Low",
        "Mike Wilson",
        getRandomDate(15),
        "$110,000 - $130,000",
        "Remote"
      ),
    ],
    globalNotes: [
      {
        id: "global_note_2",
        content: "Strong backend developer applying to multiple positions",
        userId: "user_2",
        userName: "Sarah Johnson",
        timestamp: getRandomDateTime(20),
        type: "note",
      },
    ],
    createdAt: getRandomDateTime(20),
    updatedAt: getRandomDateTime(1),
  },
  {
    id: "candidate_3",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    experience: "7 years",
    skills: [
      "Java",
      "Spring Boot",
      "Microservices",
      "Kafka",
      "MongoDB",
      "Kubernetes",
      "System Design",
    ],
    status: "Active",
    resume: "emily_chen_resume.pdf",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    source: "Referral",
    tags: ["Senior Developer", "System Architecture", "Leadership"],
    attachments: [
      {
        id: "att_3",
        name: "Resume.pdf",
        type: "application/pdf",
        size: 312456,
        url: "/files/emily-chen-resume.pdf",
        uploadedAt: "2024-01-10T14:20:00Z",
        uploadedBy: "emily.chen@email.com",
      },
    ],
    linkedInProfile: "https://linkedin.com/in/emily-chen",
    githubProfile: "https://github.com/emily-chen",
    education: [
      {
        id: "edu_3",
        institution: "Stanford University",
        degree: "Master's",
        field: "Computer Science",
        graduationYear: "2017",
        gpa: "3.95",
      },
    ],
    workExperience: [
      {
        id: "work_4",
        company: "BigTech Inc",
        position: "Senior Software Engineer",
        startDate: "2017-08",
        endDate: "2023-11",
        description: "Led development of high-scale microservices",
        achievements: [
          "Designed system handling 1M+ requests/day",
          "Mentored 5 junior developers",
        ],
      },
    ],
    lastActivity: getRandomDateTime(3),
    communicationPreference: "video",
    timezone: "PST",
    availability: "1 month notice",
    jobApplications: [
      createJobApplication(
        "app_4",
        "job_4",
        "Senior Software Engineer",
        "Engineering",
        "Technical",
        "Active",
        "High",
        "Lisa Wang",
        getRandomDate(25),
        "$150,000 - $180,000",
        "Seattle, WA"
      ),
      createJobApplication(
        "app_5",
        "job_5",
        "Tech Lead",
        "Engineering",
        "Offer",
        "Active",
        "High",
        "John Smith",
        getRandomDate(30),
        "$160,000 - $200,000",
        "Seattle, WA"
      ),
      createJobApplication(
        "app_6",
        "job_6",
        "Architecture Engineer",
        "Engineering",
        "Applied",
        "Active",
        "Medium",
        "Tom Brown",
        getRandomDate(5),
        "$140,000 - $170,000",
        "Remote"
      ),
    ],
    globalNotes: [
      {
        id: "global_note_3",
        content: "Exceptional senior engineer with strong system design skills",
        userId: "user_3",
        userName: "Lisa Wang",
        timestamp: getRandomDateTime(25),
        type: "note",
      },
    ],
    createdAt: getRandomDateTime(30),
    updatedAt: getRandomDateTime(3),
  },
];

// Export utility functions
export const getJob = (id: string): JobData | undefined => {
  // This would be implemented with actual job data
  return undefined;
};

export const getCandidate = (id: string): CandidateData | undefined => {
  return HARDCODED_CANDIDATES.find(candidate => candidate.id === id);
};

export const getJobCandidates = (jobId: string): CandidateData[] => {
  return HARDCODED_CANDIDATES.filter(candidate =>
    candidate.jobApplications.some(app => app.jobId === jobId)
  );
};

export const getInterview = (id: string): InterviewData | undefined => {
  // This would be implemented with actual interview data
  return undefined;
};

export const getCandidateInterviews = (candidateId: string): InterviewData[] => {
  // This would be implemented with actual interview data
  return [];
};

export const getUser = (id: string): UserData | undefined => {
  // This would be implemented with actual user data
  return undefined;
};

export const getUnreadNotificationCount = (): number => {
  return 5;
};

export const getUserNotifications = (userId: string): NotificationData[] => {
  // This would be implemented with actual notification data
  return [];
};

export const getUpcomingSchedule = (days: number = 7): ScheduleData[] => {
  // This would be implemented with actual schedule data
  return [];
};

export const getRecentActivities = (limit: number = 10): ActivityData[] => {
  // This would be implemented with actual activity data
  return [];
};

export const getJobStats = (jobId: string) => {
  // This would be implemented with actual job statistics
  return {
    totalApplications: 0,
    activeCandidates: 0,
    hiredCount: 0,
    avgTimeToHire: 0,
  };
};

export const getCandidateTimeline = (candidateId: string) => {
  const candidate = getCandidate(candidateId);
  if (!candidate) return [];

  const timeline = [];
  
  // Add application events
  candidate.jobApplications.forEach(app => {
    timeline.push({
      id: `app_${app.id}`,
      type: "application_received",
      title: `Applied for ${app.jobTitle}`,
      timestamp: app.appliedDate,
      description: `Applied to ${app.department} department`,
    });

    // Add stage changes
    app.stageHistory.forEach(stage => {
      timeline.push({
        id: `stage_${stage.id}`,
        type: "stage_change",
        title: `Moved to ${stage.stage}`,
        timestamp: stage.startDate,
        description: stage.notes,
      });
    });

    // Add emails
    app.emails.forEach(email => {
      timeline.push({
        id: `email_${email.id}`,
        type: "email_sent",
        title: email.subject,
        timestamp: email.timestamp,
        description: `Email ${email.status}`,
      });
    });
  });

  // Sort by timestamp
  return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}; 