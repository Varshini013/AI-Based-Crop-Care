CropCare: AI-Powered Crop Disease Monitoring System

CropCare is a comprehensive, full-stack solution designed to empower farmers with instant, actionable insights into crop health. By combining Computer Vision (CNN), Generative AI (Gemini), and Geospatial Mapping, CropCare moves beyond simple diagnosis to provide a complete "Diagnosis-to-Cure" workflow.

🌿 The Problem Statement

Traditional crop management relies on manual scouting, often leading to late disease detection and misdiagnosis. This results in:

Massive Yield Loss: Delayed action allows diseases to spread uncontrollably.

Economic Instability: High costs for broad-spectrum pesticides and expert consultations.

Environmental Impact: Excessive chemical use due to lack of targeted treatment.

CropCare solves this by providing an instant, 24/7 AI agronomist in the pocket of every farmer.

🚀 Key Features

🔍 1. Instant AI Diagnosis

Upload or capture live photos of crop leaves.

High-accuracy classification using a optimized TensorFlow Lite CNN model.

Support for 38 distinct crop categories and diseases.

💊 2. AI-Powered Treatment Plans (Gemini API)

Leverages Large Language Models to generate structured treatment protocols.

Provides specific medicine recommendations, application methods, and preventative steps.

Structured Output: Automatically parses AI responses into readable UI cards.

📊 3. Health Analytics Dashboard

Interactive data visualization using Recharts.

Tracks historical scanning patterns (Healthy vs. Diseased).

Provides a summary of total farm health metrics.

📍 4. Geospatial Store Locator

Centers on the user's GPS location using Leaflet.js.

Queries the OpenStreetMap (Overpass API) to find real-world agricultural supply stores nearby.

🔐 5. Secure User Management

Full authentication system with JWT (JSON Web Tokens).

Password hashing via Bcrypt.js.

Personalized history and profile management.

🛠️ Tech Stack

Frontend

Framework: React.js

Styling: Tailwind CSS (Responsive Design)

State Management: React Hooks (useState, useEffect)

Visuals: Recharts, Lucide Icons, React Leaflet

Backend

Environment: Node.js & Express.js

Database: MongoDB (Atlas)

Integration: Python Child Processes for AI inference

Security: JWT, Bcrypt, CORS, Dotenv

Machine Learning

Library: TensorFlow / Keras

Architecture: Convolutional Neural Network (CNN)

Optimization: Adam Optimizer, Categorical Cross-Entropy

Accuracy: 86% on 70,000+ images (New Plant Diseases Dataset)

Deployment Format: .tflite (TensorFlow Lite)

🧠 Machine Learning Details

The system uses a Sequential CNN architecture designed to extract spatial features from leaf images.

Component

Detail

Model

Convolutional Neural Network (CNN)

Optimizer

Adam

Loss Function

Categorical Cross-Entropy

Input Shape

224x224 RGB

Classes

38 (Disease + Healthy)

💻 Installation & Setup

Prerequisites

Node.js (v16+)

Python (3.8+)

MongoDB Atlas Account

Gemini API Key

Steps

Clone the repository

git clone [https://github.com/yourusername/CropCare-Monitor.git](https://github.com/yourusername/CropCare-Monitor.git)
cd CropCare-Monitor


Backend Setup

cd server
npm install
pip install -r requirements.txt
# Create a .env file and add your MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
npm start


Frontend Setup

cd client
npm install
# Create a .env file and add REACT_APP_BACKEND_URL
npm start


🌐 Deployment

This project is architected for cloud deployment on Render.

Backend: Deployed as a Web Service running Node and Python.

Frontend: Deployed as a Static Site.

Database: Hosted on MongoDB Atlas.

👤 Author

Varshini Gajula Full-Stack AI Developer LinkedIn Profile | Portfolio

