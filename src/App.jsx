import { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import FilterBar from "./components/FilterBar.jsx";
import Notification from "./components/Notification.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { getLocalDateString } from "./utils/date.js";

const STORAGE_KEY = "studyflow-tasks";
const VALID_SUBJECTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "English",
  "Other",
];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

function isStoredTask(task) {
  if (
    !task ||
    typeof task.id !== "string" ||
    typeof task.title !== "string" ||
    task.title.trim().length < 3 ||
    !VALID_SUBJECTS.includes(task.subject) ||
    !VALID_PRIORITIES.includes(task.priority) ||
    typeof task.dueDate !== "string" ||
    typeof task.studyTime !== "number" ||
    !Number.isFinite(task.studyTime) ||
    task.studyTime <= 0 ||
    task.studyTime > 1440 ||
    typeof task.completed !== "boolean" ||
    (task.description !== undefined && typeof task.description !== "string")
  ) {
    return false;
  }

  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(task.dueDate);
  if (!dateParts) return false;
  const [, year, month, day] = dateParts.map(Number);
  const dueDate = new Date(year, month - 1, day);
  return (
    dueDate.getFullYear() === year &&
    dueDate.getMonth() === month - 1 &&
    dueDate.getDate() === day
  );
}

function readSavedTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) return [];

    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks)) return [];

    return parsedTasks.filter(isStoredTask);
  } catch (error) {
    console.error("Could not load saved tasks from localStorage.", error);
    return [];
  }
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    subject: "All subjects",
    priority: "All priorities",
    status: "All tasks",
    sort: "dueDate",
  });

  useEffect(() => {
    setTasks(readSavedTasks());
    setIsStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save tasks to localStorage.", error);
      setNotification({
        type: "error",
        message: "Your changes could not be saved in this browser.",
      });
    }
  }, [isStorageLoaded, tasks]);

  useEffect(() => {
    if (!notification) return undefined;
    const timeoutId = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const today = getLocalDateString();

  const visibleTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return tasks
      .filter((task) => task.title.toLowerCase().includes(query))
      .filter(
        (task) =>
          filters.subject === "All subjects" ||
          task.subject === filters.subject,
      )
      .filter(
        (task) =>
          filters.priority === "All priorities" ||
          task.priority === filters.priority,
      )
      .filter((task) => {
        if (filters.status === "Pending") return !task.completed;
        if (filters.status === "Completed") return task.completed;
        if (filters.status === "Overdue") {
          return !task.completed && task.dueDate < today;
        }
        return true;
      })
      .sort((first, second) => {
        if (filters.sort === "priority") {
          const priorityRank = { High: 0, Medium: 1, Low: 2 };
          return priorityRank[first.priority] - priorityRank[second.priority];
        }
        return first.dueDate.localeCompare(second.dueDate);
      });
  }, [filters, tasks, today]);

  function showNotification(type, message) {
    setNotification({ type, message, key: Date.now() });
  }

  function saveTask(taskDetails) {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...taskDetails, id: task.id }
            : task,
        ),
      );
      setEditingTask(null);
      showNotification("success", "Your task has been updated.");
      return;
    }

    setTasks((currentTasks) => [
      {
        ...taskDetails,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTasks,
    ]);
    showNotification("success", "Your task has been added.");
  }

  function startEditing(task) {
    setEditingTask(task);
    document.getElementById("task-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function cancelEditing() {
    setEditingTask(null);
  }

  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || !window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== taskId),
    );
    if (editingTask?.id === taskId) setEditingTask(null);
    showNotification("success", "Task deleted.");
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Studyflow home">
          <span className="brand-mark" aria-hidden="true">s</span>
          <span>studyflow</span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-navigation" aria-label="Main navigation">
          <a className="nav-link active" href="#overview">
            <span className="nav-icon" aria-hidden="true">◫</span> Overview
          </a>
          <a className="nav-link" href="#tasks">
            <span className="nav-icon" aria-hidden="true">☷</span> My tasks
            <span className="nav-count">{tasks.filter((task) => !task.completed).length}</span>
          </a>
          <a className="nav-link" href="#task-form">
            <span className="nav-icon" aria-hidden="true">＋</span> Add a task
          </a>
        </nav>
        <div className="sidebar-note">
          <span className="note-sparkle" aria-hidden="true">✦</span>
          <strong>Small steps add up.</strong>
          <p>Stay focused, take breaks, and keep showing up for yourself.</p>
        </div>
        <div className="sidebar-footer">
          <span className="avatar">S</span>
          <span><strong>Student workspace</strong><small>Your personal planner</small></span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Overview</div>
          <div className="topbar-date">
            <span className="status-dot" /> Your study space
          </div>
        </header>

        <div className="page-content">
          <section id="overview" className="welcome-section">
            <div>
              <p className="eyebrow">YOUR STUDY SPACE</p>
              <h1>Make today count<span>.</span></h1>
              <p className="welcome-subtitle">
                One focused session at a time. You&apos;ve got this.
              </p>
            </div>
            <a className="primary-button welcome-button" href="#task-form">
              <span aria-hidden="true">＋</span> Add a task
            </a>
          </section>

          <Dashboard tasks={tasks} />

          <section id="task-form" className="content-panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">{editingTask ? "KEEP IT MOVING" : "PLAN AHEAD"}</p>
                <h2>{editingTask ? "Update your task" : "Add a new task"}</h2>
                <p className="panel-description">
                  {editingTask
                    ? "Make changes to your task details below."
                    : "Break your goals into manageable steps."}
                </p>
              </div>
              <span className="panel-icon" aria-hidden="true">✎</span>
            </div>
            <TaskForm
              key={editingTask?.id ?? "new-task"}
              taskToEdit={editingTask}
              onSave={saveTask}
              onCancel={cancelEditing}
            />
          </section>

          <section id="tasks" className="tasks-section">
            <div className="tasks-heading">
              <div>
                <p className="eyebrow">YOUR WORKLOAD</p>
                <h2>My tasks <span className="heading-count">{tasks.length}</span></h2>
              </div>
              <p className="tasks-helper">Keep your next step in sight.</p>
            </div>
            <FilterBar filters={filters} onChange={setFilters} />
            <TaskList
              tasks={visibleTasks}
              totalTasks={tasks.length}
              onEdit={startEditing}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onClearFilters={() =>
                setFilters({
                  search: "",
                  subject: "All subjects",
                  priority: "All priorities",
                  status: "All tasks",
                  sort: "dueDate",
                })
              }
            />
          </section>
          <footer className="page-footer">
            <span>Made for your next big idea.</span>
            <span>Studyflow <span className="footer-heart">♥</span> Study smarter, not harder.</span>
          </footer>
        </div>
      </main>
      <Notification notification={notification} onDismiss={() => setNotification(null)} />
    </div>
  );
}

export default App;
