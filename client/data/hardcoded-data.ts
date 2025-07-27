// Hardcoded data for display purposes only - no persistence

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
  interviewers: string[];
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
  createdAt: string;
  updatedAt: string;
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
}

export interface NoteData {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
  type: "note" | "system";
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

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionText?: string;
}

export const HARDCODED_JOBS: JobData[] = [
  {
    id: "job_1",
    position: "Senior Frontend Developer",
    department: "Engineering",
    recruiter: "Alex Chen",
    applications: 45,
    target: 2,
    hired: 1,
    openDate: "2024-01-10",
    deadline: "2024-02-15",
    estimatedCost: "15000",
    actualCost: "12500",
    performance: 85,
    status: "Open",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "We are looking for a Senior Frontend Developer to join our growing engineering team. You'll be working on cutting-edge web applications using React, TypeScript, and modern development tools.",
    priority: "High",
    emailAlias: "frontend-jobs@company.com",
    expectedSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "JavaScript",
      "CSS",
      "HTML",
    ],
    salaryMin: "120000",
    salaryMax: "150000",
    domain: "Technology",
    headcount: 2,
    interviewers: ["john.doe@company.com", "jane.smith@company.com"],
    pipelineSummary: {
      applied: 45,
      screening: 12,
      interview: 8,
      technical: 5,
      offer: 2,
      hired: 1,
      rejected: 17,
    },
    budget: {
      estimated: 15000,
      actual: 12500,
      expenses: [
        {
          id: "exp_1",
          amount: 5000,
          category: "Job Boards",
          description: "LinkedIn Premium and Indeed postings",
          expectedOutcome: "Attract 50+ qualified candidates",
          evaluationPeriod: "30 days",
          effectiveness: 85,
          createdAt: "2024-01-10",
          createdBy: "Alex Chen",
        },
        {
          id: "exp_2",
          amount: 7500,
          category: "Recruitment Agency",
          description: "Agency fee for candidate sourcing",
          expectedOutcome: "5 pre-screened candidates",
          evaluationPeriod: "45 days",
          effectiveness: 90,
          createdAt: "2024-01-15",
          createdBy: "Alex Chen",
        },
      ],
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "job_2",
    position: "Product Manager",
    department: "Product",
    recruiter: "Sarah Kim",
    applications: 67,
    target: 1,
    hired: 0,
    openDate: "2024-01-05",
    deadline: "2024-02-20",
    estimatedCost: "18000",
    actualCost: "16200",
    performance: 72,
    status: "In Progress",
    location: "New York, NY",
    type: "Full-time",
    description:
      "Seeking an experienced Product Manager to drive product strategy and roadmap execution.",
    priority: "High",
    emailAlias: "product-jobs@company.com",
    expectedSkills: [
      "Product Strategy",
      "Agile",
      "Data Analysis",
      "User Research",
    ],
    salaryMin: "110000",
    salaryMax: "140000",
    domain: "Technology",
    headcount: 1,
    interviewers: ["pm.lead@company.com"],
    pipelineSummary: {
      applied: 67,
      screening: 20,
      interview: 15,
      technical: 8,
      offer: 3,
      hired: 0,
      rejected: 21,
    },
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
  },
  {
    id: "job_3",
    position: "UX Designer",
    department: "Design",
    recruiter: "Mike Wilson",
    applications: 34,
    target: 1,
    hired: 1,
    openDate: "2023-12-20",
    deadline: "2024-01-25",
    estimatedCost: "12000",
    actualCost: "9500",
    performance: 95,
    status: "Closed",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our design team to create exceptional user experiences for our products.",
    priority: "Medium",
    emailAlias: "design-jobs@company.com",
    expectedSkills: ["Figma", "Sketch", "User Research", "Prototyping"],
    salaryMin: "85000",
    salaryMax: "105000",
    domain: "Technology",
    headcount: 1,
    interviewers: ["design.lead@company.com"],
    pipelineSummary: {
      applied: 34,
      screening: 15,
      interview: 12,
      technical: 8,
      offer: 3,
      hired: 1,
      rejected: 10,
    },
    createdAt: "2023-12-20T14:00:00Z",
    updatedAt: "2024-01-25T16:45:00Z",
  },
];

