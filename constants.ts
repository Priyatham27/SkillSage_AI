
import { DashboardData } from './types';

export const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Business/MBA'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

export const BRANCH_DATA: Record<string, { skills: string[], interests: string[] }> = {
  'Computer Science': {
    skills: ['Python', 'Java', 'C++', 'Data Structures', 'Algorithms', 'Web Dev', 'Git', 'SQL'],
    interests: ['Software Engineering', 'AI/ML', 'Cybersecurity', 'Game Dev', 'Cloud Computing']
  },
  'Information Technology': {
    skills: ['Java', 'HTML/CSS', 'JavaScript', 'Networking', 'DBMS', 'OS', 'System Design'],
    interests: ['Web Development', 'System Admin', 'Cloud', 'Data Analytics', 'IoT']
  },
  'Electronics': {
    skills: ['C', 'Matlab', 'Verilog', 'Embedded Systems', 'Circuit Design', 'IoT', 'Signal Processing'],
    interests: ['VLSI', 'Embedded Systems', 'Robotics', 'Communication Systems', 'Consumer Electronics']
  },
  'Mechanical': {
    skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Thermodynamics', 'Mechanics', 'Matlab'],
    interests: ['Automotive', 'Robotics', 'Manufacturing', 'Aerospace', 'Thermal Engineering']
  },
  'Civil': {
    skills: ['AutoCAD', 'Revit', 'STAAD Pro', 'Surveying', 'Structural Analysis'],
    interests: ['Structural Eng', 'Urban Planning', 'Construction Mgmt', 'Environmental Eng']
  },
  'Business/MBA': {
    skills: ['Excel', 'Data Analysis', 'Project Management', 'Marketing', 'Finance', 'Communication'],
    interests: ['Product Management', 'Digital Marketing', 'Finance', 'Consulting', 'HR']
  }
};

export const BRANCH_NEWS: Record<string, Array<{title: string, time: string, type: 'news' | 'alert'}>> = {
  'Computer Science': [
    { title: "AI agents are reshaping entry-level software roles", time: "2h ago", type: "news" },
    { title: "GitHub Copilot Workspace is now available for preview", time: "5h ago", type: "news" },
    { title: "Hiring Alert: Demand for Rust developers up by 40%", time: "1d ago", type: "alert" }
  ],
  'Information Technology': [
    { title: "Cloud Security certifications are top priority for 2025", time: "3h ago", type: "news" },
    { title: "New vulnerability found in popular open-source libs", time: "6h ago", type: "alert" },
    { title: "Google updates Data Analytics professional certificate", time: "1d ago", type: "news" }
  ],
  'Electronics': [
    { title: "Semiconductor industry sees 15% growth in Q3", time: "4h ago", type: "news" },
    { title: "New Embedded Rust framework gains popularity", time: "1d ago", type: "news" },
    { title: "Internship season opening for VLSI design roles", time: "2d ago", type: "alert" }
  ],
  'Mechanical': [
    { title: "Tesla announces new automation engineering roles", time: "5h ago", type: "news" },
    { title: "Sustainable manufacturing trends for 2025", time: "1d ago", type: "news" },
    { title: "SolidWorks 2025 features leaked", time: "2d ago", type: "news" }
  ],
  'Civil': [
    { title: "Green Building certification requirements updated", time: "6h ago", type: "alert" },
    { title: "Smart City projects approved in 5 major metros", time: "1d ago", type: "news" },
    { title: "BIM adoption rate increases in public sector", time: "2d ago", type: "news" }
  ],
  'Business/MBA': [
    { title: "Fintech startups raising record seed rounds", time: "3h ago", type: "news" },
    { title: "Marketing trends shifting towards AI-generated content", time: "1d ago", type: "news" },
    { title: "Remote project management tools comparison 2025", time: "2d ago", type: "news" }
  ]
};

export const DEFAULT_SKILLS = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management'];
export const DEFAULT_INTERESTS = ['Technology', 'Management', 'Design', 'Research', 'Entrepreneurship'];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  readinessScore: 68,
  readinessLabel: 'Medium',
  targetRole: 'Full Stack Developer',
  skillMatch: 72,
  timeToReady: '5 Months',
  roadmap: [
    { step: 'Fundamentals', description: 'CS Basics, Algorithms, Git', status: 'completed' },
    { step: 'Core Skills', description: 'Advanced JavaScript, React Patterns', status: 'in-progress' },
    { step: 'Backend & DB', description: 'Node.js APIs, PostgreSQL Schema', status: 'locked' },
    { step: 'Tools & DevOps', description: 'Docker, CI/CD Pipelines', status: 'locked' },
    { step: 'Interview Prep', description: 'System Design, Mock Interviews', status: 'locked' },
  ],
  existingSkills: ['HTML/CSS', 'JavaScript', 'React Basics', 'Git'],
  missingSkills: ['TypeScript', 'GraphQL', 'Docker', 'AWS Lambda'],
  skillMastery: [
    { name: 'Frontend', score: 85 },
    { name: 'Backend', score: 40 },
    { name: 'Database', score: 55 },
    { name: 'DevOps', score: 20 },
    { name: 'Soft Skills', score: 70 },
  ],
  progressionData: [
    { week: 'Week 1', score: 10 },
    { week: 'Week 2', score: 25 },
    { week: 'Week 3', score: 45 },
    { week: 'Week 4', score: 55 },
    { week: 'Week 5', score: 68 },
  ],
  courses: {
    free: [
      { 
        platform: 'YouTube', 
        title: 'React JS Full Course 2024', 
        url: 'https://www.youtube.com/results?search_query=React+JS+Full+Course+2024',
        description: 'Comprehensive guide to modern React hooks and patterns.',
        duration: '12h',
        difficulty: 'Beginner',
        rating: 4.8
      },
      { 
        platform: 'FreeCodeCamp', 
        title: 'JavaScript Algorithms and Data Structures', 
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'Interactive coding challenges to master JS fundamentals.',
        duration: '300h',
        difficulty: 'Intermediate',
        rating: 4.9
      },
      { 
        platform: 'MDN', 
        title: 'Web Docs - Accessibility', 
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
        description: 'Official documentation for building accessible web apps.',
        duration: 'Reading',
        difficulty: 'Intermediate',
        rating: 4.7
      },
    ],
    paid: [
      { 
        platform: 'Udemy', 
        title: 'The Complete 2024 Web Development Bootcamp', 
        url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
        description: 'Full stack mastery from HTML to React and Node.',
        duration: '60h',
        difficulty: 'Beginner',
        rating: 4.7
      },
      { 
        platform: 'Coursera', 
        title: 'Meta Front-End Developer Professional Certificate', 
        url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        description: 'Professional certification designed by Meta engineers.',
        duration: '7 months',
        difficulty: 'Beginner',
        rating: 4.8
      },
    ]
  },
  aiSuggestions: [
    "Focus on building a full-stack project (e.g., E-commerce) to improve your Backend score.",
    "Learn TypeScript immediately; it is highly requested for your target role.",
    "Allocate 30 mins daily for Data Structures & Algorithms to prepare for interviews."
  ]
};
