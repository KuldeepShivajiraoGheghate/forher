from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional, Any
import uuid
from datetime import datetime, timezone
import random
from emergentintegrations.llm.chat import LlmChat, UserMessage

##
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
##

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# mongo_url = os.environ['MONGO_URL']
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]
##
mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("DB_NAME")

if not mongo_url or not db_name:
    raise RuntimeError("MONGO_URL or DB_NAME not set")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]
##

app = FastAPI()
api_router = APIRouter(prefix="/api")

EMERGENT_KEY = os.environ.get('EMERGENT_LLM_KEY')

class QuestionnaireInput(BaseModel):
    work_hours_per_day: int
    sleep_hours: float
    work_from_home: bool
    commute_time_minutes: int
    night_shifts: bool
    flexible_hours: bool
    workload_level: int  # 1-10
    deadline_pressure: int  # 1-10
    manager_support: int  # 1-10
    team_support: int  # 1-10
    career_growth: int  # 1-10
    work_life_balance: int  # 1-10
    stress_level: int  # 1-10
    anxiety_frequency: str  # rarely, sometimes, often, always
    burnout_feeling: str  # none, mild, moderate, severe
    physical_symptoms: List[str]  # headache, fatigue, insomnia, etc
    family_responsibilities: str  # low, medium, high
    social_support: str  # poor, fair, good, excellent
    hobbies_time: str  # none, rare, occasional, regular
    exercise_frequency: str  # none, 1-2/week, 3-4/week, daily
    workplace_bias_experienced: bool
    posh_awareness: bool
    safety_concerns: str  # none, minor, moderate, major
    age_group: str
    years_in_it: int
    current_role: str
    city: str

class DayPlan(BaseModel):
    day: int
    sleep_goal: str
    breaks: str
    habit: str
    boundary: str
    message: str

class Resource(BaseModel):
    title: str
    type: str
    contact: str
    why: str

class AssessmentResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    stress_level: str
    stress_score: int
    burnout_risk: str
    burnout_score: int
    safety_risk: str
    key_stressors: List[str]
    quick_summary: str
    explanation: str
    daily_plan: List[DayPlan]
    flex_suggestions: List[str]
    email_to_manager: str
    email_to_hr: str
    safety_tips: List[str]
    resources: List[Resource]
    warnings: List[str]

def simulate_prediction(questionnaire: QuestionnaireInput) -> Dict[str, Any]:
    """Simulate ML prediction based on questionnaire inputs"""
    
    # Calculate stress score (0-100)
    stress_factors = [
        (questionnaire.work_hours_per_day - 8) * 5,  # Extra hours
        (8 - questionnaire.sleep_hours) * 8,  # Sleep deficit
        questionnaire.commute_time_minutes / 3,
        questionnaire.workload_level * 5,
        questionnaire.deadline_pressure * 4,
        (10 - questionnaire.manager_support) * 3,
        (10 - questionnaire.work_life_balance) * 4,
        questionnaire.stress_level * 4
    ]
    
    stress_score = min(100, max(0, int(sum(stress_factors))))
    
    # Calculate burnout score
    burnout_factors = [
        stress_score * 0.3,
        (10 - questionnaire.career_growth) * 3,
        (10 - questionnaire.team_support) * 2,
        {"always": 25, "often": 15, "sometimes": 8, "rarely": 2}.get(questionnaire.anxiety_frequency, 0),
        {"severe": 30, "moderate": 20, "mild": 10, "none": 0}.get(questionnaire.burnout_feeling, 0),
        len(questionnaire.physical_symptoms) * 5,
        {"high": 15, "medium": 8, "low": 3}.get(questionnaire.family_responsibilities, 0)
    ]
    
    burnout_score = min(100, max(0, int(sum(burnout_factors))))
    
    # Safety risk
    safety_factors = [
        20 if questionnaire.night_shifts else 0,
        min(15, questionnaire.commute_time_minutes / 4),
        {"major": 25, "moderate": 15, "minor": 8, "none": 0}.get(questionnaire.safety_concerns, 0),
        10 if questionnaire.workplace_bias_experienced else 0
    ]
    
    safety_score = min(100, max(0, int(sum(safety_factors))))
    
    return {
        "stress_score": stress_score,
        "stress_level": "high" if stress_score > 65 else "medium" if stress_score > 35 else "low",
        "burnout_score": burnout_score,
        "burnout_risk": "high" if burnout_score > 65 else "medium" if burnout_score > 35 else "low",
        "safety_score": safety_score,
        "safety_risk": "high" if safety_score > 50 else "medium" if safety_score > 25 else "low"
    }

