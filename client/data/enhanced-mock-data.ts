import {
  EnhancedCandidateData,
  JobApplication,
} from "@/types/enhanced-candidate";
import {
  StageHistoryData,
  NoteData,
  EmailData,
  EducationData,
  WorkExperienceData,
  CVEvaluationData,
  AttachmentData,
} from "@/data/hardcoded-data";

// Mock Job Applications for a candidate applying to multiple positions
const mockJobApplications: JobApplication[] = [
  {
    id: "job-app-1",
    jobId: "job-001",
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    appliedDate: "2024-01-15",
    currentStage: "Hired",
    priority: "High",
    recruiter: "Alice Johnson",
    status: "Completed",
    salary: "$125,000 - $150,000",
    location: "San Francisco, CA",
    stageHistory: [
      {
        id: "sh-1",
        stage: "Applied",
        startDate: "2024-01-15",
        endDate: "2024-01-18",
        duration: 3,
        reason: "Application submitted",
        notes: "Strong portfolio, good GitHub activity",
        userId: "user-1",
        userName: "Alice Johnson",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-2",
        stage: "Screening",
        startDate: "2024-01-18",
        endDate: "2024-01-22",
        duration: 4,
        reason: "Phone screening completed successfully",
        notes: "Great communication skills, technical background solid",
        userId: "user-1",
        userName: "Alice Johnson",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-3",
        stage: "Interview",
        startDate: "2024-01-22",
        endDate: "2024-01-29",
        duration: 7,
        reason: "Technical and cultural fit interview",
        notes: "Excellent problem-solving skills, team fit confirmed",
        userId: "user-2",
        userName: "Bob Wilson",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-4",
        stage: "Technical",
        startDate: "2024-01-29",
        endDate: "2024-02-05",
        duration: 7,
        reason: "Technical assessment completed",
        notes: "Impressive coding test results, good architectural thinking",
        userId: "user-3",
        userName: "Charlie Davis",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-5",
        stage: "Offer",
        startDate: "2024-02-05",
        endDate: "2024-02-12",
        duration: 7,
        reason: "Offer extended and negotiated",
        notes: "Salary negotiation completed, benefits package agreed",
        userId: "user-1",
        userName: "Alice Johnson",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-6",
        stage: "Hired",
        startDate: "2024-02-12",
        duration: 21,
        reason: "Offer accepted, onboarding started",
        notes: "Completed onboarding, performing well",
        userId: "user-1",
        userName: "Alice Johnson",
        mailSent: true,
        mailConfirmed: true,
      },
    ],
    notes: [
      {
        id: "note-1",
        content:
          "Candidate showed exceptional React and TypeScript skills during technical interview",
        userId: "user-2",
        userName: "Bob Wilson",
        timestamp: "2024-01-25T10:30:00Z",
        type: "note",
        tags: ["technical", "positive"],
      },
      {
        id: "note-2",
        content:
          "Great cultural fit, very collaborative approach to problem solving",
        userId: "user-3",
        userName: "Charlie Davis",
        timestamp: "2024-01-26T14:15:00Z",
        type: "note",
        tags: ["culture", "teamwork"],
      },
    ],
    emails: [
      {
        id: "email-1",
        subject: "Welcome to the team - Senior Frontend Developer",
        content:
          "Dear Marissa,\n\nWe're thrilled to welcome you to our Engineering team as Senior Frontend Developer...",
        from: "alice.johnson@company.com",
        to: "marissa.torres@email.com",
        timestamp: "2024-02-12T09:00:00Z",
        status: "sent",
        type: "offer_acceptance",
      },
    ],
  },
  {
    id: "job-app-2",
    jobId: "job-002",
    jobTitle: "Lead UI/UX Developer",
    department: "Design",
    appliedDate: "2024-01-20",
    currentStage: "Interview",
    priority: "Medium",
    recruiter: "Sarah Chen",
    status: "Active",
    salary: "$130,000 - $160,000",
    location: "San Francisco, CA",
    stageHistory: [
      {
        id: "sh-7",
        stage: "Applied",
        startDate: "2024-01-20",
        endDate: "2024-01-23",
        duration: 3,
        reason: "Application submitted for design role",
        notes: "Strong design portfolio, good Figma skills",
        userId: "user-4",
        userName: "Sarah Chen",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-8",
        stage: "Screening",
        startDate: "2024-01-23",
        endDate: "2024-01-30",
        duration: 7,
        reason: "Portfolio review and initial screening",
        notes:
          "Impressive design work, good understanding of user experience principles",
        userId: "user-4",
        userName: "Sarah Chen",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-9",
        stage: "Interview",
        startDate: "2024-01-30",
        duration: 14,
        reason: "Design challenge and team interview scheduled",
        notes: "Currently in interview process, design challenge submitted",
        userId: "user-4",
        userName: "Sarah Chen",
        mailSent: true,
        mailConfirmed: false,
      },
    ],
    notes: [
      {
        id: "note-3",
        content:
          "Design challenge shows strong understanding of user-centered design principles",
        userId: "user-5",
        userName: "Emma Rodriguez",
        timestamp: "2024-02-02T11:20:00Z",
        type: "note",
        tags: ["design", "challenge"],
      },
    ],
    emails: [
      {
        id: "email-2",
        subject: "Design Challenge - Lead UI/UX Developer",
        content:
          "Hi Marissa,\n\nThank you for your interest in the Lead UI/UX Developer position...",
        from: "sarah.chen@company.com",
        to: "marissa.torres@email.com",
        timestamp: "2024-01-30T15:30:00Z",
        status: "sent",
        type: "interview_invitation",
      },
    ],
  },
  {
    id: "job-app-3",
    jobId: "job-003",
    jobTitle: "Full Stack Engineer",
    department: "Engineering",
    appliedDate: "2024-02-01",
    currentStage: "Screening",
    priority: "Low",
    recruiter: "Mike Johnson",
    status: "On Hold",
    salary: "$120,000 - $145,000",
    location: "Remote",
    stageHistory: [
      {
        id: "sh-10",
        stage: "Applied",
        startDate: "2024-02-01",
        endDate: "2024-02-05",
        duration: 4,
        reason: "Applied for remote full-stack position",
        notes: "Good full-stack experience, interested in remote work",
        userId: "user-6",
        userName: "Mike Johnson",
        mailSent: true,
        mailConfirmed: true,
      },
      {
        id: "sh-11",
        stage: "Screening",
        startDate: "2024-02-05",
        duration: 10,
        reason: "Initial screening in progress",
        notes:
          "On hold due to other priorities, will resume after decision on primary role",
        userId: "user-6",
        userName: "Mike Johnson",
        mailSent: false,
        mailConfirmed: false,
      },
    ],
    notes: [
      {
        id: "note-4",
        content:
          "Put on hold since candidate is progressing well with Senior Frontend role",
        userId: "user-6",
        userName: "Mike Johnson",
        timestamp: "2024-02-08T09:45:00Z",
        type: "system",
        tags: ["hold", "priority"],
      },
    ],
    emails: [
      {
        id: "email-3",
        subject: "Application Received - Full Stack Engineer",
        content:
          "Dear Marissa,\n\nThank you for applying to the Full Stack Engineer position...",
        from: "mike.johnson@company.com",
        to: "marissa.torres@email.com",
        timestamp: "2024-02-01T16:20:00Z",
        status: "sent",
        type: "application_received",
      },
    ],
  },
];

