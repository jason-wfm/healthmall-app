import React from 'react';
import { Trash2, ShoppingBag, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartTabProps {
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onToggleSelect: (cartId: string) => void;
  onToggleSelectAll: () => void;
  onRemoveItem: (cartId: string) => void;
  onProceedToCheckout: () => void;
  onGoShopping: () => void;
}

export const CartTab: React.FC<CartTabProps> = ({
  cart,
  onUpdateQuantity,
  onToggleSelect,
  onToggleSelectAll,
  onRemoveItem,
  onProceedToCheckout,
  onGoShopping
}) => {
  const selectedItems = cart.filter(item => item.selected);
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 99;
  const difference = freeShippingThreshold - subtotal;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] bg-slate-50 overflow-hidden pb-16">
      {/* Top Free Shipping Notice */}
      <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>
            {isFreeShipping
              ? '全单已达标：享顺丰温控冷链免费配送'
              : `全单满¥${freeShippingThreshold}免顺丰运费，还差 ¥${difference.toFixed(2)}`}
          </span>
        </div>
        {!isFreeShipping && (
          <button
            onClick={onGoShopping}
            className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center"
          >
            去凑单 &gt;
          </button>
        )}
      </div>

      {/* Cart Content */}
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="text-sm font-semibold text-slate-700">购物车空空如也</div>
          <p className="text-xs text-slate-400 max-w-xs">
            快去健康商城选购正品保健品、医疗监测器械或体检套餐吧
          </p>
          <button
            onClick={onGoShopping}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors shadow-2xs"
          >
            去商城选购
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-2.5"
            >
              {/* Checkbox */}
              <button
                onClick={() => onToggleSelect(item.id)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                  item.selected
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                aria-label="选择商品"
              >
                {item.selected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>

              {/* Product Thumbnail */}
              <img
                src={item.product.image}
                alt={item.product.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
              />

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                    aria-label="删除商品"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md inline-block mt-1">
                  {item.selectedSpec}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs font-bold text-emerald-700 tabular-nums">
                    ¥{item.product.price}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-medium"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-medium tabular-nums text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Fixed Checkout Bar */}
      {cart.length > 0 && (
        <div className="p-3 bg-white border-t border-slate-200/80 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSelectAll}
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                isAllSelected
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
            <span className="text-xs text-slate-600">全选 ({cart.length})</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">
                不含运费 · 已选 {selectedItems.length} 件
              </div>
              <div className="text-sm font-bold text-emerald-700 tabular-nums">
                <span className="text-xs mr-0.5">合计 ¥</span>
                {subtotal.toFixed(2)}
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              disabled={selectedItems.length === 0}
              className="py-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <span>去结算</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
