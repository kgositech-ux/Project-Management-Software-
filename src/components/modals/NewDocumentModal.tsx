import React, { useState } from 'react';
import { FileUp, X, Upload } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { DocumentCategory } from '../../types';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({ isOpen, onClose }) => {
  const { projects, selectedProjectId, addDocument } = useProjects();
  const { userProfile } = useAuth();

  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('blueprint');
  const [fileType, setFileType] = useState('PDF');
  const [fileSize, setFileSize] = useState('4.2 MB');
  const [version, setVersion] = useState('1.0');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addDocument({
      projectId,
      title,
      category,
      fileType,
      fileSize,
      version,
      notes,
      uploadedByEmail: userProfile.email,
      uploadedByName: userProfile.displayName,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            Upload File to Central Repository
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Target Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
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
            <label className="block text-slate-300 font-bold mb-1">Document Title & File Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Pretoria West Structural Foundation Detail.pdf"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              >
                <option value="blueprint">Blueprint & CAD</option>
                <option value="contract">Contract & Hire SLA</option>
                <option value="report">Site & Quality Inspection Report</option>
                <option value="compliance">OHS & Legal Compliance</option>
                <option value="invoice">Invoice / Proof of Remittance</option>
                <option value="other">General Engineering Document</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Format & Extension</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              >
                <option value="PDF">PDF (Portable Document)</option>
                <option value="DWG">DWG (AutoCAD Drawing)</option>
                <option value="XLSX">XLSX (Spreadsheet Data)</option>
                <option value="DOCX">DOCX (Word Specification)</option>
                <option value="PNG">PNG / JPG (Site Photo)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Version</label>
              <input
                type="text"
                placeholder="1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Simulated Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Engineering Notes / Abstract</label>
            <textarea
              rows={3}
              placeholder="Add key notes, inspection stamps, or engineer approvals..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#202a3a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#18202d] text-slate-300 rounded-lg hover:bg-[#202b3c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg transition"
            >
              Upload to Repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
