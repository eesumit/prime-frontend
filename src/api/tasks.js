import axiosInstance from './axios';

export const tasksAPI = {
    getTasks: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.sort) params.append('sort', filters.sort);

        const response = await axiosInstance.get(`/api/tasks?${params.toString()}`);
        return response.data;
    },

    getTask: async (id) => {
        const response = await axiosInstance.get(`/api/tasks/${id}`);
        return response.data;
    },

    createTask: async (data) => {
        const response = await axiosInstance.post('/api/tasks', data);
        return response.data;
    },

    updateTask: async (id, data) => {
        const response = await axiosInstance.put(`/api/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id) => {
        const response = await axiosInstance.delete(`/api/tasks/${id}`);
        return response.data;
    },
};
