import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'vi' | 'zh' | 'ja' | 'ko' | 'th' | 'fr' | 'es';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  getCurrentLanguageInfo: () => LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'td_consulting_language';

// Translation function
const useTranslations = (language: Language) => {
  const translations: Record<Language, Record<string, string>> = {
    en: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.jobs': 'Jobs',
      'nav.candidates': 'Candidates',
      'nav.calendar': 'Calendar',
      'nav.email': 'Email Automation',
      'nav.reports': 'Reports',
      'nav.notifications': 'Notifications',
      'nav.settings': 'Settings',

      // Header
      'header.search': 'Search candidates, jobs...',
      'header.quickAdd': 'Quick Add',
      'header.addJob': 'Add Job',
      'header.addCandidate': 'Add Candidate',
      'header.language': 'Language',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Welcome back! Here\'s an overview of your recruitment activities.',
      'dashboard.activeJobs': 'Active Jobs',
      'dashboard.totalCandidates': 'Total Candidates',
      'dashboard.interviewsThisWeek': 'Interviews This Week',
      'dashboard.avgTimeToHire': 'Avg. Time to Hire',
      'dashboard.totalRevenue': 'Total Revenue',
      'dashboard.recentJobs': 'Recent Jobs',
      'dashboard.topCandidates': 'Top Candidates',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.viewAll': 'View All',

      // Jobs
      'jobs.title': 'Jobs',
      'jobs.subtitle': 'Manage job postings, track applications, and monitor hiring progress.',
      'jobs.createJob': 'Create Job',
      'jobs.filterJobs': 'Filter Jobs',
      'jobs.position': 'Position',
      'jobs.department': 'Department',
      'jobs.applications': 'Applications',
      'jobs.status': 'Status',
      'jobs.deadline': 'Deadline',
      'jobs.performance': 'Performance',
      'jobs.recruiter': 'Recruiter',
      'jobs.location': 'Location',
      'jobs.priority': 'Priority',

      // Candidates
      'candidates.title': 'Candidates',
      'candidates.subtitle': 'Manage candidate profiles, track progress, and schedule interviews.',
      'candidates.addCandidate': 'Add Candidate',
      'candidates.moreFilters': 'More Filters',
      'candidates.name': 'Name',
      'candidates.position': 'Position',
      'candidates.stage': 'Stage',
      'candidates.rating': 'Rating',
      'candidates.appliedDate': 'Applied Date',
      'candidates.source': 'Source',

      // Email Automation
      'email.title': 'Email Automation',
      'email.subtitle': 'Manage email templates, workflows, and automate candidate communication.',
      'email.newWorkflow': 'New Workflow',
      'email.newTemplate': 'New Template',
      'email.activeTemplates': 'Active Templates',
      'email.emailsSent': 'Emails Sent (30d)',
      'email.avgOpenRate': 'Avg. Open Rate',
      'email.activeWorkflows': 'Active Workflows',
      'email.templates': 'Email Templates',
      'email.workflows': 'Automation Workflows',
      'email.analytics': 'Analytics',
      'email.settings': 'Settings',

      // Calendar
      'calendar.title': 'Calendar',
      'calendar.subtitle': 'Schedule interviews, meetings, and track all your appointments.',
      'calendar.scheduleEvent': 'Schedule Event',
      'calendar.filterEvents': 'Filter Events',
      'calendar.month': 'Month',
      'calendar.week': 'Week',
      'calendar.day': 'Day',
      'calendar.todaySchedule': 'Today\'s Schedule',
      'calendar.upcomingEvents': 'Upcoming Events',
      'calendar.eventTypes': 'Event Types',

      // Reports
      'reports.title': 'Reports',
      'reports.subtitle': 'Analyze recruitment performance and generate insights.',
      'reports.overview': 'Overview',
      'reports.performance': 'Performance',
      'reports.sources': 'Sources',
      'reports.advanced': 'Advanced',
      'reports.exportReport': 'Export Report',
      'reports.dateRange': 'Date Range',

      // Notifications
      'notifications.title': 'Notifications',
      'notifications.subtitle': 'Stay updated with important recruitment activities and system alerts.',
      'notifications.markAllRead': 'Mark All as Read',
      'notifications.filter': 'Filter',
      'notifications.noNotifications': 'No notifications',

      // Settings
      'settings.title': 'Settings',
      'settings.subtitle': 'Manage your account, preferences, and system configuration.',
      'settings.profile': 'Profile',
      'settings.notifications': 'Notifications',
      'settings.appearance': 'Appearance',
      'settings.security': 'Security',
      'settings.integrations': 'Integrations',
      'settings.organization': 'Organization',
      'settings.personalInfo': 'Personal Information',
      'settings.preferences': 'Preferences',
      'settings.language': 'Language',
      'settings.firstName': 'First Name',
      'settings.lastName': 'Last Name',
      'settings.email': 'Email Address',
      'settings.phone': 'Phone Number',
      'settings.jobTitle': 'Job Title',
      'settings.department': 'Department',
      'settings.saveChanges': 'Save Changes',
      'settings.changePhoto': 'Change Photo',
      'settings.remove': 'Remove',
      'settings.exportSettings': 'Export Settings',
      'settings.importSettings': 'Import Settings',

      // Common
      'common.loading': 'Loading...',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.add': 'Add',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.export': 'Export',
      'common.import': 'Import',
      'common.create': 'Create',
      'common.update': 'Update',
      'common.close': 'Close',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.actions': 'Actions',
      'common.details': 'Details',
      'common.view': 'View',
      'common.manage': 'Manage',

      // Company
      'company.name': 'TD CONSULTING',
      'company.tagline': 'Trusted Recruitment Partner',
    },
    vi: {
      // Navigation
      'nav.dashboard': 'Bảng điều khiển',
      'nav.jobs': 'Công việc',
      'nav.candidates': 'Ứng viên',
      'nav.calendar': 'Lịch',
      'nav.email': 'Tự động hóa Email',
      'nav.reports': 'Báo cáo',
      'nav.notifications': 'Thông báo',
      'nav.settings': 'Cài đặt',

      // Header
      'header.search': 'Tìm kiếm ứng viên, công việc...',
      'header.quickAdd': 'Thêm nhanh',
      'header.addJob': 'Thêm công việc',
      'header.addCandidate': 'Thêm ứng viên',
      'header.language': 'Ngôn ngữ',

      // Dashboard
      'dashboard.title': 'Bảng điều khiển',
      'dashboard.subtitle': 'Chào mừng bạn trở lại! Đây là tổng quan về các hoạt động tuyển dụng của bạn.',
      'dashboard.activeJobs': 'Công việc đang tuyển',
      'dashboard.totalCandidates': 'Tổng số ứng viên',
      'dashboard.interviewsThisWeek': 'Phỏng vấn tuần này',
      'dashboard.avgTimeToHire': 'Thời gian tuyển dụng TB',
      'dashboard.totalRevenue': 'Tổng doanh thu',
      'dashboard.recentJobs': 'Công việc gần đây',
      'dashboard.topCandidates': 'Ứng viên hàng đầu',
      'dashboard.recentActivity': 'Hoạt động gần đây',
      'dashboard.viewAll': 'Xem tất cả',

      // Jobs
      'jobs.title': 'Công việc',
      'jobs.subtitle': 'Quản lý tin tuyển dụng, theo dõi đơn ứng tuyển và tiến độ tuyển dụng.',
      'jobs.createJob': 'Tạo công việc',
      'jobs.filterJobs': 'Lọc công việc',
      'jobs.position': 'Vị trí',
      'jobs.department': 'Phòng ban',
      'jobs.applications': 'Đơn ứng tuyển',
      'jobs.status': 'Trạng thái',
      'jobs.deadline': 'Hạn chót',
      'jobs.performance': 'Hiệu suất',
      'jobs.recruiter': 'Nhà tuyển dụng',
      'jobs.location': 'Địa điểm',
      'jobs.priority': 'Độ ưu tiên',

      // Candidates
      'candidates.title': 'Ứng viên',
      'candidates.subtitle': 'Quản lý hồ sơ ứng viên, theo dõi tiến độ và lập lịch phỏng vấn.',
      'candidates.addCandidate': 'Thêm ứng viên',
      'candidates.moreFilters': 'Bộ lọc khác',
      'candidates.name': 'Tên',
      'candidates.position': 'Vị trí',
      'candidates.stage': 'Giai đoạn',
      'candidates.rating': 'Đánh giá',
      'candidates.appliedDate': 'Ngày ứng tuyển',
      'candidates.source': 'Nguồn',

      // Email Automation
      'email.title': 'Tự động hóa Email',
      'email.subtitle': 'Quản lý mẫu email, quy trình làm việc và tự động hóa giao tiếp với ứng viên.',
      'email.newWorkflow': 'Quy trình mới',
      'email.newTemplate': 'Mẫu mới',
      'email.activeTemplates': 'Mẫu đang hoạt động',
      'email.emailsSent': 'Email đã gửi (30 ngày)',
      'email.avgOpenRate': 'Tỷ lệ mở TB',
      'email.activeWorkflows': 'Quy trình đang hoạt động',
      'email.templates': 'Mẫu Email',
      'email.workflows': 'Quy trình tự động',
      'email.analytics': 'Phân tích',
      'email.settings': 'Cài đặt',

      // Calendar
      'calendar.title': 'Lịch',
      'calendar.subtitle': 'Lập lịch phỏng vấn, cuộc họp và theo dõi tất cả các cuộc hẹn của bạn.',
      'calendar.scheduleEvent': 'Lập lịch sự kiện',
      'calendar.filterEvents': 'Lọc sự kiện',
      'calendar.month': 'Tháng',
      'calendar.week': 'Tuần',
      'calendar.day': 'Ngày',
      'calendar.todaySchedule': 'Lịch hôm nay',
      'calendar.upcomingEvents': 'Sự kiện sắp tới',
      'calendar.eventTypes': 'Loại sự kiện',

      // Reports
      'reports.title': 'Báo cáo',
      'reports.subtitle': 'Phân tích hiệu suất tuyển dụng và tạo ra những thông tin chi tiết.',
      'reports.overview': 'Tổng quan',
      'reports.performance': 'Hiệu suất',
      'reports.sources': 'Nguồn',
      'reports.advanced': 'Nâng cao',
      'reports.exportReport': 'Xuất báo cáo',
      'reports.dateRange': 'Khoảng thời gian',

      // Notifications
      'notifications.title': 'Thông báo',
      'notifications.subtitle': 'Cập nhật các hoạt động tuyển dụng quan trọng và cảnh báo hệ thống.',
      'notifications.markAllRead': 'Đánh dấu tất cả đã đọc',
      'notifications.filter': 'Lọc',
      'notifications.noNotifications': 'Không có thông báo',

      // Settings
      'settings.title': 'Cài đặt',
      'settings.subtitle': 'Quản lý tài khoản, tùy chọn và cấu hình hệ thống của bạn.',
      'settings.profile': 'Hồ sơ',
      'settings.notifications': 'Thông báo',
      'settings.appearance': 'Giao diện',
      'settings.security': 'Bảo mật',
      'settings.integrations': 'Tích hợp',
      'settings.organization': 'Tổ chức',
      'settings.personalInfo': 'Thông tin cá nhân',
      'settings.preferences': 'Tùy chọn',
      'settings.language': 'Ngôn ngữ',
      'settings.firstName': 'Tên',
      'settings.lastName': 'Họ',
      'settings.email': 'Địa chỉ Email',
      'settings.phone': 'Số điện thoại',
      'settings.jobTitle': 'Chức vụ',
      'settings.department': 'Phòng ban',
      'settings.saveChanges': 'Lưu thay đổi',
      'settings.changePhoto': 'Đổi ảnh',
      'settings.remove': 'Xóa',
      'settings.exportSettings': 'Xuất cài đặt',
      'settings.importSettings': 'Nhập cài đặt',

      // Common
      'common.loading': 'Đang tải...',
      'common.save': 'Lưu',
      'common.cancel': 'Hủy',
      'common.edit': 'Sửa',
      'common.delete': 'Xóa',
      'common.add': 'Thêm',
      'common.search': 'Tìm kiếm',
      'common.filter': 'Lọc',
      'common.export': 'Xuất',
      'common.import': 'Nhập',
      'common.create': 'Tạo',
      'common.update': 'Cập nhật',
      'common.close': 'Đóng',
      'common.back': 'Quay lại',
      'common.next': 'Tiếp theo',
      'common.previous': 'Trước đó',
      'common.yes': 'Có',
      'common.no': 'Không',
      'common.actions': 'Hành động',
      'common.details': 'Chi tiết',
      'common.view': 'Xem',
      'common.manage': 'Quản lý',

      // Company
      'company.name': 'TD CONSULTING',
      'company.tagline': 'Đối tác Tuyển dụng Đáng tin cậy',
    },
    zh: {
      'nav.dashboard': '仪表板',
      'nav.jobs': '职位',
      'nav.candidates': '候选人',
      'nav.calendar': '日历',
      'nav.email': '邮件自动化',
      'nav.reports': '报告',
      'nav.notifications': '通知',
      'nav.settings': '设置',
      'company.name': 'TD CONSULTING',
      'company.tagline': '值得���赖的招聘合作伙伴',
    },
    ja: {
      'nav.dashboard': 'ダッシュボード',
      'nav.jobs': '求人',
      'nav.candidates': '候補者',
      'nav.calendar': 'カレンダー',
      'nav.email': 'メール自動化',
      'nav.reports': 'レポート',
      'nav.notifications': '通知',
      'nav.settings': '設定',
      'company.name': 'TD CONSULTING',
      'company.tagline': '信頼できる採用パートナー',
    },
    ko: {
      'nav.dashboard': '대시보드',
      'nav.jobs': '채용',
      'nav.candidates': '후보자',
      'nav.calendar': '캘린더',
      'nav.email': '이메일 자동화',
      'nav.reports': '보고서',
      'nav.notifications': '알림',
      'nav.settings': '설정',
      'company.name': 'TD CONSULTING',
      'company.tagline': '신뢰할 수 있는 채용 파트너',
    },
    th: {
      'nav.dashboard': 'แดชบอร์ด',
      'nav.jobs': 'งาน',
      'nav.candidates': 'ผู้สมัคร',
      'nav.calendar': 'ปฏิทิน',
      'nav.email': 'ระบบอีเมลอัตโนมัติ',
      'nav.reports': 'รายงาน',
      'nav.notifications': 'การแจ้งเตือน',
      'nav.settings': 'การตั้งค่า',
      'company.name': 'TD CONSULTING',
      'company.tagline': 'พันธมิตรการสรรหาที่เชื่อถือได้',
    },
    fr: {
      'nav.dashboard': 'Tableau de bord',
      'nav.jobs': 'Emplois',
      'nav.candidates': 'Candidats',
      'nav.calendar': 'Calendrier',
      'nav.email': 'Automatisation Email',
      'nav.reports': 'Rapports',
      'nav.notifications': 'Notifications',
      'nav.settings': 'Paramètres',
      'company.name': 'TD CONSULTING',
      'company.tagline': 'Partenaire de recrutement de confiance',
    },
    es: {
      'nav.dashboard': 'Panel de control',
      'nav.jobs': 'Trabajos',
      'nav.candidates': 'Candidatos',
      'nav.calendar': 'Calendario',
      'nav.email': 'Automatización de correo',
      'nav.reports': 'Informes',
      'nav.notifications': 'Notificaciones',
      'nav.settings': 'Configuración',
      'company.name': 'TD CONSULTING',
      'company.tagline': 'Socio de reclutamiento confiable',
    },
  };

  return (key: string, fallback?: string) => {
    return translations[language]?.[key] || fallback || key;
  };
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Language) || 'en';
  });

  const t = useTranslations(currentLanguage);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem(STORAGE_KEY, language);
    
    // Update document language
    document.documentElement.lang = language;
  };

  const getCurrentLanguageInfo = (): LanguageOption => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t, 
      getCurrentLanguageInfo 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
