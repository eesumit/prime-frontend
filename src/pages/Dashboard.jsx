import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { tasksAPI } from '../api/tasks';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiList, FiPlus } from 'react-icons/fi';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await tasksAPI.getTasks({ sort: '-createdAt' });
                if (response.success) {
                    const tasks = response.data.tasks;

                    setStats({
                        total: response.data.count,
                        todo: tasks.filter(t => t.status === 'todo').length,
                        inProgress: tasks.filter(t => t.status === 'in-progress').length,
                        completed: tasks.filter(t => t.status === 'completed').length,
                    });

                    setRecentTasks(tasks.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const StatCard = ({ title, count, icon, color }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center space-x-4 card-hover">
            <div className={`p-3 rounded-full ${color} text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="gradient-text">{user?.name}</span>!
                    </h1>
                    <p className="text-gray-600 mt-2">Here's an overview of your tasks.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Tasks"
                        count={stats.total}
                        icon={<FiList className="w-6 h-6" />}
                        color="bg-primary-500"
                    />
                    <StatCard
                        title="To Do"
                        count={stats.todo}
                        icon={<FiClock className="w-6 h-6" />}
                        color="bg-gray-500"
                    />
                    <StatCard
                        title="In Progress"
                        count={stats.inProgress}
                        icon={<FiClock className="w-6 h-6" />}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Completed"
                        count={stats.completed}
                        icon={<FiCheckCircle className="w-6 h-6" />}
                        color="bg-green-500"
                    />
                </div>

                {/* Recent Tasks Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
                    <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        View All
                    </Link>
                </div>

                {recentTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={() => { }} // Read-only in dashboard
                                onDelete={() => { }} // Read-only in dashboard
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <FiList className="w-full h-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first task.</p>
                        <Link to="/tasks" className="btn-primary inline-flex items-center">
                            <FiPlus className="mr-2" />
                            Create Task
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
