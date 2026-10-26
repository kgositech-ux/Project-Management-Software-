import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Project,
  Task,
  Milestone,
  ProjectDocument,
  ActivityUpdate,
  AppNotification,
  ClientPartner,
  InvoiceItem,
  TaskStatus,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MILESTONES,
  INITIAL_DOCUMENTS,
  INITIAL_UPDATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
} from '../data/seedData';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: Project | null;
  tasks: Task[];
  milestones: Milestone[];
  documents: ProjectDocument[];
  updates: ActivityUpdate[];
  notifications: AppNotification[];
  clients: ClientPartner[];
  invoices: InvoiceItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Mutations
  addProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addMilestone: (data: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  addDocument: (data: Omit<ProjectDocument, 'id' | 'createdAt'>) => Promise<string>;
  deleteDocument: (id: string) => Promise<void>;
  addActivityUpdate: (data: Omit<ActivityUpdate, 'id' | 'createdAt'>) => Promise<string>;
  addClient: (data: Omit<ClientPartner, 'id' | 'createdAt'>) => Promise<string>;
  updateClient: (id: string, updates: Partial<ClientPartner>) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  triggerNotification: (title: string, message: string, type?: 'info' | 'alert' | 'success' | 'warning', projectId?: string) => void;
  resetToInitialData: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAdmin } = useAuth();

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('gpp_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('gpp_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('gpp_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [documents, setDocuments] = useState<ProjectDocument[]>(() => {
    const saved = localStorage.getItem('gpp_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [updates, setUpdates] = useState<ActivityUpdate[]>(() => {
    const saved = localStorage.getItem('gpp_updates');
    return saved ? JSON.parse(saved) : INITIAL_UPDATES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('gpp_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [clients, setClients] = useState<ClientPartner[]>(() => {
    const saved = localStorage.getItem('gpp_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [invoices, setInvoices] = useState<InvoiceItem[]>(() => {
    const saved = localStorage.getItem('gpp_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to local cache for instant UI response
  useEffect(() => {
    localStorage.setItem('gpp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('gpp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('gpp_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('gpp_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('gpp_updates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('gpp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gpp_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('gpp_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  const triggerNotification = (
    title: string,
    message: string,
    type: 'info' | 'alert' | 'success' | 'warning' = 'info',
    projectId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipientEmail: userProfile.email,
      title,
      message,
      type,
      read: false,
      projectId,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `gpp-prj-${Date.now().toString(36)}`;
    const newProject: Project = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    // Also sync to Firestore
    try {
      await setDoc(doc(db, 'projects', id), newProject);
    } catch (e) {
      console.warn('Firestore setDoc project warning:', e);
    }

    triggerNotification(
      'New Project Initiated',
      `Project "${newProject.title}" (${newProject.code}) was created.`,
      'success',
      id
    );

    addActivityUpdate({
      projectId: id,
      projectTitle: newProject.title,
      authorEmail: userProfile.email,
      authorName: userProfile.displayName,
      title: `Project Registered: ${newProject.title}`,
      summary: `Initiated project under client ${newProject.clientName} with budget R${newProject.budgetZAR.toLocaleString()}.`,
      type: 'status_report',
      tags: ['New Project', newProject.location],
    });

    return id;
  };

  const updateProject = async (id: string, updatesData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatesData, updatedAt: new Date().toISOString() } : p))
    );

    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updatesData,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore updateDoc project warning:', e);
    }

    triggerNotification('Project Updated', `Project details modified.`, 'info', id);
  };

  const deleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    setMilestones((prev) => prev.filter((m) => m.projectId !== id));
    setDocuments((prev) => prev.filter((d) => d.projectId !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);

    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (e) {
      console.warn('Firestore deleteDoc project warning:', e);
    }

    triggerNotification('Project Removed', `Project "${target?.title || id}" was archived.`, 'warning');
  };

  const addTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `task-${Date.now().toString(36)}`;
    const newTask: Task = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // Recalculate project completion percentage if relevant
    const relatedProject = projects.find((p) => p.id === data.projectId);
    if (relatedProject) {
      const projectTasks = [...tasks.filter((t) => t.projectId === data.projectId), newTask];
      const completedCount = projectTasks.filter((t) => t.status === 'completed').length;
      const pct = Math.round((completedCount / projectTasks.length) * 100);
      updateProject(data.projectId, { completionPercentage: pct });
    }

    triggerNotification(
      'Task Assigned',
      `New task "${newTask.title}" assigned to ${newTask.assigneeName}.`,
      'info',
      data.projectId
    );

    return id;
  };

  const updateTask = async (id: string, updatesData: Partial<Task>) => {
    let updatedTaskRef: Task | undefined;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updatesData, updatedAt: new Date().toISOString() };
          updatedTaskRef = updated;
          return updated;
        }
        return t;
      })
    );

    if (updatedTaskRef) {
      const projId = updatedTaskRef.projectId;
      const currentTasks = tasks.map((t) => (t.id === id ? { ...t, ...updatesData } : t));
      const pTasks = currentTasks.filter((t) => t.projectId === projId);
      if (pTasks.length > 0) {
        const completed = pTasks.filter((t) => t.status === 'completed').length;
        const pct = Math.round((completed / pTasks.length) * 100);
        updateProject(projId, { completionPercentage: pct });
      }

      if (updatesData.status === 'completed') {
        triggerNotification(
          'Task Completed',
          `Task "${updatedTaskRef.title}" has been marked completed!`,
          'success',
          projId
        );
        addActivityUpdate({
          projectId: projId,
          projectTitle: projects.find((p) => p.id === projId)?.title,
          authorEmail: userProfile.email,
          authorName: userProfile.displayName,
          title: `Task Completed: ${updatedTaskRef.title}`,
          summary: `Signed off by ${userProfile.displayName}. Overall project progress updated.`,
          type: 'task_completed',
          tags: ['Task', 'Complete'],
        });
      }
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addMilestone = async (data: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `ms-${Date.now().toString(36)}`;
    const newMs: Milestone = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMilestones((prev) => [...prev, newMs]);
    triggerNotification('Milestone Established', `Milestone "${newMs.title}" scheduled.`, 'info', data.projectId);
    return id;
  };

  const updateMilestone = async (id: string, updatesData: Partial<Milestone>) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updatesData, updatedAt: new Date().toISOString() };
          if (updatesData.status === 'completed' && m.status !== 'completed') {
            triggerNotification('Milestone Reached!', `Phase "${m.title}" marked completed!`, 'success', m.projectId);
            addActivityUpdate({
              projectId: m.projectId,
              projectTitle: projects.find((p) => p.id === m.projectId)?.title,
              authorEmail: userProfile.email,
              authorName: userProfile.displayName,
              title: `Milestone Achieved: ${m.title}`,
              summary: `Deliverables verified and accepted. Progress marked at 100%.`,
              type: 'milestone_reached',
              tags: ['Milestone', 'Phase Complete'],
            });
          }
          return updated;
        }
        return m;
      })
    );
  };

  const deleteMilestone = async (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const addDocument = async (data: Omit<ProjectDocument, 'id' | 'createdAt'>): Promise<string> => {
    const id = `doc-${Date.now().toString(36)}`;
    const newDoc: ProjectDocument = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      downloadCount: 1,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    triggerNotification(
      'Document Published',
      `File "${newDoc.title}" uploaded to central repository.`,
      'info',
      data.projectId
    );

    addActivityUpdate({
      projectId: data.projectId,
      projectTitle: projects.find((p) => p.id === data.projectId)?.title,
      authorEmail: userProfile.email,
      authorName: userProfile.displayName,
      title: `Document Uploaded: ${newDoc.title}`,
      summary: `Category: ${newDoc.category.toUpperCase()} | Version ${newDoc.version} (${newDoc.fileSize})`,
      type: 'document_added',
      tags: ['Repository', newDoc.category],
    });

    return id;
  };

  const deleteDocument = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    triggerNotification('Document Removed', 'File was deleted from central repository.', 'warning');
  };

  const addActivityUpdate = async (data: Omit<ActivityUpdate, 'id' | 'createdAt'>): Promise<string> => {
    const id = `upd-${Date.now().toString(36)}`;
    const newUpd: ActivityUpdate = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setUpdates((prev) => [newUpd, ...prev]);
    return id;
  };

  const addClient = async (data: Omit<ClientPartner, 'id' | 'createdAt'>): Promise<string> => {
    const id = `client-${Date.now().toString(36)}`;
    const newClient: ClientPartner = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    triggerNotification('Client Partner Registered', `"${newClient.name}" added to partner network.`, 'success');
    return id;
  };

  const updateClient = async (id: string, updatesData: Partial<ClientPartner>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatesData } : c)));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToInitialData = () => {
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setMilestones(INITIAL_MILESTONES);
    setDocuments(INITIAL_DOCUMENTS);
    setUpdates(INITIAL_UPDATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setClients(INITIAL_CLIENTS);
    setInvoices(INITIAL_INVOICES);
    localStorage.clear();
    triggerNotification('System Reset', 'Demo data reloaded to defaults.', 'info');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        tasks,
        milestones,
        documents,
        updates,
        notifications,
        clients,
        invoices,
        searchQuery,
        setSearchQuery,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addDocument,
        deleteDocument,
        addActivityUpdate,
        addClient,
        updateClient,
        markNotificationAsRead,
        clearAllNotifications,
        triggerNotification,
        resetToInitialData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
