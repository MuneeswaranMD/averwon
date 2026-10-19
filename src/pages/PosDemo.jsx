import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  QrCode,
  CreditCard,
  Banknote,
  Split,
  ChevronRight,
  ArrowLeft,
  Boxes,
  FileText,
  BarChart3,
  Receipt,
  UserCheck,
  ShieldCheck,
  Zap,
  Sparkles,
  X,
  ExternalLink,
  Laptop
} from 'lucide-react';
import {
  INITIAL_FIREWORKS_CATALOG,
  FIREWORKS_CATEGORIES,
  SAMPLE_CUSTOMERS,
  INITIAL_DEMO_INVOICES
} from '../data/fireworksCatalog';

export default function PosDemo() {
  // ── Sandbox State ──
  const [activeTab, setActiveTab] = useState('billing'); // 'billing' | 'inventory' | 'invoices' | 'reports'
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem('averqon_pos_demo_catalog');
    return saved ? JSON.parse(saved) : INITIAL_FIREWORKS_CATALOG;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('averqon_pos_demo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [heldBills, setHeldBills] = useState([]);
  const [completedInvoices, setCompletedInvoices] = useState(() => {
    const saved = localStorage.getItem('averqon_pos_demo_invoices');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_INVOICES;
  });

  // ── Billing Inputs ──
  const [selectedCategory, setSelectedCategory] = useState('All Products (208)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(SAMPLE_CUSTOMERS[0].name);
  const [festivalDiscount, setFestivalDiscount] = useState(0); // Extra % discount
  const [paymentMode, setPaymentMode] = useState('Cash'); // 'Cash' | 'UPI' | 'Card' | 'Split'
  const [tenderedAmount, setTenderedAmount] = useState('');
  
  // ── Invoice Modal State ──
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [invoicePrintMode, setInvoicePrintMode] = useState('thermal'); // 'thermal' | 'a4'
  const [showQuoteBanner, setShowQuoteBanner] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('averqon_pos_demo_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('averqon_pos_demo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('averqon_pos_demo_invoices', JSON.stringify(completedInvoices));
  }, [completedInvoices]);

  // ── Filtered Products ──
  const filteredProducts = useMemo(() => {
    return catalog.filter((item) => {
      // Category filter
      let matchesCat = true;
      if (selectedCategory === 'Popular Items') {
        matchesCat = item.popular;
      } else if (selectedCategory.startsWith('All Products')) {
        matchesCat = true;
      } else {
        matchesCat = item.category.toLowerCase().includes(selectedCategory.split(' ')[0].toLowerCase());
      }

      // Search query
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch =
          item.name.toLowerCase().includes(q) ||
          item.tamilName.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
      }

      return matchesCat && matchesSearch;
    });
  }, [catalog, selectedCategory, searchQuery]);

  // ── Cart Calculations ──
  const cartTotals = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * (Number(festivalDiscount) || 0)) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    
    // Crackers GST 18% slab (Split into 9% CGST + 9% SGST)
    const gstRate = 0.18;
    const cgst = taxableAmount * (gstRate / 2);
    const sgst = taxableAmount * (gstRate / 2);
    const totalTax = cgst + sgst;
    const grandTotal = Math.round((taxableAmount + totalTax) * 100) / 100;

    const tendered = parseFloat(tenderedAmount) || 0;
    const balanceChange = Math.max(0, tendered - grandTotal);

    return {
      totalItems,
      subtotal,
      discountAmount,
      taxableAmount,
      cgst,
      sgst,
      totalTax,
      grandTotal,
      balanceChange
    };
  }, [cart, festivalDiscount, tenderedAmount]);

  // ── Cart Actions ──
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(`⚠️ "${product.name}" is currently Out of Stock! Please restock via Inventory.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Cannot add more. Only ${product.stock} packets available in inventory.`);
          return prevCart;
        }
        return prevCart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const product = catalog.find((p) => p.id === productId);
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (product && newQty > product.stock) {
              alert(`Only ${product.stock} packets in stock.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Clear all items from current cart?')) {
      setCart([]);
      setFestivalDiscount(0);
      setTenderedAmount('');
    }
  };

  // ── Hold & Resume Bills ──
  const holdBill = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Add items before holding.');
      return;
    }
    const held = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      customer: selectedCustomer,
      cart: [...cart],
      discount: festivalDiscount,
      total: cartTotals.grandTotal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHeldBills((prev) => [...prev, held]);
    setCart([]);
    setFestivalDiscount(0);
    setTenderedAmount('');
    alert(`Bill held as #${held.id}. You can resume anytime from the top bar.`);
  };

  const resumeBill = (heldId) => {
    const held = heldBills.find((b) => b.id === heldId);
    if (!held) return;
    if (cart.length > 0 && !window.confirm('Current cart will be replaced with held bill. Proceed?')) {
      return;
    }
    setCart(held.cart);
    setSelectedCustomer(held.customer);
    setFestivalDiscount(held.discount);
    setHeldBills((prev) => prev.filter((b) => b.id !== heldId));
  };

  // ── Complete & Generate Invoice ──
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cannot checkout an empty cart. Please add items.');
      return;
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(completedInvoices.length + 892).padStart(4, '0')}`;
    const newInvoice = {
      invoiceNumber,
      date: new Date().toISOString(),
      customerName: selectedCustomer,
      customerPhone: SAMPLE_CUSTOMERS.find((c) => c.name === selectedCustomer)?.phone || '9842103450',
      paymentMode,
      itemsCount: cartTotals.totalItems,
      subtotal: cartTotals.subtotal,
      discountPercent: festivalDiscount,
      discountAmount: cartTotals.discountAmount,
      taxableAmount: cartTotals.taxableAmount,
      cgst: cartTotals.cgst,
      sgst: cartTotals.sgst,
      grandTotal: cartTotals.grandTotal,
      tenderedAmount: parseFloat(tenderedAmount) || cartTotals.grandTotal,
      balanceChange: cartTotals.balanceChange,
      status: 'Completed',
      items: cart.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        tamilName: item.tamilName,
        category: item.category,
        hsn: item.hsn,
        unit: item.unit,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }))
    };

    // Deduct stock from catalog
    setCatalog((prevCatalog) =>
      prevCatalog.map((prod) => {
        const inCart = cart.find((c) => c.id === prod.id);
        if (inCart) {
          return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
        }
        return prod;
      })
    );

    // Save invoice
    setCompletedInvoices((prev) => [newInvoice, ...prev]);
    setActiveInvoice(newInvoice);

    // Reset current sale
    setCart([]);
    setFestivalDiscount(0);
    setTenderedAmount('');
  };

  // ── Restock Product in Inventory ──
  const restockItem = (productId, count = 50) => {
    setCatalog((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: item.stock + count } : item
      )
    );
  };

  // ── Reset Demo Data ──
  const resetDemoData = () => {
    if (window.confirm('Reset all demo data back to pristine Sivakasi catalog and clear mock sales?')) {
      localStorage.removeItem('averqon_pos_demo_catalog');
      localStorage.removeItem('averqon_pos_demo_cart');
      localStorage.removeItem('averqon_pos_demo_invoices');
      setCatalog(INITIAL_FIREWORKS_CATALOG);
      setCart([]);
      setHeldBills([]);
      setCompletedInvoices(INITIAL_DEMO_INVOICES);
      setFestivalDiscount(0);
      setTenderedAmount('');
      setActiveInvoice(null);
      alert('✨ Sandbox reset to original factory state successfully!');
    }
  };

  // Helper for Indian Rupees formatting
  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans">
      
      {/* ── 1. Top Sandbox Banner ── */}
      <div className="bg-[#101A32] text-white border-b border-white/10 px-4 py-2.5 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold tracking-wide">
              <Sparkles size={13} className="text-amber-400" />
              <span>LIVE DEMO SANDBOX</span>
            </span>
            <span className="hidden md:inline text-slate-300 font-medium">
              Interactive simulator for <strong className="text-white">Crackers POS v2.1</strong> • All modifications stay inside your browser sandbox.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              title="Reset stock, catalog and transactions to default"
            >
              <RotateCcw size={13} />
              <span>Reset Demo</span>
            </button>

            <Link
              to="/products/crackers-pos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-sm"
            >
              <span>Product Details & Quote</span>
              <ExternalLink size={13} />
            </Link>
          </div>

        </div>
      </div>

      {/* ── 2. Main POS Workspace ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical App Bar (Mimics genuine desktop software) */}
        <aside className="w-16 sm:w-56 bg-[#0E1726] text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
          
          {/* Top Shop Brand / Header */}
          <div>
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black shadow-md shrink-0">
                <Flame size={20} />
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="font-extrabold text-white text-sm tracking-wide">Crackers POS</h1>
                <p className="text-[10px] text-amber-400 font-mono">v2.1 PRO RETAIL</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="p-2 sm:p-3 space-y-1">
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'billing'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <Zap size={16} className={activeTab === 'billing' ? 'text-white' : 'text-amber-400'} />
                <span className="hidden sm:inline">POS Billing (FAST)</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <Boxes size={16} />
                <span className="hidden sm:inline">Stock & Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'invoices'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <Receipt size={16} />
                <span className="hidden sm:inline">Invoices ({completedInvoices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'reports'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Daily Reports</span>
              </button>
            </nav>
          </div>

          {/* Bottom Staff / Terminal Info */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
            <div className="hidden sm:block text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Staff Terminal:</span>
                <span className="font-bold text-amber-400">OWNER ADMIN</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono truncate">admin@gmail.com</p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                <span className="font-mono text-slate-500">Averqon v2.1</span>
              </div>
            </div>
            <div className="sm:hidden flex justify-center text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>

        </aside>

        {/* ── Main Viewport Switcher ── */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#F4F6F9]">

          {/* ══════════════ TAB 1: POS BILLING ══════════════ */}
          {activeTab === 'billing' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Product Catalog & Search Area (Left 65%) */}
              <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto border-r border-slate-200">
                
                {/* Search & Barcode Bar */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[260px] relative">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Crackers by Name, தமிழ் பெயர், Brand, SKU or Scan Barcode (F2)..."
                      className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Barcode & Resume Status */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Scanner Ready (F2)</span>
                    </div>

                    {heldBills.length > 0 && (
                      <div className="relative group">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-400 transition-colors">
                          <PauseCircle size={14} />
                          <span>Resume ({heldBills.length})</span>
                        </button>
                        {/* Dropdown for held bills */}
                        <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-30">
                          <p className="text-[11px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider">Held Counter Bills</p>
                          {heldBills.map((b) => (
                            <div
                              key={b.id}
                              onClick={() => resumeBill(b.id)}
                              className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800">{b.id} • {b.customer}</p>
                                <p className="text-[10px] text-slate-500">{b.cart.length} items • {b.timestamp}</p>
                              </div>
                              <span className="font-bold text-primary">{formatINR(b.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Pills (Identical to software screenshot) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
                  {FIREWORKS_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Products Grid (Modeled on user's screenshot) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                  {filteredProducts.map((prod) => {
                    const inCartItem = cart.find((i) => i.id === prod.id);
                    const qtyInCart = inCartItem ? inCartItem.quantity : 0;
                    const isOutOfStock = prod.stock <= 0;

                    return (
                      <div
                        key={prod.id}
                        className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group ${
                          qtyInCart > 0
                            ? 'border-primary ring-2 ring-primary/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        } ${isOutOfStock ? 'opacity-60 bg-slate-50' : ''}`}
                      >
                        {/* Packaging Header & Thumbnail */}
                        <div className="relative p-3 pb-2 bg-gradient-to-b from-slate-100 to-white">
                          
                          {/* Badges */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                              {prod.badge || prod.code}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {isOutOfStock ? 'Out of Stock' : 'Available'}
                            </span>
                          </div>

                          {/* Packaging Visual Preview */}
                          <div className="w-full h-24 rounded-xl bg-gradient-to-tr from-slate-900 via-rose-950 to-amber-950 text-white flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-2 text-center">
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/20 rounded-full blur-md" />
                            <span className="text-2xl mb-1">{prod.image}</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[9px] text-slate-300 font-mono">
                              {prod.brand}
                            </span>
                          </div>

                          {/* Category & Stock Row */}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span className="truncate max-w-[90px]">{prod.category}</span>
                            <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                              prod.stock < 30 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {prod.stock} PKT
                            </span>
                          </div>
                        </div>

                        {/* Title & Tamil Name */}
                        <div className="p-3 pt-1 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight line-clamp-1">
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                              {prod.tamilName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {prod.unit} • SKU: {prod.code}
                            </p>
                          </div>

                          {/* Pricing & Add Button */}
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-end justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="line-through text-slate-400 font-mono">
                                  ₹{prod.mrp.toFixed(2)}
                                </span>
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                                  Save {prod.discountPercent}%
                                </span>
                              </div>
                              <div className="font-poppins font-black text-slate-900 text-sm sm:text-base leading-none mt-1">
                                ₹{prod.price.toFixed(2)}
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {prod.gstRate}% GST incl.
                              </span>
                            </div>

                            {/* Quantity Controls or Add Button */}
                            {qtyInCart > 0 ? (
                              <div className="flex items-center gap-1 bg-primary text-white rounded-xl p-1 shadow-sm">
                                <button
                                  onClick={() => updateQuantity(prod.id, -1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="font-bold font-mono text-xs w-5 text-center">
                                  {qtyInCart}
                                </span>
                                <button
                                  onClick={() => updateQuantity(prod.id, 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(prod)}
                                disabled={isOutOfStock}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-slate-700 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed group-hover:scale-105"
                                title="Add to current sale"
                              >
                                <Plus size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-400 text-sm">No crackers found matching "{searchQuery}"</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('All Products (208)'); }}
                      className="mt-2 text-xs text-primary font-bold hover:underline"
                    >
                      Clear search & filter
                    </button>
                  </div>
                )}

              </div>

              {/* ── Cart & Active Billing Drawer (Right 35%, Exactly like screenshot) ── */}
              <div className="w-full lg:w-[410px] xl:w-[450px] bg-white border-t lg:border-t-0 border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-xl">
                
                {/* Cart Top Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={18} className="text-primary" />
                      <h3 className="font-bold text-slate-900 text-sm">Current Sale</h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold font-mono">
                        {cartTotals.totalItems} Items
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] tracking-wide">
                        GST (18%)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold text-[10px]">
                        Retail Bill
                      </span>
                    </div>
                  </div>

                  {/* Customer Select Bar */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
                    <UserCheck size={16} className="text-amber-500 shrink-0" />
                    <select
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      className="bg-transparent flex-1 text-slate-800 font-semibold focus:outline-none cursor-pointer"
                    >
                      {SAMPLE_CUSTOMERS.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} {c.isWholesale ? '(Wholesale)' : ''} — {c.city}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] font-mono text-slate-400">(F3)</span>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[380px] lg:max-h-none">
                  {cart.length === 0 ? (
                    <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center text-slate-400 p-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                        <ShoppingCart size={32} />
                      </div>
                      <p className="font-bold text-slate-700 text-sm">Cart is Empty</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                        Select crackers from catalog or scan barcode to start billing
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3 text-xs transition-all shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.tamilName}</p>
                          <p className="text-[10px] font-mono text-slate-400">
                            HSN: {item.hsn} • ₹{item.price.toFixed(2)} / pkt
                          </p>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-bold font-mono text-xs text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[65px]">
                          <p className="font-black text-slate-900 font-poppins">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-300 hover:text-rose-500 text-[10px] inline-flex items-center gap-0.5 mt-0.5"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bill Summary & Calculations */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-3">
                  
                  {/* Calculation Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartTotals.totalItems} items, {cartTotals.totalItems} pkts):</span>
                      <span className="font-mono text-slate-800">₹{cartTotals.subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <span>Extra Festive Discount:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={festivalDiscount}
                          onChange={(e) => setFestivalDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-right font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        <span className="font-mono text-xs">%</span>
                        <span className="font-mono text-emerald-700 font-bold ml-1">
                          -₹{cartTotals.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span>Taxable Value (HSN 3604):</span>
                      <span className="font-mono text-slate-800">₹{cartTotals.taxableAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>CGST (9%) + SGST (9%):</span>
                      <span className="font-mono text-slate-700">₹{cartTotals.totalTax.toFixed(2)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-300/80 flex items-baseline justify-between text-slate-900">
                      <span className="font-extrabold text-sm uppercase tracking-wide">GRAND TOTAL:</span>
                      <span className="font-poppins font-black text-2xl text-slate-950">
                        ₹{cartTotals.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Mode Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { id: 'Cash', icon: Banknote },
                      { id: 'UPI', icon: QrCode },
                      { id: 'Card', icon: CreditCard },
                      { id: 'Split', icon: Split }
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSel = paymentMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setPaymentMode(mode.id)}
                          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${
                            isSel
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={14} className={isSel ? 'text-amber-400' : 'text-slate-500'} />
                          <span>{mode.id}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tendered / Cash Input */}
                  {paymentMode === 'Cash' && cart.length > 0 && (
                    <div className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-600 font-medium">Tendered Cash:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder={cartTotals.grandTotal.toFixed(0)}
                          value={tenderedAmount}
                          onChange={(e) => setTenderedAmount(e.target.value)}
                          className="w-24 px-2 py-1 text-right font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {cartTotals.balanceChange > 0 && (
                          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Change: ₹{cartTotals.balanceChange.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons (Hold, Clear, Complete & Print) */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={holdBill}
                      disabled={cart.length === 0}
                      className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                      title="Hold bill to attend next customer"
                    >
                      <PauseCircle size={15} />
                      <span className="hidden sm:inline">Hold</span>
                    </button>

                    <button
                      onClick={clearCart}
                      disabled={cart.length === 0}
                      className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-40"
                      title="Clear Cart"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Printer size={16} />
                      <span>Complete & Print (F9)</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ══════════════ TAB 2: INVENTORY & STOCK ══════════════ */}
          {activeTab === 'inventory' && (
            <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Fireworks Stock Management</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time inventory levels, HSN Code 3604 tracking, reorder alert levels, and 1-click stock replenishment.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                    Total Catalog SKUs: {catalog.length}
                  </span>
                </div>
              </div>

              {/* Table of Inventory Items */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">SKU / Code</th>
                        <th className="py-3 px-4">Cracker Description</th>
                        <th className="py-3 px-4">Tamil Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">HSN</th>
                        <th className="py-3 px-4 text-right">Retail Price</th>
                        <th className="py-3 px-4 text-right">Current Stock</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {catalog.map((item) => {
                        const isLow = item.stock <= item.reorderLevel;
                        const isOut = item.stock <= 0;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.code}</td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-slate-400">{item.brand}</p>
                            </td>
                            <td className="py-3 px-4 text-slate-600 font-medium">{item.tamilName}</td>
                            <td className="py-3 px-4 text-slate-500">{item.category}</td>
                            <td className="py-3 px-4 font-mono text-slate-500">{item.hsn}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-black text-sm">
                              <span className={isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'}>
                                {item.stock} {item.unit}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isOut ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                                  Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  Low Stock
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                  Healthy
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => restockItem(item.id, 50)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-bold text-[11px] transition-colors"
                              >
                                +50 PKT
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════ TAB 3: INVOICES HISTORY ══════════════ */}
          {activeTab === 'invoices' && (
            <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sales Invoices & GST Bills</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete transaction logs with HSN 3604 breakdown, split payment details, and instant re-print support.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Invoices Generated</p>
                  <p className="text-xl font-black font-poppins text-primary">{completedInvoices.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Invoice No</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4 text-right">Items</th>
                        <th className="py-3 px-4 text-right">Taxable</th>
                        <th className="py-3 px-4 text-right">GST (18%)</th>
                        <th className="py-3 px-4 text-right">Grand Total</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {completedInvoices.map((inv) => (
                        <tr key={inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(inv.date).toLocaleDateString()} {new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{inv.customerName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {inv.paymentMode}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">{inv.itemsCount}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">₹{inv.taxableAmount?.toFixed(2) || inv.subtotal.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            ₹{((inv.cgst || 0) + (inv.sgst || 0)).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-black text-slate-900 text-sm">
                            ₹{inv.grandTotal.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setActiveInvoice(inv)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-primary font-bold text-[11px] hover:bg-primary hover:text-white transition-colors"
                            >
                              <Printer size={13} />
                              <span>View / Print</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════ TAB 4: DAILY REPORTS ══════════════ */}
          {activeTab === 'reports' && (
            <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Festival Counter Performance Summary</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Aggregated real-time metrics across all billed counters for today.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold uppercase text-slate-400">Total Billed Sales</p>
                  <p className="text-2xl font-black font-poppins text-slate-900 mt-2">
                    {formatINR(completedInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0))}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">Across {completedInvoices.length} invoices</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold uppercase text-slate-400">GST Collected (HSN 3604)</p>
                  <p className="text-2xl font-black font-poppins text-primary mt-2">
                    {formatINR(completedInvoices.reduce((sum, inv) => sum + ((inv.cgst || 0) + (inv.sgst || 0)), 0))}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Split 50% CGST + 50% SGST</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold uppercase text-slate-400">Average Bill Size</p>
                  <p className="text-2xl font-black font-poppins text-slate-900 mt-2">
                    {completedInvoices.length > 0
                      ? formatINR(completedInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0) / completedInvoices.length)
                      : '₹0.00'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">High festival ticket size</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold uppercase text-slate-400">Catalog SKUs In Stock</p>
                  <p className="text-2xl font-black font-poppins text-emerald-600 mt-2">
                    {catalog.filter((i) => i.stock > 0).length} / {catalog.length}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {catalog.filter((i) => i.stock <= 0).length} items require reorder
                  </p>
                </div>

              </div>

              {/* Helpful CTA */}
              <div className="bg-gradient-to-r from-[#101A32] to-[#1E293B] rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Ready to license Crackers POS for your shop?</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Get the complete desktop application with high-speed thermal printing, multi-counter sync, barcode generator, and 24/7 festival season support.
                  </p>
                </div>
                <Link
                  to="/products/crackers-pos"
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Request Official Quotation & Setup
                </Link>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ══════════════ 3. GST TAX INVOICE MODAL / PRINT PREVIEW ══════════════ */}
      <AnimatePresence>
        {activeInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6"
            >
              
              {/* Modal Control Bar */}
              <div className="bg-slate-900 px-5 py-3 flex items-center justify-between text-white border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-amber-400" />
                  <span className="font-bold text-xs sm:text-sm">GST Tax Invoice Preview</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    PAID ({activeInvoice.paymentMode})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-800 rounded-lg p-0.5 flex text-[10px] font-bold">
                    <button
                      onClick={() => setInvoicePrintMode('thermal')}
                      className={`px-2.5 py-1 rounded ${invoicePrintMode === 'thermal' ? 'bg-primary text-white' : 'text-slate-400'}`}
                    >
                      3" Thermal
                    </button>
                    <button
                      onClick={() => setInvoicePrintMode('a4')}
                      className={`px-2.5 py-1 rounded ${invoicePrintMode === 'a4' ? 'bg-primary text-white' : 'text-slate-400'}`}
                    >
                      A4 Invoice
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveInvoice(null)}
                    className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Container */}
              <div className="p-6 overflow-y-auto max-h-[70vh] bg-slate-100 flex justify-center">
                
                {invoicePrintMode === 'thermal' ? (
                  // ── 3-INCH (80mm) THERMAL RECEIPT FORMAT ──
                  <div className="w-[340px] bg-white p-5 rounded shadow-md text-[11px] font-mono text-slate-900 leading-tight border border-slate-300">
                    
                    <div className="text-center pb-3 border-b border-dashed border-slate-400">
                      <p className="font-black text-sm uppercase">SRI MEENAKSHI FIREWORKS</p>
                      <p className="text-[10px] text-slate-600">142/B, Main Bazaar Road, Sivakasi</p>
                      <p className="text-[10px] text-slate-600">Tamil Nadu - 626123 • Tel: 9842103450</p>
                      <p className="text-[10px] font-bold mt-1">GSTIN: 33AAACF1234F1Z5</p>
                      <p className="text-[10px] text-slate-500">TAX INVOICE / CASH BILL</p>
                    </div>

                    <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
                      <div className="flex justify-between">
                        <span>Bill No: {activeInvoice.invoiceNumber}</span>
                        <span>Mode: {activeInvoice.paymentMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date: {new Date(activeInvoice.date).toLocaleDateString()}</span>
                        <span>Time: {new Date(activeInvoice.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer: {activeInvoice.customerName}</span>
                        <span>Counter: #01</span>
                      </div>
                    </div>

                    {/* Table items */}
                    <div className="py-2 border-b border-dashed border-slate-400">
                      <div className="flex justify-between font-bold pb-1 text-[10px] border-b border-slate-200">
                        <span className="w-1/2">Item Description</span>
                        <span className="w-1/6 text-center">Qty</span>
                        <span className="w-1/6 text-right">Rate</span>
                        <span className="w-1/6 text-right">Amt</span>
                      </div>

                      <div className="divide-y divide-slate-100 text-[10px] py-1">
                        {activeInvoice.items ? (
                          activeInvoice.items.map((i, idx) => (
                            <div key={idx} className="py-1">
                              <p className="font-bold truncate">{i.name}</p>
                              <div className="flex justify-between text-slate-600">
                                <span className="w-1/2 text-[9px] truncate">{i.tamilName}</span>
                                <span className="w-1/6 text-center">{i.quantity}</span>
                                <span className="w-1/6 text-right">{i.price.toFixed(0)}</span>
                                <span className="w-1/6 text-right font-bold text-slate-900">{i.total.toFixed(2)}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-1 flex justify-between">
                            <span>Sivakasi Crackers Selection</span>
                            <span>{activeInvoice.itemsCount} pkts</span>
                            <span>₹{activeInvoice.subtotal?.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{activeInvoice.subtotal?.toFixed(2)}</span>
                      </div>
                      {activeInvoice.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Festive Discount ({activeInvoice.discountPercent}%):</span>
                          <span>-₹{activeInvoice.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Taxable Value (HSN 3604):</span>
                        <span>₹{activeInvoice.taxableAmount?.toFixed(2) || activeInvoice.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST (9%):</span>
                        <span>₹{(activeInvoice.cgst || (activeInvoice.grandTotal * 0.082)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST (9%):</span>
                        <span>₹{(activeInvoice.sgst || (activeInvoice.grandTotal * 0.082)).toFixed(2)}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-300 flex justify-between font-black text-xs text-slate-900">
                        <span>NET PAYABLE:</span>
                        <span>₹{activeInvoice.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-center pt-3 text-[9px] text-slate-500 space-y-0.5">
                      <p className="font-bold text-slate-800">💥 HAPPY & SAFE DIWALI! 💥</p>
                      <p>Goods once sold cannot be returned.</p>
                      <p>Handle fireworks with caution & adult supervision.</p>
                      <p className="text-[8px] text-slate-400 pt-1">Billed via Averqon Crackers POS v2.1</p>
                    </div>

                  </div>
                ) : (
                  // ── A4 FORMAL TAX INVOICE FORMAT ──
                  <div className="w-full bg-white p-6 rounded shadow-md text-xs font-sans text-slate-800 border border-slate-300">
                    
                    <div className="flex justify-between border-b pb-4">
                      <div>
                        <h2 className="font-black text-lg text-slate-900">SRI MEENAKSHI FIREWORKS</h2>
                        <p className="text-xs text-slate-600">Fireworks Wholesale & Retail Counter</p>
                        <p className="text-xs text-slate-600">142/B, Main Bazaar Road, Sivakasi, Tamil Nadu - 626123</p>
                        <p className="text-xs font-mono font-bold mt-1">GSTIN: 33AAACF1234F1Z5 • State: 33 (Tamil Nadu)</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                          TAX INVOICE
                        </span>
                        <p className="font-mono font-bold text-sm text-primary mt-2">{activeInvoice.invoiceNumber}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">Date: {new Date(activeInvoice.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-b text-xs">
                      <div>
                        <p className="font-bold text-slate-500 uppercase text-[10px]">Billed To (Customer):</p>
                        <p className="font-bold text-slate-900 text-sm">{activeInvoice.customerName}</p>
                        <p className="text-slate-600">Phone: {activeInvoice.customerPhone || 'Walk-In'}</p>
                        <p className="text-slate-600">Place of Supply: Tamil Nadu (33)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-500 uppercase text-[10px]">Payment Details:</p>
                        <p className="font-bold text-slate-900">Payment Mode: {activeInvoice.paymentMode}</p>
                        <p className="text-slate-600">Status: Fully Paid</p>
                        <p className="text-slate-600">Cashier: OWNER ADMIN</p>
                      </div>
                    </div>

                    <div className="py-3">
                      <table className="w-full text-left text-xs border border-slate-200">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b text-[11px]">
                          <tr>
                            <th className="p-2">#</th>
                            <th className="p-2">Product Name</th>
                            <th className="p-2">HSN</th>
                            <th className="p-2 text-center">Qty</th>
                            <th className="p-2 text-right">Rate</th>
                            <th className="p-2 text-right">Taxable</th>
                            <th className="p-2 text-right">GST 18%</th>
                            <th className="p-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {activeInvoice.items ? (
                            activeInvoice.items.map((i, idx) => (
                              <tr key={idx}>
                                <td className="p-2 font-mono">{idx + 1}</td>
                                <td className="p-2 font-medium">
                                  {i.name} <span className="text-slate-500 font-normal">({i.tamilName})</span>
                                </td>
                                <td className="p-2 font-mono text-slate-500">{i.hsn}</td>
                                <td className="p-2 text-center font-mono">{i.quantity}</td>
                                <td className="p-2 text-right font-mono">₹{i.price.toFixed(2)}</td>
                                <td className="p-2 text-right font-mono">₹{i.total.toFixed(2)}</td>
                                <td className="p-2 text-right font-mono text-slate-500">₹{(i.total * 0.18).toFixed(2)}</td>
                                <td className="p-2 text-right font-mono font-bold text-slate-900">₹{(i.total * 1.18).toFixed(2)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="p-2 font-mono">1</td>
                              <td className="p-2">Sivakasi Festival Crackers Package</td>
                              <td className="p-2 font-mono">3604</td>
                              <td className="p-2 text-center font-mono">{activeInvoice.itemsCount}</td>
                              <td className="p-2 text-right font-mono">₹{activeInvoice.subtotal?.toFixed(2)}</td>
                              <td className="p-2 text-right font-mono">₹{activeInvoice.subtotal?.toFixed(2)}</td>
                              <td className="p-2 text-right font-mono text-slate-500">₹{(activeInvoice.subtotal * 0.18).toFixed(2)}</td>
                              <td className="p-2 text-right font-mono font-bold text-slate-900">₹{activeInvoice.grandTotal.toFixed(2)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-start pt-2 border-t text-xs">
                      <div className="text-slate-500 text-[11px] max-w-xs">
                        <p className="font-bold text-slate-700">Terms & Conditions:</p>
                        <p>1. Highly inflammable fireworks. Store in a dry place.</p>
                        <p>2. Keep out of reach of children under 10 years without guidance.</p>
                        <p>3. Sivakasi jurisdiction applies for any disputes.</p>
                      </div>

                      <div className="w-56 space-y-1 text-right text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Taxable Amount:</span>
                          <span className="font-mono font-bold">₹{activeInvoice.taxableAmount?.toFixed(2) || activeInvoice.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>CGST (9%):</span>
                          <span className="font-mono">₹{(activeInvoice.cgst || (activeInvoice.grandTotal * 0.082)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>SGST (9%):</span>
                          <span className="font-mono">₹{(activeInvoice.sgst || (activeInvoice.grandTotal * 0.082)).toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between font-black text-sm text-slate-900">
                          <span>Invoice Total:</span>
                          <span className="font-poppins">₹{activeInvoice.grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Close Preview
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Printer size={14} />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => setActiveInvoice(null)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    <span>Next Customer Sale</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
