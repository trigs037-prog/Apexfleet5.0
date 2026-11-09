/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LiveWinningTicker } from './components/LiveWinningTicker';
import { Hero } from './components/Hero';
import { ServiceScheduler } from './components/ServiceScheduler';
import { CustomStudio } from './components/CustomStudio';
import { RentalFleet } from './components/RentalFleet';
import { InvestmentHub } from './components/InvestmentHub';
import { PromotionsHub } from './components/PromotionsHub';
import { ProductShop } from './components/ProductShop';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { DepositModal } from './components/DepositModal';
import { AuthModal } from './components/AuthModal';
import { CartModal } from './components/CartModal';
import { ReferralHub } from './components/ReferralHub';
import { SocialConnect } from './components/SocialConnect';
import { UserInvestmentBoard } from './components/UserInvestmentBoard';
import { NotificationInbox } from './components/NotificationInbox';
import { CheckCircle2, AlertCircle, Info, ArrowLeft, Globe, ChevronRight } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { userRole, toastMessage, sitePages } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [chatbotPrompt, setChatbotPrompt] = useState<string | null>(null);

  const handleOpenAiDiagnostics = (query?: string) => {
    setChatbotPrompt(query || 'Please run a telemetry diagnostics scan on my Tesla high-voltage battery and drive unit.');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Proof-of-fair Live Winning Ticker Bar */}
      <LiveWinningTicker />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDeposit={() => setIsDepositModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCart={() => setIsCartModalOpen(true)}
      />

      {/* Tab routing container */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <Hero
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDeposit={() => setIsDepositModalOpen(true)}
            />

            {/* Custom Studio Wrap Preview Section on Home */}
            <CustomStudio
              onNavigateToServices={() => {
                setActiveTab('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDeposit={() => setIsDepositModalOpen(true)}
            />

            {/* Promotions Hub: Spin Wheel & Scratch Cards */}
            <PromotionsHub onOpenDeposit={() => setIsDepositModalOpen(true)} />

            {/* Tesla Rental Fleet */}
            <RentalFleet
              onOpenDeposit={() => setIsDepositModalOpen(true)}
              onNavigateToDashboard={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Products Listing on Home */}
            <ProductShop
              onOpenCart={() => setIsCartModalOpen(true)}
              onOpenDeposit={() => setIsDepositModalOpen(true)}
            />

            {/* Vehicle & Supercharger Investment Hub */}
            <InvestmentHub
              onOpenDeposit={() => setIsDepositModalOpen(true)}
              onNavigateToDashboard={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Information Sections */}
            <AboutSection />
            <FaqSection />
            <ContactSection />
          </div>
        )}

        {activeTab === 'services' && (
          <ServiceScheduler
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            onOpenAiDiagnostics={handleOpenAiDiagnostics}
            onNavigateToDashboard={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'wraps' && (
          <CustomStudio
            onNavigateToServices={() => setActiveTab('services')}
            onOpenDeposit={() => setIsDepositModalOpen(true)}
          />
        )}

        {activeTab === 'rentals' && (
          <RentalFleet
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'investment' && (
          <InvestmentHub
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'promotions' && (
          <PromotionsHub onOpenDeposit={() => setIsDepositModalOpen(true)} />
        )}

        {activeTab === 'referrals' && (
          <ReferralHub
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'shop' && (
          <ProductShop
            onOpenCart={() => setIsCartModalOpen(true)}
            onOpenDeposit={() => setIsDepositModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          userRole === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Dashboard
              onOpenDeposit={() => setIsDepositModalOpen(true)}
              onNavigateToServices={() => setActiveTab('services')}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )
        )}

        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'social' && <SocialConnect />}

        {/* User Investment Board direct route */}
        {activeTab === 'user_investments' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <button
                  onClick={() => {
                    setActiveTab('investment');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2 font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Staking Pools
                </button>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                  My Fleet Investments & ROI Portfolio
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Track running & completed investments, automated daily returns, capital settlements, and WhatsApp audit certificates.
                </p>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
              >
                Deposit & Stake More
              </button>
            </div>
            <UserInvestmentBoard onOpenDeposit={() => setIsDepositModalOpen(true)} />
          </div>
        )}

        {/* User Notifications Inbox direct route */}
        {activeTab === 'notifications' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2 font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                </button>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                  Notification Center & Operational Alerts
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Direct administrative bulletins, yield distribution notices, and critical account messages.
                </p>
              </div>
            </div>
            <NotificationInbox
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDeposit={() => setIsDepositModalOpen(true)}
            />
          </div>
        )}

        {/* Dynamic CMS Custom Page Viewer */}
        {(() => {
          const customPage = sitePages.find((p) => p.slug === activeTab);
          if (!customPage) return null;
          return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer"
                >
                  Home
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>Pages</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-white font-bold">{customPage.title}</span>
              </div>

              {/* Header Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-mono font-bold uppercase">
                    {customPage.category || 'Official Apex Information'}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    Last Revised: {customPage.updatedAt}
                  </span>
                </div>
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
                  {customPage.title}
                </h1>
                {customPage.subtitle && (
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                    {customPage.subtitle}
                  </p>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-10 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl text-zinc-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {customPage.content}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Homepage
                </button>
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Open Crypto Vault
                </button>
              </div>
            </div>
          );
        })()}

        {activeTab === 'about' && <AboutSection />}
        {activeTab === 'faq' && <FaqSection />}
        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDeposit={() => setIsDepositModalOpen(true)}
      />

      {/* Floating Gemini AI Chatbot Concierge */}
      <GeminiChatbot
        initialPrompt={chatbotPrompt}
        onClearInitialPrompt={() => setChatbotPrompt(null)}
      />

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onOpenDeposit={() => setIsDepositModalOpen(true)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-sm p-4 rounded-2xl bg-zinc-950/95 border border-red-500/40 shadow-2xl backdrop-blur-md text-xs text-white flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
          <p className="leading-snug">{toastMessage.text}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
