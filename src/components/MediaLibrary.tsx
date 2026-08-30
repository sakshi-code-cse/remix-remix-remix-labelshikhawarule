import React, { useState, useMemo } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Film,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Crop,
  ExternalLink,
  Plus,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Eye,
  X,
  Layers,
  ShoppingBag,
  Tv,
  Users,
  Grid,
  List
} from 'lucide-react';
import { MediaAsset } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface MediaLibraryProps {
  assets: MediaAsset[];
  onSaveAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (assetId: string) => void;
  onSelectAsset?: (url: string) => void;
  isPickerMode?: boolean;
  onClosePicker?: () => void;
  onOpenCrop?: (imageSrc: string, title: string, onSave: (cropped: string) => void) => void;
  onQuickAddToDiaries?: (imageUrl: string, title: string) => void;
  onQuickAddToStyles?: (imageUrl: string, title: string) => void;
  onQuickAddToCollections?: (imageUrl: string, title: string) => void;
  onQuickAddToStories?: (imageUrl: string, title: string) => void;
}

const CATEGORY_TAGS = [
  { id: 'all', label: 'All Media', icon: FolderOpen },
  { id: 'diaries', label: 'Client Diaries', icon: Users },
  { id: 'ugc', label: 'UGC & Reels', icon: Tv },
  { id: 'styles', label: 'Shop By Style', icon: Layers },
  { id: 'collections', label: 'Collections', icon: ShoppingBag },
  { id: 'products', label: 'Product Catalog', icon: Sparkles },
  { id: 'logo', label: 'Branding & Logos', icon: ImageIcon },
];

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  assets = [],
  onSaveAsset,
  onDeleteAsset,
  onSelectAsset,
  isPickerMode = false,
  onClosePicker,
  onOpenCrop,
  onQuickAddToDiaries,
  onQuickAddToStyles,
  onQuickAddToCollections,
  onQuickAddToStories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [selectedAssetForAction, setSelectedAssetForAction] = useState<MediaAsset | null>(null);
  const [uploadTag, setUploadTag] = useState<string>('diaries');

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Type filter
      if (selectedType !== 'all' && asset.type !== selectedType) return false;
      
      // Tag filter
      if (selectedTag !== 'all') {
        const matchesTag = asset.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        if (!matchesTag) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = asset.name?.toLowerCase().includes(q);
        const matchesTag = asset.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesFolder = asset.folder?.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesFolder) return false;
      }

      return true;
    });
  }, [assets, selectedType, selectedTag, searchQuery]);

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadStatus(`Processing ${files.length} media item(s)...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) continue;

      try {
        let finalUrl = '';
        let width = 800;
        let height = 1000;

        if (isImage) {
          setUploadStatus(`Optimizing image ${i + 1} of ${files.length} (${file.name})...`);
          try {
            const compressed = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1333, quality: 0.85 });
            finalUrl = compressed || '';
          } catch {
            finalUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve((e.target?.result as string) || '');
              reader.readAsDataURL(file);
            });
          }
        } else {
          setUploadStatus(`Loading video asset ${i + 1} of ${files.length} (${file.name})...`);
          finalUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) || '');
            reader.readAsDataURL(file);
          });
        }

        if (finalUrl) {
          const newAsset: MediaAsset = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: finalUrl,
            type: isVideo ? 'video' : 'image',
            folder: uploadTag,
            tags: [uploadTag, isVideo ? 'video' : 'image'],
            size: file.size,
            dimensions: { width, height },
            createdAt: new Date().toISOString(),
          };

          onSaveAsset(newAsset);
        }
      } catch (err) {
        console.error('Failed to process file:', file.name, err);
      }
    }

    setIsUploading(false);
    setUploadStatus('');
  };

  const handleCopyUrl = (asset: MediaAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#F0D5DA] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF2F4] rounded-lg border border-[#DFBAC2]">
              <FolderOpen className="w-5 h-5 text-[#7A1526]" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-[#3B0A12] tracking-wider uppercase flex items-center gap-2">
                <span>CENTRAL MEDIA LIBRARY & ASSETS CMS</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FAF2F4] text-[#7A1526] border border-[#DFBAC2]">
                  {assets.length} Assets
                </span>
              </h2>
              <p className="text-xs text-[#7E4A53] mt-0.5">
                Centralized high-resolution image & video store. Auto-optimizes assets for Client Diaries, UGC, Shop By Style, and Collections.
              </p>
            </div>
          </div>
        </div>

        {isPickerMode && onClosePicker && (
          <button
            type="button"
            onClick={onClosePicker}
            className="p-2 text-[#7E4A53] hover:text-[#3B0A12] bg-[#FAF2F4] hover:bg-[#F0D5DA] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Upload Drop Zone & Tag Selector */}
      <div className="bg-white rounded-2xl border border-[#F0D5DA] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#7A1526]" />
            <span className="font-cinzel text-xs font-bold text-[#3B0A12] uppercase tracking-wider">
              Upload New High-Res Assets
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#7E4A53] font-cinzel">Assign Tag / Section:</label>
            <select
              value={uploadTag}
              onChange={(e) => setUploadTag(e.target.value)}
              className="bg-[#FAF2F4] border border-[#DFBAC2] rounded-lg px-2.5 py-1 text-xs text-[#7A1526] font-cinzel font-semibold focus:outline-none focus:border-[#7A1526]"
            >
              <option value="diaries">Client Diaries / Patrons</option>
              <option value="ugc">UGC / Discovery Reels</option>
              <option value="styles">Shop By Style</option>
              <option value="collections">Shop By Collection</option>
              <option value="products">Product Catalog</option>
              <option value="logo">Logo & Branding</option>
            </select>
          </div>
        </div>

        {/* Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFileUpload(e.dataTransfer.files);
            }
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-[#7A1526] bg-[#7A1526]/5 scale-[1.005]'
              : 'border-[#DFBAC2] bg-[#FAF5F6] hover:bg-[#FAF2F4]'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF2F4] border border-[#DFBAC2] flex items-center justify-center text-[#7A1526] shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-cinzel text-xs font-bold text-[#3B0A12] uppercase tracking-wider">
                Drag & Drop Images or Videos Here
              </p>
              <p className="text-[11px] text-[#7E4A53] mt-1">
                Supports JPG, PNG, WebP, SVG, MP4, WebM. Images are auto-compressed and stored in cloud Firestore.
              </p>
            </div>

            <label className="px-5 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95">
              <Upload className="w-4 h-4" />
              <span>Browse Computer Files</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files);
                    e.target.value = '';
                  }
                }}
              />
            </label>

            {isUploading && (
              <div className="flex items-center gap-2 text-xs font-cinzel text-[#7A1526] animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="bg-white rounded-2xl border border-[#F0D5DA] p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#7E4A53] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by name or tag..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF5F6] border border-[#F0D5DA] rounded-lg text-xs text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7E4A53] hover:text-[#3B0A12]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter & Layout Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-[#FAF5F6] p-1 rounded-lg border border-[#F0D5DA]">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 text-xs font-cinzel rounded transition-colors ${
                  selectedType === 'all' ? 'bg-[#7A1526] text-white font-bold' : 'text-[#7E4A53] hover:text-[#3B0A12]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('image')}
                className={`px-2.5 py-1 text-xs font-cinzel rounded flex items-center gap-1 transition-colors ${
                  selectedType === 'image' ? 'bg-[#7A1526] text-white font-bold' : 'text-[#7E4A53] hover:text-[#3B0A12]'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photos</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('video')}
                className={`px-2.5 py-1 text-xs font-cinzel rounded flex items-center gap-1 transition-colors ${
                  selectedType === 'video' ? 'bg-[#7A1526] text-white font-bold' : 'text-[#7E4A53] hover:text-[#3B0A12]'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Reels</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF5F6] p-1 rounded-lg border border-[#F0D5DA]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#7A1526] text-white' : 'text-[#7E4A53] hover:text-[#3B0A12]'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#7A1526] text-white' : 'text-[#7E4A53] hover:text-[#3B0A12]'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORY_TAGS.map((tag) => {
            const Icon = tag.icon;
            const isSelected = selectedTag === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#7A1526] text-white shadow-sm font-semibold'
                    : 'bg-[#FAF5F6] text-[#7E4A53] hover:bg-[#FAF2F4] hover:text-[#3B0A12] border border-[#F0D5DA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assets Display Grid / List */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F0D5DA] p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5F6] border border-[#DFBAC2] flex items-center justify-center text-[#7E4A53]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-sm font-bold text-[#3B0A12]">No Media Assets Found</h3>
          <p className="text-xs text-[#7E4A53] max-w-sm mx-auto">
            {searchQuery
              ? `No media matches your search query "${searchQuery}".`
              : 'Upload photos or videos using the drag & drop area above to populate your media CMS.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => {
            const isCopied = copiedId === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => {
                  if (isPickerMode && onSelectAsset) {
                    onSelectAsset(asset.url);
                  }
                }}
                className={`bg-white rounded-xl border border-[#F0D5DA] overflow-hidden shadow-xs hover:shadow-md hover:border-[#7A1526] transition-all group flex flex-col justify-between ${
                  isPickerMode ? 'cursor-pointer hover:ring-2 hover:ring-[#7A1526]' : ''
                }`}
              >
                {/* Media Thumbnail Container */}
                <div className="relative aspect-[3/4] bg-[#FAF5F6] overflow-hidden">
                  {asset.type === 'video' ? (
                    <video
                      src={asset.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono rounded uppercase">
                      {asset.type}
                    </span>
                    {asset.folder && (
                      <span className="px-1.5 py-0.5 bg-[#7A1526]/85 text-white text-[9px] font-cinzel rounded uppercase">
                        {asset.folder}
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 p-2 transition-opacity">
                    {isPickerMode ? (
                      <button
                        type="button"
                        onClick={() => onSelectAsset && onSelectAsset(asset.url)}
                        className="w-full py-1.5 bg-[#7A1526] hover:bg-[#61101E] text-white text-[10px] font-cinzel font-semibold rounded shadow-md flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Select Media</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewAsset(asset);
                          }}
                          className="w-full py-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-cinzel rounded flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>

                        {asset.type === 'image' && onOpenCrop && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCrop(asset.url, asset.name, (cropped) => {
                                onSaveAsset({
                                  ...asset,
                                  url: cropped,
                                });
                              });
                            }}
                            className="w-full py-1 bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7A1526] text-[10px] font-cinzel rounded flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Crop className="w-3 h-3" />
                            <span>Crop (3:4)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleCopyUrl(asset, e)}
                          className="w-full py-1 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-[10px] font-cinzel rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info & Bottom Action Bar */}
                <div className="p-2.5 space-y-1.5 bg-white">
                  <div className="flex items-center justify-between">
                    <p className="font-cinzel text-xs font-bold text-[#3B0A12] line-clamp-1" title={asset.name}>
                      {asset.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F0D5DA] text-[10px] text-[#7E4A53]">
                    <span>
                      {asset.size ? `${(asset.size / 1024).toFixed(0)} KB` : 'Cloud'}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* One-click Quick Assign Dropdown */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssetForAction(asset);
                        }}
                        className="p-1 hover:bg-[#FAF2F4] text-[#7A1526] rounded cursor-pointer"
                        title="Quick Insert to Section"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete asset "${asset.name}" from media library?`)) {
                            onDeleteAsset(asset.id);
                          }
                        }}
                        className="p-1 hover:bg-red-50 text-red-700 rounded cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-[#F0D5DA] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5F6] border-b border-[#F0D5DA] text-[#7A1526] font-cinzel font-semibold">
              <tr>
                <th className="p-3">Asset</th>
                <th className="p-3">Name</th>
                <th className="p-3">Folder / Tag</th>
                <th className="p-3">Type</th>
                <th className="p-3">Size</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0D5DA] text-[#3B0A12]">
              {filteredAssets.map((asset) => {
                const isCopied = copiedId === asset.id;
                return (
                  <tr key={asset.id} className="hover:bg-[#FAF5F6] transition-colors">
                    <td className="p-3">
                      <div className="w-10 h-14 rounded overflow-hidden bg-[#FAF5F6] border border-[#DFBAC2]">
                        {asset.type === 'video' ? (
                          <video src={asset.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{asset.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#FAF2F4] text-[#7A1526] rounded border border-[#DFBAC2] text-[10px] font-cinzel">
                        {asset.folder || 'general'}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-mono text-[10px]">{asset.type}</td>
                    <td className="p-3 font-mono text-[10px]">
                      {asset.size ? `${(asset.size / 1024).toFixed(0)} KB` : 'Cloud'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(asset, { stopPropagation: () => {} } as any)}
                          className="px-2 py-1 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white rounded text-[10px] font-cinzel flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'URL'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAssetForAction(asset)}
                          className="p-1 hover:bg-[#FAF2F4] text-[#7A1526] rounded cursor-pointer"
                          title="Assign to Section"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete asset "${asset.name}"?`)) {
                              onDeleteAsset(asset.id);
                            }
                          }}
                          className="p-1 hover:bg-red-50 text-red-700 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: PREVIEW LIGHTBOX */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#F0D5DA] rounded-2xl max-w-2xl w-full p-6 space-y-4 text-xs shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <h3 className="font-cinzel text-sm font-bold text-[#3B0A12] uppercase tracking-wider">
                {previewAsset.name}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1 text-[#7E4A53] hover:text-[#3B0A12] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] flex items-center justify-center bg-black/5 rounded-xl overflow-hidden">
              {previewAsset.type === 'video' ? (
                <video src={previewAsset.url} controls autoPlay className="max-h-[55vh] max-w-full rounded-lg" />
              ) : (
                <img src={previewAsset.url} alt={previewAsset.name} className="max-h-[55vh] max-w-full object-contain rounded-lg shadow-sm" />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0D5DA]">
              <span className="text-[11px] text-[#7E4A53] font-mono">
                {previewAsset.createdAt ? new Date(previewAsset.createdAt).toLocaleString() : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewAsset, { stopPropagation: () => {} } as any)}
                  className="px-3 py-1.5 bg-[#FAF2F4] text-[#7A1526] hover:bg-[#7A1526] hover:text-white rounded-lg font-cinzel text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Direct URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="px-4 py-1.5 bg-[#7A1526] text-white rounded-lg font-cinzel text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK ASSIGN TO SECTION */}
      {selectedAssetForAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#F0D5DA] rounded-2xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7A1526]" />
                <h3 className="font-cinzel text-sm font-bold text-[#3B0A12] uppercase tracking-wider">
                  Quick Insert Media
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssetForAction(null)}
                className="p-1 text-[#7E4A53] hover:text-[#3B0A12] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#FAF5F6] rounded-xl border border-[#F0D5DA]">
              <div className="w-12 h-16 rounded overflow-hidden border border-[#DFBAC2] bg-black">
                {selectedAssetForAction.type === 'video' ? (
                  <video src={selectedAssetForAction.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedAssetForAction.url} alt={selectedAssetForAction.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-cinzel font-bold text-xs text-[#3B0A12] line-clamp-1">{selectedAssetForAction.name}</p>
                <p className="text-[10px] text-[#7E4A53] uppercase font-mono">{selectedAssetForAction.type} • {selectedAssetForAction.folder || 'media'}</p>
              </div>
            </div>

            <p className="text-xs text-[#7E4A53]">
              Choose where you want to instantly inject this media asset:
            </p>

            <div className="space-y-2">
              {onQuickAddToDiaries && (
                <button
                  type="button"
                  onClick={() => {
                    onQuickAddToDiaries(selectedAssetForAction.url, selectedAssetForAction.name);
                    setSelectedAssetForAction(null);
                  }}
                  className="w-full p-3 bg-[#FAF5F6] hover:bg-[#FAF2F4] text-[#3B0A12] hover:text-[#7A1526] rounded-xl border border-[#F0D5DA] flex items-center justify-between font-cinzel font-semibold text-xs cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#7A1526]" />
                    <span>Add as New Client Diary Patron</span>
                  </div>
                  <Plus className="w-4 h-4" />
                </button>
              )}

              {onQuickAddToStyles && (
                <button
                  type="button"
                  onClick={() => {
                    onQuickAddToStyles(selectedAssetForAction.url, selectedAssetForAction.name);
                    setSelectedAssetForAction(null);
                  }}
                  className="w-full p-3 bg-[#FAF5F6] hover:bg-[#FAF2F4] text-[#3B0A12] hover:text-[#7A1526] rounded-xl border border-[#F0D5DA] flex items-center justify-between font-cinzel font-semibold text-xs cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7A1526]" />
                    <span>Add as New Shop By Style Silhouette</span>
                  </div>
                  <Plus className="w-4 h-4" />
                </button>
              )}

              {onQuickAddToCollections && (
                <button
                  type="button"
                  onClick={() => {
                    onQuickAddToCollections(selectedAssetForAction.url, selectedAssetForAction.name);
                    setSelectedAssetForAction(null);
                  }}
                  className="w-full p-3 bg-[#FAF5F6] hover:bg-[#FAF2F4] text-[#3B0A12] hover:text-[#7A1526] rounded-xl border border-[#F0D5DA] flex items-center justify-between font-cinzel font-semibold text-xs cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#7A1526]" />
                    <span>Add as New Mughal Collection Card</span>
                  </div>
                  <Plus className="w-4 h-4" />
                </button>
              )}

              {onQuickAddToStories && (
                <button
                  type="button"
                  onClick={() => {
                    onQuickAddToStories(selectedAssetForAction.url, selectedAssetForAction.name);
                    setSelectedAssetForAction(null);
                  }}
                  className="w-full p-3 bg-[#FAF5F6] hover:bg-[#FAF2F4] text-[#3B0A12] hover:text-[#7A1526] rounded-xl border border-[#F0D5DA] flex items-center justify-between font-cinzel font-semibold text-xs cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-[#7A1526]" />
                    <span>Add as New UGC Discovery Reel</span>
                  </div>
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
