import React, { useState } from 'react';
import { CheckSquare, X } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { TaskPriority } from '../../types';
import { INITIAL_USERS } from '../../data/seedData';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose }) => {
  const { projects, selectedProjectId, addTask, milestones } = useProjects();
  const { userProfile } = useAuth();

  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeEmail, setAssigneeEmail] = useState(userProfile.email);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [checklistText, setChecklistText] = useState('Inspect site safety clearance\nConfirm delivery with Rent Partner Harties\nSign-off QA sheet');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedUser = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === assigneeEmail.toLowerCase()
    );

    const checklistItems = checklistText
      .split('\n')
      .map((item, idx) => item.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        text,
        completed: false,
      }));

    await addTask({
      projectId,
      title,
      description,
      status: 'todo',
      priority,
      assigneeEmail,
      assigneeName: assignedUser?.displayName || assigneeEmail.split('@')[0],
      dueDate,
      progressPercentage: 0,
      checklist: checklistItems,
      createdBy: userProfile.email,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            Create Work Task
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Target Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Concrete Compaction & Quality Verification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Description & Requirements</label>
            <textarea
              rows={3}
              placeholder="Provide technical instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Assignee</label>
            <select
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
            >
              {INITIAL_USERS.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.displayName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Checklist Steps (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Step 1&#10;Step 2&#10;Step 3"
              value={checklistText}
              onChange={(e) => setChecklistText(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#202a3a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#18202d] text-slate-300 rounded-lg hover:bg-[#202b3c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg transition"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
