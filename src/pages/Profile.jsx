import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/auth';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const validateProfile = () => {
        const newErrors = {};

        if (!profileData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (profileData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!profileData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!passwordData.oldPassword) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!validateProfile()) return;

        setLoading(true);
        const result = await updateProfile(profileData);
        setLoading(false);

        if (result.success) {
            // Update local state with new values
            setProfileData({
                name: profileData.name,
                email: profileData.email,
            });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        try {
            setLoading(true);
            const response = await authAPI.changePassword(
                passwordData.oldPassword,
                passwordData.newPassword
            );

            if (response.success) {
                toast.success('Password changed successfully!');
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setErrors({});
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings</p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'profile'
                                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <FiUser className="inline-block w-5 h-5 mr-2" />
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'password'
                                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <FiLock className="inline-block w-5 h-5 mr-2" />
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' ? (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Account Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Account Created:</span>{' '}
                                        {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiSave className="w-5 h-5" />
                                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            id="oldPassword"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className={`input-field pl-10 ${errors.oldPassword ? 'border-red-500' : ''}`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.oldPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className={`input-field pl-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiLock className="w-5 h-5" />
                                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
