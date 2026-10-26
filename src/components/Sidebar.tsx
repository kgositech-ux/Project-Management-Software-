import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CheckSquare,
  Target,
  FileText,
  Activity,
  Receipt,
  ShieldCheck,
  LogOut,
  ChevronRight,
  HardHat,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { UserRole } from '../types';
import { ADMIN_EMAILS } from '../data/seedData';

export type NavTab =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'milestones'
  | 'documents'
  | 'reports'
  | 'team'
  | 'clients'
  | 'invoices';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const {
    userProfile,
    role,
    setSimulatedRole,
    switchActiveAdminAccount,
    currentUser,
    loginWithGoogle,
    logoutUser,
  } = useAuth();
  const { isDark } = useTheme();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'projects',
      label: 'Jobs & Projects',
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      badge: '5 Active',
    },
    {
      id: 'tasks',
      label: 'Task Tracking',
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: <Target className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 'documents',
      label: 'Document Repository',
      icon: <FileText className="w-5 h-5 text-cyan-500" />,
      badge: '6 files',
    },
    {
      id: 'reports',
      label: 'Real-time Reports',
      icon: <Activity className="w-5 h-5 text-rose-500" />,
    },
    {
      id: 'team',
      label: 'Employees & Team',
      icon: <Users className="w-5 h-5 text-sky-500" />,
      badge: '2 Admins',
    },
    {
      id: 'clients',
      label: 'Clients & Partners',
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'invoices',
      label: 'Invoices & Payroll',
      icon: <Receipt className="w-5 h-5 text-violet-500" />,
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const isCurrentAdmin1 = userProfile.email.toLowerCase() === ADMIN_EMAILS[0].toLowerCase();
  const isCurrentAdmin2 = userProfile.email.toLowerCase() === ADMIN_EMAILS[1].toLowerCase();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 border-r flex flex-col transition-all duration-300 ease-in-out ${
          isDark
            ? 'bg-[#0e1219] border-[#1e2634]'
            : 'bg-white border-slate-200 shadow-xl'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div
          className={`p-5 border-b flex items-center gap-3 ${
            isDark ? 'border-[#1e2634]' : 'border-slate-100'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#e5c07b] text-[#0e1219] flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-950/20">
            G
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className={`text-sm font-bold tracking-tight truncate ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              Godongwane
            </h1>
            <p
              className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}
            >
              Progressive Projects
            </p>
            <span
              className={`inline-block px-1.5 py-0.5 mt-1 text-[10px] font-semibold rounded border ${
                isDark
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          <div>
            <div
              className={`px-3 pb-2 text-[11px] font-bold tracking-wider uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              AGENCY & OPERATIONS
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-[#1a2332] text-amber-300 border border-amber-500/30 shadow-sm'
                          : 'bg-amber-50/80 text-amber-900 border border-amber-300/80 shadow-xs'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-[#161c27]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? isDark
                              ? 'bg-amber-400/20 text-amber-200'
                              : 'bg-amber-100 text-amber-800'
                            : isDark
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Theme Switcher Quick Toggle in Sidebar */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              isDark
                ? 'bg-[#131924] border-[#222c3d]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Display Mode
              </span>
              <span className="text-[10px] text-slate-400">
                {isDark ? 'Dark (Night view)' : 'Light (High contrast)'}
              </span>
            </div>
            <ThemeToggle showLabel={false} />
          </div>

          {/* Collaborator Switcher / RBAC Panel */}
          <div
            className={`p-3 rounded-xl border space-y-3 transition-colors ${
              isDark
                ? 'bg-[#131924] border-[#222c3d]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Collaborator Access
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-semibold">
                Full Admin
              </span>
            </div>

            <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pre-authorized administrative collaborators assigned with full access:
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => switchActiveAdminAccount(ADMIN_EMAILS[0])}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition ${
                  isCurrentAdmin1
                    ? isDark
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                      : 'bg-amber-50 border border-amber-300 text-amber-900 font-semibold'
                    : isDark
                    ? 'bg-[#18202e] hover:bg-[#1e2738] text-slate-300 border border-transparent'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                  K
                </div>
                <div className="truncate flex-1 min-w-0">
                  <div className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Kgosi
                  </div>
                  <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ADMIN_EMAILS[0]}
                  </div>
                </div>
                {isCurrentAdmin1 && (
                  <span className="text-[10px] text-amber-500 font-bold">Active</span>
                )}
              </button>

              <button
                onClick={() => switchActiveAdminAccount(ADMIN_EMAILS[1])}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition ${
                  isCurrentAdmin2
                    ? isDark
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                      : 'bg-amber-50 border border-amber-300 text-amber-900 font-semibold'
                    : isDark
                    ? 'bg-[#18202e] hover:bg-[#1e2738] text-slate-300 border border-transparent'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                  P
                </div>
                <div className="truncate flex-1 min-w-0">
                  <div className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Praisegod Cebolenkosi
                  </div>
                  <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ADMIN_EMAILS[1]}
                  </div>
                </div>
                {isCurrentAdmin2 && (
                  <span className="text-[10px] text-amber-500 font-bold">Active</span>
                )}
              </button>
            </div>

            {/* Role Simulation for RBAC Testing */}
            <div className={`pt-2 border-t ${isDark ? 'border-[#1e2738]' : 'border-slate-200'}`}>
              <label
                className={`block text-[10px] uppercase font-bold mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Role-Based View Simulator
              </label>
              <select
                value={role}
                onChange={(e) => setSimulatedRole(e.target.value as UserRole)}
                className={`w-full text-xs rounded px-2 py-1.5 focus:outline-none focus:border-amber-400 transition ${
                  isDark
                    ? 'bg-[#18202e] border border-[#253247] text-slate-200'
                    : 'bg-white border border-slate-300 text-slate-800'
                }`}
              >
                <option value="admin">Super Admin (Full Access)</option>
                <option value="project_manager">Project Manager</option>
                <option value="collaborator">Site Engineer / Contributor</option>
                <option value="viewer">Client / Viewer</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Footer Profile matching Screenshot 2 */}
        <div
          className={`p-4 border-t transition-colors ${
            isDark
              ? 'border-[#1e2634] bg-[#0c1017]'
              : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-bold flex items-center justify-center shrink-0">
              {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold truncate ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  {userProfile.displayName}
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded font-semibold">
                  {role === 'admin' ? 'Admin' : role.replace('_', ' ')}
                </span>
              </div>
              <div
                className={`text-[11px] truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {userProfile.email}
              </div>
            </div>
            {currentUser && (
              <button
                onClick={logoutUser}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {!currentUser && (
            <div className="mt-3">
              <button
                onClick={loginWithGoogle}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border transition ${
                  isDark
                    ? 'bg-[#1e2634] hover:bg-[#253042] text-slate-200 border-[#2a364a]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
