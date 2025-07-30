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
  relatedEntityType?: "job" | "candidate" | "interview" | "other";
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

// Hardcoded Jobs Data
export const HARDCODED_JOBS: JobData[] = [
  {
    id: "job_1",
    position: "Senior Frontend Developer",
    department: "Engineering",
    recruiter: "Alex Chen",
    applications: 45,
    target: 2,
    hired: 1,
    openDate: "2024-01-01",
    deadline: "2024-03-31",
    estimatedCost: "$15,000",
    actualCost: "$12,500",
    performance: 85,
    status: "Open",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to join our engineering team...",
    priority: "High",
    emailAlias: "frontend-hiring@company.com",
    expectedSkills: ["React", "TypeScript", "Node.js", "GraphQL"],
    salaryMin: "$125,000",
    salaryMax: "$150,000",
    domain: "Technology",
    headcount: 2,
    requester: "Engineering Manager",
    interviewers: ["Alex Chen", "Bob Wilson", "Charlie Davis"],
    pipelineSummary: {
      applied: 45,
      screening: 12,
      interview: 8,
      technical: 5,
      offer: 2,
      hired: 1,
      rejected: 15,
    },
    budget: {
      estimated: 15000,
      actual: 12500,
      expenses: [],
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "job_2",
    position: "Backend Developer",
    department: "Engineering",
    recruiter: "Sarah Johnson",
    applications: 32,
    target: 1,
    hired: 0,
    openDate: "2024-01-15",
    deadline: "2024-04-15",
    estimatedCost: "$12,000",
    actualCost: "$8,000",
    performance: 75,
    status: "Open",
    location: "New York, NY",
    type: "Full-time",
    description: "Join our backend team to build scalable microservices...",
    priority: "Medium",
    emailAlias: "backend-hiring@company.com",
    expectedSkills: ["Python", "Django", "PostgreSQL", "AWS"],
    salaryMin: "$100,000",
    salaryMax: "$130,000",
    domain: "Technology",
    headcount: 1,
    requester: "Backend Team Lead",
    interviewers: ["Sarah Johnson", "Mike Wilson"],
    pipelineSummary: {
      applied: 32,
      screening: 8,
      interview: 4,
      technical: 2,
      offer: 0,
      hired: 0,
      rejected: 10,
    },
    budget: {
      estimated: 12000,
      actual: 8000,
      expenses: [],
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "job_3",
    position: "DevOps Engineer",
    department: "Engineering",
    recruiter: "Mike Wilson",
    applications: 28,
    target: 1,
    hired: 0,
    openDate: "2024-01-20",
    deadline: "2024-04-20",
    estimatedCost: "$10,000",
    actualCost: "$6,000",
    performance: 70,
    status: "Open",
    location: "Remote",
    type: "Full-time",
    description: "Help us build and maintain our cloud infrastructure...",
    priority: "Low",
    emailAlias: "devops-hiring@company.com",
    expectedSkills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    salaryMin: "$110,000",
    salaryMax: "$140,000",
    domain: "Technology",
    headcount: 1,
    requester: "DevOps Manager",
    interviewers: ["Mike Wilson", "Alex Chen"],
    pipelineSummary: {
      applied: 28,
      screening: 6,
      interview: 3,
      technical: 1,
      offer: 0,
      hired: 0,
      rejected: 8,
    },
    budget: {
      estimated: 10000,
      actual: 6000,
      expenses: [],
    },
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "job_4",
    position: "Senior Software Engineer",
    department: "Engineering",
    recruiter: "Lisa Wang",
    applications: 38,
    target: 1,
    hired: 0,
    openDate: "2024-01-10",
    deadline: "2024-04-10",
    estimatedCost: "$18,000",
    actualCost: "$14,000",
    performance: 80,
    status: "Open",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Join our core engineering team to build high-scale systems...",
    priority: "High",
    emailAlias: "senior-hiring@company.com",
    expectedSkills: ["Java", "Spring Boot", "Microservices", "Kafka"],
    salaryMin: "$150,000",
    salaryMax: "$180,000",
    domain: "Technology",
    headcount: 1,
    requester: "Engineering Director",
    interviewers: ["Lisa Wang", "John Smith", "Tom Brown"],
    pipelineSummary: {
      applied: 38,
      screening: 10,
      interview: 6,
      technical: 3,
      offer: 1,
      hired: 0,
      rejected: 12,
    },
    budget: {
      estimated: 18000,
      actual: 14000,
      expenses: [],
    },
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "job_5",
    position: "Tech Lead",
    department: "Engineering",
    recruiter: "John Smith",
    applications: 25,
    target: 1,
    hired: 0,
    openDate: "2024-01-05",
    deadline: "2024-04-05",
    estimatedCost: "$20,000",
    actualCost: "$16,000",
    performance: 85,
    status: "Open",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Lead technical initiatives and mentor junior developers...",
    priority: "High",
    emailAlias: "techlead-hiring@company.com",
    expectedSkills: ["Leadership", "System Design", "Java", "Microservices"],
    salaryMin: "$160,000",
    salaryMax: "$200,000",
    domain: "Technology",
    headcount: 1,
    requester: "VP Engineering",
    interviewers: ["John Smith", "Lisa Wang", "VP Engineering"],
    pipelineSummary: {
      applied: 25,
      screening: 8,
      interview: 5,
      technical: 2,
      offer: 1,
      hired: 0,
      rejected: 8,
    },
    budget: {
      estimated: 20000,
      actual: 16000,
      expenses: [],
    },
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "job_6",
    position: "Architecture Engineer",
    department: "Engineering",
    recruiter: "Tom Brown",
    applications: 18,
    target: 1,
    hired: 0,
    openDate: "2024-02-01",
    deadline: "2024-05-01",
    estimatedCost: "$16,000",
    actualCost: "$4,000",
    performance: 65,
    status: "Open",
    location: "Remote",
    type: "Full-time",
    description: "Design and implement scalable system architectures...",
    priority: "Medium",
    emailAlias: "arch-hiring@company.com",
    expectedSkills: ["System Design", "Architecture", "Java", "Cloud"],
    salaryMin: "$140,000",
    salaryMax: "$170,000",
    domain: "Technology",
    headcount: 1,
    requester: "Architecture Director",
    interviewers: ["Tom Brown", "John Smith"],
    pipelineSummary: {
      applied: 18,
      screening: 4,
      interview: 2,
      technical: 1,
      offer: 0,
      hired: 0,
      rejected: 5,
    },
    budget: {
      estimated: 16000,
      actual: 4000,
      expenses: [],
    },
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
];

// Hardcoded Interviews Data
export const HARDCODED_INTERVIEWS: InterviewData[] = [
  {
    id: "interview_1",
    candidateId: "candidate_2",
    candidateName: "David Kim",
    jobId: "job_2",
    jobTitle: "Backend Developer",
    interviewerIds: ["user_1", "user_2"],
    interviewerNames: ["Sarah Johnson", "Mike Wilson"],
    scheduledDate: "2024-02-20",
    scheduledTime: "14:00",
    duration: 60,
    type: "Video",
    status: "Scheduled",
    location: "Zoom",
    meetingLink: "https://zoom.us/j/123456789",
    notes: "Technical interview focusing on Python and Django",
    feedback: [
      {
        id: "feedback_1",
        interviewId: "interview_1",
        interviewerId: "user_1",
        interviewerName: "Sarah Johnson",
        overallRating: 4,
        technicalSkills: 4,
        communicationSkills: 5,
        culturalFit: 4,
        problemSolving: 4,
        comments: "Strong technical background, good communication skills",
        recommendation: "Hire",
        createdAt: "2024-02-20T15:00:00Z",
      },
    ],
    createdAt: "2024-02-15T10:00:00Z",
    createdBy: "user_1",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "interview_2",
    candidateId: "candidate_3",
    candidateName: "Emily Chen",
    jobId: "job_4",
    jobTitle: "Senior Software Engineer",
    interviewerIds: ["user_3", "user_4"],
    interviewerNames: ["Lisa Wang", "John Smith"],
    scheduledDate: "2024-02-22",
    scheduledTime: "10:00",
    duration: 90,
    type: "Technical",
    status: "Scheduled",
    location: "Office",
    notes: "System design and technical deep dive",
    feedback: [],
    createdAt: "2024-02-16T09:00:00Z",
    createdBy: "user_3",
    updatedAt: "2024-02-16T09:00:00Z",
  },
];

// Hardcoded Schedule Data
export const HARDCODED_SCHEDULE: ScheduleData[] = [
  {
    id: "schedule_1",
    title: "Weekly Hiring Team Meeting",
    description: "Review current candidates and hiring progress",
    startDate: "2024-02-19T10:00:00Z",
    endDate: "2024-02-19T11:00:00Z",
    type: "Meeting",
    attendees: ["user_1", "user_2", "user_3"],
    location: "Conference Room A",
    status: "Scheduled",
    relatedEntityType: "other",
    createdBy: "user_1",
    createdAt: "2024-02-15T08:00:00Z",
  },
  {
    id: "schedule_2",
    title: "David Kim - Backend Developer Interview",
    description: "Technical interview for Backend Developer position",
    startDate: "2024-02-20T14:00:00Z",
    endDate: "2024-02-20T15:00:00Z",
    type: "Interview",
    attendees: ["user_1", "user_2"],
    location: "Zoom",
    meetingLink: "https://zoom.us/j/123456789",
    status: "Scheduled",
    relatedEntityType: "interview",
    relatedEntityId: "interview_1",
    createdBy: "user_1",
    createdAt: "2024-02-15T10:00:00Z",
  },
];

// Notification Data
export const HARDCODED_NOTIFICATIONS: NotificationData[] = [
  {
    id: "notif_1",
    title: "New Application Received",
    message: "Marissa Torres applied for Senior Frontend Developer position",
    type: "application_received",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: "/candidates/candidate_1",
    entityType: "candidate",
    entityId: "candidate_1",
    recipientId: "user_1",
    senderId: "system",
    priority: "Medium",
  },
  {
    id: "notif_2",
    title: "Interview Reminder",
    message: "Upcoming interview with James Chen in 1 hour",
    type: "interview_scheduled",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
    actionUrl: "/schedule",
    entityType: "interview",
    entityId: "interview_2",
    recipientId: "user_2",
    priority: "High",
  },
  {
    id: "notif_3",
    title: "Candidate Hired!",
    message: "Lisa Wang has been successfully hired for UX Designer position",
    type: "candidate_moved",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: true,
    actionUrl: "/candidates/candidate_3",
    entityType: "candidate",
    entityId: "candidate_3",
    recipientId: "user_1",
    senderId: "user_5",
    priority: "High",
  },
  {
    id: "notif_4",
    title: "Budget Alert",
    message: "Job budget for Backend Engineer position is 80% utilized",
    type: "budget_exceeded",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    actionUrl: "/jobs/job_4",
    entityType: "budget",
    entityId: "job_4",
    recipientId: "user_2",
    priority: "High",
  },
  {
    id: "notif_5",
    title: "Application Deadline Approaching",
    message: "Product Manager position deadline is in 5 days",
    type: "deadline_approaching",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: false,
    actionUrl: "/jobs/job_2",
    entityType: "deadline",
    entityId: "job_2",
    recipientId: "user_5",
    priority: "Medium",
  },
  {
    id: "notif_6",
    title: "System Update",
    message: "New features have been added to the recruitment dashboard",
    type: "system",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    actionUrl: "/dashboard",
    entityType: "other",
    recipientId: "user_1",
    senderId: "system",
    priority: "Low",
  },
  {
    id: "notif_7",
    title: "Meeting Reminder",
    message: "Weekly recruitment review meeting starts in 30 minutes",
    type: "reminder",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    read: false,
    actionUrl: "/schedule",
    entityType: "schedule",
    entityId: "schedule_3",
    recipientId: "user_1",
    priority: "Medium",
  },
  {
    id: "notif_8",
    title: "Interview Completed",
    message: "Technical interview with Marissa Torres has been completed",
    type: "interview_scheduled",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: true,
    actionUrl: "/candidates/candidate_1",
    entityType: "interview",
    entityId: "interview_1",
    recipientId: "user_2",
    senderId: "user_4",
    priority: "Medium",
  }
];

// Export utility functions
export const getJob = (id: string): JobData | undefined => {
  return HARDCODED_JOBS.find(job => job.id === id);
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
  return HARDCODED_INTERVIEWS.find(interview => interview.id === id);
};

export const getCandidateInterviews = (candidateId: string): InterviewData[] => {
  return HARDCODED_INTERVIEWS.filter(interview => interview.candidateId === candidateId);
};

export const getUser = (id: string): UserData | undefined => {
  // This would be implemented with actual user data
  return undefined;
};

export const getUnreadNotificationCount = (): number => {
  return 5;
};

export const getUserNotifications = (userId: string): NotificationData[] => {
  return HARDCODED_NOTIFICATIONS.filter(notification => notification.recipientId === userId);
};

export const getUpcomingSchedule = (days: number = 7): ScheduleData[] => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);
  
  return HARDCODED_SCHEDULE.filter(schedule => {
    const scheduleDate = new Date(schedule.startDate);
    return scheduleDate >= now && scheduleDate <= futureDate;
  });
};

export const getRecentActivities = (limit: number = 10): ActivityData[] => {
  // This would be implemented with actual activity data
  return [];
};

export const getJobStats = (jobId: string) => {
  const job = getJob(jobId);
  if (!job) {
    return {
      totalApplications: 0,
      activeCandidates: 0,
      hiredCount: 0,
      avgTimeToHire: 0,
    };
  }

  const candidates = getJobCandidates(jobId);
  const activeCandidates = candidates.filter(c => 
    c.jobApplications.some(app => app.jobId === jobId && app.status === "Active")
  );

  return {
    totalApplications: job.applications,
    activeCandidates: activeCandidates.length,
    hiredCount: job.hired,
    avgTimeToHire: 25, // Mock average
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
