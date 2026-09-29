import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, ChevronRight, ShieldCheck, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { Product, ShippingAddress, Coupon, Order } from '../types';

interface CheckoutItem {
  product: Product;
  spec: string;
  quantity: number;
}

interface CheckoutModalProps {
  items: CheckoutItem[];
  defaultAddress: ShippingAddress;
  availableCoupons: Coupon[];
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  defaultAddress,
  availableCoupons,
  onClose,
  onOrderSuccess
}) => {
  const [address, setAddress] = useState<ShippingAddress>(defaultAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editName, setEditName] = useState(address.name);
  const [editPhone, setEditPhone] = useState(address.phone);
  const [editDetail, setEditDetail] = useState(address.detail);

  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'medical_insurance'>('wechat');
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(availableCoupons[0]?.id || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  // Math calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = rawSubtotal >= 99 ? 0 : 12;

  const activeCoupon = availableCoupons.find(
    (c) => c.id === selectedCouponId && rawSubtotal >= c.minSpend
  );
  const discountAmount = activeCoupon ? activeCoupon.amount : 0;
  const finalTotal = Math.max(0, rawSubtotal + shippingFee - discountAmount);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress({
      ...address,
      name: editName,
      phone: editPhone,
      detail: editDetail
    });
    setIsEditingAddress(false);
  };

  const handleConfirmPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNo: `JK${Date.now()}`,
        items: items.map((item) => ({
          product: item.product,
          spec: item.spec,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: rawSubtotal,
        shippingFee,
        discountAmount,
        actualAmount: finalTotal,
        paymentMethod,
        status: 'shipping',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        address,
        trackingNo: `SF${Math.floor(10000000000 + Math.random() * 90000000000)}`
      };
      setIsProcessing(false);
      setOrderComplete(newOrder);
      onOrderSuccess(newOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">确认健康订单</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              顺丰温控冷链
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {orderComplete ? (
          /* Payment Success View */
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">支付成功 · 药师已接单</h2>
              <p className="text-xs text-slate-500 mt-1">
                订单号：<span className="font-mono text-slate-700">{orderComplete.orderNo}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">实付金额</span>
                <span className="font-bold text-emerald-700 text-sm">¥{orderComplete.actualAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">收货人</span>
                <span className="text-slate-700">{orderComplete.address.name} ({orderComplete.address.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">配送方式</span>
                <span className="text-slate-700">顺丰特快 (预计明日18:00前送达)</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-700 flex items-center justify-center gap-1.5 bg-emerald-50 py-2 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>正品防伪溯源码已同步至您的健康档案</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-medium text-xs hover:bg-emerald-800 transition-colors"
            >
              查看订单详情 / 返回商城
            </button>
          </div>
        ) : (
          /* Standard Checkout Form */
          <>
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5 bg-slate-50/60">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>收货地址</span>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    {isEditingAddress ? '取消修改' : '修改地址'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-2 mt-2 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="姓名"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="手机号"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        required
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="详细地址 (街道、门牌号)"
                      value={editDetail}
                      onChange={(e) => setEditDetail(e.target.value)}
                      required
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800"
                    >
                      保存地址
                    </button>
                  </form>
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {address.name}{' '}
                      <span className="font-normal text-slate-500 font-mono ml-2">
                        {address.phone}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {address.province} {address.city} {address.district} {address.detail}
                    </div>
                  </div>
                )}
              </div>

              {/* Items Summary */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="text-xs font-bold text-slate-800">商品清单 ({items.length}件)</div>
                <div className="divide-y divide-slate-100">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="py-2.5 flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-800 truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          规格：{item.spec}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-slate-900">
                            ¥{item.product.price}
                          </span>
                          <span className="text-[11px] text-slate-500">x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Picker */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>健康优惠券</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {availableCoupons.length} 张可用
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {availableCoupons.map((coupon) => {
                    const isApplicable = rawSubtotal >= coupon.minSpend;
                    const isSelected = selectedCouponId === coupon.id;
                    return (
                      <button
                        key={coupon.id}
                        disabled={!isApplicable}
                        onClick={() => setSelectedCouponId(isSelected ? null : coupon.id)}
                        className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                          !isApplicable
                            ? 'opacity-40 border-slate-100 bg-slate-50'
                            : isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-medium'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{coupon.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            满¥{coupon.minSpend}可用 · {coupon.validUntil}到期
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700">
                            -¥{coupon.amount}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="text-xs font-bold text-slate-800">选择支付方式</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wechat', label: '微信支付', sub: '推荐快速付' },
                    { id: 'alipay', label: '支付宝', sub: '快捷安全' },
                    { id: 'medical_insurance', label: '医保个账', sub: '支持器械耗材' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{method.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{method.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs text-xs space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>商品小计</span>
                  <span className="font-mono text-slate-800">¥{rawSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>运费 (满99免运费)</span>
                  <span className="font-mono text-slate-800">
                    {shippingFee === 0 ? '免运费' : `¥${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>优惠券减免</span>
                    <span className="font-mono font-medium">-¥{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                  <span>合计实付</span>
                  <span className="text-sm font-bold text-emerald-700">¥{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Fixed Checkout Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">实付款</div>
                <div className="text-lg font-bold text-emerald-700 tabular-nums">
                  <span className="text-xs mr-0.5">¥</span>
                  {finalTotal.toFixed(2)}
                </div>
              </div>
              <button
                onClick={handleConfirmPay}
                disabled={isProcessing}
                className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <span>安全支付中...</span>
                ) : (
                  <>
                    <span>立即支付</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
