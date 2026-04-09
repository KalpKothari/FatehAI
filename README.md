# FatehAI

**FatehAI** is a full-stack, AI-powered counselling system that automates student guidance for studying abroad using both conversational chat and real-time voice AI agents.

It transforms raw student inquiries into structured, actionable leads, enabling counsellors to focus only on high-quality, serious students.

---

## Key Features & Functionalities

### AI Chat Counsellor (Conversation-Based)
- Replaces traditional forms with natural conversation
- Asks dynamic, human-like questions
- Understands intent and context
- Maintains conversation memory

**What it does:**
- Collects student information naturally  
- Answers common questions (IELTS, costs, visa, etc.)  
- Personalizes responses based on user input  

---

### Voice AI Agent (Real-Time Calling)
- AI interacts with students via real-time voice calls
- Converts:
  - Speech → Text → AI → Speech
- Fast responses (<3 seconds)

**Key Idea:**
> Voice layer handles communication, backend handles intelligence

---

### Live Call Monitoring (Admin Panel) 
- Admin can **watch conversations LIVE**
- Real-time transcript updates during ongoing calls

**How it works:**
- Voice events → Backend (webhooks)  
- Stored in database  
- Sent instantly to dashboard  

**Tech:**
- Socket.IO / Realtime sync  
- Event-driven architecture  

 **This makes the system feel like a real call center dashboard**

---

### AI Data Extraction (Core Feature)
- Converts conversations into structured student profiles

**Example:**
“I want to study in UK next year”  
→ Country: UK  
→ Timeline: Next Year  

**Extracted Data (12+ fields):**
- Personal: Name, Phone, Email, Location  
- Academic: Education, Field, GPA  
- Preferences: Country, Course, Intake  
- Financial: Budget, Scholarship  
- Test: IELTS/PTE status  
- Timeline  

---

### Smart Lead Scoring System
- Automatically ranks students based on seriousness

**Based on:**
- Interest Level (40%)  
- Budget (30%)  
- Timeline (30%)  

**Categories:**
-  Hot (70–100)  
-  Warm (40–69)  
-  Cold (0–39)  

---

### University Recommendation Engine
- Suggests best-fit universities

**Based on:**
- Country preference  
- Budget  
- IELTS score  
- Academic performance  
- Course matching  

**Key Idea:**
> Uses weighted scoring instead of static suggestions

---

### Admin Dashboard (Control Center)
- Complete control panel for counsellors

**Features:**
- Lead tracking  
- Live conversations  
- Real-time transcript view  
- Lead scoring visibility  
- Student profile insights  
- Filtering & prioritization  

---

### Meeting Scheduling System
- Admin can schedule counselling sessions

**Includes:**
- Date & Time  
- Mode (Online / Offline)  
- Meeting Link  
- Notes  

---

### WhatsApp Automation
- Automatic follow-up messages sent to students
- Triggered after meeting scheduling or key actions

**Benefits:**
- Improves engagement  
- Reduces manual follow-ups  
- Faster communication  

---

### Multi-Language Support
- AI communicates in:
  - English  
  - Hindi  
  - Marathi
  - Gujarati
  - Punjabi 

**Benefit:**
- Better accessibility for diverse users  
- More natural conversations  

---

### Advanced Analytics Dashboard
- Business insights for admins

**Includes:**
- Call volume trends  
- Peak interaction times  
- Common student queries  
- Lead conversion tracking  

**Example:**
> 100 calls → 30 Hot → 10 converted  

---

## Problem Statement

Traditional counselling systems are:
- Manual  
- Slow  
- Not scalable  
- Data is inconsistent  

Students:
- Wait too long  
- Drop off (30–40%)  
- Ask repetitive questions  

---

## Our Solution

FatehAI introduces:
- AI Chat + Voice Counsellor  
- Real-time data extraction  
- Smart lead prioritization  
- Automated engagement  

**Result:**
- Faster responses  
- Better student experience  
- Higher conversion rates  

---

## Tech Stack

| Category | Technology |
|--------|-----------|
| Frontend | React |
| UI | Tailwind CSS |
| Backend | Node.js (Express) |
| Database | MongoDB (Mongoose) |
| AI Layer | LLM APIs |
| Voice | Vapi |
| Real-Time | Socket.IO |

---

## System Architecture

1. Student interacts (Chat / Voice)
2. AI processes input using LLM
3. Data is extracted into structured format
4. Lead score is calculated
5. Data stored in MongoDB
6. Real-time updates sent to admin dashboard

---

## Why FatehAI

- Real-world problem solving  
- AI + Voice integration  
- Live monitoring system  
- Event-driven architecture  
- Scalable full-stack design  
- Hackathon + production ready  

---

## Future Enhancements

- Auto appointment booking (Calendar integration)  
- AI-based document verification   
- CRM integrations  

---

**FatehAI**  
Turning conversations into conversions 
