import { FolderKanban, Users } from "lucide-react";

export default function Sidebar({ projects, selectedProjectId, onSelectProject, workloads }) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white p-5 lg:w-72">
      <div>
        <p className="text-xl font-black text-slate-950">TaskFlow</p>
        <p className="mt-1 text-sm text-slate-500">Kanban workload manager</p>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <FolderKanban size={15} />
          Projects
        </div>
        <div className="space-y-2">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                selectedProjectId === project.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 min-h-0 flex-1">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Users size={15} />
          Team
        </div>
        <div className="space-y-3 overflow-auto pr-1">
          {workloads.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    user.isOverloaded
                      ? "animate-pulse bg-red-600 text-white ring-4 ring-red-100"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  title={user.isOverloaded ? "Overloaded: more than 5 tasks in progress" : "Normal workload"}
                >
                  {user.avatarInitials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className={user.isOverloaded ? "text-xs font-semibold text-red-600" : "text-xs text-slate-500"}>
                    {user.inProgressCount} in progress
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
