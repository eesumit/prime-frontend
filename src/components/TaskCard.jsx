import { FiEdit2, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'todo':
                return <span className="badge badge-todo">To Do</span>;
            case 'in-progress':
                return <span className="badge badge-in-progress">In Progress</span>;
            case 'completed':
                return <span className="badge badge-completed">Completed</span>;
            default:
                return <span className="badge badge-todo">{status}</span>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'low':
                return <span className="badge badge-low">Low</span>;
            case 'medium':
                return <span className="badge badge-medium">Medium</span>;
            case 'high':
                return <span className="badge badge-high">High</span>;
            default:
                return <span className="badge badge-medium">{priority}</span>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 card-hover border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="flex space-x-2">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                        title="Edit"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{task.description}</p>

            <div className="flex items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                <FiCalendar className="mr-1" />
                <span className="mr-4">Created: {formatDate(task.createdAt)}</span>
                <FiClock className="mr-1" />
                <span>Updated: {formatDate(task.updatedAt)}</span>
            </div>
        </div>
    );
};

export default TaskCard;
