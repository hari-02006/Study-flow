const SUBJECTS = ["All subjects", "Computer Science", "Mathematics", "Physics", "English", "Other"];
const PRIORITIES = ["All priorities", "High", "Medium", "Low"];
const STATUSES = ["All tasks", "Pending", "Completed", "Overdue"];

function FilterBar({ filters, onChange }) {
  function updateFilter(event) {
    onChange((currentFilters) => ({
      ...currentFilters,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <div className="filter-bar">
      <label className="search-field">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          name="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={updateFilter}
          aria-label="Search tasks by title"
        />
        <kbd>/</kbd>
      </label>
      <div className="filter-controls">
        <label className="visually-hidden" htmlFor="subject-filter">Filter by subject</label>
        <select id="subject-filter" name="subject" value={filters.subject} onChange={updateFilter}>
          {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
        </select>
        <label className="visually-hidden" htmlFor="priority-filter">Filter by priority</label>
        <select id="priority-filter" name="priority" value={filters.priority} onChange={updateFilter}>
          {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
        </select>
        <label className="visually-hidden" htmlFor="status-filter">Filter by status</label>
        <select id="status-filter" name="status" value={filters.status} onChange={updateFilter}>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <label className="visually-hidden" htmlFor="sort-filter">Sort tasks</label>
        <select id="sort-filter" name="sort" value={filters.sort} onChange={updateFilter}>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
