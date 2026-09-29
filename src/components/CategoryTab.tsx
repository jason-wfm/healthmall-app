import React, { useState } from 'react';
import { ShoppingBag, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { Product, CategoryItem } from '../types';
import { CATEGORIES } from '../data/mockData';

interface CategoryTabProps {
  products: Product[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  products,
  selectedCategoryId,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'sales' | 'priceAsc' | 'priceDesc'>('default');

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategoryId) || CATEGORIES[0];

  // Filter products by category
  let categoryProducts = products.filter(p => {
    if (selectedCategoryId === 'all') return true;
    return p.category === selectedCategoryId;
  });

  // Sort products
  if (sortBy === 'sales') {
    categoryProducts = [...categoryProducts].sort((a, b) => b.sales - a.sales);
  } else if (sortBy === 'priceAsc') {
    categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceDesc') {
    categoryProducts = [...categoryProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[500px] bg-white overflow-hidden pb-16">
      {/* Left Sidebar Category List */}
      <div className="w-24 sm:w-28 bg-slate-50 border-r border-slate-100 overflow-y-auto no-scrollbar py-2">
        {CATEGORIES.map((category) => {
          const isActive = category.id === selectedCategoryId;
          return (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                setSelectedSubcategory('all');
              }}
              className={`w-full py-3.5 px-2 text-center text-xs font-medium relative transition-colors block ${
                isActive
                  ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-600 rounded-r" />
              )}
              <span className="truncate block">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right Product Listing Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Category Header & Subcategory filter */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold text-slate-900">{currentCategory.name}</h2>
              <p className="text-[10px] text-slate-400">{currentCategory.shortDesc}</p>
            </div>
            {/* Sorting Buttons */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <button
                onClick={() => setSortBy('default')}
                className={`px-2 py-0.5 rounded-md ${sortBy === 'default' ? 'text-emerald-700 font-bold bg-emerald-50' : 'hover:text-slate-800'}`}
              >
                综合
              </button>
              <button
                onClick={() => setSortBy('sales')}
                className={`px-2 py-0.5 rounded-md ${sortBy === 'sales' ? 'text-emerald-700 font-bold bg-emerald-50' : 'hover:text-slate-800'}`}
              >
                销量
              </button>
              <button
                onClick={() => setSortBy(sortBy === 'priceAsc' ? 'priceDesc' : 'priceAsc')}
                className={`px-2 py-0.5 rounded-md flex items-center gap-0.5 ${sortBy.startsWith('price') ? 'text-emerald-700 font-bold bg-emerald-50' : 'hover:text-slate-800'}`}
              >
                价格
                <ArrowUpDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Subcategories Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                selectedSubcategory === 'all'
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                  selectedSubcategory === sub.id
                    ? 'bg-emerald-700 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
          {categoryProducts.map((product) => (
            <div
              key={product.id}
              className="flex gap-2.5 p-2 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition-colors"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-100 overflow-hidden shrink-0 cursor-pointer relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {product.tag && (
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[8px] px-1 py-0.5 rounded-xs">
                    {product.tag.split(' ')[0]}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xs font-semibold text-slate-900 line-clamp-2 cursor-pointer hover:text-emerald-700 leading-snug"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {product.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-emerald-700 tabular-nums">
                      ¥{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through tabular-nums">
                        ¥{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="加购"
                  >
                    <ShoppingBag className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categoryProducts.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-xs">
              该分类下暂无商品
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
