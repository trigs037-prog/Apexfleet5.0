import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminNotificationMessage, NotificationPriority, NotificationType, User } from '../../types';
import {
  Bell,
  Send,
  Users,
  User as UserIcon,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Info,
  Sparkles,
  Trash2,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  ExternalLink,
  Clock,
  Shield,
  Radio,
} from 'lucide-react';

export const AdminNotificationDashboard: React.FC = () => {
  const {
    adminNotifications,
    sendNotification,
    deleteNotification,
    allUsers,
    showToast,
  } = useApp();

  // Composer Form state
  const [targetType, setTargetType] = useState<'all' | 'individual'>('all');
  const [targetUserId, setTargetUserId] = useState<string>(allUsers[0]?.id || 'usr-apex-001');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('announcement');
  const [priority, setPriority] = useState<NotificationPriority>('normal');
  const [actionLabel, setActionLabel] = useState('View Details');
  const [actionUrl, setActionUrl] = useState('investment');
  const [isSending, setIsSending] = useState(false);

  // Filter for sent notifications table
  const [historyFilter, setHistoryFilter] = useState<'all' | 'broadcast' | 'individual'>('all');

  const selectedUser = allUsers.find((u) => u.id === targetUserId);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please provide both notification title and message.', 'error');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      sendNotification({
        title,
        message,
        type,
        priority,
        targetType,
        targetUserId: targetType === 'individual' ? targetUserId : undefined,
        targetUserEmail: targetType === 'individual' ? selectedUser?.email : undefined,
        actionLabel: actionLabel.trim() || undefined,
        actionUrl: actionUrl.trim() || undefined,
      });

      setIsSending(false);
      setTitle('');
      setMessage('');
      showToast(
        targetType === 'all'
          ? 'Broadcast notification dispatched to all user dashboards!'
          : `Custom notification sent to ${selectedUser?.name || 'user'}!`,
        'success'
      );
    }, 600);
  };

  const filteredHistory = adminNotifications.filter((n) => {
    if (historyFilter === 'broadcast') return n.targetType === 'all';
    if (historyFilter === 'individual') return n.targetType === 'individual';
    return true;
  });

  const onlineUsers = allUsers.filter((u) => u.isOnline);

  const getTypeIcon = (t: NotificationType) => {
    switch (t) {
      case 'payout':
        return DollarSign;
      case 'investment':
        return TrendingUp;
      case 'alert':
        return AlertTriangle;
      case 'bonus':
        return Sparkles;
      case 'system':
        return Shield;
      default:
        return Bell;
    }
  };

  const PreviewIcon = getTypeIcon(type);

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-black text-xl text-white">
              Notification Message Dashboard & Dispatcher
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Compose and broadcast customized alerts, yield updates, bonus drops, or direct individual notices to user dashboards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Online Users: {onlineUsers.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            Total Users: {allUsers.length}
          </span>
        </div>
      </div>

      {/* Online Users & Real-Time Activity Monitor Bar */}
      <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Live Online Users & Last Visited Activity Monitor
            </h4>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Real-time heartbeat telematics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {allUsers.slice(0, 4).map((u) => (
            <div
              key={u.id}
              className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start justify-between gap-3 group hover:border-zinc-700 transition"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-xl object-cover border border-zinc-700"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-950 ${
                      u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
                    }`}
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="font-heading font-bold text-xs text-white block truncate">
                    {u.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block truncate">
                    {u.email}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                    <Globe className="w-2.5 h-2.5 text-zinc-500" />
                    <span className="text-emerald-400 truncate font-semibold">
                      {u.lastVisitedPath || '/investment'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTargetType('individual');
                  setTargetUserId(u.id);
                  setTitle(`Direct Notice for ${u.name}`);
                  showToast(`Selected ${u.name} for direct message.`, 'info');
                }}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 text-[10px] font-mono font-bold transition cursor-pointer shrink-0"
                title="Send customized direct notification"
              >
                Direct
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Composer (Left) + Live Card Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Composer Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Send className="w-4 h-4 text-amber-400" />
            <h4 className="font-heading font-black text-base text-white">
              Compose Customized User Notification
            </h4>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            {/* Target Audience Selector */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 block font-mono font-bold">
                Recipient Audience Target
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('all')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    targetType === 'all'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Broadcast (All Users)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('individual')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    targetType === 'individual'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Specific Individual User</span>
                </button>
              </div>
            </div>

            {/* Individual user picker */}
            {targetType === 'individual' && (
              <div className="space-y-1 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                <label className="text-zinc-300 block font-mono font-medium">
                  Select User Account
                </label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.email} ({u.tier})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">
                  Notification Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NotificationType)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="announcement">Announcement (General)</option>
                  <option value="payout">Payout / Dividend (Money)</option>
                  <option value="investment">Investment / Staking</option>
                  <option value="alert">Security / Urgent Alert</option>
                  <option value="bonus">Bonus / Giveaway Drop</option>
                  <option value="system">System / Operations</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">
                  Priority Badge
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="low">Low (Subtle)</option>
                  <option value="normal">Normal</option>
                  <option value="high">High (Featured)</option>
                  <option value="urgent">Urgent (Red Border)</option>
                </select>
              </div>
            </div>

            {/* Notification Title */}
            <div className="space-y-1">
              <label className="text-zinc-300 block font-mono font-medium">
                Notification Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ⚡ Autonomous Fleet Staking APY Boosted to 22.4%"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-semibold"
                required
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-zinc-300 block font-mono font-medium">
                Message Body Copy
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the update, dividend details, or instructions for the user..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                required
              />
            </div>

            {/* Action Button & Target Tab */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder="e.g. View Yield Pool"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">
                  Destination Tab / Route
                </label>
                <select
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="investment">investment (Fleet Yields)</option>
                  <option value="wallet">wallet (Vault & Balances)</option>
                  <option value="services">services (Tesla Repairs)</option>
                  <option value="wraps">wraps (Custom Studio)</option>
                  <option value="rentals">rentals (Rental Fleet)</option>
                  <option value="promotions">promotions (Spin & Scratch)</option>
                  <option value="referrals">referrals (Invite $100)</option>
                  <option value="deposit">deposit (Funding Gateway)</option>
                </select>
              </div>
            </div>

            {/* Dispatch Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-heading font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSending
                    ? 'Dispatching To Dashboard...'
                    : targetType === 'all'
                    ? 'Broadcast Message to All User Dashboards'
                    : `Send Message to ${selectedUser?.name || 'User'}`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-300">
              User Dashboard Interactive Preview
            </h4>
          </div>

          <div
            className={`p-5 rounded-3xl bg-zinc-950 border shadow-2xl space-y-3 relative overflow-hidden ${
              priority === 'urgent'
                ? 'border-rose-500/80 bg-rose-950/20'
                : priority === 'high'
                ? 'border-amber-500/60 bg-amber-950/20'
                : 'border-zinc-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    type === 'payout'
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      : type === 'alert'
                      ? 'bg-rose-600/30 text-rose-400 border border-rose-500/40'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <PreviewIcon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-sm text-white leading-tight">
                    {title || '⚡ Notification Title Preview'}
                  </h5>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Just now • {targetType === 'all' ? 'All Members' : selectedUser?.name}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                  priority === 'urgent'
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                    : priority === 'high'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {priority}
              </span>
            </div>

            {/* Message Body */}
            <p className="text-xs text-zinc-300 leading-relaxed">
              {message ||
                'This is a real-time preview of how your customized notification message and action button will render on customer dashboards.'}
            </p>

            {/* Action CTA */}
            {actionLabel && (
              <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 font-mono">Target: #{actionUrl}</span>
                <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                  <span>{actionLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>

          {/* Quick preset templates */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">
              Quick Fill Announcement Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTitle('⚡ Supercharger Node Staking Surge +4.2% APY');
                  setMessage('Commercial grid utilization hit peak capacity. Active stakers will receive elevated yield distributions today.');
                  setType('investment');
                  setPriority('high');
                  setActionLabel('Check Staking Yield');
                  setActionUrl('investment');
                }}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left text-[11px] text-zinc-300 hover:text-white transition cursor-pointer"
              >
                + APY Staking Surge
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('💰 Daily Staking Dividends Credited to Vault');
                  setMessage('Your automated daily fleet revenue dividends have been credited to your available balance.');
                  setType('payout');
                  setPriority('normal');
                  setActionLabel('View Wallet');
                  setActionUrl('wallet');
                }}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left text-[11px] text-zinc-300 hover:text-white transition cursor-pointer"
              >
                + Daily Dividends Paid
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('🎁 VIP Scratch Cards: $8,000 Jackpot Active');
                  setMessage('New verified provably fair scratch cards loaded in the Promotions Hub. Claim your shot at $8,000 max prizes.');
                  setType('bonus');
                  setPriority('high');
                  setActionLabel('Play Scratch Cards');
                  setActionUrl('promotions');
                }}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left text-[11px] text-zinc-300 hover:text-white transition cursor-pointer"
              >
                + Scratch Promotion
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('🛡️ Zero Deposit Fees on All Crypto & Wire');
                  setMessage('All network deposit fees are waived this week. Fund your digital garage for service, wraps, and investments with zero overhead.');
                  setType('system');
                  setPriority('normal');
                  setActionLabel('Deposit Funds');
                  setActionUrl('deposit');
                }}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left text-[11px] text-zinc-300 hover:text-white transition cursor-pointer"
              >
                + Zero-Fee Deposit Notice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sent Notifications History Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-heading font-black text-lg text-white">
              Dispatched Notifications Ledger ({adminNotifications.length})
            </h4>
            <p className="text-xs text-zinc-400">
              Audit delivered messages, user readership ratios, and remove outdated notices from dashboards.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            {(['all', 'broadcast', 'individual'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setHistoryFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition cursor-pointer ${
                  historyFilter === f
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4">Notification Title & Copy</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Target Audience</th>
                  <th className="p-4">Date Dispatched</th>
                  <th className="p-4">Read Ratio</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                      No notifications match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((notif) => {
                    const readCount = notif.readBy?.length || 0;
                    const totalTarget = notif.targetType === 'all' ? allUsers.length : 1;
                    const readPct = Math.round((readCount / totalTarget) * 100);

                    return (
                      <tr key={notif.id} className="hover:bg-zinc-900/40 transition">
                        <td className="p-4 max-w-sm">
                          <span className="font-heading font-bold text-white block text-sm">
                            {notif.title}
                          </span>
                          <span className="text-zinc-400 line-clamp-1 text-[11px] mt-0.5">
                            {notif.message}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 uppercase">
                            {notif.type}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              notif.priority === 'urgent'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : notif.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {notif.priority}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-[11px]">
                          {notif.targetType === 'all' ? (
                            <span className="text-emerald-400 font-bold">Broadcast (All)</span>
                          ) : (
                            <span className="text-amber-400">
                              {notif.targetUserEmail || notif.targetUserId}
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-mono text-zinc-400 text-[11px]">
                          {notif.createdAt}
                        </td>

                        <td className="p-4 font-mono">
                          <span className="text-white font-bold">{readCount}/{totalTarget}</span>
                          <span className="text-[10px] text-zinc-500 ml-1">({readPct}%)</span>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                            title="Remove notification from user dashboards"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
