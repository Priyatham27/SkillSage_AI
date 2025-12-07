import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { FileText, Upload, CheckCircle, ArrowLeft } from 'lucide-react';

export const ResumePage = () => {
  const { updateProfile, profile } = useStudent();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSettings = location.state?.fromSettings;

  const [resumeText, setResumeText] = useState(profile.resumeText || '');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In a real app, we'd parse the PDF/Doc here.
      if (!resumeText) {
        setResumeText(`[Extracted from ${file.name}] Experience in JavaScript, HTML, CSS...`);
      }
    }
  };

  const handleNext = () => {
    updateProfile({ resumeText });
    if (fromSettings) {
      navigate('/dashboard');
    } else {
      navigate('/psychometric');
    }
  };

  return (
    <div className="min-h-screen bg-sage-bg dark:bg-sage-darkBg p-6 flex justify-center transition-colors">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          {fromSettings && (
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-sage-navy dark:text-sage-darkText" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-sage-navy dark:text-white">
              {fromSettings ? 'Update Experience' : 'Add your experience'}
            </h1>
            <p className="text-sage-navy/70 dark:text-gray-400">Upload your resume or paste your experience to help AI understand your background.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Option 1: Upload */}
          <div className="relative group h-full">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
            />
            <Card className={`h-full flex flex-col items-center justify-center border-2 border-dashed transition-colors min-h-[300px] ${fileName ? 'border-sage-blue bg-sage-blue/5 dark:bg-sage-blue/10' : 'border-sage-gray dark:border-gray-600 group-hover:border-sage-blue'}`}>
              {fileName ? (
                <>
                  <CheckCircle className="w-16 h-16 text-sage-blue mb-4" />
                  <p className="font-bold text-lg text-sage-navy dark:text-white">{fileName}</p>
                  <p className="text-sm text-sage-navy/60 dark:text-gray-400">Click to change file</p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-sage-gray dark:text-gray-500 mb-4 group-hover:text-sage-blue transition-colors" />
                  <p className="font-bold text-lg text-sage-navy dark:text-white">Upload Resume</p>
                  <p className="text-sm text-sage-navy/60 dark:text-gray-400">PDF, DOC, DOCX</p>
                </>
              )}
            </Card>
          </div>

          {/* Option 2: Paste */}
          <Card className="h-full flex flex-col p-0 overflow-hidden border-0 shadow-lg min-h-[300px]">
            <div className="bg-sage-navy dark:bg-slate-900 p-4 flex items-center gap-2 text-white border-b border-white/10">
              <FileText className="w-5 h-5" />
              <span className="font-semibold text-sm">Paste Text</span>
            </div>
            <textarea 
              className="flex-1 w-full h-96 p-4 bg-sage-navy dark:bg-slate-900 text-white placeholder-white/40 resize-none focus:outline-none text-sm font-mono leading-relaxed custom-scrollbar"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
            />
          </Card>
        </div>

        <div className="flex justify-between items-center">
          {!fromSettings && (
            <button onClick={() => navigate('/profile')} className="text-sage-navy/60 dark:text-gray-400 hover:text-sage-navy dark:hover:text-white font-medium">
              Back
            </button>
          )}
          <div className={fromSettings ? "w-full flex justify-end" : ""}>
            <Button onClick={handleNext}>
              {fromSettings ? 'Save & Return' : 'Next: Psychometric Test'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};