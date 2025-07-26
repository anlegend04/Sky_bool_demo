// Data persistence utility for recruitment system
// Simulates backend operations using localStorage/sessionStorage

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
  status: string;
  stage: string;
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
  jobId?: string;
  stageHistory: StageHistoryData[];
  notes: NoteData[];
  emails: EmailData[];
  attachments: AttachmentData[];
  createdAt: string;
  updatedAt: string;
}

export interface StageHistoryData {
  id: string;
  stage: string;
  startDate: string;
  endDate?: string;
  duration: number;
  reason?: string;
  notes?: string;
  userId: string;
  userName: string;
}

export interface NoteData {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
  type: "note" | "system" | "email" | "call" | "interview";
}

export interface EmailData {
  id: string;
  subject: string;
  content: string;
  from: string;
  to: string;
  timestamp: string;
  status: "sent" | "draft" | "failed";
  template?: string;
  attachments?: string[];
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

export interface ExpenseData {
  id: string;
  amount: number;
  category: string;
  description: string;
  expectedOutcome: string;
  evaluationPeriod: string;
  effectiveness?: number;
  attachments?: string[];
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface NotificationData {
  id: string;
  type: "candidate_moved" | "interview_scheduled" | "application_received" | "budget_exceeded" | "deadline_approaching";
  title: string;
  message: string;
  entityId: string;
  entityType: "job" | "candidate" | "budget";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ResumeUploadLogData {
  id: string;
  fileName: string;
  uploadTime: string;
  extractedFields: {
    name?: string;
    email?: string;
    phone?: string;
    currentTitle?: string;
    location?: string;
    yoe?: number;
    education?: string;
    skills?: string[];
  };
  status: "success" | "failed" | "manual_review";
  linkedCandidateId?: string;
  errorMessage?: string;
}

// Storage keys
const STORAGE_KEYS = {
  JOBS: 'recruitment_jobs',
  CANDIDATES: 'recruitment_candidates',
  NOTIFICATIONS: 'recruitment_notifications',
  RESUME_UPLOADS: 'recruitment_resume_uploads',
  SETTINGS: 'recruitment_settings',
  EMAIL_TEMPLATES: 'recruitment_email_templates',
} as const;

// Generic storage operations
class StorageManager {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  // Job operations
  getJobs(): JobData[] {
    return this.getItem(STORAGE_KEYS.JOBS, []);
  }

  setJobs(jobs: JobData[]): void {
    this.setItem(STORAGE_KEYS.JOBS, jobs);
  }

  addJob(job: Omit<JobData, 'id' | 'createdAt' | 'updatedAt'>): JobData {
    const jobs = this.getJobs();
    const newJob: JobData = {
      ...job,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    this.setJobs(jobs);
    this.addNotification({
      type: "application_received",
      title: "New Job Created",
      message: `Job "${newJob.position}" has been created`,
      entityId: newJob.id,
      entityType: "job",
    });
    return newJob;
  }

  updateJob(id: string, updates: Partial<JobData>): JobData | null {
    const jobs = this.getJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) return null;

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.setJobs(jobs);
    return jobs[jobIndex];
  }

  deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const filteredJobs = jobs.filter(job => job.id !== id);
    if (filteredJobs.length === jobs.length) return false;
    this.setJobs(filteredJobs);
    return true;
  }

  getJob(id: string): JobData | null {
    const jobs = this.getJobs();
    return jobs.find(job => job.id === id) || null;
  }

  // Candidate operations
  getCandidates(): CandidateData[] {
    return this.getItem(STORAGE_KEYS.CANDIDATES, []);
  }

  setCandidates(candidates: CandidateData[]): void {
    this.setItem(STORAGE_KEYS.CANDIDATES, candidates);
  }

  addCandidate(candidate: Omit<CandidateData, 'id' | 'createdAt' | 'updatedAt'>): CandidateData {
    const candidates = this.getCandidates();
    const newCandidate: CandidateData = {
      ...candidate,
      id: `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    candidates.push(newCandidate);
    this.setCandidates(candidates);
    this.addNotification({
      type: "application_received",
      title: "New Application",
      message: `${newCandidate.name} applied for ${newCandidate.position}`,
      entityId: newCandidate.id,
      entityType: "candidate",
    });
    return newCandidate;
  }

  updateCandidate(id: string, updates: Partial<CandidateData>): CandidateData | null {
    const candidates = this.getCandidates();
    const candidateIndex = candidates.findIndex(candidate => candidate.id === id);
    if (candidateIndex === -1) return null;

    const oldStage = candidates[candidateIndex].stage;
    candidates[candidateIndex] = {
      ...candidates[candidateIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If stage changed, add to stage history and notification
    if (updates.stage && updates.stage !== oldStage) {
      const stageHistory: StageHistoryData = {
        id: `stage_${Date.now()}`,
        stage: updates.stage,
        startDate: new Date().toISOString(),
        duration: 0,
        userId: "current_user",
        userName: "Current User",
        reason: (updates as any).stageChangeReason || "Stage updated",
      };
      candidates[candidateIndex].stageHistory.push(stageHistory);

      this.addNotification({
        type: "candidate_moved",
        title: "Candidate Stage Updated",
        message: `${candidates[candidateIndex].name} moved to ${updates.stage}`,
        entityId: id,
        entityType: "candidate",
      });
    }

    this.setCandidates(candidates);
    return candidates[candidateIndex];
  }

  deleteCandidate(id: string): boolean {
    const candidates = this.getCandidates();
    const filteredCandidates = candidates.filter(candidate => candidate.id !== id);
    if (filteredCandidates.length === candidates.length) return false;
    this.setCandidates(filteredCandidates);
    return true;
  }

  getCandidate(id: string): CandidateData | null {
    const candidates = this.getCandidates();
    return candidates.find(candidate => candidate.id === id) || null;
  }

  // Notification operations
  getNotifications(): NotificationData[] {
    return this.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  addNotification(notification: Omit<NotificationData, 'id' | 'read' | 'timestamp'>): void {
    const notifications = this.getNotifications();
    const newNotification: NotificationData = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  getUnreadNotificationCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  // Resume upload operations
  getResumeUploads(): ResumeUploadLogData[] {
    return this.getItem(STORAGE_KEYS.RESUME_UPLOADS, []);
  }

  addResumeUpload(upload: Omit<ResumeUploadLogData, 'id'>): ResumeUploadLogData {
    const uploads = this.getResumeUploads();
    const newUpload: ResumeUploadLogData = {
      ...upload,
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    uploads.unshift(newUpload);
    // Keep only last 50 uploads
    if (uploads.length > 50) {
      uploads.splice(50);
    }
    this.setItem(STORAGE_KEYS.RESUME_UPLOADS, uploads);
    return newUpload;
  }

  // Email template operations
  getEmailTemplates(): { [key: string]: string } {
    return this.getItem(STORAGE_KEYS.EMAIL_TEMPLATES, {
      interview_invitation: "Dear {{name}},\n\nWe would like to invite you for an interview for the {{position}} position...",
      offer_letter: "Dear {{name}},\n\nWe are pleased to offer you the position of {{position}}...",
      rejection_notice: "Dear {{name}},\n\nThank you for your interest in the {{position}} position..."
    });
  }

  // Initialize with default data if empty
  initializeDefaultData(): void {
    if (this.getJobs().length === 0) {
      this.initializeDefaultJobs();
    }
    if (this.getCandidates().length === 0) {
      this.initializeDefaultCandidates();
    }
  }

  private initializeDefaultJobs(): void {
    const defaultJobs: Omit<JobData, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
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
        description: "We are looking for a Senior Frontend Developer to join our team...",
        priority: "High",
        emailAlias: "frontend-jobs@company.com",
        expectedSkills: ["React", "TypeScript", "Node.js"],
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
          rejected: 17
        }
      },
      {
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
        description: "Seeking an experienced Product Manager to drive product strategy...",
        priority: "High",
        emailAlias: "product-jobs@company.com",
        expectedSkills: ["Product Strategy", "Agile", "Data Analysis"],
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
          rejected: 21
        }
      }
    ];

    defaultJobs.forEach(job => this.addJob(job));
  }

  private initializeDefaultCandidates(): void {
    const defaultCandidates: Omit<CandidateData, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 0123",
        location: "San Francisco, CA",
        position: "Senior Frontend Developer",
        experience: "5+ years",
        skills: ["React", "TypeScript", "Node.js", "GraphQL"],
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
        tags: ["High Priority", "Cultural Fit"],
        stageHistory: [],
        notes: [],
        emails: [],
        attachments: []
      }
    ];

    defaultCandidates.forEach(candidate => this.addCandidate(candidate));
  }
}

// Export singleton instance
export const storage = new StorageManager();

// Initialize default data on first load
if (typeof window !== 'undefined') {
  storage.initializeDefaultData();
}
