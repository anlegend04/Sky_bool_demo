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
  position: string;
  experience: string;
  skills: string[];
  status: "Active" | "Inactive" | "Blacklisted";
  stage:
    | "Applied"
    | "Screening"
    | "Interview"
    | "Technical"
    | "Offer"
    | "Hired"
    | "Rejected";
  rating: number;
  appliedDate: string;
  resume: string;
  avatar: string;
  salary: string;
  source: string;
  recruiter: string;
  department: string;
  duration: number;
  tags: string[];
  stageHistory: StageHistoryData[];
  notes: NoteData[];
  emails: EmailData[];
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
  jobId?: string; // Link to the job they applied for
  createdAt: string;
  updatedAt: string;
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
  category: "Job Boards" | "Recruitment Agency" | "Events" | "Tools" | "Other";
  description: string;
  expectedOutcome: string;
  evaluationPeriod: string;
  effectiveness: number;
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
  status: "sent" | "pending" | "failed";
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

// Generate realistic mock data
const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split("T")[0];
};
const getRandomDateTime = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date.toISOString();
};

// User Data
export const HARDCODED_USERS: UserData[] = [
  {
    id: "user_1",
    name: "Alex Chen",
    email: "alex.chen@techcorp.com",
    role: "Recruiter",
    department: "HR",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 123-4567",
    timezone: "PST",
    status: "Active",
    permissions: ["view_candidates", "edit_candidates", "schedule_interviews"],
    lastLogin: getRandomDateTime(1),
    createdAt: getRandomDate(365),
  },
  {
    id: "user_2",
    name: "Sarah Kim",
    email: "sarah.kim@techcorp.com",
    role: "Hiring Manager",
    department: "Engineering",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b077?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 234-5678",
    timezone: "PST",
    status: "Active",
    permissions: ["view_candidates", "interview_candidates", "make_offers"],
    lastLogin: getRandomDateTime(2),
    createdAt: getRandomDate(365),
  },
  {
    id: "user_3",
    name: "Mike Wilson",
    email: "mike.wilson@techcorp.com",
    role: "Admin",
    department: "IT",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 345-6789",
    timezone: "PST",
    status: "Active",
    permissions: ["admin_all"],
    lastLogin: getRandomDateTime(1),
    createdAt: getRandomDate(365),
  },
  {
    id: "user_4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@techcorp.com",
    role: "Interviewer",
    department: "Engineering",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 456-7890",
    timezone: "PST",
    status: "Active",
    permissions: ["view_candidates", "interview_candidates"],
    lastLogin: getRandomDateTime(3),
    createdAt: getRandomDate(365),
  },
  {
    id: "user_5",
    name: "David Park",
    email: "david.park@techcorp.com",
    role: "HR",
    department: "HR",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 567-8901",
    timezone: "PST",
    status: "Active",
    permissions: ["view_candidates", "manage_offers", "onboard_candidates"],
    lastLogin: getRandomDateTime(1),
    createdAt: getRandomDate(365),
  },
];