def extract_key_stressors(questionnaire: QuestionnaireInput, prediction: Dict) -> List[str]:
    """Extract key stressors from questionnaire"""
    stressors = []
    
    if questionnaire.work_hours_per_day > 9:
        stressors.append(f"Long work hours ({questionnaire.work_hours_per_day}h/day)")
    
    if questionnaire.sleep_hours < 6:
        stressors.append(f"Insufficient sleep ({questionnaire.sleep_hours}h)")
    
    if questionnaire.workload_level >= 7:
        stressors.append("High workload")
    
    if questionnaire.deadline_pressure >= 7:
        stressors.append("High deadline pressure")
    
    if questionnaire.manager_support <= 4:
        stressors.append("Low manager support")
    
    if questionnaire.work_life_balance <= 4:
        stressors.append("Poor work-life balance")
    
    if questionnaire.commute_time_minutes > 60:
        stressors.append(f"Long commute ({questionnaire.commute_time_minutes} min)")
    
    if questionnaire.night_shifts:
        stressors.append("Night shift work")
    
    if questionnaire.workplace_bias_experienced:
        stressors.append("Workplace bias/discrimination")
    
    if questionnaire.family_responsibilities == "high":
        stressors.append("High family responsibilities")
    
    if len(questionnaire.physical_symptoms) > 2:
        stressors.append(f"Multiple physical symptoms ({', '.join(questionnaire.physical_symptoms[:3])})")
    
    return stressors[:7]  # Top 7 stressors

async def generate_empathy_response(prediction: Dict, stressors: List[str], questionnaire: QuestionnaireInput) -> Dict[str, str]:
    """Generate empathetic explanation using AI"""
    
    chat = LlmChat(
        api_key=EMERGENT_KEY,
        session_id=f"empathy_{uuid.uuid4()}",
        system_message="You are an empathetic mental health support assistant for women in IT. Provide supportive, non-judgmental responses. Never diagnose. Use words like 'may', 'could', 'might'."
    ).with_model("openai", "gpt-5.2")
    
    prompt = f"""A woman working in IT has these results:
- Stress level: {prediction['stress_level']} ({prediction['stress_score']}/100)
- Burnout risk: {prediction['burnout_risk']} ({prediction['burnout_score']}/100)

Key stressors: {', '.join(stressors)}

Provide a warm, supportive explanation in 3 parts:
1. What this means (2-3 sentences)
2. Why this may be happening (based on stressors, 2-3 sentences)
3. Reassurance and hope (2-3 sentences)

Keep it conversational, supportive, and empowering. Address challenges women in IT face."""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    return {
        "explanation": response,
        "quick_summary": f"Your stress level is {prediction['stress_level']} and burnout risk is {prediction['burnout_risk']}. The main contributors are {', '.join(stressors[:3])}."
    }

async def generate_daily_plan(prediction: Dict, stressors: List[str], questionnaire: QuestionnaireInput) -> List[DayPlan]:
    """Generate 7-day personalized plan"""
    
    chat = LlmChat(
        api_key=EMERGENT_KEY,
        session_id=f"plan_{uuid.uuid4()}",
        system_message="You are a work-life balance coach for women in IT. Create practical, achievable daily plans."
    ).with_model("openai", "gpt-5.2")
    
    prompt = f"""Create a 7-day work-life balance plan for a woman in IT with:
- Stress: {prediction['stress_level']}
- Burnout risk: {prediction['burnout_risk']}
- Current sleep: {questionnaire.sleep_hours}h
- Work hours: {questionnaire.work_hours_per_day}h
- Key issues: {', '.join(stressors[:3])}

For each day (1-7), provide in this EXACT format:
Day X:
Sleep Goal: [specific hours and time]
Breaks: [specific break schedule]
Habit: [one 2-minute micro-habit]
Boundary: [one work boundary to set]
Message: [encouraging message]

Make it progressive - start small on day 1, build up."""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    # Parse response into structured format
    plan = []
    days_text = response.split('Day ')
    for i, day_text in enumerate(days_text[1:8], 1):
        lines = day_text.strip().split('\n')
        plan.append(DayPlan(
            day=i,
            sleep_goal=lines[1].replace('Sleep Goal:', '').strip() if len(lines) > 1 else f"{int(questionnaire.sleep_hours) + 1} hours",
            breaks=lines[2].replace('Breaks:', '').strip() if len(lines) > 2 else "Take a 5-min break every hour",
            habit=lines[3].replace('Habit:', '').strip() if len(lines) > 3 else "Deep breathing for 2 minutes",
            boundary=lines[4].replace('Boundary:', '').strip() if len(lines) > 4 else "No emails after 7 PM",
            message=lines[5].replace('Message:', '').strip() if len(lines) > 5 else "You've got this!"
        ))
    
    return plan

