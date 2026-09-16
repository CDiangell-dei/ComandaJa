import React from 'react';
import { Sparkles, Flame, Heart, GlassWater, Coffee, Tag } from 'lucide-react';

const ICONS = {
  Sparkles,
  Flame,
  Heart,
  GlassWater,
  Coffee,
  Tag,
};

export default function CategoryNav({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="sticky top-16 z-30 bg-stone-50/95 backdrop-blur-md py-3 border-b border-stone-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const IconComponent = ICONS[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all select-none ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-2xs'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
