import React, { useState } from 'react';
import {
  Activity,
  Send,
  Radio,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ActivityUpdate, UpdateType } from '../types';

export const StatusReportsView: React.FC = () => {
  const {
    updates,
    projects,
    selectedProjectId,
    addActivityUpdate,
    triggerNotification,
  } = useProjects();
  const { userProfile, isProjectManager } = useAuth();

  const [targetProjId, setTargetProjId] = useState(projects[0]?.id || '');
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [reportType, setReportType] = useState<UpdateType>('status_report');
  const [reportTags, setReportTags] = useState('Field Inspection, Civil Progress');

  const filteredUpdates = updates.filter(
    (u) => !selectedProjectId || u.projectId === selectedProjectId
  );

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportSummary.trim()) return;

    const proj = projects.find((p) => p.id === targetProjId);

    await addActivityUpdate({
      projectId: targetProjId,
      projectTitle: proj?.title || 'General Engineering Hub',
      authorEmail: userProfile.email,
      authorName: userProfile.displayName,
      title: reportTitle,
      summary: reportSummary,
      type: reportType,
      tags: reportTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    triggerNotification(
      `Status Broadcast: ${reportTitle}`,
      reportSummary.substring(0, 80) + '...',
      reportType === 'alert' ? 'warning' : 'info',
      targetProjId
    );

    setReportTitle('');
    setReportSummary('');
  };

  const handlePrintReports = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Print action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            Live Project Operations Feed & Status Broadcasts
          </h2>
          <p className="text-xs text-slate-400">
            Real-time status updates from site engineers, project managers, and partners
          </p>
        </div>

        <button
          onClick={handlePrintReports}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#161c28] hover:bg-[#1e2638] text-slate-200 text-xs font-semibold rounded-xl border border-[#232e42] transition"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          Print / Save Bulletin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Broadcast Composer (if permitted) */}
        {isProjectManager && (
          <div className="bg-[#121622] border border-[#202a3a] rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1e2738]">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Broadcast Field Status Update
              </h3>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Target Project</label>
                <select
                  value={targetProjId}
                  onChange={(e) => setTargetProjId(e.target.value)}
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
                <label className="block text-slate-400 font-bold mb-1">Broadcast Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as UpdateType)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="status_report">Weekly / Daily Field Report</option>
                  <option value="milestone_reached">Milestone Reached Bulletin</option>
                  <option value="task_completed">Critical Work Handover</option>
                  <option value="alert">Machinery / Safety Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete slab pour completed for Bay 4"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Field Observations & Findings</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify inspection results, equipment status from Rent Partner Harties, on-site weather conditions, etc..."
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Pretoria West, Rent Partner Harties, Compaction"
                  value={reportTags}
                  onChange={(e) => setReportTags(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4 text-black" />
                Publish Live Update
              </button>
            </form>
          </div>
        )}

        {/* Right Column: Historical Activity Timeline */}
        <div className={`space-y-4 ${isProjectManager ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="space-y-3">
            {filteredUpdates.map((upd) => (
              <div
                key={upd.id}
                className="bg-[#121622] border border-[#202a3a] rounded-2xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">{upd.authorName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-medium">{upd.projectTitle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(upd.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    {upd.type === 'alert' && (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    {upd.type === 'milestone_reached' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>{upd.title}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-[#161c28] p-3 rounded-xl border border-[#222c3d]">
                    {upd.summary}
                  </p>
                </div>

                {upd.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {upd.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#1a2333] text-amber-300/80 border border-[#24334a]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