async def generate_workplace_suggestions(prediction: Dict, stressors: List[str], questionnaire: QuestionnaireInput) -> Dict[str, Any]:
    """Generate workplace flexibility suggestions and emails"""
    
    chat = LlmChat(
        api_key=EMERGENT_KEY,
        session_id=f"workplace_{uuid.uuid4()}",
        system_message="You are a professional career advisor helping women in IT negotiate better work conditions."
    ).with_model("openai", "gpt-5.2")
    
    prompt = f"""A woman in IT needs workplace flexibility. Context:
- Work hours: {questionnaire.work_hours_per_day}h/day
- WFH: {questionnaire.work_from_home}
- Flexible hours: {questionnaire.flexible_hours}
- Manager support: {questionnaire.manager_support}/10
- Key issues: {', '.join(stressors)}

Provide:
1. 3-4 flexibility suggestions (WFH, flexible hours, workload adjustment, etc.)
2. Professional email to manager requesting workload adjustment (150 words, polite, confident)
3. Professional email to HR for flexible schedule (150 words, formal)

Format:
FLEXIBILITY SUGGESTIONS:
- [suggestion 1]
- [suggestion 2]

EMAIL TO MANAGER:
[email text]

EMAIL TO HR:
[email text]"""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    # Parse response
    parts = response.split('EMAIL TO MANAGER:')
    suggestions_part = parts[0].replace('FLEXIBILITY SUGGESTIONS:', '').strip()
    suggestions = [s.strip() for s in suggestions_part.split('\n') if s.strip().startswith('-')]
    
    email_parts = parts[1].split('EMAIL TO HR:') if len(parts) > 1 else ['', '']
    email_manager = email_parts[0].strip()
    email_hr = email_parts[1].strip() if len(email_parts) > 1 else ''
    
    return {
        "flex_suggestions": suggestions if suggestions else [
            "Request 2-3 WFH days per week",
            "Propose flexible start/end times",
            "Request workload prioritization meeting",
            "Ask for deadline extensions when needed"
        ],
        "email_to_manager": email_manager if email_manager else "Dear [Manager Name],\n\nI hope this message finds you well. I wanted to discuss my current workload and explore opportunities to optimize my productivity and well-being. Over the past few weeks, I've been managing multiple high-priority projects, and I believe a brief conversation about prioritization would be beneficial.\n\nWould you be available for a short meeting this week? I'm confident we can find a sustainable approach that supports both team goals and individual effectiveness.\n\nThank you for your continued support.\n\nBest regards",
        "email_to_hr": email_hr if email_hr else "Dear HR Team,\n\nI am writing to inquire about flexible work arrangement options available at our organization. Given the nature of my role and personal circumstances, I believe a hybrid work model or flexible hours would significantly enhance my productivity and work-life balance.\n\nI would appreciate the opportunity to discuss available policies and how I might apply for such arrangements. Please let me know the appropriate process and documentation required.\n\nThank you for your time and consideration.\n\nSincerely"
    }

def generate_safety_tips(questionnaire: QuestionnaireInput, safety_risk: str) -> List[str]:
    """Generate safety tips based on work context"""
    tips = []
    
    if questionnaire.night_shifts or questionnaire.commute_time_minutes > 30:
        tips.extend([
            "Share your commute route and timing with a trusted contact",
            "Use tracked cab services or company transport when available",
            "Keep emergency contacts on speed dial (Women Helpline 181, Emergency 112)"
        ])
    
    if questionnaire.workplace_bias_experienced:
        tips.extend([
            "Document any incidents of bias or harassment with dates and details",
            "Know your rights under POSH Act (Prevention of Sexual Harassment)",
            "SHe-Box portal available for POSH complaints: https://shebox.nic.in"
        ])
    
    tips.extend([
        "Keep NCW (National Commission for Women) helpline saved: 7827-170-170",
        "For cyber harassment: Cyber Crime Helpline 1930",
        "Install personal safety apps with SOS features"
    ])
    
    return tips

