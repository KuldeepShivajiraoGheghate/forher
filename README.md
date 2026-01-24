# 💜 ForHer — AI Work-Life Companion for Women in IT

> **ForHer** is an AI-powered web platform designed to improve the **work-life balance, mental wellness, productivity, and workplace safety** of **women professionals in the IT sector**.  
It combines **predictive analytics (stress & burnout detection)** with **Generative AI (empathetic coaching, planning, and communication support)** to provide practical, personalized, and actionable guidance.

---

## 🌍 Problem Statement

Women working in the IT industry often face:

- Long working hours and meeting overload  
- Sleep imbalance, stress, and anxiety  
- Burnout due to work-life conflicts  
- Safety concerns during late shifts or travel  
- Difficulty negotiating flexible work policies  
- Limited access to structured mental wellness support  

**ForHer addresses these challenges using AI**, offering not just insights but **daily plans, workplace suggestions, safety advice, and ready-to-use professional emails**.

---

## 🎯 Solution Overview

ForHer is a **Generative AI + Predictive Analytics system** that:

- Detects stress and burnout risks  
- Provides empathetic AI-based guidance  
- Generates personalized work-life balance plans  
- Helps users communicate professionally with managers/HR  
- Offers safety and emergency resources tailored for women  

This makes the system **realistic, implementable, and impactful**.

---

## ✨ Key Features

### 📝 1. Smart Work-Life Questionnaire
Users answer a short survey about:
- Work hours and workload  
- Sleep habits  
- Stress and anxiety levels  
- Workplace support  
- Meeting load  
- Late work or travel safety context  

---

### 📊 2. Stress & Burnout Prediction (MVP Logic)
The system predicts:

- **Stress Level:** Low / Medium / High  
- **Burnout Risk:** Low / Medium / High  

🔹 For the MVP, simulated logic proves feasibility  
🔹 Can be upgraded to real ML models using Kaggle datasets

---

### 🤖 3. Empathetic AI Interpretation
Generative AI explains results in a **supportive and human-centered tone**:
- What the results mean  
- Why it might be happening  
- Actionable next steps  

⚠️ *This is guidance, not medical diagnosis.*

---

### 📅 4. Personalized 7-Day Balance Plan
AI generates a realistic weekly plan including:
- Sleep improvement goals  
- Breaks and micro-habits  
- Boundary-setting tips  
- Motivation and confidence messages  

---

### 💼 5. Workplace Flexibility Suggestions
AI suggests:
- Work-from-home options  
- Meeting reductions  
- Schedule adjustments  
- Step-by-step negotiation strategies  

---

### 📩 6. Professional Email Generator
Users can instantly generate ready-to-use emails:

- Email to Manager (workload, meeting reduction, boundaries)  
- Email to HR (flexible working, shift adjustment, policy request)  

📌 Copy → Send → Done

---

### 🛡️ 7. Women Safety & Emergency Guidance
If late work or travel is reported:
- Safe commuting tips  
- Emergency readiness checklist  
- Important helpline reminders  

---

### 📚 8. Resource Recommendation Module (India Focused)

AI recommends trusted support systems:

- Women Helpline **181**  
- Emergency **112**  
- Cyber Crime Helpline **1930**  
- National Commission for Women (NCW)  
- SHe-Box (POSH complaint portal)  
- Mental health & therapy resources  

---

### 📊 9. Interactive Dashboard

The dashboard shows:

- Stress meter & burnout meter  
- Key stress contributors  
- AI recommendations  
- Daily plan cards  
- Email drafts  
- Safety & resources  
- Chat-style AI guidance interface  

---

## 🧠 AI Approach (Emergent AI Prompt Engineering)

ForHer uses structured **Emergent AI prompting techniques**, including:

- Role-based prompting  
- Chain-of-Thought reasoning (internally)  
- Few-shot structured outputs  
- ReAct pattern (Reasoning + Acting)  
- Multi-module AI workflow (agent-like)

This ensures **stable, structured, and actionable outputs** suitable for real UI integration.

---

## 🏗️ System Architecture

| Layer | Technology |
|------|------------|
| **Frontend** | React + Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **AI Layer** | OpenAI GPT-5.2 (via Emergent AI key) |
| **Prediction** | MVP simulation (ML-ready architecture) |
| **Authentication** | Login/Signup with JWT |
| **Data Source** | Kaggle datasets + synthesized data |

---

## 🧪 Feasibility & Demo Strategy

To prove real-world feasibility:

- Sample user profiles (Kaggle/synthesized data) are used  
- Stress predictions and AI insights are demonstrated  
- Multiple user scenarios are shown in the demo  

This validates that the system is **implementable in real workplace environments**.

---

## 🔐 Authentication System

ForHer includes:

- User Signup & Login  
- Secure session handling  
- Protected dashboard access  

This gives the MVP a **real product feel**, not just a prototype.

---

## 🚀 Running the Project Locally

### 🔹 Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

