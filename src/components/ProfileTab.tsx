import React, { useState } from 'react';
import { 
  User, ShieldCheck, Heart, Award, FileText, MapPin, 
  CreditCard, ChevronRight, Package, Truck, CheckCircle2, 
  Clock, AlertCircle, PhoneCall
} from 'lucide-react';
import { Order, HealthRecord, Coupon, ShippingAddress } from '../types';

interface ProfileTabProps {
  orders: Order[];
  healthRecord: HealthRecord;
  coupons: Coupon[];
  defaultAddress: ShippingAddress;
  onUpdateHealthRecord: (record: HealthRecord) => void;
  onNavigateToCategory: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  orders,
  healthRecord,
  coupons,
  defaultAddress,
  onUpdateHealthRecord,
  onNavigateToCategory,
}) => {
  const [selectedOrderFilter, setSelectedOrderFilter] = useState<string>('all');
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'main' | 'orders' | 'coupons'>('main');

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (selectedOrderFilter === 'all') return true;
    return order.status === selectedOrderFilter;
  });

  return (
    <div className="space-y-4 pb-20 bg-slate-50 min-h-screen">
      {/* User Header Profile Card */}
      <div className="bg-linear-to-b from-emerald-800 to-emerald-700 text-white p-4 pt-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white overflow-hidden shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold">{healthRecord.name}</h1>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Award className="w-3 h-3" />
                黄金健康会员 V2
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5 font-mono">
              健康卡号：6214 **** 8820
            </p>
          </div>

          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs border border-white/30 backdrop-blur-xs transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-200" />
            <span>健康档案</span>
          </button>
        </div>

        {/* Health Metrics Quick Glimpse */}
        <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="text-emerald-200 text-[10px]">健康积分</div>
            <div className="font-bold text-sm mt-0.5 tabular-nums">1,280</div>
          </div>
          <div>
            <div className="text-emerald-200 text-[10px]">优惠券</div>
            <div className="font-bold text-sm mt-0.5 tabular-nums">{coupons.length} 张</div>
          </div>
          <div>
            <div className="text-emerald-200 text-[10px]">近期血压</div>
            <div className="font-bold text-sm mt-0.5 tabular-nums">
              {healthRecord.bloodPressure.systolic}/{healthRecord.bloodPressure.diastolic}
            </div>
          </div>
          <div>
            <div className="text-emerald-200 text-[10px]">BMI指数</div>
            <div className="font-bold text-sm mt-0.5 tabular-nums">{healthRecord.bmi} 正常</div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">我的商城订单</span>
            <button
              onClick={() => {
                setActiveSubView('orders');
                setSelectedOrderFilter('all');
              }}
              className="text-[11px] text-slate-400 hover:text-emerald-700 flex items-center"
            >
              全部订单 ({orders.length}) <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 text-center">
            {[
              { id: 'shipping', label: '待发货', icon: Package, count: 0 },
              { id: 'delivering', label: '待收货', icon: Truck, count: orders.filter(o => o.status === 'delivering').length },
              { id: 'completed', label: '已完成', icon: CheckCircle2, count: orders.filter(o => o.status === 'completed').length },
              { id: 'unpaid', label: '待付款', icon: Clock, count: orders.filter(o => o.status === 'unpaid').length },
            ].map((status) => {
              const IconComp = status.icon;
              return (
                <button
                  key={status.id}
                  onClick={() => {
                    setActiveSubView('orders');
                    setSelectedOrderFilter(status.id);
                  }}
                  className="flex flex-col items-center justify-center relative group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 group-hover:bg-emerald-50 transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                  {status.count > 0 && (
                    <span className="absolute top-0 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {status.count}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-600 mt-1 font-medium">{status.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders List View (if clicked) */}
      {activeSubView === 'orders' && (
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-800">订单列表</span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({filteredOrders.length}笔)
              </span>
            </div>
            <button
              onClick={() => setActiveSubView('main')}
              className="text-[11px] text-emerald-700 hover:underline"
            >
              收起列表
            </button>
          </div>

          <div className="space-y-2.5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100">
                  <span className="text-slate-400 font-mono">{order.orderNo}</span>
                  <span
                    className={`font-semibold ${
                      order.status === 'delivering'
                        ? 'text-sky-600'
                        : order.status === 'completed'
                        ? 'text-emerald-700'
                        : 'text-amber-600'
                    }`}
                  >
                    {order.status === 'delivering'
                      ? '运输中 · 顺丰速运'
                      : order.status === 'completed'
                      ? '已签收'
                      : '处理中'}
                  </span>
                </div>

                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-slate-400">规格：{item.spec}</div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="font-bold text-slate-900">¥{item.price}</span>
                        <span className="text-slate-400">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {order.trackingNo && (
                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="truncate">物流单号：{order.trackingNo}</span>
                    <span className="text-emerald-700 font-medium shrink-0">实时温控追踪</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{order.createdAt}</span>
                  <div className="font-bold text-slate-900">
                    实付：<span className="text-emerald-700">¥{order.actualAmount}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="bg-white p-6 rounded-xl text-center text-xs text-slate-400">
                暂无相关状态订单
              </div>
            )}
          </div>
        </div>
      )}

      {/* Health Services Grid */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-slate-800">健康专享权益</div>
          <div className="divide-y divide-slate-100">
            <button
              onClick={() => setIsHealthModalOpen(true)}
              className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700 hover:text-emerald-700"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>电子健康档案 (指标与过敏史)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveSubView('coupons')}
              className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700 hover:text-emerald-700"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>健康优惠券中心</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>{coupons.length} 张可用</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>

            <div className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>默认收货地址</span>
              </div>
              <span className="text-[11px] text-slate-400 max-w-[50%] truncate">
                {defaultAddress.city} {defaultAddress.detail}
              </span>
            </div>

            <div className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>正品溯源验真通道</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                一物一码保真
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons View */}
      {activeSubView === 'coupons' && (
        <div className="px-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">我的健康优惠券</span>
            <button
              onClick={() => setActiveSubView('main')}
              className="text-[11px] text-emerald-700 hover:underline"
            >
              返回
            </button>
          </div>
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl p-3 border border-emerald-200/80 shadow-2xs flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">{c.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{c.description}</div>
                <div className="text-[10px] text-emerald-700 mt-1">有效期至 {c.validUntil}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-rose-600">¥{c.amount}</div>
                <button
                  onClick={onNavigateToCategory}
                  className="mt-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] rounded-lg"
                >
                  去使用
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Service Notice */}
      <div className="px-4">
        <div className="bg-slate-100 rounded-xl p-3 text-center text-xs text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-medium text-slate-700">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>24小时健康客服与药师热线：400-880-9999</span>
          </div>
          <p className="text-[10px] text-slate-400">
            国家药品监督管理局备案合作电商平台 · 执业药师全流程审方
          </p>
        </div>
      </div>

      {/* Health Record Modal */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-4 shadow-xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>个人健康档案 (云端加密)</span>
              </div>
              <button
                onClick={() => setIsHealthModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-400">姓名/性别：</span>
                  <span className="font-semibold text-slate-800">
                    {healthRecord.name} ({healthRecord.gender})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">年龄：</span>
                  <span className="font-semibold text-slate-800">{healthRecord.age} 岁</span>
                </div>
                <div>
                  <span className="text-slate-400">身高/体重：</span>
                  <span className="font-semibold text-slate-800">
                    {healthRecord.height}cm / {healthRecord.weight}kg
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">体质指数(BMI)：</span>
                  <span className="font-semibold text-emerald-700">{healthRecord.bmi} (标准)</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1">慢性病史与家族史</div>
                <div className="flex flex-wrap gap-1.5">
                  {healthRecord.chronicConditions.map((c, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1">药物/食物过敏史</div>
                <div className="flex flex-wrap gap-1.5">
                  {healthRecord.allergies.map((a, i) => (
                    <span
                      key={i}
                      className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <div className="font-bold text-emerald-900 mb-1">药师健康建议</div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  BMI指数处于健康理想区间。鉴于您有高血压家族史，建议每周定期监测2-3次静息血压，减少高钠重盐摄入，可适当补充优质深海Omega-3与辅酶Q10。
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsHealthModalOpen(false)}
              className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-medium hover:bg-emerald-800"
            >
              确认并关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
