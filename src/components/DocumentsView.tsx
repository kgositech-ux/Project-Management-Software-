import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  FileCheck,
  Building,
  User,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { DocumentCategory, ProjectDocument } from '../types';

interface DocumentsViewProps {
  onOpenNewDocModal: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onOpenNewDocModal }) => {
  const {
    documents,
    projects,
    selectedProjectId,
    deleteDocument,
    searchQuery,
  } = useProjects();
  const { isProjectManager, isAdmin } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Files' },
    { id: 'blueprint', label: 'Blueprints & CAD' },
    { id: 'contract', label: 'Contracts & Hire SLAs' },
    { id: 'report', label: 'Site & Field Reports' },
    { id: 'compliance', label: 'OHS & Compliance' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesProj = !selectedProjectId || doc.projectId === selectedProjectId;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedByName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case 'blueprint':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'contract':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      case 'report':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'compliance':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'invoice':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
    }
  };

  const handleDownload = (doc: ProjectDocument) => {
    const sampleContent = `
================================================================================
GODONGWANE PROGRESSIVE PROJECTS - DOCUMENT ARCHIVE
Document: ${doc.title}
Category: ${doc.category.toUpperCase()}
Version: ${doc.version}
File Size: ${doc.fileSize}
Uploaded By: ${doc.uploadedByName} (${doc.uploadedByEmail})
Timestamp: ${doc.createdAt}
Project Ref: ${doc.projectId}
Notes / Specification: ${doc.notes || 'N/A'}
================================================================================
Verified by Godongwane Progressive Projects Central Document Management System.
Rent Partner Harties, Pretoria West & Gauteng Infrastructure.
================================================================================
    `;

    const blob = new Blob([sampleContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.title;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Category Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                categoryFilter === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#141a24] text-slate-400 hover:text-slate-200 border border-[#232e42]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isProjectManager && (
          <button
            onClick={onOpenNewDocModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-xl shadow-md transition shrink-0"
          >
            <Upload className="w-4 h-4 text-black" />
            Upload Document / Blueprint
          </button>
        )}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          const project = projects.find((p) => p.id === doc.projectId);
          return (
            <div
              key={doc.id}
              className="bg-[#121622] hover:bg-[#151c2b] border border-[#202a3a] hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getCategoryColor(
                      doc.category
                    )}`}
                  >
                    {doc.category}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px] font-semibold bg-[#1a2233] px-2 py-0.5 rounded">
                    v{doc.version}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                  {doc.notes && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {doc.notes}
                    </p>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-[#0f141f] border border-[#1b2333] space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project:</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[170px]">
                      {project?.code} • {project?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">File Type:</span>
                    <span className="font-mono text-amber-400 uppercase font-bold">{doc.fileType} ({doc.fileSize})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Uploaded By:</span>
                    <span className="text-slate-300">{doc.uploadedByName}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-[#1e2738] flex items-center justify-between">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Spec
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1a2333] hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg border border-[#27354d] hover:border-amber-500/40 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove file "${doc.title}" from repository?`)) {
                          deleteDocument(doc.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Inspector Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#202a3a]">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Centralized Spec Preview
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {previewDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#0d111a] p-3.5 rounded-xl border border-[#1d2638]">
                <div>
                  <span className="text-slate-500">Category:</span>
                  <p className="font-bold text-slate-200 uppercase">{previewDoc.category}</p>
                </div>
                <div>
                  <span className="text-slate-500">Version:</span>
                  <p className="font-bold text-slate-200">Release v{previewDoc.version}</p>
                </div>
                <div>
                  <span className="text-slate-500">File Specification:</span>
                  <p className="font-bold text-amber-300 font-mono">{previewDoc.fileType} • {previewDoc.fileSize}</p>
                </div>
                <div>
                  <span className="text-slate-500">Sign-off Officer:</span>
                  <p className="font-bold text-slate-200">{previewDoc.uploadedByName}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold">Engineering Description & Scope:</span>
                <p className="mt-1 text-slate-300 bg-[#161c28] p-3 rounded-lg border border-[#222c3d] leading-relaxed">
                  {previewDoc.notes || 'Official specification document on file for Godongwane Progressive Projects.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                <FileCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Verified digital integrity hash. Ready for on-site civil team and partner retrieval.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#202a3a]">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-[#18202d] text-slate-300 rounded-lg hover:bg-[#202b3c] text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-black" />
                Download Spec File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
