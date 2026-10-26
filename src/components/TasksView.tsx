import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  List,
  Columns,
  Trash2,
  Calendar,
  Filter,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TasksViewProps {
  onOpenNewTaskModal: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenNewTaskModal }) => {
  const {
    tasks,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    updateTask,
    deleteTask,
    searchQuery,
  } = useProjects();
  const { isProjectManager } = useAuth();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    const matchesProject = !selectedProjectId || task.projectId === selectedProjectId;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesPriority && matchesSearch;
  });

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-600/40 text-slate-300' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-500/40 text-blue-400' },
    { id: 'review', label: 'Under Review', color: 'border-purple-500/40 text-purple-400' },
    { id: 'completed', label: 'Completed', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleToggleChecklist = (taskId: string, checkId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.checklist) return;
    const updatedChecklist = task.checklist.map((item) =>
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );
    const completedCount = updatedChecklist.filter((c) => c.completed).length;
    const pct = Math.round((completedCount / updatedChecklist.length) * 100);
    updateTask(taskId, {
      checklist: updatedChecklist,
      progressPercentage: pct,
      status: pct === 100 ? 'completed' : task.status === 'completed' ? 'in_progress' : task.status,
    });
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'medium':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'low':
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#141a24] p-1 rounded-xl border border-[#232e42]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table List
            </button>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1">
            {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${
                  priorityFilter === p
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:bg-[#18202d]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {isProjectManager && (
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-xl shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4 text-black" />
            Create Work Task
          </button>
        )}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#11151f] border border-[#1e2738] rounded-2xl p-4 flex flex-col space-y-3 min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1e2738]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'completed' ? 'bg-emerald-400' : col.id === 'review' ? 'bg-purple-400' : col.id === 'in_progress' ? 'bg-blue-400' : 'bg-slate-400'}`} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1b2331] text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-[#1f2838] rounded-xl">
                      No tasks in this stage
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const project = projects.find((p) => p.id === task.projectId);
                      return (
                        <div
                          key={task.id}
                          className="bg-[#161c28] hover:bg-[#1a2233] border border-[#232e42] hover:border-amber-500/40 rounded-xl p-4 space-y-3 shadow-sm transition"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                              {project?.code || 'GPP'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded uppercase font-bold border ${getPriorityBadge(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-100">{task.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Checklist items if any */}
                          {task.checklist && task.checklist.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <div className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
                                <span>Subtasks</span>
                                <span className="text-amber-300">
                                  {task.checklist.filter((c) => c.completed).length} /{' '}
                                  {task.checklist.length}
                                </span>
                              </div>
                              <div className="space-y-1">
                                {task.checklist.map((item) => (
                                  <label
                                    key={item.id}
                                    className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={item.completed}
                                      onChange={() => handleToggleChecklist(task.id, item.id)}
                                      className="rounded bg-[#11151f] border-slate-600 text-amber-500 focus:ring-0"
                                    />
                                    <span
                                      className={
                                        item.completed ? 'line-through text-slate-500' : ''
                                      }
                                    >
                                      {item.text}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Assignee & Due Date */}
                          <div className="pt-2 border-t border-[#1e2738] flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5 truncate">
                              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">{task.assigneeName}</span>
                            </div>
                            <span className="shrink-0 flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Move to status actions */}
                          <div className="pt-1 flex items-center justify-between gap-1 text-[10px]">
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                              className="bg-[#121620] border border-[#253247] text-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-amber-400"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">Under Review</option>
                              <option value="completed">Completed</option>
                            </select>

                            {isProjectManager && (
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-[#11151f] border border-[#1e2738] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#161c28] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-[#20293b]">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Task Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2738]">
                {filteredTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);
                  return (
                    <tr key={task.id} className="hover:bg-[#161c28]/60 transition">
                      <td className="p-4 font-mono font-bold text-amber-400">
                        {proj?.code || 'GPP'}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-100">{task.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{task.description}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className="bg-[#141a24] border border-[#232e42] text-slate-200 rounded px-2 py-1 text-xs"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded uppercase font-bold border text-[10px] ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-300">{task.assigneeName}</td>
                      <td className="p-4 text-slate-400">{task.dueDate}</td>
                      <td className="p-4 text-right">
                        {isProjectManager && (
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
