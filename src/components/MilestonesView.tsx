import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Plus,
  ShieldCheck,
  Check,
  Flag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Milestone, MilestoneStatus } from '../types';

export const MilestonesView: React.FC = () => {
  const {
    milestones,
    projects,
    selectedProjectId,
    updateMilestone,
    addMilestone,
    searchQuery,
  } = useProjects();
  const { isProjectManager, userProfile } = useAuth();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProjId, setNewProjId] = useState(projects[0]?.id || '');
  const [newDueDate, setNewDueDate] = useState('2026-12-31');
  const [newDeliverables, setNewDeliverables] = useState('');

  const filteredMilestones = milestones.filter((m) => {
    const matchesProj = !selectedProjectId || m.projectId === selectedProjectId;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesStatus && matchesSearch;
  });

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const inProgressCount = milestones.filter((m) => m.status === 'in_progress').length;
  const averageProgress = Math.round(
    milestones.reduce((acc, m) => acc + m.progress, 0) / (milestones.length || 1)
  );

  const handleSignOff = (milestoneId: string) => {
    updateMilestone(milestoneId, {
      status: 'completed',
      progress: 100,
      signOffBy: userProfile.displayName,
      signOffDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addMilestone({
      projectId: newProjId,
      title: newTitle,
      description: newDesc,
      dueDate: newDueDate,
      status: 'pending',
      progress: 0,
      deliverables: newDeliverables
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
    });

    setNewTitle('');
    setNewDesc('');
    setNewDeliverables('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Milestone Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121622] border border-[#1e2738] rounded-xl p-5 shadow-sm">
          <div className="text-xs uppercase font-bold text-slate-400">Total Milestones</div>
          <div className="text-3xl font-serif font-bold text-[#e5c07b] mt-1">
            {milestones.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Strategic infrastructure delivery points</p>
        </div>

        <div className="bg-[#121622] border border-[#1e2738] rounded-xl p-5 shadow-sm">
          <div className="text-xs uppercase font-bold text-slate-400">Verified Completed</div>
          <div className="text-3xl font-serif font-bold text-emerald-400 mt-1">
            {completedCount}
          </div>
          <p className="text-xs text-slate-400 mt-1">Signed off by Project Directors</p>
        </div>

        <div className="bg-[#121622] border border-[#1e2738] rounded-xl p-5 shadow-sm">
          <div className="text-xs uppercase font-bold text-slate-400">In Active Construction</div>
          <div className="text-3xl font-serif font-bold text-blue-400 mt-1">
            {inProgressCount}
          </div>
          <p className="text-xs text-slate-400 mt-1">Engineering teams actively deploying</p>
        </div>

        <div className="bg-[#121622] border border-[#1e2738] rounded-xl p-5 shadow-sm">
          <div className="text-xs uppercase font-bold text-slate-400">Execution Rate</div>
          <div className="text-3xl font-serif font-bold text-amber-300 mt-1">
            {averageProgress}%
          </div>
          <p className="text-xs text-slate-400 mt-1">Cumulative progress across all jobs</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'completed', 'in_progress', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#141a24] text-slate-400 hover:text-slate-200 border border-[#232e42]'
              }`}
            >
              {st === 'all' ? 'All Milestones' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {isProjectManager && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-xl shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4 text-black" />
            Define Strategic Milestone
          </button>
        )}
      </div>

      {/* Interactive Milestone Roadmap Timeline */}
      <div className="space-y-4">
        {filteredMilestones.map((milestone, idx) => {
          const project = projects.find((p) => p.id === milestone.projectId);
          const isDone = milestone.status === 'completed';

          return (
            <div
              key={milestone.id}
              className={`bg-[#121622] border rounded-2xl p-6 transition-all shadow-md ${
                isDone
                  ? 'border-emerald-500/30 bg-[#121822]'
                  : 'border-[#202a3a] hover:border-amber-500/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {project?.code || 'GPP'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{project?.title}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        isDone
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {milestone.description}
                  </p>
                </div>

                {/* Progress Circle / Sign-off Button */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Target Delivery</div>
                    <div className="text-sm font-bold text-amber-300 flex items-center gap-1 justify-end">
                      <Calendar className="w-3.5 h-3.5" />
                      {milestone.dueDate}
                    </div>
                  </div>

                  {!isDone && isProjectManager ? (
                    <button
                      onClick={() => handleSignOff(milestone.id)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow"
                    >
                      <ShieldCheck className="w-4 h-4 text-black" />
                      Sign-off Phase
                    </button>
                  ) : isDone ? (
                    <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Verified by {milestone.signOffBy || 'Director'}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Phase Completion</span>
                  <span className="font-bold text-amber-300">{milestone.progress}%</span>
                </div>
                <div className="w-full bg-[#1b2331] h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        : 'bg-gradient-to-r from-amber-500 to-amber-300'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>

              {/* Deliverables Checklist */}
              {milestone.deliverables && milestone.deliverables.length > 0 && (
                <div className="bg-[#0e121a] rounded-xl p-4 border border-[#1c2434] space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Required Quality & Structural Deliverables:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {milestone.deliverables.map((del, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center gap-2 text-xs text-slate-200 bg-[#141a24] px-3 py-2 rounded-lg border border-[#1f293b]"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Define New Milestone
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Project</label>
                <select
                  value={newProjId}
                  onChange={(e) => setNewProjId(e.target.value)}
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
                <label className="block text-slate-300 font-bold mb-1">Milestone Phase Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 3: High-Voltage Reticulation Commissioning"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Scope & Engineering Specifications</label>
                <textarea
                  rows={2}
                  placeholder="Detail the technical phase outcomes..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Deliverables (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Soil compaction certificate&#10;City council structural permit&#10;Hydraulic pressure clearance"
                  value={newDeliverables}
                  onChange={(e) => setNewDeliverables(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202a3a]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#18202d] text-slate-300 rounded-lg hover:bg-[#202b3c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