export const HARDCODED_CANDIDATES: CandidateData[] = [
  {
    id: "candidate_1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 0123",
    location: "San Francisco, CA",
    position: "Senior Frontend Developer",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "JavaScript", "CSS"],
    status: "Active",
    stage: "Interview",
    rating: 5,
    appliedDate: "2024-01-15",
    resume: "sarah_johnson_resume.pdf",
    avatar: "",
    salary: "$120k - $140k",
    source: "LinkedIn",
    recruiter: "Alex Chen",
    department: "Engineering",
    duration: 5,
    tags: ["High Priority", "Cultural Fit", "Technical Expert"],
    stageHistory: [
      {
        id: "stage_1",
        stage: "Applied",
        startDate: "2024-01-15",
        endDate: "2024-01-16",
        duration: 1,
        reason: "Application submitted",
        notes: "Strong technical background",
        userId: "user_1",
        userName: "Alex Chen",
      },
      {
        id: "stage_2",
        stage: "Screening",
        startDate: "2024-01-16",
        endDate: "2024-01-19",
        duration: 3,
        reason: "Passed initial screening",
        notes: "Excellent communication skills",
        userId: "user_1",
        userName: "Alex Chen",
      },
      {
        id: "stage_3",
        stage: "Interview",
        startDate: "2024-01-19",
        duration: 5,
        reason: "Scheduled for technical interview",
        notes: "Panel interview scheduled for Jan 25th",
        userId: "user_1",
        userName: "Alex Chen",
      },
    ],
    notes: [
      {
        id: "note_1",
        content: "Excellent React skills demonstrated in portfolio",
        userId: "user_1",
        userName: "Alex Chen",
        timestamp: "2024-01-16T10:30:00Z",
        type: "note",
      },
    ],
    emails: [
      {
        id: "email_1",
        subject: "Interview Invitation - Senior Frontend Developer",
        content:
          "Hi Sarah, Thank you for your interest in our Senior Frontend Developer position...",
        from: "alex.chen@company.com",
        to: "sarah.j@email.com",
        timestamp: "2024-01-17T09:00:00Z",
        status: "sent",
        template: "interview_invitation",
      },
    ],
    attachments: [
      {
        id: "att_1",
        name: "sarah_johnson_resume.pdf",
        type: "application/pdf",
        size: 245760,
        url: "/uploads/sarah_johnson_resume.pdf",
        uploadedAt: "2024-01-15T14:30:00Z",
        uploadedBy: "Sarah Johnson",
      },
    ],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-19T11:15:00Z",
  },
  {
    id: "candidate_2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 0456",
    location: "New York, NY",
    position: "Product Manager",
    experience: "7+ years",
    skills: [
      "Product Strategy",
      "Agile",
      "Data Analysis",
      "User Research",
      "Roadmapping",
    ],
    status: "Active",
    stage: "Technical",
    rating: 4,
    appliedDate: "2024-01-12",
    resume: "michael_chen_resume.pdf",
    avatar: "",
    salary: "$130k - $150k",
    source: "Indeed",
    recruiter: "Sarah Kim",
    department: "Product",
    duration: 8,
    tags: ["Experienced", "Strategic Thinker"],
    stageHistory: [
      {
        id: "stage_1",
        stage: "Applied",
        startDate: "2024-01-12",
        endDate: "2024-01-13",
        duration: 1,
        reason: "Application received",
        notes: "Strong PM background",
        userId: "user_2",
        userName: "Sarah Kim",
      },
      {
        id: "stage_2",
        stage: "Screening",
        startDate: "2024-01-13",
        endDate: "2024-01-17",
        duration: 4,
        reason: "Phone screening completed",
        notes: "Great strategic thinking",
        userId: "user_2",
        userName: "Sarah Kim",
      },
      {
        id: "stage_3",
        stage: "Interview",
        startDate: "2024-01-17",
        endDate: "2024-01-20",
        duration: 3,
        reason: "Panel interview passed",
        notes: "Impressive case study presentation",
        userId: "user_2",
        userName: "Sarah Kim",
      },
      {
        id: "stage_4",
        stage: "Technical",
        startDate: "2024-01-20",
        duration: 8,
        reason: "Technical assessment in progress",
        notes: "Product case study due Jan 28th",
        userId: "user_2",
        userName: "Sarah Kim",
      },
    ],
    notes: [
      {
        id: "note_1",
        content: "Strong product sense and analytical skills",
        userId: "user_2",
        userName: "Sarah Kim",
        timestamp: "2024-01-17T15:20:00Z",
        type: "note",
      },
    ],
    emails: [
      {
        id: "email_1",
        subject: "Technical Assessment - Product Manager Role",
        content:
          "Hi Michael, Following our successful interview, we'd like to proceed with the technical assessment...",
        from: "sarah.kim@company.com",
        to: "michael.chen@email.com",
        timestamp: "2024-01-20T14:30:00Z",
        status: "sent",
        template: "technical_assessment",
      },
    ],
    attachments: [
      {
        id: "att_1",
        name: "michael_chen_resume.pdf",
        type: "application/pdf",
        size: 312450,
        url: "/uploads/michael_chen_resume.pdf",
        uploadedAt: "2024-01-12T16:45:00Z",
        uploadedBy: "Michael Chen",
      },
    ],
    createdAt: "2024-01-12T10:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "candidate_3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 0789",
    location: "Remote",
    position: "UX Designer",
    experience: "4+ years",
    skills: [
      "Figma",
      "Sketch",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    status: "Active",
    stage: "Hired",
    rating: 5,
    appliedDate: "2024-01-08",
    resume: "emily_davis_resume.pdf",
    avatar: "",
    salary: "$95k - $105k",
    source: "Company Website",
    recruiter: "Mike Wilson",
    department: "Design",
    duration: 12,
    tags: ["Design Expert", "Hired", "Remote Worker"],
    stageHistory: [
      {
        id: "stage_1",
        stage: "Applied",
        startDate: "2024-01-08",
        endDate: "2024-01-09",
        duration: 1,
        reason: "Application submitted via website",
        notes: "Impressive portfolio",
        userId: "user_3",
        userName: "Mike Wilson",
      },
      {
        id: "stage_2",
        stage: "Screening",
        startDate: "2024-01-09",
        endDate: "2024-01-12",
        duration: 3,
        reason: "Portfolio review and initial call",
        notes: "Strong design background",
        userId: "user_3",
        userName: "Mike Wilson",
      },
      {
        id: "stage_3",
        stage: "Interview",
        startDate: "2024-01-12",
        endDate: "2024-01-15",
        duration: 3,
        reason: "Design challenge completed successfully",
        notes: "Excellent design thinking process",
        userId: "user_3",
        userName: "Mike Wilson",
      },
      {
        id: "stage_4",
        stage: "Offer",
        startDate: "2024-01-15",
        endDate: "2024-01-18",
        duration: 3,
        reason: "Offer extended and accepted",
        notes: "Negotiated remote work arrangement",
        userId: "user_3",
        userName: "Mike Wilson",
      },
      {
        id: "stage_5",
        stage: "Hired",
        startDate: "2024-01-18",
        duration: 2,
        reason: "Onboarding completed",
        notes: "Start date: February 1st, 2024",
        userId: "user_3",
        userName: "Mike Wilson",
      },
    ],
    notes: [
      {
        id: "note_1",
        content:
          "Outstanding portfolio showcasing user-centered design approach",
        userId: "user_3",
        userName: "Mike Wilson",
        timestamp: "2024-01-09T11:00:00Z",
        type: "note",
      },
      {
        id: "note_2",
        content:
          "Successfully completed design challenge with innovative solutions",
        userId: "user_3",
        userName: "Mike Wilson",
        timestamp: "2024-01-15T16:30:00Z",
        type: "note",
      },
    ],
    emails: [
      {
        id: "email_1",
        subject: "Offer Letter - UX Designer Position",
        content:
          "Dear Emily, We are pleased to offer you the position of UX Designer...",
        from: "mike.wilson@company.com",
        to: "emily.davis@email.com",
        timestamp: "2024-01-15T10:00:00Z",
        status: "sent",
        template: "offer_letter",
      },
    ],
    attachments: [
      {
        id: "att_1",
        name: "emily_davis_resume.pdf",
        type: "application/pdf",
        size: 198765,
        url: "/uploads/emily_davis_resume.pdf",
        uploadedAt: "2024-01-08T13:20:00Z",
        uploadedBy: "Emily Davis",
      },
    ],
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-18T17:00:00Z",
  },
];