// Enhanced candidate data with multiple job applications
export const ENHANCED_CANDIDATE_SAMPLE: EnhancedCandidateData = {
  id: "cand-001",
  name: "Marissa Torres",
  email: "marissa.torres@email.com",
  phone: "+1 (555) 987-6543",
  location: "San Francisco, CA",
  experience: "5+ years",
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
  resume: "Marissa_Torres_Resume.pdf",
  avatar: "/avatars/marissa-torres.jpg",
  source: "LinkedIn",
  tags: ["senior", "frontend", "experienced", "available"],
  attachments: [
    {
      id: "att-1",
      name: "Resume.pdf",
      url: "/files/marissa-torres-resume.pdf",
      type: "application/pdf",
      size: 245760,
      uploadedAt: "2024-01-15T08:30:00Z",
    },
    {
      id: "att-2",
      name: "Portfolio.pdf",
      url: "/files/marissa-torres-portfolio.pdf",
      type: "application/pdf",
      size: 1048576,
      uploadedAt: "2024-01-15T08:31:00Z",
    },
  ],
  linkedInProfile: "https://linkedin.com/in/marissa-torres",
  githubProfile: "https://github.com/marissa-torres",
  portfolioUrl: "https://marissatorres.dev",
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationYear: "2019",
      gpa: "3.8",
    },
  ],
  workExperience: [
    {
      id: "work-1",
      company: "TechStart Inc.",
      position: "Frontend Developer",
      startDate: "2019-06",
      endDate: "2022-03",
      description: "Developed and maintained React applications",
      achievements: [
        "Led migration to TypeScript",
        "Improved performance by 40%",
      ],
    },
    {
      id: "work-2",
      company: "Innovation Labs",
      position: "Senior Frontend Developer",
      startDate: "2022-03",
      endDate: "2024-01",
      description: "Lead frontend development for B2B SaaS platform",
      achievements: ["Built design system", "Mentored junior developers"],
    },
  ],
  lastActivity: "2024-02-15T10:30:00Z",
  communicationPreference: "email",
  timezone: "PST",
  availability: "Immediate",
  jobApplications: mockJobApplications,
  globalNotes: [
    {
      id: "global-note-1",
      content:
        "Excellent candidate with strong technical and communication skills. Applying to multiple roles to find best fit.",
      userId: "user-1",
      userName: "Alice Johnson",
      timestamp: "2024-01-15T09:00:00Z",
      type: "note",
      tags: ["summary", "multi-role"],
    },
  ],
  cvEvaluations: [
    {
      id: "cv-eval-1",
      candidateId: "cand-001",
      jobId: "job-001",
      fileName: "Marissa_Torres_Resume.pdf",
      summary:
        "Strong frontend developer with excellent React and TypeScript skills",
      strengths: [
        "React expertise",
        "TypeScript proficiency",
        "Strong portfolio",
      ],
      weaknesses: ["Limited backend experience", "No DevOps experience"],
      jobFitScore: 92,
      suggestedImprovements: ["Consider learning backend technologies"],
      finalVerdict: "Good Fit",
      skillsMatch: [
        { skill: "React", hasSkill: true, level: "Expert" },
        { skill: "TypeScript", hasSkill: true, level: "Advanced" },
        { skill: "Node.js", hasSkill: true, level: "Intermediate" },
      ],
      experienceMatch: 85,
      educationMatch: 95,
      recommendations: ["Excellent fit for senior frontend role"],
      extractedData: {
        name: "Marissa Torres",
        email: "marissa.torres@email.com",
        phone: "+1 (555) 987-6543",
        location: "San Francisco, CA",
        education: ["Stanford University - BS Computer Science"],
        workExperience: [
          "TechStart Inc. - Frontend Developer",
          "Innovation Labs - Senior Frontend Developer",
        ],
        skills: ["React", "TypeScript", "Node.js", "GraphQL", "Redux"],
      },
      notes: "Top candidate for senior frontend position",
      savedAt: "2024-01-15T10:00:00Z",
      createdBy: "alice.johnson@company.com",
      isShared: true,
      shareUrl: "https://app.company.com/cv-eval/cv-eval-1",
    },
  ],
  createdAt: "2024-01-15T08:00:00Z",
  updatedAt: "2024-02-15T10:30:00Z",
};

// Helper function to get job application by ID
export function getJobApplication(
  candidateData: EnhancedCandidateData,
  jobApplicationId: string,
): JobApplication | undefined {
  return candidateData.jobApplications.find(
    (app) => app.id === jobApplicationId,
  );
}

// Helper function to get current job application (most recently updated or highest priority active)
export function getCurrentJobApplication(
  candidateData: EnhancedCandidateData,
): JobApplication | undefined {
  const activeApps = candidateData.jobApplications.filter(
    (app) => app.status === "Active",
  );
  if (activeApps.length === 0) return candidateData.jobApplications[0];

  // Return highest priority active application
  return activeApps.reduce((prev, current) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return priorityOrder[current.priority] > priorityOrder[prev.priority]
      ? current
      : prev;
  });
}
