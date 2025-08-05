import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ContactUsPage = () => {
    const position = [17.3850, 78.4867]; // Hyderabad coordinates

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Get In Touch</h1>
                <p className="mt-2 text-lg text-gray-600">We'd love to hear from you. Please fill out the form below or contact us directly.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg border">
                {/* Contact Form */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="font-medium text-gray-700">Message</label>
                            <textarea id="message" rows="5" className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all">
                            <Send size={18} className="mr-2"/> Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info and Map */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center"><MapPin className="text-green-600 mr-3"/><p>Hyderabad, Telangana, India</p></div>
                        <div className="flex items-center"><Mail className="text-green-600 mr-3"/><p>contact@cropcare.dev</p></div>
                        <div className="flex items-center"><Phone className="text-green-600 mr-3"/><p>+91 (000) 000-0000</p></div>
                    </div>
                    <div className="h-64 w-full rounded-lg overflow-hidden shadow-md border">
                        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={position}><Popup>CropCare HQ</Popup></Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
