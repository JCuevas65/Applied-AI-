/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Leaf, RefreshCcw, Package, ArrowRight, ShoppingBag, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Lab Edition', price: 349, image: 'https://images.unsplash.com/photo-1546435770-a3e426da4717?q=80&w=800&auto=format&fit=crop', color: 'Studio Silver' },
  { id: '2', name: 'Alloy Pro', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', color: 'Raw Titanium' },
  { id: '3', name: 'Phantom Black', price: 319, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop', color: 'Obsidian' },
  { id: '4', name: 'Eco Core', price: 279, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop', color: 'Veridian' },
  { id: '5', name: 'Stealth', price: 329, image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=800&auto=format&fit=crop', color: 'Carbon Grey' },
  { id: '6', name: 'Origin', price: 249, image: 'https://images.unsplash.com/photo-1572536147138-0487332fc37d?q=80&w=800&auto=format&fit=crop', color: 'Bone White' },
  { id: '7', name: 'Champagne Gold', price: 399, image: 'https://images.unsplash.com/photo-1520170350707-b2da59970118?q=80&w=800&auto=format&fit=crop', color: '24K Finish' },
];

type PageID = 'home' | 'shop' | 'story' | 'checkout';

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePage, setActivePage] = useState<PageID>('home');
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const showPage = (id: PageID) => {
    if (id === 'checkout' && !isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setActivePage(id);
    setIsCartOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    if (activePage === 'home' || activePage === 'shop' || activePage === 'story') {
      showPage('checkout');
    }
  };

  const handleGoogleLogin = () => {
    console.log('Initiating Google OAuth Flow...');
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    showPage('checkout');
  };

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === 'PRO20') {
      setDiscountPercent(20);
      setPromoError('');
    } else {
      setPromoError('INVALID CODE');
      setDiscountPercent(0);
    }
  };

  const addToBag = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const cartTotal = subtotal - discountAmount;

  const handleCheckout = () => {
    const finalAmount = cartTotal;
    // Redirect to PayPal.me with the final amount
    window.location.href = `https://www.paypal.me/continuumpro/${finalAmount}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">
          <button 
            onClick={() => showPage('home')}
            className="font-display text-2xl font-black tracking-tighter hover:opacity-70 transition-opacity"
          >
            CONTINUUM <span className="font-light text-black/40">PRO</span>
          </button>
          
          <div className="hidden space-x-10 text-[10px] font-bold tracking-[0.2em] uppercase md:flex">
            <button onClick={() => showPage('home')} className={`transition-opacity ${activePage === 'home' ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-40 hover:opacity-60'}`}>Home</button>
            <button onClick={() => showPage('shop')} className={`transition-opacity ${activePage === 'shop' ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-40 hover:opacity-60'}`}>Shop</button>
            <button onClick={() => showPage('story')} className={`transition-opacity ${activePage === 'story' ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-40 hover:opacity-60'}`}>Story</button>
            <button onClick={() => showPage('checkout')} className={`transition-opacity ${activePage === 'checkout' ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-40 hover:opacity-60'}`}>Checkout</button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
            {isLoggedIn ? (
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="hidden sm:flex items-center gap-2 rounded-full border border-black/10 px-6 py-2 text-[10px] font-bold tracking-widest text-black transition-transform hover:scale-105 active:scale-95 uppercase"
              >
                LOG OUT
              </button>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden sm:block rounded-full bg-black px-6 py-2 text-[10px] font-bold tracking-widest text-white transition-transform hover:scale-105 active:scale-95 uppercase"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-3xl font-black tracking-tighter italic">YOUR BAG</h2>
                  <button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 hover:bg-black/5 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
                      <ShoppingBag size={48} className="mb-4" strokeWidth={1} />
                      <p className="font-medium uppercase tracking-widest text-xs">Your bag is empty</p>
                    </div>
                  ) : (
                    cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-4 group">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                            <button onClick={() => removeFromCart(index)} className="text-black/30 hover:text-black transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">{item.color}</p>
                          <p className="mt-2 font-bold">${item.price}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-black/5 pt-8 mt-4">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-black">Subtotal</span>
                    <span className="text-3xl font-black tracking-tighter">${cartTotal}</span>
                  </div>
                  <button className="w-full rounded-full bg-black py-5 text-[10px] font-bold tracking-widest text-white uppercase transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:pointer-events-none" disabled={cart.length === 0}>
                    Checkout Now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[110] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-12 rounded-[2rem] shadow-2xl"
            >
              <div className="text-center mb-10">
                <h2 className="font-display text-4xl font-black italic tracking-tighter uppercase mb-2">Welcome Back</h2>
                <p className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">Eternity Awaits</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-4 rounded-full border border-black/10 py-4 font-bold text-sm transition-all hover:bg-black/5 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-black/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">or email</span>
                  <div className="flex-grow border-t border-black/5"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS"
                    required
                    className="w-full rounded-full bg-gray-50 border-none px-8 py-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black/5 transition-all"
                  />
                  <input 
                    type="password" 
                    placeholder="PASSWORD"
                    required
                    className="w-full rounded-full bg-gray-50 border-none px-8 py-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black/5 transition-all"
                  />
                  <button className="w-full rounded-full bg-black py-5 text-[10px] font-bold text-white uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-95">
                    Continue
                  </button>
                </form>
              </div>

              <p className="mt-8 text-center text-[10px] font-bold text-black/20 uppercase tracking-widest">
                New to Continuum? <button className="text-black hover:opacity-50 underline decoration-black/10">Create Account</button>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pt-24 lg:pt-0">
        <AnimatePresence mode="wait">
          {/* HOME PAGE */}
          {activePage === 'home' && (
            <motion.section 
              key="home"
              id="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="page relative h-screen min-h-[700px] w-full overflow-hidden flex items-center"
            >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2000&auto=format&fit=crop" 
            alt="Celeb wearing Continuum Pro"
            className="h-full w-full object-cover brightness-[0.9]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12 text-black">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <h1 className="font-display text-7xl font-black leading-[0.85] tracking-tighter sm:text-8xl md:text-9xl lg:text-[12rem]">
              STAY<br />ETERNAL
            </h1>
            <p className="mt-8 max-w-xl text-xl font-light leading-relaxed tracking-tight text-black/70 md:text-2xl">
              Engineered for the infinite. The world's first modular titanium audio experience.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 rounded-full border-2 border-black bg-black px-10 py-5 text-lg font-bold text-white transition-all hover:bg-transparent hover:text-black"
              >
                Buy Now
              </button>
              <button className="flex items-center gap-2 rounded-full border-2 border-black px-10 py-5 text-lg font-bold text-black transition-all hover:bg-black hover:text-white">
                Learn More <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    )}

          {/* SHOP PAGE */}
          {activePage === 'shop' && (
            <motion.section 
              key="shop"
              id="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="page min-h-screen bg-[#f5f5f7] py-32 lg:py-48"
            >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-24 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-5xl font-black tracking-tighter sm:text-7xl italic uppercase">The Edits</h2>
              <p className="text-xl font-light text-black/40 mt-2">Aerospace-grade titanium. Master-tuned acoustics.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col bg-white p-6 rounded-3xl transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)]"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute right-4 top-4">
                    <button 
                      onClick={() => addToBag(product)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">{product.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30 mt-1">{product.color}</p>
                    </div>
                    <p className="text-2xl font-black tracking-tighter">${product.price}</p>
                  </div>
                  
                  <button 
                    id={`add-to-bag-${product.id}`}
                    onClick={() => {
                      addToBag(product);
                      setIsCartOpen(true);
                    }}
                    className="mt-8 w-full rounded-full border border-black/10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white hover:border-black"
                  >
                    Add to Bag
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* Call to Action Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex flex-col bg-black p-8 rounded-3xl text-white justify-center overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="font-display text-4xl font-black tracking-tighter italic uppercase">Personal<br />Edition</h3>
                <p className="mt-4 text-sm font-light text-white/60 leading-relaxed uppercase tracking-widest">Custom laser engraving and material configurations available.</p>
                <button className="mt-12 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:gap-4 transition-all group-hover:text-white/80">
                  Inquire Now <ArrowRight size={16} />
                </button>
              </div>
              <div className="absolute right-[-20%] bottom-[-10%] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                <div className="h-64 w-64 rounded-full border-[1px] border-white group-hover:scale-110 transition-transform duration-1000" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    )}

          {/* STORY PAGE */}
          {activePage === 'story' && (
            <motion.section 
              key="story"
              id="story"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="page min-h-screen bg-white py-32 lg:py-48"
            >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                alt="Philosophy of Materials"
                className="h-full w-full object-cover mix-blend-multiply transition-transform duration-1000 hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
            </motion.div>

            <div className="space-y-12 text-black">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-5xl font-black tracking-tighter sm:text-6xl uppercase leading-tight">
                  Designed to<br />last forever.
                </h2>
                <div className="mt-6 h-1 w-24 bg-black"></div>
              </motion.div>

              <div className="grid gap-10">
                {[
                  { icon: <RefreshCcw size={24} />, title: "Full Modularity", desc: "No more planned obsolescence. Swap drivers, batteries, and shells in seconds." },
                  { icon: <Package size={24} />, title: "Zero E-Waste", desc: "Our circular loop ensures that every part is recycled or repurposed, leaving no footprint." },
                  { icon: <Leaf size={24} />, title: "Grade-5 Titanium", desc: "Indestructible, lightweight, and aerospace-grade. Materially superior and infinitely repairable." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    className="flex gap-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">{item.title}</h3>
                      <p className="mt-2 text-lg font-light leading-relaxed text-black/60">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
            </motion.section>
          )}

          {/* CHECKOUT PAGE */}
          {activePage === 'checkout' && (
            <motion.section 
              key="checkout"
              id="checkout"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="page min-h-screen bg-white py-32 lg:py-48"
            >
              <div className="mx-auto max-w-3xl px-6">
                <div className="mb-16 text-center">
                  <h2 className="font-display text-5xl font-black tracking-tighter italic uppercase">Checkout</h2>
                  <p className="mt-4 text-black/40 font-bold uppercase tracking-widest text-[10px]">{cart.length} items in your bag</p>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-black/5 rounded-3xl">
                    <p className="text-black/40 font-bold uppercase tracking-widest text-xs">Your bag is empty</p>
                    <button 
                      onClick={() => showPage('shop')}
                      className="mt-8 rounded-full bg-black px-8 py-3 text-[10px] font-bold text-white uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Back to Shop
                    </button>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="space-y-6">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-black/5 pb-6">
                          <div className="flex gap-6">
                            <div className="h-20 w-20 bg-gray-100 rounded-xl overflow-hidden">
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex flex-col justify-center">
                              <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">{item.color}</p>
                            </div>
                          </div>
                          <p className="font-black text-lg tracking-tighter">${item.price}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#f5f5f7] p-10 rounded-3xl">
                      <div className="mb-8">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 block mb-3">Promo Code</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="ENTER CODE"
                            className="flex-1 bg-white border border-black/5 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black/20"
                          />
                          <button 
                            onClick={handleApplyPromo}
                            className="rounded-full bg-black px-6 py-3 text-[10px] font-bold text-white uppercase tracking-widest hover:scale-105 transition-transform"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && <p className="mt-2 text-[10px] font-bold text-red-500 tracking-widest italic">{promoError}</p>}
                        {discountPercent > 0 && <p className="mt-2 text-[10px] font-bold text-emerald-500 tracking-widest italic">PROMO APPLIED: {discountPercent}% OFF</p>}
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm opacity-50 font-bold uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span>${subtotal}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-emerald-600">
                            <span>Discount ({discountPercent}%)</span>
                            <span>-${discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm opacity-50 font-bold uppercase tracking-widest">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-black/5">
                          <span className="text-xl font-black italic tracking-tighter uppercase">Total</span>
                          <span className="text-3xl font-black tracking-tighter">${cartTotal}</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full rounded-full bg-black py-6 text-xs font-bold text-white uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-transform"
                      >
                        Confirm & Pay with PayPal
                      </button>
                      <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-black/20">
                        Secure SSL Encryption • 1:1 Engineering Support
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <footer className="border-t border-black/5 bg-white py-24 px-6 text-black">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <div className="font-display text-4xl font-black tracking-tighter italic">
                CONTINUUM PRO
              </div>
              <p className="max-w-xs text-black/50 font-medium leading-relaxed">
                Premium audio engineered for longevity. We believe the best product for the planet is the one you never have to replace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16 md:gap-32">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/30">Shop</h4>
                <div className="flex flex-col gap-2 font-bold text-sm">
                  <a href="#" className="hover:opacity-40 transition-opacity">All Earbuds</a>
                  <a href="#" className="hover:opacity-40 transition-opacity">Replacement Parts</a>
                  <a href="#" className="hover:opacity-40 transition-opacity">Accessories</a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/30">Support</h4>
                <div className="flex flex-col gap-2 font-bold text-sm">
                  <a href="#" className="hover:opacity-40 transition-opacity">Repair Guide</a>
                  <a href="#" className="hover:opacity-40 transition-opacity">Recycling</a>
                  <a href="#" className="hover:opacity-40 transition-opacity">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-black/30 font-bold tracking-[0.2em] uppercase">
              © 2026 Continuum Pro Audio. Built for Eternity.
            </p>
            <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-black/30">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