// Job Data with realistic distributions
export const HARDCODED_JOBS: JobData[] = [
  {
    id: "job_1",
    position: "Senior Frontend Developer",
    department: "Engineering",
    recruiter: "Alex Chen",
    applications: 89,
    target: 2,
    hired: 2,
    openDate: "2024-01-10",
    deadline: "2024-03-15",
    estimatedCost: "15000",
    actualCost: "12500",
    performance: 85,
    status: "Open",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "We are looking for a Senior Frontend Developer to join our growing engineering team. You'll be working on cutting-edge web applications using React, TypeScript, and modern development tools. This role offers excellent growth opportunities and the chance to work with a world-class team.",
    priority: "High",
    emailAlias: "frontend-jobs@techcorp.com",
    expectedSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "JavaScript",
      "CSS",
      "HTML",
      "Redux",
      "GraphQL",
    ],
    salaryMin: "120000",
    salaryMax: "150000",
    domain: "Technology",
    headcount: 2,
    requester: "sarah.kim@techcorp.com",
    interviewers: ["user_2", "user_4"],
    pipelineSummary: {
      applied: 89,
      screening: 34,
      interview: 18,
      technical: 12,
      offer: 4,
      hired: 2,
      rejected: 20,
    },
    budget: {
      estimated: 15000,
      actual: 12500,
      expenses: [
        {
          id: "exp_1",
          amount: 5000,
          category: "Job Boards",
          description: "LinkedIn Premium Recruitment",
          expectedOutcome: "50 qualified candidates",
          evaluationPeriod: "30 days",
          effectiveness: 85,
          createdAt: getRandomDate(30),
          createdBy: "Alex Chen",
          jobId: "job_1",
        },
        {
          id: "exp_2",
          amount: 3500,
          category: "Events",
          description: "Tech Conference Sponsorship",
          expectedOutcome: "Brand visibility and candidates",
          evaluationPeriod: "60 days",
          effectiveness: 70,
          createdAt: getRandomDate(45),
          createdBy: "Alex Chen",
          jobId: "job_1",
        },
      ],
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: getRandomDateTime(5),
  },
  {
    id: "job_2",
    position: "Product Manager",
    department: "Product",
    recruiter: "David Park",
    applications: 156,
    target: 1,
    hired: 0,
    openDate: "2023-12-15",
    deadline: "2024-02-28",
    estimatedCost: "18000",
    actualCost: "16200",
    performance: 78,
    status: "Open",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our product team to drive the strategy and execution of our core platform. You'll work closely with engineering, design, and business stakeholders to deliver exceptional user experiences.",
    priority: "High",
    emailAlias: "product-jobs@techcorp.com",
    expectedSkills: [
      "Product Strategy",
      "User Research",
      "Data Analysis",
      "Agile",
      "Roadmapping",
      "Stakeholder Management",
    ],
    salaryMin: "130000",
    salaryMax: "170000",
    domain: "Product",
    headcount: 1,
    requester: "john.smith@techcorp.com",
    interviewers: ["user_2", "user_5"],
    pipelineSummary: {
      applied: 156,
      screening: 62,
      interview: 28,
      technical: 15,
      offer: 3,
      hired: 0,
      rejected: 45,
    },
    createdAt: "2023-12-15T10:30:00Z",
    updatedAt: getRandomDateTime(3),
  },
  {
    id: "job_3",
    position: "UX Designer",
    department: "Design",
    recruiter: "Alex Chen",
    applications: 67,
    target: 1,
    hired: 1,
    openDate: "2024-01-20",
    deadline: "2024-03-01",
    estimatedCost: "12000",
    actualCost: "10800",
    performance: 92,
    status: "Closed",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "We're seeking a talented UX Designer to create intuitive and beautiful user experiences. You'll collaborate with product managers and engineers to solve complex design challenges.",
    priority: "Medium",
    emailAlias: "design-jobs@techcorp.com",
    expectedSkills: [
      "Figma",
      "User Research",
      "Prototyping",
      "Wireframing",
      "Design Systems",
      "Usability Testing",
    ],
    salaryMin: "110000",
    salaryMax: "140000",
    domain: "Design",
    headcount: 1,
    requester: "lisa.chen@techcorp.com",
    interviewers: ["user_4"],
    pipelineSummary: {
      applied: 67,
      screening: 25,
      interview: 12,
      technical: 8,
      offer: 2,
      hired: 1,
      rejected: 18,
    },
    createdAt: "2024-01-20T14:15:00Z",
    updatedAt: getRandomDateTime(2),
  },
  {
    id: "job_4",
    position: "Backend Engineer",
    department: "Engineering",
    recruiter: "Sarah Kim",
    applications: 123,
    target: 2,
    hired: 0,
    openDate: "2024-01-05",
    deadline: "2024-03-20",
    estimatedCost: "20000",
    actualCost: "15600",
    performance: 68,
    status: "Open",
    location: "Remote",
    type: "Full-time",
    description:
      "Build scalable backend systems that power our platform. Work with microservices, databases, and cloud infrastructure to deliver high-performance solutions.",
    priority: "High",
    emailAlias: "backend-jobs@techcorp.com",
    expectedSkills: [
      "Python",
      "Go",
      "Kubernetes",
      "PostgreSQL",
      "Redis",
      "AWS",
      "Docker",
      "API Design",
    ],
    salaryMin: "125000",
    salaryMax: "160000",
    domain: "Technology",
    headcount: 2,
    requester: "sarah.kim@techcorp.com",
    interviewers: ["user_2", "user_4"],
    pipelineSummary: {
      applied: 123,
      screening: 45,
      interview: 22,
      technical: 16,
      offer: 2,
      hired: 0,
      rejected: 32,
    },
    createdAt: "2024-01-05T08:45:00Z",
    updatedAt: getRandomDateTime(4),
  },
  {
    id: "job_5",
    position: "Data Scientist",
    department: "Data",
    recruiter: "David Park",
    applications: 78,
    target: 1,
    hired: 0,
    openDate: "2024-02-01",
    deadline: "2024-04-15",
    estimatedCost: "16000",
    actualCost: "8500",
    performance: 55,
    status: "In Progress",
    location: "New York, NY",
    type: "Full-time",
    description:
      "Join our data team to extract insights from large datasets and build predictive models. You'll work on machine learning algorithms and data pipeline optimization.",
    priority: "Medium",
    emailAlias: "data-jobs@techcorp.com",
    expectedSkills: [
      "Python",
      "R",
      "SQL",
      "Machine Learning",
      "Statistics",
      "Tableau",
      "TensorFlow",
      "Spark",
    ],
    salaryMin: "135000",
    salaryMax: "175000",
    domain: "Data Science",
    headcount: 1,
    requester: "data.lead@techcorp.com",
    interviewers: ["user_3", "user_5"],
    pipelineSummary: {
      applied: 78,
      screening: 28,
      interview: 14,
      technical: 8,
      offer: 1,
      hired: 0,
      rejected: 18,
    },
    createdAt: "2024-02-01T11:20:00Z",
    updatedAt: getRandomDateTime(1),
  },
];

