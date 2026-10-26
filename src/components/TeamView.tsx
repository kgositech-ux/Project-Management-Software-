import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  Plus,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { ADMIN_EMAILS, INITIAL_USERS } from '../data/seedData';
import { UserProfile, UserRole } from '../types';

export const TeamView: React.FC = () => {
  const { userProfile, isAdmin, switchActiveAdminAccount } = useAuth();
  const { tasks, projects } = useProjects();

  const [teamMembers, setTeamMembers] = useState<UserProfile[]>(INITIAL_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('collaborator');
  const [newDept, setNewDept] = useState('Civil Engineering');
  const [newPhone, setNewPhone] = useState('+27 ');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const isHardcodedAdmin = ADMIN_EMAILS.some(
      (adminEmail) => adminEmail.toLowerCase() === newEmail.toLowerCase()
    );

    const newMember: UserProfile = {
      id: `usr-${Date.now()}`,
      email: newEmail.trim(),
      displayName: newName.trim(),
      role: isHardcodedAdmin ? 'admin' : newRole,
      department: newDept,
      phone: newPhone,
      createdAt: new Date().toISOString(),
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setNewEmail('');
    setNewName('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner: Collaborators with Full Administrative Access */}
      <div className="bg-gradient-to-r from-amber-950/30 via-[#18202e] to-[#121620] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Designated Full Administrative Collaborators
                </h2>
                <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Root Admins
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Full administrative authority, security override, and platform governance assigned to:
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition shrink-0"
            >
              <Plus className="w-4 h-4 text-black" />
              Invite Team Member
            </button>
          )}
        </div>

        {/* Primary Admins Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Admin 1: servicewebsites6@gmail.com */}
          <div className="bg-[#121722] border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold flex items-center justify-center text-sm">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Kgosi (Admin)</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                      SUPER ADMIN
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-300/90 font-medium">
                    servicewebsites6@gmail.com
                  </div>
                </div>
              </div>
              <button
                onClick={() => switchActiveAdminAccount(ADMIN_EMAILS[0])}
                className="text-[11px] text-amber-400 hover:underline font-semibold shrink-0"
              >
                Switch To →
              </button>
            </div>
            <div className="text-xs text-slate-400 border-t border-[#1e2738] pt-2 flex items-center justify-between">
              <span>Department: Executive Operations</span>
              <span className="text-slate-300 font-semibold">+27 62 358 7797</span>
            </div>
          </div>

          {/* Admin 2: mthethwapraisegodcebolenkosi@gmail.com */}
          <div className="bg-[#121722] border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-300 font-bold flex items-center justify-center text-sm">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Praisegod Cebolenkosi</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                      SUPER ADMIN
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-300/90 font-medium truncate max-w-[200px] sm:max-w-none">
                    mthethwapraisegodcebolenkosi@gmail.com
                  </div>
                </div>
              </div>
              <button
                onClick={() => switchActiveAdminAccount(ADMIN_EMAILS[1])}
                className="text-[11px] text-amber-400 hover:underline font-semibold shrink-0"
              >
                Switch To →
              </button>
            </div>
            <div className="text-xs text-slate-400 border-t border-[#1e2738] pt-2 flex items-center justify-between">
              <span>Department: Infrastructure Lead</span>
              <span className="text-slate-300 font-semibold">+27 71 890 1234</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control Permissions Matrix */}
      <div className="bg-[#121622] border border-[#202a3a] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          Role-Based Access Control (RBAC) Architecture
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#161c28] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-[#20293b]">
              <tr>
                <th className="p-3">Platform Capability</th>
                <th className="p-3 text-amber-400">Super Admin</th>
                <th className="p-3 text-purple-400">Project Manager</th>
                <th className="p-3 text-blue-400">Collaborator / Site Eng</th>
                <th className="p-3 text-slate-400">Client / Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2738]">
              <tr>
                <td className="p-3 font-semibold text-white">Full System Governance & DB Deletion</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-slate-500">✕ Denied</td>
                <td className="p-3 text-slate-500">✕ Denied</td>
                <td className="p-3 text-slate-500">✕ Denied</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Create / Archive Projects & Budgets</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Create Only</td>
                <td className="p-3 text-slate-500">✕ Denied</td>
                <td className="p-3 text-slate-500">✕ Denied</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Assign Tasks & Sign-off Milestones</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-slate-400">Update Own Tasks</td>
                <td className="p-3 text-slate-500">✕ Denied</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Upload & Download Blueprints / Specs</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-slate-400">Download Only</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Publish Live Field Status Reports</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-emerald-400 font-bold">✓ Full Access</td>
                <td className="p-3 text-slate-400">Read Feed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Team Roster */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Team Members & Assigned Workload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => {
            const memberTasks = tasks.filter((t) => t.assigneeEmail.toLowerCase() === member.email.toLowerCase());
            return (
              <div
                key={member.id}
                className="bg-[#121622] border border-[#202a3a] rounded-2xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#18202e] border border-[#263447] text-amber-300 font-bold flex items-center justify-center">
                      {member.displayName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{member.displayName}</h4>
                      <p className="text-xs text-slate-400">{member.department}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {member.role.replace('_', ' ')}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1e2738] space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-amber-300/80 font-medium pt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{memberTasks.length} Assigned active tasks</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Add Team Collaborator
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sipho Dlamini"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@godongwane.co.za"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Department</label>
                <input
                  type="text"
                  placeholder="Civil Works & Quality Control"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="collaborator">Collaborator / Site Engineer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="admin">Full Administrator</option>
                  <option value="viewer">Client / Read-Only Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+27 82 000 0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202a3a]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-[#18202d] text-slate-300 rounded-lg hover:bg-[#202b3c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg"
                >
                  Add Collaborator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
