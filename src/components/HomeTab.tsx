import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, ShieldCheck, Truck, Award, Sparkles, 
  Timer, ChevronRight, ShoppingBag, Heart, CheckCircle2,
  Pill, Activity, Stethoscope, Flame, HeartPulse
} from 'lucide-react';
import { Product } from '../types';
import { HERO_IMAGE } from '../data/mockData';

interface HomeTabProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, spec?: string) => void;
  onNavigateToCategory: (categoryId: string) => void;
  onNavigateToConsultation: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigateToCategory,
  onNavigateToConsultation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  
  // Flash deal countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick categories
  const quickNav = [
    { id: 'supplements', name: '营养保健', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'devices', name: '医疗器械', icon: Activity, color: 'text-sky-600 bg-sky-50' },
    { id: 'checkup', name: '体检筛查', icon: Stethoscope, color: 'text-teal-600 bg-teal-50' },
    { id: 'tcm', name: '中医滋补', icon: Flame, color: 'text-amber-600 bg-amber-50' },
    { id: 'chronic', name: '慢病关怀', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
    { id: 'consult', name: '药师问诊', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'coupons', name: '领券中心', icon: Sparkles, color: 'text-orange-600 bg-orange-50' },
    { id: 'points', name: '积分换好礼', icon: Award, color: 'text-purple-600 bg-purple-50' },
  ];

  // Filtering products
  const filterTabs = [
    { id: 'all', label: '全部精选' },
    { id: 'cardio', label: '心脑血管' },
    { id: 'immunity', label: '免疫提升' },
    { id: 'devices', label: '家用器械' },
    { id: 'sleep', label: '安神养生' },
  ];

  const filteredProducts = products.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    }
    if (activeFilterTab === 'cardio') {
      return item.subtitle.includes('心') || item.subtitle.includes('血压') || item.subtitle.includes('血脂');
    }
    if (activeFilterTab === 'immunity') {
      return item.category === 'supplements' || item.category === 'tcm';
    }
    if (activeFilterTab === 'devices') {
      return item.category === 'devices';
    }
    if (activeFilterTab === 'sleep') {
      return item.subtitle.includes('眠') || item.subtitle.includes('神') || item.category === 'tcm';
    }
    return true;
  });

  const flashDeals = products.filter(p => p.isFlashDeal);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Location and Search Bar */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2.5">
          <div className="flex items-center gap-1.5 truncate max-w-[75%] font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">配送至：北京市朝阳区 · 青年路7号院</span>
            <span className="text-slate-400 text-[10px]">⌄</span>
          </div>
          <button 
            onClick={onNavigateToConsultation}
            className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 hover:underline"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>执业药师在岗</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索深海鱼油、电子血压计、体检早筛、益生菌..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs pl-9 pr-8 py-2 rounded-xl border border-transparent focus:border-emerald-600 focus:outline-hidden transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Hot Search Tags */}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="text-slate-400">热搜:</span>
          {['辅酶Q10', '欧姆龙血压计', '深度防癌体检', '野生山参', '500亿益生菌'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="hover:text-emerald-700 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Campaign Hero Banner */}
      <div className="px-4">
        <div 
          onClick={() => onSelectProduct(products[3] || products[0])}
          className="relative rounded-2xl overflow-hidden aspect-16/7 sm:aspect-16/6 bg-slate-900 text-white cursor-pointer shadow-sm group"
        >
          <img
            src={HERO_IMAGE}
            alt="春季健康养生防敏季"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/85 via-emerald-950/60 to-transparent p-4 sm:p-6 flex flex-col justify-center">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-300">
              National Health Month · 春季养生季
            </span>
            <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white mt-1">
              蓝帽子正品 · 守护全家健康
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xs sm:max-w-md line-clamp-1">
              全国公立三甲体检 5 折起，辅酶与高纯鱼油满 300 减 50
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-sm">
                立即前往专区
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 King Kong Quick Navigation Icons (小程序金刚区) */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs">
          <div className="grid grid-cols-4 gap-y-3.5 gap-x-2">
            {quickNav.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'consult') {
                      onNavigateToConsultation();
                    } else if (item.id === 'coupons' || item.id === 'points') {
                      onNavigateToCategory('all');
                    } else {
                      onNavigateToCategory(item.id);
                    }
                  }}
                  className="flex flex-col items-center justify-center group cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${item.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 mt-1.5 group-hover:text-emerald-700">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quality Assurances Ribbon */}
      <div className="px-4">
        <div className="bg-emerald-50/70 border border-emerald-100/80 rounded-xl px-3 py-2 flex items-center justify-between text-[11px] text-emerald-900">
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>国家药监备案</span>
          </div>
          <span className="text-emerald-300">·</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>三甲药师审方</span>
          </div>
          <span className="text-emerald-300">·</span>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>顺丰温控冷链</span>
          </div>
          <span className="text-emerald-300">·</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>假一赔十保真</span>
          </div>
        </div>
      </div>

      {/* Daily Flash Deals Module (今日限时特惠秒杀) */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-slate-900 font-bold text-xs sm:text-sm">
                <Timer className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>健康限时秒杀</span>
              </div>
              {/* Countdown badge */}
              <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-white">
                <span className="bg-slate-900 px-1 py-0.5 rounded-xs">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-slate-800">:</span>
                <span className="bg-slate-900 px-1 py-0.5 rounded-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-slate-800">:</span>
                <span className="bg-rose-600 px-1 py-0.5 rounded-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <button 
              onClick={() => onNavigateToCategory('all')}
              className="text-[11px] text-slate-500 hover:text-emerald-700 flex items-center"
            >
              更多特惠 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Flash items horizontal scroll */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {flashDeals.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="group relative bg-slate-50 hover:bg-emerald-50/40 p-2.5 rounded-xl border border-slate-200/60 cursor-pointer transition-colors"
              >
                <div className="aspect-4/3 rounded-lg overflow-hidden bg-white mb-2 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                  {item.flashSoldPercent && (
                    <div className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-xs">
                      抢购中 {item.flashSoldPercent}%
                    </div>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-800 truncate">
                  {item.name}
                </div>

                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-xs font-bold text-rose-600 tabular-nums">
                    ¥{item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-[10px] text-slate-400 line-through tabular-nums">
                      ¥{item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: `${item.flashSoldPercent || 80}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Feed Filter Tabs */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilterTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-Column Product Grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col group"
            >
              {/* Product Image Click to Open PDP */}
              <div
                onClick={() => onSelectProduct(product)}
                className="aspect-4/3 bg-slate-100 relative overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                {product.tag && (
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-xs">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {product.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-700 tabular-nums">
                      <span className="text-[10px] mr-0.5">¥</span>
                      {product.price}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      销 {product.sales > 10000 ? `${(product.sales / 10000).toFixed(1)}万+` : product.sales}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    aria-label="快速加入购物车"
                    className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200/80">
            <p className="text-xs text-slate-400">未找到符合条件的健康商品</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilterTab('all'); }}
              className="mt-2 text-xs text-emerald-700 underline"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
