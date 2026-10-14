import TaskItem from "./TaskItem.jsx";

function TaskList({ tasks, totalTasks, onEdit, onDelete, onToggle, onClearFilters }) {
  if (!totalTasks) {
    return (
      <div className="empty-state">
        <span className="empty-illustration" aria-hidden="true">✎</span>
        <h3>Your task list is a blank page.</h3>
        <p>Add your first task above and start building momentum.</p>
        <a className="secondary-button empty-button" href="#task-form">Create a task</a>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="empty-state compact-empty">
        <span className="empty-illustration" aria-hidden="true">⌕</span>
        <h3>No tasks found</h3>
        <p>Try adjusting your search or filters.</p>
        <button className="text-button" type="button" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          onToggle={() => onToggle(task.id)}
        />
      ))}
    </div>
  );
}

export default TaskList;
