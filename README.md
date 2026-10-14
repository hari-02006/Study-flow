# Studyflow — Student Task & Study Planner

Studyflow is a responsive, client-side task planner for students. Organize assignments and study sessions by subject, due date, priority, and estimated time. Tasks are saved in the browser with `localStorage`; no backend, account, or paid service is required.

## Objectives

- Practice reusable React functional components, props, state, and effects.
- Demonstrate interactive task management and client-side form validation.
- Persist user-created tasks locally and present useful progress statistics.
- Build a responsive interface that works on desktop, tablet, and mobile.

## Features

- Dashboard with total, completed, pending, and overdue task counts.
- Completion percentage and progress bar that update when tasks change.
- Create and edit tasks with title, subject, priority, due date, estimated minutes, and optional description.
- Delete tasks with a confirmation step; mark tasks completed or pending.
- Search task titles, filter by subject, priority, and status, and sort by due date or priority.
- Inline validation messages, success/error notifications, empty states, and responsive layouts.
- Persistent task data in browser `localStorage`, with invalid stored data handled safely.

## Technologies

- React 18 and React Hooks (`useState`, `useEffect`, `useMemo`)
- Vite
- JavaScript (ES modules), HTML5, and CSS3
- Browser `localStorage`

## Installation and local development

Prerequisites: Node.js 18 or later and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
me/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    └── components/
        ├── Dashboard.jsx
        ├── FilterBar.jsx
        ├── Notification.jsx
        ├── TaskForm.jsx
        ├── TaskItem.jsx
        └── TaskList.jsx
```

`App.jsx` owns the task data, filtering, persistence, and task actions. The components render the dashboard, form, filters, notifications, and task cards from props.

## Validation rules

- Task title is required and must contain at least 3 non-whitespace characters (up to 100 characters).
- Subject and priority must be selected.
- Due date is required and cannot be in the past when creating a task. Existing tasks can retain a past due date while being edited.
- Estimated study time must be a positive number and cannot exceed 1,440 minutes.
- Description is optional and limited to 500 characters.
- Invalid form submission is blocked and field-specific errors are shown. Errors update as fields are corrected.

## Testing checklist

Use these manual checks in the running app:

1. Submit the empty form and confirm errors appear for required fields.
2. Enter a one- or two-character title and confirm the minimum-length error.
3. Leave subject unselected and submit.
4. Enter zero and a negative study time; confirm they are rejected.
5. Enter a value greater than 1,440; confirm it is rejected.
6. Try selecting a past date for a new task; confirm it is blocked.
7. Add a task with valid details and confirm it appears with a success notification.
8. Edit a task and confirm the form is populated and changes are saved.
9. Delete a task and confirm the browser asks for confirmation.
10. Toggle a task completed and pending; verify dashboard statistics change.
11. Search by title and exercise subject, priority, status, and sorting controls.
12. Refresh the page and confirm tasks remain; inspect with malformed `studyflow-tasks` data in browser storage to confirm the app remains usable.
13. Resize the browser to desktop, tablet, and mobile widths; check navigation, form, filters, and task cards.

## Deployment to Vercel

1. Create a GitHub repository and push this project:

   ```bash
   git init
   git add .
   git commit -m "Build student task planner"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

2. Sign in to [Vercel](https://vercel.com/) and select **Add New → Project**.
3. Import the GitHub repository. If the app is in a subdirectory, set the project root to `me`; if the repository contains only this project, use the repository root.
4. Confirm Vercel detects Vite. Use `npm run build` as the build command and `dist` as the output directory.
5. Select **Deploy** and wait for the build to finish.
6. Open the deployment URL Vercel provides. Test task creation, editing, validation, filtering, and refresh persistence on the deployed site.
7. Copy the actual Vercel URL from the project dashboard for assignment submission. A deployment URL is not included here because this project has not been deployed.

Every browser stores its own task data. Clearing browser storage or using a different browser/device will not transfer the task list.
