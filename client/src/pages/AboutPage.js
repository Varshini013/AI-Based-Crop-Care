import React from 'react';
import { Leaf, Cpu, Users, Target } from 'lucide-react';

// Team Member Card Component
const TeamMemberCard = ({ name, role, imageUrl }) => (
    <div className="text-center bg-white p-6 rounded-lg shadow-md">
        <img 
            className="mx-auto h-32 w-32 rounded-full object-cover shadow-lg" 
            src={imageUrl} 
            alt={`Photo of ${name}`} 
        />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-green-600">{role}</p>
    </div>
);

// Main About Page Component
const AboutPage = () => {
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">About CropCare</h1>
                <p className="mt-2 text-lg text-gray-600">Fusing agriculture with artificial intelligence for a sustainable future.</p>
            </div>

            {/* Our Mission Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-green-600 font-semibold">Our Mission</span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Empowering Farmers Through Technology</h2>
                        <p className="text-gray-600 mb-4">
                            Our goal is to provide farmers with accessible and accurate tools to detect crop diseases early, enabling them to reduce crop loss and increase profitability.
                        </p>
                        <p className="text-gray-600">
                            By putting the power of AI in the hands of every farmer, we contribute to global food security and promote sustainable agricultural practices.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Target className="h-40 w-40 text-green-300" />
                    </div>
                </div>
            </div>

            {/* The Technology Section */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">The Technology Behind CropCare</h2>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <Cpu className="mx-auto h-12 w-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Deep Learning Model</h3>
                        <p className="text-gray-600">Our core is a Convolutional Neural Network (CNN) trained on thousands of images, capable of identifying 38 different plant diseases with high precision.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center font-bold text-3xl text-green-600 mb-4 font-mono">MERN</div>
                        <h3 className="text-xl font-semibold mb-2">Modern Web Stack</h3>
                        <p className="text-gray-600">Built on the MERN stack (MongoDB, Express, React, Node.js) for a fast, scalable, and seamless user experience.</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <Leaf className="mx-auto h-12 w-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
                        <p className="text-gray-600">We use web scraping to provide you with current and relevant treatment suggestions, helping you make informed decisions quickly.</p>
                    </div>
                </div>
            </div>

             {/* Our Team Section */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800 text-center">Meet the Team</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                    <TeamMemberCard name="User" role="Project Lead & Visionary" imageUrl="https://placehold.co/400x400/10B981/ffffff?text=User" />
                    <TeamMemberCard name="Gemini" role="Full-Stack & AI Developer" imageUrl="https://placehold.co/400x400/3B82F6/ffffff?text=AI" />
                    <TeamMemberCard name="Jane Doe" role="UI/UX Designer" imageUrl="https://placehold.co/400x400/F59E0B/ffffff?text=JD" />
                    <TeamMemberCard name="John Smith" role="Data Scientist" imageUrl="https://placehold.co/400x400/6366F1/ffffff?text=JS" />
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
