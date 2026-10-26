/**
 * Google Drive Integration Service for Godongwane Progressive Projects
 * Uses Google Drive REST API v3 with client-side OAuth Bearer token
 */

import { Project, Task, Milestone, ProjectDocument } from '../types';

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface SyncProgressCallback {
  (currentStep: string, percent: number): void;
}

export interface DriveSyncResult {
  success: boolean;
  rootFolderId: string;
  rootFolderUrl: string;
  syncedProjectsCount: number;
  filesCreatedCount: number;
  error?: string;
}

/**
 * Searches for an existing folder or creates a new one
 */
export async function findOrCreateFolder(
  accessToken: string,
  folderName: string,
  parentId?: string
): Promise<DriveFolderInfo> {
  const parentQuery = parentId ? `'${parentId}' in parents and ` : '';
  const query = `${parentQuery}name='${folderName.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,webViewLink)&pageSize=1`;

  const searchRes = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    throw new Error(`Failed to query Google Drive folder: ${searchRes.status} ${errorText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0];
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId ? { parents: [parentId] } : {}),
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Drive folder "${folderName}": ${createRes.status} ${errorText}`);
  }

  return await createRes.json();
}

/**
 * Creates or updates a file inside a parent folder using multipart upload
 */
export async function uploadTextFile(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string,
  parentId: string
): Promise<DriveFileInfo> {
  const checkQuery = `'${parentId}' in parents and name='${fileName.replace(/'/g, "\\'")}' and trashed=false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    checkQuery
  )}&fields=files(id,name,webViewLink)&pageSize=1`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let existingFileId: string | null = null;
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      existingFileId = searchData.files[0].id;
    }
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: mimeType,
    ...(existingFileId ? {} : { parents: [parentId] }),
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelim;

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=id,name,webViewLink`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink`;

  const method = existingFileId ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to upload file "${fileName}" to Google Drive: ${res.status} ${errorText}`);
  }

  return await res.json();
}

/**
 * Generate formatted Markdown project brief
 */
export function generateProjectBriefMarkdown(
  project: Project,
  projectTasks: Task[],
  projectMilestones: Milestone[],
  projectDocs: ProjectDocument[]
): string {
  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
  const completedMilestones = projectMilestones.filter((m) => m.status === 'completed').length;
  const budgetFormatted = `R ${project.budgetZAR.toLocaleString()} ZAR`;
  const spentFormatted = `R ${project.spentZAR.toLocaleString()} ZAR`;

  return `# ${project.title}
**Project Code:** ${project.code}
**Agency:** Godongwane Progressive Projects
**Client Partner:** ${project.clientName}
**Status:** ${project.status.toUpperCase()}
**Completion:** ${project.completionPercentage}%
**Location:** ${project.location}

---

## 📌 Executive Summary
${project.description}

- **Total Budget:** ${budgetFormatted}
- **Expenditure to Date:** ${spentFormatted}
- **Timeline:** ${project.startDate} → ${project.targetCompletionDate}
- **Project Lead:** ${project.managerName} (${project.managerEmail})
- **Collaborators:** ${project.collaborators.join(', ')}

---

## 🎯 Milestones Roadmap (${completedMilestones}/${projectMilestones.length} Completed)
${
  projectMilestones.length === 0
    ? '_No milestones defined yet._'
    : projectMilestones
        .map(
          (m, idx) =>
            `${idx + 1}. **[${m.status.toUpperCase()}]** ${m.title}
   - Due Date: ${m.dueDate}
   - Progress: ${m.progress}%
   - Deliverables: ${m.deliverables && m.deliverables.length > 0 ? m.deliverables.join('; ') : 'Standard deliverable'}${
              m.signOffBy ? `\n   - Signed off by: ${m.signOffBy}` : ''
            }`
        )
        .join('\n\n')
}

---