// Comprehensive Candidate Data with realistic relationships
export const HARDCODED_CANDIDATES: CandidateData[] = [
  {
    id: "candidate_1",
    name: "Marissa Torres",
    email: "marissa.torres@email.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    position: "Senior Frontend Developer",
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
    stage: "Hired",
    rating: 4,
    appliedDate: getRandomDate(45),
    resume: "marissa_torres_resume.pdf",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b077?w=150&h=150&fit=crop&crop=face",
    salary: "$125,000 - $140,000",
    source: "LinkedIn",
    recruiter: "Alex Chen",
    department: "Engineering",
    duration: 35,
    tags: ["Strong Technical Skills", "Cultural Fit", "Fast Learner"],
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
        description:
          "Developed responsive web applications using React and TypeScript",
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
    jobId: "job_1",
    stageHistory: [
      {
        id: "stage_1",
        stage: "Applied",
        startDate: getRandomDate(15),
        endDate: getRandomDate(12),
        duration: 3,
        reason: "New application received",
        notes: "Strong technical background, good portfolio",
        userId: "user_1",
        userName: "Alex Chen",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_2",
        stage: "Screening",
        startDate: getRandomDate(12),
        endDate: getRandomDate(8),
        duration: 4,
        reason: "Passed initial screening",
        notes: "Excellent communication skills, relevant experience",
        userId: "user_1",
        userName: "Alex Chen",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_3",
        stage: "Interview",
        startDate: getRandomDate(35),
        endDate: getRandomDate(28),
        duration: 7,
        reason: "Completed technical interview successfully",
        notes: "Excellent performance in technical round",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_4",
        stage: "Offer",
        startDate: getRandomDate(28),
        endDate: getRandomDate(21),
        duration: 7,
        reason: "Offer extended and accepted",
        notes: "Negotiated salary successfully, offer accepted",
        userId: "user_5",
        userName: "David Park",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_5",
        stage: "Hired",
        startDate: getRandomDate(21),
        duration: 21,
        reason: "Successfully hired and started",
        notes: "Completed onboarding, performing well",
        userId: "user_5",
        userName: "David Park",
        mailSent: true,
      },
    ],
    notes: [
      {
        id: "note_1",
        content:
          "Great candidate with strong React experience. Portfolio shows excellent work quality.",
        userId: "user_1",
        userName: "Alex Chen",
        timestamp: getRandomDateTime(10),
        type: "note",
        tags: ["technical", "positive"],
      },
      {
        id: "note_2",
        content:
          "Phone screening went well. Candidate asked thoughtful questions about the role and company culture.",
        userId: "user_1",
        userName: "Alex Chen",
        timestamp: getRandomDateTime(8),
        type: "note",
        tags: ["screening", "cultural-fit"],
      },
    ],
    emails: [
      {
        id: "email_1",
        subject: "Thank you for your application - Senior Frontend Developer",
        content:
          "Dear Marissa, Thank you for applying to our Senior Frontend Developer position...",
        from: "alex.chen@techcorp.com",
        to: "marissa.torres@email.com",
        timestamp: getRandomDateTime(15),
        status: "sent",
        template: "application_received",
        openedAt: getRandomDateTime(14),
        clickedAt: getRandomDateTime(14),
      },
      {
        id: "email_2",
        subject: "Interview Invitation - Senior Frontend Developer",
        content:
          "Hi Marissa, We were impressed with your application and would like to invite you for an interview...",
        from: "sarah.kim@techcorp.com",
        to: "marissa.torres@email.com",
        timestamp: getRandomDateTime(30),
        status: "sent",
        template: "interview_invitation",
        openedAt: getRandomDateTime(29),
      },
      {
        id: "email_3",
        subject: "Congratulations! Job Offer - Senior Frontend Developer",
        content:
          "Dear Marissa, We are delighted to offer you the position of Senior Frontend Developer...",
        from: "david.park@techcorp.com",
        to: "marissa.torres@email.com",
        timestamp: getRandomDateTime(28),
        status: "sent",
        template: "offer_letter",
        openedAt: getRandomDateTime(27),
        repliedAt: getRandomDateTime(26),
      },
      {
        id: "email_4",
        subject: "Welcome to TechCorp! - Your First Day Details",
        content:
          "Welcome to the team! Here are your first day details and onboarding information...",
        from: "hr@techcorp.com",
        to: "marissa.torres@email.com",
        timestamp: getRandomDateTime(21),
        status: "sent",
        template: "welcome_hired",
        openedAt: getRandomDateTime(20),
      },
    ],
    attachments: [
      {
        id: "att_1",
        name: "marissa_torres_resume.pdf",
        type: "application/pdf",
        size: 245760,
        url: "/files/resumes/marissa_torres_resume.pdf",
        uploadedAt: getRandomDateTime(15),
        uploadedBy: "marissa.torres@email.com",
      },
      {
        id: "att_2",
        name: "portfolio_samples.zip",
        type: "application/zip",
        size: 1024000,
        url: "/files/portfolios/marissa_portfolio.zip",
        uploadedAt: getRandomDateTime(15),
        uploadedBy: "marissa.torres@email.com",
      },
    ],
    createdAt: getRandomDateTime(15),
    updatedAt: getRandomDateTime(2),
  },
  {
    id: "candidate_2",
    name: "James Chen",
    email: "james.chen@email.com",
    phone: "+1 (555) 123-7890",
    location: "Seattle, WA",
    position: "Product Manager",
    experience: "7 years",
    skills: [
      "Product Strategy",
      "User Research",
      "Data Analysis",
      "Agile",
      "Roadmapping",
      "SQL",
      "Figma",
    ],
    status: "Active",
    stage: "Offer",
    rating: 5,
    appliedDate: getRandomDate(30),
    resume: "james_chen_resume.pdf",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    salary: "$140,000 - $160,000",
    source: "Company Website",
    recruiter: "David Park",
    department: "Product",
    duration: 18,
    tags: ["Leadership", "Strategic Thinking", "Data-Driven"],
    linkedInProfile: "https://linkedin.com/in/james-chen-pm",
    education: [
      {
        id: "edu_2",
        institution: "Stanford University",
        degree: "MBA",
        field: "Business Administration",
        graduationYear: "2019",
        gpa: "3.9",
      },
      {
        id: "edu_3",
        institution: "UC San Diego",
        degree: "Bachelor's",
        field: "Economics",
        graduationYear: "2017",
        gpa: "3.7",
      },
    ],
    workExperience: [
      {
        id: "work_3",
        company: "BigTech Inc",
        position: "Senior Product Manager",
        startDate: "2020-03",
        description:
          "Led product development for mobile application serving 2M+ users",
        achievements: [
          "Increased user engagement by 35%",
          "Launched 3 major features",
          "Led cross-functional team of 12",
        ],
      },
      {
        id: "work_4",
        company: "StartupXYZ",
        position: "Product Manager",
        startDate: "2018-01",
        endDate: "2020-02",
        description: "Managed product roadmap for B2B SaaS platform",
        achievements: ["Grew revenue by 150%", "Reduced churn by 25%"],
      },
    ],
    lastActivity: getRandomDateTime(1),
    communicationPreference: "video",
    timezone: "PST",
    availability: "2 weeks notice",
    jobId: "job_2",
    stageHistory: [
      {
        id: "stage_4",
        stage: "Applied",
        startDate: getRandomDate(22),
        endDate: getRandomDate(18),
        duration: 4,
        reason: "Application submitted",
        notes: "Strong product management background",
        userId: "user_5",
        userName: "David Park",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_5",
        stage: "Screening",
        startDate: getRandomDate(18),
        endDate: getRandomDate(14),
        duration: 4,
        reason: "Screening completed successfully",
        notes: "Excellent communication, relevant experience",
        userId: "user_5",
        userName: "David Park",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_6",
        stage: "Interview",
        startDate: getRandomDate(14),
        endDate: getRandomDate(6),
        duration: 8,
        reason: "Interview completed, moving to technical",
        notes: "Strong performance in behavioral interview",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
      },
      {
        id: "stage_7",
        stage: "Technical",
        startDate: getRandomDate(10),
        endDate: getRandomDate(6),
        duration: 4,
        reason: "Technical assessment completed successfully",
        notes: "Excellent case study presentation",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_8",
        stage: "Offer",
        startDate: getRandomDate(6),
        duration: 6,
        reason: "Offer extended, awaiting response",
        notes: "Strong candidate, competitive offer made",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
      },
    ],
    notes: [
      {
        id: "note_3",
        content:
          "Exceptional product management experience at BigTech. Strong analytical skills and strategic thinking.",
        userId: "user_5",
        userName: "David Park",
        timestamp: getRandomDateTime(20),
        type: "note",
        tags: ["leadership", "analytical"],
      },
    ],
    emails: [
      {
        id: "email_3",
        subject: "Application Received - Product Manager",
        content: "Dear James, Thank you for your application...",
        from: "david.park@techcorp.com",
        to: "james.chen@email.com",
        timestamp: getRandomDateTime(30),
        status: "sent",
        template: "application_received",
        openedAt: getRandomDateTime(29),
      },
      {
        id: "email_6",
        subject: "Technical Assessment Invitation - Product Manager",
        content: "Hi James, We'd like to invite you to complete our technical assessment...",
        from: "sarah.kim@techcorp.com",
        to: "james.chen@email.com",
        timestamp: getRandomDateTime(10),
        status: "sent",
        template: "technical_assessment",
        openedAt: getRandomDateTime(9),
        repliedAt: getRandomDateTime(8),
      },
      {
        id: "email_7",
        subject: "Job Offer - Product Manager Position",
        content: "Dear James, We are pleased to extend an offer for the Product Manager position...",
        from: "sarah.kim@techcorp.com",
        to: "james.chen@email.com",
        timestamp: getRandomDateTime(6),
        status: "sent",
        template: "offer_letter",
        openedAt: getRandomDateTime(5),
      },
    ],
    attachments: [
      {
        id: "att_3",
        name: "james_chen_resume.pdf",
        type: "application/pdf",
        size: 189440,
        url: "/files/resumes/james_chen_resume.pdf",
        uploadedAt: getRandomDateTime(22),
        uploadedBy: "james.chen@email.com",
      },
    ],
    createdAt: getRandomDateTime(22),
    updatedAt: getRandomDateTime(1),
  },
  // Add more candidates with different stages and statuses
  {
    id: "candidate_3",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    phone: "+1 (555) 456-1234",
    location: "Austin, TX",
    position: "UX Designer",
    experience: "4 years",
    skills: [
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
      "Adobe Creative Suite",
    ],
    status: "Active",
    stage: "Hired",
    rating: 5,
    appliedDate: getRandomDate(35),
    resume: "lisa_wang_resume.pdf",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    salary: "$115,000",
    source: "Referral",
    recruiter: "Alex Chen",
    department: "Design",
    duration: 25,
    tags: ["Creative", "User-Focused", "Collaborative"],
    linkedInProfile: "https://linkedin.com/in/lisa-wang-ux",
    portfolioUrl: "https://lisawang.design",
    education: [
      {
        id: "edu_4",
        institution: "Art Center College of Design",
        degree: "Bachelor's",
        field: "Interaction Design",
        graduationYear: "2020",
        gpa: "3.8",
      },
    ],
    workExperience: [
      {
        id: "work_5",
        company: "DesignStudio",
        position: "UX Designer",
        startDate: "2020-08",
        description:
          "Designed user experiences for mobile and web applications",
        achievements: [
          "Improved user satisfaction by 45%",
          "Created comprehensive design system",
        ],
      },
    ],
    lastActivity: getRandomDateTime(1),
    communicationPreference: "email",
    timezone: "CST",
    availability: "Hired",
    jobId: "job_3",
    stageHistory: [
      {
        id: "stage_8",
        stage: "Applied",
        startDate: getRandomDate(35),
        endDate: getRandomDate(32),
        duration: 3,
        reason: "Application received via referral",
        notes: "Referred by current employee, strong portfolio",
        userId: "user_1",
        userName: "Alex Chen",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_9",
        stage: "Screening",
        startDate: getRandomDate(32),
        endDate: getRandomDate(28),
        duration: 4,
        reason: "Screening completed",
        notes: "Excellent design portfolio, good cultural fit",
        userId: "user_1",
        userName: "Alex Chen",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_10",
        stage: "Interview",
        startDate: getRandomDate(28),
        endDate: getRandomDate(21),
        duration: 7,
        reason: "Multiple interview rounds",
        notes: "Strong performance across all interviews",
        userId: "user_4",
        userName: "Emily Rodriguez",
        mailSent: true,
      },
      {
        id: "stage_11",
        stage: "Offer",
        startDate: getRandomDate(21),
        endDate: getRandomDate(14),
        duration: 7,
        reason: "Offer extended and accepted",
        notes: "Negotiated salary, offer accepted",
        userId: "user_5",
        userName: "David Park",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_12",
        stage: "Hired",
        startDate: getRandomDate(14),
        duration: 14,
        reason: "Hired and onboarded",
        notes: "Started successfully, positive feedback from team",
        userId: "user_5",
        userName: "David Park",
        mailSent: true,
      },
    ],
    notes: [
      {
        id: "note_4",
        content:
          "Outstanding design portfolio with excellent user research case studies. Perfect fit for our team.",
        userId: "user_1",
        userName: "Alex Chen",
        timestamp: getRandomDateTime(30),
        type: "note",
        tags: ["portfolio", "research"],
      },
    ],
    emails: [
      {
        id: "email_4",
        subject: "Welcome to TechCorp - UX Designer",
        content:
          "Dear Lisa, Welcome to the TechCorp team! We're excited to have you join us...",
        from: "david.park@techcorp.com",
        to: "lisa.wang@email.com",
        timestamp: getRandomDateTime(14),
        status: "sent",
        template: "welcome_hired",
        openedAt: getRandomDateTime(13),
      },
    ],
    attachments: [
      {
        id: "att_4",
        name: "lisa_wang_resume.pdf",
        type: "application/pdf",
        size: 167890,
        url: "/files/resumes/lisa_wang_resume.pdf",
        uploadedAt: getRandomDateTime(35),
        uploadedBy: "lisa.wang@email.com",
      },
    ],
    createdAt: getRandomDateTime(35),
    updatedAt: getRandomDateTime(1),
  },
  // Add a rejected candidate
  {
    id: "candidate_4",
    name: "Robert Smith",
    email: "robert.smith@email.com",
    phone: "+1 (555) 789-0123",
    location: "Denver, CO",
    position: "Backend Engineer",
    experience: "3 years",
    skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
    status: "Active",
    stage: "Rejected",
    rating: 2,
    appliedDate: getRandomDate(28),
    resume: "robert_smith_resume.pdf",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    salary: "$95,000 - $110,000",
    source: "Indeed",
    recruiter: "Sarah Kim",
    department: "Engineering",
    duration: 21,
    tags: ["Junior Level", "Needs Growth"],
    education: [
      {
        id: "edu_5",
        institution: "Colorado State University",
        degree: "Bachelor's",
        field: "Computer Science",
        graduationYear: "2021",
        gpa: "3.2",
      },
    ],
    workExperience: [
      {
        id: "work_6",
        company: "LocalTech",
        position: "Junior Backend Developer",
        startDate: "2021-06",
        description: "Developed REST APIs and maintained database systems",
        achievements: [
          "Implemented 5 new API endpoints",
          "Improved query performance",
        ],
      },
    ],
    lastActivity: getRandomDateTime(5),
    communicationPreference: "phone",
    timezone: "MST",
    availability: "Immediate",
    jobId: "job_4",
    stageHistory: [
      {
        id: "stage_13",
        stage: "Applied",
        startDate: getRandomDate(28),
        endDate: getRandomDate(25),
        duration: 3,
        reason: "Application received",
        notes: "Entry level candidate",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "stage_14",
        stage: "Screening",
        startDate: getRandomDate(25),
        endDate: getRandomDate(18),
        duration: 7,
        reason: "Screening completed",
        notes: "Limited experience for senior role",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
      },
      {
        id: "stage_15",
        stage: "Rejected",
        startDate: getRandomDate(18),
        duration: 18,
        reason: "Insufficient experience for role requirements",
        notes: "Good potential but needs more experience for this level",
        userId: "user_2",
        userName: "Sarah Kim",
        mailSent: true,
        mailConfirmed: true,
      },
    ],
    notes: [
      {
        id: "note_5",
        content:
          "Candidate has potential but experience level doesn't match our senior requirements. Would be good for junior positions.",
        userId: "user_2",
        userName: "Sarah Kim",
        timestamp: getRandomDateTime(18),
        type: "note",
        tags: ["experience", "junior"],
      },
    ],
    emails: [
      {
        id: "email_5",
        subject: "Update on your application - Backend Engineer",
        content:
          "Dear Robert, Thank you for your interest in our Backend Engineer position...",
        from: "sarah.kim@techcorp.com",
        to: "robert.smith@email.com",
        timestamp: getRandomDateTime(18),
        status: "sent",
        template: "rejection_notice",
        openedAt: getRandomDateTime(17),
      },
    ],
    attachments: [
      {
        id: "att_5",
        name: "robert_smith_resume.pdf",
        type: "application/pdf",
        size: 123456,
        url: "/files/resumes/robert_smith_resume.pdf",
        uploadedAt: getRandomDateTime(28),
        uploadedBy: "robert.smith@email.com",
      },
    ],
    createdAt: getRandomDateTime(28),
    updatedAt: getRandomDateTime(5),
  },
];

