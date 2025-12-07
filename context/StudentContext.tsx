import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentContextType, UserProfile, DashboardData, Question } from '../types';
import { getAiRecommendations, generateAssessmentQuestions } from '../services/mockAiService';

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  branch: '',
  year: '',
  currentSkills: [],
  interests: [],
  careerGoal: '',
  extraInfo: '',
  resumeText: '',
  psychometricAnswers: {},
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: React.PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (name: string, email: string) => {
    setProfile((prev) => ({ ...prev, name, email }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setProfile(defaultProfile);
    setDashboardData(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await getAiRecommendations(profile);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to generate recommendations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async (): Promise<Question[]> => {
    setIsLoading(true);
    try {
      return await generateAssessmentQuestions(profile);
    } catch (error) {
      console.error("Failed to generate questions", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      profile, 
      updateProfile, 
      dashboardData, 
      generateRecommendations,
      generateQuestions,
      isLoading,
      theme,
      toggleTheme
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};