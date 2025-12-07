🌟 SkillSage AI
AI-Powered Skills & Career Recommendation System

Your Personalized Roadmap to a Successful Tech Career

SkillSage AI is a next-generation platform that helps students choose the right tech career, identify skill gaps, and follow a personalized learning roadmap generated using AI.
Built with React.js, Firebase, and Google AI Studio (Gemini), SkillSage AI combines personal data, resume insights, and psychometric analysis into one powerful recommendation engine.

🚀 Features
🔮 AI-Driven Career Recommendation Engine

Analyzes student profile, resume, and psychometric responses

Identifies top 3 best-fit tech careers

Provides personalized explanations: why this career fits you

Generates a 5-step learning roadmap per role

Suggests portfolio-ready project ideas

🧠 Holistic Student Profiling

SkillSage AI builds a 360° understanding of each student using:

Personal Details

Branch, year of study

Skills, interests, career goals

Additional strengths or aims

Resume Analysis

Upload PDF/DOC or paste raw text

Extracts experience, projects, and certifications

Psychometric Test

6–7 curated questions

Evaluates learning style, motivation, personality traits

All of this is merged into a structured JSON → fed into the Gemini model for highly accurate results.

📊 Interactive Analytics Dashboard

A premium, startup-grade dashboard with:

Progress circle (readiness percentage)

Readiness level (Poor / Medium / High / Excellent)

Skill match cards

Skill gap visualization (chips)

Learning roadmap timeline (5-step progression)

Bar chart: skill mastery

Line chart: weekly consistency

AI suggestions card

Designed to help students track growth with clarity.

🎓 Course Recommendations (FREE & PAID)

AI recommends meaningful learning resources:

Free courses (YouTube, freeCodeCamp, Coursera audit, etc.)

Paid courses (Coursera, Udemy, LinkedIn Learning)

Matched directly to the roadmap

No broken URLs — only platform + course title for reliability.

🔐 Authentication with Firebase

Email/password login & signup

Phone number OTP-ready UI

Google login placeholder

Secure routing (Dashboard only accessible when logged in)

🎨 Modern UI (React + Tailwind)

Clean, professional design

Custom color palette

Consistent component system

Sidebar navigation

Fully responsive

Startup-level polish

Color Palette:

#FBFCFF – main background

#D0CCD0 – soft gray

#142229 – primary text

#1C6E8C – accent blue

#274156 – deep navy

🏗 Tech Stack

Frontend:

React.js (Vite)

Tailwind CSS

React Router

Recharts (for graphs)

Backend & Services:

Firebase Authentication

Firebase Firestore

Optionally Firebase Hosting

AI Engine:

Google AI Studio (Gemini)

Custom prompt engineering

Structured JSON output

📁 Folder Structure
/src
  /components
  /pages
  /context (StudentContext)
  /utils
  /assets
firebaseConfig.js
README.md
package.json
tailwind.config.js
vite.config.js

🧠 How It Works (Flow)

1️⃣ Student signs up → logs in
2️⃣ Fills personal details
3️⃣ Uploads/pastes resume
4️⃣ Completes psychometric questions
5️⃣ System sends combined profile → Gemini
6️⃣ AI returns:

Career roles

Skill gaps

5-step roadmap

Analytics

Courses
7️⃣ Dashboard visualizes everything beautifully

🎯 Project Vision

The mission of SkillSage AI is simple:

Help every student choose the right tech career and grow with clarity.

Future Enhancements:

Real-time job market analysis

Internship recommendations

Dynamic psychometric AI interviews

Progress streak gamification

Admin dashboard for colleges
