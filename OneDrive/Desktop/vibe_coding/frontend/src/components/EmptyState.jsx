import { Plus } from "lucide-react";

export default function EmptyState({ onCreate }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-base font-semibold text-slate-900">No tasks found</h3>
      <p className="mt-1 text-sm text-slate-500">Create a task or change the active filters.</p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        <Plus size={16} />
        Create Task
      </button>
    </div>
  );
}
