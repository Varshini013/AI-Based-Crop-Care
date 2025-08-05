import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Leaf, 
    History, 
    BarChart3, 
    MapPin, 
    Settings, 
    LogOut, 
    Menu,
    X,
    User as UserIcon,
    HelpCircle,
    Info, // <-- New Icon
    Mail // <-- New Icon
} from 'lucide-react';

// Main Dashboard Layout Component
const DashboardPage = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }

        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // UPDATED: Added About, Help, and Contact to the navigation
    const navItems = [
        { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/dashboard' },
        { icon: <Leaf size={20} />, text: 'Detect Disease', path: '/detect' },
        { icon: <History size={20} />, text: 'History', path: '/history' },
        { icon: <BarChart3 size={20} />, text: 'Statistics', path: '/stats' },
        { icon: <MapPin size={20} />, text: 'Nearby Stores', path: '/stores' },
    ];
    
    const secondaryNavItems = [
        { icon: <Info size={20} />, text: 'About', path: '/about' },
        { icon: <HelpCircle size={20} />, text: 'Help', path: '/help' },
        { icon: <Mail size={20} />, text: 'Contact Us', path: '/contact' },
    ];

    const NavItem = ({ path, icon, text }) => {
        const isActive = location.pathname === path;
        return (
            <Link 
                to={path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center p-3 my-1 rounded-lg transition-all duration-200 group ${
                    isActive 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
            >
                {icon}
                <span className="ml-4 font-medium">{text}</span>
            </Link>
        );
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b border-gray-200">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-2xl font-bold text-gray-800">CropCare</span>
            </div>
            <nav className="flex-1 p-2 overflow-y-auto">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</p>
                {navItems.map(item => <NavItem key={item.text} {...item} />)}
                
                <p className="px-3 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Information</p>
                {secondaryNavItems.map(item => <NavItem key={item.text} {...item} />)}
            </nav>
            <div className="p-2 border-t border-gray-200">
                <NavItem icon={<Settings size={20} />} text="Settings" path="/settings" />
                <button 
                    onClick={handleLogout} 
                    className="flex items-center p-3 my-1 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 w-full transition-colors duration-200 group"
                >
                    <LogOut size={20} />
                    <span className="ml-4 font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="bg-white shadow-xl w-64 hidden md:flex flex-col">
                <SidebarContent />
            </aside>

             {/* Mobile Sidebar */}
            <div className={`fixed inset-0 bg-black/60 z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className={`bg-white shadow-lg fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out md:hidden flex flex-col w-64 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="flex justify-end p-2">
                    <button onClick={() => setIsMobileMenuOpen(false)}><X/></button>
                 </div>
                 <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm shadow-md p-4 flex justify-between items-center z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 rounded-full hover:bg-gray-200">
                        <Menu />
                    </button>
                    <div className="font-semibold text-gray-700">
                        {[...navItems, ...secondaryNavItems].find(item => item.path === location.pathname)?.text || 'Account'}
                    </div>
                    
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                            <span className="font-semibold text-sm hidden sm:inline">{user.name}</span>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff&font-size=0.5`} 
                                alt="User Avatar"
                                className="h-10 w-10 rounded-full ring-2 ring-green-200"
                            />
                        </button>
                        {isProfileMenuOpen && (
                             <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                                <div className="p-4 border-b">
                                    <p className="font-bold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <Link to="/settings" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
                                    <UserIcon size={18} className="mr-3"/> Profile Settings
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 border-t">
                                    <LogOut size={18} className="mr-3"/> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
