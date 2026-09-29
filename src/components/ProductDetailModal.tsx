import React, { useState } from 'react';
import { X, ShieldCheck, Heart, ShoppingBag, Truck, CheckCircle2, ChevronRight, Award, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, spec: string, quantity: number) => void;
  onBuyNow: (product: Product, spec: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) return null;

  const [selectedSpec, setSelectedSpec] = useState<string>(product.specs[0] || '默认规格');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'usage' | 'reviews'>('details');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSpec, quantity);
    showToast(`已成功加入购物车: ${product.name.slice(0, 10)}...`);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSpec, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white px-4 py-2.5 rounded-lg text-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Floating Close Button */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            aria-label="收藏商品"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={onClose}
            aria-label="关闭详情"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Main Product Image Container */}
          <div className="relative aspect-4/3 bg-slate-100 w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback pattern if image cannot be rendered */}
            <div className="absolute inset-0 -z-10 bg-linear-to-tr from-emerald-50 via-slate-100 to-teal-50 flex items-center justify-center">
              <span className="text-emerald-700 font-medium text-sm">{product.name}</span>
            </div>

            {/* Verification Watermark Tag */}
            {product.tag && (
              <div className="absolute bottom-3 left-3 bg-emerald-900/85 backdrop-blur-md text-emerald-100 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5 text-emerald-300" />
                <span>{product.tag}</span>
              </div>
            )}
          </div>

          {/* Pricing & Title Info */}
          <div className="p-4 sm:p-5 bg-white border-b border-slate-100">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-xs text-emerald-700 font-semibold">券后预估价</span>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
                <span className="text-base mr-0.5">¥</span>
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ¥{product.originalPrice}
                </span>
              )}
              <span className="ml-auto text-xs text-slate-500 tabular-nums">
                已热销 {product.sales > 10000 ? `${(product.sales / 10000).toFixed(1)}万+` : product.sales} 件
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Trust Assurances */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">国家药监正规备案</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">顺丰专递/温控冷链</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">执业药师审核把关</span>
              </div>
            </div>
          </div>

          {/* Specification Selector */}
          <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-2.5">
              选择规格：<span className="text-emerald-700 font-normal">{selectedSpec}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.specs.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedSpec === spec
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-medium shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
              <span className="text-xs font-semibold text-slate-700">购买数量</span>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-medium tabular-nums text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Product Tabs Navigation */}
          <div className="px-4 border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-6">
              {[
                { id: 'details', label: '图文详情' },
                { id: 'specs', label: '产品参数' },
                { id: 'usage', label: '服用与禁忌' },
                { id: 'reviews', label: `评价(${product.reviewsCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-3 text-xs font-medium relative transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="p-4 sm:p-5 text-xs text-slate-600 leading-relaxed min-h-[160px]">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
                  <h2 className="text-xs font-bold text-emerald-900 mb-2">产品核心功效</h2>
                  <p className="text-slate-700 leading-relaxed">{product.functionDesc}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-2">核心产品特点</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <div className="text-slate-500 mb-1">生产制造厂商</div>
                  <div className="text-slate-800 font-medium">{product.manufacturer}</div>
                  {product.approvalNo && (
                    <div className="mt-1.5 text-slate-500">
                      批准文号：<span className="font-mono text-slate-700">{product.approvalNo}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="divide-y divide-slate-100">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">商品名称</span>
                  <span className="text-slate-800 font-medium text-right max-w-[65%]">{product.name}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">批准文号/备案号</span>
                  <span className="font-mono text-emerald-700 font-medium">{product.approvalNo || '国药准字合规备案'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">所属品类</span>
                  <span className="text-slate-800">{product.categoryLabel}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">生产企业</span>
                  <span className="text-slate-800 text-right max-w-[65%]">{product.manufacturer}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">储藏条件</span>
                  <span className="text-slate-800">避光、密闭、置阴凉干燥处（不超过25℃）</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">保质期限</span>
                  <span className="text-slate-800">24个月（出厂日期保障6个月内）</span>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-3.5">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1">建议用法与用量</div>
                  <p className="text-slate-600 leading-relaxed">{product.usageMethod}</p>
                </div>

                {product.contraindications && (
                  <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>禁忌与注意事项</span>
                    </div>
                    <p className="text-amber-800/90 leading-relaxed">{product.contraindications}</p>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 leading-normal">
                  *
                  温馨提示：保健食品是食品，不能代替药物治疗疾病。若有正在服用的西药，请遵循执业药师或主治医生建议间隔服用。
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 tabular-nums">{product.rating}</span>
                    <span className="text-xs text-amber-500">★★★★★</span>
                    <span className="text-slate-400">好评率 99.4%</span>
                  </div>
                  <span className="text-xs text-emerald-700">全部带图评价 &gt;</span>
                </div>

                {/* Sample Verified Reviews */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">陈*华（北京）· 已认证健康会员</span>
                    <span className="text-slate-400">3天前</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    在药师指导下买来给父母吃的，包装很专业，有防伪扫码可以追溯到原产地，顺丰隔天就到了，吃了两周感觉很踏实。
                  </p>
                  <div className="text-[11px] text-emerald-700 font-medium">购买规格：{product.specs[0]}</div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">李*（上海）· 慢病调理用户</span>
                    <span className="text-slate-400">1周前</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    大品牌确实质量过硬，配料表很干净，没有乱七八糟的添加剂。价格比线下药店划算很多！
                  </p>
                  <div className="text-[11px] text-emerald-700 font-medium">购买规格：{product.specs[1] || product.specs[0]}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={() => showToast('已转接执业药师咨询通道')}
            className="flex flex-col items-center justify-center w-12 text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
            <span className="text-[10px]">问药师</span>
          </button>

          <div className="flex-1 grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="py-2.5 px-3 rounded-xl border border-emerald-600 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>加入购物车</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>立即购买</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
