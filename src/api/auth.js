import axiosInstance from './axios';

export const authAPI = {
    register: async (name, email, password) => {
        const response = await axiosInstance.post('/api/auth/register', {
            name,
            email,
            password,
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await axiosInstance.post('/api/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    logout: async (refreshToken) => {
        const response = await axiosInstance.post('/api/auth/logout', {
            refreshToken,
        });
        return response.data;
    },

    refreshToken: async (refreshToken) => {
        const response = await axiosInstance.post('/api/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },

    getProfile: async () => {
        const response = await axiosInstance.get('/api/users/profile');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await axiosInstance.put('/api/users/profile', data);
        return response.data;
    },

    changePassword: async (oldPassword, newPassword) => {
        const response = await axiosInstance.put('/api/users/password', {
            oldPassword,
            newPassword,
        });
        return response.data;
    },
};
