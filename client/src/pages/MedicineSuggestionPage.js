import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertTriangle, TestTube, ListOrdered, SprayCan, ArrowLeft, MapPin } from 'lucide-react';

// Reusable card for displaying a section of the plan
const PlanCard = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600">
            {children}
        </div>
    </div>
);

const MedicineSuggestionPage = () => {
    const location = useLocation();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const diseaseName = new URLSearchParams(location.search).get('disease');

    useEffect(() => {
        if (!diseaseName) {
            setError('No disease specified.');
            setLoading(false);
            return;
        }

        const fetchRemedyPlan = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                // THIS IS THE FIX: Use the correct URL for local development
                const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
                const { data } = await axios.post(`${backendUrl}/api/predict/remedy`, { diseaseName }, config);
                setPlan(data);
            } catch (err) {
                setError('Failed to fetch remedy plan. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRemedyPlan();
    }, [diseaseName]);

    if (loading) {
        return <div className="flex flex-col justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-green-600" /><p className="mt-4">Generating Treatment Plan...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 bg-red-50 text-red-600 p-4 rounded-lg"><AlertTriangle className="mr-3" /> {error}</div>;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <Link to="/detect" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Detection
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Treatment Plan for {diseaseName.replace(/_/g, ' ')}</h1>
                <p className="text-gray-600 mt-1">AI-powered suggestions for managing this disease.</p>
            </div>

            {plan && (
                <div className="space-y-6">
                    <PlanCard icon={<TestTube size={24} className="text-green-600"/>} title="Recommended Medicine">
                        <p className="text-lg font-semibold">{plan.medicineName}</p>
                    </PlanCard>
                    
                    <PlanCard icon={<SprayCan size={24} className="text-green-600"/>} title="How to Use">
                        <p>{plan.howToUse}</p>
                    </PlanCard>

                    <PlanCard icon={<ListOrdered size={24} className="text-green-600"/>} title="Steps to Overcome">
                        <ol className="list-decimal pl-5 space-y-2">
                            {plan.steps && plan.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </PlanCard>
                </div>
            )}
            
            <div className="text-center">
                <Link to="/stores" className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-all">
                    <MapPin size={18} className="mr-2"/>
                    Find Nearby Supply Stores
                </Link>
            </div>

             <div className="text-xs text-gray-500 p-4 bg-gray-100 rounded-lg">
                <strong>Disclaimer:</strong> This is an AI-generated suggestion. Always consult with a local agricultural expert and follow all product labels and safety guidelines carefully.
            </div>
        </div>
    );
};

export default MedicineSuggestionPage;
