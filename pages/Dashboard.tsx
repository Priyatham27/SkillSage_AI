
import React, { useState, useMemo } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from 'recharts';
import { 
  LayoutDashboard, Map, Layers, BookOpen, Settings, Bell, 
  Search, ExternalLink, Zap, AlertCircle, CheckCircle, Lock, TrendingUp, X, ArrowRight, PlayCircle, Moon, Sun,
  Clock, Star, Video, Book, MonitorPlay
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { BRANCH_NEWS } from '../constants';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-sage-blue text-white shadow-lg shadow-sage-blue/20 dark:shadow-none transform scale-105' : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </div>
);

const CircularProgress = ({ value, label }: { value: number; label: string }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
  
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
           {/* Drop shadow filter */}
           <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
             <defs>
               <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#1C6E8C" />
                 <stop offset="100%" stopColor="#274156" />
               </linearGradient>
             </defs>
            <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#E5E7EB" strokeWidth="10" className="dark:stroke-gray-700" />
            <circle 
              cx="80" cy="80" r={radius} 
              fill="transparent" 
              stroke="url(#circleGradient)" 
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold text-sage-navy dark:text-white">{value}%</span>
          </div>
        </div>
        <span className="mt-4 font-bold text-sage-blue bg-sage-blue/10 dark:bg-sage-blue/20 px-4 py-1.5 rounded-full text-sm uppercase tracking-wide border border-sage-blue/20">{label}</span>
      </div>
    );
};

// Helper for platform icons
const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <Video className="w-4 h-4" />;
  if (p.includes('mdn') || p.includes('docs') || p.includes('book')) return <Book className="w-4 h-4" />;
  return <MonitorPlay className="w-4 h-4" />;
};