def get_resources(prediction: Dict, questionnaire: QuestionnaireInput) -> List[Resource]:
    """Get relevant resources including India-specific helplines"""
    resources = [
        Resource(
            title="Women Helpline (24/7)",
            type="emergency",
            contact="181 or 1091",
            why="24/7 support for women in distress"
        ),
        Resource(
            title="National Emergency Number",
            type="emergency",
            contact="112",
            why="Immediate emergency response"
        ),
        Resource(
            title="National Commission for Women (NCW)",
            type="support",
            contact="7827-170-170 or ncw@nic.in",
            why="Support for women's rights and complaints"
        ),
        Resource(
            title="SHe-Box (POSH Complaints)",
            type="workplace",
            contact="https://shebox.nic.in",
            why="Online complaint portal for workplace sexual harassment under POSH Act"
        ),
        Resource(
            title="Cyber Crime Helpline",
            type="cyber_safety",
            contact="1930 or https://cybercrime.gov.in",
            why="Report cyber harassment or online abuse"
        )
    ]
    
    if prediction['stress_level'] in ['medium', 'high'] or prediction['burnout_risk'] in ['medium', 'high']:
        resources.append(Resource(
            title="NIMHANS Mental Health Helpline",
            type="mental_health",
            contact="080-46110007",
            why="Professional mental health support and counseling"
        ))
    
    return resources

@api_router.post("/assessment/analyze", response_model=AssessmentResult)
async def analyze_assessment(questionnaire: QuestionnaireInput):
    """Complete assessment analysis with AI-powered recommendations"""
    
    try:
        # Step 1: Simulate prediction
        prediction = simulate_prediction(questionnaire)
        
        # Step 2: Extract stressors
        stressors = extract_key_stressors(questionnaire, prediction)
        
        # Step 3: Generate empathy response
        empathy = await generate_empathy_response(prediction, stressors, questionnaire)
        
        # Step 4: Generate daily plan
        daily_plan = await generate_daily_plan(prediction, stressors, questionnaire)
        
        # Step 5: Generate workplace suggestions
        workplace = await generate_workplace_suggestions(prediction, stressors, questionnaire)
        
        # Step 6: Generate safety tips
        safety_tips = generate_safety_tips(questionnaire, prediction['safety_risk'])
        
        # Step 7: Get resources
        resources = get_resources(prediction, questionnaire)
        
        # Step 8: Generate warnings if needed
        warnings = []
        if prediction['stress_score'] > 75 or prediction['burnout_score'] > 75:
            warnings.append("Your stress/burnout levels are high. Please consider reaching out to a mental health professional.")
        if prediction['safety_risk'] == 'high':
            warnings.append("Safety concerns detected. Please review safety tips and keep emergency contacts accessible.")
        
        # Create result
        result = AssessmentResult(
            stress_level=prediction['stress_level'],
            stress_score=prediction['stress_score'],
            burnout_risk=prediction['burnout_risk'],
            burnout_score=prediction['burnout_score'],
            safety_risk=prediction['safety_risk'],
            key_stressors=stressors,
            quick_summary=empathy['quick_summary'],
            explanation=empathy['explanation'],
            daily_plan=daily_plan,
            flex_suggestions=workplace['flex_suggestions'],
            email_to_manager=workplace['email_to_manager'],
            email_to_hr=workplace['email_to_hr'],
            safety_tips=safety_tips,
            resources=resources,
            warnings=warnings
        )
        
        # Save to database
        doc = result.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        doc['questionnaire'] = questionnaire.model_dump()
        await db.assessments.insert_one(doc)
        
        return result
        
    except Exception as e:
        logger.error(f"Error in assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")

@api_router.get("/resources")
async def get_all_resources():
    """Get all India-specific resources"""
    return {
        "emergency": [
            {"name": "Women Helpline", "contact": "181", "available": "24/7"},
            {"name": "National Emergency", "contact": "112", "available": "24/7"},
            {"name": "NCW Helpline", "contact": "7827-170-170", "available": "10 AM - 6 PM"}
        ],
        "workplace": [
            {"name": "SHe-Box (POSH)", "url": "https://shebox.nic.in", "type": "Online Portal"},
            {"name": "Labour Ministry Helpline", "contact": "1800-11-1256", "type": "Workplace Rights"}
        ],
        "mental_health": [
            {"name": "NIMHANS", "contact": "080-46110007", "available": "Working hours"},
            {"name": "Vandrevala Foundation", "contact": "9999-666-555", "available": "24/7"}
        ],
        "legal": [
            {"name": "Cyber Crime Portal", "url": "https://cybercrime.gov.in", "contact": "1930"},
            {"name": "NCW Legal Cell", "email": "ncw@nic.in", "type": "Legal Support"}
        ]
    }

@api_router.get("/")
async def root():
    return {"message": "SheHuMaan API - Supporting Women in IT", "status": "active"}

app.include_router(api_router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_credentials=True,
#     allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
##
origins = os.environ.get("CORS_ORIGINS", "*")
origins = origins.split(",") if origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
##
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
