import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, AlertTriangle, ScanLine, Bug, ShieldCheck } from 'lucide-react';

// Stat Card Component for key metrics
const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

// Main Statistics Page Component
const StatisticsPage = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                // UPDATED: Port changed to 5001
                const { data } = await axios.get('http://localhost:5001/api/predict/stats', config);
                setStats(data);
            } catch (err) {
                setError('Failed to load statistics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Process data for charts and cards using useMemo for efficiency
    const processedData = useMemo(() => {
        if (!stats || stats.length === 0) {
            return {
                totalScans: 0,
                uniqueDiseases: 0,
                diseasedCount: 0,
                healthyCount: 0,
                chartData: [],
                pieData: []
            };
        }

        let diseasedCount = 0;
        let healthyCount = 0;
        
        const chartData = stats.map(item => {
            const isHealthy = item.disease.toLowerCase().includes('healthy');
            if (isHealthy) {
                healthyCount += item.count;
            } else {
                diseasedCount += item.count;
            }
            return {
                name: item.disease.replace(/___/g, ' - ').replace(/_/g, ' '),
                count: item.count,
            };
        });

        const totalScans = diseasedCount + healthyCount;
        
        const pieData = [
            { name: 'Diseased', value: diseasedCount, color: '#EF4444' },
            { name: 'Healthy', value: healthyCount, color: '#10B981' },
        ];

        return {
            totalScans,
            uniqueDiseases: stats.filter(s => !s.disease.toLowerCase().includes('healthy')).length,
            diseasedCount,
            healthyCount,
            chartData,
            pieData
        };
    }, [stats]);


    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-green-600" /></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 bg-red-50 text-red-600 p-4 rounded-lg"><AlertTriangle className="mr-3" /> {error}</div>;
    }

    if (stats.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
                <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">No Statistics Available</h3>
                <p className="mt-2 text-gray-500">Perform a few scans to see your crop health statistics here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Health Statistics</h1>
                <p className="text-gray-600 mt-1">An analytical overview of your detection history.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<ScanLine size={24} className="text-white"/>} title="Total Scans" value={processedData.totalScans} color="bg-blue-500" />
                <StatCard icon={<Bug size={24} className="text-white"/>} title="Unique Diseases" value={processedData.uniqueDiseases} color="bg-orange-500" />
                <StatCard icon={<AlertTriangle size={24} className="text-white"/>} title="Diseased Scans" value={processedData.diseasedCount} color="bg-red-500" />
                <StatCard icon={<ShieldCheck size={24} className="text-white"/>} title="Healthy Scans" value={processedData.healthyCount} color="bg-green-500" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Detections by Disease</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={processedData.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px'}}/>
                            <Legend />
                            <Bar dataKey="count" name="Number of Detections" fill="#10B981" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Healthy vs. Diseased</h2>
                     <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={processedData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {processedData.pieData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} scans`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
