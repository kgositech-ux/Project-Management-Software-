import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  X,
  FileUp,
  FolderSync,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onOpenSidebar: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNewTaskModal: () => void;
  onOpenNewDocModal: () => void;
  onOpenDriveSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSidebar,
  onOpenNewProjectModal,
  onOpenNewTaskModal,
  onOpenNewDocModal,
  onOpenDriveSync,
}) => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    searchQuery,
    setSearchQuery,
  } = useProjects();
  const { userProfile, role, isAdmin, isProjectManager, loginWithGoogle, currentUser } = useAuth();
  const { isDark } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'projects':
        return 'Projects & Active Jobs';
      case 'tasks':
        return 'Task Tracking & Execution';
      case 'milestones':
        return 'Milestone Roadmap & Visualization';
      case 'documents':
        return 'Centralized Document Repository';
      case 'reports':
        return 'Real-time Status Reporting';
      case 'team':
        return 'Team & Administrative Collaborators';
      case 'clients':
        return 'Client & Partner Directory';
      case 'invoices':
        return 'Invoices, Payroll & Budgets';
      default:
        return 'Godongwane Progressive Projects';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Godongwane Progressive Projects • Service Websites Agency';
      case 'projects':
        return 'Pretoria West, Pretoria North, Hartbeespoort & Centurion Developments';
      case 'tasks':
        return 'Kanban workflows, priority management & task progress';
      case 'milestones':
        return 'Interactive milestone delivery tracking & project sign-offs';
      case 'documents':
        return 'Blueprints, architectural drawings, site reports & compliance certificates';
      case 'reports':
        return 'Automated field progress broadcast & milestone bulletins';
      case 'team':
        return 'Role-based access control with administrative collaborators';
      case 'clients':
        return 'Rent Partner Harties, Municipal Infrastructure & Commercial Partners';
      case 'invoices':
        return 'Financial overview, contractor billing & zero outstanding invoices';
      default:
        return 'Admin Console';
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200 ${
        isDark
          ? 'bg-[#0e1219]/95 border-[#1e2634]'
          : 'bg-white/95 border-slate-200 shadow-sm'
      }`}
    >
      {/* Left: Mobile hamburger + Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className={`p-2 lg:hidden rounded-lg border transition ${
            isDark
              ? 'bg-[#161c27] text-slate-300 hover:text-white border-[#253042]'
              : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
          }`}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2
              className={`text-xl font-bold tracking-tight font-serif ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {getTabTitle()}
            </h2>
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                isDark
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              GPP Admin
            </span>
          </div>
          <p
            className={`text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {getTabSubtitle()}
          </p>
        </div>
      </div>

      {/* Right Controls: Project Filter, Search, Theme Toggle, Notification Popover, Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Project Selector dropdown */}
        <div className="relative min-w-[170px]">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value ? e.target.value : null)}
            className={`w-full text-xs rounded-lg px-3 py-2 pr-7 appearance-none border focus:outline-none focus:border-amber-400 transition ${
              isDark
                ? 'bg-[#141a24] text-slate-200 border-[#232e42]'
                : 'bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            <option value="">All Projects (5 Active)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.title.substring(0, 24)}...
              </option>
            ))}
          </select>
          <Filter
            className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          />
        </div>

        {/* Search input */}
        <div className="relative hidden sm:block w-44 md:w-52">
          <Search
            className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:border-amber-400 transition ${
              isDark
                ? 'bg-[#141a24] text-slate-200 placeholder-slate-500 border-[#232e42]'
                : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300 shadow-xs'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* User-facing Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg border transition ${
              isDark
                ? 'bg-[#141a24] hover:bg-[#1c2433] text-slate-300 hover:text-white border-[#232e42]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 shadow-xs'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] text-black font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border p-4 z-50 transition-colors shadow-2xl ${
                isDark
                  ? 'bg-[#131924] border-[#253247] text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800 shadow-xl'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? 'border-[#202b3c]' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isDark
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-amber-500 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto mt-2 space-y-2 scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-lg text-xs transition cursor-pointer border ${
                        notif.read
                          ? isDark
                            ? 'bg-[#161d2a]/50 border-transparent text-slate-400'
                            : 'bg-slate-50 border-transparent text-slate-500'
                          : isDark
                          ? 'bg-[#1a2333] border-amber-500/30 text-slate-200 shadow-sm'
                          : 'bg-amber-50/60 border-amber-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        {notif.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        {(notif.type === 'info' || notif.type === 'alert') && (
                          <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-semibold truncate ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            {notif.title}
                          </div>
                          <p
                            className={`text-[11px] mt-0.5 line-clamp-2 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            {new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Sync Trigger */}
        {onOpenDriveSync && (
          <button
            onClick={onOpenDriveSync}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
              isDark
                ? 'bg-[#151c27] hover:bg-[#1f2838] text-slate-200 border-[#263347]'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
            }`}
            title="Add all projects to Google Drive"
          >
            <FolderSync className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Google Drive</span>
          </button>
        )}

        {/* Action Buttons (Restricted by Role) */}
        {isProjectManager && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1b2331] hover:bg-[#232e42] text-slate-200 text-xs font-semibold rounded-lg border border-[#27344a] transition"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Task</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenNewProjectModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-lg shadow-sm shadow-amber-950/30 transition"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>New Project</span>
              </button>
            )}
          </div>
        )}

        {/* Google User Avatar / Sign-in */}
        {!currentUser ? (
          <button
            onClick={loginWithGoogle}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 bg-[#141a24] hover:bg-[#1e2634] text-xs font-medium text-slate-300 rounded-lg border border-[#232e42] transition"
            title="Sign in with your Google account"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center">
              {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