// Helper for difficulty colors
const DifficultyBadge = ({ level }: { level: string }) => {
  let colorClass = "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  if (level === 'Beginner') colorClass = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
  if (level === 'Intermediate') colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
  if (level === 'Advanced') colorClass = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${colorClass}`}>
      {level}
    </span>
  );
};

export const Dashboard = () => {
  const { profile, dashboardData, logout, theme, toggleTheme } = useStudent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'skills' | 'courses' | 'settings'>('dashboard');
  const [activeCourseTab, setActiveCourseTab] = useState<'free' | 'paid'>('free');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  
  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Roadmap Modal State
  const [selectedRoadmapStep, setSelectedRoadmapStep] = useState<any | null>(null);

  // Load Notifications based on branch
  const notifications = useMemo(() => {
    const news = BRANCH_NEWS[profile.branch] || BRANCH_NEWS['Computer Science'];
    return news;
  }, [profile.branch]);

  // Handle Search Logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0 && activeTab !== 'skills' && activeTab !== 'courses') {
      setActiveTab('skills');
    }
  };

  const filteredSkills = useMemo(() => {
    if (!dashboardData) return { existing: [], missing: [] };
    const query = searchQuery.toLowerCase();
    return {
      existing: dashboardData.existingSkills.filter(s => s.toLowerCase().includes(query)),
      missing: dashboardData.missingSkills.filter(s => s.toLowerCase().includes(query))
    };
  }, [dashboardData, searchQuery]);

  // Handle Skill Click Redirection
  const handleSkillClick = (skillName: string) => {
    setSearchQuery(skillName);
    setActiveTab('courses');
    setActiveCourseTab('free'); // or paid, default to free
    setDifficultyFilter('All');
  };

  // Start Learning Path Handler
  const handleStartPath = () => {
    if (selectedRoadmapStep) {
        // Extract key terms from description for searching (remove Phase X, common words)
        const text = selectedRoadmapStep.description;
        // Simple extraction: take the first 3-4 significant words
        const keywords = text.split(/,|\.| /)
            .filter((w: string) => w.length > 3 && !['Learn', 'Understand', 'Basic', 'Advanced', 'Introduction'].includes(w))
            .slice(0, 3)
            .join(' ');
            
        setSearchQuery(keywords || selectedRoadmapStep.step);
    }
    setSelectedRoadmapStep(null);
    setActiveTab('courses');
    setDifficultyFilter('All');
  };

  // Filter Courses based on search query and difficulty
  const filteredCourses = useMemo(() => {
      if (!dashboardData) return [];
      let courses = dashboardData.courses[activeCourseTab];
      
      // Filter by difficulty
      if (difficultyFilter !== 'All') {
        courses = courses.filter(c => c.difficulty === difficultyFilter);
      }

      if (!searchQuery) return courses;
      
      const lowerQuery = searchQuery.toLowerCase();
      // Fuzzy match: check if ANY word in query exists in title or platform
      const queryWords = lowerQuery.split(' ').filter(w => w.length > 2);
      
      if (queryWords.length === 0) return courses;

      return courses.filter(c => {
          const title = c.title.toLowerCase();
          const platform = c.platform.toLowerCase();
          return queryWords.some(word => title.includes(word) || platform.includes(word));
      });
  }, [dashboardData, activeCourseTab, searchQuery, difficultyFilter]);


  if (!dashboardData) return <div className="min-h-screen flex items-center justify-center text-sage-navy dark:text-white text-xl font-medium bg-sage-bg dark:bg-sage-darkBg">Loading Dashboard...</div>;

  const Greeting = () => (
    <div className="mb-2">
      <h2 className="text-2xl font-bold text-sage-navy dark:text-white">Good Morning, {profile.name}</h2>
      <p className="text-sage-navy/60 dark:text-gray-400 text-sm">Here is your personalized career snapshot.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-sage-bg dark:bg-sage-darkBg overflow-hidden transition-colors">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-sage-navy dark:bg-slate-900 hidden md:flex flex-col p-6 shadow-2xl z-20 transition-colors">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-sage-blue rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">SkillSage AI</h1>
        </div>
        
        <nav className="space-y-3 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Map} label="Roadmap" active={activeTab === 'roadmap'} onClick={() => setActiveTab('roadmap')} />
          <SidebarItem icon={Layers} label="Skills & Gaps" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
          <SidebarItem icon={BookOpen} label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-blue to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{profile.name}</p>
              <p className="text-white/50 text-xs truncate">{profile.branch}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#F4F6F9] dark:bg-[#0B1120] transition-colors">
        {/* Header */}
        <header className="sticky top-0 bg-white/90 dark:bg-sage-darkCard/90 backdrop-blur-md border-b border-sage-gray/20 dark:border-white/10 px-8 py-4 flex justify-between items-center z-10 shadow-sm transition-colors">
          <Greeting />
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-sage-gray dark:text-gray-400 group-focus-within:text-sage-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search skills or courses..." 
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 pr-4 py-2 border border-sage-gray/50 dark:border-gray-600 rounded-full text-sm outline-none focus:border-sage-blue focus:ring-2 focus:ring-sage-blue/20 bg-gray-50 dark:bg-slate-700 text-sage-navy dark:text-white w-64 transition-all" 
              />
            </div>
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full transition-colors relative ${isNotificationsOpen ? 'bg-sage-blue/10 text-sage-blue' : 'text-sage-navy/70 dark:text-gray-300 hover:bg-sage-blue/10 hover:text-sage-blue'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-sage-darkCard"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-sage-darkCard rounded-xl shadow-2xl border border-sage-gray/20 dark:border-white/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-sage-gray/10 dark:border-white/5 bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
                    <h4 className="font-bold text-sage-navy dark:text-white text-sm">Notifications</h4>
                    <span className="text-xs text-sage-blue font-medium bg-sage-blue/10 px-2 py-0.5 rounded-full">
                      {profile.branch} News
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((note, idx) => (
                      <div key={idx} className="px-4 py-3 border-b border-sage-gray/10 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${note.type === 'alert' ? 'bg-orange-500' : 'bg-sage-blue'}`}></div>
                          <div>
                            <p className="text-sm font-medium text-sage-navy dark:text-gray-200 leading-snug group-hover:text-sage-blue transition-colors">{note.title}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{note.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center border-t border-sage-gray/10 dark:border-white/5">
                    <button className="text-xs font-bold text-sage-blue hover:underline">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* Top Row: Readiness, Target Role, AI Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Readiness Gauge */}
                <Card className="flex flex-col items-center justify-center py-6 shadow-sm border border-sage-gray/20 dark:border-white/10">
                  <h3 className="text-lg font-bold text-sage-navy dark:text-white mb-4">Overall Readiness</h3>
                  <CircularProgress value={dashboardData.readinessScore} label={dashboardData.readinessLabel} />
                </Card>

                {/* 2. Target Role Stats - IMPROVED VISIBILITY */}
                <Card className="bg-sage-navy dark:bg-slate-800 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-sage-navy/20 dark:shadow-none">
                     <div className="absolute right-0 top-0 opacity-5 transform translate-x-8 -translate-y-8">
                        <Zap className="w-48 h-48 text-white" />
                     </div>
                     <div>
                       <h4 className="text-sage-blue text-xs font-bold uppercase tracking-widest mb-2 opacity-100">Target Career Role</h4>
                       <p className="text-3xl font-bold leading-tight mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sage-blue drop-shadow-sm filter">
                         {dashboardData.targetRole}
                       </p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                       <div>
                         <h4 className="text-gray-300 text-xs mb-1 font-medium">Skill Match</h4>
                         <p className="text-2xl font-bold text-cyan-400">{dashboardData.skillMatch}%</p>
                       </div>
                       <div>
                         <h4 className="text-gray-300 text-xs mb-1 font-medium">Est. Time</h4>
                         <p className="text-xl font-bold text-white">{dashboardData.timeToReady}</p>
                       </div>
                     </div>
                </Card>

                {/* 3. AI Suggestions */}
                <Card className="border-l-4 border-sage-blue flex flex-col shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-sage-blue/10 rounded-lg">
                      <Zap className="w-4 h-4 text-sage-blue" />
                    </div>
                    <h3 className="font-bold text-sage-navy dark:text-white">AI Suggestions</h3>
                  </div>
                  <ul className="space-y-4 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                    {dashboardData.aiSuggestions.map((sug, i) => (
                      <li key={i} className="text-sm text-sage-navy/80 dark:text-gray-300 flex gap-3 items-start group">
                        <span className="text-sage-blue font-bold text-lg leading-none mt-0.5 group-hover:scale-125 transition-transform">•</span>
                        <span className="leading-snug font-medium">{sug}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Middle Row: Charts & Roadmap */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Horizontal Bar Chart for Skills & Progression */}
                <div className="lg:col-span-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                      <Card className="h-full min-h-[350px] flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-sage-navy dark:text-white">Skill Mastery</h3>
                        </div>
                        {/* Scrollable Chart Container */}
                        <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar">
                           <div style={{ height: Math.max(300, dashboardData.skillMastery.length * 50) }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                  layout="vertical"
                                  data={dashboardData.skillMastery} 
                                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                  <XAxis type="number" domain={[0, 100]} hide />
                                  <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    tick={({ x, y, payload }) => (
                                      <text x={x} y={y} dy={4} textAnchor="end" fill={theme === 'dark' ? '#cbd5e1' : '#274156'} fontSize={11} fontWeight={600}>
                                        {payload.value}
                                      </text>
                                    )}
                                    width={80}
                                    axisLine={false} 
                                    tickLine={false} 
                                  />
                                  <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#1E293B', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                  />
                                  <Bar dataKey="score" fill="#1C6E8C" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                      </Card>

                      {/* Progression Line Chart */}
                      <Card className="h-full min-h-[350px]">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-lg font-bold text-sage-navy dark:text-white flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-sage-blue" />
                             Progress Trend
                           </h3>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                              <XAxis dataKey="week" tick={{fill: theme === 'dark' ? '#cbd5e1' : '#274156', fontSize: 10}} axisLine={false} tickLine={false} dy={10} />
                              <YAxis domain={[0, 100]} tick={{fill: theme === 'dark' ? '#cbd5e1' : '#274156', fontSize: 10}} axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: theme === 'dark' ? '#0F172A' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#1C6E8C" 
                                strokeWidth={3} 
                                dot={{r: 4, fill: '#1C6E8C', strokeWidth: 2, stroke: '#fff'}} 
                                activeDot={{r: 6, strokeWidth: 0}}
                                isAnimationActive={true}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                   </div>
                </div>

                {/* Roadmap List */}
                <div className="lg:col-span-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-sage-navy dark:text-white">Next Steps</h3>
                    <button onClick={() => setActiveTab('roadmap')} className="text-sm text-sage-blue font-bold hover:underline">View All</button>
                  </div>
                  <Card className="h-full overflow-hidden">
                    <div className="relative border-l-2 border-sage-gray/30 dark:border-gray-700 ml-3 space-y-8 py-2">
                      {dashboardData.roadmap.slice(0, 4).map((step, idx) => (
                        <div 
                          key={idx} 
                          className="relative pl-8 group cursor-pointer"
                          onClick={() => setSelectedRoadmapStep(step)}
                        >
                          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                            step.status === 'completed' ? 'bg-sage-blue border-sage-blue scale-110' :
                            step.status === 'in-progress' ? 'bg-white dark:bg-slate-800 border-sage-blue animate-pulse' :
                            'bg-white dark:bg-slate-800 border-sage-gray dark:border-gray-600'
                          }`}></div>
                          <h4 className={`font-bold text-sm transition-colors ${step.status === 'locked' ? 'text-sage-gray dark:text-gray-500' : 'text-sage-navy dark:text-white group-hover:text-sage-blue'}`}>
                            {step.step}
                          </h4>
                          <p className="text-xs text-sage-navy/60 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{step.description}</p>
                          <span className="text-[10px] text-sage-blue opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 font-bold">Click to start</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

              </div>
            </>
          )}

          {/* ROADMAP VIEW */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
               <h3 className="text-2xl font-bold text-sage-navy dark:text-white">Your Detailed Learning Path</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.roadmap.map((step, idx) => (
                    <Card 
                      key={idx} 
                      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group ${step.status === 'locked' ? 'opacity-70 grayscale-[0.5]' : ''}`}
                      onClick={() => setSelectedRoadmapStep(step)}
                    >
                       <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                             step.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                             step.status === 'in-progress' ? 'bg-sage-blue/10 text-sage-blue dark:bg-sage-blue/20 dark:text-blue-300' :
                             'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                          }`}>
                             {step.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                              step.status === 'locked' ? <Lock className="w-5 h-5" /> :
                              <Zap className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between">
                                <h4 className="text-lg font-bold text-sage-navy dark:text-white group-hover:text-sage-blue transition-colors">{step.step}</h4>
                                <ArrowRight className="w-5 h-5 text-sage-gray dark:text-gray-500 group-hover:text-sage-blue opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                             </div>
                             <p className="text-sage-navy/80 dark:text-gray-300 mt-1 mb-3 leading-relaxed">{step.description}</p>
                             <div className="flex gap-2">
                                <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                                  step.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  step.status === 'in-progress' ? 'bg-blue-100 text-sage-blue dark:bg-blue-900/30 dark:text-blue-300' :
                                  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {step.status}
                                </span>
                             </div>
                          </div>
                       </div>
                    </Card>
                  ))}
               </div>
            </div>
          )}

          {/* SKILLS VIEW with Search Highlight */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-sage-navy dark:text-white">Skill Gap Analysis</h3>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-sage-blue font-medium hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Existing Skills */}
                 <Card className="min-h-[200px]">
                    <div className="flex items-center gap-3 mb-6">
                       <CheckCircle className="w-6 h-6 text-green-500" />
                       <h4 className="text-xl font-bold text-sage-navy dark:text-white">Skills You Have</h4>
                    </div>
                    {filteredSkills.existing.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {filteredSkills.existing.map(s => (
                          <span key={s} className="px-4 py-2 bg-sage-blue text-white rounded-full font-medium shadow-sm transition-transform hover:scale-105 cursor-default">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sage-navy/50 dark:text-gray-500 italic">No matching skills found.</p>
                    )}
                 </Card>

                 {/* Missing Skills */}
                 <Card className="min-h-[200px]">
                    <div className="flex items-center gap-3 mb-6">
                       <AlertCircle className="w-6 h-6 text-orange-500" />
                       <h4 className="text-xl font-bold text-sage-navy dark:text-white">Skills to Develop</h4>
                    </div>
                    {filteredSkills.missing.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {filteredSkills.missing.map(s => (
                          <button 
                            key={s} 
                            onClick={() => handleSkillClick(s)}
                            title="Click to find courses"
                            className="px-4 py-2 border-2 border-sage-navy dark:border-gray-500 text-sage-navy dark:text-gray-300 rounded-full font-bold shadow-sm hover:bg-sage-navy hover:text-white dark:hover:bg-gray-700 dark:hover:text-white transition-all cursor-pointer"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sage-navy/50 dark:text-gray-500 italic">No matching skills found.</p>
                    )}
                 </Card>
              </div>
            </div>
          )}

          {/* COURSES VIEW */}
          {activeTab === 'courses' && (
             <div className="space-y-8">
               
               {/* Courses Header & Filters */}
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-sage-navy dark:text-white">Recommended Courses</h3>
                        {searchQuery && (
                            <span className="text-sm bg-sage-blue/10 dark:bg-sage-blue/20 text-sage-blue px-3 py-1 rounded-full border border-sage-blue/20 flex items-center gap-2">
                                Filter: {searchQuery}
                                <button onClick={() => setSearchQuery('')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                     </div>
                     
                     <div className="flex bg-white dark:bg-sage-darkCard rounded-lg p-1.5 border border-sage-gray/30 dark:border-white/10 shadow-sm">
                        {(['free', 'paid'] as const).map(type => (
                           <button 
                             key={type}
                             onClick={() => setActiveCourseTab(type)}
                             className={`px-6 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                               activeCourseTab === type 
                                 ? 'bg-sage-navy text-white shadow-md' 
                                 : 'text-sage-navy/60 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                             }`}
                           >
                             {type} Courses
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Difficulty Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <span className="text-sm font-semibold text-sage-navy/70 dark:text-gray-400 mr-2">Level:</span>
                    {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                       <button
                         key={level}
                         onClick={() => setDifficultyFilter(level)}
                         className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                           difficultyFilter === level 
                             ? 'bg-sage-blue text-white border-sage-blue' 
                             : 'bg-white dark:bg-sage-darkCard text-sage-navy dark:text-gray-300 border-sage-gray/30 dark:border-gray-600 hover:border-sage-blue'
                         }`}
                       >
                         {level}
                       </button>
                    ))}
                  </div>
               </div>

               {/* Course Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => (
                  <Card key={idx} className="hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-sage-blue/20 dark:hover:border-sage-blue/40 flex flex-col h-full relative overflow-hidden">
                     {/* Top Badge Row */}
                     <div className="flex justify-between items-start mb-4 relative z-10">
                       <div className="flex gap-2">
                         <span className="text-[10px] font-bold text-white bg-sage-navy/80 px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                           <PlatformIcon platform={course.platform} />
                           {course.platform}
                         </span>
                         <DifficultyBadge level={course.difficulty || 'Beginner'} />
                       </div>
                     </div>
                     
                     <div className="flex-1">
                       <h4 className="font-bold text-lg text-sage-navy dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-sage-blue transition-colors">
                         {course.title}
                       </h4>
                       <p className="text-sm text-sage-navy/60 dark:text-gray-400 line-clamp-2 mb-4">
                         {course.description}
                       </p>
                       
                       <div className="flex items-center gap-4 text-xs font-medium text-sage-navy/50 dark:text-gray-500 mb-6">
                          <div className="flex items-center gap-1">
                             <Clock className="w-3.5 h-3.5" />
                             {course.duration}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                             <Star className="w-3.5 h-3.5 fill-current" />
                             {course.rating}
                          </div>
                       </div>
                     </div>

                     <a 
                       href={course.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="mt-auto block w-full py-2.5 bg-gray-50 dark:bg-slate-700 hover:bg-sage-blue hover:text-white dark:hover:bg-sage-blue rounded-lg text-sm font-bold text-sage-navy dark:text-gray-300 transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-md"
                     >
                       Start Learning <ExternalLink className="w-3.5 h-3.5" />
                     </a>
                  </Card>
                )) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-sage-gray/20 dark:border-white/5 rounded-2xl bg-white/50 dark:bg-sage-darkCard/50">
                        <div className="p-4 bg-sage-gray/10 dark:bg-white/5 rounded-full mb-4">
                           <Search className="w-8 h-8 text-sage-gray dark:text-gray-500" />
                        </div>
                        <h4 className="text-lg font-bold text-sage-navy dark:text-white mb-1">No courses found</h4>
                        <p className="text-sage-navy/60 dark:text-gray-400 max-w-sm">
                          We couldn't find matches for "{searchQuery}" with the selected filters.
                        </p>
                        <button 
                          onClick={() => { setSearchQuery(''); setDifficultyFilter('All'); }}
                          className="mt-4 text-sage-blue font-bold hover:underline"
                        >
                          Clear all filters
                        </button>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
               <h3 className="text-2xl font-bold text-sage-navy dark:text-white mb-6">Account Settings</h3>
               <Card>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-sage-gray/20 dark:border-white/10">
                     <div>
                       <h5 className="font-bold text-lg text-sage-navy dark:text-white">Theme Preference</h5>
                       <p className="text-sm text-sage-navy/60 dark:text-gray-400 mt-1">Switch between light and dark mode.</p>
                     </div>
                     <button 
                       onClick={toggleTheme}
                       className="flex items-center gap-2 px-4 py-2 border border-sage-gray dark:border-gray-600 text-sage-navy dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                     >
                       {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                       {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                     </button>
                   </div>
                   <div className="flex justify-between items-center pb-6 border-b border-sage-gray/20 dark:border-white/10">
                     <div>
                       <h5 className="font-bold text-lg text-sage-navy dark:text-white">Profile Details</h5>
                       <p className="text-sm text-sage-navy/60 dark:text-gray-400 mt-1">Update your branch, year, and career goals.</p>
                     </div>
                     <button 
                       onClick={() => navigate('/profile', { state: { fromSettings: true } })}
                       className="px-4 py-2 border border-sage-blue text-sage-blue rounded-lg font-medium hover:bg-sage-blue hover:text-white transition-colors"
                     >
                       Edit Profile
                     </button>
                   </div>
                   <div className="flex justify-between items-center pb-6 border-b border-sage-gray/20 dark:border-white/10">
                     <div>
                       <h5 className="font-bold text-lg text-sage-navy dark:text-white">Resume Data</h5>
                       <p className="text-sm text-sage-navy/60 dark:text-gray-400 mt-1">Re-upload or paste new resume text for analysis.</p>
                     </div>
                     <button 
                       onClick={() => navigate('/resume', { state: { fromSettings: true } })}
                       className="px-4 py-2 border border-sage-blue text-sage-blue rounded-lg font-medium hover:bg-sage-blue hover:text-white transition-colors"
                     >
                       Update Resume
                     </button>
                   </div>
                   <div className="pt-2 flex justify-end">
                     <button onClick={logout} className="text-red-500 font-bold hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors">
                       Sign Out
                     </button>
                   </div>
                 </div>
               </Card>
            </div>
          )}

        </div>

        {/* Learning Path Detail Modal */}
        {selectedRoadmapStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-sage-darkCard rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-sage-navy dark:bg-slate-900 p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Learning Path: {selectedRoadmapStep.step}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wide ${
                     selectedRoadmapStep.status === 'completed' ? 'bg-green-500 text-white' :
                     selectedRoadmapStep.status === 'in-progress' ? 'bg-sage-blue text-white' :
                     'bg-white/20 text-white'
                  }`}>
                    {selectedRoadmapStep.status}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedRoadmapStep(null)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                 <h4 className="font-bold text-sage-navy dark:text-white mb-2">Description</h4>
                 <p className="text-sage-navy/70 dark:text-gray-300 leading-relaxed mb-6">
                   {selectedRoadmapStep.description}. This module is crucial for building the foundational knowledge required for your target role of {dashboardData.targetRole}.
                 </p>
                 
                 <div className="bg-sage-bg dark:bg-slate-800 p-4 rounded-xl mb-6 border border-sage-gray/30 dark:border-white/5">
                    <h5 className="font-bold text-sm text-sage-navy dark:text-white mb-3">Key Objectives</h5>
                    <ul className="space-y-2">
                       <li className="flex gap-2 text-sm text-sage-navy/80 dark:text-gray-300">
                         <CheckCircle className="w-4 h-4 text-sage-blue mt-0.5" />
                         <span>Master core concepts and terminology</span>
                       </li>
                       <li className="flex gap-2 text-sm text-sage-navy/80 dark:text-gray-300">
                         <CheckCircle className="w-4 h-4 text-sage-blue mt-0.5" />
                         <span>Complete hands-on practice exercises</span>
                       </li>
                       <li className="flex gap-2 text-sm text-sage-navy/80 dark:text-gray-300">
                         <CheckCircle className="w-4 h-4 text-sage-blue mt-0.5" />
                         <span>Apply knowledge to a small mini-project</span>
                       </li>
                    </ul>
                 </div>

                 <Button className="w-full flex items-center justify-center gap-2" onClick={handleStartPath}>
                   <PlayCircle className="w-5 h-5" />
                   Start Path & View Courses
                 </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
