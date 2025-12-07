
export interface UserProfile {
  name: string;
  email: string;
  branch: string;
  year: string;
  currentSkills: string[];
  interests: string[];
  careerGoal: string;
  extraInfo: string;
  resumeText: string;
  psychometricAnswers: Record<number, string>;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
}

export interface Course {
  platform: string;
  title: string;
  url: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
}

export interface DashboardData {
  readinessScore: number;
  readinessLabel: 'Poor' | 'Medium' | 'High' | 'Excellent';
  targetRole: string;
  skillMatch: number;
  timeToReady: string; // e.g. "4 months"
  roadmap: Array<{
    step: string;
    description: string;
    status: 'completed' | 'in-progress' | 'locked';
  }>;
  existingSkills: string[];
  missingSkills: string[];
  skillMastery: Array<{ name: string; score: number }>;
  progressionData: Array<{ week: string; score: number }>;
  courses: {
    free: Course[];
    paid: Course[];
  };
  aiSuggestions: string[];
}

export interface Notification {
  id: number;
  title: string;
  time: string;
  type: 'news' | 'alert';
}

export interface StudentContextType {
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  dashboardData: DashboardData | null;
  generateRecommendations: () => Promise<void>;
  generateQuestions: () => Promise<Question[]>;
  isLoading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
