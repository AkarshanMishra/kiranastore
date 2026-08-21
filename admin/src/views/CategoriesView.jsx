import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Image, Search, CheckCircle2, ChevronRight, Sparkles, X } from 'lucide-react';

export default function CategoriesView({ categories = [], setCategories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryList, setCategoryList] = useState([
    {
      id: 1,
      name: 'Dairy, Bread & Eggs',
      slug: 'dairy-bread-eggs',
      icon: '🥛',
      productCount: 142,
      status: 'ACTIVE',
      subcategories: ['Fresh Milk', 'Curd & Yogurt', 'Butter & Cheese', 'Paneer', 'Farm Eggs', 'Bread & Pav']
    },
    {
      id: 2,
      name: 'Fruits & Vegetables',
      slug: 'fruits-vegetables',
      icon: '🍎',
      productCount: 186,
      status: 'ACTIVE',
      subcategories: ['Fresh Fruits', 'Daily Vegetables', 'Leafy & Herbs', 'Organic Vegetables', 'Exotic Produce']
    },
    {
      id: 3,
      name: 'Snacks & Munchies',
      slug: 'snacks-munchies',
      icon: '🍿',
      productCount: 220,
      status: 'ACTIVE',
      subcategories: ['Chips & Crisps', 'Namkeen & Bhujia', 'Biscuits & Cookies', 'Popcorn & Roasted', 'Noodles & Pasta']
    },
    {
      id: 4,
      name: 'Atta, Rice & Dal',
      slug: 'atta-rice-dal',
      icon: '🌾',
      productCount: 165,
      status: 'ACTIVE',
      subcategories: ['Chakki Atta', 'Basmati Rice', 'Toor & Moong Dal', 'Poha & Suji', 'Besan & Maida', 'Organic Grains']
    },
    {
      id: 5,
      name: 'Cold Drinks & Juices',
      slug: 'cold-drinks-juices',
      icon: '🥤',
      productCount: 94,
      status: 'ACTIVE',
      subcategories: ['Soft Drinks & Soda', 'Fresh Fruit Juices', 'Energy Drinks', 'Flavored Milk', 'Mineral Water']
    },
    {
      id: 6,
      name: 'Personal & Baby Care',
      slug: 'personal-baby-care',
      icon: '🧼',
      productCount: 110,
      status: 'ACTIVE',
      subcategories: ['Soaps & Body Wash', 'Shampoo & Conditioner', 'Dental Care', 'Baby Diapers & Wipes', 'Baby Food']
    }
  ]);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🍎');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const subs = subcategoriesStr.split(',').map(s => s.trim()).filter(Boolean);
    const newCat = {
      id: Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      icon: icon || '📦',
      productCount: 0,
      status: 'ACTIVE',
      subcategories: subs.length > 0 ? subs : ['General']
    };
    setCategoryList([newCat, ...categoryList]);
    setIsAddOpen(false);
    setName('');
    setSlug('');
    setSubcategoriesStr('');
    alert(`Category "${name}" created successfully!`);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategoryList(categoryList.filter(c => c.id !== id));
    }
  };

  const filteredCategories = categoryList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subcategories.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Category & Subcategory Hierarchy</h2>
          <p className="text-xs text-slate-500">Organize multi-level grocery categories, subcategories, banners & SEO slugs</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category or subcategory..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-600"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Add Category
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center text-xl shadow-xs">
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{cat.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200">
                  {cat.status}
                </span>
              </div>

              {/* Subcategories Pills */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  Subcategories ({cat.subcategories.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, i) => (
                    <span key={i} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-lg shadow-2xs">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                <strong className="text-slate-900">{cat.productCount}</strong> items stocked
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert(`Editing category: ${cat.name}`)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Add New Category</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Masalas & Spices" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Icon / Emoji</label>
                <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. 🌶️" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-lg" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. masalas-spices" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subcategories (Comma separated)</label>
                <textarea rows={2} value={subcategoriesStr} onChange={(e) => setSubcategoriesStr(e.target.value)} placeholder="Whole Spices, Powdered Masalas, Cooking Pastes" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Create Category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
