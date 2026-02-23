🌿 CropCare: AI-Powered Agricultural Diagnosis & Monitoring

CropCare is a production-ready, full-stack application designed to revolutionize how farmers manage crop health. By combining Computer Vision, Generative AI, and Geospatial Data, the platform provides an end-to-end "Diagnosis-to-Cure" workflow that identifies 38 different plant conditions and offers instant, actionable treatment plans.

📖 Table of Contents

Project Overview

System Architecture

Key Features

Technical Stack

Machine Learning Deep-Dive

Installation & Local Setup

Environment Variables

Deployment

🌟 Project Overview

Traditional farming suffers from significant yield loss due to delayed disease identification. CropCare provides an instant solution:

Diagnosis: A high-precision CNN model analyzes leaf imagery.

Consultation: Google's Gemini LLM acts as an on-demand agronomist to provide structured remedy plans.

Logistics: Integrated maps locate the physical supplies needed to treat the crop.

🏗 System Architecture

The application follows a modular full-stack architecture with a Python-based AI microservice integrated into the Node.js backend.

[Frontend: React.js] <--> [Backend: Node/Express] <--> [Database: MongoDB Atlas]
                                  |                     |
                                  +--> [Python AI Engine (TFLite)]
                                  +--> [Gemini Generative API]
                                  +--> [OpenStreetMap API]


🚀 Key Features

1. 🔍 Precision Disease Detection

Dual-Mode Input: Supports drag-and-drop file uploads or real-time camera capture.

Edge Inference: Uses a converted .tflite model for low-latency predictions.

High Coverage: Classifies 38 distinct classes including Apple Scab, Tomato Blight, and Healthy categories.

2. 💊 AI-Powered Agronomist (LLM Integration)

Structured Remedies: Utilizes the Gemini 2.5 Flash model to generate structured JSON treatment plans.

Content: Returns specific medicine names, application methods, and preventive maintenance steps.

Professional UI: AI responses are parsed and rendered into intuitive, categorized cards.

3. 📊 Analytical Dashboard

Weekly Activity Tracking: Visualizes scanning trends (Healthy vs. Diseased) using Recharts.

Global Metrics: Real-time counters for total scans and unique diseases detected.

Dynamic Distribution: Pie charts showing the most frequent issues on the user's farm.

4. 📍 Geospatial Utility

Store Locator: Finds nearby agricultural supply stores using the Overpass API.

Interactive Mapping: Built with Leaflet.js, featuring custom map markers and distance filtering.

🛠 Technical Stack

Frontend

Core: React.js (Hooks, Context API)

Visuals: Tailwind CSS, Lucide Icons, Recharts

Mapping: React Leaflet (OpenStreetMap)

Data: Axios, React Dropzone

Backend

Server: Node.js, Express.js

Database: MongoDB Atlas (Mongoose ODM)

Auth: JSON Web Tokens (JWT), Bcrypt.js

Processing: Multer (File uploads), Child Process (Python integration)

Artificial Intelligence

Library: TensorFlow / Keras

Format: TensorFlow Lite (.tflite)

LLM: Google Gemini API (Generative AI)

🧠 Machine Learning Deep-Dive

Model Architecture

The system utilizes a Sequential Convolutional Neural Network (CNN) optimized for feature extraction from plant biology images.

Parameter

Value

Input Shape

224x224 RGB

Optimizer

Adam (Adaptive Moment Estimation)

Loss Function

Categorical Cross-Entropy

Metrics

Accuracy (86% on test set)

Dataset

70,000+ images (New Plant Diseases Dataset)

AI-to-Web Integration

The Node.js server executes an optimized Python script (predict.py) using a child process, passing the image path as a command-line argument and capturing the result from stdout for near-instant web feedback.

💻 Installation & Local Setup

1. Repository Setup

git clone [https://github.com/yourusername/CropCare-Monitor.git](https://github.com/yourusername/CropCare-Monitor.git)
cd CropCare-Monitor


2. Backend & AI Configuration

cd server
npm install
pip install -r requirements.txt
# Create .env and add keys listed below
npm start


3. Frontend Configuration

cd client
npm install
npm start


🔑 Environment Variables

To run this project, you will need to add the following variables to your .env files:

Server (server/.env):

MONGO_URI: Your MongoDB Atlas connection string.

JWT_SECRET: A secret string for token signing.

GEMINI_API_KEY: Your API key from Google AI Studio.

PORT: 5001

Client (client/.env):

REACT_APP_BACKEND_URL: http://localhost:5001 (local) or your Render URL (production).

🌐 Deployment

The project is architected for seamless deployment on Render:

Backend: Deployed as a Web Service (Node/Python environment).

Frontend: Deployed as a Static Site.

Environment Management: All sensitive keys are stored in Render's "Environment Variables" section to ensure zero-exposure security.

👤 Author

Varshini Gajula Full-Stack AI Developer LinkedIn | Portfolio