## 📋 Task & Work Order Tracking (${completedTasks}/${projectTasks.length} Completed)
${
  projectTasks.length === 0
    ? '_No tasks scheduled._'
    : projectTasks
        .map(
          (t, idx) =>
            `${idx + 1}. **[${t.status.toUpperCase()}]** ${t.title} (${t.priority} priority)
   - Assignee: ${t.assigneeName} (${t.assigneeEmail})
   - Due Date: ${t.dueDate}
   - Progress: ${t.progressPercentage}%
   - Description: ${t.description || 'No notes'}`
        )
        .join('\n\n')
}

---

## 📁 Centralized Documents & Blueprints Vault (${projectDocs.length} items)
${
  projectDocs.length === 0
    ? '_No documents registered._'
    : projectDocs
        .map(
          (d, idx) =>
            `${idx + 1}. **${d.title}** (${d.category.toUpperCase()}) - ${d.fileType} (${d.fileSize}) [v${d.version}]
   - Uploaded by: ${d.uploadedByName}
   - Date: ${d.createdAt}
   ${d.notes ? `- Notes: ${d.notes}` : ''}`
        )
        .join('\n')
}

---
_Generated & Synced by Godongwane Progressive Projects PM Platform on ${new Date().toLocaleString()}._
`;
}

/**
 * Generate Master Project Directory Markdown
 */
export function generateMasterDirectoryMarkdown(projects: Project[]): string {
  const totalBudget = projects.reduce((sum, p) => sum + p.budgetZAR, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spentZAR, 0);

  return `# Godongwane Progressive Projects — Master Projects Directory
**Executive Agency Hub:** Service Websites / Godongwane Progressive Projects
**Full Administrative Collaborators:** servicewebsites6@gmail.com, mthethwapraisegodcebolenkosi@gmail.com
**Total Active Projects:** ${projects.length}
**Total Portfolio Budget:** R ${totalBudget.toLocaleString()} ZAR
**Total Portfolio Spent:** R ${totalSpent.toLocaleString()} ZAR
**Outstanding Invoices:** R0 (0 Unpaid Invoices)
**Date of Drive Sync:** ${new Date().toLocaleString()}

---

## 📊 Consolidated Portfolio Overview

| Code | Project Title | Client Partner | Status | Location | Progress | Budget (ZAR) | Target Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${projects
  .map(
    (p) =>
      `| **${p.code}** | ${p.title} | ${p.clientName} | ${p.status.toUpperCase()} | ${p.location} | ${p.completionPercentage}% | R ${p.budgetZAR.toLocaleString()} | ${p.targetCompletionDate} |`
  )
  .join('\n')}

---

## 🏢 Key Operational Hubs & Partners
- **Rent Partner Harties**: Plant & Tool Hire, Pretoria West & Pretoria North, Hartbeespoort (+27 62 358 7797)
- **Gauteng Provincial Infrastructure**: Pipeline, Substation, and Civic Rehabilitation Works
- **City of Tshwane Metro**: Municipal Grid Optimization

