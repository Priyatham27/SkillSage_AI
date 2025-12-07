import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { Question } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';

export const PsychometricPage = () => {
  const { updateProfile, generateRecommendations, generateQuestions, isLoading: contextLoading } = useStudent();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  const loadQuestions = async () => {
    setIsGenerating(true);
    setAnswers({}); // Reset answers
    const q = await generateQuestions();
    setQuestions(q);
    setIsGenerating(false);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
        if(mounted) await loadQuestions();
    }
    init();
    return () => { mounted = false; };
  }, []);

  const handleOptionSelect = (qId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  const handleFinish = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions to get the best results.");
      return;
    }
    updateProfile({ psychometricAnswers: answers });
    await generateRecommendations();
    navigate('/dashboard');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-sage-bg dark:bg-sage-darkBg flex flex-col items-center justify-center p-6 transition-colors">
        <Loader2 className="w-12 h-12 text-sage-blue animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-sage-navy dark:text-white">Analyzing your profile...</h2>
        <p className="text-sage-navy/60 dark:text-gray-400 mt-2">Generating personalized assessment questions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-bg dark:bg-sage-darkBg p-6 flex justify-center pb-20 transition-colors">
      <div className="w-full max-w-3xl">
        <div className="sticky top-0 bg-sage-bg dark:bg-sage-darkBg z-10 py-4 mb-4 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-sage-navy dark:text-white mb-2">Psychometric Assessment</h1>
              <p className="text-sage-navy/70 dark:text-gray-400">Based on your background, we've curated these questions to find your best path.</p>
            </div>
            <button 
              onClick={loadQuestions}
              disabled={contextLoading}
              className="flex items-center gap-2 text-sm text-sage-blue font-medium hover:underline disabled:opacity-50"
              title="Get different questions"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
          <div className="w-full h-2 bg-sage-gray/30 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-sage-blue transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <Card key={q.id} className="transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-sage-navy dark:text-white mb-4">
                <span className="text-sage-blue mr-2">{index + 1}.</span>
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <label 
                    key={opt} 
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      answers[q.id] === opt 
                        ? 'border-sage-blue bg-sage-blue/5 dark:bg-sage-blue/10 ring-1 ring-sage-blue' 
                        : 'border-sage-gray/50 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      className="w-4 h-4 text-sage-blue focus:ring-sage-blue"
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionSelect(q.id, opt)}
                    />
                    <span className="ml-3 text-sage-navy dark:text-gray-200">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleFinish} isLoading={contextLoading} className="w-full md:w-auto text-lg px-8">
            Generate My Career Path
          </Button>
        </div>
      </div>
    </div>
  );
};