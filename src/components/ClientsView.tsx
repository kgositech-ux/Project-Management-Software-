import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Briefcase,
  ExternalLink,
  Tag,
  CheckCircle,
  Truck,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ClientPartner } from '../types';

export const ClientsView: React.FC = () => {
  const { clients, projects, addClient, searchQuery } = useProjects();
  const { isAdmin } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('@');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+27 ');
  const [whatsapp, setWhatsapp] = useState('+27 ');
  const [location, setLocation] = useState('Pretoria West, South Africa');
  const [services, setServices] = useState('Plant Hire, Earthmoving Machinery, Scaffolding');
  const [specialities, setSpecialities] = useState('In-store pickup, Delivery, In-store shopping');
  const [notes, setNotes] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    await addClient({
      name,
      handle,
      contactPerson,
      email,
      phone,
      whatsapp,
      location,
      services: services.split(',').map((s) => s.trim()).filter(Boolean),
      specialities: specialities.split(',').map((s) => s.trim()).filter(Boolean),
      activeProjectsCount: 1,
      totalContractValueZAR: 2500000,
      notes,
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Client Directory & Logistics Partners
          </h2>
          <p className="text-xs text-slate-400">
            Pretoria West, Pretoria North, Hartbeespoort and provincial project networks
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-xl shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4 text-black" />
            Register Partner / Client
          </button>
        )}
      </div>

      {/* Client Cards: Featuring Screenshot 1 style for Rent Partner Harties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter(
            (p) => p.clientName.toLowerCase() === client.name.toLowerCase()
          );

          return (
            <div
              key={client.id}
              className="bg-[#121622] border border-[#202a3a] hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-lg transition group"
            >
              <div className="space-y-4">
                {/* Header matching Screenshot 1 */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1d2636] to-[#141b27] border border-[#2a374d] text-amber-400 font-bold flex items-center justify-center text-lg shadow-inner">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                        {client.name}
                      </h3>
                      {client.handle && (
                        <p className="text-xs text-amber-400 font-mono">{client.handle}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Partner
                  </span>
                </div>

                {/* Location row matching Screenshot 1: Pretoria West · Pretoria North */}
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{client.location}</span>
                </div>

                {/* Services & Specialities matching Screenshot 1 */}
                <div className="space-y-2 pt-2 border-t border-[#1e2738]">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Specialities & Service Modes:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {client.specialities.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#18202e] text-slate-200 border border-[#263347] font-medium flex items-center gap-1.5"
                      >
                        {spec.toLowerCase().includes('delivery') && <Truck className="w-3 h-3 text-amber-400" />}
                        {spec.toLowerCase().includes('pickup') && <Store className="w-3 h-3 text-sky-400" />}
                        {spec.toLowerCase().includes('shopping') && <ShoppingBag className="w-3 h-3 text-emerald-400" />}
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact info list matching Screenshot 1 */}
                <div className="bg-[#0e121a] rounded-xl p-3.5 border border-[#1b2333] space-y-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Direct Contact Directory
                  </div>

                  {client.handle && (
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <span className="w-5 text-amber-400 font-bold text-center">@</span>
                      <span className="font-mono text-slate-300">{client.handle.replace('@', '')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>

                  {client.whatsapp && (
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>WhatsApp: {client.whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Connect Action Buttons */}
              <div className="pt-3 border-t border-[#1e2738] flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 text-center flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>

                <a
                  href={`tel:${client.phone}`}
                  className="py-2 px-3 bg-[#18202e] hover:bg-[#202b3d] text-slate-200 text-xs font-semibold rounded-xl border border-[#263347] transition"
                  title="Call contact"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`mailto:${client.email}`}
                  className="py-2 px-3 bg-[#18202e] hover:bg-[#202b3d] text-slate-200 text-xs font-semibold rounded-xl border border-[#263347] transition"
                  title="Email contact"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-[#253247] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Register New Partner / Client
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rent Partner Harties"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Social / Tag Handle</label>
                  <input
                    type="text"
                    placeholder="@rent.partner.harties"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Operating Location</label>
                <input
                  type="text"
                  placeholder="Pretoria West, South Africa · Pretoria North, South Africa"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+27 62 358 7797"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">WhatsApp Line</label>
                  <input
                    type="text"
                    placeholder="+27 62 358 7797"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="hire@hartiestoolhire.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Specialities (comma separated)</label>
                <input
                  type="text"
                  placeholder="In-store pickup, Delivery, In-store shopping, Plant Hire"
                  value={specialities}
                  onChange={(e) => setSpecialities(e.target.value)}
                  className="w-full bg-[#161c28] border border-[#253247] rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202a3a]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#18202d] text-slate-300 rounded-lg hover:bg-[#202b3c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