// Generate more candidates for comprehensive coverage
const generateMoreCandidates = (): CandidateData[] => {
  const names = [
    "Emily Johnson",
    "Michael Brown",
    "Sarah Davis",
    "David Wilson",
    "Amanda Taylor",
    "Christopher Lee",
    "Jennifer Garcia",
    "Matthew Martinez",
    "Ashley Anderson",
    "Joshua Jackson",
    "Jessica Thompson",
    "Andrew White",
    "Samantha Harris",
    "Daniel Clark",
    "Nicole Lewis",
    "Ryan Walker",
    "Michelle Hall",
    "Kevin Allen",
    "Stephanie Young",
    "Brian King",
    "Rebecca Wright",
    "Justin Lopez",
    "Lauren Hill",
    "Brandon Scott",
    "Megan Green",
    "Tyler Adams",
    "Kayla Baker",
    "Jordan Gonzalez",
    "Taylor Nelson",
    "Cameron Carter",
  ];

  const positions = [
    "Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "Product Manager",
    "UX Designer",
    "Data Scientist",
    "DevOps Engineer",
  ];
  const stages = [
    "Applied",
    "Screening",
    "Interview",
    "Technical",
    "Offer",
    "Hired",
    "Rejected",
  ];
  const sources = [
    "LinkedIn",
    "Indeed",
    "Company Website",
    "Referral",
    "Glassdoor",
    "AngelList",
  ];
  const recruiters = [
    "Alex Chen",
    "Sarah Kim",
    "David Park",
    "Emily Rodriguez",
  ];

  const candidates: CandidateData[] = [];

  for (let i = 5; i <= 100; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];

    // Realistic stage distribution: more candidates in early stages
    let stage;
    const stageRand = Math.random();
    if (stageRand < 0.4) stage = "Applied";  // 40%
    else if (stageRand < 0.65) stage = "Screening";  // 25%
    else if (stageRand < 0.8) stage = "Interview";  // 15%
    else if (stageRand < 0.9) stage = "Technical";  // 10%
    else if (stageRand < 0.95) stage = "Offer";  // 5%
    else if (stageRand < 0.98) stage = "Hired";  // 3%
    else stage = "Rejected";  // 2%

    const source = sources[Math.floor(Math.random() * sources.length)];
    const recruiter = recruiters[Math.floor(Math.random() * recruiters.length)];

    candidates.push({
      id: `candidate_${i}`,
      name: name,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      location: [
        "San Francisco, CA",
        "New York, NY",
        "Austin, TX",
        "Seattle, WA",
        "Remote",
      ][Math.floor(Math.random() * 5)],
      position: position,
      experience: `${Math.floor(Math.random() * 10 + 1)} years`,
      skills: ["JavaScript", "Python", "React", "Node.js", "SQL"].slice(
        0,
        Math.floor(Math.random() * 5) + 3,
      ),
      status: ["Active", "Inactive"][Math.floor(Math.random() * 2)] as
        | "Active"
        | "Inactive",
      stage: stage as any,
      rating: Math.floor(Math.random() * 5) + 1,
      appliedDate: getRandomDate(Math.floor(Math.random() * 60) + 1),
      resume: `${name.toLowerCase().replace(" ", "_")}_resume.pdf`,
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000) + 1500000000000}?w=150&h=150&fit=crop&crop=face`,
      salary: `$${Math.floor(Math.random() * 50000) + 80000}`,
      source: source,
      recruiter: recruiter,
      department: ["Engineering", "Product", "Design", "Data"][
        Math.floor(Math.random() * 4)
      ],
      duration: Math.floor(Math.random() * 30) + 1,
      tags: [
        "Strong Technical Skills",
        "Cultural Fit",
        "Leadership Potential",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      education: [],
      workExperience: [],
      lastActivity: getRandomDateTime(Math.floor(Math.random() * 30) + 1),
      communicationPreference: ["email", "phone", "video"][
        Math.floor(Math.random() * 3)
      ] as any,
      timezone: "PST",
      availability: ["Immediate", "2 weeks", "1 month"][
        Math.floor(Math.random() * 3)
      ],
      jobId: `job_${Math.floor(Math.random() * 5) + 1}`,
      stageHistory: [],
      notes: [],
      emails: [],
      attachments: [],
      createdAt: getRandomDateTime(Math.floor(Math.random() * 60) + 1),
      updatedAt: getRandomDateTime(Math.floor(Math.random() * 5) + 1),
    });
  }

  return candidates;
};

// Add generated candidates to the main array
HARDCODED_CANDIDATES.push(...generateMoreCandidates());

// Interview Data
export const HARDCODED_INTERVIEWS: InterviewData[] = [
  {
    id: "interview_1",
    candidateId: "candidate_1",
    candidateName: "Marissa Torres",
    jobId: "job_1",
    jobTitle: "Senior Frontend Developer",
    interviewerIds: ["user_2", "user_4"],
    interviewerNames: ["Sarah Kim", "Emily Rodriguez"],
    scheduledDate: "2024-01-25",
    scheduledTime: "14:00",
    duration: 60,
    type: "Technical",
    status: "Scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Technical interview focusing on React and TypeScript skills",
    createdAt: getRandomDateTime(5),
    createdBy: "user_2",
    updatedAt: getRandomDateTime(2),
  },
  {
    id: "interview_2",
    candidateId: "candidate_2",
    candidateName: "James Chen",
    jobId: "job_2",
    jobTitle: "Product Manager",
    interviewerIds: ["user_2"],
    interviewerNames: ["Sarah Kim"],
    scheduledDate: "2024-01-24",
    scheduledTime: "10:30",
    duration: 90,
    type: "Video",
    status: "Completed",
    meetingLink: "https://zoom.us/j/123456789",
    notes: "Product case study presentation and discussion",
    feedback: [
      {
        id: "feedback_1",
        interviewId: "interview_2",
        interviewerId: "user_2",
        interviewerName: "Sarah Kim",
        overallRating: 5,
        technicalSkills: 5,
        communicationSkills: 5,
        culturalFit: 4,
        problemSolving: 5,
        comments:
          "Excellent analytical skills and strategic thinking. Strong product sense and leadership qualities.",
        recommendation: "Strong Hire",
        createdAt: getRandomDateTime(3),
      },
    ],
    createdAt: getRandomDateTime(10),
    createdBy: "user_5",
    updatedAt: getRandomDateTime(3),
  },
  {
    id: "interview_3",
    candidateId: "candidate_3",
    candidateName: "Lisa Wang",
    jobId: "job_3",
    jobTitle: "UX Designer",
    interviewerIds: ["user_4"],
    interviewerNames: ["Emily Rodriguez"],
    scheduledDate: "2024-01-15",
    scheduledTime: "16:00",
    duration: 45,
    type: "In-Person",
    status: "Completed",
    location: "Conference Room A",
    notes: "Portfolio review and design challenge",
    feedback: [
      {
        id: "feedback_2",
        interviewId: "interview_3",
        interviewerId: "user_4",
        interviewerName: "Emily Rodriguez",
        overallRating: 5,
        technicalSkills: 5,
        communicationSkills: 5,
        culturalFit: 5,
        problemSolving: 4,
        comments:
          "Outstanding portfolio with excellent user research. Great cultural fit and communication skills.",
        recommendation: "Strong Hire",
        createdAt: getRandomDateTime(20),
      },
    ],
    createdAt: getRandomDateTime(25),
    createdBy: "user_1",
    updatedAt: getRandomDateTime(20),
  },
];

// Notification Data
export const HARDCODED_NOTIFICATIONS: NotificationData[] = [
  {
    id: "notif_1",
    title: "New Application Received",
    message: "Maria Rodriguez applied for Senior Frontend Developer position",
    type: "application_received",
    timestamp: getRandomDateTime(1),
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
    timestamp: getRandomDateTime(1),
    read: false,
    actionUrl: "/schedule",
    entityType: "interview",
    entityId: "interview_2",
    recipientId: "user_2",
    priority: "High",
  },
  {
    id: "notif_3",
    title: "Candidate Stage Update",
    message: "Lisa Wang has been moved to Hired stage",
    type: "candidate_moved",
    timestamp: getRandomDateTime(2),
    read: true,
    actionUrl: "/candidates/candidate_3",
    entityType: "candidate",
    entityId: "candidate_3",
    recipientId: "user_1",
    senderId: "user_5",
    priority: "Medium",
  },
  {
    id: "notif_4",
    title: "Budget Alert",
    message: "Job budget for Backend Engineer position is 80% utilized",
    type: "budget_exceeded",
    timestamp: getRandomDateTime(3),
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
    timestamp: getRandomDateTime(1),
    read: false,
    actionUrl: "/jobs/job_2",
    entityType: "deadline",
    entityId: "job_2",
    recipientId: "user_5",
    priority: "Medium",
  },
];

// Schedule Data
export const HARDCODED_SCHEDULE: ScheduleData[] = [
  {
    id: "schedule_1",
    title: "Technical Interview - Marissa Torres",
    description: "Frontend technical assessment and code review",
    startDate: "2024-01-25T14:00:00",
    endDate: "2024-01-25T15:00:00",
    type: "Interview",
    attendees: ["user_2", "user_4", "candidate_1"],
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Scheduled",
    relatedEntityType: "candidate",
    relatedEntityId: "candidate_1",
    createdBy: "user_2",
    createdAt: getRandomDateTime(5),
  },
  {
    id: "schedule_2",
    title: "Product Case Study - James Chen",
    description: "Product management case study presentation",
    startDate: "2024-01-24T10:30:00",
    endDate: "2024-01-24T12:00:00",
    type: "Interview",
    attendees: ["user_2", "candidate_2"],
    meetingLink: "https://zoom.us/j/123456789",
    status: "Completed",
    relatedEntityType: "candidate",
    relatedEntityId: "candidate_2",
    createdBy: "user_5",
    createdAt: getRandomDateTime(10),
  },
  {
    id: "schedule_3",
    title: "Weekly Recruitment Review",
    description: "Review recruitment metrics and pipeline status",
    startDate: "2024-01-26T09:00:00",
    endDate: "2024-01-26T10:00:00",
    type: "Meeting",
    attendees: ["user_1", "user_2", "user_5"],
    location: "Conference Room B",
    status: "Scheduled",
    createdBy: "user_1",
    createdAt: getRandomDateTime(7),
  },
  {
    id: "schedule_4",
    title: "Job Posting Deadline - Backend Engineer",
    description: "Final day for Backend Engineer applications",
    startDate: "2024-03-20T23:59:00",
    endDate: "2024-03-20T23:59:00",
    type: "Deadline",
    attendees: ["user_2"],
    status: "Scheduled",
    relatedEntityType: "job",
    relatedEntityId: "job_4",
    createdBy: "user_2",
    createdAt: getRandomDateTime(30),
  },
];

// Activity Data
export const HARDCODED_ACTIVITIES: ActivityData[] = [
  {
    id: "activity_1",
    type: "application_received",
    description:
      "New application received from Marissa Torres for Senior Frontend Developer",
    entityType: "candidate",
    entityId: "candidate_1",
    userId: "system",
    userName: "System",
    timestamp: getRandomDateTime(15),
    metadata: { jobId: "job_1", source: "LinkedIn" },
  },
  {
    id: "activity_2",
    type: "stage_change",
    description: "Moved James Chen from Interview to Technical stage",
    entityType: "candidate",
    entityId: "candidate_2",
    userId: "user_2",
    userName: "Sarah Kim",
    timestamp: getRandomDateTime(6),
    metadata: {
      fromStage: "Interview",
      toStage: "Technical",
      reason: "Completed interview successfully",
    },
  },
  {
    id: "activity_3",
    type: "interview_scheduled",
    description: "Scheduled technical interview for Marissa Torres",
    entityType: "interview",
    entityId: "interview_1",
    userId: "user_2",
    userName: "Sarah Kim",
    timestamp: getRandomDateTime(5),
    metadata: { candidateId: "candidate_1", date: "2024-01-25", time: "14:00" },
  },
  {
    id: "activity_4",
    type: "email_sent",
    description: "Sent interview invitation to James Chen",
    entityType: "candidate",
    entityId: "candidate_2",
    userId: "user_5",
    userName: "David Park",
    timestamp: getRandomDateTime(8),
    metadata: { emailId: "email_3", template: "interview_invitation" },
  },
  {
    id: "activity_5",
    type: "note_added",
    description: "Added note to Lisa Wang's profile",
    entityType: "candidate",
    entityId: "candidate_3",
    userId: "user_1",
    userName: "Alex Chen",
    timestamp: getRandomDateTime(30),
    metadata: { noteId: "note_4", content: "Outstanding design portfolio..." },
  },
];

// Dashboard Stats
export const DASHBOARD_STATS: DashboardStatsData = {
  totalJobs: HARDCODED_JOBS.length,
  activeJobs: HARDCODED_JOBS.filter((job) => job.status === "Open").length,
  totalCandidates: HARDCODED_CANDIDATES.length,
  activeCandidates: HARDCODED_CANDIDATES.filter(
    (candidate) => candidate.status === "Active",
  ).length,
  interviewsThisWeek: 12,
  offersExtended: HARDCODED_CANDIDATES.filter(
    (candidate) => candidate.stage === "Offer",
  ).length,
  hiredThisMonth: HARDCODED_CANDIDATES.filter(
    (candidate) => candidate.stage === "Hired",
  ).length,
  avgTimeToHire: 28,
  topPerformingJobs: ["job_1", "job_3", "job_2"],
  recentActivities: HARDCODED_ACTIVITIES.slice(0, 5),
  upcomingInterviews: HARDCODED_INTERVIEWS.filter(
    (interview) => interview.status === "Scheduled",
  ),
  pendingTasks: 8,
  conversionRates: {
    applicationToScreening: 38,
    screeningToInterview: 65,
    interviewToOffer: 45,
    offerToHire: 85,
  },
};

// Email Templates from the utility
export const EMAIL_TEMPLATES = {
  interview_invitation:
    "Dear {{name}},\n\nWe would like to invite you for an interview for the {{position}} position...",
  offer_letter:
    "Dear {{name}},\n\nWe are pleased to offer you the position of {{position}}...",
  rejection_notice:
    "Dear {{name}},\n\nThank you for your interest in the {{position}} position...",
  technical_assessment:
    "Dear {{name}},\n\nFollowing our successful interview, we'd like to proceed with the technical assessment...",
};

// Helper functions
export const getJob = (id: string): JobData | undefined => {
  return HARDCODED_JOBS.find((job) => job.id === id);
};

export const getCandidate = (id: string): CandidateData | undefined => {
  return HARDCODED_CANDIDATES.find((candidate) => candidate.id === id);
};

export const getJobCandidates = (jobId: string): CandidateData[] => {
  return HARDCODED_CANDIDATES.filter((candidate) => candidate.jobId === jobId);
};

export const getInterview = (id: string): InterviewData | undefined => {
  return HARDCODED_INTERVIEWS.find((interview) => interview.id === id);
};

export const getCandidateInterviews = (
  candidateId: string,
): InterviewData[] => {
  return HARDCODED_INTERVIEWS.filter(
    (interview) => interview.candidateId === candidateId,
  );
};

export const getUser = (id: string): UserData | undefined => {
  return HARDCODED_USERS.find((user) => user.id === id);
};

export const getUnreadNotificationCount = (): number => {
  return HARDCODED_NOTIFICATIONS.filter((notif) => !notif.read).length;
};

export const getUserNotifications = (userId: string): NotificationData[] => {
  return HARDCODED_NOTIFICATIONS.filter(
    (notif) => notif.recipientId === userId,
  );
};

export const getUpcomingSchedule = (days: number = 7): ScheduleData[] => {
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);

  return HARDCODED_SCHEDULE.filter((schedule) => {
    const scheduleDate = new Date(schedule.startDate);
    return (
      scheduleDate >= now &&
      scheduleDate <= future &&
      schedule.status === "Scheduled"
    );
  });
};

export const getRecentActivities = (limit: number = 10): ActivityData[] => {
  return HARDCODED_ACTIVITIES.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  ).slice(0, limit);
};

// Additional helper functions for comprehensive data relationships
export const getJobStats = (jobId: string) => {
  const job = getJob(jobId);
  const candidates = getJobCandidates(jobId);

  if (!job) return null;

  return {
    ...job,
    candidates: candidates.length,
    stageDistribution: {
      applied: candidates.filter((c) => c.stage === "Applied").length,
      screening: candidates.filter((c) => c.stage === "Screening").length,
      interview: candidates.filter((c) => c.stage === "Interview").length,
      technical: candidates.filter((c) => c.stage === "Technical").length,
      offer: candidates.filter((c) => c.stage === "Offer").length,
      hired: candidates.filter((c) => c.stage === "Hired").length,
      rejected: candidates.filter((c) => c.stage === "Rejected").length,
    },
  };
};

export const getCandidateTimeline = (candidateId: string) => {
  const candidate = getCandidate(candidateId);
  if (!candidate) return [];

  const timeline = [
    ...candidate.stageHistory.map((stage) => ({
      type: "stage_change",
      date: stage.startDate,
      description: `Moved to ${stage.stage}`,
      details: stage.notes,
    })),
    ...candidate.emails.map((email) => ({
      type: "email",
      date: email.timestamp,
      description: `Email: ${email.subject}`,
      details: email.status,
    })),
    ...candidate.notes.map((note) => ({
      type: "note",
      date: note.timestamp,
      description: `Note added by ${note.userName}`,
      details: note.content,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return timeline;
};
