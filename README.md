# 🧠 AI-Powered Resume Analyzer

> An intelligent web app that helps you **analyze, improve, and tailor your resume** for specific job descriptions — powered by **Gemini AI** and modern web technologies.

## 🎯 Project Goal

Help users **tailor resumes** for specific job descriptions by:

- 📝 Uploading their **resume** (PDF/DOCX/TXT)  
- 💼 Adding the **job description** for the role they want  
- 🤖 Getting **AI-driven feedback** on what to improve  
- 🔍 Highlighting **missing keywords**, weak sections, and grammar/style issues  
- 💡 Receiving **concrete suggestions** for improvement  
- 💾 Saving multiple resume versions  
- 📥 Downloading the final, improved version

---

## 🚀 Core Features

### 🧩 **MVP**
- 🔐 User Authentication (Signup / Login)
- 📄 Resume Upload (PDF/DOCX/TXT)
- ✍️ Paste or input Job Description text
- 🧠 Keyword-based comparison → show **missing skills** and **relevance score**
- 🎨 Highlight missing items directly inside the resume
- 💬 Suggestions panel for improvements
- 💾 Save multiple resume versions
- 📤 Export final resume to PDF

### 🌱 **Next-Level Features (Future)**
- 🧹 Grammar & style checking (LanguageTool or AI)
- 🪄 AI-powered rewriting (improve bullet points, quantify achievements)
- 🤝 Semantic matching (embeddings for better relevance)
- 🧱 Resume builder templates
- 🕒 Version history + analytics
- 🧍‍♂️ Team collaboration & comment system
- 📱 Mobile-friendly responsive UI

---

## 🛠️ Tech Stack

### **Frontend**
| Tech | Purpose |
|------|----------|
| ⚛️ React + Vite | Frontend framework for a fast & modern UI |
| 🎨 TailwindCSS | Utility-first styling |
| 🔄 Axios | API requests & data fetching |
| 📦 React Hook Form | Form handling |
| 📂 React Dropzone | File upload (drag & drop) |
| 🪶 Framer Motion | Smooth animations |
| 🧾 React Toastify | Alerts & notifications |
| 📊 Chart.js + react-chartjs-2 | Visual analytics (resume score) |
| 🤖 @google/genai | Gemini API for AI text analysis |

---

## 🧭 High-Level Architecture / Flow

1. **User uploads a resume** → Extracts text (PDF/DOCX/TXT).  
2. **User pastes job description** → Extracts key skills & requirements.  
3. **App compares** resume content with JD → identifies missing skills and weak points.  
4. **AI generates suggestions** → grammar, phrasing, structure improvements.  
5. **User applies changes**, saves versions, and downloads improved resume.

📊 The frontend highlights missing areas in the text and shows actionable suggestions in a sidebar.

---

## 🧠 AI Features (Gemini Integration)

- Resume relevance scoring (vs JD)
- Missing skill detection
- Smart rewrite suggestions (“quantify your results”, “improve action verbs”)
- Grammar/style check and readability improvement
- Personalized recommendations based on the job role

> Using [Google Gemini API](https://aistudio.google.com/) — get your API key from AI Studio and store it in `.env` as:
>
> ```env
> VITE_GEMINI_API_KEY=your_gemini_api_key_here
> ```

---

## 🗂️ Project Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer

