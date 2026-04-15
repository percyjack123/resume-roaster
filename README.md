# 🔥 Resume Roaster — AI-Powered Resume Analyzer

An AI-driven full-stack web application that analyzes resumes and generates brutally honest feedback with a score, helping users improve their resumes for better job prospects.

---

## 🚀 Overview

Resume Roaster is a production-style full-stack application built using **Spring Boot** and **React**, integrated with **Google Gemini AI** to provide intelligent resume evaluation.

Users can upload their resumes (PDF), and the system extracts content, analyzes it using AI, and returns structured feedback along with a rating.

---

## 🧠 Key Features

- 📄 Upload resumes in PDF format
- 🤖 AI-powered analysis using Google Gemini API
- 📊 Generates structured feedback with scoring
- 🔥 “Roast-style” feedback for engaging UX
- ⚡ Fast and responsive UI with animations
- 🛠 Clean REST API architecture

---

## 🏗 Tech Stack

### Backend
- Java
- Spring Boot
- REST API
- Apache PDFBox (PDF parsing)

### Frontend
- React (Vite)
- Tailwind CSS

### AI Integration
- Google Gemini API

### Deployment
- Vercel (Frontend)
- Railway (Backend)

---

## ⚙️ How It Works

1. User uploads a resume (PDF)
2. Backend extracts text using PDFBox
3. Extracted content is sent to Gemini API
4. AI generates feedback + score
5. Response is displayed with styled UI

---

## 🔗 Live Demo

https://resume-roaster-git-main-sahithi-jalapartis-projects.vercel.app/

---

## 📦 Installation

### Backend
```bash
cd backend
mvn spring-boot:run
