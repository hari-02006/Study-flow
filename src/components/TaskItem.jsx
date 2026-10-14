import { getLocalDateString } from "../utils/date.js";

function formatDueDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TaskItem({ task, onEdit, onDelete, onToggle }) {
  const today = getLocalDateString();
  const isOverdue = !task.completed && task.dueDate < today;

  return (
    <article className={`task-card${task.completed ? " task-completed" : ""}${isOverdue ? " task-overdue" : ""}`}>
      <button
        className={`task-checkbox${task.completed ? " checked" : ""}`}
        type="button"
        onClick={onToggle}
        aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`}
        aria-pressed={task.completed}
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>
      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            <span aria-hidden="true">●</span> {task.priority}
          </span>
          {task.completed && <span className="completed-badge">Completed</span>}
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className="subject-chip">{task.subject}</span>
          <span className={`task-meta-item${isOverdue ? " overdue-text" : ""}`}>
            <span aria-hidden="true">▦</span> {isOverdue ? "Overdue · " : "Due "}
            {formatDueDate(task.dueDate)}
          </span>
          <span className="task-meta-item"><span aria-hidden="true">◷</span> {task.studyTime} min</span>
        </div>
      </div>
      <div className="task-actions">
        <button type="button" className="icon-button" onClick={onEdit} aria-label={`Edit ${task.title}`}>
          <span aria-hidden="true">✎</span>
        </button>
        <button type="button" className="icon-button delete-button" onClick={onDelete} aria-label={`Delete ${task.title}`}>
          <span aria-hidden="true">⌫</span>
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
