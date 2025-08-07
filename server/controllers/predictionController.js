const { spawn } = require('child_process');
const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');

// --- START: AI-Powered Remedy Functions with a Single, Structured Call ---

const askGeminiForStructuredRemedy = async (diseaseName) => {
    console.log("Attempting to get structured remedy from Gemini...");
    try {
        const formattedName = diseaseName.replace(/_/g, ' ');
        // This prompt specifically asks for a JSON object with the exact keys we need.
        const prompt = `For the plant disease "${formattedName}", provide a simple treatment plan. Give the output as a single, valid JSON object with three keys: "medicineName" (a string with a common chemical or organic medicine name), "howToUse" (a string explaining how to apply the medicine), and "steps" (an array of 3-4 short, actionable string steps for overcoming the disease). Do not include any text or markdown formatting before or after the JSON object.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { 
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json", // This tells Gemini to only respond with JSON
            }
        };
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("!!! FATAL ERROR: Gemini API key is missing from .env file.");
            return null;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Gemini API request failed with status:", response.status);
            return null;
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) {
            const jsonText = result.candidates[0].content.parts[0].text;
            console.log("--- Gemini Responded with JSON ---");
            // Safely parse the JSON to ensure it's valid
            try {
                return JSON.parse(jsonText);
            } catch (parseError) {
                console.error("!!! FAILED TO PARSE JSON FROM GEMINI:", parseError);
                return null;
            }
        }
        return null;

    } catch (error) {
        console.error("Error calling Gemini for structured remedy:", error);
        return null;
    }
};

const getRemedyDetails = async (req, res) => {
    const { diseaseName } = req.body;
    if (!diseaseName) return res.status(400).json({ message: 'Disease name is required.' });

    try {
        const remedyData = await askGeminiForStructuredRemedy(diseaseName);
        if (remedyData) {
            res.json(remedyData);
        } else {
            // Provide a helpful fallback if the AI fails
            res.status(500).json({
                medicineName: "AI Suggestion Failed",
                howToUse: "The AI could not generate a response. This may be due to a configuration issue or network problem.",
                steps: ["Please verify the GEMINI_API_KEY in your server's .env file.", "Check your server's console for detailed error messages.", "Consult a local agricultural expert for advice."]
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch remedy details from AI.' });
    }
};

// --- END: AI-Powered Remedy Functions ---


const predictDisease = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
    const imagePath = req.file.path;
    const pythonProcess = spawn('python', ['model/predict.py', imagePath]);
    let predictionResult = '';
    pythonProcess.stdout.on('data', (data) => { predictionResult += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { console.error(`Python Script Error: ${data}`); });
    pythonProcess.on('close', async (code) => {
        if (code !== 0) return res.status(500).json({ message: 'Prediction script failed to run.' });
        const diseaseName = predictionResult.trim();
        if (!diseaseName) return res.status(500).json({ message: 'Failed to get a valid prediction.' });
        
        const newPrediction = new Prediction({ user: req.user.id, diseaseName, imageUrl: `/${imagePath}`, remedy: "Click 'View Treatment Plan' for details." });
        await newPrediction.save();
        res.status(200).json(newPrediction);
    });
};

const getHistory = async (req, res) => {
    try {
        // THIS IS THE FIX: Using req.user._id ensures we are querying with a proper ObjectId.
        const history = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('!!! DATABASE ERROR in getHistory:', error);
        res.status(500).json({ message: 'Server error while fetching prediction history.' });
    }
};

const getStats = async (req, res) => {
    try {
        // THIS IS THE FIX: Aggregation queries are stricter and require the ID to be an ObjectId.
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
        await Prediction.deleteMany({
            _id: { $in: ids },
            user: req.user._id // THIS IS THE FIX: Using ObjectId for security.
        });
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
                    user: req.user._id, // THIS IS THE FIX: Using the ObjectId here as well.
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
