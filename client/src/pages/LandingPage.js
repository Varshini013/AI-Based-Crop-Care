import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, TestTube2, BarChart, MapPin, Menu, X, Star, Quote } from 'lucide-react';

// Navigation Link Component
const NavLink = ({ href, children, isButton }) => (
    <a 
        href={href} 
        className={`transition-colors duration-300 ${isButton 
            ? 'bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 shadow-lg transform hover:scale-105' 
            : 'text-gray-700 hover:text-green-600 font-medium'}`}
    >
        {children}
    </a>
);

// Feature Card with enhanced hover effects
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-green-100 text-green-600 mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, name, role, avatarUrl }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <Quote className="text-green-300 h-8 w-8 mb-4" />
        <p className="text-gray-600 italic mb-6">"{quote}"</p>
        <div className="flex items-center">
            <img src={avatarUrl} alt={name} className="h-12 w-12 rounded-full object-cover mr-4"/>
            <div>
                <p className="font-bold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    </div>
);


// Main Landing Page Component
const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-gray-50 font-sans text-gray-900">
            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-sm z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Leaf className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-gray-800">CropCare</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#how-it-works">How It Works</NavLink>
                        <NavLink href="#testimonials">Testimonials</NavLink>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300">
                            Log In
                        </Link>
                        <Link to="/register" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                            Get Started
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white py-4 shadow-lg">
                        <nav className="flex flex-col items-center space-y-4">
                            <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
                            <NavLink href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</NavLink>
                            <NavLink href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</NavLink>
                            <Link to="/login" className="text-gray-700 font-medium">Log In</Link>
                            <Link to="/register" className="bg-green-600 text-white px-8 py-2 rounded-full font-semibold">Get Started</Link>
                        </nav>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-40 pb-24 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop')" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30"></div>
                    <div className="container mx-auto px-6 text-center relative">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 animate-fade-in-down">
                            Revolutionize Your Harvest
                        </h1>
                        <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-8 animate-fade-in-up">
                            Instantly diagnose crop diseases with AI. Get actionable insights, protect your yield, and embrace the future of farming.
                        </p>
                        <Link to="/register" className="bg-white text-green-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl animate-bounce-short">
                            Start Your Free Analysis
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">The Future of Farming is Here</h2>
                            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">CropCare provides the tools you need for a smarter, more productive harvest.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <FeatureCard 
                                icon={<ShieldCheck size={32} />} 
                                title="Instant Diagnosis" 
                                description="Upload a leaf photo and our AI provides an accurate disease diagnosis in seconds." 
                            />
                            <FeatureCard 
                                icon={<TestTube2 size={32} />} 
                                title="Smart Remedies" 
                                description="Receive immediate, actionable suggestions for treatments based on the detected disease." 
                            />
                            <FeatureCard 
                                icon={<BarChart size={32} />} 
                                title="Data-Driven Insights" 
                                description="Track your scan history and view statistics to identify patterns and problem areas on your farm." 
                            />
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Three Simple Steps</h2>
                            <p className="text-lg text-gray-600 mt-4">From problem to solution in under a minute.</p>
                        </div>
                        <div className="relative">
                             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-green-200"></div>
                             <div className="relative grid md:grid-cols-3 gap-12">
                                <div className="text-center">
                                    <div className="mb-4 inline-block p-4 bg-green-600 text-white rounded-full font-bold text-2xl">1</div>
                                    <h3 className="text-xl font-bold mb-2">Capture or Upload</h3>
                                    <p className="text-gray-600">Take a photo of an affected leaf with your phone or upload an existing image.</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-4 inline-block p-4 bg-green-600 text-white rounded-full font-bold text-2xl">2</div>
                                    <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                                    <p className="text-gray-600">Our powerful AI model analyzes the image to identify the specific disease.</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-4 inline-block p-4 bg-green-600 text-white rounded-full font-bold text-2xl">3</div>
                                    <h3 className="text-xl font-bold mb-2">Get Your Solution</h3>
                                    <p className="text-gray-600">Receive a detailed report with the diagnosis and recommended actions.</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Trusted by Farmers</h2>
                            <p className="text-lg text-gray-600 mt-4">See how CropCare is making a difference.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <TestimonialCard 
                                quote="This app is a game-changer. I identified blight on my tomatoes weeks earlier than I would have normally. Saved a huge portion of my crop!"
                                name="Rajesh Kumar"
                                role="Tomato Farmer, Andhra Pradesh"
                                avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
                            />
                            <TestimonialCard 
                                quote="As a new farmer, I'm not an expert on diseases. CropCare gives me the confidence to act quickly and correctly. It's like having an expert in my pocket."
                                name="Priya Singh"
                                role="Organic Farmer, Punjab"
                                avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
                            />
                            <TestimonialCard 
                                quote="The history and statistics features are incredible. I can now see which diseases are most common in my fields year after year and plan accordingly."
                                name="Anil Desai"
                                role="Cotton Grower, Gujarat"
                                avatarUrl="https://randomuser.me/api/portraits/men/36.jpg"
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-6 py-12">
                     <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold">Ready to Protect Your Harvest?</h3>
                        <Link to="/register" className="mt-6 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 inline-block">
                            Sign Up for Free
                        </Link>
                    </div>
                    <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400">&copy; {new Date().getFullYear()} CropCare. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-green-400">Privacy Policy</a>
                            <a href="#" className="hover:text-green-400">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Add some basic CSS for animations in the head of your index.html or in a CSS file */}
            <style jsx global>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.3s forwards; opacity: 0; }
                .animate-bounce-short { animation: bounce-short 1.5s ease-in-out infinite; animation-delay: 1s; }
            `}</style>
        </div>
    );
};

export default LandingPage;
