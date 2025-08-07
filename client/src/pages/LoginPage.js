import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Leaf, Mail, KeyRound } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError('Please fill out all fields.');
        setLoading(true);
        setError('');
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ email, password });
            // THIS IS THE FIX: Use the environment variable for the backend URL
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/api/auth/login`, body, config);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1887&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* ... rest of the component is unchanged ... */}
        </div>
    );
};
export default LoginPage;
