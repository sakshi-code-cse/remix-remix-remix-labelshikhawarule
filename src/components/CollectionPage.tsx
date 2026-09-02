import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid, 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  Scissors, 
  Calendar,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { QuickShopModal } from './QuickShopModal';
import { IndianArchCard } from './ArchShape';

export interface CollectionPageProps {
  products: Product[];
  currentCollectionSlug: string;
  onSelectCollection: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onOpenAppointment: () => void;
  onOpenSizeGuide: () => void;
  onBackToHome: () => void;
}

interface CollectionMeta {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bannerImage: string;
  defaultFilter?: {
    gender?: string;
    category?: string;
    style?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    readyToShip?: boolean;
  };
}

export const COLLECTIONS_LIST: CollectionMeta[] = [
  {
    slug: 'new-arrivals',
    title: 'NEW ARRIVALS',
    tagline: 'Autumn / Festive Haute Couture Edit',
    description: 'Discover the latest hand-draped silhouettes, featuring pure raw silks, delicate zardozi needlework, and contemporary royal tailoring directly from the atelier.',
    bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { isNew: true },
  },
  {
    slug: 'all',
    title: 'ALL CREATIONS',
    tagline: 'The Complete Atelier Archive',
    description: 'Explore the full spectrum of Label Shikha Warule heritage weaves, bespoke ensembles, luxury menswear, sarees, and fine handcrafted accessories.',
    bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop',
  },
  {
    slug: 'men',
    title: "MEN'S ATELIER",
    tagline: 'Regal Bandhgalas, Sherwanis & Linen Kurtas',
    description: 'Structured silhouettes tailored in high-thread mulberry raw silk, handspun khadi, and Belgian flax linen with bespoke shoulder moulding.',
    bannerImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { gender: 'Men' },
  },
  {
    slug: 'women',
    title: "WOMEN'S COUTURE",
    tagline: 'Handloom Sarees, Anarkalis & Co-ord Sets',
    description: 'Graceful silhouettes celebrating India’s timeless textile traditions in Chanderi silk, Tussar georgette, and Bagru hand-block prints.',
    bannerImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { gender: 'Women' },
  },
  {
    slug: 'wedding',
    title: 'ROYAL WEDDING & BESPOKE',
    tagline: 'Groom Couture & Bridal Trousseau',
    description: 'Handcrafted masterworks adorned with antique dabka, mukaish, seed pearls, and hand-woven gold zari for life’s grandest celebrations.',
    bannerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { style: 'Royal Wedding' },
  },
  {
    slug: 'festive',
    title: 'FESTIVE SPLENDOUR',
    tagline: 'Sangeet, Cocktail & Puja Edits',
    description: 'Vibrant celebratory ensembles finished with exquisite gota patti, aari needlework, and featherlight organza dupattas.',
    bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { style: 'Festive' },
  },
  {
    slug: 'ready-to-wear',
    title: 'READY TO SHIP',
    tagline: 'Express Dispatches Within 24-48 Hours',
    description: 'Curated luxury pieces pre-crafted in standard sizes, ready for immediate express delivery across India and worldwide.',
    bannerImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { readyToShip: true },
  },
  {
    slug: 'accessories',
    title: 'FINE ACCESSORIES',
    tagline: 'Vegetable Tanned Leather & Tissue Dupattas',
    description: 'Hand-burnished saddle bags with solid brass fittings and handwoven Varanasi tissue silk dupattas.',
    bannerImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1920&auto=format&fit=crop',
    defaultFilter: { category: 'Accessories' },
  },
];

