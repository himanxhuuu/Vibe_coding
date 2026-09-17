import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.jsx";

export default function KanbanColumn({ column, tasks, onEditTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[34rem] flex-col rounded-lg border p-4 transition ${
        isOver ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-slate-50"
      }`}
    >
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {column.label} <span className="text-slate-400">({tasks.length})</span>
        </h2>
      </header>

      <SortableContext items={tasks.map((task) => String(task.id))} strategy={verticalListSortingStrategy}>
        <div className="mt-4 flex flex-1 flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
          {tasks.length === 0 && (
            <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-slate-300 bg-white px-4 text-center text-sm text-slate-400">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
