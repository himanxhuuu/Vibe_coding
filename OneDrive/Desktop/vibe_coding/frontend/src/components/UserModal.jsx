import { useState } from "react";
import { X } from "lucide-react";

export default function UserModal({ existingUsers, projectMembers, onClose, onCreateUser, onAddExisting, saving }) {
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState({ name: "", email: "" });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [errors, setErrors] = useState({});
  const memberIds = new Set(projectMembers.map((user) => user.id));
  const availableUsers = existingUsers.filter((user) => !memberIds.has(user.id));

  async function submit(event) {
    event.preventDefault();
    setErrors({});
    if (mode === "create") {
      if (!form.name.trim()) return setErrors({ name: "Name is required" });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setErrors({ email: "Valid email is required" });
      await onCreateUser({ name: form.name.trim(), email: form.email.trim() });
      return;
    }

    if (!selectedUserId) return setErrors({ selectedUserId: "Choose a user" });
    await onAddExisting(Number(selectedUserId));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-lg bg-white shadow-soft">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-950">Add User</h2>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
            <button type="button" onClick={() => setMode("create")} className={`rounded px-3 py-2 text-sm font-semibold ${mode === "create" ? "bg-white shadow-sm" : "text-slate-500"}`}>
              New user
            </button>
            <button type="button" onClick={() => setMode("existing")} className={`rounded px-3 py-2 text-sm font-semibold ${mode === "existing" ? "bg-white shadow-sm" : "text-slate-500"}`}>
              Existing user
            </button>
          </div>

          {mode === "create" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </label>
            </div>
          ) : (
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">User</span>
              <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900">
                <option value="">Select user</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.selectedUserId && <p className="mt-1 text-xs text-red-600">{errors.selectedUserId}</p>}
            </label>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? "Saving..." : "Add User"}
          </button>
        </footer>
      </form>
    </div>
  );
}