export const CollectionPage: React.FC<CollectionPageProps> = ({
  products,
  currentCollectionSlug,
  onSelectCollection,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenAppointment,
  onOpenSizeGuide,
  onBackToHome,
}) => {
  // Find current collection meta
  const currentCollection = useMemo(() => {
    return COLLECTIONS_LIST.find((c) => c.slug === currentCollectionSlug) || COLLECTIONS_LIST[0];
  }, [currentCollectionSlug]);

  // UI state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(4);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [quickShopProduct, setQuickShopProduct] = useState<Product | null>(null);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(40000);
  const [onlyReadyToShip, setOnlyReadyToShip] = useState<boolean>(false);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(false);

  // Sync collection default filters when currentCollectionSlug changes
  useEffect(() => {
    // Reset filters on collection change, then apply collection defaults
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedStyles([]);
    setSelectedGenders([]);
    setOnlyReadyToShip(false);
    setOnlyOnSale(false);

    if (currentCollection.defaultFilter) {
      if (currentCollection.defaultFilter.gender) {
        setSelectedGenders([currentCollection.defaultFilter.gender]);
      }
      if (currentCollection.defaultFilter.category) {
        setSelectedCategories([currentCollection.defaultFilter.category]);
      }
      if (currentCollection.defaultFilter.style) {
        setSelectedStyles([currentCollection.defaultFilter.style]);
      }
      if (currentCollection.defaultFilter.readyToShip) {
        setOnlyReadyToShip(true);
      }
    }
  }, [currentCollection]);

  // Derived available options from products
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  const availableFabrics = useMemo(() => {
    return [
      'Raw Silk',
      'Chanderi Silk',
      'Mulberry Silk',
      'Tussar Silk',
      'Organic Mulmul Cotton',
      'Belgian Linen',
      'Banarasi Brocade',
      'Organza',
      'Leather & Brass',
    ];
  }, []);

  const availableOccasions = useMemo(() => {
    return [
      'Wedding & Pheras',
      'Grand Reception',
      'Sangeet & Cocktail',
      'Haldi & Mehendi',
      'Festive Puja',
      'Everyday Luxury',
    ];
  }, []);

  const availableStyles = useMemo(() => {
    return ['Ethnic', 'Classic', 'Festive', 'Everyday', 'Royal Wedding'];
  }, []);

  // Check how many filters are active
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedFabrics.length > 0) count += selectedFabrics.length;
    if (selectedOccasions.length > 0) count += selectedOccasions.length;
    if (selectedStyles.length > 0) count += selectedStyles.length;
    if (selectedGenders.length > 0) count += selectedGenders.length;
    if (priceRange < 40000) count += 1;
    if (onlyReadyToShip) count += 1;
    if (onlyOnSale) count += 1;
    return count;
  }, [
    selectedCategories,
    selectedFabrics,
    selectedOccasions,
    selectedStyles,
    selectedGenders,
    priceRange,
    onlyReadyToShip,
    onlyOnSale,
  ]);

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedStyles([]);
    setSelectedGenders([]);
    setPriceRange(40000);
    setOnlyReadyToShip(false);
    setOnlyOnSale(false);
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Base collection filter
    if (currentCollection.slug === 'new-arrivals') {
      list = list.filter((p) => p.isNew || p.collectionSlug === 'new-arrivals');
    } else if (currentCollection.slug === 'wedding') {
      list = list.filter(
        (p) =>
          p.style === 'Royal Wedding' ||
          p.category === 'Sherwanis' ||
          p.category === 'Bandhgala' ||
          p.occasion?.toLowerCase().includes('wedding') ||
          p.tags?.some((t) => t.toLowerCase().includes('wedding') || t.toLowerCase().includes('groom'))
      );
    } else if (currentCollection.slug === 'festive') {
      list = list.filter(
        (p) =>
          p.style === 'Festive' ||
          p.occasion?.toLowerCase().includes('sangeet') ||
          p.occasion?.toLowerCase().includes('festive') ||
          p.tags?.some((t) => t.toLowerCase().includes('festive'))
      );
    } else if (currentCollection.slug === 'ready-to-wear') {
      list = list.filter((p) => p.readyToShip || p.inStock);
    }

    // Category filter
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      list = list.filter((p) => selectedGenders.includes(p.gender));
    }

    // Style filter
    if (selectedStyles.length > 0) {
      list = list.filter((p) => selectedStyles.includes(p.style));
    }

    // Fabric filter
    if (selectedFabrics.length > 0) {
      list = list.filter((p) =>
        selectedFabrics.some((fab) => p.fabric?.toLowerCase().includes(fab.toLowerCase()))
      );
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      list = list.filter((p) =>
        selectedOccasions.some(
          (occ) =>
            p.occasion?.toLowerCase().includes(occ.toLowerCase()) ||
            p.tags?.some((t) => t.toLowerCase().includes(occ.toLowerCase()))
        )
      );
    }

    // Price range
    if (priceRange < 40000) {
      list = list.filter((p) => p.price <= priceRange);
    }

    // Ready to ship
    if (onlyReadyToShip) {
      list = list.filter((p) => p.readyToShip || p.inStock);
    }

    // On sale
    if (onlyOnSale) {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'bestsellers') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [
    products,
    currentCollection,
    selectedCategories,
    selectedGenders,
    selectedStyles,
    selectedFabrics,
    selectedOccasions,
    priceRange,
    onlyReadyToShip,
    onlyOnSale,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2420]">
      {/* 1. Collection Breadcrumb & Header Banner */}
      <section className="relative bg-[#FAF6F0] border-b border-[#DFCBB8] pt-6 pb-10 sm:py-12 overflow-hidden">
        {/* Subtle decorative archival watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none bg-[radial-gradient(#9E472A_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[11px] font-cinzel text-[#7A6F68] uppercase tracking-wider mb-4">
            <button
              onClick={onBackToHome}
              className="hover:text-[#9E472A] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#9E472A] font-semibold">Collections</span>
            <span>/</span>
            <span className="text-[#2C2420] font-bold">{currentCollection.title}</span>
          </nav>

          {/* Collection Title & Editorial Statement */}
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#F3E8DB] text-[#9E472A] font-cinzel text-[11px] font-semibold tracking-widest uppercase rounded-full mb-3 border border-[#DFCBB8]">
              {currentCollection.tagline}
            </span>
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2420] tracking-wide leading-tight">
              {currentCollection.title}
            </h1>
            <p className="font-serif-luxury italic text-sm sm:text-base text-[#685C54] mt-3 leading-relaxed">
              {currentCollection.description}
            </p>
          </div>

          {/* Collection Switcher Pills */}
          <div className="mt-8 pt-6 border-t border-[#DFCBB8]/60 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {COLLECTIONS_LIST.map((col) => {
              const isActive = col.slug === currentCollectionSlug;
              return (
                <button
                  key={col.slug}
                  onClick={() => onSelectCollection(col.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-cinzel tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9E472A] text-white font-bold shadow-sm'
                      : 'bg-white text-[#523A30] border border-[#DFCBB8] hover:border-[#9E472A] hover:bg-[#F8F2EA]'
                  }`}
                >
                  {col.slug === 'new-arrivals' ? '✨ ' : ''}
                  {col.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Top Control Bar (Filter trigger, Grid Switcher, Sorting, Count) */}
      <section className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#DFCBB8] py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Filter Drawer Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-[#DFCBB8] hover:border-[#9E472A] text-xs font-cinzel font-semibold tracking-wider text-[#2C2420] hover:text-[#9E472A] shadow-2xs transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E472A]" />
              <span>FILTER & REFINE</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#9E472A] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active Items Count */}
            <span className="hidden sm:inline-block text-xs font-cinzel text-[#7A6F68]">
              Showing <strong className="text-[#2C2420]">{filteredProducts.length}</strong> creations
            </span>
          </div>

          {/* Right: Grid Switcher & Sorting */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Grid Layout Switcher (Desktop) */}
            <div className="hidden md:flex items-center border border-[#DFCBB8] rounded-md bg-white p-0.5">
              <button
                onClick={() => setGridColumns(2)}
                title="2 Columns Editorial View"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  gridColumns === 2 ? 'bg-[#9E472A] text-white' : 'text-[#7A6F68] hover:text-[#2C2420]'
                }`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                title="3 Columns Balanced View"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  gridColumns === 3 ? 'bg-[#9E472A] text-white' : 'text-[#7A6F68] hover:text-[#2C2420]'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                title="4 Columns Compact Grid"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  gridColumns === 4 ? 'bg-[#9E472A] text-white' : 'text-[#7A6F68] hover:text-[#2C2420]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline-block text-xs font-cinzel text-[#7A6F68]">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#DFCBB8] rounded-md px-3 py-2 pr-8 text-xs font-cinzel text-[#2C2420] focus:outline-none focus:border-[#9E472A] cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured & Curated</option>
                  <option value="newest">Latest / New Arrivals</option>
                  <option value="bestsellers">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A6F68] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Active Filters Chips */}
      {activeFiltersCount > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FAF6F0] rounded-lg border border-[#DFCBB8]">
            <span className="text-xs font-cinzel font-semibold text-[#523A30] flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#9E472A]" />
              <span>Active Filters:</span>
            </span>

            {selectedGenders.map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]"
              >
                <span>{g}</span>
                <button
                  onClick={() => setSelectedGenders(selectedGenders.filter((x) => x !== g))}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedCategories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]"
              >
                <span>{c}</span>
                <button
                  onClick={() => setSelectedCategories(selectedCategories.filter((x) => x !== c))}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedStyles.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]"
              >
                <span>Style: {s}</span>
                <button
                  onClick={() => setSelectedStyles(selectedStyles.filter((x) => x !== s))}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedFabrics.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]"
              >
                <span>Fabric: {f}</span>
                <button
                  onClick={() => setSelectedFabrics(selectedFabrics.filter((x) => x !== f))}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedOccasions.map((o) => (
              <span
                key={o}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]"
              >
                <span>Occasion: {o}</span>
                <button
                  onClick={() => setSelectedOccasions(selectedOccasions.filter((x) => x !== o))}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {priceRange < 40000 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]">
                <span>Under ₹{priceRange.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => setPriceRange(40000)}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyReadyToShip && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]">
                <span>Ready to Ship</span>
                <button
                  onClick={() => setOnlyReadyToShip(false)}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyOnSale && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFCBB8] rounded-full text-[11px] font-cinzel text-[#2C2420]">
                <span>Special Offers</span>
                <button
                  onClick={() => setOnlyOnSale(false)}
                  className="text-[#7A6F68] hover:text-[#9E472A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleClearAllFilters}
              className="text-[11px] font-cinzel text-[#9E472A] font-bold hover:underline ml-auto cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </section>
      )}

      {/* 4. Main Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto border border-[#DFCBB8]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#2C2420]">
              NO CREATIONS MATCH YOUR FILTER
            </h3>
            <p className="text-xs text-[#7A6F68] leading-relaxed">
              We couldn't find any piece matching the selected criteria in this collection. Try relaxing your filters or explore our full bespoke archive.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleClearAllFilters}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#9E472A] text-white text-xs font-cinzel font-semibold rounded uppercase tracking-wider hover:bg-[#80331A] transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => onSelectCollection('all')}
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#DFCBB8] text-[#2C2420] text-xs font-cinzel rounded uppercase tracking-wider hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                Explore All Products
              </button>
            </div>
          </div>
        ) : (
          /* Grid Container */
          <div
            className={`grid gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12 ${
              gridColumns === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : gridColumns === 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {filteredProducts.map((product) => {
              const isFav = isWishlisted(product.id);
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-white rounded-xl p-3 sm:p-3.5 border border-[#DFCBB8]/70 hover:border-[#9E472A]/50 hover:shadow-lg transition-all duration-300 relative"
                >
                  <div>
                    {/* Signature Mughal Arch Frame with Dual Image Flip on Hover */}
                    <div className="w-full mb-1">
                      <IndianArchCard
                        id={`collection-item-${product.id}`}
                        image={product.image}
                        hoverImage={product.hoverImage}
                        alt={product.name}
                        aspectRatio="aspect-[3/4]"
                        borderColor="#9E472A"
                        strokeWidth={1.8}
                        showDoubleBorder={true}
                        onClick={() => onSelectProduct(product)}
                      >
                        {/* Badges Overlay */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20 pointer-events-none">
                          {product.isNew && (
                            <span className="px-2 py-0.5 rounded-2xs bg-[#9E472A] text-white text-[9px] font-cinzel font-semibold tracking-wider uppercase shadow-xs">
                              NEW
                            </span>
                          )}
                          {product.isBestSeller && !product.isNew && (
                            <span className="px-2 py-0.5 rounded-2xs bg-[#523A30] text-white text-[9px] font-cinzel font-semibold tracking-wider uppercase shadow-xs">
                              BEST SELLER
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="px-2 py-0.5 rounded-2xs bg-[#2D6A4F] text-white text-[9px] font-cinzel font-semibold tracking-wider shadow-xs">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          aria-label="Toggle Wishlist"
                          className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C2420] hover:text-[#9E472A] shadow-md transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isFav ? 'fill-[#9E472A] text-[#9E472A]' : ''
                            }`}
                          />
                        </button>

                        {/* Quick Shop Button Appearing on Hover */}
                        <div className="absolute inset-x-2 bottom-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickShopProduct(product);
                            }}
                            className="w-full py-2 px-2 bg-white/95 backdrop-blur-xs text-[#2C2420] hover:bg-[#9E472A] hover:text-white text-[10px] font-cinzel font-bold tracking-wider uppercase rounded shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#DFCBB8]"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>QUICK SHOP</span>
                          </button>
                        </div>
                      </IndianArchCard>
                    </div>

                    {/* Product Details */}
                    <div className="mt-3.5 space-y-1">
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-[#7A6F68] font-cinzel">
                        <span className="tracking-widest uppercase text-[#9E472A] font-medium truncate">
                          {product.category} • {product.gender}
                        </span>
                        <div className="flex items-center gap-1 text-[#C29342] shrink-0">
                          <Star className="w-3 h-3 fill-[#C29342] stroke-none" />
                          <span className="font-semibold text-[#2C2420]">{product.rating}</span>
                          <span className="text-[10px] text-[#7A6F68]">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-cinzel text-sm sm:text-base font-bold text-[#2C2420] group-hover:text-[#9E472A] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {/* Fabric / Craftsmanship Tag */}
                      <p className="font-serif-luxury italic text-xs text-[#685C54] line-clamp-1">
                        {product.fabric}
                      </p>

                      {/* Color swatches preview */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {product.colors.map((c) => (
                            <span
                              key={c.name}
                              title={c.name}
                              className="w-3 h-3 rounded-full border border-[#DFCBB8]"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          <span className="text-[10px] text-[#7A6F68] font-cinzel ml-1">
                            {product.colors.length} shades
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Section */}
                  <div className="mt-3 pt-2.5 border-t border-[#DFCBB8]/60 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-cinzel text-sm sm:text-base font-bold text-[#2C2420]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="font-cinzel text-xs text-[#9E8B7F] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setQuickShopProduct(product)}
                      className="text-[11px] font-cinzel text-[#9E472A] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Select Size</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Filter & Refine Slide-Over Drawer (Mukti & Kavith Casa Style) */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            onClick={() => setFilterDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl border-l border-[#DFCBB8] flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[#DFCBB8] flex items-center justify-between bg-[#F3E8DB]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9E472A]" />
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#2C2420]">
                    FILTER & REFINE
                  </h3>
                </div>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/60 text-[#2C2420] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                
                {/* 1. Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider">
                      Max Price: ₹{priceRange.toLocaleString('en-IN')}
                    </label>
                    <span className="text-[11px] font-cinzel text-[#7A6F68]">Up to ₹40,000</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="40000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#9E472A] cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] font-cinzel text-[#7A6F68] mt-1">
                    <span>₹3,000</span>
                    <span>₹20,000</span>
                    <span>₹40,000+</span>
                  </div>
                </div>

                {/* 2. Gender / Department */}
                <div className="pt-4 border-t border-[#DFCBB8]">
                  <label className="block text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider mb-2.5">
                    Gender & Atelier
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Women', 'Men', 'Kids', 'Unisex'].map((g) => {
                      const selected = selectedGenders.includes(g);
                      return (
                        <button
                          key={g}
                          onClick={() => {
                            if (selected) {
                              setSelectedGenders(selectedGenders.filter((x) => x !== g));
                            } else {
                              setSelectedGenders([...selectedGenders, g]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-cinzel rounded border transition-all cursor-pointer ${
                            selected
                              ? 'bg-[#9E472A] text-white border-[#9E472A] font-bold shadow-xs'
                              : 'bg-white text-[#2C2420] border-[#DFCBB8] hover:border-[#9E472A]'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Product Category */}
                <div className="pt-4 border-t border-[#DFCBB8]">
                  <label className="block text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider mb-2.5">
                    Category / Garment Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((cat) => {
                      const selected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            if (selected) {
                              setSelectedCategories(selectedCategories.filter((x) => x !== cat));
                            } else {
                              setSelectedCategories([...selectedCategories, cat]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-cinzel rounded border transition-all cursor-pointer ${
                            selected
                              ? 'bg-[#9E472A] text-white border-[#9E472A] font-bold shadow-xs'
                              : 'bg-white text-[#2C2420] border-[#DFCBB8] hover:border-[#9E472A]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Fabric & Textile Type */}
                <div className="pt-4 border-t border-[#DFCBB8]">
                  <label className="block text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider mb-2.5">
                    Heritage Fabric & Weave
                  </label>
                  <div className="space-y-2">
                    {availableFabrics.map((fab) => {
                      const selected = selectedFabrics.includes(fab);
                      return (
                        <label
                          key={fab}
                          className="flex items-center gap-2.5 text-xs text-[#2C2420] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFabrics([...selectedFabrics, fab]);
                              } else {
                                setSelectedFabrics(selectedFabrics.filter((x) => x !== fab));
                              }
                            }}
                            className="rounded border-[#DFCBB8] text-[#9E472A] focus:ring-[#9E472A] cursor-pointer"
                          />
                          <span className="font-serif-luxury">{fab}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Occasion Filter */}
                <div className="pt-4 border-t border-[#DFCBB8]">
                  <label className="block text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider mb-2.5">
                    Celebration / Occasion
                  </label>
                  <div className="space-y-2">
                    {availableOccasions.map((occ) => {
                      const selected = selectedOccasions.includes(occ);
                      return (
                        <label
                          key={occ}
                          className="flex items-center gap-2.5 text-xs text-[#2C2420] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOccasions([...selectedOccasions, occ]);
                              } else {
                                setSelectedOccasions(selectedOccasions.filter((x) => x !== occ));
                              }
                            }}
                            className="rounded border-[#DFCBB8] text-[#9E472A] focus:ring-[#9E472A] cursor-pointer"
                          />
                          <span className="font-cinzel text-xs">{occ}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Availability & Special Deals */}
                <div className="pt-4 border-t border-[#DFCBB8] space-y-3">
                  <label className="block text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider">
                    Special Options
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#2C2420] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyReadyToShip}
                      onChange={(e) => setOnlyReadyToShip(e.target.checked)}
                      className="rounded border-[#DFCBB8] text-[#9E472A] focus:ring-[#9E472A] cursor-pointer"
                    />
                    <span className="font-cinzel text-xs">Ready to Ship (Express Delivery)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#2C2420] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyOnSale}
                      onChange={(e) => setOnlyOnSale(e.target.checked)}
                      className="rounded border-[#DFCBB8] text-[#9E472A] focus:ring-[#9E472A] cursor-pointer"
                    />
                    <span className="font-cinzel text-xs">Special Atelier Offers (% Off)</span>
                  </label>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 sm:p-6 border-t border-[#DFCBB8] bg-[#FAF6F0] flex items-center gap-3">
                <button
                  onClick={handleClearAllFilters}
                  className="w-1/2 py-2.5 px-4 bg-white border border-[#DFCBB8] text-[#2C2420] text-xs font-cinzel font-semibold rounded uppercase tracking-wider hover:bg-[#F3E8DB] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-[#9E472A] text-white text-xs font-cinzel font-semibold rounded uppercase tracking-wider hover:bg-[#80331A] shadow-md transition-colors cursor-pointer"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. Quick Shop Modal */}
      <QuickShopModal
        product={quickShopProduct}
        isOpen={!!quickShopProduct}
        onClose={() => setQuickShopProduct(null)}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
        onOpenFullDetail={onSelectProduct}
        onOpenSizeGuide={onOpenSizeGuide}
      />

      {/* 7. Bottom Bespoke Atelier Promise Banner */}
      <section className="bg-[#FAF6F0] border-t border-[#DFCBB8] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto border border-[#DFCBB8]">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#2C2420] uppercase">
                Bespoke Fit Customization
              </h4>
              <p className="text-[11px] text-[#685C54] leading-relaxed">
                Made-to-measure tailoring for your exact posture & silhouettes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto border border-[#DFCBB8]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#2C2420] uppercase">
                100% Certified Handlooms
              </h4>
              <p className="text-[11px] text-[#685C54] leading-relaxed">
                Authentic silk mark certified weaves supporting hereditary master weavers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto border border-[#DFCBB8]">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#2C2420] uppercase">
                Worldwide Insured Express
              </h4>
              <p className="text-[11px] text-[#685C54] leading-relaxed">
                Complimentary shipping across India on all couture orders above ₹2,999.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto border border-[#DFCBB8]">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#2C2420] uppercase">
                Virtual & Studio Styling
              </h4>
              <p className="text-[11px] text-[#685C54] leading-relaxed">
                Personal consultation with Shikha Warule & senior atelier stylists.
              </p>
            </div>
          </div>

          {/* Bespoke Callout Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-[#523A30] to-[#2C2420] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#DFCBB8]/30">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-cinzel text-[#DFCBB8] tracking-widest uppercase">
                Signature Atelier Experience
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
                Need a Custom Silhouette or Trousseau Consultation?
              </h3>
              <p className="text-xs text-[#DFCBB8] max-w-xl font-serif-luxury italic">
                From fabric selection and custom zardozi motifs to bespoke trials, our master couturiers craft for your special moments.
              </p>
            </div>
            <button
              onClick={onOpenAppointment}
              className="px-6 py-3 bg-[#9E472A] hover:bg-[#80331A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase transition-colors whitespace-nowrap cursor-pointer shadow-md"
            >
              Book Atelier Consultation
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
