import React from 'react';
import { LifeBuoy, Mail, BookOpen, ChevronDown } from 'lucide-react';

// Accordion Item for FAQs
const FaqItem = ({ question, answer }) => (
    <details className="group bg-white p-4 rounded-lg shadow-sm border cursor-pointer">
        <summary className="flex justify-between items-center font-semibold text-gray-800">
            {question}
            <ChevronDown className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <p className="text-gray-600 mt-2 pt-2 border-t">
            {answer}
        </p>
    </details>
);

// Main Help Page Component
const HelpPage = () => {
    return (
        <div className="space-y-12 max-w-4xl mx-auto">
            <div className="text-center">
                <LifeBuoy className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="text-4xl font-bold text-gray-800 mt-4">Help & Support Center</h1>
                <p className="mt-2 text-lg text-gray-600">We're here to help you get the most out of CropCare.</p>
            </div>

            {/* Frequently Asked Questions Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <FaqItem 
                        question="How accurate is the disease detection?"
                        answer="Our AI model is trained on a vast dataset and achieves high accuracy. However, it should be used as a supportive tool. For critical cases, always consult a local agricultural expert."
                    />
                    <FaqItem 
                        question="What kind of images work best for analysis?"
                        answer="For the best results, use clear, well-lit photos of a single leaf against a plain background. Ensure the diseased area is in focus and fills a good portion of the frame."
                    />
                    <FaqItem 
                        question="Is my data and my uploaded images private?"
                        answer="Yes, your uploaded images and detection history are private to your account. We are committed to protecting your data and privacy."
                    />
                </div>
            </div>

            {/* Contact and Resources Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Still Need Help?</h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <Mail size={24} className="text-green-600 mb-2" />
                        <h3 className="text-xl font-bold text-gray-800">Contact Support</h3>
                        <p className="text-gray-600 mt-1">Have a specific question? Email our support team directly.</p>
                        <a href="mailto:contact@cropcare.dev" className="font-semibold text-green-600 hover:underline mt-2 inline-block">contact@cropcare.dev</a>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <BookOpen size={24} className="text-green-600 mb-2" />
                        <h3 className="text-xl font-bold text-gray-800">User Guide</h3>
                        <p className="text-gray-600 mt-1">Browse our comprehensive guide for step-by-step instructions.</p>
                        <a href="#" className="font-semibold text-green-600 hover:underline mt-2 inline-block">Read the Guide</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
