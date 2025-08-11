const { spawn } = require('child_process');
const mongoose = require('mongoose');
const path = require('path');
const Prediction = require('../models/Prediction');

// --- START: AI-Powered Remedy Functions with a Single, Structured Call ---

const askGemini = async (prompt, expectJson = false) => {
    console.log(`--- Asking Gemini: "${prompt.substring(0, 50)}..." ---`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

    try {
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        
        if (expectJson) {
            payload.generationConfig = { responseMimeType: "application/json" };
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("!!! FATAL ERROR: Gemini API key is missing from .env file.");
            return null;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("!!! GEMINI API ERROR !!!", JSON.stringify(errorBody, null, 2));
            return null;
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) {
            console.log("--- Gemini responded successfully. ---");
            return result.candidates[0].content.parts[0].text;
        }
        return null;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error("!!! GEMINI API call timed out after 20 seconds.");
        } else {
            console.error("!!! NETWORK ERROR calling Gemini API:", error);
        }
        return null;
    }
};

const getSimpleRemedy = async (diseaseName) => {
    const prompt = `Provide a very brief, one-sentence remedy suggestion for the plant disease: ${diseaseName.replace(/_/g, ' ')}.`;
    const result = await askGemini(prompt);
    return result || "No summary found. Click 'View Treatment Plan' for details.";
};

const getRemedyDetails = async (req, res) => {
    const { diseaseName } = req.body;
    if (!diseaseName) return res.status(400).json({ message: 'Disease name is required.' });

    try {
        const formattedName = diseaseName.replace(/_/g, ' ');
        const prompt = `For the plant disease "${formattedName}", provide a simple treatment plan. Give the output as a single, valid JSON object with three keys: "medicineName" (a string with a common chemical or organic medicine name), "howToUse" (a string explaining how to apply the medicine), and "steps" (an array of 3-4 short, actionable string steps for overcoming the disease). Do not include any text or markdown formatting before or after the JSON object.`;
        
        const remedyJson = await askGemini(prompt, true);

        if (remedyJson) {
            res.json(JSON.parse(remedyJson));
        } else {
            throw new Error("Received null response from Gemini");
        }
    } catch (error) {
        console.error("Error in getRemedyDetails:", error);
        res.status(500).json({ message: 'Failed to fetch remedy details from AI.' });
    }
};

// --- END: AI-Powered Remedy Functions ---


const predictDisease = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
    const imagePath = req.file.path;
    
    // Use 'python3' for Render's Linux environment
    const pythonProcess = spawn('python3', ['model/predict.py', imagePath]);

    let predictionResult = '';
    pythonProcess.stdout.on('data', (data) => { predictionResult += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { console.error(`Python Script Error: ${data}`); });
    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            console.error("Prediction script exited with non-zero code:", code);
            return res.status(500).json({ message: 'Prediction script failed to execute.' });
        }
        const diseaseName = predictionResult.trim();
        if (!diseaseName) {
            return res.status(500).json({ message: 'Failed to get a valid prediction from the model.' });
        }
        
        const remedy = await getSimpleRemedy(diseaseName);
        
        // Correctly format the image URL for storage
        const imageUrl = `/uploads/${path.basename(imagePath)}`;
        
        const newPrediction = new Prediction({ user: req.user._id, diseaseName, imageUrl, remedy });
        await newPrediction.save();
        res.status(200).json(newPrediction);
    });
};

const getHistory = async (req, res) => {
    try {
        const history = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('!!! DATABASE ERROR in getHistory:', error);
        res.status(500).json({ message: 'Server error while fetching prediction history.' });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await Prediction.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$diseaseName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { disease: '$_id', count: 1, _id: 0 } }
        ]);
        res.json(stats);
    } catch (error) {
        console.error('!!! DATABASE ERROR in getStats:', error);
        res.status(500).json({ message: 'Server error while fetching statistics.' });
    }
};

const deletePredictions = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid request: "ids" must be an array.' });
    }
    try {
        await Prediction.deleteMany({ _id: { $in: ids }, user: req.user._id });
        res.json({ message: 'Selected predictions deleted successfully.' });
    } catch (error) {
        console.error('!!! DATABASE ERROR in deletePredictions:', error);
        res.status(500).json({ message: 'Server error while deleting predictions.' });
    }
};

const getWeeklyActivity = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const activity = await Prediction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    createdAt: { $gte: sevenDaysAgo, $lte: today }
                }
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    isHealthy: { $regexMatch: { input: "$diseaseName", regex: /healthy/i } }
                }
            },
            {
                $group: {
                    _id: "$date",
                    healthy: { $sum: { $cond: ["$isHealthy", 1, 0] } },
                    diseased: { $sum: { $cond: ["$isHealthy", 0, 1] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        const dateMap = new Map();
        for(let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            dateMap.set(dateString, { date: d.toLocaleString('en-us', { weekday: 'short' }), healthy: 0, diseased: 0 });
        }

        activity.forEach(item => {
            if (dateMap.has(item._id)) {
                dateMap.set(item._id, { ...dateMap.get(item._id), healthy: item.healthy, diseased: item.diseased });
            }
        });
        
        res.json(Array.from(dateMap.values()).reverse());
    } catch (error) {
        console.error('!!! DATABASE ERROR in getWeeklyActivity:', error);
        res.status(500).json({ message: 'Server error while fetching activity.' });
    }
};

module.exports = {
    predictDisease,
    getHistory,
    getStats,
    deletePredictions,
    getRemedyDetails,
    getWeeklyActivity
};
