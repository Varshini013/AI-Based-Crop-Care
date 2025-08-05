import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, Search, Leaf, ShieldCheck, Bug, X, ArrowRight, Trash2, Filter, SortAsc, SortDesc, CheckSquare, Square } from 'lucide-react';

// Modal component for viewing details
const HistoryModal = ({ item, onClose }) => {
    if (!item) return null;
    const isHealthy = item.diseaseName.toLowerCase().includes('healthy');
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <div className="grid md:grid-cols-2 gap-6">
                        <img src={`http://localhost:5001${item.imageUrl}`} alt={item.diseaseName} className="w-full h-auto rounded-lg object-cover border"/>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {isHealthy ? <ShieldCheck size={16} className="mr-2"/> : <Bug size={16} className="mr-2"/>}
                                    {isHealthy ? 'Healthy' : 'Diseased'}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Diagnosis</p>
                                <h2 className="text-2xl font-bold text-gray-800">{item.diseaseName.replace(/_/g, ' ')}</h2>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Detected On</p>
                                <p className="text-gray-700 font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                            {!isHealthy && (
                                <div>
                                    <p className="text-sm text-gray-500">Suggested Remedy</p>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{item.remedy}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Card component for a single history item
const HistoryCard = ({ item, onSelect, isSelectMode, isSelected, onToggleSelect }) => {
    const isHealthy = item.diseaseName.toLowerCase().includes('healthy');
    return (
        <div className={`bg-white rounded-xl shadow-md border overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative ${isSelected ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200'}`}>
            {isSelectMode && (
                <div className="absolute top-3 left-3 z-10">
                    <button onClick={() => onToggleSelect(item._id)} className="p-1 rounded-full bg-white/50 backdrop-blur-sm">
                        {isSelected ? <CheckSquare className="text-green-600" /> : <Square className="text-gray-500" />}
                    </button>
                </div>
            )}
            <div className="grid grid-cols-3">
                <div className="col-span-1"><img src={`http://localhost:5001${item.imageUrl}`} alt={item.diseaseName} className="h-full w-full object-cover"/></div>
                <div className="col-span-2 p-4 flex flex-col justify-between">
                    <div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isHealthy ? <ShieldCheck size={16} className="mr-2"/> : <Bug size={16} className="mr-2"/>}
                            {isHealthy ? 'Healthy' : 'Diseased'}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mt-2">{item.diseaseName.replace(/_/g, ' ')}</h3>
                        <p className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => onSelect(item)} className="mt-4 w-full text-center px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900">View Details</button>
                </div>
            </div>
        </div>
    );
};

// Main History Page Component
const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5001/api/predict/history', config);
                setHistory(data);
            } catch (err) {
                setError('Failed to load detection history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);
    
    const filteredAndSortedHistory = useMemo(() => {
        return history
            .filter(item => {
                if (statusFilter === 'all') return true;
                const isHealthy = item.diseaseName.toLowerCase().includes('healthy');
                return statusFilter === 'healthy' ? isHealthy : !isHealthy;
            })
            .filter(item => item.diseaseName.toLowerCase().replace(/_/g, ' ').includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [history, searchTerm, statusFilter, sortOrder]);

    const handleToggleSelect = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };
    
    const handleDeleteSelected = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} item(s)?`)) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` }, data: { ids: Array.from(selectedIds) } };
                await axios.delete('http://localhost:5001/api/predict', config);
                setHistory(prev => prev.filter(item => !selectedIds.has(item._id)));
                setSelectedIds(new Set());
                setIsSelectMode(false);
            } catch (err) {
                setError('Failed to delete items.');
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-green-600" /></div>;
    if (error) return <div className="flex justify-center items-center h-64 bg-red-50 text-red-600 p-4 rounded-lg"><AlertTriangle className="mr-3" /> {error}</div>;

    return (
        <div className="space-y-8">
            <HistoryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Detection History</h1>
                <p className="text-gray-600 mt-1">Review, filter, and manage your past scans.</p>
            </div>
            {history.length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                    {/* Control bar JSX */}
                </div>
            )}
            {filteredAndSortedHistory.length > 0 ? (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setIsSelectMode(!isSelectMode)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${isSelectMode ? 'bg-gray-200' : 'bg-white border'}`}>
                            {isSelectMode ? 'Cancel' : 'Select Items'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {filteredAndSortedHistory.map(item => (
                            <HistoryCard key={item._id} item={item} onSelect={setSelectedItem} isSelectMode={isSelectMode} isSelected={selectedIds.has(item._id)} onToggleSelect={handleToggleSelect} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
                    <Leaf className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">{history.length === 0 ? 'Your History is Empty' : 'No Matches Found'}</h3>
                    <p className="mt-2 text-gray-500">{history.length === 0 ? "You haven't made any detections yet." : 'Try adjusting your search or filters.'}</p>
                    <div className="mt-6">
                        <Link to="/detect" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">Make Your First Scan <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
