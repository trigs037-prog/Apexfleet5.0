import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserInvestment } from '../../types';
import {
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Award,
  Edit,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  Check,
  X,
  Share2,
  ExternalLink,
  Coins,
  ChevronDown,
} from 'lucide-react';

interface AdminUserInvestmentsProps {
  onOpenDeposit?: () => void;
}

export const AdminUserInvestments: React.FC<AdminUserInvestmentsProps> = () => {
  const {
    userInvestments,
    updateUserInvestment,
    deleteUserInvestment,
    forceMatureInvestment,
    pauseResumeInvestment,
    cancelInvestmentEarly,
    allUsers,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'completed' | 'paused'>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
  const [editingInvestment, setEditingInvestment] = useState<UserInvestment | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Edit modal form state
  const [editForm, setEditForm] = useState<{
    amountInvestedUsd: number;
    apy: number;
    earnedDividendsUsd: number;
    daysElapsed: number;
    durationDays: number;
    status: 'running' | 'completed' | 'paused';
    nextPayoutHours: number;
  }>({
    amountInvestedUsd: 1000,
    apy: 18.5,
    earnedDividendsUsd: 50,
    daysElapsed: 10,
    durationDays: 30,
    status: 'running',
    nextPayoutHours: 24,
  });

  // Filtered investments
  const filtered = userInvestments.filter((inv) => {
    // Status filter
    const status = inv.status || 'running';
    if (statusFilter !== 'all' && status !== statusFilter) return false;

    // User filter
    if (selectedUserFilter !== 'all' && inv.userId !== selectedUserFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const user = allUsers.find((u) => u.id === inv.userId);
      const matchesPool = inv.poolTitle?.toLowerCase().includes(q);
      const matchesId = inv.id?.toLowerCase().includes(q);
      const matchesUser = user?.name.toLowerCase().includes(q) || user?.email.toLowerCase().includes(q);
      return matchesPool || matchesId || matchesUser;
    }

    return true;
  });

  // Aggregate metrics
  const totalStakedUsd = userInvestments.reduce((acc, i) => acc + (i.amountInvestedUsd || 0), 0);
  const totalAccruedYieldUsd = userInvestments.reduce((acc, i) => acc + (i.earnedDividendsUsd || 0), 0);
  const runningCount = userInvestments.filter((i) => i.status === 'running' || !i.status).length;
  const completedCount = userInvestments.filter((i) => i.status === 'completed').length;
  const pausedCount = userInvestments.filter((i) => i.status === 'paused').length;

  const handleOpenEdit = (inv: UserInvestment) => {
    setEditingInvestment(inv);
    setEditForm({
      amountInvestedUsd: inv.amountInvestedUsd,
      apy: inv.apy,
      earnedDividendsUsd: inv.earnedDividendsUsd || 0,
      daysElapsed: inv.daysElapsed || 0,
      durationDays: inv.durationDays || 30,
      status: (inv.status || 'running') as 'running' | 'completed' | 'paused',
      nextPayoutHours: inv.nextPayoutHours || 24,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestment) return;

    updateUserInvestment(editingInvestment.id, {
      amountInvestedUsd: Number(editForm.amountInvestedUsd),
      apy: Number(editForm.apy),
      earnedDividendsUsd: Number(editForm.earnedDividendsUsd),
      daysElapsed: Number(editForm.daysElapsed),
      durationDays: Number(editForm.durationDays),
      status: editForm.status,
      nextPayoutHours: Number(editForm.nextPayoutHours),
    });

    setEditingInvestment(null);
    showToast(`Investment position #${editingInvestment.id} updated!`, 'success');
  };

  const handleWhatsAppShareInvestment = (inv: UserInvestment) => {
    const user = allUsers.find((u) => u.id === inv.userId);
    const text = encodeURIComponent(
      `🚗⚡ Apex Tesla Fleet Investment Position:
Pool: ${inv.poolTitle}
Investor: ${user?.name || 'Apex Member'} (${user?.email || 'Registered'})
Principal Staked: $${inv.amountInvestedUsd.toLocaleString()} USD
APY Yield: ${inv.apy}%
Accrued Dividends: $${inv.earnedDividendsUsd.toFixed(2)} USD
Status: ${inv.status?.toUpperCase()}
Maturity: Day ${inv.daysElapsed}/${inv.durationDays}
Explore Staking: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-black text-xl text-white">
              User Investments & Staking Ledger
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time management of all active, matured, and paused customer staking contracts, APYs, and wallet settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
            Active: {runningCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400">
            Matured: {completedCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
            Paused: {pausedCount}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Total Staked Principal</span>
          <span className="font-heading font-black text-xl text-white font-mono">
            ${totalStakedUsd.toLocaleString()} USD
          </span>
          <span className="text-[10px] text-emerald-400 block font-mono">Across {userInvestments.length} contracts</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Total Accrued Dividends</span>
          <span className="font-heading font-black text-xl text-emerald-400 font-mono">
            ${totalAccruedYieldUsd.toFixed(2)} USD
          </span>
          <span className="text-[10px] text-zinc-500 block font-mono">Automated daily yield accruals</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Active Staking Contracts</span>
          <span className="font-heading font-black text-xl text-amber-400 font-mono">
            {runningCount} Running
          </span>
          <span className="text-[10px] text-zinc-500 block font-mono">Generating telematics ROI</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Matured & Capital Returned</span>
          <span className="font-heading font-black text-xl text-cyan-400 font-mono">
            {completedCount} Completed
          </span>
          <span className="text-[10px] text-cyan-500 block font-mono">Settled to user balances</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pool, user email, ID..."
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter pills */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            {(['all', 'running', 'completed', 'paused'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* User selector */}
          <select
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All Investors ({allUsers.length})</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Investments Table */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Investor</th>
                <th className="p-4">Staking Pool</th>
                <th className="p-4">Principal ($)</th>
                <th className="p-4">APY %</th>
                <th className="p-4">Duration & Progress</th>
                <th className="p-4">Accrued Yield</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 font-mono">
                    No investment positions match the current search / filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const user = allUsers.find((u) => u.id === inv.userId);
                  const progressPct = Math.min(
                    100,
                    Math.round(((inv.daysElapsed || 0) / (inv.durationDays || 30)) * 100)
                  );
                  const isRunning = inv.status === 'running' || !inv.status;
                  const isCompleted = inv.status === 'completed';
                  const isPaused = inv.status === 'paused';

                  return (
                    <tr key={inv.id} className="hover:bg-zinc-900/40 transition">
                      {/* Investor */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
                          />
                          <div>
                            <span className="font-semibold text-white block">
                              {user?.name || 'Apex Staker'}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              {user?.email || 'alex.vance@apex-tesla.io'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pool */}
                      <td className="p-4">
                        <span className="font-heading font-bold text-white block">{inv.poolTitle}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">ID: {inv.id}</span>
                      </td>

                      {/* Principal */}
                      <td className="p-4 font-mono font-bold text-white text-sm">
                        ${inv.amountInvestedUsd.toLocaleString()}
                      </td>

                      {/* APY */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs">
                          {inv.apy}% APY
                        </span>
                      </td>

                      {/* Duration & Progress */}
                      <td className="p-4 space-y-1 w-44">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                          <span>Day {inv.daysElapsed || 0}/{inv.durationDays || 30}</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full ${
                              isCompleted
                                ? 'bg-cyan-400'
                                : isPaused
                                ? 'bg-amber-400'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        {inv.completedAt && (
                          <span className="text-[9px] text-zinc-500 font-mono block">
                            Completed: {inv.completedAt}
                          </span>
                        )}
                      </td>

                      {/* Accrued Yield */}
                      <td className="p-4 font-mono">
                        <span className="font-bold text-emerald-400 text-sm block">
                          +${inv.earnedDividendsUsd.toFixed(2)}
                        </span>
                        {inv.capitalReturned && (
                          <span className="text-[9px] text-cyan-400 block">+ Capital Paid Out</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : isPaused
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-cyan-400' : isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                          <span>{inv.status || 'RUNNING'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Share */}
                          <button
                            onClick={() => handleWhatsAppShareInvestment(inv)}
                            className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition cursor-pointer"
                            title="Share contract details on WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Pause / Resume Toggle */}
                          {isRunning && (
                            <button
                              onClick={() => pauseResumeInvestment(inv.id)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-400 transition cursor-pointer"
                              title="Pause Staking Yields"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isPaused && (
                            <button
                              onClick={() => pauseResumeInvestment(inv.id)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 transition cursor-pointer"
                              title="Resume Staking Yields"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Force Mature & Settle */}
                          {!isCompleted && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Force complete and immediately credit user wallet with $${(inv.amountInvestedUsd + inv.earnedDividendsUsd).toFixed(2)} USD (Principal + ROI)?`)) {
                                  forceMatureInvestment(inv.id);
                                }
                              }}
                              className="px-2 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold font-mono transition cursor-pointer flex items-center gap-1"
                              title="Instantly mature plan and credit user wallet"
                            >
                              <Award className="w-3 h-3 text-cyan-400" />
                              <span className="hidden xl:inline">Payout</span>
                            </button>
                          )}

                          {/* Early Unstake Cancel */}
                          {isRunning && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Cancel early and refund principal minus 5% fee to user wallet?`)) {
                                  cancelInvestmentEarly(inv.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-400 transition cursor-pointer"
                              title="Cancel early & refund"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit Details */}
                          <button
                            onClick={() => handleOpenEdit(inv)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                            title="Edit Investment Parameters"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete investment #${inv.id}?`)) {
                                deleteUserInvestment(inv.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                            title="Delete Position"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Investment Position Modal */}
      {editingInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 text-zinc-100 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-heading font-black text-lg text-white">
                  Edit Staking Position: #{editingInvestment.id}
                </h4>
                <p className="text-xs text-zinc-400">{editingInvestment.poolTitle}</p>
              </div>
              <button
                onClick={() => setEditingInvestment(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1 font-mono">Principal Invested (USD)</label>
                  <input
                    type="number"
                    value={editForm.amountInvestedUsd}
                    onChange={(e) => setEditForm({ ...editForm, amountInvestedUsd: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-mono">APY Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.apy}
                    onChange={(e) => setEditForm({ ...editForm, apy: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1 font-mono">Accrued Dividends (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.earnedDividendsUsd}
                    onChange={(e) => setEditForm({ ...editForm, earnedDividendsUsd: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-mono">Contract Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="running">running</option>
                    <option value="completed">completed</option>
                    <option value="paused">paused</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1 font-mono">Days Elapsed</label>
                  <input
                    type="number"
                    value={editForm.daysElapsed}
                    onChange={(e) => setEditForm({ ...editForm, daysElapsed: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-mono">Total Duration (Days)</label>
                  <input
                    type="number"
                    value={editForm.durationDays}
                    onChange={(e) => setEditForm({ ...editForm, durationDays: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingInvestment(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Save Position Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
