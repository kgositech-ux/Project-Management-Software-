import React, { useState } from 'react';
import { Briefcase, X, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_EMAILS } from '../../data/seedData';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, clients } = useProjects();
  const { userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`GPP-2026-0${Math.floor(Math.random() * 90) + 10}`);
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState(clients[0]?.name || 'Rent Partner Harties');
  const [location, setLocation] = useState('Pretoria West, South Africa');
  const [budgetZAR, setBudgetZAR] = useState('4500000');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetCompletionDate, setTargetCompletionDate] = useState('2027-01-30');
  const [tags, setTags] = useState('Civil Works, Pretoria West');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    await addProject({
      title,
      code,
      description,
      status: 'active',
      clientName,
      location,
      budgetZAR: parseFloat(budgetZAR) || 0,
      spentZAR: 0,
      startDate,
      targetCompletionDate,
      completionPercentage: 0,
      managerEmail: userProfile.email,
      managerName: userProfile.displayName,
      collaborators: [ADMIN_EMAILS[0], ADMIN_EMAILS[1], userProfile.email],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdBy: userProfile.email,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Initiate Capital Project
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Pretoria West Tool & Equipment Fleet Hub"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Project Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 font-mono text-amber-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Scope & Technical Summary</label>
            <textarea
              rows={3}
              required
              placeholder="Outline earthmoving, structural steel framing, municipal drainage connections..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Client / Partner</label>
              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Budget (ZAR)</label>
              <input
                type="number"
                value={budgetZAR}
                onChange={(e) => setBudgetZAR(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 font-serif text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Completion</label>
              <input
                type="date"
                value={targetCompletionDate}
                onChange={(e) => setTargetCompletionDate(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
              Initiate Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
