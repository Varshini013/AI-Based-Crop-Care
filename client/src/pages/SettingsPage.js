import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, ShieldAlert, Loader2 } from 'lucide-react';

// Reusable component for a section card
const SettingsCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b">{title}</h2>
        {children}
    </div>
);

// Reusable component for an input field
const InputField = ({ icon, type, name, value, onChange, placeholder }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
    </div>
);

// Main Settings Page Component
const SettingsPage = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState({ profile: false, password: false, delete: false });
    const [message, setMessage] = useState({ profile: '', password: '' });
    const [error, setError] = useState({ profile: '', password: '', delete: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setProfileData({ name: storedUser.name, email: storedUser.email });
        }
    }, []);

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, profile: true }));
        setMessage({ profile: '', password: '' });
        setError({ profile: '', password: '', delete: '' });
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const res = await axios.put('http://localhost:5001/api/auth/profile', profileData, config);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            setMessage(prev => ({ ...prev, profile: 'Profile updated successfully!' }));
        } catch (err) {
            setError(prev => ({ ...prev, profile: err.response?.data?.message || 'Failed to update profile.' }));
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };
    
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setError({ ...error, password: 'New passwords do not match.' });
        }
        setLoading(prev => ({ ...prev, password: true }));
        setMessage({ profile: '', password: '' });
        setError({ profile: '', password: '', delete: '' });
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { currentPassword, newPassword } = passwordData;
            await axios.put('http://localhost:5001/api/auth/password', { currentPassword, newPassword }, config);
            setMessage(prev => ({ ...prev, password: 'Password changed successfully!' }));
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(prev => ({ ...prev, password: err.response?.data?.message || 'Failed to change password.' }));
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you absolutely sure? This will permanently erase all your data.')) {
            setLoading(prev => ({ ...prev, delete: true }));
            setError({ profile: '', password: '', delete: '' });
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                await axios.delete('http://localhost:5001/api/auth/account', config);
                localStorage.clear();
                navigate('/');
            } catch (err) {
                setError(prev => ({ ...prev, delete: 'Failed to delete account. Please try again.' }));
                setLoading(prev => ({ ...prev, delete: false }));
            }
        }
    };

    if (!user) return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-green-600" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                <p className="text-gray-600 mt-1">Manage your profile, password, and account preferences.</p>
            </div>
            <SettingsCard title="Profile Information">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <InputField icon={<User className="h-5 w-5 text-gray-400"/>} type="text" name="name" value={profileData.name} onChange={handleProfileChange} />
                    <InputField icon={<Mail className="h-5 w-5 text-gray-400"/>} type="email" name="email" value={profileData.email} onChange={handleProfileChange} />
                    {message.profile && <p className="text-sm text-green-600">{message.profile}</p>}
                    {error.profile && <p className="text-sm text-red-600">{error.profile}</p>}
                    <div className="text-right">
                        <button type="submit" disabled={loading.profile} className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
                            {loading.profile && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Save Changes
                        </button>
                    </div>
                </form>
            </SettingsCard>
            <SettingsCard title="Change Password">
                 <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <InputField icon={<KeyRound className="h-5 w-5 text-gray-400"/>} type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Current Password" />
                    <InputField icon={<KeyRound className="h-5 w-5 text-gray-400"/>} type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="New Password" />
                    <InputField icon={<KeyRound className="h-5 w-5 text-gray-400"/>} type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm New Password" />
                    {message.password && <p className="text-sm text-green-600">{message.password}</p>}
                    {error.password && <p className="text-sm text-red-600">{error.password}</p>}
                    <div className="text-right">
                        <button type="submit" disabled={loading.password} className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
                             {loading.password && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Update Password
                        </button>
                    </div>
                </form>
            </SettingsCard>
            <SettingsCard title="Account Management">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-start">
                        <ShieldAlert className="h-6 w-6 text-red-600 mr-3 flex-shrink-0"/>
                        <div>
                            <h3 className="text-lg font-bold text-red-800">Delete Account</h3>
                            <p className="text-red-700 mt-1">This action will permanently erase all your data and cannot be undone.</p>
                            {error.delete && <p className="text-sm text-red-600 mt-2">{error.delete}</p>}
                            <button onClick={handleDeleteAccount} disabled={loading.delete} className="mt-4 inline-flex items-center px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400">
                                {loading.delete && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};

export default SettingsPage;
