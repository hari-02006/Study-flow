import { getLocalDateString } from "../utils/date.js";

function Dashboard({ tasks }) {
  const today = getLocalDateString();
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.dueDate < today,
  ).length;
  const completion = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;
  const stats = [
    { label: "Total tasks", value: tasks.length, icon: "▤", tone: "lavender" },
    { label: "Completed", value: completedTasks, icon: "✓", tone: "mint" },
    { label: "Pending", value: pendingTasks, icon: "◷", tone: "blue" },
    { label: "Overdue", value: overdueTasks, icon: "!", tone: "peach" },
  ];

  return (
    <section className="dashboard-section" aria-label="Study overview">
      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span className={`stat-icon ${stat.tone}`} aria-hidden="true">{stat.icon}</span>
            <div className="stat-copy">
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </div>
            <span className={`stat-indicator ${stat.tone}`} aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
      <article className="progress-card">
        <div className="progress-copy">
          <span className="progress-icon" aria-hidden="true">✦</span>
          <div>
            <span className="progress-label">Your study progress</span>
            <p>{completedTasks} of {tasks.length} tasks completed</p>
          </div>
        </div>
        <div className="progress-tracker">
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Overall task completion"
            aria-valuenow={completion}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span style={{ width: `${completion}%` }} />
          </div>
          <strong>{completion}%</strong>
        </div>
      </article>
    </section>
  );
}

export default Dashboard;
