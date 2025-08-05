import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { UploadCloud, Leaf, AlertTriangle, Loader2, Sparkles, ArrowRight, CheckCircle2, Microscope, Camera, X, RefreshCw, Lock } from 'lucide-react';

// Main component for the disease detection feature
const DetectDiseasePage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    
    const isSecureContext = window.isSecureContext;

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
        setIsCameraReady(false);
    }, []);

    const startCamera = async () => {
        setError('');
        setIsCameraReady(false);
        if (!isSecureContext) {
            setError("Camera access is only available on secure connections (localhost or HTTPS).");
            return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Camera not supported on this browser.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
        } catch (err) {
            console.error("Camera Error:", err);
            if (err.name === "NotAllowedError") {
                setError("Camera access was denied. Please allow camera permissions and refresh the page.");
            } else {
                setError("Could not access camera. It may be in use by another application.");
            }
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current && isCameraReady) {
            const context = canvasRef.current.getContext('2d');
            const video = videoRef.current;
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                
                canvasRef.current.toBlob(blob => {
                    const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    setFile(capturedFile);
                    setPreview(URL.createObjectURL(capturedFile));
                }, 'image/jpeg');
                
                stopCamera();
            } else {
                setError("Camera is not ready. Please try again.");
            }
        }
    };

    const onDrop = useCallback(acceptedFiles => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setPrediction(null);
            setError('');
        } else {
            setError('Please upload a valid image file (PNG, JPG).');
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': ['.jpeg', '.png', '.jpg'] }, multiple: false, noClick: isCameraActive });

    const handleDetect = async () => {
        if (!file) {
            setError('Please select an image first.');
            return;
        }
        setLoading(true);
        setError('');
        setPrediction(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/predict', formData, config);
            setPrediction(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setPrediction(null);
        setError('');
        stopCamera();
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                stopCamera();
            }
        };
    }, [stopCamera]);
    
    const isHealthy = prediction && prediction.diseaseName.toLowerCase().includes('healthy');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Crop Disease Detection</h1>
                <p className="text-gray-600 mt-1">Use our advanced AI to get an instant analysis of your crop's health.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left Side: Upload/Capture and Preview */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">1. Provide an Image</h2>
                        <div className="w-full h-80 rounded-xl border-3 border-dashed border-gray-300 flex flex-col justify-center items-center relative overflow-hidden bg-gray-50">
                            {!isCameraActive && !preview && (
                                <div {...getRootProps({ className: 'w-full h-full flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors' })}>
                                    <input {...getInputProps()} />
                                    <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-lg font-semibold text-gray-700">Drag & drop or click</p>
                                </div>
                            )}
                            {isCameraActive && (
                                <div className="w-full h-full relative">
                                    <video ref={videoRef} onCanPlay={() => setIsCameraReady(true)} autoPlay playsInline className="w-full h-full object-cover"></video>
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                    {!isCameraReady && <div className="absolute inset-0 flex justify-center items-center bg-black/50"><Loader2 className="h-8 w-8 text-white animate-spin"/></div>}
                                </div>
                            )}
                            {preview && (
                                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                            )}
                        </div>

                        <div className="space-y-4">
                            {!preview && !isCameraActive && (
                                <>
                                    <button onClick={startCamera} disabled={!isSecureContext} className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        <Camera className="mr-2 h-5 w-5" /> Use Camera Instead
                                    </button>
                                    {!isSecureContext && (
                                        <div className="flex items-center text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md">
                                            <Lock size={16} className="mr-2 flex-shrink-0" />
                                            <span>For security, camera access is only enabled on <strong>localhost</strong> or <strong>HTTPS</strong> sites.</span>
                                        </div>
                                    )}
                                </>
                            )}
                            {isCameraActive && (
                                <div className="flex space-x-4">
                                    <button onClick={handleCapture} disabled={!isCameraReady} className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all disabled:bg-gray-500">Take Photo</button>
                                    <button onClick={stopCamera} className="px-4 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"><X size={20}/></button>
                                </div>
                            )}
                            {preview && (
                                <button onClick={handleReset} className="w-full flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                                    <RefreshCw className="mr-2 h-5 w-5" /> Start Over
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                             <h2 className="text-2xl font-bold text-gray-800">2. Start Diagnosis</h2>
                             <button onClick={handleDetect} disabled={loading || !file} className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105">
                                {loading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Analyzing...</> : <><Microscope className="mr-3 h-6 w-6" /> Detect Disease</>}
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Results */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">3. View Results</h2>
                        <div className="min-h-[28rem] flex flex-col justify-center p-6 bg-gray-50 rounded-xl border">
                            {loading && ( <div className="text-center"><Loader2 className="mx-auto h-16 w-16 text-green-500 animate-spin" /><p className="mt-4 text-xl font-semibold text-gray-700">AI Diagnosis in Progress</p></div> )}
                            {error && !loading && ( <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg"><AlertTriangle className="mx-auto h-16 w-16" /><p className="mt-4 text-xl font-semibold">An Error Occurred</p><p className="text-sm">{error}</p></div> )}
                            
                            {prediction && (
                                <div className="transition-opacity duration-500 animate-fade-in space-y-6">
                                    <div className={`p-4 rounded-lg border-l-4 ${isHealthy ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                        <div className="flex items-center">
                                            {isHealthy ? <CheckCircle2 className="h-8 w-8 mr-3 text-green-500" /> : <AlertTriangle className="h-8 w-8 mr-3 text-red-500" />}
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500">Result:</p>
                                                <p className={`text-2xl font-bold ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>{prediction.diseaseName.replace(/_/g, ' ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* --- THIS IS THE CORRECTED LOGIC --- */}
                                    {!isHealthy && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Next Steps</h3>
                                            <Link 
                                                to={`/remedy?disease=${prediction.diseaseName}`}
                                                className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
                                            >
                                                View Treatment Plan <ArrowRight className="ml-2 h-5 w-5"/>
                                            </Link>
                                        </div>
                                    )}
                                    {isHealthy && (
                                        <div className="text-center text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                                            <p className="font-semibold">No treatment needed.</p>
                                            <p className="text-sm">Continue to monitor your crops regularly.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!loading && !error && !prediction && (
                                 <div className="text-center text-gray-500">
                                    <Sparkles className="mx-auto h-16 w-16 text-gray-300" />
                                    <p className="mt-4 text-xl font-semibold">Results will appear here</p>
                                    <p className="text-gray-400">Provide an image and click "Detect Disease".</p>
                                 </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetectDiseasePage;
