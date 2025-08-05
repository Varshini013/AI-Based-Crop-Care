import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, AlertTriangle, ScanLine, ShieldCheck, Bug, ArrowRight, RefreshCw, Star, HelpCircle, Leaf, History, BarChart3 } from 'lucide-react';

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, path, color }) => (
    <Link to={path} className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col text-center items-center transform hover:-translate-y-2 hover:shadow-xl hover:border-green-500 transition-all duration-300 group`}>
        <div className={`p-4 rounded-full bg-${color}-100 text-${color}-600 mb-4`}>
            {icon}
        </div>
        <p className="font-bold text-lg text-gray-800 mb-2">{title}</p>
        <p className="text-sm text-gray-600 leading-relaxed flex-grow">{description}</p>
        <div className="mt-4 text-sm font-semibold text-green-600 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            Go to Page <ArrowRight className="ml-2 h-4 w-4" />
        </div>
    </Link>
);

// Main Dashboard Content Component
const DashboardContent = () => {
    const [stats, setStats] = useState([]);
    const [history, setHistory] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [statsRes, historyRes, activityRes] = await Promise.all([
                axios.get('http://localhost:5001/api/predict/stats', config),
                axios.get('http://localhost:5001/api/predict/history', config),
                axios.get('http://localhost:5001/api/predict/activity', config)
            ]);

            setStats(statsRes.data);
            setHistory(historyRes.data.slice(0, 4));
            setActivity(activityRes.data);

        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const processedData = useMemo(() => {
        if (!stats || stats.length === 0) return { totalScans: 0, diseasedCount: 0, healthySamples: 0, topDisease: 'N/A' };

        const totalScans = stats.reduce((acc, item) => acc + item.count, 0);
        const healthySamples = stats.filter(s => s.disease.toLowerCase().includes('healthy')).reduce((acc, item) => acc + item.count, 0);
        const diseasedStats = stats.filter(s => !s.disease.toLowerCase().includes('healthy'));
        const diseasedCount = diseasedStats.reduce((acc, item) => acc + item.count, 0);
        const topDisease = diseasedStats.length > 0 ? diseasedStats[0].disease.replace(/_/g, ' ') : 'None Detected';

        return { totalScans, diseasedCount, healthySamples, topDisease };
    }, [stats]);

    if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-green-600" /></div>;
    if (error) return <div className="flex justify-center items-center h-full bg-red-50 text-red-600 p-4 rounded-lg"><AlertTriangle className="mr-3" /> {error}</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your crop health.</p>
                </div>
                <button onClick={fetchData} disabled={loading} className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<ScanLine size={24} className="text-white"/>} title="Total Scans" value={processedData.totalScans} color="bg-blue-500" />
                <StatCard icon={<Bug size={24} className="text-white"/>} title="Total Diseased" value={processedData.diseasedCount} color="bg-red-500" />
                <StatCard icon={<ShieldCheck size={24} className="text-white"/>} title="Total Healthy" value={processedData.healthySamples} color="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Detections This Week</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activity}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip contentStyle={{backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px'}}/>
                            <Legend />
                            <Bar dataKey="diseased" stackId="a" fill="#EF4444" name="Diseased" />
                            <Bar dataKey="healthy" stackId="a" fill="#10B981" name="Healthy" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Top Issue</h2>
                        <div className="flex items-center text-yellow-600">
                            <Star size={20} className="mr-2"/>
                            <p className="text-lg font-semibold">{processedData.topDisease}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">This is your most frequently detected disease.</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                            <Link to="/history" className="text-sm font-medium text-green-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {history.length > 0 ? history.map(item => (
                                <div key={item._id} className="flex items-center text-sm">
                                    <img src={`http://localhost:5001${item.imageUrl}`} alt="" className="h-8 w-8 rounded-md object-cover mr-3"/>
                                    <p className="font-medium text-gray-700 truncate">{item.diseaseName.replace(/_/g, ' ')}</p>
                                </div>
                            )) : <p className="text-sm text-gray-500">No recent scans.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- QUICK ACTIONS MOVED TO THE BOTTOM --- */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <QuickActionCard 
                        icon={<Leaf size={28}/>} 
                        title="New Disease Scan" 
                        description="Access the core of our platform. Use your camera or upload an image to get an instant and accurate AI-powered disease diagnosis for your crops." 
                        path="/detect" 
                        color="green" 
                    />
                    <QuickActionCard 
                        icon={<History size={28}/>} 
                        title="View Full History" 
                        description="Review all your past detections in one place. Filter, sort, and manage your complete scan history to track your farm's health over time." 
                        path="/history" 
                        color="blue" 
                    />
                    <QuickActionCard 
                        icon={<BarChart3 size={28}/>} 
                        title="Check Statistics" 
                        description="See trends and insights from your data. Visualize your farm's health with interactive charts and graphs to make better-informed decisions." 
                        path="/stats" 
                        color="orange" 
                    />
                    <QuickActionCard 
                        icon={<HelpCircle size={28}/>} 
                        title="Get Help" 
                        description="Visit the support center to find answers to common questions, read our user guides, or get in touch with our team for assistance." 
                        path="/help" 
                        color="purple" 
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
