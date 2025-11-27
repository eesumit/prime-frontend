import { useState, useEffect } from 'react';
import { tasksAPI } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import SearchFilter from '../components/SearchFilter';
import { FiPlus, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        sort: '-createdAt',
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await tasksAPI.getTasks(filters);
            if (response.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (data) => {
        try {
            setFormLoading(true);
            const response = await tasksAPI.createTask(data);
            if (response.success) {
                toast.success('Task created successfully');
                setIsModalOpen(false);
                fetchTasks();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateTask = async (data) => {
        try {
            setFormLoading(true);
            const response = await tasksAPI.updateTask(editingTask._id, data);
            if (response.success) {
                toast.success('Task updated successfully');
                setIsModalOpen(false);
                setEditingTask(null);
                fetchTasks();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update task');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await tasksAPI.deleteTask(id);
                if (response.success) {
                    toast.success('Task deleted successfully');
                    fetchTasks();
                }
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            priority: '',
            sort: '-createdAt',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                        <p className="text-gray-600 mt-1">Manage and track your work</p>
                    </div>
                    <button onClick={openCreateModal} className="btn-primary flex items-center">
                        <FiPlus className="mr-2" />
                        New Task
                    </button>
                </div>

                <SearchFilter
                    filters={filters}
                    onFilterChange={setFilters}
                    onClear={clearFilters}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="spinner"></div>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={openEditModal}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <FiLoader className="w-full h-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-500">
                            {filters.search || filters.status || filters.priority
                                ? 'Try adjusting your filters'
                                : 'Get started by creating a new task'}
                        </p>
                    </div>
                )}

                <TaskForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    initialData={editingTask}
                    loading={formLoading}
                />
            </div>
        </div>
    );
};

export default Tasks;
