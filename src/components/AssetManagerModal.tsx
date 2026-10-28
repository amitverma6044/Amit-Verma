import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Upload, Check, Copy, Plus, Trash2 } from 'lucide-react';

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: 'Diagrams' | 'Infographics' | 'Maps' | 'Cover Banners' | 'Charts & Tables';
  tags: string[];
  uploadedAt: string;
  dimensions?: string;
  fileSize?: string;
}

const INITIAL_ASSETS: MediaAsset[] = [
  {
    id: 'asset-1',
    title: 'Constitutional Rights Overview Infographic',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    category: 'Infographics',
    tags: ['Polity', 'Rights', 'Law', 'UPSC'],
    uploadedAt: '2026-10-20',
    dimensions: '1200 x 800',
    fileSize: '420 KB'
  },
  {
    id: 'asset-2',
    title: 'Supreme Court & Judiciary Hierarchy Diagram',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    category: 'Diagrams',
    tags: ['Judiciary', 'Courts', 'Hierarchy'],
    uploadedAt: '2026-10-22',
    dimensions: '1200 x 750',
    fileSize: '380 KB'
  },
  {
    id: 'asset-3',
    title: 'Indian Physical Geography & River Map',
    url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    category: 'Maps',
    tags: ['Geography', 'Map', 'Rivers'],
    uploadedAt: '2026-10-25',
    dimensions: '1400 x 900',
    fileSize: '610 KB'
  },
  {
    id: 'asset-4',
    title: 'UPSC Prelims Mock Test Series Cover Banner',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    category: 'Cover Banners',
    tags: ['Test Series', 'Prelims', 'Exam'],
    uploadedAt: '2026-10-26',
    dimensions: '1600 x 600',
    fileSize: '540 KB'
  },
  {
    id: 'asset-5',
    title: 'Indian Economic Inflation & GDP Growth Chart',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    category: 'Charts & Tables',
    tags: ['Economy', 'GDP', 'Inflation'],
    uploadedAt: '2026-10-27',
    dimensions: '1100 x 700',
    fileSize: '310 KB'
  }
];

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, title?: string) => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('edublog_media_assets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved assets:', e);
      }
    }
    return INITIAL_ASSETS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // New asset form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<MediaAsset['category']>('Diagrams');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    localStorage.setItem('edublog_media_assets', JSON.stringify(assets));
  }, [assets]);

  if (!isOpen) return null;

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Handle Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        const newAsset: MediaAsset = {
          id: `asset-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          url: base64Url,
          category: 'Diagrams',
          tags: ['Upload', 'Article Image'],
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: `${Math.round(file.size / 1024)} KB`,
        };
        setAssets([newAsset, ...assets]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add asset via URL form
  const handleAddUrlAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) return;

    const newAsset: MediaAsset = {
      id: `asset-${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim(),
      category: newCategory,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: 'External Link',
    };

    setAssets([newAsset, ...assets]);
    setNewTitle('');
    setNewUrl('');
    setNewTags('');
    setShowUploadForm(false);
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Media & Image Asset Manager</h3>
              <p className="text-[11px] text-slate-500">
                Reuse uploaded diagrams, infographics, and maps across your educational articles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Asset</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload New Asset Form Dropdown */}
        {showUploadForm && (
          <div className="p-4 bg-indigo-50/80 border-b border-indigo-200/80 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload or Link New Educational Image Asset</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1 font-mono">Local File Upload:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-semibold cursor-pointer"
                />
              </div>

              <form onSubmit={handleAddUrlAsset} className="space-y-2 sm:col-span-1">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Asset Title (e.g. Fundamental Rights Chart)"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                  required
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Image Direct URL (https://...)"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                  required
                />
                <div className="flex gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Diagrams">Diagrams</option>
                    <option value="Infographics">Infographics</option>
                    <option value="Maps">Maps</option>
                    <option value="Cover Banners">Cover Banners</option>
                    <option value="Charts & Tables">Charts & Tables</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 shadow-xs"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by name or tags..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['All', 'Diagrams', 'Infographics', 'Maps', 'Cover Banners', 'Charts & Tables'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[500px]">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-500 font-sans">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No assets found matching your search criteria.</p>
              <p className="text-xs">Try adjusting your filters or upload a new educational diagram.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image Preview Container */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {asset.category}
                    </span>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600/80 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Asset Meta Details */}
                  <div className="p-3.5 font-sans space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {asset.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                        <span>{asset.dimensions || 'Image'}</span>
                        <span>{asset.fileSize || ''}</span>
                      </div>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1 pt-1 font-mono">
                      {asset.tags.map((tag) => (
                        <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleCopyUrl(asset)}
                        className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                        title="Copy Image URL"
                      >
                        {copiedId === asset.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectImage(asset.url, asset.title);
                          onClose();
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Insert into Article
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-sans font-mono">
          <span>{filteredAssets.length} image assets available</span>
          <span>Click "Insert into Article" to embed into the editor canvas</span>
        </div>

      </div>
    </div>
  );
};
