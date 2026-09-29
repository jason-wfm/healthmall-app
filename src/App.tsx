import React, { useState, useEffect } from 'react';
import { 
  Home, Grid, Stethoscope, ShoppingBag, User, 
  Smartphone, Monitor, ShieldCheck, Heart, Sparkles, Check, CheckCircle2
} from 'lucide-react';
import { 
  INITIAL_PRODUCTS, INITIAL_COUPONS, MOCK_USER_HEALTH, 
  INITIAL_ORDERS, INITIAL_ADDRESS 
} from './data/mockData';
import { Product, CartItem, Order, Coupon, HealthRecord, ShippingAddress } from './types';
import { HomeTab } from './components/HomeTab';
import { CategoryTab } from './components/CategoryTab';
import { ConsultationTab } from './components/ConsultationTab';
import { CartTab } from './components/CartTab';
import { ProfileTab } from './components/ProfileTab';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';

export default function App() {
  // View mode: 'mobile' (WeChat mini-program mock frame) or 'desktop' (full width web)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'home' | 'category' | 'consultation' | 'cart' | 'profile'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Data states
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart_init_1',
      productId: INITIAL_PRODUCTS[0].id,
      product: INITIAL_PRODUCTS[0],
      selectedSpec: INITIAL_PRODUCTS[0].specs[0],
      quantity: 1,
      selected: true
    }
  ]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [healthRecord, setHealthRecord] = useState<HealthRecord>(MOCK_USER_HEALTH);
  const [defaultAddress] = useState<ShippingAddress>(INITIAL_ADDRESS);

  // Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<{ product: Product; spec: string; quantity: number }[] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showGlobalToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // Cart operations
  const handleAddToCart = (product: Product, spec?: string, quantity: number = 1) => {
    const targetSpec = spec || product.specs[0] || '标准版';
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.selectedSpec === targetSpec);
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          product,
          selectedSpec: targetSpec,
          quantity,
          selected: true
        }
      ];
    });
    showGlobalToast(`已将 ${product.name.slice(0, 10)}... 加入购物车`);
  };

  const handleBuyNow = (product: Product, spec: string, quantity: number) => {
    setSelectedProductForDetail(null);
    setCheckoutItems([
      { product, spec, quantity }
    ]);
  };

  const handleUpdateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(cartId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartId ? { ...item, quantity } : item));
  };

  const handleToggleSelectCart = (cartId: string) => {
    setCart(prev => prev.map(item => item.id === cartId ? { ...item, selected: !item.selected } : item));
  };

  const handleToggleSelectAllCart = () => {
    const allSelected = cart.every(i => i.selected);
    setCart(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
  };

  const handleProceedToCheckoutFromCart = () => {
    const selected = cart.filter(item => item.selected);
    if (selected.length === 0) return;
    setCheckoutItems(
      selected.map(s => ({
        product: s.product,
        spec: s.selectedSpec,
        quantity: s.quantity
      }))
    );
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // remove checked out items from cart
    setCart(prev => prev.filter(item => !item.selected));
  };

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // TabBar Items configuration
  const tabItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'category', label: '分类', icon: Grid },
    { id: 'consultation', label: '药师问诊', icon: Stethoscope },
    { id: 'cart', label: '购物车', icon: ShoppingBag, badge: cartTotalItemsCount },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F1] text-slate-800 flex flex-col items-center">
      {/* Global Toast */}
      {toastMsg && (
        <div className="fixed top-5 z-70 bg-slate-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Universal Mode Switcher & Assurance Bar */}
      <header className="w-full bg-white border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        {/* Zone 1: Single element brand wordmark */}
        <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-black">
            健
          </span>
          <span>健康商城</span>
        </a>

        {/* Center: Device Viewport Mode Toggler */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>小程序模式</span>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>宽屏视图</span>
          </button>
        </div>

        {/* Zone 3: Quality Marker */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>国家药监备案 · 蓝帽子保真</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center py-0 sm:py-6 px-0 sm:px-4">
        {viewMode === 'mobile' ? (
          /* ========================================================= */
          /* 📱 WeChat Mini-Program Mobile Phone Frame Simulation       */
          /* ========================================================= */
          <div className="w-full sm:max-w-[410px] bg-white sm:rounded-[36px] shadow-2xl border-0 sm:border-[8px] sm:border-slate-800 flex flex-col h-[100vh] sm:h-[844px] overflow-hidden relative">
            {/* Mobile Top Status Bar & WeChat Capsule */}
            <div className="bg-white px-4 pt-2.5 pb-2 border-b border-slate-100 flex items-center justify-between text-xs select-none shrink-0 z-30">
              {/* iPhone Status Left (Time) */}
              <div className="font-semibold text-slate-800 text-[13px] tracking-tight">
                09:41
              </div>

              {/* Dynamic Island / Notch Representation (Subtle) */}
              <div className="w-16 h-3 bg-slate-900 rounded-full hidden sm:block opacity-90" />

              {/* WeChat Mini-Program Native Capsule Button (胶囊按钮: ••• 和 ⨀) */}
              <div className="flex items-center border border-slate-200/90 rounded-full px-2 py-0.5 bg-slate-50/90 gap-2 shadow-2xs">
                <button
                  onClick={() => showGlobalToast('已打开小程序选项菜单')}
                  className="flex items-center gap-0.5 text-slate-600 hover:text-slate-900"
                  aria-label="小程序更多选项"
                >
                  <span className="w-1 h-1 bg-current rounded-full" />
                  <span className="w-1 h-1 bg-current rounded-full" />
                  <span className="w-1 h-1 bg-current rounded-full" />
                </button>
                <span className="h-3 w-[1px] bg-slate-300" />
                <button
                  onClick={() => showGlobalToast('模拟返回微信或最小化小程序')}
                  className="w-2.5 h-2.5 rounded-full border border-slate-700 flex items-center justify-center text-[7px] text-slate-700"
                  aria-label="关闭小程序"
                >
                  ●
                </button>
              </div>
            </div>

            {/* Scrollable Mini-Program Content Screen */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#F6F8F7]">
              {activeTab === 'home' && (
                <HomeTab
                  products={products}
                  onSelectProduct={setSelectedProductForDetail}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onNavigateToCategory={(catId) => {
                    setSelectedCategoryId(catId);
                    setActiveTab('category');
                  }}
                  onNavigateToConsultation={() => setActiveTab('consultation')}
                />
              )}

              {activeTab === 'category' && (
                <CategoryTab
                  products={products}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  onSelectProduct={setSelectedProductForDetail}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              )}

              {activeTab === 'consultation' && (
                <ConsultationTab
                  products={products}
                  onSelectProduct={setSelectedProductForDetail}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              )}

              {activeTab === 'cart' && (
                <CartTab
                  cart={cart}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onToggleSelect={handleToggleSelectCart}
                  onToggleSelectAll={handleToggleSelectAllCart}
                  onRemoveItem={handleRemoveCartItem}
                  onProceedToCheckout={handleProceedToCheckoutFromCart}
                  onGoShopping={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileTab
                  orders={orders}
                  healthRecord={healthRecord}
                  coupons={coupons}
                  defaultAddress={defaultAddress}
                  onUpdateHealthRecord={setHealthRecord}
                  onNavigateToCategory={() => setActiveTab('category')}
                />
              )}
            </div>

            {/* WeChat Mini-Program Bottom TabBar */}
            <nav className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around px-2 z-30">
              {tabItems.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className="flex flex-col items-center justify-center w-14 py-1 relative cursor-pointer"
                  >
                    <div className="relative">
                      <IconComp
                        className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-emerald-700 stroke-[2.2]' : 'text-slate-400'
                        }`}
                      />
                      {Boolean(tab.badge && tab.badge > 0) && (
                        <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-0.5 transition-colors ${
                        isActive ? 'text-emerald-800 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* ========================================================= */
          /* 💻 Full Width Desktop Storefront Experience (1440px max)  */
          /* ========================================================= */
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
            {/* Desktop Navigation Tabs */}
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-6">
                {tabItems.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {Boolean(tab.badge && tab.badge > 0) && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>用户：王健康 (138****6688)</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-semibold">健康积分: 1,280</span>
              </div>
            </div>

            {/* Desktop Tab Contents */}
            <div className="p-4 sm:p-6 bg-[#F6F8F7]">
              {activeTab === 'home' && (
                <HomeTab
                  products={products}
                  onSelectProduct={setSelectedProductForDetail}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onNavigateToCategory={(catId) => {
                    setSelectedCategoryId(catId);
                    setActiveTab('category');
                  }}
                  onNavigateToConsultation={() => setActiveTab('consultation')}
                />
              )}

              {activeTab === 'category' && (
                <CategoryTab
                  products={products}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  onSelectProduct={setSelectedProductForDetail}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              )}

              {activeTab === 'consultation' && (
                <ConsultationTab
                  products={products}
                  onSelectProduct={setSelectedProductForDetail}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              )}

              {activeTab === 'cart' && (
                <CartTab
                  cart={cart}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onToggleSelect={handleToggleSelectCart}
                  onToggleSelectAll={handleToggleSelectAllCart}
                  onRemoveItem={handleRemoveCartItem}
                  onProceedToCheckout={handleProceedToCheckoutFromCart}
                  onGoShopping={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileTab
                  orders={orders}
                  healthRecord={healthRecord}
                  coupons={coupons}
                  defaultAddress={defaultAddress}
                  onUpdateHealthRecord={setHealthRecord}
                  onNavigateToCategory={() => setActiveTab('category')}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Global Product Detail Modal */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onAddToCart={(p, spec, qty) => {
            handleAddToCart(p, spec, qty);
          }}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Global Checkout Modal */}
      {checkoutItems && (
        <CheckoutModal
          items={checkoutItems}
          defaultAddress={defaultAddress}
          availableCoupons={coupons}
          onClose={() => setCheckoutItems(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}
