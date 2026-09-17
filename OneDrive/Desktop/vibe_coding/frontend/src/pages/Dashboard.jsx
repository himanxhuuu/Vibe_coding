import { useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Plus, UserPlus } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import KanbanColumn from "../components/KanbanColumn.jsx";
import TaskModal from "../components/TaskModal.jsx";
import UserModal from "../components/UserModal.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PRIORITIES, STATUSES } from "../utils/constants.js";
import {
  addProjectMember,
  createTask,
  createUser,
  deleteTask,
  getApiErrorMessage,
  getProjectMembers,
  getProjects,
  getTasks,
  getUsers,
  getWorkloads,
  updateTask,
  updateTaskStatus
} from "../services/api.js";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [userModalOpen, setUserModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  async function loadBase() {
    setLoading(true);
    setError("");
    try {
      const [projectData, userData, workloadData] = await Promise.all([getProjects(), getUsers(), getWorkloads()]);
      setProjects(projectData);
      setUsers(userData);
      setWorkloads(workloadData);
      const projectId = selectedProjectId || projectData[0]?.id || "";
      setSelectedProjectId(projectId);
      if (projectId) {
        const [taskData, memberData] = await Promise.all([
          getTasks({ projectId, priority }),
          getProjectMembers(projectId)
        ]);
        setTasks(taskData);
        setMembers(memberData);
      } else {
        setTasks([]);
        setMembers([]);
      }
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  }

  async function loadTasksAndWorkload(projectId = selectedProjectId, activePriority = priority) {
    if (!projectId) return;
    const [taskData, workloadData, memberData, userData] = await Promise.all([
      getTasks({ projectId, priority: activePriority }),
      getWorkloads(),
      getProjectMembers(projectId),
      getUsers()
    ]);
    setTasks(taskData);
    setWorkloads(workloadData);
    setMembers(memberData);
    setUsers(userData);
  }

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    if (selectedProjectId && !loading) {
      loadTasksAndWorkload().catch((apiError) => setError(getApiErrorMessage(apiError)));
    }
  }, [selectedProjectId, priority]);

  const selectedProject = projects.find((project) => project.id === Number(selectedProjectId));
  const groupedTasks = useMemo(
    () =>
      STATUSES.reduce((acc, status) => {
        acc[status.id] = tasks.filter((task) => task.status === status.id);
        return acc;
      }, {}),
    [tasks]
  );

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const nextStatus = STATUSES.some((status) => status.id === over.id)
      ? over.id
      : tasks.find((task) => String(task.id) === String(over.id))?.status;
    const task = tasks.find((item) => item.id === taskId);

    if (!task || !nextStatus || task.status === nextStatus) return;
    const previousTasks = tasks;
    setTasks((current) => current.map((item) => (item.id === taskId ? { ...item, status: nextStatus } : item)));

    try {
      await updateTaskStatus(taskId, nextStatus);
      await loadTasksAndWorkload();
    } catch (apiError) {
      setTasks(previousTasks);
      setError(getApiErrorMessage(apiError));
    }
  }

  async function saveTask(payload) {
    setBusy(true);
    try {
      if (taskModal.task) {
        await updateTask(taskModal.task.id, payload);
      } else {
        await createTask(payload);
      }
      setTaskModal({ open: false, task: null });
      await loadTasksAndWorkload(payload.projectId, priority);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setBusy(false);
    }
  }

  async function removeTask(id) {
    setBusy(true);
    try {
      await deleteTask(id);
      setTaskModal({ open: false, task: null });
      await loadTasksAndWorkload();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setBusy(false);
    }
  }

  async function addNewUser(payload) {
    setBusy(true);
    try {
      const user = await createUser(payload);
      await addProjectMember(selectedProjectId, user.id);
      setUserModalOpen(false);
      await loadTasksAndWorkload();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setBusy(false);
    }
  }

  async function addExistingUser(userId) {
    setBusy(true);
    try {
      await addProjectMember(selectedProjectId, userId);
      setUserModalOpen(false);
      await loadTasksAndWorkload();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar
        projects={projects}
        selectedProjectId={Number(selectedProjectId)}
        onSelectProject={setSelectedProjectId}
        workloads={workloads}
      />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {error && <ErrorState message={error} onRetry={loadBase} />}

        {!error && (
          <>
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Project</p>
                <h1 className="mt-1 text-2xl font-black text-slate-950">{selectedProject?.name || "No project"}</h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">{selectedProject?.description}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex rounded-md border border-slate-200 bg-white p-1">
                  {PRIORITIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPriority(item.id)}
                      className={`rounded px-3 py-2 text-sm font-semibold ${
                        priority === item.id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setUserModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserPlus size={16} />
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setTaskModal({ open: true, task: null })}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
            </header>

            <section className="mt-6">
              {tasks.length === 0 ? (
                <EmptyState onCreate={() => setTaskModal({ open: true, task: null })} />
              ) : (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    {STATUSES.map((column) => (
                      <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={groupedTasks[column.id] || []}
                        onEditTask={(task) => setTaskModal({ open: true, task })}
                      />
                    ))}
                  </div>
                </DndContext>
              )}
            </section>
          </>
        )}
      </main>

      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          projects={projects}
          users={members.length > 0 ? members : users}
          defaultProjectId={selectedProjectId}
          onClose={() => setTaskModal({ open: false, task: null })}
          onSave={saveTask}
          onDelete={removeTask}
          saving={busy}
        />
      )}

      {userModalOpen && (
        <UserModal
          existingUsers={users}
          projectMembers={members}
          onClose={() => setUserModalOpen(false)}
          onCreateUser={addNewUser}
          onAddExisting={addExistingUser}
          saving={busy}
        />
      )}
    </div>
  );
}
