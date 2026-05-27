// =============================================
// HOW TO ADD/EDIT ITEMS:
// 1. Open public/items.json in your file tree
// 2. Copy an existing item object
// 3. Change id, name, category, description, price, image, inStock, featured
// 4. For image: upload your PNG to imgur.com / any image host and paste the direct HTTPS link
// 5. Save the file — changes appear immediately in the app!
//
// HOW TO CHANGE WHATSAPP NUMBER & SHOP NAME:
// Change the "whatsappNumber" and "shopName" values in public/items.json
// Format for WA: country code + number, NO leading + sign (e.g., "6281234567890")
// =============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ShoppingBag, 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  Zap, 
  ChevronUp, 
  Menu, 
  Grid, 
  Check, 
  Clock, 
  Package, 
  Filter,
  Layers,
  ThumbsUp,
  Award,
  Gamepad,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Item, ShopData } from './types';

const FALLBACK_SHOP_DATA: ShopData = {
  shopName: "Reya Shop",
  whatsappNumber: "6281234567890",
  currency: "Rp",
  items: [
    {
      id: 1,
      name: "Angel Wings Role",
      category: "Role",
      description: "Role sayap malaikat legendary. Boost stat dan tampilan karakter menjadi epic.",
      price: 350000,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: false
    },
    {
      id: 2,
      name: "World Champion Title",
      category: "Title",
      description: "Title eksklusif World Champion. Tampil keren di depan nama GrowID kamu.",
      price: 150000,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: "Dragon Custom Skin",
      category: "Custom Item",
      description: "Custom item skin naga legendaris. Desain eksklusif, tidak dijual di tempat lain.",
      price: 500000,
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: true
    },
    {
      id: 4,
      name: "Magplant 5000",
      category: "Magplant",
      description: "Magplant 5000 siap pakai. Percepat farming kamu dengan magnet plant terbaik.",
      price: 750000,
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=60",
      inStock: false,
      featured: false
    },
    {
      id: 5,
      name: "Stock Magplant Bundle",
      category: "Stock Magplant",
      description: "Bundle stock magplant 10 buah. Hemat 20% dibanding beli satuan.",
      price: 6000000,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: "Farm Paket Starter",
      category: "Farm Paket",
      description: "Paket farming lengkap untuk pemula. Sudah include semua benih dan tool farm.",
      price: 200000,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: false
    },
    {
      id: 7,
      name: "Farm Paket Pro",
      category: "Farm Paket",
      description: "Paket farming profesional untuk yield maksimal. Include rare seeds dan tools premium.",
      price: 850000,
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: true
    },
    {
      id: 8,
      name: "Phoenix Exclusive Set",
      category: "Exclusive Item",
      description: "Set eksklusif Phoenix yang super langka. Limited edition, stok sangat terbatas.",
      price: 2500000,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60",
      inStock: true,
      featured: true
    }
  ]
};

const CATEGORIES = [
  "Semua",
  "Role",
  "Title",
  "Custom Item",
  "Magplant",
  "Stock Magplant",
  "Farm Paket",
  "Exclusive Item"
];

