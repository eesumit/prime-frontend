import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiX, FiLogOut, FiUser, FiGrid, FiList } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const isActive = (path) => location.pathname === path;

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold gradient-text">TaskMaster</span>
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link
                                to="/dashboard"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard')
                                        ? 'border-primary-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                <FiGrid className="mr-2" />
                                Dashboard
                            </Link>
                            <Link
                                to="/tasks"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/tasks')
                                        ? 'border-primary-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                <FiList className="mr-2" />
                                Tasks
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:ml-6 md:flex md:items-center">
                        <div className="ml-3 relative flex items-center space-x-4">
                            <Link
                                to="/profile"
                                className={`flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors ${isActive('/profile') ? 'text-primary-600' : ''
                                    }`}
                            >
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
                                    <FiUser />
                                </div>
                                <span>{user?.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Logout"
                            >
                                <FiLogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} animate-slide-down`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/dashboard')
                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center">
                            <FiGrid className="mr-3" />
                            Dashboard
                        </div>
                    </Link>
                    <Link
                        to="/tasks"
                        onClick={() => setIsOpen(false)}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/tasks')
                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center">
                            <FiList className="mr-3" />
                            Tasks
                        </div>
                    </Link>
                    <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/profile')
                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center">
                            <FiUser className="mr-3" />
                            Profile
                        </div>
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                        <div className="flex items-center">
                            <FiLogOut className="mr-3" />
                            Logout
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
