import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await authAPI.getProfile();

            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await authAPI.register(name, email, password);

            if (response.success) {
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                setUser(user);
                setIsAuthenticated(true);

                toast.success('Registration successful!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);

            if (response.success) {
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                setUser(user);
                setIsAuthenticated(true);

                toast.success('Login successful!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                await authAPI.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await authAPI.updateProfile(data);

            if (response.success) {
                setUser(response.data.user);
                toast.success('Profile updated successfully!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        loadUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