export default function App() {
  const [shopData, setShopData] = useState<ShopData>(FALLBACK_SHOP_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Element ref for smooth scroll CTA
  const itemsSectionRef = useRef<HTMLDivElement>(null);

  // Load shop data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('./items.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.items) {
          setShopData(data);
        } else {
          throw new Error("Invalid structure inside items.json");
        }
      } catch (e: any) {
        console.warn("Failed to load custom items.json, using highly polished default store items.", e.message);
        // We gracefully fall back to default items to keep app robust
        setShopData(FALLBACK_SHOP_DATA);
      } finally {
        // Aesthetic slight delays to enjoy loader transition nicely
        const timer = setTimeout(() => {
          setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
      }
    };
    fetchData();
  }, []);

  // Monitor Scroll for Back-to-Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter logic
  const filteredItems = shopData.items.filter(item => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured items list
  const featuredItems = shopData.items.filter(item => item.featured);

  // Formatter for Indonesian currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Trigger WhatsApp purchase
  const handleBuyWhatsApp = (item: Item) => {
    const currencyLabel = shopData.currency || 'Rp';
    const message = `Halo admin! Saya ingin membeli:\n\n🎮 Item: ${item.name}\n💰 Harga: ${currencyLabel} ${formatPrice(item.price)}\n📦 Kategori: ${item.category}\n\nMohon konfirmasi ketersediaan dan cara pembayaran. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${shopData.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  // Scroll to main grid helper
  const handleScrollToItems = () => {
    itemsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  // Category visual helper
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'role': 
        return { 
          badge: 'bg-purple-500/90 text-white shadow-purple-500/25 shadow-sm', 
          cardBorder: 'hover:border-purple-500/40 hover:shadow-purple-500/10' 
        };
      case 'title': 
        return { 
          badge: 'bg-amber-500/90 text-slate-950 font-bold shadow-amber-500/25 shadow-sm', 
          cardBorder: 'hover:border-amber-500/40 hover:shadow-amber-500/10' 
        };
      case 'custom item': 
        return { 
          badge: 'bg-pink-500/90 text-white shadow-pink-500/25 shadow-sm', 
          cardBorder: 'hover:border-pink-500/40 hover:shadow-pink-500/10' 
        };
      case 'magplant': 
        return { 
          badge: 'bg-emerald-500/90 text-white shadow-emerald-500/25 shadow-sm', 
          cardBorder: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10' 
        };
      case 'stock magplant': 
        return { 
          badge: 'bg-cyan-500/90 text-white shadow-cyan-500/25 shadow-sm', 
          cardBorder: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10' 
        };
      case 'farm paket': 
        return { 
          badge: 'bg-orange-500/90 text-white shadow-orange-500/25 shadow-sm', 
          cardBorder: 'hover:border-orange-500/40 hover:shadow-orange-500/10' 
        };
      case 'exclusive item': 
        return { 
          badge: 'bg-rose-600 text-white font-semibold shadow-rose-600/30 shadow-[0_0_8px_rgba(225,29,72,0.4)]', 
          cardBorder: 'hover:border-rose-500/40 hover:shadow-rose-500/10 hover:shadow-lg' 
        };
      default: 
        return { 
          badge: 'bg-blue-500/90 text-white shadow-blue-500/25 shadow-sm', 
          cardBorder: 'hover:border-blue-500/40 hover:shadow-blue-500/10' 
        };
    }
  };

  // Image load error fallback initials
  const getItemInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 3)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-nunito grid-bg relative overflow-x-hidden select-none">
      
      {/* Background radial overlays for cosmic atmosphere */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[800px] right-10 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* FIXED NAV BAR WITH GLASSMORPHISM */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-sky-400/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Shop Name */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-sky-400/30 flex items-center justify-center p-1.5 overflow-hidden shadow-[0_0_12px_rgba(0,170,255,0.2)]">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    // Fallback to beautiful CSS game controller if logo.png fails or isn't placed yet
                    e.currentTarget.style.display = 'none';
                    const fallbackEl = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                    if (fallbackEl) fallbackEl.classList.remove('hidden');
                  }}
                />
                <span className="logo-fallback hidden font-rajdhani text-lg font-bold text-sky-400">GT</span>
              </div>
              <span className="font-rajdhani text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 uppercase">
                {shopData.shopName}
              </span>
            </div>

            {/* Desktop Navigation Link Toggles */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#hero" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-slate-300 hover:text-sky-400 font-rajdhani font-semibold tracking-wide transition-colors duration-200"
              >
                Home
              </a>
              <a 
                href="#items" 
                onClick={(e) => { e.preventDefault(); handleScrollToItems(); }} 
                className="text-slate-300 hover:text-sky-400 font-rajdhani font-semibold tracking-wide transition-colors duration-200"
              >
                Store Items
              </a>
              <button 
                onClick={handleScrollToItems}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-sky-600 to-blue-700 text-white font-rajdhani font-bold tracking-wider hover:from-sky-500 hover:to-blue-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,170,255,0.25)] hover:shadow-[0_0_20px_rgba(0,170,255,0.4)] flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>BELI SEKARANG</span>
              </button>
            </div>

            {/* Mobile hamburger menu trigger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-400 hover:text-sky-400 focus:outline-none p-2 rounded-md border border-sky-400/15"
                aria-label="Toggle Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0d1526]/95 border-b border-sky-400/10 overflow-hidden"
            >
              <div className="px-4 pt-3 pb-5 space-y-3">
                <a 
                  href="#hero" 
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-sky-400 hover:bg-slate-900/60 font-rajdhani"
                >
                  Home
                </a>
                <a 
                  href="#items" 
                  onClick={(e) => { e.preventDefault(); handleScrollToItems(); }} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-sky-400 hover:bg-slate-900/60 font-rajdhani"
                >
                  Store Items
                </a>
                <button 
                  onClick={handleScrollToItems}
                  className="w-full text-center px-4 py-3 rounded-md bg-gradient-to-r from-sky-600 to-blue-700 text-white font-rajdhani font-bold tracking-wider uppercase shadow-md flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>BELI SEKARANG</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0d162d]/40 via-[#0a0f1e] to-[#0a0f1e]">
        
        {/* Animated Gradient Hero Backdrop Cover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f1e] via-[#0d1a3a]/45 to-[#001a4d]/40 opacity-80 animate-gradient-diagonal pointer-events-none"></div>

        {/* Floating Game Pixel Decorative Icons */}
        <div className="absolute top-1/4 left-[8%] w-10 h-10 bg-gradient-to-tr from-sky-500 to-sky-300 rounded-lg opacity-20 blur-[1px] transform rotate-12 animate-float-slow pointer-events-none hidden lg:block"></div>
        <div className="absolute top-1/3 right-[12%] w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-md opacity-25 blur-[2px] transform -rotate-45 animate-float-fast pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-1/5 left-[15%] w-12 h-12 bg-gradient-to-tr from-cyan-400 to-teal-500 rounded-lg opacity-15 blur-[1px] transform rotate-45 animate-float-fast pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-[8%] w-8 h-8 bg-gradient-to-tl from-purple-500 to-pink-500 rounded-md opacity-20 blur-[1px] transform rotate-6 animate-float-slow pointer-events-none hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            
            {/* Trust Banner Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs sm:text-sm font-rajdhani font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,170,255,0.08)]"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>GARANSI 100% AMAN & SANGAT CEPAT</span>
            </motion.div>

            {/* Headline Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-rajdhani text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-tight flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1"
            >
              <span className="inline-flex items-center gap-2">
                <Gamepad className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 animate-pulse-glow" style={{ animation: "pulse-glow 2s infinite" }} />
                WELCOME TO
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aaff] via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(0,170,255,0.3)] filter">
                {shopData.shopName}
              </span>
            </motion.h1>

            {/* Subtext description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 font-medium"
            >
              Toko item Growtopia terpercaya — Fast delivery, secure transaction. 
              Dapatkan item idamanmu dengan harga termurah dan layanan profesional terbaik!
            </motion.p>

            {/* CTA Interaction Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={handleScrollToItems}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-rajdhani text-lg font-bold tracking-wider hover:from-sky-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(0,170,255,0.3)] hover:shadow-[0_0_25px_rgba(0,170,255,0.5)] transform hover:scale-[1.03] flex items-center space-x-2"
              >
                <span>Lihat Item Toko</span>
                <span>→</span>
              </button>
              
              <a
                href={`https://wa.me/${shopData.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-lg bg-slate-900 border border-sky-400/25 text-slate-200 font-rajdhani text-lg font-bold tracking-wider hover:bg-slate-850 hover:text-white hover:border-sky-400/40 transition-all duration-300 flex items-center space-x-2"
              >
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>Hubungi Admin</span>
              </a>
            </motion.div>

            {/* Service Features Trust Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-sky-400/5 max-w-4xl mx-auto backdrop-blur-sm"
            >
              <div className="flex flex-col items-center p-2 text-center">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mb-3 shadow-[0_0_8px_rgba(0,170,255,0.1)]">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-rajdhani font-bold text-white text-md uppercase">PROSES INSTANT</h3>
                <p className="text-xs text-slate-400 mt-1">Selesai dalam hitungan menit</p>
              </div>
              
              <div className="flex flex-col items-center p-2 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-rajdhani font-bold text-white text-md uppercase">100% AMAN</h3>
                <p className="text-xs text-slate-400 mt-1">Transaksi legal & terverifikasi</p>
              </div>

              <div className="flex flex-col items-center p-2 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3 shadow-[0_0_8px_rgba(168,85,247,0.1)]">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-rajdhani font-bold text-white text-md uppercase">STOK TERBANYAK</h3>
                <p className="text-xs text-slate-400 mt-1">Item langka selalu terisi</p>
              </div>

              <div className="flex flex-col items-center p-2 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <h3 className="font-rajdhani font-bold text-white text-md uppercase">BEST SELLER</h3>
                <p className="text-xs text-slate-400 mt-1">Ribuan pelanggan puas</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>



      {/* FILTER, SEARCH, AND GRID STORE ITEMS */}
      <section id="items" ref={itemsSectionRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        
        {/* Title Group header */}
        <div className="text-center md:text-left md:flex md:items-end md:justify-between border-b border-sky-400/10 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 text-sky-400 font-rajdhani font-bold text-sm tracking-widest uppercase mb-1">
              <Grid className="w-4 h-4 text-sky-400" />
              <span>Daftar Katalog Item</span>
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide flex items-center gap-2.5 justify-center md:justify-start">
              <ShoppingBag className="w-7 h-7 text-sky-400 stroke-[2]" />
              <span>ITEM CATALOG</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 md:mt-0 font-medium max-w-md">
            Pilih kategori atau langsung ketik pencarian item Growtopia favorit kamu di bawah.
          </p>
        </div>

        {/* SEARCH BAR & CATEGORIES VIEW CONTROLLERS */}
        <div className="space-y-6 mb-10">
          
          {/* Real-time search element bar */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 h-5 text-sky-400/70" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama item atau detail deskripsi..."
              className="block w-full pl-11 pr-10 py-3.5 rounded-xl bg-[#0d1526]/80 border border-sky-400/20 text-slate-100 placeholder-slate-500 font-sans focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Dynamic horizontal category filter list browser */}
          <div className="relative">
            <div className="overflow-x-auto pb-2 flex gap-2.5 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={`cat-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-lg font-rajdhani font-bold tracking-wider text-sm transition-all duration-300 flex-shrink-0 cursor-pointer ${
                      isActive 
                        ? 'bg-[#00aaff] text-slate-950 shadow-[0_0_15px_rgba(0,170,255,0.4)] font-extrabold border border-sky-300/30' 
                        : 'bg-slate-900/50 border border-sky-400/15 text-slate-400 hover:text-sky-300 hover:border-sky-400/30'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="hidden lg:block absolute -right-4 top-0 h-full w-12 bg-gradient-to-l from-[#0a0f1e] to-transparent pointer-events-none"></div>
          </div>

          {/* Count summary indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-450 px-1">
            <div className="flex items-center space-x-1.5 font-sans">
              <span className="text-slate-500">Menampilkan</span>
              <span className="text-sky-400 font-bold font-mono">{filteredItems.length}</span>
              <span className="text-slate-500">dari</span>
              <span className="text-slate-300 font-bold font-mono">{shopData.items.length}</span>
              <span className="text-slate-500">total item di database</span>
            </div>

            {(searchQuery || selectedCategory !== "Semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset filter</span>
              </button>
            )}
          </div>

        </div>

        {/* LOADING STATE - DYNAMIC SKELETON SCREENS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={`skeleton-${idx}`} className="rounded-xl bg-[#111827] border border-sky-500/5 overflow-hidden h-[410px] flex flex-col justify-between p-1 anime-pulse animate-pulse">
                <div className="h-[200px] w-full bg-slate-900"></div>
                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-800 rounded w-4/5"></div>
                    <div className="h-10 bg-slate-800 rounded w-full"></div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-6 bg-slate-800 rounded w-2/5"></div>
                    <div className="h-10 bg-slate-800 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ACTUAL ITEM DISPLAY GRID */
          <>
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredItems.map((item, idx) => {
                    const styling = getCategoryColor(item.category);
                    
                    return (
                      <motion.div
                        layout
                        key={`item-${item.id}`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.35, delay: idx * 0.04 }}
                        className={`rounded-xl bg-[#111827] border border-sky-400/10 overflow-hidden flex flex-col justify-between group relative transition-all duration-300 ${styling.cardBorder} hover:shadow-lg hover:shadow-sky-500/5 ${!item.inStock && 'opacity-70'}`}
                      >
                        
                        {/* Image area card top header */}
                        <div className="h-[200px] w-full bg-[#0d1526] relative p-4 flex items-center justify-center overflow-hidden border-b border-sky-500/5 group-hover:bg-[#0d1526]/80 transition-all duration-300">
                          
                          {/* Image Fail fallback render */}
                          {imageErrors[item.id] ? (
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="w-14 h-14 rounded-full bg-[#111827] flex items-center justify-center border border-sky-400/20 text-sky-400 font-rajdhani text-xl font-bold mb-1 shadow-md">
                                {getItemInitials(item.name)}
                              </div>
                              <span className="text-[11px] text-slate-500">Gambar item</span>
                            </div>
                          ) : (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                              onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                            />
                          )}

                          {/* Dynamic Visual Badges Overlay */}
                          <div className={`absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider font-rajdhani uppercase ${styling.badge}`}>
                            {item.category}
                          </div>

                          {/* Stock Status indicator wrapper */}
                          <div className="absolute bottom-2.5 left-3.5 flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-850 text-xs">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-rose-500'}`}></span>
                            <span className={`font-semibold ${item.inStock ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {item.inStock ? 'Tersedia' : 'Habis'}
                            </span>
                          </div>
                        </div>

                        {/* Contents card block bottom info description */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-rajdhani text-lg font-bold text-white tracking-wide group-hover:text-sky-400 transition-colors duration-200">
                              {item.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[40px]">
                              {item.description}
                            </p>
                          </div>

                          {/* Price details and purchase trigger */}
                          <div className="mt-5 pt-4 border-t border-sky-500/5 flex flex-col space-y-3.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">Harga Terbaik</span>
                              <span className="font-rajdhani text-xl font-bold text-[#00aaff] group-hover:text-sky-300 transition-colors">
                                {shopData.currency} {formatPrice(item.price)}
                              </span>
                            </div>

                            {/* CTA purchasing WhatsApp link */}
                            <button
                              onClick={() => handleBuyWhatsApp(item)}
                              disabled={!item.inStock}
                              className={`w-full py-2.5 rounded-lg flex items-center justify-center space-x-2 font-rajdhani font-bold tracking-wider uppercase transition-all duration-300 ${
                                item.inStock 
                                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-[0_0_12px_rgba(0,170,255,0.15)] hover:shadow-[0_0_15px_rgba(0,170,255,0.3)] transform hover:scale-[1.01]' 
                                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <Phone className="w-4 h-4 text-sky-200" />
                              <span>BELI SEKARANG</span>
                            </button>
                          </div>

                        </div>

                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                
                /* NO RESULTS ELEMENT SCREEN FALLBACK */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center max-w-md mx-auto rounded-2xl bg-slate-900/30 border border-sky-400/5 p-8"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border border-sky-400/10 text-slate-500 mx-auto mb-4 shadow-sm">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="font-rajdhani text-xl font-bold text-slate-200 uppercase tracking-wide">
                    Tidak ada item ditemukan
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">
                    Coba ubah kata kunci pencarian Anda atau kembalikan kategori filter ke "Semua" untul menjelajah produk lainnya.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Semua");
                    }}
                    className="mt-5 px-5 py-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-rajdhani font-bold hover:bg-[#00aaff] hover:text-slate-950 hover:border-transparent transition-all duration-300 uppercase tracking-widest"
                  >
                    Tampilkan Semua Item
                  </button>
                </motion.div>

              )}
            </AnimatePresence>
          </>
        )}
      </section>

      {/* FOOTER SECTION ROW */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-sky-400/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-sky-500/5">
            
            {/* Tagline branding block */}
            <div className="space-y-4 text-center md:text-left">
              <span className="font-rajdhani text-2xl font-bold tracking-widest text-[#00aaff] uppercase">
                {shopData.shopName}
              </span>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Penyedia item game Growtopia terlengkap dan paling terpercaya sejak 2023. Fast delivery, secure transaction, customer satisfaction is our top priority!
              </p>
            </div>

            {/* Navigation reference links */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <h4 className="font-rajdhani text-white font-bold uppercase tracking-wider text-sm border-b border-sky-400/20 pb-1">
                NAVIGASI TOKO
              </h4>
              <a 
                href="#hero" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-slate-400 hover:text-sky-400 text-sm"
              >
                Kembali ke Atas
              </a>
              <a 
                href="#items" 
                onClick={(e) => { e.preventDefault(); handleScrollToItems(); }}
                className="text-slate-400 hover:text-sky-400 text-sm"
              >
                Jelajahi Katalog Item
              </a>
              <a 
                href={`https://wa.me/${shopData.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-sky-400 text-sm flex items-center space-x-1.5"
              >
                <span>Chat Admin WhatsApp</span>
                <span className="text-slate-600 text-[10px]">&bull; Online</span>
              </a>
            </div>

            {/* Trust and safety security guarantees branding badge */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="font-rajdhani text-white font-bold uppercase tracking-wider text-sm border-b border-sky-400/20 pb-1">
                SISTEM TRANSAKSI
              </h4>
              <div className="flex flex-row gap-3">
                <div className="flex items-center space-x-1.5 bg-slate-900 border border-sky-400/10 px-3 py-1.5 rounded-lg text-slate-300 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-rajdhani font-bold">100% AMAN</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-900 border border-sky-400/10 px-3 py-1.5 rounded-lg text-slate-300 text-xs">
                  <Zap className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span className="font-rajdhani font-bold">FAST PROSES</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center md:text-left leading-relaxed">
                Kami tidak menyimpan informasi akun GrowID Anda. Transaksi dilakukan aman secara langsung melalui chat WhatsApp resmi admin kami di nomor <span className="text-slate-400 font-mono">+{shopData.whatsappNumber}</span>.
              </p>
            </div>

          </div>

          {/* Core copyrights bottom area */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <span className="text-xs text-slate-500">
              © 2026 <span className="text-slate-400 font-semibold">{shopData.shopName}</span>. All rights reserved.
            </span>
            <span className="text-xs text-slate-600 font-rajdhani uppercase tracking-widest flex items-center space-x-1">
              <span>Fast</span>
              <span>&bull;</span>
              <span>Trusted</span>
              <span>&bull;</span>
              <span>Secure</span>
            </span>
          </div>

        </div>
      </footer>

      {/* FLOAT SCROLL TO TOP TELEPORT BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg shadow-sky-500/20 border border-sky-400/20 hover:border-sky-400/40 cursor-pointer hover:shadow-sky-500/35 transition-all duration-300 flex items-center justify-center"
            aria-label="Back to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
