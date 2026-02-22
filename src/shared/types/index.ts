// ============================================
// AUTH TYPES
// ============================================

export interface Admin {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  provider: 'local' | 'google';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: Pick<Admin, 'id' | 'email' | 'name' | 'avatarUrl'>;
}

// ============================================
// SITE SETTINGS
// ============================================

export interface SiteSettings {
  id: string;
  siteTitle: string;
  siteTagline: string | null;
  favicon: string | null;
  ogImage: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  portfolioUrl: string | null;
  footerText: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// HERO SECTION
// ============================================

export interface HeroStat {
  label: string;
  value: string;
}

export interface Hero {
  id: string;
  initials: string;
  fullName: string;
  title: string;
  location: string;
  profileImage: string | null;
  gradientFrom: string;
  gradientTo: string;
  stats: HeroStat[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ABOUT SECTION
// ============================================

export interface AboutParagraph {
  id: string;
  text: string;
  order: number;
}

export interface About {
  id: string;
  content: AboutParagraph[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SKILLS SECTION
// ============================================

export interface Skill {
  id: string;
  name: string;
  order: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PROJECTS SECTION
// ============================================

export interface Project {
  id: string;
  title: string;
  description: string;
  details: string | null;
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  techStack: string[];
  featured: boolean;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// EXPERIENCE SECTION
// ============================================

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CONTACT SECTION
// ============================================

export interface ContactSettings {
  id: string;
  heading: string;
  description: string;
  email: string;
  buttonText: string;
  showSubjectField: boolean;
  requireSubject: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}
