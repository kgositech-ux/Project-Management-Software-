export type UserRole = 'admin' | 'project_manager' | 'collaborator' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  department: string;
  phone?: string;
  createdAt: string;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  title: string;
  code: string; // e.g. GPP-PRJ-01
  description: string;
  status: ProjectStatus;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  location: string;
  budgetZAR: number;
  spentZAR: number;
  startDate: string;
  targetCompletionDate: string;
  completionPercentage: number;
  managerEmail: string;
  managerName: string;
  collaborators: string[]; // list of emails
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeEmail: string;
  assigneeName: string;
  dueDate: string;
  progressPercentage: number;
  milestoneId?: string;
  milestoneTitle?: string;
  tags?: string[];
  checklist?: TaskChecklistItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  progress: number; // 0 - 100
  deliverables: string[];
  signOffBy?: string;
  signOffDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | 'blueprint'
  | 'contract'
  | 'report'
  | 'compliance'
  | 'invoice'
  | 'other';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: DocumentCategory;
  fileType: string; // e.g. PDF, DWG, XLSX, DOCX, PNG
  fileSize: string; // e.g. "3.4 MB"
  fileUrl?: string;
  uploadedByEmail: string;
  uploadedByName: string;
  version: string;
  notes?: string;
  downloadCount?: number;
  createdAt: string;
}

export type UpdateType =
  | 'status_report'
  | 'milestone_reached'
  | 'task_completed'
  | 'document_added'
  | 'alert';

export interface ActivityUpdate {
  id: string;
  projectId: string;
  projectTitle?: string;
  authorEmail: string;
  authorName: string;
  title: string;
  summary: string;
  type: UpdateType;
  tags?: string[];
  createdAt: string;
}

export type NotificationType = 'info' | 'alert' | 'success' | 'warning';

export interface AppNotification {
  id: string;
  recipientEmail: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  projectId?: string;
  link?: string;
  createdAt: string;
}

export interface ClientPartner {
  id: string;
  name: string;
  handle?: string; // e.g. @rent.partner.harties
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  services: string[];
  specialities: string[];
  activeProjectsCount: number;
  totalContractValueZAR: number;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  amountZAR: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}
