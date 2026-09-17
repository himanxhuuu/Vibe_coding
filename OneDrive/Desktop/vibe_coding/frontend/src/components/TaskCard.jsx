import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CalendarDays, Pencil } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { formatDate } from "../utils/formatters.js";

export default function TaskCard({ task, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task.id)
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-soft ${
        isDragging ? "dragging" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold leading-5 text-slate-950">{task.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{task.description}</p>
        </div>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onEdit(task);
          }}
          className="rounded-md p-1.5 text-slate-400 opacity-100 hover:bg-slate-100 hover:text-slate-700 lg:opacity-0 lg:group-hover:opacity-100"
          aria-label={`Edit ${task.title}`}
          title="Edit task"
        >
          <Pencil size={15} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <StatusBadge priority={task.priority} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          <CalendarDays size={14} />
          {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-500">{task.status.replace("_", " ")}</span>
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {task.assignedUser?.avatarInitials || "U"}
          </span>
          <span className="max-w-28 truncate text-xs font-semibold text-slate-700">{task.assignedUser?.name}</span>
        </div>
      </div>
    </article>
  );
}
