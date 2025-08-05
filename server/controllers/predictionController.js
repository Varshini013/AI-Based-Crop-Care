const { spawn } = require('child_process');
const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');

// --- START: AI-Powered Remedy Functions (Replaces Web Scraping) ---

const askGemini = async (prompt) => {
    try {
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Gemini API key is missing from .env file.");
            return "API key is not configured. Please contact support.";
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) return null;
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
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
        const [chemical, organic, prevention] = await Promise.all([
            askGemini(`Provide a detailed chemical treatment plan for ${formattedName}.`),
            askGemini(`Provide a detailed organic or biological control plan for ${formattedName}.`),
            askGemini(`Provide a detailed list of preventative measures to avoid ${formattedName} in the future.`)
        ]);
        res.json({
            chemical: chemical || "No specific chemical treatment found. Consult a local agro-store.",
            organic: organic || "No specific organic treatment found. Practices like using neem oil are often recommended.",
            prevention: prevention || "General preventative measures include ensuring good air circulation."
        });
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
        const remedy = await getSimpleRemedy(diseaseName);
        const newPrediction = new Prediction({ user: req.user.id, diseaseName, imageUrl: `/${imagePath}`, remedy });
        await newPrediction.save();
        res.status(200).json(newPrediction);
    });
};

const getHistory = async (req, res) => {
    try {
        // Simple queries like .find() are flexible with the user ID format.
        const history = await Prediction.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error while fetching prediction history.' });
    }
};

const getStats = async (req, res) => {
    try {
        // THIS IS THE FIX: Aggregation queries are stricter and require the ID to be an ObjectId.
        // Using req.user._id (which is an ObjectId) is more reliable than req.user.id (a string).
        const stats = await Prediction.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$diseaseName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { disease: '$_id', count: 1, _id: 0 } }
        ]);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error while fetching statistics.' });
    }
};

const deletePredictions = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'Invalid request: "ids" must be an array.' });
    try {
        await Prediction.deleteMany({ _id: { $in: ids }, user: req.user.id });
        res.json({ message: 'Selected predictions deleted successfully.' });
    } catch (error) {
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
        console.error('Error fetching weekly activity:', error);
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
