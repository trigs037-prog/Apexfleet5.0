import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CRYPTO_NETWORKS } from '../data/mockData';
import { CryptoCurrency, ManualDepositMethod } from '../types';
import {
  X,
  Copy,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Zap,
  RefreshCw,
  AlertCircle,
  Building,
  Upload,
  Wallet,
  Check,
  CreditCard,
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCurrency?: CryptoCurrency;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, defaultCurrency = 'USDT' }) => {
  const { depositFunds, showToast, manualDepositMethods } = useApp();
  const [depositMode, setDepositMode] = useState<'crypto' | 'manual'>('crypto');
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>(defaultCurrency);
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [confirmationStep, setConfirmationStep] = useState<number>(0);

  // Manual Deposit state
  const activeManualMethods = (manualDepositMethods || []).filter((m) => m.isActive);
  const [selectedManualId, setSelectedManualId] = useState<string>(
    activeManualMethods[0]?.id || 'dep-wire'
  );
  const [manualAmount, setManualAmount] = useState<string>('1000');
  const [manualProofMemo, setManualProofMemo] = useState<string>('');
  const [isSubmittingManual, setIsSubmittingManual] = useState<boolean>(false);
  const [manualProofAttached, setManualProofAttached] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentNetwork = CRYPTO_NETWORKS[selectedCurrency];
  const rateUsd = currentNetwork?.rateUsd || 1;
  const numAmount = parseFloat(depositAmount) || 0;
  const estimatedUsd = selectedCurrency === 'USDT' ? numAmount : numAmount * rateUsd;

  const currentManual = activeManualMethods.find((m) => m.id === selectedManualId) || activeManualMethods[0];
  const numManualAmount = parseFloat(manualAmount) || 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('Details copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSimulateDeposit = async () => {
    if (numAmount <= 0) {
      showToast('Please enter a valid deposit amount.', 'error');
      return;
    }
    if (numAmount < currentNetwork.minDeposit) {
      showToast(`Minimum deposit for ${selectedCurrency} is ${currentNetwork.minDeposit}.`, 'error');
      return;
    }

    setIsConfirming(true);
    setConfirmationStep(1);

    // Simulate blockchain validation nodes
    setTimeout(() => setConfirmationStep(2), 1200);
    setTimeout(async () => {
      setConfirmationStep(3);
      await depositFunds(selectedCurrency, numAmount);
      setIsConfirming(false);
      setConfirmationStep(0);
      onClose();
    }, 2400);
  };

  const handleConfirmManualDeposit = async () => {
    if (!currentManual) {
      showToast('No active deposit method selected.', 'error');
      return;
    }
    if (numManualAmount <= 0) {
      showToast('Please enter a valid deposit amount.', 'error');
      return;
    }
    if (numManualAmount < currentManual.minDepositUsd) {
      showToast(`Minimum deposit is $${currentManual.minDepositUsd.toLocaleString()} USD.`, 'error');
      return;
    }
    if (numManualAmount > currentManual.maxDepositUsd) {
      showToast(`Maximum deposit limit is $${currentManual.maxDepositUsd.toLocaleString()} USD.`, 'error');
      return;
    }
    if (currentManual.requiresProofUpload && !manualProofMemo && !manualProofAttached) {
      showToast('Please provide your payment reference memo or attach transfer confirmation.', 'error');
      return;
    }

    setIsSubmittingManual(true);
    setTimeout(async () => {
      await depositFunds('USD', numManualAmount);
      setIsSubmittingManual(false);
      showToast(
        `🎉 Manual deposit of $${numManualAmount.toLocaleString()} via ${currentManual.title} verified! Wallet credited.`,
        'success'
      );
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-red-500/30 rounded-3xl shadow-2xl shadow-red-950/40 overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Zap className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Deposit & Funding Gateway</h3>
              <p className="text-xs text-zinc-400">Direct wallet funding for services, custom wraps, rentals & fleet yield</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gateway Mode Tabs (Instant Crypto vs Manual Gateways) */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800/80 shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-black/50 p-1 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setDepositMode('crypto')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                depositMode === 'crypto'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Crypto Gateway</span>
            </button>

            <button
              onClick={() => setDepositMode('manual')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                depositMode === 'manual'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Manual & Alternative Methods</span>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.2 rounded-full font-mono text-zinc-300">
                {activeManualMethods.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* MODE 1: INSTANT CRYPTO GATEWAY */}
          {depositMode === 'crypto' && (
            <div className="space-y-6">
              {/* Currency Selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                  Select Blockchain Cryptocurrency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(CRYPTO_NETWORKS) as CryptoCurrency[]).map((curr) => {
                    const info = CRYPTO_NETWORKS[curr];
                    const active = selectedCurrency === curr;
                    return (
                      <button
                        key={curr}
                        onClick={() => {
                          setSelectedCurrency(curr);
                          if (curr === 'BTC') setDepositAmount('0.02');
                          else if (curr === 'XRP') setDepositAmount('250');
                          else if (curr === 'BNB') setDepositAmount('1.5');
                          else setDepositAmount('500');
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                          active
                            ? 'border-red-500 bg-red-950/40 text-white shadow-lg shadow-red-950/30'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <span className="font-heading font-bold text-base" style={{ color: info.iconColor }}>
                          {curr}
                        </span>
                        <span className="text-[10px] text-zinc-500">{info.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount input */}
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-mono">
                  <span>Deposit Amount ({selectedCurrency})</span>
                  <span>1 {selectedCurrency} ≈ ${rateUsd.toLocaleString()} USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-lg focus:outline-none focus:border-red-500"
                  />
                  <span className="font-heading font-semibold text-zinc-300 px-3 py-2 bg-zinc-800 rounded-lg shrink-0">
                    {selectedCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-zinc-500 font-mono">Min: {currentNetwork.minDeposit} {selectedCurrency}</span>
                  <span className="text-emerald-400 font-medium font-mono">
                    Est. Value: ≈ ${Math.round(estimatedUsd).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Address & QR Code */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 space-y-3">
                <div className="flex items-start gap-4">
                  {/* Visual simulated QR code */}
                  <div className="shrink-0 p-2 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
                    <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                      <rect x="5" y="5" width="26" height="26" fill="black" rx="2" />
                      <rect x="9" y="9" width="18" height="18" fill="white" rx="1" />
                      <rect x="13" y="13" width="10" height="10" fill="black" rx="1" />

                      <rect x="69" y="5" width="26" height="26" fill="black" rx="2" />
                      <rect x="73" y="9" width="18" height="18" fill="white" rx="1" />
                      <rect x="77" y="13" width="10" height="10" fill="black" rx="1" />

                      <rect x="5" y="69" width="26" height="26" fill="black" rx="2" />
                      <rect x="9" y="73" width="18" height="18" fill="white" rx="1" />
                      <rect x="13" y="77" width="10" height="10" fill="black" rx="1" />

                      <rect x="36" y="8" width="6" height="6" fill="black" />
                      <rect x="48" y="14" width="6" height="6" fill="black" />
                      <rect x="36" y="24" width="6" height="6" fill="black" />
                      <rect x="54" y="24" width="6" height="6" fill="black" />
                      <rect x="36" y="40" width="8" height="8" fill="#e82127" rx="1" />
                      <rect x="48" y="40" width="6" height="6" fill="black" />
                      <rect x="72" y="56" width="6" height="6" fill="black" />
                      <rect x="52" y="72" width="6" height="6" fill="black" />
                    </svg>
                    <span className="text-[9px] font-mono font-bold text-zinc-800 mt-1 uppercase tracking-wider">
                      {selectedCurrency} SCAN
                    </span>
                  </div>

                  {/* Address details */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-0.5">Network Protocol</span>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono">
                        {currentNetwork.network}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-0.5">Your Dedicated Deposit Address</span>
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 rounded-lg p-2">
                        <span className="font-mono text-xs text-red-300 break-all select-all flex-1">
                          {currentNetwork.address}
                        </span>
                        <button
                          onClick={() => handleCopy(currentNetwork.address)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition shrink-0 cursor-pointer"
                          title="Copy Address"
                        >
                          {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {currentNetwork.memoTag && (
                      <div className="p-2 rounded bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-semibold block">Required XRP Destination Tag:</span>
                          <span className="font-mono text-sm text-yellow-300">{currentNetwork.memoTag}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(currentNetwork.memoTag!)}
                          className="px-2 py-1 text-[11px] bg-amber-800/80 hover:bg-amber-700 rounded text-white cursor-pointer font-bold"
                        >
                          Copy Tag
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transfer Confirmation Button */}
              <div className="pt-2">
                <button
                  onClick={handleSimulateDeposit}
                  disabled={isConfirming}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 font-heading font-bold text-white shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
                >
                  {isConfirming ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>
                        Validating On-Chain Block ({confirmationStep}/3 Confirmations)...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Simulate Instant On-Chain Deposit ({numAmount} {selectedCurrency})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-zinc-500 mt-2 font-mono">
                  Simulate blockchain network confirmation and credit your vault.
                </p>
              </div>
            </div>
          )}

          {/* MODE 2: MANUAL & ALTERNATIVE DEPOSIT METHODS */}
          {depositMode === 'manual' && (
            <div className="space-y-6">
              {/* Method Selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                  Select Manual / Alternative Deposit Gateway
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeManualMethods.map((method) => {
                    const isSelected = method.id === (currentManual?.id || selectedManualId);
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedManualId(method.id)}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-lg shadow-emerald-950/40'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs truncate text-white">
                            {method.title}
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-zinc-800 text-zinc-300">
                            {method.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span>{method.currencySymbol}</span>
                          <span className="text-emerald-400">{method.processingTime}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Method Details Card */}
              {currentManual && (
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{currentManual.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{currentManual.instructions}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Fee: {currentManual.feePercent}%
                    </span>
                  </div>

                  {/* Account Details Box */}
                  <div className="p-3.5 rounded-xl bg-black/70 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>OFFICIAL ACCOUNT / CASHTAG / DETAILS</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentManual.accountDetails)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy All Details</span>
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap break-all bg-zinc-900/70 p-2.5 rounded-lg border border-zinc-800 selection:bg-emerald-600">
                      {currentManual.accountDetails}
                    </pre>
                  </div>

                  {/* Manual Amount Input */}
                  <div className="bg-black/40 p-3 rounded-xl border border-zinc-800 space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
                      <span>Deposit Amount (USD)</span>
                      <span>Min ${currentManual.minDepositUsd.toLocaleString()} - Max ${currentManual.maxDepositUsd.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-zinc-400 font-mono">$</span>
                      <input
                        type="number"
                        value={manualAmount}
                        onChange={(e) => setManualAmount(e.target.value)}
                        placeholder="Enter USD amount"
                        className="w-full bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Proof of Payment / Transaction Memo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300 block font-mono">
                      Transaction Reference Memo / Sender Tag / Wire Reference
                    </label>
                    <input
                      type="text"
                      value={manualProofMemo}
                      onChange={(e) => setManualProofMemo(e.target.value)}
                      placeholder="e.g. Wire Ref #889210 or CashApp username / note"
                      className="w-full bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />

                    {/* Screenshot / receipt simulation */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-dashed border-zinc-700 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>
                          {manualProofAttached ? 'receipt_transfer_proof.pdf (Attached)' : 'Attach transfer receipt screenshot / PDF'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setManualProofAttached(!manualProofAttached);
                          showToast(manualProofAttached ? 'Receipt removed' : 'Receipt attached for verification', 'info');
                        }}
                        className="text-xs text-emerald-400 hover:underline font-mono cursor-pointer"
                      >
                        {manualProofAttached ? 'Remove' : 'Simulate Attach'}
                      </button>
                    </div>
                  </div>

                  {/* Submit Manual Deposit */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmManualDeposit}
                      disabled={isSubmittingManual}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 font-heading font-bold text-white shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmittingManual ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Verifying Payment Proof & Crediting Vault...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Manual Deposit ($ {numManualAmount.toLocaleString()} USD)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-zinc-500 mt-2 font-mono">
                      Manual deposits are processed and confirmed directly into your balance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-emerald-500/20 text-xs text-zinc-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Institutional Vault Protection:</strong> 100% of user balances are backed in multi-sig institutional reserves. Zero platform fees.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