export const HARDCODED_NOTIFICATIONS: NotificationData[] = [
  {
    id: "notif_1",
    title: "New Application Received",
    message: "Sarah Johnson applied for Senior Frontend Developer position",
    type: "info",
    read: false,
    timestamp: "2024-01-20T10:30:00Z",
    actionUrl: "/candidates/candidate_1",
    actionText: "View Candidate",
  },
  {
    id: "notif_2",
    title: "Interview Scheduled",
    message: "Technical interview scheduled for Michael Chen on Jan 25th",
    type: "success",
    read: true,
    timestamp: "2024-01-19T14:15:00Z",
    actionUrl: "/calendar",
    actionText: "View Calendar",
  },
  {
    id: "notif_3",
    title: "Deadline Approaching",
    message: "UX Designer position deadline is in 5 days",
    type: "warning",
    read: false,
    timestamp: "2024-01-18T09:00:00Z",
    actionUrl: "/jobs/job_3",
    actionText: "View Job",
  },
];

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
  const job = getJob(jobId);
  if (!job) return [];

  return HARDCODED_CANDIDATES.filter(
    (candidate) => candidate.position === job.position,
  );
};

export const getUnreadNotificationCount = (): number => {
  return HARDCODED_NOTIFICATIONS.filter((notif) => !notif.read).length;
};
