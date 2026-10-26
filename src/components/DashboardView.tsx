import React from 'react';
import {
  Users,
  Briefcase,
  Receipt,
  Target,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  FolderSync,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenNewProjectModal: () => void;
  onOpenNewTaskModal: () => void;
  onOpenNewDocModal: () => void;
  onOpenDriveSync?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenNewProjectModal,
  onOpenNewTaskModal,
  onOpenNewDocModal,
  onOpenDriveSync,
}) => {
  const {
    projects,
    tasks,
    milestones,
    documents,
    updates,
    invoices,
    setSelectedProjectId,
  } = useProjects();
  const { userProfile, role, isAdmin } = useAuth();
  const { isDark } = useTheme();

  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;
  const totalBudgetZAR = projects.reduce((acc, p) => acc + p.budgetZAR, 0);
  const totalSpentZAR = projects.reduce((acc, p) => acc + p.spentZAR, 0);
  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projects');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome / Collaborator Banner */}
      <div
        className={`border rounded-2xl p-6 relative overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-gradient-to-r from-[#141a24] via-[#161e2b] to-[#121620] border-[#232e42]'
            : 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border-amber-200/80 shadow-sm'
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isDark
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}
              >
                Godongwane Progressive Projects
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pretoria & Hartbeespoort Regional Hub
              </span>
            </div>
            <h1
              className={`text-2xl lg:text-3xl font-extrabold tracking-tight font-serif ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Welcome back, {userProfile.displayName}
            </h1>
            <p className={`text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Collaborator status:{' '}
              <strong className={isDark ? 'text-amber-300 font-semibold' : 'text-amber-700 font-semibold'}>
                Full Administrative Access
              </strong>{' '}
              granted for{' '}
              <code
                className={`px-1.5 py-0.5 rounded text-xs ${
                  isDark ? 'text-slate-300 bg-[#0e1219]' : 'text-slate-800 bg-slate-100 border border-slate-200'
                }`}
              >
                servicewebsites6@gmail.com
              </code>{' '}
              and{' '}
              <code
                className={`px-1.5 py-0.5 rounded text-xs ${
                  isDark ? 'text-slate-300 bg-[#0e1219]' : 'text-slate-800 bg-slate-100 border border-slate-200'
                }`}
              >
                mthethwapraisegodcebolenkosi@gmail.com
              </code>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
                isDark
                  ? 'bg-[#1b2434] hover:bg-[#232f44] text-slate-200 border-[#2c3b54]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-500" />
              Live Status Broadcast
            </button>
            {onOpenDriveSync && (
              <button
                onClick={onOpenDriveSync}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition cursor-pointer ${
                  isDark
                    ? 'bg-[#1b2434] hover:bg-[#232f44] text-amber-300 border-amber-500/30'
                    : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                }`}
                title="Add all projects to Google Drive"
              >
                <FolderSync className="w-4 h-4 text-amber-500" />
                <span>Sync to Google Drive</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={onOpenNewProjectModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold shadow-md shadow-amber-950/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-black" />
                Initiate New Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards section - Styled after Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Employees (Screenshot 3 style) */}
        <div
          onClick={() => setActiveTab('team')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-xs group ${
            isDark
              ? 'bg-[#131823] hover:bg-[#161c29] border-[#1f2838] hover:border-amber-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              EMPLOYEES
            </span>
            <Users className="w-4 h-4 text-sky-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-4xl font-serif font-normal tracking-tight ${
              isDark ? 'text-[#e5c07b]' : 'text-[#b45309]'
            }`}
          >
            2
          </div>
          <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Full agency team
          </p>
        </div>

        {/* Card 2: Active Jobs (Screenshot 3 style) */}
        <div
          onClick={() => setActiveTab('projects')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-xs group ${
            isDark
              ? 'bg-[#131823] hover:bg-[#161c29] border-[#1f2838] hover:border-amber-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              ACTIVE JOBS
            </span>
            <Briefcase className="w-4 h-4 text-blue-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-4xl font-serif font-normal tracking-tight ${
              isDark ? 'text-[#e5c07b]' : 'text-[#b45309]'
            }`}
          >
            {activeProjectsCount}
          </div>
          <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            58 total jobs on record
          </p>
        </div>

        {/* Card 3: Outstanding Invoices (Screenshot 3 style) */}
        <div
          onClick={() => setActiveTab('invoices')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-xs group ${
            isDark
              ? 'bg-[#131823] hover:bg-[#161c29] border-[#1f2838] hover:border-amber-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              OUTSTANDING INVOICES
            </span>
            <Receipt className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-4xl font-serif font-normal tracking-tight ${
              isDark ? 'text-[#e5c07b]' : 'text-[#b45309]'
            }`}
          >
            R0
          </div>
          <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            0 unpaid invoices
          </p>
        </div>

        {/* Card 4: Milestones Progress */}
        <div
          onClick={() => setActiveTab('milestones')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-xs group ${
            isDark
              ? 'bg-[#131823] hover:bg-[#161c29] border-[#1f2838] hover:border-amber-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              MILESTONES
            </span>
            <Target className="w-4 h-4 text-purple-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-4xl font-serif font-normal tracking-tight ${
              isDark ? 'text-[#e5c07b]' : 'text-[#b45309]'
            }`}
          >
            {completedMilestones}{' '}
            <span className={isDark ? 'text-xl text-slate-500' : 'text-xl text-slate-400'}>
              / {milestones.length}
            </span>
          </div>
          <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {Math.round((completedMilestones / (milestones.length || 1)) * 100)}% verified complete
          </p>
        </div>

        {/* Card 5: In-Flight Tasks */}
        <div
          onClick={() => setActiveTab('tasks')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-xs group ${
            isDark
              ? 'bg-[#131823] hover:bg-[#161c29] border-[#1f2838] hover:border-amber-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              TASK VELOCITY
            </span>
            <TrendingUp className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-4xl font-serif font-normal tracking-tight ${
              isDark ? 'text-[#e5c07b]' : 'text-[#b45309]'
            }`}
          >
            {completedTasks}{' '}
            <span className={isDark ? 'text-xl text-slate-500' : 'text-xl text-slate-400'}>done</span>
          </div>
          <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {inProgressTasks} active in progress
          </p>
        </div>

        {/* Card 6: Central Document Vault */}
        <div
          onClick={() => setActiveTab('documents')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-xs group ${
            isDark
              ? 'bg-[#131823] hover:bg-[#161c29] border-[#1f2838] hover:border-amber-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              DOCUMENT VAULT
            </span>
            <FileText className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-4xl font-serif font-normal tracking-tight ${
              isDark ? 'text-[#e5c07b]' : 'text-[#b45309]'
            }`}
          >
            {documents.length}
          </div>
          <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Blueprints & contracts
          </p>
        </div>
      </div>

      {/* Main Grid: Projects & Active Jobs + Real-Time Status Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Active Projects Showcase */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-lg font-bold tracking-tight flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>Active Capital Projects</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                    isDark
                      ? 'bg-[#1e2738] text-amber-300 border-amber-500/20'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  5 Operations
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Monitored infrastructure, civil works, and logistics hubs
              </p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className={`text-xs font-semibold flex items-center gap-1 ${
                isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
              }`}
            >
              View All Projects
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-xs group ${
                  isDark
                    ? 'bg-[#121620] hover:bg-[#161c28] border-[#1f2838] hover:border-amber-500/40'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                        isDark
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-amber-800 bg-amber-100 border-amber-300'
                      }`}
                    >
                      {project.code}
                    </span>
                    <h3
                      className={`text-sm font-bold transition truncate ${
                        isDark
                          ? 'text-slate-100 group-hover:text-amber-300'
                          : 'text-slate-900 group-hover:text-amber-800'
                      }`}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                        isDark
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      R{project.budgetZAR.toLocaleString()} ZAR
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        isDark
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className={`text-xs line-clamp-1 mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Milestone Progress</span>
                    <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      {project.completionPercentage}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-[#1b2331]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.completionPercentage}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] ${
                    isDark ? 'border-[#1b2331] text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Due {new Date(project.targetCompletionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={isDark ? 'text-amber-300/90 font-medium' : 'text-amber-700 font-semibold'}>
                    Client: {project.clientName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): Central Document Quick Access & Live Broadcast Updates */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div
            className={`border rounded-xl p-4 space-y-3 transition-colors ${
              isDark ? 'bg-[#131823] border-[#1f2838]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3
              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Quick Project Operations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenNewTaskModal}
                className={`p-3 border rounded-lg text-left transition ${
                  isDark
                    ? 'bg-[#18202e] hover:bg-[#202b3d] border-[#232f44]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  + New Task
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Assign to team</div>
              </button>
              <button
                onClick={onOpenNewDocModal}
                className={`p-3 border rounded-lg text-left transition ${
                  isDark
                    ? 'bg-[#18202e] hover:bg-[#202b3d] border-[#232f44]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  + Blueprint / File
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Upload to vault</div>
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`p-3 border rounded-lg text-left transition ${
                  isDark
                    ? 'bg-[#18202e] hover:bg-[#202b3d] border-[#232f44]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Roadmap
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Inspect milestones</div>
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`p-3 border rounded-lg text-left transition ${
                  isDark
                    ? 'bg-[#18202e] hover:bg-[#202b3d] border-[#232f44]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Harties & Clients
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Contact directory</div>
              </button>
            </div>
          </div>

          {/* Real-time Field Activity Feed */}
          <div
            className={`border rounded-xl p-5 space-y-4 transition-colors ${
              isDark ? 'bg-[#131823] border-[#1f2838]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-2 border-b ${
                isDark ? 'border-[#1f2838]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                <h3
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Field Progress Updates
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-[11px] text-amber-500 hover:underline font-semibold"
              >
                Broadcast
              </button>
            </div>

            <div className="space-y-3">
              {updates.slice(0, 4).map((upd) => (
                <div
                  key={upd.id}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 transition ${
                    isDark
                      ? 'bg-[#171f2d] border-[#222c3d]'
                      : 'bg-slate-50 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className={`font-semibold truncate ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      {upd.authorName}
                    </span>
                    <span>
                      {new Date(upd.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {upd.title}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {upd.summary}
                  </p>
                  {upd.tags && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {upd.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] px-1.5 py-0.2 rounded ${
                            isDark
                              ? 'bg-[#212b3d] text-slate-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Centralized Document Spotlight */}
          <div
            className={`border rounded-xl p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#131823] border-[#1f2838]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-2 border-b ${
                isDark ? 'border-[#1f2838]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                <h3
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Critical Blueprints & Specs
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-[11px] text-amber-500 hover:underline font-semibold"
              >
                Vault ({documents.length})
              </button>
            </div>

            <div className="space-y-2">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                    isDark
                      ? 'bg-[#161d2b] hover:bg-[#1a2334] border-[#212b3d]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className={`uppercase font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                        {doc.fileType}
                      </span>
                      <span>{doc.fileSize}</span>
                      <span>v{doc.version}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
