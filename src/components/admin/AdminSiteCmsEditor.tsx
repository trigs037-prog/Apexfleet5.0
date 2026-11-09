import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SitePage,
  ManualDepositMethod,
  SocialLinkConfig,
  InvestmentPool,
  ProductItem,
} from '../../types';
import {
  Sliders,
  FileText,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Globe,
  Share2,
  Building,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  Eye,
  Layers,
  Save,
  MessageCircle,
  Shield,
  HelpCircle,
  Tag,
  DollarSign,
  Lock,
} from 'lucide-react';

export const AdminSiteCmsEditor: React.FC = () => {
  const {
    sitePages,
    createSitePage,
    updateSitePage,
    deleteSitePage,
    manualDepositMethods,
    addManualDepositMethod,
    updateManualDepositMethod,
    deleteManualDepositMethod,
    socialLinks,
    updateSocialLink,
    investmentPools,
    createInvestmentPool,
    updateInvestmentPool,
    deleteInvestmentPool,
    productsList,
    addProductItem,
    updateProductItem,
    deleteProductItem,
    showToast,
  } = useApp();

  const [activeCmsTab, setActiveCmsTab] = useState<
    'pages' | 'deposit_methods' | 'social_urls' | 'investment_plans' | 'products' | 'site_rules'
  >('pages');

  // --- Modal states ---
  // Pages
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    displayLocation: 'navbar' as 'navbar' | 'footer' | 'both' | 'hidden',
    order: 1,
    isSystem: false,
    published: true,
    metaDescription: '',
  });

  // Manual Deposit Method
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [editingDeposit, setEditingDeposit] = useState<ManualDepositMethod | null>(null);
  const [depositForm, setDepositForm] = useState({
    title: '',
    category: 'fiat' as 'fiat' | 'crypto' | 'e_wallet',
    currencySymbol: 'USD',
    network: '',
    accountDetails: '',
    instructions: '',
    minDepositUsd: 100,
    maxDepositUsd: 50000,
    processingTime: 'Instant (5-15 Mins)',
    feePercent: 0,
    isActive: true,
    requiresProofUpload: true,
  });

  // Social Links
  const [editingSocial, setEditingSocial] = useState<SocialLinkConfig | null>(null);
  const [socialForm, setSocialForm] = useState({
    label: '',
    url: '',
    handle: '',
    enabled: true,
    showInHeader: true,
    showInFooter: true,
  });

  // Investment Plans / Pools
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [editingPool, setEditingPool] = useState<InvestmentPool | null>(null);
  const [poolForm, setPoolForm] = useState({
    title: '',
    category: 'Autonomous Robotaxi Fleet' as InvestmentPool['category'],
    apy: 18.5,
    lockPeriodDays: 30,
    minInvestmentUsd: 500,
    totalStakedUsd: 1250000,
    poolCapUsd: 2500000,
    riskLevel: 'Balanced' as 'Conservative' | 'Balanced' | 'Aggressive Yield',
    dailyPayoutEstUsdPer1000: 0.51,
    description: '',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  });

  // Products
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Interior & Yoke' as ProductItem['category'],
    priceUsd: 250,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 24,
    compatibility: 'Model 3 / Model Y / Cybertruck',
    inStock: true,
    description: '',
  });

  // Global Site Rules
  const [siteSettings, setSiteSettings] = useState({
    heroHeadline: 'PREMIER TESLA SERVICE, BESPOKE WRAPS & FLEET YIELDS',
    heroSubtitle: 'Certified high-voltage diagnostics, clean-room 3M color wraps, autonomous fleet yield staking, and Gemini AI telematics.',
    spinCostUsd: 25,
    maxScratchPrizeUsd: 8000,
    hourlyBayRateUsd: 185,
    announcementBanner: '⚡ FLASH PROMO: 20% OFF ALL SATIN STEALTH WRAPS & CERAMIC PPF WHEN FUNDED VIA CRYPTO VAULT',
  });

  // --- Handlers: Pages ---
  const handleOpenCreatePage = () => {
    setEditingPage(null);
    setPageForm({
      title: '',
      slug: '',
      content: '',
      displayLocation: 'navbar',
      order: (sitePages?.length || 0) + 1,
      isSystem: false,
      published: true,
      metaDescription: '',
    });
    setShowPageModal(true);
  };

  const handleOpenEditPage = (page: SitePage) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      displayLocation: page.displayLocation,
      order: page.order,
      isSystem: page.isSystem,
      published: page.published,
      metaDescription: page.metaDescription || '',
    });
    setShowPageModal(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title.trim() || !pageForm.slug.trim()) {
      showToast('Page title and slug are required.', 'error');
      return;
    }

    if (editingPage) {
      updateSitePage(editingPage.id, pageForm);
    } else {
      createSitePage(pageForm);
    }
    setShowPageModal(false);
  };

  // --- Handlers: Manual Deposit Methods ---
  const handleOpenCreateDeposit = () => {
    setEditingDeposit(null);
    setDepositForm({
      title: '',
      category: 'fiat',
      currencySymbol: 'USD',
      network: '',
      accountDetails: '',
      instructions: '',
      minDepositUsd: 100,
      maxDepositUsd: 50000,
      processingTime: 'Instant (5-15 Mins)',
      feePercent: 0,
      isActive: true,
      requiresProofUpload: true,
    });
    setShowDepositModal(true);
  };

  const handleOpenEditDeposit = (m: ManualDepositMethod) => {
    setEditingDeposit(m);
    setDepositForm({
      title: m.title,
      category: m.category,
      currencySymbol: m.currencySymbol,
      network: m.network || '',
      accountDetails: m.accountDetails,
      instructions: m.instructions,
      minDepositUsd: m.minDepositUsd,
      maxDepositUsd: m.maxDepositUsd,
      processingTime: m.processingTime,
      feePercent: m.feePercent,
      isActive: m.isActive,
      requiresProofUpload: m.requiresProofUpload,
    });
    setShowDepositModal(true);
  };

  const handleSaveDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositForm.title.trim() || !depositForm.accountDetails.trim()) {
      showToast('Deposit method title and account details are required.', 'error');
      return;
    }

    if (editingDeposit) {
      updateManualDepositMethod(editingDeposit.id, depositForm);
    } else {
      addManualDepositMethod(depositForm);
    }
    setShowDepositModal(false);
  };

  // --- Handlers: Social Links ---
  const handleOpenEditSocial = (s: SocialLinkConfig) => {
    setEditingSocial(s);
    setSocialForm({
      label: s.label,
      url: s.url,
      handle: s.handle,
      enabled: s.enabled,
      showInHeader: s.showInHeader,
      showInFooter: s.showInFooter,
    });
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial) return;

    updateSocialLink(editingSocial.id, socialForm);
    setEditingSocial(null);
  };

  // --- Handlers: Investment Pools ---
  const handleOpenCreatePool = () => {
    setEditingPool(null);
    setPoolForm({
      title: '',
      category: 'Autonomous Robotaxi Fleet',
      apy: 18.5,
      lockPeriodDays: 30,
      minInvestmentUsd: 500,
      totalStakedUsd: 1000000,
      poolCapUsd: 2500000,
      riskLevel: 'Balanced',
      dailyPayoutEstUsdPer1000: 0.51,
      description: '',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    });
    setShowPoolModal(true);
  };

  const handleOpenEditPool = (pool: InvestmentPool) => {
    setEditingPool(pool);
    setPoolForm({
      title: pool.title,
      category: pool.category,
      apy: pool.apy,
      lockPeriodDays: pool.lockPeriodDays,
      minInvestmentUsd: pool.minInvestmentUsd,
      totalStakedUsd: pool.totalStakedUsd,
      poolCapUsd: pool.poolCapUsd,
      riskLevel: pool.riskLevel,
      dailyPayoutEstUsdPer1000: pool.dailyPayoutEstUsdPer1000,
      description: pool.description,
      image: pool.image,
    });
    setShowPoolModal(true);
  };

  const handleSavePool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poolForm.title.trim()) {
      showToast('Pool title is required.', 'error');
      return;
    }

    if (editingPool) {
      updateInvestmentPool(editingPool.id, poolForm as any);
    } else {
      createInvestmentPool(poolForm as any);
    }
    setShowPoolModal(false);
  };

  // --- Handlers: Products ---
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Interior & Yoke',
      priceUsd: 250,
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: 18,
      compatibility: 'All Tesla Models',
      inStock: true,
      description: '',
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      priceUsd: p.priceUsd,
      image: p.image,
      rating: p.rating,
      reviewsCount: p.reviewsCount || 10,
      compatibility: p.compatibility || 'All Tesla Models',
      inStock: p.inStock ?? true,
      description: p.description,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    if (editingProduct) {
      updateProductItem(editingProduct.id, productForm);
    } else {
      addProductItem(productForm);
    }
    setShowProductModal(false);
  };

  const handleSaveGlobalRules = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Global site headlines, pricing rules, and limits saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-black text-xl text-white">
              Global Site CMS & Configuration Center
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Create, edit, and delete site pages, custom manual deposit gateways, WhatsApp URLs, investment plans, products, and global rules.
          </p>
        </div>
      </div>

      {/* CMS Subtab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800">
        {[
          { id: 'pages' as const, label: 'Pages & Menus', icon: FileText, badge: `${sitePages?.length || 0}` },
          { id: 'deposit_methods' as const, label: 'Manual Deposit Gateways', icon: Building, badge: `${manualDepositMethods?.length || 0}` },
          { id: 'social_urls' as const, label: 'WhatsApp & Social Connects', icon: MessageCircle, badge: 'WhatsApp VIP' },
          { id: 'investment_plans' as const, label: 'Investment Plans & Pools', icon: TrendingUp, badge: `${investmentPools?.length || 0}` },
          { id: 'products' as const, label: 'Product Catalog', icon: ShoppingBag, badge: `${productsList?.length || 0}` },
          { id: 'site_rules' as const, label: 'Global Headlines & Rates', icon: Sliders },
        ].map((tab) => {
          const active = activeCmsTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCmsTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                active
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  active ? 'bg-black text-amber-300' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: PAGES & NAVIGATION MENUS */}
      {activeCmsTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-heading font-black text-base text-white">
                Website Pages & Navigation Menu Structure
              </h4>
              <p className="text-xs text-zinc-400">
                Create new landing pages, manage order, set display location (Navbar, Footer, Both, or Hidden), and edit content.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreatePage}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Page</span>
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Page Title & Slug</th>
                    <th className="p-4">Display Location</th>
                    <th className="p-4">Order</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Published</th>
                    <th className="p-4">Updated</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {sitePages.map((page) => (
                    <tr key={page.id} className="hover:bg-zinc-900/40 transition">
                      <td className="p-4">
                        <span className="font-heading font-bold text-white block text-sm">
                          {page.title}
                        </span>
                        <span className="text-emerald-400 font-mono text-[11px]">/{page.slug}</span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase bg-zinc-800 text-zinc-300">
                          {page.displayLocation}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-white">
                        #{page.order}
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          page.isSystem
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {page.isSystem ? 'CORE SYSTEM' : 'CUSTOM PAGE'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold ${
                          page.published ? 'text-emerald-400' : 'text-zinc-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${page.published ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                          {page.published ? 'LIVE' : 'DRAFT'}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-zinc-400 text-[11px]">
                        {page.updatedAt}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPage(page)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                            title="Edit Page"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {!page.isSystem && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete page "${page.title}"?`)) {
                                  deleteSitePage(page.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MANUAL DEPOSIT GATEWAYS & METHODS */}
      {activeCmsTab === 'deposit_methods' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-heading font-black text-base text-white">
                Deposit Methods & Custom Manual Payment Gateways
              </h4>
              <p className="text-xs text-zinc-400">
                Configure payment gateways: Bank Wire (SWIFT / SEPA), CashApp, Zelle, Custom Crypto cold vaults, or create custom manual gateways with payment instructions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateDeposit}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Manual Deposit Method</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manualDepositMethods.map((method) => (
              <div
                key={method.id}
                className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-heading font-bold text-base text-white block">
                        {method.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 font-bold">
                          {method.category} • {method.currencySymbol}
                        </span>
                        {method.network && (
                          <span className="text-[10px] font-mono text-zinc-400">
                            Net: {method.network}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateManualDepositMethod(method.id, { isActive: !method.isActive })}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition cursor-pointer ${
                        method.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {method.isActive ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {method.instructions}
                  </p>

                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-1">
                      Account / Payment Details:
                    </span>
                    <pre className="whitespace-pre-wrap break-all text-zinc-300 text-[11px]">
                      {method.accountDetails}
                    </pre>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                    <div>
                      <span className="text-zinc-500 block">LIMITS</span>
                      <span className="text-white font-bold">
                        ${method.minDepositUsd} - ${method.maxDepositUsd.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">TIME</span>
                      <span className="text-emerald-400 font-bold">{method.processingTime}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">FEE</span>
                      <span className="text-yellow-400 font-bold">{method.feePercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Proof Required: {method.requiresProofUpload ? 'Yes' : 'No'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditDeposit(method)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete deposit method "${method.title}"?`)) {
                          deleteManualDepositMethod(method.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: WHATSAPP & SOCIAL CONNECTS */}
      {activeCmsTab === 'social_urls' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-heading font-black text-base text-white">
              Official WhatsApp VIP & Social Media Channels
            </h4>
            <p className="text-xs text-zinc-400">
              Edit the official WhatsApp direct concierge link, phone number, pre-filled chat messages, and all connected social URLs across the entire platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((social) => {
              const isWhatsApp = social.platform === 'whatsapp';
              return (
                <div
                  key={social.id}
                  className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 ${
                    isWhatsApp
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-emerald-950/30'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm text-white flex items-center gap-2">
                        {isWhatsApp ? (
                          <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Share2 className="w-4 h-4 text-zinc-400" />
                        )}
                        <span>{social.label}</span>
                      </span>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          social.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {social.enabled ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">HANDLE / DISPLAY:</span>
                        <span className="text-zinc-200 font-mono font-semibold truncate block">
                          {social.handle}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">TARGET URL:</span>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline font-mono text-[11px] truncate block"
                        >
                          {social.url}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-zinc-400">
                      <span className={`px-2 py-0.5 rounded ${social.showInHeader ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>
                        Header: {social.showInHeader ? 'Yes' : 'No'}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${social.showInFooter ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>
                        Footer: {social.showInFooter ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Link</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenEditSocial(social)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Channel</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: INVESTMENT PLANS & POOLS */}
      {activeCmsTab === 'investment_plans' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-heading font-black text-base text-white">
                Vehicle Staking Pools & Investment Plans Catalog
              </h4>
              <p className="text-xs text-zinc-400">
                Create and manage commercial fleet staking pools, adjust APY yields, lock periods, and minimum investment limits.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreatePool}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Investment Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investmentPools.map((pool) => (
              <div
                key={pool.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video">
                    <img src={pool.image} alt={pool.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-emerald-600 font-mono font-bold text-xs text-white shadow-md">
                      {pool.apy}% APY
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {pool.category}
                    </span>
                    <h5 className="font-heading font-bold text-base text-white">{pool.title}</h5>
                    <p className="text-xs text-zinc-400 line-clamp-2">{pool.description}</p>

                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">LOCK</span>
                        <span className="font-bold text-white">{pool.lockPeriodDays} Days</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">MIN STAKE</span>
                        <span className="font-bold text-emerald-400">${pool.minInvestmentUsd}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">{pool.riskLevel}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPool(pool)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete investment pool "${pool.title}"?`)) {
                          deleteInvestmentPool(pool.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: PRODUCT CATALOG */}
      {activeCmsTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-heading font-black text-base text-white">
                Hardware & Store Products Catalog
              </h4>
              <p className="text-xs text-zinc-400">
                Add, edit, or delete items in the Tesla accessories shop, yoke steering wheels, spoilers, and chargers.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateProduct}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {productsList.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between space-y-3 shadow-xl"
              >
                <div className="space-y-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-36 object-cover rounded-2xl border border-zinc-800"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{product.category}</span>
                    <h5 className="font-heading font-bold text-sm text-white truncate">{product.name}</h5>
                    <span className="font-mono font-black text-base text-emerald-400">
                      ${product.priceUsd} USD
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    product.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProduct(product)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete product "${product.name}"?`)) {
                          deleteProductItem(product.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: GLOBAL HEADLINES & RULES */}
      {activeCmsTab === 'site_rules' && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
          <div className="border-b border-zinc-800 pb-3">
            <h4 className="font-heading font-black text-base text-white">
              Global Site Headlines, Promotion Costs & Labor Rates
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Configure homepage banners, live ticker texts, promotional gaming caps, and workshop rates.
            </p>
          </div>

          <form onSubmit={handleSaveGlobalRules} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 block font-mono font-medium">Hero Main Headline</label>
              <input
                type="text"
                value={siteSettings.heroHeadline}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 block font-mono font-medium">Hero Subtitle</label>
              <textarea
                rows={2}
                value={siteSettings.heroSubtitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Wheel Spin Cost (USD)</label>
                <input
                  type="number"
                  value={siteSettings.spinCostUsd}
                  onChange={(e) => setSiteSettings({ ...siteSettings, spinCostUsd: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Scratch Card Max Prize ($)</label>
                <input
                  type="number"
                  value={siteSettings.maxScratchPrizeUsd}
                  onChange={(e) => setSiteSettings({ ...siteSettings, maxScratchPrizeUsd: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Hourly Bay Labor Rate ($)</label>
                <input
                  type="number"
                  value={siteSettings.hourlyBayRateUsd}
                  onChange={(e) => setSiteSettings({ ...siteSettings, hourlyBayRateUsd: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 block font-mono font-medium">Flash Announcement Bar Text</label>
              <input
                type="text"
                value={siteSettings.announcementBanner}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementBanner: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Global Site Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL: CREATE / EDIT PAGE --- */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-700 rounded-3xl p-6 text-zinc-100 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-heading font-black text-lg text-white">
                {editingPage ? `Edit Page: ${editingPage.title}` : 'Create New Site Page'}
              </h4>
              <button
                type="button"
                onClick={() => setShowPageModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Page Title</label>
                <input
                  type="text"
                  value={pageForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = pageForm.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setPageForm({ ...pageForm, title, slug: editingPage ? pageForm.slug : slug });
                  }}
                  placeholder="e.g. Battery & Supercharger Warranty Policy"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">URL Slug (e.g. warranty)</label>
                  <input
                    type="text"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Menu Location</label>
                  <select
                    value={pageForm.displayLocation}
                    onChange={(e) => setPageForm({ ...pageForm, displayLocation: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="navbar">Navbar Only</option>
                    <option value="footer">Footer Only</option>
                    <option value="both">Both Navbar & Footer</option>
                    <option value="hidden">Hidden Route</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Page Content</label>
                <textarea
                  rows={6}
                  value={pageForm.content}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  placeholder="Enter full page copy, terms, policy guidelines, or service descriptions..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white leading-relaxed font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Display Order</label>
                  <input
                    type="number"
                    value={pageForm.order}
                    onChange={(e) => setPageForm({ ...pageForm, order: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <input
                      type="checkbox"
                      checked={pageForm.published}
                      onChange={(e) => setPageForm({ ...pageForm, published: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <span className="font-mono text-xs text-white">Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowPageModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20"
                >
                  {editingPage ? 'Save Changes' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE / EDIT MANUAL DEPOSIT METHOD --- */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-emerald-500/30 rounded-3xl p-6 text-zinc-100 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-heading font-black text-lg text-white">
                {editingDeposit ? `Edit Deposit Method: ${editingDeposit.title}` : 'Create Custom Manual Deposit Method'}
              </h4>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeposit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Gateway Title</label>
                <input
                  type="text"
                  value={depositForm.title}
                  onChange={(e) => setDepositForm({ ...depositForm, title: e.target.value })}
                  placeholder="e.g. Revolut Instant Pay or Wire (SWIFT / Fedwire)"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Category</label>
                  <select
                    value={depositForm.category}
                    onChange={(e) => setDepositForm({ ...depositForm, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="fiat">fiat (Bank/Card)</option>
                    <option value="e_wallet">e_wallet (App)</option>
                    <option value="crypto">crypto (Custom)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Currency</label>
                  <input
                    type="text"
                    value={depositForm.currencySymbol}
                    onChange={(e) => setDepositForm({ ...depositForm, currencySymbol: e.target.value })}
                    placeholder="USD"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Network (Opt)</label>
                  <input
                    type="text"
                    value={depositForm.network}
                    onChange={(e) => setDepositForm({ ...depositForm, network: e.target.value })}
                    placeholder="e.g. TRC-20"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">
                  Beneficiary / Account Details / Cashtag / Address
                </label>
                <textarea
                  rows={4}
                  value={depositForm.accountDetails}
                  onChange={(e) => setDepositForm({ ...depositForm, accountDetails: e.target.value })}
                  placeholder="Bank: Chase N.A.&#10;Routing: 021000021&#10;Account: 8892109482&#10;SWIFT: CHASUS33&#10;Memo: [User Email]"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Instructions for Customer</label>
                <textarea
                  rows={2}
                  value={depositForm.instructions}
                  onChange={(e) => setDepositForm({ ...depositForm, instructions: e.target.value })}
                  placeholder="Initiate transfer from your banking app. Include your registered email address in the transfer note."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Min Deposit ($)</label>
                  <input
                    type="number"
                    value={depositForm.minDepositUsd}
                    onChange={(e) => setDepositForm({ ...depositForm, minDepositUsd: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Max Deposit ($)</label>
                  <input
                    type="number"
                    value={depositForm.maxDepositUsd}
                    onChange={(e) => setDepositForm({ ...depositForm, maxDepositUsd: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Processing Time</label>
                  <input
                    type="text"
                    value={depositForm.processingTime}
                    onChange={(e) => setDepositForm({ ...depositForm, processingTime: e.target.value })}
                    placeholder="Instant (5-15 Mins)"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <input
                      type="checkbox"
                      checked={depositForm.requiresProofUpload}
                      onChange={(e) => setDepositForm({ ...depositForm, requiresProofUpload: e.target.checked })}
                      className="rounded text-emerald-500"
                    />
                    <span className="font-mono text-xs text-white">Require Proof Upload</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40"
                >
                  {editingDeposit ? 'Save Method Changes' : 'Create Deposit Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT SOCIAL LINK (WHATSAPP & CHANNELS) --- */}
      {editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border border-emerald-500/30 rounded-3xl p-6 text-zinc-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-heading font-black text-lg text-white">
                Edit Channel: {editingSocial.label}
              </h4>
              <button
                type="button"
                onClick={() => setEditingSocial(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Channel Name</label>
                <input
                  type="text"
                  value={socialForm.label}
                  onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">
                  {editingSocial.platform === 'whatsapp' ? 'WhatsApp Direct Chat URL / Number' : 'Target URL'}
                </label>
                <input
                  type="text"
                  value={socialForm.url}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://wa.me/..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Display Handle</label>
                <input
                  type="text"
                  value={socialForm.handle}
                  onChange={(e) => setSocialForm({ ...socialForm, handle: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={socialForm.enabled}
                    onChange={(e) => setSocialForm({ ...socialForm, enabled: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span className="font-mono text-zinc-300">Channel Active on Platform</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={socialForm.showInHeader}
                    onChange={(e) => setSocialForm({ ...socialForm, showInHeader: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span className="font-mono text-zinc-300">Display in Top Navbar</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={socialForm.showInFooter}
                    onChange={(e) => setSocialForm({ ...socialForm, showInFooter: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span className="font-mono text-zinc-300">Display in Website Footer</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSocial(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40"
                >
                  Save Channel Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE / EDIT POOL --- */}
      {showPoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-700 rounded-3xl p-6 text-zinc-100 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-heading font-black text-lg text-white">
                {editingPool ? `Edit Pool: ${editingPool.title}` : 'Create Staking Pool Plan'}
              </h4>
              <button
                type="button"
                onClick={() => setShowPoolModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePool} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Pool Title</label>
                <input
                  type="text"
                  value={poolForm.title}
                  onChange={(e) => setPoolForm({ ...poolForm, title: e.target.value })}
                  placeholder="e.g. Robotaxi Fleet Miami Staking Node"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Category</label>
                  <input
                    type="text"
                    value={poolForm.category}
                    onChange={(e) => setPoolForm({ ...poolForm, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">APY Yield (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={poolForm.apy}
                    onChange={(e) => setPoolForm({ ...poolForm, apy: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Lock Period (Days)</label>
                  <input
                    type="number"
                    value={poolForm.lockPeriodDays}
                    onChange={(e) => setPoolForm({ ...poolForm, lockPeriodDays: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Min Stake ($)</label>
                  <input
                    type="number"
                    value={poolForm.minInvestmentUsd}
                    onChange={(e) => setPoolForm({ ...poolForm, minInvestmentUsd: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Image URL</label>
                <input
                  type="text"
                  value={poolForm.image}
                  onChange={(e) => setPoolForm({ ...poolForm, image: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Description</label>
                <textarea
                  rows={3}
                  value={poolForm.description}
                  onChange={(e) => setPoolForm({ ...poolForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowPoolModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20"
                >
                  {editingPool ? 'Save Pool' : 'Create Pool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE / EDIT PRODUCT --- */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-3xl p-6 text-zinc-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-heading font-black text-lg text-white">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Hardware Product'}
              </h4>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Yoke Steering Wheel Alcantara"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Price (USD)</label>
                  <input
                    type="number"
                    value={productForm.priceUsd}
                    onChange={(e) => setProductForm({ ...productForm, priceUsd: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono font-medium">Availability</label>
                  <select
                    value={productForm.inStock ? 'true' : 'false'}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value === 'true' })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono font-medium">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20"
                >
                  {editingProduct ? 'Save Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
