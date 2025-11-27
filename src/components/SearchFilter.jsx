import { FiSearch, FiX } from 'react-icons/fi';

const SearchFilter = ({ filters, onFilterChange, onClear }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search tasks..."
                        className="input-field pl-10"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="">All Statuses</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Priority Filter */}
                <div className="flex space-x-2">
                    <select
                        name="priority"
                        value={filters.priority}
                        onChange={handleChange}
                        className="input-field flex-grow"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <button
                        onClick={onClear}
                        className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-300"
                        title="Clear Filters"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
