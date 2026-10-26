import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { MilestonesView } from './components/MilestonesView';
import { DocumentsView } from './components/DocumentsView';
import { StatusReportsView } from './components/StatusReportsView';
import { TeamView } from './components/TeamView';
import { ClientsView } from './components/ClientsView';
import { InvoicesView } from './components/InvoicesView';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { NewDocumentModal } from './components/modals/NewDocumentModal';
import { GoogleDriveSyncModal } from './components/modals/GoogleDriveSyncModal';
import { Project } from './types';

function MainApp() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [isDriveSyncModalOpen, setIsDriveSyncModalOpen] = useState(false);
  const [driveSyncProject, setDriveSyncProject] = useState<Project | null>(null);

  const handleOpenDriveSync = (target?: Project | null) => {
    setDriveSyncProject(target || null);
    setIsDriveSyncModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500/30 selection:text-amber-300 ${
        isDark ? 'bg-[#0a0d13] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Header
          activeTab={activeTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
          onOpenDriveSync={() => handleOpenDriveSync(null)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
              onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
              onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
              onOpenDriveSync={() => handleOpenDriveSync(null)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
              onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
              onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
              onOpenDriveSync={(proj) => handleOpenDriveSync(proj || null)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)} />
          )}

          {activeTab === 'milestones' && <MilestonesView />}

          {activeTab === 'documents' && (
            <DocumentsView onOpenNewDocModal={() => setIsNewDocModalOpen(true)} />
          )}

          {activeTab === 'reports' && <StatusReportsView />}

          {activeTab === 'team' && <TeamView />}

          {activeTab === 'clients' && <ClientsView />}

          {activeTab === 'invoices' && <InvoicesView />}
        </main>
      </div>

      {/* Creation & Integration Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
      <NewDocumentModal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
      />
      <GoogleDriveSyncModal
        isOpen={isDriveSyncModalOpen}
        onClose={() => setIsDriveSyncModalOpen(false)}
        targetProject={driveSyncProject}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <MainApp />
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
