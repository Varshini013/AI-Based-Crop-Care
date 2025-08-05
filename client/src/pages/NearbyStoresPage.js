import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Loader2, AlertTriangle, MapPin, Compass, Navigation } from 'lucide-react';
import L from 'leaflet';
import axios from 'axios';

// This direct import is the most reliable way to ensure the map's CSS is loaded.
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Mock data for nearby stores. This version uses a static list.
const mockStores = [
    { id: 1, name: 'Andhra Agriculture & Seeds', lat: 16.3585, lng: 80.5218, address: 'Main Rd, Namburu, AP' },
    { id: 2, name: 'Guntur Farmers Co-op', lat: 16.3650, lng: 80.5150, address: 'NH16 Highway, Near Namburu' },
    { id: 3, name: 'Sri Lakshmi Fertilizers', lat: 16.3510, lng: 80.5290, address: 'Kaza Toll Plaza, Namburu' },
    { id: 4, name: 'GreenField Agro Tech', lat: 16.3695, lng: 80.5255, address: 'Pedakakani Rd, Namburu' },
];

// Store Item Component for the list view
const StoreItem = ({ store, userLocation }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md hover:border-green-500 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-gray-800">{store.name}</h3>
                <p className="text-sm text-gray-600">{store.address}</p>
            </div>
            <MapPin size={20} className="text-gray-400 flex-shrink-0" />
        </div>
        <a 
            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${store.lat},${store.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
        >
            <Navigation size={16} className="mr-2"/>
            Get Directions
        </a>
    </div>
);

// Main Nearby Stores Page Component
const NearbyStoresPage = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(location);
                    setStores(mockStores); // Use the static mock data
                    setLoading(false);
                },
                (err) => {
                    setError('Could not get your location. Showing default results.');
                    console.error(err);
                    const defaultLocation = { lat: 17.3850, lng: 78.4867 }; // Default to Hyderabad
                    setUserLocation(defaultLocation);
                    setStores(mockStores); // Use the static mock data
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported. Showing default results.');
            const defaultLocation = { lat: 17.3850, lng: 78.4867 }; // Default to Hyderabad
            setUserLocation(defaultLocation);
            setStores(mockStores); // Use the static mock data
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                <p className="mt-4 text-lg font-semibold text-gray-700">Finding your location...</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Nearby Supply Stores</h1>
                <p className="text-gray-600 mt-1">Find local stores for your agricultural needs based on your location.</p>
            </div>

            {error && (
                <div className="flex items-center bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-200">
                    <AlertTriangle className="mr-3 flex-shrink-0" /> 
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[60vh]">
                <div className="lg:col-span-2 rounded-xl shadow-lg overflow-hidden border">
                    {userLocation && (
                        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={14} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[userLocation.lat, userLocation.lng]}>
                                <Popup>Your approximate location.</Popup>
                            </Marker>
                            {stores.map(store => (
                                <Marker key={store.id} position={[store.lat, store.lng]}>
                                    <Popup>
                                        <div className="font-bold">{store.name}</div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    )}
                </div>

                <div className="flex flex-col space-y-4 overflow-y-auto pr-2">
                     <h2 className="text-xl font-bold text-gray-800 flex items-center"><Compass size={20} className="mr-2"/> Stores Near You</h2>
                    {stores.length > 0 ? stores.map(store => (
                        <StoreItem key={store.id} store={store} userLocation={userLocation} />
                    )) : (
                         <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-700">No Stores Found</h3>
                            <p className="text-gray-500 mt-2">Could not find any agricultural stores within a 10km radius.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NearbyStoresPage;
