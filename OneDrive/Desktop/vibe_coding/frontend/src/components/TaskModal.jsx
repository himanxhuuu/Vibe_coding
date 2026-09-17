import { useEffect, useMemo, useState } from "react";
import { Trash2, X } from "lucide-react";
import { PRIORITIES, STATUSES } from "../utils/constants.js";
import { toDateInputValue } from "../utils/formatters.js";

const emptyForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "TODO",
  dueDate: "",
  projectId: "",
  assignedUserId: ""
};

export default function TaskModal({ task, projects, users, defaultProjectId, onClose, onSave, onDelete, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: toDateInputValue(task.dueDate),
        projectId: String(task.projectId),
        assignedUserId: String(task.assignedUserId)
      });
    } else {
      setForm({
        ...emptyForm,
        projectId: defaultProjectId ? String(defaultProjectId) : "",
        dueDate: toDateInputValue(new Date())
      });
    }
    setErrors({});
  }, [task, defaultProjectId]);

  const title = task ? "Edit Task" : "Create Task";
  const projectMembers = useMemo(() => users, [users]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, api: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.priority) nextErrors.priority = "Priority is required";
    if (!form.status) nextErrors.status = "Status is required";
    if (!form.dueDate || Number.isNaN(new Date(form.dueDate).getTime())) nextErrors.dueDate = "Valid due date is required";
    if (!form.projectId) nextErrors.projectId = "Project is required";
    if (!form.assignedUserId) nextErrors.assignedUserId = "Assigned user is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    await onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
      projectId: Number(form.projectId),
      assignedUserId: Number(form.assignedUserId)
    });
  }

  async function confirmDelete() {
    if (task && window.confirm(`Delete "${task.title}"?`)) {
      await onDelete(task.id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-soft">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows="4"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Priority</span>
            <select
              value={form.priority}
              onChange={(event) => updateField("priority", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              {PRIORITIES.filter((priority) => priority.id !== "ALL").map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              {STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Due date</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => updateField("dueDate", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
            {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Project</span>
            <select
              value={form.projectId}
              onChange={(event) => updateField("projectId", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="mt-1 text-xs text-red-600">{errors.projectId}</p>}
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Assigned user</span>
            <select
              value={form.assignedUserId}
              onChange={(event) => updateField("assignedUserId", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              <option value="">Select user</option>
              {projectMembers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assignedUserId && <p className="mt-1 text-xs text-red-600">{errors.assignedUserId}</p>}
          </label>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {task && (
              <button
                type="button"
                onClick={confirmDelete}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
              {saving ? "Saving..." : "Save Task"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