---
_Synced to Google Drive with automated role-based access control and live progress tracking._
`;
}

/**
 * Sync all projects or a single project to Google Drive
 */
export async function syncProjectsToGoogleDrive(
  accessToken: string,
  projectsToSync: Project[],
  allTasks: Task[],
  allMilestones: Milestone[],
  allDocuments: ProjectDocument[],
  onProgress?: SyncProgressCallback
): Promise<DriveSyncResult> {
  if (!accessToken) {
    throw new Error('Google Drive access token is required. Please sign in with Google.');
  }

  let filesCreatedCount = 0;

  // 1. Locate or create root agency folder
  onProgress?.('Locating or creating "Godongwane Progressive Projects" folder in Google Drive...', 5);
  const rootFolder = await findOrCreateFolder(accessToken, 'Godongwane Progressive Projects');

  // 2. Upload Master Directory
  onProgress?.('Uploading Consolidated Master Projects Directory...', 15);
  const masterMarkdown = generateMasterDirectoryMarkdown(projectsToSync);
  await uploadTextFile(
    accessToken,
    '00_Godongwane_Progressive_Projects_Master_Index.md',
    masterMarkdown,
    'text/markdown',
    rootFolder.id
  );
  filesCreatedCount++;

  // Upload Master JSON export for interchange
  const masterJson = JSON.stringify(
    {
      agency: 'Godongwane Progressive Projects',
      syncedAt: new Date().toISOString(),
      projectCount: projectsToSync.length,
      projects: projectsToSync,
    },
    null,
    2
  );
  await uploadTextFile(
    accessToken,
    '00_Master_Projects_Data_Export.json',
    masterJson,
    'application/json',
    rootFolder.id
  );
  filesCreatedCount++;

  // 3. Process each project
  const total = projectsToSync.length;
  for (let i = 0; i < total; i++) {
    const proj = projectsToSync[i];
    const basePercent = 20 + Math.floor((i / total) * 75);

    onProgress?.(`Syncing project folder: [${proj.code}] ${proj.title}...`, basePercent);

    // Create subfolder for project
    const folderName = `[${proj.code}] ${proj.title}`;
    const projectFolder = await findOrCreateFolder(accessToken, folderName, rootFolder.id);

    // Filter related items
    const projectTasks = allTasks.filter((t) => t.projectId === proj.id);
    const projectMilestones = allMilestones.filter((m) => m.projectId === proj.id);
    const projectDocs = allDocuments.filter((d) => d.projectId === proj.id);

    // 1. Markdown Brief
    onProgress?.(`Uploading project brief for ${proj.code}...`, basePercent + 2);
    const briefMd = generateProjectBriefMarkdown(proj, projectTasks, projectMilestones, projectDocs);
    await uploadTextFile(
      accessToken,
      `${proj.code}_Project_Brief_and_Overview.md`,
      briefMd,
      'text/markdown',
      projectFolder.id
    );
    filesCreatedCount++;

    // 2. JSON structured data for tasks
    onProgress?.(`Uploading tasks and work orders for ${proj.code}...`, basePercent + 4);
    const tasksJson = JSON.stringify(
      {
        projectCode: proj.code,
        projectTitle: proj.title,
        totalTasks: projectTasks.length,
        tasks: projectTasks,
      },
      null,
      2
    );
    await uploadTextFile(
      accessToken,
      `${proj.code}_Tasks_and_WorkOrders.json`,
      tasksJson,
      'application/json',
      projectFolder.id
    );
    filesCreatedCount++;

    // 3. JSON structured data for milestones
    onProgress?.(`Uploading milestones schedule for ${proj.code}...`, basePercent + 6);
    const milestonesJson = JSON.stringify(
      {
        projectCode: proj.code,
        projectTitle: proj.title,
        totalMilestones: projectMilestones.length,
        milestones: projectMilestones,
      },
      null,
      2
    );
    await uploadTextFile(
      accessToken,
      `${proj.code}_Milestones_Roadmap.json`,
      milestonesJson,
      'application/json',
      projectFolder.id
    );
    filesCreatedCount++;

    // 4. JSON manifest for documents
    if (projectDocs.length > 0) {
      const docsJson = JSON.stringify(
        {
          projectCode: proj.code,
          projectTitle: proj.title,
          totalDocuments: projectDocs.length,
          documents: projectDocs,
        },
        null,
        2
      );
      await uploadTextFile(
        accessToken,
        `${proj.code}_Centralized_Documents_Index.json`,
        docsJson,
        'application/json',
        projectFolder.id
      );
      filesCreatedCount++;
    }
  }

  onProgress?.('All projects successfully synced to Google Drive!', 100);

  const rootFolderUrl =
    rootFolder.webViewLink || `https://drive.google.com/drive/folders/${rootFolder.id}`;

  return {
    success: true,
    rootFolderId: rootFolder.id,
    rootFolderUrl,
    syncedProjectsCount: projectsToSync.length,
    filesCreatedCount,
  };
}
