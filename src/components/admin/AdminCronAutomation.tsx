import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  TrendingUp,
  Award,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const AdminCronAutomation: React.FC = () => {
  const {
    cronActive,
    setCronActive,
    cronLogs,
    lastCronRun,
    triggerManualCronCycle,
    userInvestments,
    showToast,
  } = useApp();

  const [isRunningManual, setIsRunningManual] = useState(false);
  const [lastCycleResult, setLastCycleResult] = useState<{
    maturedCount: number;
    yieldDistributedUsd: number;
  } | null>(null);

  const runningInvestments = userInvestments.filter((i) => i.status === 'running' || !i.status);
  const completedInvestments = userInvestments.filter((i) => i.status === 'completed');

  const handleRunImmediateCycle = () => {
    setIsRunningManual(true);
    setTimeout(() => {
      const result = triggerManualCronCycle();
      setLastCycleResult({
        maturedCount: result.maturedCount,
        yieldDistributedUsd: result.yieldDistributedUsd,
      });
      setIsRunningManual(false);
    }, 800);
  };

  const handleToggleCron = () => {
    const nextState = !cronActive;
    setCronActive(nextState);
    showToast(
      nextState
        ? 'Automated ROI yield Cron engine ACTIVATED. Background interval running every 60s.'
        : 'Automated ROI yield Cron engine PAUSED.',
      nextState ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-black text-xl text-white">
              Automated Investment ROI & Yield Cron Engine
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Automates daily dividend yield accruals and immediately returns capital + ROI earnings to user dashboard wallets upon investment plan maturity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Engine Status Toggle */}
          <button
            type="button"
            onClick={handleToggleCron}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer border shadow-md ${
              cronActive
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/30'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {cronActive ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>ENGINE: {cronActive ? 'ACTIVE (AUTO-60s)' : 'PAUSED'}</span>
          </button>

          {/* Trigger Manual Cycle */}
          <button
            type="button"
            onClick={handleRunImmediateCycle}
            disabled={isRunningManual}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/40 transition cursor-pointer disabled:opacity-60"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRunningManual ? 'animate-spin' : ''}`} />
            <span>{isRunningManual ? 'Executing Cycle...' : 'Execute Immediate Cycle'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Automated Engine State</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${cronActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}
            />
            <span className="font-heading font-black text-xl text-white font-mono">
              {cronActive ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 block font-mono">
            {cronActive ? 'Evaluates every 60s' : 'Halted by administrator'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Active Yield Contracts</span>
          <span className="font-heading font-black text-xl text-emerald-400 font-mono">
            {runningInvestments.length} Active
          </span>
          <span className="text-[10px] text-emerald-500 block font-mono">Accruing incremental ROI</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Matured Plans Settled</span>
          <span className="font-heading font-black text-xl text-cyan-400 font-mono">
            {completedInvestments.length} Settled
          </span>
          <span className="text-[10px] text-cyan-500 block font-mono">Principal + ROI credited</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Last Cycle Execution</span>
          <span className="font-heading font-bold text-xs text-zinc-200 font-mono block truncate mt-1">
            {lastCronRun || 'Scheduled & Ready'}
          </span>
          <span className="text-[10px] text-zinc-500 block font-mono">Audit timestamp synced</span>
        </div>
      </div>

      {/* Immediate Run Feedback Banner */}
      {lastCycleResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between text-xs text-zinc-200 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">
                Manual Cron Cycle Executed Successfully
              </span>
              <span className="text-zinc-400">
                Distributed ${lastCycleResult.yieldDistributedUsd.toFixed(2)} USD incremental dividends across active contracts. {lastCycleResult.maturedCount} plan(s) reached full maturity and were credited to wallets.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-500 text-black px-2.5 py-1 rounded-lg">
            SETTLED
          </span>
        </div>
      )}

      {/* Real-time Cron Terminal & Audit Log */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl space-y-0">
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white font-mono">
              Cron Engine Execution Terminal & Settlement Audit
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500">
              Showing {cronLogs.length} recent log entries
            </span>
          </div>
        </div>

        <div className="p-5 font-mono text-xs bg-black/95 text-zinc-300 space-y-2 max-h-96 overflow-y-auto selection:bg-emerald-500 selection:text-black">
          {cronLogs.length === 0 ? (
            <p className="text-zinc-500">// No cron logs recorded yet. Running cycle...</p>
          ) : (
            cronLogs.map((log, idx) => {
              const isMatured = log.includes('[MATURED]');
              const isYield = log.includes('[YIELD ACCRUED]');
              const isSummary = log.includes('[CRON CYCLE');

              return (
                <div
                  key={idx}
                  className={`py-1 px-2 rounded font-mono text-[11px] leading-relaxed ${
                    isMatured
                      ? 'bg-cyan-950/40 text-cyan-300 border-l-2 border-cyan-400'
                      : isYield
                      ? 'text-emerald-400'
                      : isSummary
                      ? 'bg-zinc-900/60 text-yellow-300 font-bold border-l-2 border-yellow-400'
                      : 'text-zinc-400'
                  }`}
                >
                  <span className="text-zinc-600 mr-2">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
