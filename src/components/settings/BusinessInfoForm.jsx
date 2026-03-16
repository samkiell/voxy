import React from 'react';

const categories = [
  "Restaurant",
  "Retail",
  "Electronics",
  "Beauty",
  "Automotive",
  "Health",
  "Education",
  "Real Estate",
  "Other"
];

const BusinessInfoForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
      <h2 className="text-xl font-bold text-white mb-2">Business Information</h2>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Business Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="e.g. Voxy Coffee House"
          className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00D18F]/50 transition-all shadow-inner"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Tell customers about your business..."
          rows={4}
          className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00D18F]/50 transition-all resize-none shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Category</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00D18F]/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {formData.category === 'Other' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Custom Category</label>
            <input
              type="text"
              name="custom_category"
              value={formData.custom_category || ''}
              onChange={handleChange}
              placeholder="e.g. Pet Care"
              className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00D18F]/50 transition-all shadow-inner"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInfoForm;
