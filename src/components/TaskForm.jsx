import { useEffect, useState } from "react";
import { getLocalDateString } from "../utils/date.js";

const EMPTY_FORM = {
  title: "",
  subject: "",
  priority: "",
  dueDate: "",
  studyTime: "",
  description: "",
};

const SUBJECTS = ["Computer Science", "Mathematics", "Physics", "English", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

function validateField(name, value, taskToEdit) {
  if (name === "title") {
    if (!value.trim()) return "Please enter a task title.";
    if (value.trim().length < 3) return "Title must be at least 3 characters.";
  }
  if (name === "subject" && !value) return "Please choose a subject.";
  if (name === "priority" && !value) return "Please choose a priority.";
  if (name === "dueDate" && !value) return "Please choose a due date.";
  if (
    name === "dueDate" &&
    value &&
    !taskToEdit &&
    value < getLocalDateString()
  ) {
    return "Due date cannot be in the past.";
  }
  if (name === "studyTime") {
    const minutes = Number(value);
    if (!value || !Number.isFinite(minutes) || minutes <= 0) {
      return "Study time must be a positive number.";
    }
    if (minutes > 1440) return "Study time cannot exceed 1,440 minutes.";
  }
  return "";
}

function getFormValues(task) {
  if (!task) return EMPTY_FORM;
  return {
    title: task.title,
    subject: task.subject,
    priority: task.priority,
    dueDate: task.dueDate,
    studyTime: String(task.studyTime),
    description: task.description ?? "",
  };
}

function TaskForm({ taskToEdit, onSave, onCancel }) {
  const [values, setValues] = useState(() => getFormValues(taskToEdit));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(getFormValues(taskToEdit));
    setErrors({});
  }, [taskToEdit]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateField(name, value, taskToEdit),
    }));
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateField(name, value, taskToEdit),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries(values).map(([name, value]) => [
        name,
        validateField(name, value, taskToEdit),
      ]),
    );
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    onSave({
      title: values.title.trim(),
      subject: values.subject,
      priority: values.priority,
      dueDate: values.dueDate,
      studyTime: Number(values.studyTime),
      description: values.description.trim(),
    });
    setValues(EMPTY_FORM);
    setErrors({});
  }

  function fieldClass(name) {
    return `form-control${errors[name] ? " has-error" : ""}`;
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field-group field-wide">
          <label htmlFor="title">Task title <span className="required">*</span></label>
          <input
            className={fieldClass("title")}
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Review chapter 4 notes"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="100"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && <span className="field-error" id="title-error">{errors.title}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="subject">Subject <span className="required">*</span></label>
          <select
            className={fieldClass("subject")}
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
          {errors.subject && <span className="field-error" id="subject-error">{errors.subject}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="priority">Priority <span className="required">*</span></label>
          <select
            className={fieldClass("priority")}
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={errors.priority ? "priority-error" : undefined}
          >
            <option value="">Choose priority</option>
            {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
          {errors.priority && <span className="field-error" id="priority-error">{errors.priority}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="dueDate">Due date <span className="required">*</span></label>
          <input
            className={fieldClass("dueDate")}
            id="dueDate"
            name="dueDate"
            type="date"
            min={taskToEdit ? undefined : getLocalDateString()}
            value={values.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
          />
          {errors.dueDate && <span className="field-error" id="dueDate-error">{errors.dueDate}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="studyTime">Study time <span className="required">*</span></label>
          <div className={`input-with-suffix${errors.studyTime ? " has-error" : ""}`}>
            <input
              id="studyTime"
              name="studyTime"
              type="number"
              min="0.01"
              max="1440"
              step="any"
              placeholder="e.g. 45"
              value={values.studyTime}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.studyTime)}
              aria-describedby={errors.studyTime ? "studyTime-error" : "studyTime-hint"}
            />
            <span>min</span>
          </div>
          {errors.studyTime
            ? <span className="field-error" id="studyTime-error">{errors.studyTime}</span>
            : <span className="field-hint" id="studyTime-hint">Up to 1,440 minutes</span>}
        </div>
        <div className="field-group field-wide">
          <label htmlFor="description">Description <span className="optional">(optional)</span></label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            placeholder="Add a few details to help you get started..."
            rows="3"
            maxLength="500"
            value={values.description}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-actions">
        {taskToEdit && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="primary-button submit-button" type="submit">
          <span aria-hidden="true">{taskToEdit ? "✓" : "＋"}</span>
          {taskToEdit ? "Update task" : "Add task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
