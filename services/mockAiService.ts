
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, DashboardData, Question } from '../types';
import { MOCK_DASHBOARD_DATA } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dashboardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        overallReadinessPercent: { type: Type.INTEGER },
        readinessLevel: { type: Type.STRING, enum: ["Poor", "Medium", "High", "Excellent"] },
        targetPrimaryRole: { type: Type.STRING },
        estTimeToBecomeJobReady: { type: Type.STRING },
      },
      required: ["overallReadinessPercent", "readinessLevel", "targetPrimaryRole", "estTimeToBecomeJobReady"],
    },
    roles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          whyFit: { type: Type.STRING },
          requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          existingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          roadmapSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          projectIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "whyFit", "requiredSkills", "existingSkills", "missingSkills", "roadmapSteps", "projectIdeas"],
      },
    },
    analytics: {
      type: Type.OBJECT,
      properties: {
        skillMastery: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              percent: { type: Type.INTEGER },
            },
            required: ["skill", "percent"],
          },
        },
        weeklyStudyHoursSuggestion: { type: Type.INTEGER },
      },
      required: ["skillMastery", "weeklyStudyHoursSuggestion"],
    },
    courses: {
      type: Type.OBJECT,
      properties: {
        free: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              title: { type: Type.STRING },
              shortReason: { type: Type.STRING },
              duration: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
              rating: { type: Type.NUMBER },
            },
            required: ["platform", "title", "shortReason", "duration", "difficulty", "rating"],
          },
        },
        paid: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              title: { type: Type.STRING },
              shortReason: { type: Type.STRING },
              duration: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
              rating: { type: Type.NUMBER },
            },
            required: ["platform", "title", "shortReason", "duration", "difficulty", "rating"],
          },
        },
      },
      required: ["free", "paid"],
    },
    aiSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["summary", "roles", "analytics", "courses", "aiSuggestions"],
};

const questionsSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["id", "question", "options"]
  }
};

function generateProgression(currentScore: number) {
  // Generate a slightly randomized realistic progression curve ending at currentScore
  const data = [];
  let score = Math.max(5, currentScore * 0.2); // Start low
  
  for (let i = 1; i <= 4; i++) {
    // Add some random variance to the curve
    const variance = (Math.random() * 10) - 2; 
    score += ((currentScore - score) / (6 - i)) + variance;
    data.push({ week: `Week ${i}`, score: Math.min(Math.round(score), currentScore) });
  }
  
  // Ensure the final week matches the actual current score
  data.push({ week: 'Week 5', score: currentScore });
  return data;
}

export const generateAssessmentQuestions = async (profile: UserProfile): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        responseSchema: questionsSchema,
        systemInstruction: `Generate 6 multiple-choice psychometric/technical questions to assess the student's fit for their career goal. 
        Questions should be a mix of personality (work style, motivation) and basic situational judgment related to their field.`
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: JSON.stringify({
            branch: profile.branch,
            careerGoal: profile.careerGoal,
            resumeSummary: profile.resumeText ? "Has resume" : "No resume",
            interests: profile.interests
          })}]
        }
      ]
    });

    const text = response.text;
    if (!text) return [];
    const questions = JSON.parse(text);
    return questions.slice(0, 6);
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback questions if AI fails
    return [
      { id: 1, question: "How do you prefer to tackle a new problem?", options: ["Research first", "Experiment immediately", "Ask for help"] },
      { id: 2, question: "What motivates you most?", options: ["Recognition", "Learning new things", "Financial reward"] },
      { id: 3, question: "Preferred work environment?", options: ["Structured corporate", "Fast-paced startup", "Freelance/Remote"] },
      { id: 4, question: "When stuck on a bug, you:", options: ["Keep trying", "Take a break", "Consult documentation"] },
      { id: 5, question: "Ideal team role?", options: ["Leader", "Contributor", "Specialist"] },
      { id: 6, question: "Career priority?", options: ["Stability", "Growth", "Impact"] }
    ];
  }
};

export const getAiRecommendations = async (profile: UserProfile): Promise<DashboardData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        responseSchema: dashboardSchema,
        systemInstruction: `You are SkillSage AI. Analyze the student profile and generate a career roadmap.
        1. Calculate 'overallReadinessPercent' based STRICTLY on the overlap between 'currentSkills'/'resumeText' and the 'requiredSkills' for the target role.
        2. Provide exactly 6 to 7 recommendations for FREE courses and 6 to 7 recommendations for PAID courses.
        3. CRITICAL: The courses MUST cover the topics listed in the 'roadmapSteps'.
        4. Include realistic duration (e.g., '10h'), difficulty (Beginner/Intermediate/Advanced), and rating (4.0-5.0).
        5. 'shortReason' should explain why this course helps their roadmap.`,
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: JSON.stringify({
                personal: {
                  name: profile.name,
                  branch: profile.branch,
                  year: profile.year,
                  currentSkills: profile.currentSkills,
                  interests: profile.interests,
                  careerGoal: profile.careerGoal,
                  extraInfo: profile.extraInfo,
                },
                resumeText: profile.resumeText,
                psychometric: profile.psychometricAnswers,
              })
            }
          ]
        }
      ]
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const aiData = JSON.parse(text);

    // Map AI response to DashboardData interface
    const primaryRole = aiData.roles?.[0];
    
    // Generate roadmap objects
    const mappedRoadmap = (primaryRole?.roadmapSteps || []).map((step: string, index: number) => ({
      step: `Phase ${index + 1}`,
      description: step,
      status: index === 0 ? 'completed' : index === 1 ? 'in-progress' : 'locked'
    }));

    // Map courses with Google Search Links and new metadata
    const mapCourses = (courses: any[]) => courses.map((c: any) => ({
      platform: c.platform,
      title: c.title,
      description: c.shortReason || 'Recommended for your learning path',
      duration: c.duration || 'Flexible',
      difficulty: c.difficulty || 'Beginner',
      rating: c.rating || 4.5,
      url: `https://www.google.com/search?q=${encodeURIComponent(c.platform + ' ' + c.title + ' course')}`
    }));

    // Map skill mastery
    const mappedMastery = (aiData.analytics?.skillMastery || []).map((m: any) => ({
      name: m.skill,
      score: m.percent
    }));

    return {
      readinessScore: aiData.summary.overallReadinessPercent,
      readinessLabel: aiData.summary.readinessLevel,
      targetRole: aiData.summary.targetPrimaryRole,
      skillMatch: aiData.summary.overallReadinessPercent,
      timeToReady: aiData.summary.estTimeToBecomeJobReady,
      roadmap: mappedRoadmap.length > 0 ? mappedRoadmap : MOCK_DASHBOARD_DATA.roadmap,
      existingSkills: primaryRole?.existingSkills || [],
      missingSkills: primaryRole?.missingSkills || [],
      skillMastery: mappedMastery,
      progressionData: generateProgression(aiData.summary.overallReadinessPercent),
      courses: {
        free: mapCourses(aiData.courses?.free || []),
        paid: mapCourses(aiData.courses?.paid || [])
      },
      aiSuggestions: aiData.aiSuggestions || []
    } as DashboardData;

  } catch (error) {
    console.error("AI Service Error:", error);
    // Return expanded mock data with new fields if AI fails
    return {
      ...MOCK_DASHBOARD_DATA,
      targetRole: profile.careerGoal || MOCK_DASHBOARD_DATA.targetRole,
      aiSuggestions: ["AI Service Unavailable - Showing Demo Data", ...MOCK_DASHBOARD_DATA.aiSuggestions],
      progressionData: generateProgression(MOCK_DASHBOARD_DATA.readinessScore)
    };
  }
};
