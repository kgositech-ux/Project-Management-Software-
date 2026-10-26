import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { syncProjectsToGoogleDrive, DriveSyncResult } from '../../services/googleDriveService';
import { Project } from '../../types';
import {
  X,
  FolderSync,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Folder,
  FileText,
  Loader2,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProject?: Project | null; // If provided, sync this single project; otherwise sync all projects
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  targetProject,
}) => {
  const { currentUser, accessToken, loginWithGoogle } = useAuth();
  const { projects, tasks, milestones, documents, addActivityUpdate, triggerNotification } = useProjects();
  const { isDark } = useTheme();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [result, setResult] = useState<DriveSyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const projectsToSync = targetProject ? [targetProject] : projects;
  const totalTasks = tasks.filter((t) => projectsToSync.some((p) => p.id === t.projectId)).length;
  const totalMilestones = milestones.filter((m) => projectsToSync.some((p) => p.id === m.projectId)).length;
  const totalDocs = documents.filter((d) => projectsToSync.some((p) => p.id === d.projectId)).length;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleStartSync = async () => {
    if (!accessToken) {
      setError('Please connect your Google account first.');
      return;
    }

    setSyncing(true);
    setError(null);
    setProgressPercent(0);
    setProgressText('Starting Google Drive sync...');

    try {
      const syncResult = await syncProjectsToGoogleDrive(
        accessToken,
        projectsToSync,
        tasks,
        milestones,
        documents,
        (text, pct) => {
          setProgressText(text);
          setProgressPercent(pct);
        }
      );

      setResult(syncResult);

      // Record in activity and notifications
      const syncTitle = targetProject
        ? `Project "${targetProject.title}" synced to Google Drive`
        : `All ${projectsToSync.length} projects synced to Google Drive`;

      await addActivityUpdate({
        projectId: targetProject ? targetProject.id : projectsToSync[0]?.id || 'gpp-all',
        projectTitle: targetProject ? targetProject.title : 'Consolidated Portfolio',
        authorEmail: currentUser?.email || 'servicewebsites6@gmail.com',
        authorName: currentUser?.displayName || 'Agency Administrator',
        title: 'Google Drive Synchronization',
        summary: `Google Drive Backup: Created/updated folders with ${syncResult.filesCreatedCount} documents, roadmaps, and briefs.`,
        type: 'status_report',
      });

      triggerNotification(
        'Google Drive Sync Completed',
        `${syncTitle} (${syncResult.filesCreatedCount} files uploaded/updated).`,
        'success'
      );
    } catch (err: any) {
      console.error('Sync failed:', err);
      setError(err?.message || 'An unexpected error occurred during Google Drive sync.');
    } finally {
      setSyncing(false);
    }
  };

  const resetAndClose = () => {
    if (syncing) return;
    setResult(null);
    setError(null);
    setProgressPercent(0);
    setProgressText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark ? 'bg-[#0f141f] border-[#222e42] text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-[#1e2a3b] bg-[#121926]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {targetProject ? 'Add Project to Google Drive' : 'Add All Projects to Google Drive'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-normal">
                  v3 REST API
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Godongwane Progressive Projects • Drive Document Repository
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            disabled={syncing}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Authentication Check */}
          {!accessToken ? (
            <div
              className={`p-5 rounded-xl border ${
                isDark ? 'bg-[#141b2a] border-[#24334a]' : 'bg-slate-50 border-slate-200'
              } space-y-4`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Google Drive Permission Required</h4>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Sign in with your Google account to grant permission to create the{' '}
                    <strong>Godongwane Progressive Projects</strong> folder and store project data.
                  </p>
                </div>
              </div>

              {/* Official Material Design "Sign in with Google" button per workspace integration skill */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium text-sm shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-60"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>
                    {isSigningIn
                      ? 'Connecting...'
                      : currentUser
                      ? `Authorize Google Drive (${currentUser.email})`
                      : 'Sign in with Google'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border ${
                isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium">
                  Google Drive connected: <strong>{currentUser?.email || 'Authenticated User'}</strong>
                </span>
              </div>
              <span className="text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                drive.file scope active
              </span>
            </div>
          )}

          {/* Explicit User Confirmation & Details Card per Workspace Integration Guideline */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-[#131924] border-[#202c3e]' : 'bg-slate-50 border-slate-200'
            } space-y-3`}
          >
            <h4 className="font-medium text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Folder className="w-4 h-4" /> Operations to execute in your Google Drive:
            </h4>
            <div className={`text-xs space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                • Create/verify root folder: <strong>Godongwane Progressive Projects</strong>
              </p>
              <p>
                • Generate consolidated master project directory & JSON interchange export
              </p>
              <p>
                • Create dedicated subfolders and briefs for <strong>{projectsToSync.length} project(s)</strong>:
              </p>
            </div>

            {/* List of projects to be affected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {projectsToSync.map((proj) => (
                <div
                  key={proj.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs border ${
                    isDark ? 'bg-[#0d121c] border-[#1e2736]' : 'bg-white border-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-amber-500 mr-1.5">{proj.code}</span>
                    <span className="truncate">{proj.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {projectsToSync.length} Projects
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {totalTasks} Tasks & Work Orders
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {totalMilestones} Milestones Roadmap
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {totalDocs} Blueprint Vault Items
              </span>
            </div>
          </div>

          {/* Sync Progress Bar */}
          {syncing && (
            <div className="space-y-2 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-amber-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {progressText}
                </span>
                <span className="font-bold text-amber-500">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Success View */}
          {result && (
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              } space-y-3`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Synchronization Complete!</h4>
                  <p className="text-xs mt-0.5">
                    {result.syncedProjectsCount} project(s) and {result.filesCreatedCount} documents successfully uploaded to Google Drive.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={result.rootFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open "Godongwane Progressive Projects" in Google Drive
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Footer (Explicit Actions: Confirm or Cancel) */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-t ${
            isDark ? 'border-[#1e2a3b] bg-[#121926]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            type="button"
            onClick={resetAndClose}
            disabled={syncing}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            } disabled:opacity-50`}
          >
            {result ? 'Done' : 'Cancel'}
          </button>

          {!result && (
            <button
              type="button"
              onClick={handleStartSync}
              disabled={syncing || !accessToken}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing to Drive...
                </>
              ) : (
                <>
                  <FolderSync className="w-4 h-4" />
                  {targetProject ? 'Confirm & Sync Project' : 'Confirm & Sync All Projects'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
