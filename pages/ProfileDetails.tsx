import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, InputGroup, Chip } from '../components/UI';
import { BRANCHES, YEARS, BRANCH_DATA, DEFAULT_SKILLS, DEFAULT_INTERESTS } from '../constants';
import { UserProfile } from '../types';
import { ArrowLeft } from 'lucide-react';

export const ProfileDetails = () => {
  const { profile, updateProfile } = useStudent();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSettings = location.state?.fromSettings;

  const [localProfile, setLocalProfile] = useState<Partial<UserProfile>>({
    branch: profile.branch || '',
    year: profile.year || '',
    currentSkills: profile.currentSkills || [],
    interests: profile.interests || [],
    careerGoal: profile.careerGoal || '',
    extraInfo: profile.extraInfo || '',
  });

  const [availableSkills, setAvailableSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [availableInterests, setAvailableInterests] = useState<string[]>(DEFAULT_INTERESTS);

  useEffect(() => {
    if (localProfile.branch && BRANCH_DATA[localProfile.branch]) {
      setAvailableSkills(BRANCH_DATA[localProfile.branch].skills);
      setAvailableInterests(BRANCH_DATA[localProfile.branch].interests);
    } else {
      setAvailableSkills(DEFAULT_SKILLS);
      setAvailableInterests(DEFAULT_INTERESTS);
    }
  }, [localProfile.branch]);

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  const handleNext = () => {
    if (!localProfile.branch || !localProfile.year || !localProfile.careerGoal) {
      alert("Please fill in the required fields.");
      return;
    }
    updateProfile(localProfile);
    if (fromSettings) {
      navigate('/dashboard');
    } else {
      navigate('/resume');
    }
  };

  return (
    <div className="min-h-screen bg-sage-bg dark:bg-sage-darkBg p-6 flex justify-center transition-colors">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          {fromSettings && (
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-sage-navy dark:text-sage-darkText" />
            </button>
          )}
          <div>
             <h1 className="text-3xl font-bold text-sage-navy dark:text-white">
               {fromSettings ? 'Edit Profile' : 'Tell us about yourself'}
             </h1>
             <p className="text-sage-navy/70 dark:text-gray-400">
               {fromSettings ? 'Update your academic details and goals.' : 'We need these details to personalize your career roadmap.'}
             </p>
          </div>
        </div>
        
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InputGroup label="Branch/Major">
              <select 
                className="w-full px-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue outline-none bg-white dark:bg-slate-700 text-sage-navy dark:text-white transition-colors"
                value={localProfile.branch}
                onChange={e => setLocalProfile({...localProfile, branch: e.target.value})}
              >
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </InputGroup>

            <InputGroup label="Current Year">
              <select 
                className="w-full px-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue outline-none bg-white dark:bg-slate-700 text-sage-navy dark:text-white transition-colors"
                value={localProfile.year}
                onChange={e => setLocalProfile({...localProfile, year: e.target.value})}
              >
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </InputGroup>
          </div>

          <InputGroup label="Skills you already know">
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <Chip 
                  key={skill} 
                  label={skill} 
                  selected={localProfile.currentSkills?.includes(skill)}
                  onClick={() => setLocalProfile(prev => ({ ...prev, currentSkills: toggleItem(prev.currentSkills || [], skill) }))}
                />
              ))}
            </div>
          </InputGroup>

          <InputGroup label="Areas of Interest">
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                <Chip 
                  key={interest} 
                  label={interest} 
                  selected={localProfile.interests?.includes(interest)}
                  onClick={() => setLocalProfile(prev => ({ ...prev, interests: toggleItem(prev.interests || [], interest) }))}
                />
              ))}
            </div>
          </InputGroup>

          <InputGroup label="Primary Career Goal">
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue outline-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
              placeholder="e.g., Frontend Developer at a Tech Startup"
              value={localProfile.careerGoal}
              onChange={e => setLocalProfile({...localProfile, careerGoal: e.target.value})}
            />
          </InputGroup>

          <InputGroup label="Any other skills or specific aims? (Optional)">
            <textarea 
              rows={3}
              className="w-full px-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue outline-none resize-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
              placeholder="I also know basic C++ and want to work in Fintech..."
              value={localProfile.extraInfo}
              onChange={e => setLocalProfile({...localProfile, extraInfo: e.target.value})}
            />
          </InputGroup>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleNext}>
            {fromSettings ? 'Save & Return' : 'Next: Add Experience'}
          </Button>
        </div>
      </div>
    </div>
  );
};