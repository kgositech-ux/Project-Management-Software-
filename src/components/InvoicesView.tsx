import React, { useState } from 'react';
import {
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  DollarSign,
  TrendingUp,
  FileText,
  Building,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { InvoiceItem } from '../types';

export const InvoicesView: React.FC = () => {
  const { invoices, projects } = useProjects();
  const { isAdmin } = useAuth();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalInvoicedZAR = invoices.reduce((acc, inv) => acc + inv.amountZAR, 0);
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const outstandingInvoices = invoices.filter(
    (inv) => inv.status === 'issued' || inv.status === 'overdue'
  );
  const outstandingAmountZAR = outstandingInvoices.reduce((acc, inv) => acc + inv.amountZAR, 0);

  const filteredInvoices = invoices.filter(
    (inv) => statusFilter === 'all' || inv.status === statusFilter
  );

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    const text = `
================================================================================
TAX INVOICE - GODONGWANE PROGRESSIVE PROJECTS (PTY) LTD
Invoice Number: ${inv.invoiceNumber}
Date of Issue: ${inv.issueDate}
Due Date: ${inv.dueDate}
Payment Status: ${inv.status.toUpperCase()} (${inv.paidDate ? `Paid on ${inv.paidDate}` : 'Pending'})
================================================================================
CLIENT / ENTITY:
${inv.clientName}

PROJECT DETAILS:
${inv.projectTitle}
Project Code Ref: ${inv.projectId}

LINE ITEM DESCRIPTION:
Phase Construction, Plant & Equipment Hire, and Civil Execution Milestones.
Total Amount Due: R ${inv.amountZAR.toLocaleString()} ZAR
VAT (15%): Inclusive

BANKING DETAILS:
Account Name: Godongwane Progressive Projects
Bank: First National Bank (FNB) / Standard Bank South Africa
Branch Code: 250655
Account Type: Business Cheque
================================================================================
Thank you for your business.
Pretoria West • Pretoria North • Hartbeespoort Regional Hub
================================================================================
    `;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inv.invoiceNumber}_Godongwane_Projects.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Financial KPI Metrics matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Outstanding Invoices matching Screenshot 3 */}
        <div className="bg-[#121622] border border-[#1f2838] rounded-2xl p-5 shadow-md">
          <div className="text-[11px] uppercase font-bold text-slate-400">
            OUTSTANDING INVOICES
          </div>
          <div className="text-4xl font-serif font-normal text-[#e5c07b] mt-1 tracking-tight">
            R{outstandingAmountZAR.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {outstandingInvoices.length} unpaid invoices
          </p>
        </div>

        <div className="bg-[#121622] border border-[#1f2838] rounded-2xl p-5 shadow-md">
          <div className="text-[11px] uppercase font-bold text-slate-400">
            TOTAL BILLED (YTD)
          </div>
          <div className="text-4xl font-serif font-normal text-emerald-400 mt-1 tracking-tight">
            R{(totalInvoicedZAR / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            100% remittance collections
          </p>
        </div>

        <div className="bg-[#121622] border border-[#1f2838] rounded-2xl p-5 shadow-md">
          <div className="text-[11px] uppercase font-bold text-slate-400">
            PAYROLL & PLANT HIRE
          </div>
          <div className="text-4xl font-serif font-normal text-sky-400 mt-1 tracking-tight">
            R1.8M
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Rent Partner Harties & crew
          </p>
        </div>

        <div className="bg-[#121622] border border-[#1f2838] rounded-2xl p-5 shadow-md">
          <div className="text-[11px] uppercase font-bold text-slate-400">
            ACTIVE CONTRACT JOBS
          </div>
          <div className="text-4xl font-serif font-normal text-purple-400 mt-1 tracking-tight">
            {projects.length}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Pretoria corridor developments
          </p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-[#11151f] border border-[#1e2738] rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Project Invoices & Fiscal Ledger
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {['all', 'paid', 'issued', 'draft'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#161c28] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-[#20293b]">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Project & Scope</th>
                <th className="p-3.5">Client Entity</th>
                <th className="p-3.5">Amount (ZAR)</th>
                <th className="p-3.5">Issued / Due</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2738]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#161c28]/60 transition">
                  <td className="p-3.5 font-mono font-bold text-amber-300">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-100">{inv.projectTitle}</div>
                    <div className="text-[10px] text-slate-500">{inv.projectId}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{inv.clientName}</td>
                  <td className="p-3.5 font-serif font-bold text-emerald-400 text-sm">
                    R{inv.amountZAR.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    <div>Issued: {inv.issueDate}</div>
                    <div className="text-slate-500">Due: {inv.dueDate}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Paid ({inv.paidDate})
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv)}
                      className="px-2.5 py-1.5 bg-[#18202d] hover:bg-[#222c3d] text-amber-300 text-xs font-semibold rounded-lg border border-[#27354d] transition flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3 h-3" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
