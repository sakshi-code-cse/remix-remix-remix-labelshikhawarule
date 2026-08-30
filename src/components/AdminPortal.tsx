import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Calendar, 
  Tag, 
  MessageSquareQuote, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  LogOut, 
  Sparkles, 
  Check, 
  X, 
  Eye, 
  Download, 
  ChevronRight, 
  Layers, 
  Truck, 
  AlertCircle,
  Scissors,
  Users,
  Image as ImageIcon,
  Tv,
  FileText,
  Settings,
  Globe,
  Sliders,
  Save,
  Menu,
  ChevronDown,
  Info,
  Star,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Palette,
  Upload,
  UploadCloud,
  ImagePlus,
  Laptop,
  ArrowUp,
  ArrowDown,
  Type,
  Crown,
  Maximize2,
  Crop,
  Play,
  Cloud,
  Database,
  Zap,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ImageResizerModal } from './ImageResizerModal';
import { 
  Product, 
  AdminOrder, 
  AdminAppointment, 
  PromoCode, 
  ClientDiary,
  CustomerUser,
  HeroCMSContent,
  BrandStoryCMSContent,
  StoreSettingsCMSContent,
  LogoCMSContent,
  StyleCategory,
  CategoryItem,
  DiscoveryStory
} from '../types';
import { INITIAL_LOGO_CMS } from '../data/mockData';
import { compressImageFile, compressDataUrl } from '../utils/imageCompressor';

interface AdminPortalProps {
  products: Product[];
  orders: AdminOrder[];
  appointments: AdminAppointment[];
  promoCodes: PromoCode[];
  clientDiaries: ClientDiary[];
  announcementText: string;
  heroCMS: HeroCMSContent;
  brandStoryCMS: BrandStoryCMSContent;
  storeSettingsCMS: StoreSettingsCMSContent;
  logoCMS?: LogoCMSContent;
  stylesList: StyleCategory[];
  categoriesList: CategoryItem[];
  discoveryStories: DiscoveryStory[];
  customers: CustomerUser[];
  onUpdateAnnouncement: (text: string) => void;
  onUpdateHeroCMS: (content: HeroCMSContent) => void;
  onUpdateBrandStoryCMS: (content: BrandStoryCMSContent) => void;
  onUpdateStoreSettingsCMS: (content: StoreSettingsCMSContent) => void;
  onUpdateLogoCMS: (content: LogoCMSContent) => void;
  onUpdateStylesList: (list: StyleCategory[]) => void;
  onUpdateCategoriesList: (list: CategoryItem[]) => void;
  onUpdateDiscoveryStories: (list: DiscoveryStory[]) => void;
  onUpdateClientDiaries: (list: ClientDiary[]) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: AdminOrder['orderStatus']) => void;
  onUpdateAppointmentStatus: (aptId: string, status: AdminAppointment['status']) => void;
  onAddPromoCode: (promo: PromoCode) => void;
  onDeletePromoCode: (code: string) => void;
  onCloseAdminPortal: () => void;
  onLogout: () => void;
  adminEmail: string;
}

type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'orders' 
  | 'appointments' 
  | 'customers' 
  | 'cms-logo'
  | 'cms-hero' 
  | 'cms-announcement' 
  | 'cms-collections' 
  | 'cms-stories' 
  | 'cms-diaries' 
  | 'cms-brand' 
  | 'cms-footer' 
  | 'promo' 
  | 'settings';

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  alert?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  appointments,
  promoCodes,
  clientDiaries,
  announcementText,
  heroCMS,
  brandStoryCMS,
  storeSettingsCMS,
  logoCMS,
  stylesList,
  categoriesList,
  discoveryStories,
  customers,
  onUpdateAnnouncement,
  onUpdateHeroCMS,
  onUpdateBrandStoryCMS,
  onUpdateStoreSettingsCMS,
  onUpdateLogoCMS,
  onUpdateStylesList,
  onUpdateCategoriesList,
  onUpdateDiscoveryStories,
  onUpdateClientDiaries,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateAppointmentStatus,
  onAddPromoCode,
  onDeletePromoCode,
  onCloseAdminPortal,
  onLogout,
  adminEmail,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Local CMS Draft States
  const [heroForm, setHeroForm] = useState<HeroCMSContent>(heroCMS);
  const [announcementDraft, setAnnouncementDraft] = useState(announcementText);
  const [brandStoryForm, setBrandStoryForm] = useState<BrandStoryCMSContent>(brandStoryCMS);
  const [storeSettingsForm, setStoreSettingsForm] = useState<StoreSettingsCMSContent>(storeSettingsCMS);
  const [logoForm, setLogoForm] = useState<LogoCMSContent>(logoCMS || INITIAL_LOGO_CMS);

  // Sync draft states when cloud props update in real-time
  useEffect(() => {
    if (logoCMS) setLogoForm(logoCMS);
  }, [logoCMS]);

  useEffect(() => {
    if (heroCMS) setHeroForm(heroCMS);
  }, [heroCMS]);

  useEffect(() => {
    if (announcementText) setAnnouncementDraft(announcementText);
  }, [announcementText]);

  useEffect(() => {
    if (brandStoryCMS) setBrandStoryForm(brandStoryCMS);
  }, [brandStoryCMS]);

  useEffect(() => {
    if (storeSettingsCMS) setStoreSettingsForm(storeSettingsCMS);
  }, [storeSettingsCMS]);
  
  // Product Filters & Modals
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order Filters & Modal
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<AdminOrder | null>(null);

  // Appointment Filters
  const [appointmentFilter, setAppointmentFilter] = useState('All');

  // Customer Directory Search
  const [customerSearch, setCustomerSearch] = useState('');

  // Promo Code Form
  const [newPromoCode, setNewPromoCode] = useState<PromoCode>({
    code: '',
    discountPercentage: 15,
    minOrder: 3000,
    description: '',
  });

  // Story Form State
  const [editingStory, setEditingStory] = useState<DiscoveryStory | null>(null);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [storyForm, setStoryForm] = useState<DiscoveryStory>({
    id: `story-${Date.now()}`,
    title: '',
    subtitle: '',
    thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
    videoDuration: '02:45',
    description: '',
    craftsmanshipDetail: '',
    artisanQuote: '',
    artisanName: '',
    tags: ['Handloom', 'Silk'],
  });

  // Style Form State (Shop By Style)
  const [editingStyle, setEditingStyle] = useState<StyleCategory | null>(null);
  const [isAddStyleOpen, setIsAddStyleOpen] = useState(false);
  const [styleForm, setStyleForm] = useState<StyleCategory>({
    id: `style-${Date.now()}`,
    title: '',
    accentText: 'Pure Handloom Silks',
    description: 'Bespoke tailoring handcrafted with pure heritage weaves.',
    itemCount: 18,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
  });

  // Category / Collection Form State (Shop By Collection)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryItem>({
    id: `cat-${Date.now()}`,
    title: '',
    slug: '',
    itemCount: 16,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
  });

  // Client Diary Form State
  const [isAddDiaryOpen, setIsAddDiaryOpen] = useState(false);
  const [diaryForm, setDiaryForm] = useState<ClientDiary>({
    id: `diary-${Date.now()}`,
    author: '',
    city: 'Mumbai',
    quote: '',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    outfit: 'Festive Raw Silk Ensemble',
    date: 'August 2025',
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
    const paidRevenue = orders
      .filter((ord) => ord.paymentStatus === 'Paid')
      .reduce((sum, ord) => sum + ord.total, 0);
    const pendingOrders = orders.filter((ord) => ord.orderStatus === 'Processing' || ord.orderStatus === 'Handcrafting').length;
    const pendingAppointments = appointments.filter((apt) => apt.status === 'Pending' || apt.status === 'Confirmed').length;
    const inStockCount = products.filter((p) => p.inStock).length;
    const totalProducts = products.length;

    return {
      totalRevenue: totalRevenue + 1420000,
      recentStoreRevenue: totalRevenue,
      paidRevenue,
      pendingOrders,
      pendingAppointments,
      inStockCount,
      totalProducts,
    };
  }, [orders, appointments, products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.fabric.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.city.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'All') return appointments;
    return appointments.filter((a) => a.status === appointmentFilter);
  }, [appointments, appointmentFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customers, customerSearch]);

  // Handle Save Hero CMS
  const handleSaveHeroCMS = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHeroCMS(heroForm);
  };

  // Handle Save Brand Story CMS
  const handleSaveBrandStory = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrandStoryCMS(brandStoryForm);
  };

  // Handle Save Store Settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettingsCMS(storeSettingsForm);
    if (storeSettingsForm.announcementTicker) {
      onUpdateAnnouncement(storeSettingsForm.announcementTicker);
    }
  };

  // Save Announcement Bar
  const handleSaveAnnouncement = () => {
    onUpdateAnnouncement(announcementDraft);
  };

  // Handle Save Logo CMS
  const handleSaveLogoCMS = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateLogoCMS(logoForm);
  };

  // Handle Reset Logo CMS to Default
  const handleResetLogoCMS = () => {
    setLogoForm(INITIAL_LOGO_CMS);
    onUpdateLogoCMS(INITIAL_LOGO_CMS);
  };

  // Handle Custom Logo Image File Upload
  const handleLogoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isDarkVariant = false) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploadProgressMsg('Optimizing brand logo for cloud database...');
    try {
      const compressedDataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 400, quality: 0.9 });
      if (compressedDataUrl) {
        if (isDarkVariant) {
          setLogoForm((prev) => ({ ...prev, customImageDarkUrl: compressedDataUrl }));
        } else {
          setLogoForm((prev) => ({
            ...prev,
            logoType: 'custom-image',
            customImageUrl: compressedDataUrl,
          }));
        }
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          if (isDarkVariant) {
            setLogoForm((prev) => ({ ...prev, customImageDarkUrl: result }));
          } else {
            setLogoForm((prev) => ({
              ...prev,
              logoType: 'custom-image',
              customImageUrl: result,
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgressMsg('');
    }
  };

  // State for Drag & Drop in Hero Banner Manager
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);

  // State for Hero & Product Crop & Resizer Modal
  const [resizerModalOpen, setResizerModalOpen] = useState<boolean>(false);
  const [resizerImageSrc, setResizerImageSrc] = useState<string>('');
  const [resizerSlideIndex, setResizerSlideIndex] = useState<number | null>(null);
  const [resizerSlideTitle, setResizerSlideTitle] = useState<string>('Hero Banner');
  const [resizerMode, setResizerMode] = useState<'hero' | 'product' | 'general'>('hero');
  const [resizerSaveCallback, setResizerSaveCallback] = useState<((croppedUrl: string) => void) | null>(null);

  // Product Form Specific Image State
  const [productFormImage, setProductFormImage] = useState<string>('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop');
  const [productFormHoverImage, setProductFormHoverImage] = useState<string>('');
  const [productFormGallery, setProductFormGallery] = useState<string[]>([]);
  const [isDraggingProductImage, setIsDraggingProductImage] = useState<boolean>(false);
  const [isDraggingHoverImage, setIsDraggingHoverImage] = useState<boolean>(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState<boolean>(false);
  const [isDraggingStyleModalImage, setIsDraggingStyleModalImage] = useState<boolean>(false);
  const [isDraggingCategoryModalImage, setIsDraggingCategoryModalImage] = useState<boolean>(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string>('');

  const openImageResizer = (
    imageSrc: string,
    mode: 'hero' | 'product' | 'general',
    title: string,
    onSaveCropped: (croppedUrl: string) => void
  ) => {
    if (!imageSrc) return;
    setResizerImageSrc(imageSrc);
    setResizerMode(mode);
    setResizerSlideTitle(title);
    setResizerSlideIndex(null);
    setResizerSaveCallback(() => onSaveCropped);
    setResizerModalOpen(true);
  };

  const handleOpenResizer = (index: number | null, imageSrc: string, title?: string) => {
    if (!imageSrc) return;
    setResizerImageSrc(imageSrc);
    setResizerSlideIndex(index);
    setResizerMode('hero');
    setResizerSlideTitle(title || (index !== null ? `Slide #${index + 1}` : 'Hero Banner'));
    setResizerSaveCallback(null);
    setResizerModalOpen(true);
  };

  const handleOpenProductImageResizer = (imageSrc: string, title: string = 'Garment Primary Image', isHover: boolean = false) => {
    if (!imageSrc) return;
    openImageResizer(
      imageSrc,
      'product',
      title,
      (croppedUrl) => {
        if (isHover) {
          setProductFormHoverImage(croppedUrl);
        } else {
          setProductFormImage(croppedUrl);
        }
      }
    );
  };

  const handleProductImageUploadFromFile = async (file: File, isHover: boolean = false) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploadProgressMsg('Optimizing & loading photo from device...');
    try {
      const compressedDataUrl = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1333, quality: 0.84 });
      if (compressedDataUrl) {
        if (isHover) {
          setProductFormHoverImage(compressedDataUrl);
        } else {
          setProductFormImage(compressedDataUrl);
        }
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (dataUrl) {
          if (isHover) {
            setProductFormHoverImage(dataUrl);
          } else {
            setProductFormImage(dataUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgressMsg('');
    }
  };

  const handleProductGalleryUploadFromFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadProgressMsg(`Uploading ${files.length} gallery photo(s)...`);
    const newImgs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        try {
          const compressed = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1333, quality: 0.84 });
          if (compressed) newImgs.push(compressed);
        } catch {
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) || '');
            reader.readAsDataURL(file);
          });
          if (dataUrl) newImgs.push(dataUrl);
        }
      }
    }
    if (newImgs.length > 0) {
      setProductFormGallery((prev) => [...prev, ...newImgs]);
    }
    setUploadProgressMsg('');
  };

  const handleStoryImageUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 1000, quality: 0.84 });
      if (dataUrl) {
        openImageResizer(
          dataUrl,
          'product',
          'Watch Discovery Reel Thumbnail (4:5)',
          (cropped) => {
            setStoryForm((prev) => ({ ...prev, thumbnail: cropped }));
          }
        );
      }
    } catch {
      // Fallback
    }
  };

  const handleStyleImageUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploadProgressMsg('Optimizing & loading style photo from computer...');
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 900, maxHeight: 1200, quality: 0.86 });
      if (dataUrl) {
        setStyleForm((prev) => ({ ...prev, image: dataUrl }));
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (dataUrl) setStyleForm((prev) => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgressMsg('');
    }
  };

  const handleInlineStyleImageUpload = async (styleIdx: number, file: File) => {
    if (!file || !file.type.startsWith('image/') || styleIdx < 0 || styleIdx >= stylesList.length) return;
    setUploadProgressMsg('Updating style photo directly from computer...');
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 900, maxHeight: 1200, quality: 0.86 });
      if (dataUrl) {
        const updated = [...stylesList];
        updated[styleIdx] = { ...updated[styleIdx], image: dataUrl };
        onUpdateStylesList(updated);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (dataUrl) {
          const updated = [...stylesList];
          updated[styleIdx] = { ...updated[styleIdx], image: dataUrl };
          onUpdateStylesList(updated);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgressMsg('');
    }
  };

  const handleCategoryImageUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploadProgressMsg('Optimizing & loading collection photo from computer...');
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 900, maxHeight: 1200, quality: 0.86 });
      if (dataUrl) {
        setCategoryForm((prev) => ({ ...prev, image: dataUrl }));
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (dataUrl) setCategoryForm((prev) => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgressMsg('');
    }
  };

  const handleInlineCategoryImageUpload = async (catIdx: number, file: File) => {
    if (!file || !file.type.startsWith('image/') || catIdx < 0 || catIdx >= categoriesList.length) return;
    setUploadProgressMsg('Updating collection photo directly from computer...');
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 900, maxHeight: 1200, quality: 0.86 });
      if (dataUrl) {
        const updated = [...categoriesList];
        updated[catIdx] = { ...updated[catIdx], image: dataUrl };
        onUpdateCategoriesList(updated);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (dataUrl) {
          const updated = [...categoriesList];
          updated[catIdx] = { ...updated[catIdx], image: dataUrl };
          onUpdateCategoriesList(updated);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgressMsg('');
    }
  };

  const moveDiscoveryStory = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= discoveryStories.length) return;
    const list = [...discoveryStories];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);
    onUpdateDiscoveryStories(list);
  };

  const moveStyle = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= stylesList.length) return;
    const list = [...stylesList];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);
    onUpdateStylesList(list);
  };

  const moveCategory = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categoriesList.length) return;
    const list = [...categoriesList];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);
    onUpdateCategoriesList(list);
  };

  const handleSaveResizedImage = (croppedDataUrl: string) => {
    if (resizerSaveCallback) {
      resizerSaveCallback(croppedDataUrl);
      return;
    }

    if (resizerSlideIndex !== null) {
      setHeroForm((prev) => {
        const list = [...(prev.bannerImages || [])];
        list[resizerSlideIndex] = croppedDataUrl;
        return {
          ...prev,
          bannerImages: list,
          heroImage: resizerSlideIndex === 0 ? croppedDataUrl : (prev.heroImage || croppedDataUrl),
        };
      });
    } else {
      // New Banner addition
      setHeroForm((prev) => {
        const currentBanners = (prev.bannerImages || []).filter((img) => img && img.trim() !== '');
        return {
          ...prev,
          heroImage: croppedDataUrl,
          bannerImages: [croppedDataUrl, ...currentBanners],
        };
      });
    }
  };

  // Handle Single or Multiple Hero Banner Uploads from Computer
  const handleHeroBannerUploadFromFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    // If single image uploaded, directly open the interactive resizer & cropper!
    if (fileArray.length === 1) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (dataUrl) {
          handleOpenResizer(null, dataUrl, 'New Uploaded Banner');
        }
      };
      reader.readAsDataURL(fileArray[0]);
      return;
    }

    const readPromises = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve((e.target?.result as string) || '');
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newImages) => {
      const validNew = newImages.filter((img) => img && img.trim() !== '');
      if (validNew.length === 0) return;

      setHeroForm((prev) => {
        const currentBanners = (prev.bannerImages || []).filter((img) => img && img.trim() !== '');
        const updatedBanners = [...validNew, ...currentBanners];
        return {
          ...prev,
          heroImage: validNew[0],
          bannerImages: updatedBanners,
        };
      });
    });
  };

  const handleHeroBannerFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleHeroBannerUploadFromFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleReplaceBannerSlide = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setHeroForm((prev) => {
            const list = [...(prev.bannerImages || [])];
            list[index] = result;
            return {
              ...prev,
              bannerImages: list,
              heroImage: index === 0 ? result : (prev.heroImage || result),
            };
          });
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleRemoveBannerSlide = (index: number) => {
    setHeroForm((prev) => {
      const list = [...(prev.bannerImages || [])];
      list.splice(index, 1);
      const newPrimary = list.length > 0 ? list[0] : '';
      return {
        ...prev,
        bannerImages: list,
        heroImage: newPrimary,
      };
    });
  };

  const handleSetPrimaryBannerSlide = (index: number) => {
    setHeroForm((prev) => {
      const list = [...(prev.bannerImages || [])];
      if (index > 0 && index < list.length) {
        const [selected] = list.splice(index, 1);
        list.unshift(selected);
      }
      return {
        ...prev,
        bannerImages: list,
        heroImage: list[0] || '',
      };
    });
  };

  const handleMoveBannerSlide = (index: number, direction: 'up' | 'down') => {
    setHeroForm((prev) => {
      const list = [...(prev.bannerImages || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < list.length) {
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;
      }
      return {
        ...prev,
        bannerImages: list,
        heroImage: list[0] || '',
      };
    });
  };

  const handleAddPresetBanner = (url: string) => {
    setHeroForm((prev) => {
      const list = [...(prev.bannerImages || [])];
      if (!list.includes(url)) {
        list.push(url);
      }
      return {
        ...prev,
        bannerImages: list,
        heroImage: prev.heroImage || url,
      };
    });
  };

  // Vertical Navigation Items Hierarchy
  const navSections: NavSection[] = [
    {
      title: 'ATELIER OPERATIONS',
      items: [
        { id: 'overview', label: 'Overview & Insights', icon: LayoutDashboard, count: undefined },
        { id: 'products', label: 'Products & Inventory', icon: Package, count: products.length },
        { id: 'orders', label: 'Orders & Logistics', icon: ShoppingBag, count: orders.length, alert: metrics.pendingOrders > 0 },
        { id: 'appointments', label: 'Bespoke Consultations', icon: Calendar, count: appointments.length, alert: metrics.pendingAppointments > 0 },
        { id: 'customers', label: 'Client Directory & VIPs', icon: Users, count: customers.length },
      ]
    },
    {
      title: 'CONTENT MANAGEMENT (CMS)',
      items: [
        { id: 'cms-logo', label: 'Brand Logo & Typography', icon: Palette, badge: 'Live' },
        { id: 'cms-hero', label: 'Hero Banners & Quotes', icon: ImageIcon, badge: 'Live' },
        { id: 'cms-announcement', label: 'Announcement & Marquee', icon: Sparkles },
        { id: 'cms-collections', label: 'Styles & Collections', icon: Layers, count: stylesList.length + categoriesList.length },
        { id: 'cms-stories', label: 'Watch Discovery Reels', icon: Tv, count: discoveryStories.length },
        { id: 'cms-diaries', label: 'Client Diaries & UGC', icon: MessageSquareQuote, count: clientDiaries.length },
        { id: 'cms-brand', label: 'Brand Story & Atelier', icon: FileText },
        { id: 'cms-footer', label: 'Footer & Store Policies', icon: Globe },
      ]
    },
    {
      title: 'MARKETING & SYSTEM',
      items: [
        { id: 'promo', label: 'Promo Codes & Offers', icon: Tag, count: promoCodes.length },
        { id: 'settings', label: 'Store & Tax Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAF5F6] text-[#3B0A12] flex flex-col md:flex-row font-sans selection:bg-[#7A1526] selection:text-white">
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#380810] border-b border-[#4E0D17] px-4 py-3 flex items-center justify-between z-30 sticky top-0 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <div 
            onClick={onCloseAdminPortal}
            title="View Live Storefront"
            className="bg-white px-2.5 py-1 rounded-lg border border-[#F0D5DA] shadow-xs flex items-center justify-center cursor-pointer"
          >
            <BrandLogo size="sm" logoCMS={logoCMS} />
          </div>
          <span className="text-[10px] uppercase font-cinzel font-bold bg-[#7A1526] text-white px-2.5 py-0.5 rounded shadow-2xs">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[#F5DDE1] hover:bg-[#4E0D17] rounded-lg cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 1. VERTICAL SIDEBAR MENU (Pura Menu in Vertical Format - Fixed & Intact) */}
      <aside className={`fixed md:relative top-0 z-40 h-full w-72 shrink-0 bg-[#380810] border-r border-[#4E0D17] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 select-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header: Brand & Status */}
        <div className="p-4 border-b border-[#4E0D17] shrink-0">
          <div 
            onClick={onCloseAdminPortal}
            title="Click to view live website homepage"
            className="bg-white p-3.5 rounded-xl border border-[#F0D5DA] shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group"
          >
            <BrandLogo size="md" logoCMS={logoCMS} />
            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-cinzel font-bold text-[#7A1526] tracking-wider uppercase opacity-90 group-hover:opacity-100">
              <span>Atelier Admin</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-[#4E0D17] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#52C41A] animate-pulse" />
              <span className="text-[#F5DDE1] font-medium text-[11px] truncate max-w-[130px]" title={adminEmail}>
                {adminEmail.split('@')[0]}
              </span>
            </div>
            <span className="text-[9px] font-cinzel font-bold text-[#FCEEF0] bg-[#4E0D17] px-2 py-0.5 rounded border border-[#7A1526]/60 uppercase">
              Principal Staff
            </span>
          </div>
        </div>

        {/* Scrollable Vertical Menu List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-cinzel font-bold tracking-[0.18em] text-[#E3BAC2] uppercase block">
                {section.title}
              </span>
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#4A0E17] font-bold shadow-md shadow-black/10'
                          : 'text-[#F5DDE1] hover:bg-[#4E0D17] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#7A1526]' : 'text-[#D9AAB3]'}`} />
                        <span className="tracking-wide">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isActive ? 'bg-[#7A1526]/15 text-[#7A1526]' : 'bg-[#4E0D17] text-[#FCEEF0]'
                          }`}>
                            {item.badge}
                          </span>
                        )}

                        {item.alert && (
                          <span className="w-2 h-2 rounded-full bg-[#7A1526] animate-ping" />
                        )}

                        {item.count !== undefined && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                            isActive ? 'bg-[#7A1526]/10 text-[#7A1526]' : 'bg-[#2D060C] text-[#E3BAC2]'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Back to Storefront & Logout */}
        <div className="p-4 border-t border-[#4E0D17] bg-[#2D060C] space-y-2 shrink-0">
          <button
            onClick={onCloseAdminPortal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#4E0D17] hover:bg-[#60121E] text-white text-xs font-cinzel font-semibold transition-all border border-[#7A1526] cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F5DDE1]" />
            <span>View Live Storefront</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[#E3BAC2] hover:text-[#FF7875] hover:bg-[#4E0D17] text-xs font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT VIEW CANVAS */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#FAF5F6] flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#F0D5DA] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <div 
              onClick={onCloseAdminPortal}
              title="Click to preview live homepage" 
              className="cursor-pointer hover:opacity-90 transition-opacity hidden sm:block shrink-0 pr-4 border-r border-[#F0D5DA]"
            >
              <BrandLogo size="sm" logoCMS={logoCMS} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7E4A53]">
                <span>Label Shikha Warule</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#7A1526] font-medium uppercase font-cinzel">
                  {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-[#3B0A12] tracking-wide mt-0.5">
                {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6FFED] border border-[#B7EB8F] text-[#389E0D] text-xs font-cinzel">
              <span className="w-2 h-2 rounded-full bg-[#52C41A] animate-pulse" />
              <Database className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wide">Firestore Live Sync</span>
            </div>

            <button
              onClick={onCloseAdminPortal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7A1526] via-[#851628] to-[#991B30] hover:from-[#61101E] hover:to-[#801426] text-white rounded-lg text-xs font-cinzel font-semibold shadow-md transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Live Site</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Panels */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          
          {/* TAB 1: OVERVIEW & INSIGHTS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white p-5 rounded-xl border border-[#F0D5DA] shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-semibold text-[#7E4A53] uppercase tracking-wider">Gross Couture Revenue</span>
                    <div className="p-2 rounded-lg bg-[#7A1526]/20 text-[#7A1526]">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-bold font-serif-luxury text-[#3B0A12]">
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#52C41A]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% this festive season</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#F0D5DA] shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-semibold text-[#7E4A53] uppercase tracking-wider">Active Orders</span>
                    <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#85A5FF]">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-bold font-serif-luxury text-[#3B0A12]">
                    {orders.length} <span className="text-xs text-[#7E4A53] font-sans font-normal">({metrics.pendingOrders} in craft)</span>
                  </div>
                  <div className="mt-2 text-xs text-[#6B3740]">
                    ₹{metrics.paidRevenue.toLocaleString('en-IN')} successfully settled
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#F0D5DA] shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-semibold text-[#7E4A53] uppercase tracking-wider">Bespoke Consultations</span>
                    <div className="p-2 rounded-lg bg-[#FDF2F4] text-[#7A1526]">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-bold font-serif-luxury text-[#3B0A12]">
                    {appointments.length}
                  </div>
                  <div className="mt-2 text-xs text-[#52C41A] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{metrics.pendingAppointments} scheduled for studio</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#F0D5DA] shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-semibold text-[#7E4A53] uppercase tracking-wider">Active Catalog</span>
                    <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#73D13D]">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-bold font-serif-luxury text-[#3B0A12]">
                    {metrics.totalProducts} <span className="text-xs text-[#7E4A53] font-sans font-normal">({metrics.inStockCount} In Stock)</span>
                  </div>
                  <div className="mt-2 text-xs text-[#6B3740]">
                    4 Style Collections • 6 Categories
                  </div>
                </div>
              </div>

              {/* Quick CMS Action Cards */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7A1526]" />
                    QUICK CONTENT MANAGEMENT SHORTCUTS
                  </h2>
                  <span className="text-xs text-[#7E4A53]">Direct visual content triggers</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('cms-hero')}
                    className="p-4 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[#7A1526] mb-1">
                      <span className="text-xs font-bold font-cinzel">Hero Banner</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#7E4A53]">Change top headlines, sublines & main model arch photo</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('cms-announcement')}
                    className="p-4 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[#7A1526] mb-1">
                      <span className="text-xs font-bold font-cinzel">Top Announcement</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#7E4A53]">Update coupon bar, marquee text & promo highlight</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('cms-stories')}
                    className="p-4 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[#7A1526] mb-1">
                      <span className="text-xs font-bold font-cinzel">Discovery Reels</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#7E4A53]">Manage craft videos, thumbnails and artisan quotes</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('cms-diaries')}
                    className="p-4 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[#7A1526] mb-1">
                      <span className="text-xs font-bold font-cinzel">Client Testimonials</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#7E4A53]">Approve, add or edit luxury client review cards</p>
                  </button>
                </div>
              </div>

              {/* Recent Orders & Appointments Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-[#F0D5DA] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
                    <h3 className="font-cinzel text-sm font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#7A1526]" />
                      RECENT COUTURE ORDERS
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-cinzel text-[#7A1526] hover:underline"
                    >
                      View All ({orders.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-lg bg-[#FCF4F6] border border-[#F0D5DA] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#3B0A12]">{ord.orderNumber}</span>
                            <span className="text-[#7E4A53]">• {ord.customerName}</span>
                          </div>
                          <div className="text-[11px] text-[#8F6C72]">
                            {ord.items.length} items • {ord.city} • ₹{ord.total.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-[#52C41A]/20 text-[#73D13D]'
                            : ord.orderStatus === 'Handcrafting'
                            ? 'bg-[#E08A68]/20 text-[#7A1526]'
                            : 'bg-[#1890FF]/20 text-[#69C0FF]'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl border border-[#F0D5DA] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
                    <h3 className="font-cinzel text-sm font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#7A1526]" />
                      UPCOMING BESPOKE CONSULTATIONS
                    </h3>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs font-cinzel text-[#7A1526] hover:underline"
                    >
                      View All ({appointments.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {appointments.slice(0, 4).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-lg bg-[#FCF4F6] border border-[#F0D5DA] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-[#3B0A12]">{apt.fullName}</div>
                          <div className="text-[11px] text-[#7A1526]">{apt.experienceType}</div>
                          <div className="text-[10px] text-[#8F6C72] flex items-center gap-2">
                            <span>📅 {apt.date}</span>
                            <span>⏰ {apt.timeSlot}</span>
                            <span>🏛️ {apt.mode}</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          apt.status === 'Confirmed'
                            ? 'bg-[#52C41A]/20 text-[#73D13D]'
                            : apt.status === 'Completed'
                            ? 'bg-white/10 text-[#C4B2A3]'
                            : 'bg-[#FAAD14]/20 text-[#FFC53D]'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Controls Bar */}
              <div className="bg-white p-4 rounded-xl border border-[#F0D5DA] flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E4A53]" />
                    <input
                      type="text"
                      placeholder="Search pieces, fabric, style..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#B59199] focus:outline-none focus:border-[#7A1526]"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Kurtas">Kurtas</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Dupattas">Dupattas</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Sets">Sets</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setProductFormImage('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop');
                    setProductFormHoverImage('');
                    setProductFormGallery([]);
                    setIsAddProductOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Garment</span>
                </button>

              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-[#F0D5DA] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#4A1821]">
                    <thead className="bg-[#FDF2F4] text-[11px] font-cinzel font-bold text-[#3B0A12] uppercase tracking-wider border-b border-[#F0D5DA]">
                      <tr>
                        <th className="p-3.5">Piece</th>
                        <th className="p-3.5">Category & Style</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Fabric</th>
                        <th className="p-3.5">Stock Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0D5DA]">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#FCF4F6]/70 transition-colors">
                          
                          <td className="p-3.5 flex items-center gap-3">
                            <div className="relative group">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-16 object-cover rounded-md border border-[#F0D5DA] shadow-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  openImageResizer(
                                    prod.image,
                                    'product',
                                    `${prod.name} (Lookbook Image)`,
                                    (croppedUrl) => {
                                      onUpdateProduct({ ...prod, image: croppedUrl });
                                    }
                                  );
                                }}
                                title="Resize / Crop image"
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity cursor-pointer text-white"
                              >
                                <Crop className="w-4 h-4 text-[#7A1526]" />
                              </button>
                            </div>
                            <div>
                              <div className="font-semibold text-[#3B0A12] font-serif-luxury text-sm">{prod.name}</div>
                              <div className="text-[10px] text-[#7E4A53]">{prod.gender} • ID: {prod.id}</div>
                              {prod.isBestSeller && (
                                <span className="inline-block mt-0.5 text-[9px] bg-[#7A1526] text-white px-1.5 py-0.2 rounded font-bold">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-medium text-[#3B0A12]">{prod.category}</div>
                            <div className="text-[10px] text-[#7E4A53]">{prod.style} Silhouette</div>
                          </td>

                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-[#3B0A12]">₹{prod.price.toLocaleString('en-IN')}</div>
                            {prod.originalPrice && (
                              <div className="text-[10px] text-[#7E4A53] line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</div>
                            )}
                          </td>

                          <td className="p-3.5 text-[#6B3740]">
                            {prod.fabric}
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => onUpdateProduct({ ...prod, inStock: !prod.inStock })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                                prod.inStock
                                  ? 'bg-[#52C41A]/20 text-[#73D13D] hover:bg-[#52C41A]/30'
                                  : 'bg-[#FF4D4F]/20 text-[#FF7875] hover:bg-[#FF4D4F]/30'
                              }`}
                            >
                              {prod.inStock ? '● In Stock' : '○ Sold Out'}
                            </button>
                          </td>

                          <td className="p-3.5 text-right space-x-2">
                            {/* Quick Upload from Device */}
                            <label
                              className="inline-flex items-center justify-center p-1.5 rounded bg-[#FAF2F4] hover:bg-[#7A1526] text-[#3B0A12] hover:text-white transition-colors cursor-pointer"
                              title="Upload & Replace Image from Device"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#7A1526]" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    try {
                                      const compressed = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1333, quality: 0.84 });
                                      if (compressed) {
                                        onUpdateProduct({ ...prod, image: compressed });
                                      }
                                    } catch {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const dataUrl = (ev.target?.result as string) || '';
                                        if (dataUrl) {
                                          onUpdateProduct({ ...prod, image: dataUrl });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>

                            <button
                              onClick={() => {
                                openImageResizer(
                                  prod.image,
                                  'product',
                                  `${prod.name} (Garment Photo)`,
                                  (croppedUrl) => {
                                    onUpdateProduct({ ...prod, image: croppedUrl });
                                  }
                                );
                              }}
                              className="p-1.5 rounded bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white transition-colors cursor-pointer"
                              title="Resize & Crop Garment Photo (Lookbook 3:4 / 4:5 / 1:1)"
                            >
                              <Crop className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setProductFormImage(prod.image || '');
                                setProductFormHoverImage(prod.hoverImage || '');
                                setProductFormGallery(prod.images || []);
                                setEditingProduct(prod);
                              }}
                              className="p-1.5 rounded bg-[#FAF2F4] hover:bg-[#7A1526] text-white transition-colors cursor-pointer"
                              title="Edit piece"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded bg-[#FAF2F4] hover:bg-[#FF4D4F] text-white transition-colors cursor-pointer"
                              title="Delete piece"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS & LOGISTICS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Filter controls */}
              <div className="bg-white p-4 rounded-xl border border-[#F0D5DA] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E4A53]" />
                  <input
                    type="text"
                    placeholder="Search by order #, client name, city..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#B59199] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-[#7E4A53]">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Handcrafting">Handcrafting</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders List Cards */}
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-[#F0D5DA] p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0D5DA]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-white">{ord.orderNumber}</span>
                        <span className="text-xs text-[#7E4A53]">Placed on {ord.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === 'Paid' ? 'bg-[#52C41A]/20 text-[#73D13D]' : 'bg-[#FAAD14]/20 text-[#FFC53D]'
                        }`}>
                          {ord.paymentStatus} • {ord.paymentMethod}
                        </span>

                        {ord.razorpayPaymentId && (
                          <span className="px-2 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC] text-[10px] font-mono font-bold flex items-center gap-1" title="Verified Razorpay Transaction">
                            <span>⚡ RZP: {ord.razorpayPaymentId}</span>
                          </span>
                        )}

                        <select
                          value={ord.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as AdminOrder['orderStatus'])}
                          className="bg-[#FCF4F6] border border-[#7A1526]/40 rounded px-2.5 py-1 text-xs font-semibold text-[#7A1526] focus:outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Handcrafting">Handcrafting</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrderForInvoice(ord)}
                          className="p-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-white rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Receipt</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Info */}
                      <div>
                        <span className="text-[#7E4A53] block mb-1 uppercase font-cinzel text-[10px]">Client Details</span>
                        <div className="font-semibold text-[#3B0A12]">{ord.customerName}</div>
                        <div className="text-[#6B3740]">{ord.customerEmail}</div>
                        <div className="text-[#6B3740]">{ord.customerPhone}</div>
                        <div className="text-[#8F6C72] mt-1">{ord.shippingAddress}, {ord.city}</div>
                      </div>

                      {/* Items */}
                      <div className="md:col-span-2">
                        <span className="text-[#7E4A53] block mb-1 uppercase font-cinzel text-[10px]">Ensembles Ordered</span>
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-[#FCF4F6] p-2 rounded border border-[#F0D5DA]">
                              <div className="flex items-center gap-2.5">
                                <img src={item.image} alt={item.productName} className="w-8 h-10 object-cover rounded" />
                                <div>
                                  <div className="font-medium text-[#3B0A12]">{item.productName}</div>
                                  <div className="text-[10px] text-[#7E4A53]">Size: {item.size} • Qty: {item.quantity}</div>
                                </div>
                              </div>
                              <div className="font-mono font-bold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex justify-end gap-6 text-xs pt-2 border-t border-[#F0D5DA]">
                          <div><span className="text-[#7E4A53]">Subtotal:</span> ₹{ord.subtotal.toLocaleString('en-IN')}</div>
                          {ord.discount > 0 && <div className="text-[#52C41A]"><span className="text-[#7E4A53]">Discount:</span> -₹{ord.discount.toLocaleString('en-IN')}</div>}
                          <div className="font-bold text-[#7A1526] text-sm"><span className="text-[#7E4A53]">Total:</span> ₹{ord.total.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: BESPOKE APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white p-4 rounded-xl border border-[#F0D5DA] flex items-center justify-between">
                <h2 className="font-cinzel text-sm font-bold text-white tracking-wider">
                  ATELIER CONSULTATION SCHEDULE
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7E4A53]">Filter:</span>
                  <select
                    value={appointmentFilter}
                    onChange={(e) => setAppointmentFilter(e.target.value)}
                    className="bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="All">All Consultations</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-[#F0D5DA] p-5 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif-luxury text-base font-bold text-white">{apt.fullName}</h3>
                        <div className="text-xs text-[#7A1526] font-cinzel font-semibold mt-0.5">{apt.experienceType}</div>
                      </div>

                      <select
                        value={apt.status}
                        onChange={(e) => onUpdateAppointmentStatus(apt.id, e.target.value as AdminAppointment['status'])}
                        className="bg-[#FCF4F6] border border-[#7A1526]/40 rounded px-2 py-1 text-xs font-semibold text-white focus:outline-none"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#6B3740] pt-2 border-t border-[#F0D5DA]">
                      <div>📅 <strong>Date:</strong> {apt.date}</div>
                      <div>⏰ <strong>Time:</strong> {apt.timeSlot}</div>
                      <div>🏛️ <strong>Mode:</strong> {apt.mode}</div>
                      <div>📞 <strong>Phone:</strong> {apt.phone}</div>
                      <div className="col-span-2">✉️ <strong>Email:</strong> {apt.email}</div>
                      {apt.notes && (
                        <div className="col-span-2 text-[#7E4A53] italic bg-[#FCF4F6] p-2 rounded">
                          "{apt.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: CLIENT DIRECTORY & VIP PROFILES */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white p-4 rounded-xl border border-[#F0D5DA] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E4A53]" />
                  <input
                    type="text"
                    placeholder="Search client by name, email, city..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#B59199] focus:outline-none"
                  />
                </div>
                <span className="text-xs text-[#7E4A53]">{filteredCustomers.length} registered clientele profiles</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="bg-white rounded-xl border border-[#F0D5DA] p-5 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      {cust.avatar ? (
                        <img src={cust.avatar} alt={cust.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#7A1526]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#FAF2F4] flex items-center justify-center font-bold text-white text-lg">
                          {cust.name[0]}
                        </div>
                      )}

                      <div>
                        <h3 className="font-cinzel text-sm font-bold text-white">{cust.name}</h3>
                        <div className="text-[11px] text-[#7E4A53]">{cust.city}</div>
                        <span className="inline-block text-[9px] bg-[#7A1526] text-white px-2 py-0.5 rounded font-bold uppercase mt-1">
                          {cust.tier}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#6B3740] pt-3 border-t border-[#F0D5DA]">
                      <div>✉️ {cust.email}</div>
                      <div>📞 {cust.phone}</div>
                      <div className="flex items-center justify-between text-white font-mono pt-1">
                        <span>Couture Points:</span>
                        <strong className="text-[#7A1526]">{cust.couturePoints} pts</strong>
                      </div>
                    </div>

                    {cust.measurements && (
                      <div className="bg-[#FCF4F6] p-3 rounded-lg text-[11px] text-[#7E4A53] space-y-1">
                        <span className="font-cinzel font-bold text-white block text-[10px]">Saved Bespoke Measurements</span>
                        <div className="grid grid-cols-3 gap-1">
                          <div>Bust: {cust.measurements.bust || '–'}</div>
                          <div>Waist: {cust.measurements.waist || '–'}</div>
                          <div>Hip: {cust.measurements.hip || '–'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* CMS TAB 0: BRAND LOGO & CREST CMS */}
          {activeTab === 'cms-logo' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Main CMS Container Card */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-6 shadow-xl">
                
                {/* Header & Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0D5DA]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-cinzel text-lg font-bold text-white tracking-wider">
                        BRAND LOGO & CREST CMS
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-cinzel font-bold bg-[#7A1526]/20 text-[#7A1526] border border-[#7A1526]/40 uppercase">
                        Live Reactive
                      </span>
                    </div>
                    <p className="text-xs text-[#7E4A53] mt-1">
                      Customize the storefront header & footer logo. Upload your own image logo, style the handcrafted vector monogram, or customize the luxury typography.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetLogoCMS}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FCF4F6] text-[#6B3740] hover:text-white rounded-lg text-xs font-cinzel font-semibold border border-[#F0D5DA] transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Default</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveLogoCMS()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white rounded-lg text-xs font-cinzel font-semibold shadow-lg transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Logo Changes</span>
                    </button>
                  </div>
                </div>

                {/* 1. Dual Real-time Live Preview Simulator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-bold text-[#7A1526] uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Dual Live Preview (Header vs Footer Simulation)
                    </span>
                    <span className="text-[11px] text-[#7E4A53] font-cinzel">
                      Current Mode: <strong className="text-white capitalize">{logoForm.logoType.replace('-', ' ')}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Light Background Header Simulation */}
                    <div className="bg-[#FAF6F0] p-6 rounded-xl border border-[#DFCBB8] flex flex-col items-center justify-center min-h-[160px] text-center shadow-inner relative overflow-hidden group">
                      <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-[#2C2420]/10 text-[#2C2420] text-[10px] font-cinzel font-bold">
                        Light Storefront Header
                      </div>
                      <div className="py-3 transform transition-transform group-hover:scale-105">
                        <BrandLogo size="md" logoCMS={logoForm} />
                      </div>
                      <span className="text-[10px] text-[#7A6F68] font-cinzel mt-2 block">
                        Scale: {Math.round((logoForm.heightScale || 1) * 100)}%
                      </span>
                    </div>

                    {/* Dark Background Footer Simulation */}
                    <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] flex flex-col items-center justify-center min-h-[160px] text-center shadow-inner relative overflow-hidden group">
                      <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-white/10 text-[#3B0A12] text-[10px] font-cinzel font-bold">
                        Dark Footer & Navigation
                      </div>
                      <div className="py-3 transform transition-transform group-hover:scale-105">
                        <BrandLogo variant="light" size="md" logoCMS={logoForm} />
                      </div>
                      <span className="text-[10px] text-[#C4B2A3] font-cinzel mt-2 block">
                        Footer Theme Color: <span className="font-mono">{logoForm.footerColorHex || '#F8F2EA'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Format / Architecture Selector (3 Modern Cards) */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-cinzel font-bold text-[#7A1526] uppercase tracking-wider">
                    Select Logo Format & Architecture
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Option 1: Signature Handcrafted Vector Monogram */}
                    <button
                      type="button"
                      onClick={() => setLogoForm({ ...logoForm, logoType: 'svg-monogram' })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        logoForm.logoType === 'svg-monogram'
                          ? 'bg-[#7A1526]/15 border-[#7A1526] shadow-md text-white ring-1 ring-[#7A1526]'
                          : 'bg-white border-[#F0D5DA] text-[#7E4A53] hover:text-white hover:border-[#DFBAC2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-[#7A1526]/20 text-[#7A1526]">
                          <Crown className="w-5 h-5" />
                        </div>
                        {logoForm.logoType === 'svg-monogram' && (
                          <CheckCircle className="w-4 h-4 text-[#7A1526]" />
                        )}
                      </div>
                      <h4 className="font-cinzel font-bold text-xs text-white">
                        Signature Vector Monogram
                      </h4>
                      <p className="text-[11px] text-[#7E4A53] mt-1 line-clamp-2">
                        Handcrafted SVG with curved arch, couture thread loops, and needle detailing.
                      </p>
                    </button>

                    {/* Option 2: Custom Image / Logo Upload */}
                    <button
                      type="button"
                      onClick={() => setLogoForm({ ...logoForm, logoType: 'custom-image' })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        logoForm.logoType === 'custom-image'
                          ? 'bg-[#7A1526]/15 border-[#7A1526] shadow-md text-white ring-1 ring-[#7A1526]'
                          : 'bg-white border-[#F0D5DA] text-[#7E4A53] hover:text-white hover:border-[#DFBAC2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#85A5FF]">
                          <Upload className="w-5 h-5" />
                        </div>
                        {logoForm.logoType === 'custom-image' && (
                          <CheckCircle className="w-4 h-4 text-[#85A5FF]" />
                        )}
                      </div>
                      <h4 className="font-cinzel font-bold text-xs text-white">
                        Upload Custom Logo / Image
                      </h4>
                      <p className="text-[11px] text-[#7E4A53] mt-1 line-clamp-2">
                        Upload your PNG, SVG or WebP logo file with transparent background or provide an image link.
                      </p>
                    </button>

                    {/* Option 3: Luxury Haute Couture Typography */}
                    <button
                      type="button"
                      onClick={() => setLogoForm({ ...logoForm, logoType: 'text-luxury' })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        logoForm.logoType === 'text-luxury'
                          ? 'bg-[#7A1526]/15 border-[#7A1526] shadow-md text-white ring-1 ring-[#7A1526]'
                          : 'bg-white border-[#F0D5DA] text-[#7E4A53] hover:text-white hover:border-[#DFBAC2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#73D13D]">
                          <Type className="w-5 h-5" />
                        </div>
                        {logoForm.logoType === 'text-luxury' && (
                          <CheckCircle className="w-4 h-4 text-[#73D13D]" />
                        )}
                      </div>
                      <h4 className="font-cinzel font-bold text-xs text-white">
                        Haute Couture Wordmark
                      </h4>
                      <p className="text-[11px] text-[#7E4A53] mt-1 line-clamp-2">
                        High-contrast serif luxury typography with custom brand title and subtitle.
                      </p>
                    </button>

                  </div>
                </div>

                {/* 3. 1-Click Luxury Theme Quick Presets */}
                <div className="p-4 bg-white rounded-xl border border-[#F0D5DA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-cinzel font-bold text-[#6B3740] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#7A1526]" />
                      1-Click Couture Logo Presets
                    </span>
                    <span className="text-[10px] text-[#7E4A53]">Instant styling presets</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setLogoForm({
                        ...logoForm,
                        logoType: 'svg-monogram',
                        curvedArchText: 'LABEL',
                        subtitleLine: 'BY SHIKHA WARULE',
                        primaryColorHex: '#A59173',
                        footerColorHex: '#F8F2EA',
                        heightScale: 1.0,
                      })}
                      className="p-2 rounded-lg bg-white hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left text-xs text-white transition-all cursor-pointer truncate"
                    >
                      <span className="block font-cinzel font-semibold text-[11px]">👑 Official Khaki Gold</span>
                      <span className="text-[10px] text-[#7E4A53]">Classic atelier monogram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLogoForm({
                        ...logoForm,
                        logoType: 'svg-monogram',
                        curvedArchText: 'HAUTE',
                        subtitleLine: 'ATELIER SHIKHA WARULE',
                        primaryColorHex: '#7A1526',
                        footerColorHex: '#EADDCF',
                        heightScale: 1.05,
                      })}
                      className="p-2 rounded-lg bg-white hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left text-xs text-white transition-all cursor-pointer truncate"
                    >
                      <span className="block font-cinzel font-semibold text-[11px]">✨ Imperial Terracotta</span>
                      <span className="text-[10px] text-[#7E4A53]">Warm heritage motif</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLogoForm({
                        ...logoForm,
                        logoType: 'text-luxury',
                        textBrandName: 'LABEL SHIKHA WARULE',
                        textSubtitle: 'HAUTE COUTURE & ATELIER',
                        primaryColorHex: '#2C2420',
                        footerColorHex: '#FAF6F0',
                        heightScale: 1.0,
                      })}
                      className="p-2 rounded-lg bg-white hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left text-xs text-white transition-all cursor-pointer truncate"
                    >
                      <span className="block font-cinzel font-semibold text-[11px]">🏛️ Editorial Wordmark</span>
                      <span className="text-[10px] text-[#7E4A53]">Parisian serif elegance</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLogoForm({
                        ...logoForm,
                        logoType: 'svg-monogram',
                        curvedArchText: 'COUTURE',
                        subtitleLine: 'SHIKHA WARULE • PARIS',
                        primaryColorHex: '#C59B27',
                        footerColorHex: '#FFFFFF',
                        heightScale: 1.1,
                      })}
                      className="p-2 rounded-lg bg-white hover:bg-[#FAF2F4] border border-[#F0D5DA] text-left text-xs text-white transition-all cursor-pointer truncate"
                    >
                      <span className="block font-cinzel font-semibold text-[11px]">🌟 24K Royal Gold</span>
                      <span className="text-[10px] text-[#7E4A53]">Opulent bridal seal</span>
                    </button>
                  </div>
                </div>

                {/* 4. MODE SPECIFIC SETTINGS FORMS */}

                {/* ================= MODE: CUSTOM IMAGE UPLOAD ================= */}
                {logoForm.logoType === 'custom-image' && (
                  <div className="p-5 bg-white rounded-xl border border-[#F0D5DA] space-y-5 animate-in fade-in">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#85A5FF]" />
                        <h3 className="font-cinzel font-bold text-sm text-[#3B0A12]">
                          Custom Image & Graphic Logo Settings
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#7E4A53]">PNG / SVG / JPG</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left: File Upload Dropzone */}
                      <div className="space-y-3">
                        <label className="block text-xs font-cinzel font-semibold text-[#6B3740]">
                          Upload Logo File (From your computer)
                        </label>
                        
                        <div className="relative border-2 border-dashed border-[#F0D5DA] hover:border-[#7A1526] rounded-xl p-5 text-center bg-white/60 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group">
                          <input
                            type="file"
                            id="custom-logo-file-picker"
                            accept="image/png, image/jpeg, image/svg+xml, image/webp"
                            onChange={(e) => handleLogoImageUpload(e, false)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="p-3 rounded-full bg-[#7A1526]/20 text-[#7A1526] group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-cinzel font-semibold text-white">
                            Click to Browse or Drag & Drop Logo
                          </span>
                          <span className="text-[10px] text-[#7E4A53]">
                            Recommended: High-resolution PNG or SVG with transparent background
                          </span>
                        </div>

                        {/* Optional Dark Background Alternative */}
                        <div className="pt-2">
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740] mb-1">
                            Dark Background Image Variant (Optional for Footer)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={logoForm.customImageDarkUrl || ''}
                              onChange={(e) => setLogoForm({ ...logoForm, customImageDarkUrl: e.target.value })}
                              placeholder="URL for white/gold logo on dark background..."
                              className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                            />
                            <label className="px-3 py-2 bg-[#EEF2FF] hover:bg-[#3B4D6F] text-white rounded-lg text-xs font-cinzel font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleLogoImageUpload(e, true)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Right: Direct Image URL & Scaling Slider */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740] mb-1">
                            Direct Image / CDN URL
                          </label>
                          <input
                            type="text"
                            value={logoForm.customImageUrl || ''}
                            onChange={(e) => setLogoForm({ ...logoForm, customImageUrl: e.target.value })}
                            placeholder="https://example.com/brand-logo.png"
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                          />
                          <span className="text-[10px] text-[#7E4A53] block mt-1">
                            Direct web link to your hosted logo asset.
                          </span>
                        </div>

                        {/* Height Scaling Slider */}
                        <div className="p-3 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-cinzel font-semibold text-[#6B3740]">
                              Logo Height Scale
                            </span>
                            <span className="font-mono text-[#7A1526] font-bold">
                              {Math.round((logoForm.heightScale || 1.0) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.6"
                            max="1.5"
                            step="0.05"
                            value={logoForm.heightScale || 1.0}
                            onChange={(e) => setLogoForm({ ...logoForm, heightScale: parseFloat(e.target.value) })}
                            className="w-full accent-[#7A1526] cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-[#7E4A53]">
                            <span>Compact (60%)</span>
                            <span>Standard (100%)</span>
                            <span>Prominent (150%)</span>
                          </div>
                        </div>

                        {/* Quick Sample Image Logos */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-cinzel text-[#6B3740] block">Sample Custom Couture Artwork:</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setLogoForm({
                                ...logoForm,
                                customImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300&auto=format&fit=crop',
                                heightScale: 1.0,
                              })}
                              className="p-1.5 rounded bg-white hover:bg-[#FAF2F4] border border-[#F0D5DA] text-[10px] text-[#3B0A12] truncate text-left cursor-pointer"
                            >
                              🌸 Silk Weave Emblem
                            </button>
                            <button
                              type="button"
                              onClick={() => setLogoForm({
                                ...logoForm,
                                customImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300&auto=format&fit=crop',
                                heightScale: 1.0,
                              })}
                              className="p-1.5 rounded bg-white hover:bg-[#FAF2F4] border border-[#F0D5DA] text-[10px] text-[#3B0A12] truncate text-left cursor-pointer"
                            >
                              ✨ Golden Zardozi Seal
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* ================= MODE: SIGNATURE VECTOR MONOGRAM ================= */}
                {logoForm.logoType === 'svg-monogram' && (
                  <div className="p-5 bg-white rounded-xl border border-[#F0D5DA] space-y-5 animate-in fade-in">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-[#7A1526]" />
                        <h3 className="font-cinzel font-bold text-sm text-[#3B0A12]">
                          Signature Vector Monogram Settings
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#7E4A53]">Scalable Vector SVG</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left: Typography & Arch Text */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740] mb-1">
                            Curved Top Arch Text
                          </label>
                          <input
                            type="text"
                            value={logoForm.curvedArchText || 'LABEL'}
                            onChange={(e) => setLogoForm({ ...logoForm, curvedArchText: e.target.value })}
                            placeholder="e.g. LABEL, ATELIER, COUTURE"
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                          />
                          <span className="text-[10px] text-[#7E4A53] block mt-1">
                            Follows the architectural circular crest arc above the monogram.
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740] mb-1">
                            Bottom Subtitle Line
                          </label>
                          <input
                            type="text"
                            value={logoForm.subtitleLine || 'BY SHIKHA WARULE'}
                            onChange={(e) => setLogoForm({ ...logoForm, subtitleLine: e.target.value })}
                            placeholder="e.g. BY SHIKHA WARULE, MUMBAI • PARIS"
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                          />
                          <span className="text-[10px] text-[#7E4A53] block mt-1">
                            Engraved below the couture needle detailing.
                          </span>
                        </div>

                        {/* Scaling Slider */}
                        <div className="p-3 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-cinzel font-semibold text-[#6B3740]">
                              Monogram Height Scale
                            </span>
                            <span className="font-mono text-[#7A1526] font-bold">
                              {Math.round((logoForm.heightScale || 1.0) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.75"
                            max="1.4"
                            step="0.05"
                            value={logoForm.heightScale || 1.0}
                            onChange={(e) => setLogoForm({ ...logoForm, heightScale: parseFloat(e.target.value) })}
                            className="w-full accent-[#7A1526] cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Right: Color Palette Customizer */}
                      <div className="space-y-4">
                        
                        {/* Light Background Theme Color */}
                        <div className="p-3.5 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740]">
                            Light Header Primary Theme Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={logoForm.primaryColorHex || '#A59173'}
                              onChange={(e) => setLogoForm({ ...logoForm, primaryColorHex: e.target.value })}
                              className="w-9 h-9 rounded border border-[#F0D5DA] bg-transparent cursor-pointer"
                            />
                            <input
                              type="text"
                              value={logoForm.primaryColorHex || '#A59173'}
                              onChange={(e) => setLogoForm({ ...logoForm, primaryColorHex: e.target.value })}
                              className="w-28 bg-white border border-[#F0D5DA] rounded px-2.5 py-1.5 text-xs text-white font-mono"
                            />
                          </div>

                          {/* Swatches */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {[
                              { label: 'Khaki Gold', hex: '#A59173' },
                              { label: 'Terracotta', hex: '#7A1526' },
                              { label: 'Royal Bronze', hex: '#C59B27' },
                              { label: 'Espresso', hex: '#2C2420' },
                              { label: 'Rose Gold', hex: '#C48B71' },
                            ].map((sw) => (
                              <button
                                key={sw.hex}
                                type="button"
                                onClick={() => setLogoForm({ ...logoForm, primaryColorHex: sw.hex })}
                                className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                                style={{ backgroundColor: sw.hex }}
                                title={sw.label}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Dark Background Footer Color */}
                        <div className="p-3.5 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740]">
                            Dark Footer Theme Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={logoForm.footerColorHex || '#F8F2EA'}
                              onChange={(e) => setLogoForm({ ...logoForm, footerColorHex: e.target.value })}
                              className="w-9 h-9 rounded border border-[#F0D5DA] bg-transparent cursor-pointer"
                            />
                            <input
                              type="text"
                              value={logoForm.footerColorHex || '#F8F2EA'}
                              onChange={(e) => setLogoForm({ ...logoForm, footerColorHex: e.target.value })}
                              className="w-28 bg-white border border-[#F0D5DA] rounded px-2.5 py-1.5 text-xs text-white font-mono"
                            />
                          </div>

                          {/* Swatches */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {[
                              { label: 'Champagne Warm', hex: '#F8F2EA' },
                              { label: 'Pure White', hex: '#FFFFFF' },
                              { label: 'Soft Gold', hex: '#EADDCF' },
                              { label: 'Blush Ivory', hex: '#F5E8E0' },
                            ].map((sw) => (
                              <button
                                key={sw.hex}
                                type="button"
                                onClick={() => setLogoForm({ ...logoForm, footerColorHex: sw.hex })}
                                className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                                style={{ backgroundColor: sw.hex }}
                                title={sw.label}
                              />
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* ================= MODE: HAUTE COUTURE LUXURY WORDMARK ================= */}
                {logoForm.logoType === 'text-luxury' && (
                  <div className="p-5 bg-white rounded-xl border border-[#F0D5DA] space-y-5 animate-in fade-in">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-[#73D13D]" />
                        <h3 className="font-cinzel font-bold text-sm text-[#3B0A12]">
                          Haute Couture Luxury Wordmark Settings
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#7E4A53]">Serif Typography</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740] mb-1">
                            Primary Brand Title
                          </label>
                          <input
                            type="text"
                            value={logoForm.textBrandName || 'LABEL SHIKHA WARULE'}
                            onChange={(e) => setLogoForm({ ...logoForm, textBrandName: e.target.value })}
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740] mb-1">
                            Secondary Atelier Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={logoForm.textSubtitle || 'HAUTE COUTURE & ATELIER'}
                            onChange={(e) => setLogoForm({ ...logoForm, textSubtitle: e.target.value })}
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A1526]"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Scaling Slider */}
                        <div className="p-3.5 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-cinzel font-semibold text-[#6B3740]">
                              Typography Scale
                            </span>
                            <span className="font-mono text-[#7A1526] font-bold">
                              {Math.round((logoForm.heightScale || 1.0) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.75"
                            max="1.4"
                            step="0.05"
                            value={logoForm.heightScale || 1.0}
                            onChange={(e) => setLogoForm({ ...logoForm, heightScale: parseFloat(e.target.value) })}
                            className="w-full accent-[#7A1526] cursor-pointer"
                          />
                        </div>

                        {/* Color Customizer */}
                        <div className="p-3.5 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                          <label className="block text-xs font-cinzel font-semibold text-[#6B3740]">
                            Text Color (Light Header)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={logoForm.primaryColorHex || '#2C2420'}
                              onChange={(e) => setLogoForm({ ...logoForm, primaryColorHex: e.target.value })}
                              className="w-9 h-9 rounded border border-[#F0D5DA] bg-transparent cursor-pointer"
                            />
                            <input
                              type="text"
                              value={logoForm.primaryColorHex || '#2C2420'}
                              onChange={(e) => setLogoForm({ ...logoForm, primaryColorHex: e.target.value })}
                              className="w-28 bg-white border border-[#F0D5DA] rounded px-2.5 py-1.5 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* Bottom Publish Bar */}
                <div className="pt-3 flex items-center justify-between border-t border-[#F0D5DA]">
                  <span className="text-xs text-[#7E4A53]">
                    All changes take effect immediately across Header, Footer, and Navigation.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveLogoCMS()}
                    className="px-6 py-3 bg-[#7A1526] hover:bg-[#61101E] text-white font-cinzel font-semibold rounded-lg shadow-lg text-xs tracking-wider uppercase cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply & Publish Brand Logo</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* CMS TAB 1: HERO BANNERS & SLOGANS */}
          {activeTab === 'cms-hero' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0D5DA]">
                  <div>
                    <h2 className="font-cinzel text-lg font-bold text-white tracking-wider">
                      HERO BANNER & SLOGAN CMS
                    </h2>
                    <p className="text-xs text-[#7E4A53]">
                      Edit the main headline, script callout, CTA buttons, and background arch model image displayed on the storefront.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveHeroCMS}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white rounded-lg text-xs font-cinzel font-semibold shadow-lg transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Hero Changes</span>
                  </button>
                </div>

                <form onSubmit={handleSaveHeroCMS} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* Left Column: Headlines & Text */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Tagline Pill Label</label>
                      <input
                        type="text"
                        value={heroForm.tagline}
                        onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#7A1526]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Headline Part 1</label>
                        <input
                          type="text"
                          value={heroForm.headlinePart1}
                          onChange={(e) => setHeroForm({ ...heroForm, headlinePart1: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Headline Part 2</label>
                        <input
                          type="text"
                          value={heroForm.headlinePart2}
                          onChange={(e) => setHeroForm({ ...heroForm, headlinePart2: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Italic Script Subline (Playfair Luxury)</label>
                      <input
                        type="text"
                        value={heroForm.italicSubline}
                        onChange={(e) => setHeroForm({ ...heroForm, italicSubline: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#7A1526]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Hero Description</label>
                      <textarea
                        rows={3}
                        value={heroForm.description}
                        onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-[#7A1526]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Primary CTA Button</label>
                        <input
                          type="text"
                          value={heroForm.exploreButtonText}
                          onChange={(e) => setHeroForm({ ...heroForm, exploreButtonText: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Secondary Consult Button</label>
                        <input
                          type="text"
                          value={heroForm.consultButtonText}
                          onChange={(e) => setHeroForm({ ...heroForm, consultButtonText: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Banner Imagery & Computer Upload */}
                  <div className="space-y-5">
                    
                    {/* Banner Layout Selector */}
                    <div className="p-3.5 bg-white rounded-xl border border-[#F0D5DA] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[#6B3740] font-cinzel font-semibold text-xs">Hero Presentation Layout</label>
                        <span className="text-[10px] text-[#7E4A53]">Switch layout styles</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setHeroForm({ ...heroForm, bannerLayout: 'full-size' })}
                          className={`py-2 px-3 rounded-lg text-xs font-cinzel font-semibold border transition-all cursor-pointer ${
                            heroForm.bannerLayout !== 'split-arch'
                              ? 'bg-[#7A1526] text-white border-[#851628] shadow-md'
                              : 'bg-white text-[#7E4A53] border-[#F0D5DA] hover:text-white'
                          }`}
                        >
                          Full-Size Hero Banner
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroForm({ ...heroForm, bannerLayout: 'split-arch' })}
                          className={`py-2 px-3 rounded-lg text-xs font-cinzel font-semibold border transition-all cursor-pointer ${
                            heroForm.bannerLayout === 'split-arch'
                              ? 'bg-[#7A1526] text-white border-[#851628] shadow-md'
                              : 'bg-white text-[#7E4A53] border-[#F0D5DA] hover:text-white'
                          }`}
                        >
                          Split Arch Portal
                        </button>
                      </div>
                    </div>

                    {/* HERO BANNER COMPUTER UPLOAD SECTION */}
                    <div className="p-4 bg-white rounded-xl border border-[#F0D5DA] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-[#7A1526]" />
                          <span className="font-cinzel font-bold text-white text-xs uppercase tracking-wider">
                            Upload Hero Banner from Computer
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#7A1526]/20 text-[#7A1526] border border-[#7A1526]/40 font-mono">
                          Local / Device Upload
                        </span>
                      </div>

                      {/* Interactive Drag & Drop Zone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingBanner(true);
                        }}
                        onDragLeave={() => setIsDraggingBanner(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingBanner(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleHeroBannerUploadFromFiles(e.dataTransfer.files);
                          }
                        }}
                        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer group ${
                          isDraggingBanner
                            ? 'border-[#E08A68] bg-[#7A1526]/20 scale-[1.01]'
                            : 'border-[#DFBAC2] hover:border-[#7A1526] bg-white/70 hover:bg-white'
                        }`}
                      >
                        <input
                          type="file"
                          id="hero-banner-file-input"
                          accept="image/*"
                          multiple
                          onChange={handleHeroBannerFileInput}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-[#FAF2F4] flex items-center justify-center text-[#7A1526] group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-cinzel font-semibold text-white">
                              Click or Drag & Drop Banner Images Here
                            </p>
                            <p className="text-[10px] text-[#7E4A53] mt-0.5">
                              Supports JPG, PNG, WEBP from your computer (Single or Multiple Slides)
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#7A1526] text-white text-[10px] font-cinzel tracking-wider uppercase shadow-md">
                            <ImagePlus className="w-3 h-3" /> Select Images from Computer
                          </span>
                        </div>
                      </div>

                      {/* Active Hero Banner Slides Management */}
                      <div className="space-y-2 pt-2 border-t border-[#F0D5DA]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-cinzel text-[#6B3740] font-semibold">
                            Active Banner Slides ({heroForm.bannerImages && heroForm.bannerImages.length > 0 ? heroForm.bannerImages.length : (heroForm.heroImage ? 1 : 1)})
                          </span>
                          <span className="text-[10px] text-[#7E4A53]">
                            Auto-rotates on storefront
                          </span>
                        </div>

                        {/* List of current slides */}
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                          {((heroForm.bannerImages && heroForm.bannerImages.length > 0)
                            ? heroForm.bannerImages
                            : [heroForm.heroImage || '']
                          ).map((imageSrc, idx) => {
                            const isLocalBase64 = imageSrc?.startsWith('data:');
                            const isPrimary = idx === 0;

                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                                  isPrimary
                                    ? 'bg-[#FCF4F6] border-[#E08A68]/60 shadow-sm'
                                    : 'bg-white border-[#F0D5DA]'
                                }`}
                              >
                                {/* Thumbnail Preview */}
                                <div className="relative w-20 h-12 rounded bg-black/60 overflow-hidden border border-[#DFBAC2] flex-shrink-0">
                                  {imageSrc ? (
                                    <img
                                      src={imageSrc}
                                      alt={`Hero Banner Slide ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[9px] text-[#7E4A53]">
                                      Default
                                    </div>
                                  )}
                                  {isPrimary && (
                                    <span className="absolute top-0.5 left-0.5 bg-[#7A1526] text-white text-[8px] px-1 rounded font-bold">
                                      ★ Main
                                    </span>
                                  )}
                                </div>

                                {/* Slide Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-white truncate">
                                      Slide #{idx + 1} {isPrimary && '(Primary Hero)'}
                                    </span>
                                    {isLocalBase64 ? (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                                        Computer File
                                      </span>
                                    ) : (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF2F4] text-[#6B3740] border border-[#DFBAC2]">
                                        Preset / URL
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#7E4A53] truncate">
                                    {isLocalBase64 ? 'Local Uploaded Asset' : (imageSrc || 'Default Atelier Model')}
                                  </p>
                                </div>

                                {/* Slide Actions */}
                                <div className="flex items-center gap-1">
                                  {/* Resize & Crop Visual Studio Button */}
                                  <button
                                    type="button"
                                    title="Resize & Crop this banner (Aspect Ratio, Zoom, Pan, Rotation)"
                                    onClick={() => handleOpenResizer(idx, imageSrc, `Slide #${idx + 1}`)}
                                    className="px-2 py-1 rounded bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-[10px] font-cinzel flex items-center gap-1 border border-[#DFBAC2] hover:border-[#851628] transition-colors cursor-pointer"
                                  >
                                    <Crop className="w-3 h-3 text-[#7A1526]" />
                                    <span>Resize / Crop</span>
                                  </button>

                                  {/* Replace from computer input */}
                                  <label
                                    title="Replace with file from computer"
                                    className="p-1.5 rounded hover:bg-[#FAF2F4] text-[#6B3740] hover:text-white cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleReplaceBannerSlide(idx, e)}
                                    />
                                    <Upload className="w-3.5 h-3.5" />
                                  </label>

                                  {/* Move Up */}
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      title="Move Up"
                                      onClick={() => handleMoveBannerSlide(idx, 'up')}
                                      className="p-1.5 rounded hover:bg-[#FAF2F4] text-[#6B3740] hover:text-white cursor-pointer transition-colors"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Move Down */}
                                  {heroForm.bannerImages && idx < heroForm.bannerImages.length - 1 && (
                                    <button
                                      type="button"
                                      title="Move Down"
                                      onClick={() => handleMoveBannerSlide(idx, 'down')}
                                      className="p-1.5 rounded hover:bg-[#FAF2F4] text-[#6B3740] hover:text-white cursor-pointer transition-colors"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Make Primary */}
                                  {!isPrimary && (
                                    <button
                                      type="button"
                                      title="Set as Main Banner"
                                      onClick={() => handleSetPrimaryBannerSlide(idx)}
                                      className="px-1.5 py-1 rounded bg-[#FAF2F4] hover:bg-[#7A1526] text-white text-[9px] font-cinzel transition-colors cursor-pointer"
                                    >
                                      Make Main
                                    </button>
                                  )}

                                  {/* Delete Slide */}
                                  <button
                                    type="button"
                                    title="Remove this slide"
                                    onClick={() => handleRemoveBannerSlide(idx)}
                                    className="p-1.5 rounded hover:bg-rose-900/40 text-rose-400 hover:text-rose-200 cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Fallback Direct URL input */}
                      <div className="pt-2 border-t border-[#F0D5DA] space-y-1.5">
                        <label className="block text-[11px] text-[#6B3740] font-cinzel">Or Enter Image URL:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={heroForm.heroImage}
                            placeholder="https://images.unsplash.com/..."
                            onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                            className="flex-1 bg-white border border-[#F0D5DA] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#7A1526]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (heroForm.heroImage && heroForm.heroImage.trim() !== '') {
                                handleOpenResizer(null, heroForm.heroImage, 'URL Banner Image');
                              }
                            }}
                            disabled={!heroForm.heroImage || heroForm.heroImage.trim() === ''}
                            className="px-2.5 py-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel rounded flex items-center gap-1 border border-[#DFBAC2] disabled:opacity-50 cursor-pointer"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Resize & Frame</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (heroForm.heroImage && heroForm.heroImage.trim() !== '') {
                                handleAddPresetBanner(heroForm.heroImage);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-[#FCF4F6] hover:bg-[#F8E2E6] text-[#7A1526] border border-[#F0D5DA] text-xs font-cinzel rounded cursor-pointer"
                          >
                            + Add Direct
                          </button>
                        </div>
                      </div>

                      {/* 1-Click Banner Image Presets */}
                      <div className="pt-2 border-t border-[#F0D5DA] space-y-1.5">
                        <span className="text-[10px] text-[#6B3740] font-cinzel block">Curated Royal Presets:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setHeroForm({ ...heroForm, heroImage: '', bannerImages: [''] })}
                            className="text-left text-[10px] p-1.5 rounded bg-white hover:bg-[#FAF2F4] text-[#3B0A12] truncate cursor-pointer"
                          >
                            ⭐ Default Atelier Asset
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddPresetBanner('https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop')}
                            className="text-left text-[10px] p-1.5 rounded bg-white hover:bg-[#FAF2F4] text-[#3B0A12] truncate cursor-pointer"
                          >
                            👑 Banarasi Silk Bridal & Groom
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddPresetBanner('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop')}
                            className="text-left text-[10px] p-1.5 rounded bg-white hover:bg-[#FAF2F4] text-[#3B0A12] truncate cursor-pointer"
                          >
                            ✨ Festive Royal Menswear
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddPresetBanner('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1920&auto=format&fit=crop')}
                            className="text-left text-[10px] p-1.5 rounded bg-white hover:bg-[#FAF2F4] text-[#3B0A12] truncate cursor-pointer"
                          >
                            🌿 Chanderi Drape Couture
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Script Callout Text */}
                    <div className="p-3 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                      <span className="font-cinzel font-bold text-[#7A1526] text-[11px] block">
                        Floating Calligraphic Script Callout
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={heroForm.scriptCalloutLine1}
                          onChange={(e) => setHeroForm({ ...heroForm, scriptCalloutLine1: e.target.value })}
                          className="bg-white border border-[#F0D5DA] rounded p-2 text-[#3B0A12] text-xs"
                          placeholder="Line 1"
                        />
                        <input
                          type="text"
                          value={heroForm.scriptCalloutLine2}
                          onChange={(e) => setHeroForm({ ...heroForm, scriptCalloutLine2: e.target.value })}
                          className="bg-white border border-[#F0D5DA] rounded p-2 text-[#3B0A12] text-xs"
                          placeholder="Line 2"
                        />
                        <input
                          type="text"
                          value={heroForm.scriptCalloutLine3}
                          onChange={(e) => setHeroForm({ ...heroForm, scriptCalloutLine3: e.target.value })}
                          className="bg-white border border-[#F0D5DA] rounded p-2 text-[#3B0A12] text-xs"
                          placeholder="Line 3"
                        />
                      </div>
                    </div>

                    {/* Stats Highlights */}
                    <div className="p-3 bg-white rounded-lg border border-[#F0D5DA] space-y-2">
                      <span className="font-cinzel font-bold text-[#7A1526] text-[11px] block">
                        Three Hero Footprint Badges
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            value={heroForm.stat1Value}
                            onChange={(e) => setHeroForm({ ...heroForm, stat1Value: e.target.value })}
                            className="bg-white border border-[#F0D5DA] rounded p-1.5 text-white text-xs w-full mb-1"
                          />
                          <input
                            type="text"
                            value={heroForm.stat1Label}
                            onChange={(e) => setHeroForm({ ...heroForm, stat1Label: e.target.value })}
                            className="bg-white border border-[#F0D5DA] rounded p-1 text-[#7E4A53] text-[10px] w-full"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={heroForm.stat2Value}
                            onChange={(e) => setHeroForm({ ...heroForm, stat2Value: e.target.value })}
                            className="bg-white border border-[#F0D5DA] rounded p-1.5 text-white text-xs w-full mb-1"
                          />
                          <input
                            type="text"
                            value={heroForm.stat2Label}
                            onChange={(e) => setHeroForm({ ...heroForm, stat2Label: e.target.value })}
                            className="bg-white border border-[#F0D5DA] rounded p-1 text-[#7E4A53] text-[10px] w-full"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={heroForm.stat3Value}
                            onChange={(e) => setHeroForm({ ...heroForm, stat3Value: e.target.value })}
                            className="bg-white border border-[#F0D5DA] rounded p-1.5 text-white text-xs w-full mb-1"
                          />
                          <input
                            type="text"
                            value={heroForm.stat3Label}
                            onChange={(e) => setHeroForm({ ...heroForm, stat3Label: e.target.value })}
                            className="bg-white border border-[#F0D5DA] rounded p-1 text-[#7E4A53] text-[10px] w-full"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="col-span-full pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#7A1526] hover:bg-[#61101E] text-white font-cinzel font-semibold rounded-lg shadow-lg text-xs tracking-wider uppercase cursor-pointer"
                    >
                      Apply & Publish Hero Banner
                    </button>
                  </div>

                </form>
              </div>

            </div>
          )}

          {/* CMS TAB 2: ANNOUNCEMENT & TOP MARQUEE */}
          {activeTab === 'cms-announcement' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
                  <div>
                    <h2 className="font-cinzel text-lg font-bold text-white tracking-wider">
                      ANNOUNCEMENT BAR & TOP TICKER
                    </h2>
                    <p className="text-xs text-[#7E4A53]">
                      This promotional message appears in the royal maroon top bar across every page of the storefront.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#58111A] text-[#7A1526] border border-[#8E3B4B] text-[11px] font-cinzel font-bold uppercase">
                    Maroon Bar Active
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-cinzel font-semibold text-[#7A1526]">
                    Top Bar Banner Text
                  </label>
                  <textarea
                    rows={3}
                    value={announcementDraft}
                    onChange={(e) => setAnnouncementDraft(e.target.value)}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-3.5 text-sm text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                    placeholder="Enter promotion or shipping message..."
                  />

                  {/* 1-Click Promotional Presets */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-cinzel font-semibold text-[#6B3740] block">
                      Quick Couture Presets:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setAnnouncementDraft('COMPLIMENTARY WORLDWIDE COUTURE SHIPPING ON ORDERS ABOVE ₹2,999 • USE CODE: WELCOME10')}
                        className="p-2 rounded bg-white hover:bg-[#FCF4F6] border border-[#F0D5DA] text-[11px] text-left text-stone-200 transition-colors cursor-pointer"
                      >
                        🚚 Worldwide Free Shipping
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnnouncementDraft('FESTIVE COUTURE PREVIEW: ENJOY 15% ATELIER SAVINGS WITH CODE: FESTIVE15 • LIMITED EDITIONS')}
                        className="p-2 rounded bg-white hover:bg-[#FCF4F6] border border-[#F0D5DA] text-[11px] text-left text-stone-200 transition-colors cursor-pointer"
                      >
                        ✨ Festive 15% Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnnouncementDraft('BESPOKE BRIDAL APPOINTMENTS NOW OPEN FOR AUTUMN/WINTER • BOOK COMPLIMENTARY STYLING')}
                        className="p-2 rounded bg-white hover:bg-[#FCF4F6] border border-[#F0D5DA] text-[11px] text-left text-stone-200 transition-colors cursor-pointer"
                      >
                        👑 Bridal Appointments
                      </button>
                    </div>
                  </div>

                  {/* Live Simulation of the Maroon Bar */}
                  <div className="p-3.5 bg-[#58111A] text-[#FDF8F3] border border-[#420B13] rounded-lg text-xs font-medium flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#7A1526] shrink-0" />
                      <span className="tracking-wide">Live Preview: {announcementDraft}</span>
                    </div>
                    <span className="text-[10px] text-[#7A1526] hidden sm:inline">Royal Maroon</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveAnnouncement}
                    className="px-6 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white font-cinzel font-semibold text-xs tracking-wider rounded-lg shadow-md uppercase cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Announcement Banner</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CMS TAB 3: STYLES & CATEGORIES */}
          {activeTab === 'cms-collections' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              {/* SECTION 1: SHOP BY STYLE (ARCHITECTURAL SILHOUETTES) */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0D5DA]">
                  <div>
                    <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#7A1526]" />
                      <span>SHOP BY STYLE (ARCHITECTURAL ARCH SILHOUETTES)</span>
                    </h2>
                    <p className="text-xs text-[#7E4A53] mt-0.5">
                      Configure the 4 iconic Mughal arch style cards featured on the storefront homepage.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#7A1526] font-cinzel font-semibold bg-[#FAF2F4] px-2.5 py-1 rounded border border-[#DFBAC2]">
                      {stylesList.length} Silhouettes
                    </span>
                    <button
                      onClick={() => {
                        setEditingStyle(null);
                        setStyleForm({
                          id: `style-${Date.now()}`,
                          title: '',
                          accentText: 'Pure Handloom Silks',
                          description: 'Bespoke tailoring handcrafted with pure heritage weaves.',
                          itemCount: 20,
                          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
                        });
                        setIsAddStyleOpen(true);
                      }}
                      className="px-3.5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Style Silhouette</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {stylesList.map((style, idx) => (
                    <div key={style.id} className="bg-white rounded-xl border border-[#F0D5DA] p-4 flex flex-col justify-between space-y-3 group hover:border-[#7A1526]/60 transition-all shadow-md">
                      
                      {/* Image Thumbnail with Overlay Upload, Crop & Edit Trigger */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleInlineStyleImageUpload(idx, e.dataTransfer.files[0]);
                          }
                        }}
                        className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#F0D5DA] bg-black group/thumb"
                      >
                        <img src={style.image} alt={style.title} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500" />
                        
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity p-2">
                          <label
                            title="Upload new photo from computer"
                            className="w-full max-w-[140px] px-2.5 py-1.5 bg-[#7A1526] hover:bg-[#991B30] text-white text-[10px] font-cinzel rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95"
                          >
                            <Upload className="w-3 h-3 text-white" />
                            <span>Upload PC Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleInlineStyleImageUpload(idx, e.target.files[0]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <div className="flex items-center gap-1.5 w-full max-w-[140px]">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStyle(style);
                                setStyleForm({ ...style });
                                setIsAddStyleOpen(true);
                              }}
                              className="flex-1 px-2 py-1 bg-white/20 backdrop-blur-xs text-white text-[10px] font-cinzel rounded flex items-center justify-center gap-1 hover:bg-white/30 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                openImageResizer(
                                  style.image,
                                  'product',
                                  `Style Silhouette: ${style.title}`,
                                  (cropped) => {
                                    const updated = [...stylesList];
                                    updated[idx].image = cropped;
                                    onUpdateStylesList(updated);
                                  }
                                );
                              }}
                              className="flex-1 px-2 py-1 bg-[#FCF4F6] text-[#7A1526] text-[10px] font-cinzel rounded flex items-center justify-center gap-1 border border-[#DFBAC2] hover:bg-[#38241C] cursor-pointer"
                            >
                              <Crop className="w-3 h-3" />
                              <span>Crop</span>
                            </button>
                          </div>
                        </div>

                        {/* Top badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-cinzel text-[#7A1526] font-bold border border-white/10 pointer-events-none">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-cinzel text-sm font-bold text-white tracking-wide">{style.title}</h3>
                          <span className="text-[11px] font-mono text-[#7A1526]">{style.itemCount} Designs</span>
                        </div>
                        {style.accentText && (
                          <div className="text-[11px] text-[#7E4A53] font-serif italic line-clamp-1">{style.accentText}</div>
                        )}
                        {style.description && (
                          <p className="text-[10px] text-[#8F6C72] line-clamp-2 mt-1">{style.description}</p>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-[#F0D5DA] flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveStyle(idx, 'up')}
                            className="p-1.5 rounded bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Move Left / Earlier"
                          >
                            <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === stylesList.length - 1}
                            onClick={() => moveStyle(idx, 'down')}
                            className="p-1.5 rounded bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Move Right / Later"
                          >
                            <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Quick direct upload button from PC */}
                          <label
                            title="Quick upload image from computer"
                            className="p-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white rounded transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleInlineStyleImageUpload(idx, e.target.files[0]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStyle(style);
                              setStyleForm({ ...style });
                              setIsAddStyleOpen(true);
                            }}
                            className="p-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-white rounded transition-colors cursor-pointer"
                            title="Edit Style Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              openImageResizer(
                                style.image,
                                'product',
                                `Style Silhouette: ${style.title}`,
                                (cropped) => {
                                  const updated = [...stylesList];
                                  updated[idx].image = cropped;
                                  onUpdateStylesList(updated);
                                }
                              );
                            }}
                            className="p-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white rounded transition-colors cursor-pointer"
                            title="Resize & Crop Arch Image (3:4)"
                          >
                            <Crop className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={stylesList.length <= 1}
                            onClick={() => {
                              if (confirm(`Remove style silhouette "${style.title}"?`)) {
                                const updated = stylesList.filter((s) => s.id !== style.id);
                                onUpdateStylesList(updated);
                              }
                            }}
                            className="p-1.5 bg-[#FCF4F6] hover:bg-red-700 text-[#7E4A53] hover:text-white rounded transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Delete Style"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: SHOP BY COLLECTION / CATEGORIES */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0D5DA]">
                  <div>
                    <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#7A1526]" />
                      <span>SHOP BY COLLECTION (MUGHAL ARCH CATEGORY CARDS)</span>
                    </h2>
                    <p className="text-xs text-[#7E4A53] mt-0.5">
                      Curate product categories (Kurtas, Sarees, Dresses, Sets, etc.) displayed in cusped arch frames.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#7A1526] font-cinzel font-semibold bg-[#FAF2F4] px-2.5 py-1 rounded border border-[#DFBAC2]">
                      {categoriesList.length} Collections
                    </span>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({
                          id: `cat-${Date.now()}`,
                          title: '',
                          slug: '',
                          itemCount: 16,
                          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
                        });
                        setIsAddCategoryOpen(true);
                      }}
                      className="px-3.5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Collection Card</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categoriesList.map((cat, idx) => (
                    <div key={cat.id} className="bg-white rounded-xl border border-[#F0D5DA] p-3 flex flex-col justify-between space-y-2.5 group hover:border-[#7A1526]/60 transition-all shadow-md">
                      
                      {/* Image Thumbnail with Overlay Upload, Crop & Edit Trigger */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleInlineCategoryImageUpload(idx, e.dataTransfer.files[0]);
                          }
                        }}
                        className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#F0D5DA] bg-black group/thumb"
                      >
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500" />
                        
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity p-1.5">
                          <label
                            title="Upload new photo from computer"
                            className="w-full px-2 py-1 bg-[#7A1526] hover:bg-[#991B30] text-white text-[9px] font-cinzel rounded flex items-center justify-center gap-1 cursor-pointer shadow-md transition-transform active:scale-95"
                          >
                            <Upload className="w-2.5 h-2.5 text-white" />
                            <span>Upload PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleInlineCategoryImageUpload(idx, e.target.files[0]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({ ...cat });
                              setIsAddCategoryOpen(true);
                            }}
                            className="w-full px-2 py-1 bg-white/20 text-white text-[9px] font-cinzel rounded flex items-center justify-center gap-1 hover:bg-white/30 cursor-pointer"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              openImageResizer(
                                cat.image,
                                'product',
                                `Collection Arch: ${cat.title}`,
                                (cropped) => {
                                  const updated = [...categoriesList];
                                  updated[idx].image = cropped;
                                  onUpdateCategoriesList(updated);
                                }
                              );
                            }}
                            className="w-full px-2 py-1 bg-[#FCF4F6] text-[#7A1526] text-[9px] font-cinzel rounded flex items-center justify-center gap-1 border border-[#DFBAC2] hover:bg-[#38241C] cursor-pointer"
                          >
                            <Crop className="w-2.5 h-2.5" />
                            <span>Crop</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div>
                        <h4 className="font-cinzel text-xs font-bold text-white text-center line-clamp-1">{cat.title}</h4>
                        <div className="text-[10px] text-[#7A1526] text-center font-mono mt-0.5">{cat.itemCount} Ensembles</div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-[#F0D5DA] flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveCategory(idx, 'up')}
                            className="p-1 rounded bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowUp className="w-3 h-3 -rotate-90" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === categoriesList.length - 1}
                            onClick={() => moveCategory(idx, 'down')}
                            className="p-1 rounded bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Move Right"
                          >
                            <ArrowDown className="w-3 h-3 -rotate-90" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Quick direct upload button from PC */}
                          <label
                            title="Quick upload photo from computer"
                            className="p-1 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white rounded transition-colors cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleInlineCategoryImageUpload(idx, e.target.files[0]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({ ...cat });
                              setIsAddCategoryOpen(true);
                            }}
                            className="p-1 bg-[#FAF2F4] hover:bg-[#7A1526] text-white rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={categoriesList.length <= 1}
                            onClick={() => {
                              if (confirm(`Remove collection card "${cat.title}"?`)) {
                                const updated = categoriesList.filter((c) => c.id !== cat.id);
                                onUpdateCategoriesList(updated);
                              }
                            }}
                            className="p-1 bg-[#FCF4F6] hover:bg-red-700 text-[#7E4A53] hover:text-white rounded transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CMS TAB 4: WATCH DISCOVERY REELS */}
          {activeTab === 'cms-stories' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                    <Tv className="w-5 h-5 text-[#7A1526]" />
                    <span>WATCH OUR DISCOVERY (CRAFT & WEAVE VIDEO REELS)</span>
                  </h2>
                  <p className="text-xs text-[#7E4A53] mt-0.5">
                    Add, edit, crop thumbnails, and organize the artisan documentary reels shown in the storefront carousel.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#7A1526] font-cinzel font-semibold bg-[#FAF2F4] px-2.5 py-1 rounded border border-[#DFBAC2]">
                    {discoveryStories.length} Active Reels
                  </span>
                  <button
                    onClick={() => {
                      setEditingStory(null);
                      setStoryForm({
                        id: `story-${Date.now()}`,
                        title: '',
                        subtitle: '',
                        thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
                        videoDuration: '02:45',
                        description: '',
                        craftsmanshipDetail: '',
                        artisanQuote: '',
                        artisanName: '',
                        tags: ['Handloom', 'Silk'],
                      });
                      setIsAddStoryOpen(true);
                    }}
                    className="px-4 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Discovery Reel</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {discoveryStories.map((story, idx) => (
                  <div key={story.id} className="bg-white rounded-xl border border-[#F0D5DA] overflow-hidden p-4 flex flex-col justify-between space-y-3 group hover:border-[#7A1526]/60 transition-all shadow-md">
                    
                    {/* Video Thumbnail with Badges & Action Overlay */}
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black border border-[#F0D5DA]">
                      <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95" />
                      
                      {/* Terracotta Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/90 via-black/30 to-transparent" />

                      {/* Center Play Icon */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs border border-white/60 flex items-center justify-center text-white shadow-md">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-[#7A1526] font-bold border border-white/10">
                        #{idx + 1}
                      </div>

                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white font-bold border border-white/10">
                        {story.videoDuration}
                      </div>

                      {/* Bottom Title inside Thumbnail */}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 text-center">
                        <div className="font-cinzel text-xs font-bold text-white drop-shadow-md leading-tight">{story.title}</div>
                        <div className="text-[10px] text-[#7A1526] font-light mt-0.5">{story.subtitle}</div>
                      </div>

                      {/* Action Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity p-2 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStory(story);
                            setStoryForm({ ...story });
                            setIsAddStoryOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-[#7A1526] text-white text-xs font-cinzel rounded-md flex items-center gap-1.5 hover:bg-[#991B30] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Full Reel</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            openImageResizer(
                              story.thumbnail,
                              'product',
                              `Discovery Reel: ${story.title}`,
                              (cropped) => {
                                const updated = [...discoveryStories];
                                updated[idx].thumbnail = cropped;
                                onUpdateDiscoveryStories(updated);
                              }
                            );
                          }}
                          className="px-3.5 py-1.5 bg-[#FCF4F6] text-[#7A1526] text-xs font-cinzel rounded-md flex items-center gap-1.5 border border-[#DFBAC2] hover:bg-[#38241C] cursor-pointer"
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>Resize 4:5</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#6B3740] italic line-clamp-2">
                        "{story.artisanQuote}"
                      </div>
                      <div className="text-[10px] text-[#7E4A53] flex items-center justify-between">
                        <span>Artisan: <strong className="text-white font-medium">{story.artisanName}</strong></span>
                      </div>

                      {/* Tags */}
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {story.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.2 bg-[#FCF4F6] text-[#7A1526] text-[9px] rounded font-cinzel">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2.5 border-t border-[#F0D5DA] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveDiscoveryStory(idx, 'up')}
                          className="p-1.5 rounded bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Move Left / Earlier in Carousel"
                        >
                          <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === discoveryStories.length - 1}
                          onClick={() => moveDiscoveryStory(idx, 'down')}
                          className="p-1.5 rounded bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Move Right / Later in Carousel"
                        >
                          <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStory(story);
                            setStoryForm({ ...story });
                            setIsAddStoryOpen(true);
                          }}
                          className="p-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-white rounded transition-colors cursor-pointer"
                          title="Edit Discovery Reel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            openImageResizer(
                              story.thumbnail,
                              'product',
                              `Discovery Reel: ${story.title}`,
                              (cropped) => {
                                const updated = [...discoveryStories];
                                updated[idx].thumbnail = cropped;
                                onUpdateDiscoveryStories(updated);
                              }
                            );
                          }}
                          className="p-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white rounded transition-colors cursor-pointer"
                          title="Resize / Crop Thumbnail"
                        >
                          <Crop className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete discovery reel "${story.title}"?`)) {
                              const filtered = discoveryStories.filter((s) => s.id !== story.id);
                              onUpdateDiscoveryStories(filtered);
                            }
                          }}
                          className="p-1.5 bg-[#FCF4F6] hover:bg-red-700 text-[#7E4A53] hover:text-white rounded transition-colors cursor-pointer"
                          title="Delete Reel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* CMS TAB 5: CLIENT DIARIES & TESTIMONIALS */}
          {activeTab === 'cms-diaries' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white p-4 rounded-xl border border-[#F0D5DA] flex items-center justify-between">
                <div>
                  <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider">
                    CLIENT DIARIES & VERIFIED REVIEWS CMS
                  </h2>
                  <p className="text-xs text-[#7E4A53]">
                    Add, edit, or remove testimonials from esteemed patrons.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddDiaryOpen(true)}
                  className="px-4 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Patron Story</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {clientDiaries.map((diary, idx) => (
                  <div key={diary.id} className="bg-white rounded-xl border border-[#F0D5DA] p-4.5 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={diary.image} alt={diary.author} className="w-14 h-14 object-cover rounded-lg border border-[#F0D5DA]" />
                      <div>
                        <h3 className="font-cinzel text-sm font-bold text-[#3B0A12]">{diary.author}</h3>
                        <div className="text-xs text-[#7A1526] font-medium">
                          {diary.category || diary.occasion || 'Editorial'}
                        </div>
                        <div className="text-[11px] text-[#7E4A53]">{diary.city} • {diary.date}</div>
                      </div>
                    </div>

                    <blockquote className="text-xs text-[#4A1821] italic font-serif-luxury leading-relaxed bg-[#FAF5F6] p-3 rounded-lg border border-[#F0D5DA]">
                      "{diary.quote}"
                    </blockquote>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#7E4A53]">
                      <span>Outfit: {diary.outfit}</span>
                      <button
                        onClick={() => {
                          const updated = clientDiaries.filter((d) => d.id !== diary.id);
                          onUpdateClientDiaries(updated);
                        }}
                        className="text-[#E53E3E] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* CMS TAB 6: BRAND STORY & ATELIER MANIFESTO */}
          {activeTab === 'cms-brand' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0D5DA]">
                  <div>
                    <h2 className="font-cinzel text-lg font-bold text-white tracking-wider">
                      BRAND STORY & ATELIER MANIFESTO
                    </h2>
                    <p className="text-xs text-[#7E4A53]">
                      Update the Atelier philosophy, founder message from Shikha Warule, and heritage clusters.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveBrandStory}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white rounded-lg text-xs font-cinzel font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Brand Story</span>
                  </button>
                </div>

                <form onSubmit={handleSaveBrandStory} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Section Heading</label>
                      <input
                        type="text"
                        value={brandStoryForm.heading}
                        onChange={(e) => setBrandStoryForm({ ...brandStoryForm, heading: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Subheading</label>
                      <input
                        type="text"
                        value={brandStoryForm.subheading}
                        onChange={(e) => setBrandStoryForm({ ...brandStoryForm, subheading: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Founder / Couturier Name</label>
                        <input
                          type="text"
                          value={brandStoryForm.founderName}
                          onChange={(e) => setBrandStoryForm({ ...brandStoryForm, founderName: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Founder Role</label>
                        <input
                          type="text"
                          value={brandStoryForm.founderRole}
                          onChange={(e) => setBrandStoryForm({ ...brandStoryForm, founderRole: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Founder Quote</label>
                      <textarea
                        rows={2}
                        value={brandStoryForm.founderQuote}
                        onChange={(e) => setBrandStoryForm({ ...brandStoryForm, founderQuote: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Story Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={brandStoryForm.storyParagraph1}
                        onChange={(e) => setBrandStoryForm({ ...brandStoryForm, storyParagraph1: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Story Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={brandStoryForm.storyParagraph2}
                        onChange={(e) => setBrandStoryForm({ ...brandStoryForm, storyParagraph2: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Founder Photo URL</label>
                      <input
                        type="text"
                        value={brandStoryForm.founderImage}
                        onChange={(e) => setBrandStoryForm({ ...brandStoryForm, founderImage: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-full pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white font-cinzel font-semibold text-xs tracking-wider rounded-lg shadow-md uppercase cursor-pointer"
                    >
                      Publish Atelier Story
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* CMS TAB 7: FOOTER & POLICIES */}
          {activeTab === 'cms-footer' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0D5DA]">
                  <div>
                    <h2 className="font-cinzel text-lg font-bold text-white tracking-wider">
                      FOOTER CONTACT & STORE POLICIES
                    </h2>
                    <p className="text-xs text-[#7E4A53]">
                      Manage phone, studio address, WhatsApp concierge, and returns policy text.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveStoreSettings}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white rounded-lg text-xs font-cinzel font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Policy Settings</span>
                  </button>
                </div>

                <form onSubmit={handleSaveStoreSettings} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Store Legal Name</label>
                      <input
                        type="text"
                        value={storeSettingsForm.storeName}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, storeName: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Contact Phone</label>
                        <input
                          type="text"
                          value={storeSettingsForm.phone}
                          onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, phone: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Email Concierge</label>
                        <input
                          type="text"
                          value={storeSettingsForm.email}
                          onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, email: e.target.value })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Flagship Atelier Studio Address</label>
                      <textarea
                        rows={2}
                        value={storeSettingsForm.atelierAddress}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, atelierAddress: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">WhatsApp Concierge Number</label>
                      <input
                        type="text"
                        value={storeSettingsForm.whatsappNumber}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Shipping Policy Details</label>
                      <textarea
                        rows={3}
                        value={storeSettingsForm.shippingPolicyText}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, shippingPolicyText: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Returns & Alterations Policy Details</label>
                      <textarea
                        rows={3}
                        value={storeSettingsForm.returnsPolicyText}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, returnsPolicyText: e.target.value })}
                        className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Free Shipping Threshold (₹)</label>
                        <input
                          type="number"
                          value={storeSettingsForm.freeShippingThreshold}
                          onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6B3740] font-cinzel font-semibold mb-1">Return Window (Days)</label>
                        <input
                          type="number"
                          value={storeSettingsForm.returnWindowDays}
                          onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, returnWindowDays: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white font-cinzel font-semibold text-xs tracking-wider rounded-lg shadow-md uppercase cursor-pointer"
                    >
                      Save Policy Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: PROMO CODES */}
          {activeTab === 'promo' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Create Promo Code Box */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-4">
                <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider">
                  CREATE NEW COUTURE PROMO CODE
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#7E4A53] mb-1">Promo Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE20"
                      value={newPromoCode.code}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                      className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7E4A53] mb-1">Discount %</label>
                    <input
                      type="number"
                      value={newPromoCode.discountPercentage}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, discountPercentage: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7E4A53] mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      value={newPromoCode.minOrder}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, minOrder: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7E4A53] mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 20% off on Festive"
                      value={newPromoCode.description}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, description: e.target.value })}
                      className="w-full bg-white border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (!newPromoCode.code) return;
                      onAddPromoCode(newPromoCode);
                      setNewPromoCode({ code: '', discountPercentage: 15, minOrder: 3000, description: '' });
                    }}
                    className="px-5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md cursor-pointer"
                  >
                    Activate Promo Code
                  </button>
                </div>
              </div>

              {/* Active Codes List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {promoCodes.map((p) => (
                  <div key={p.code} className="bg-white p-4 rounded-xl border border-[#F0D5DA] flex items-center justify-between">
                    <div>
                      <div className="font-mono text-base font-bold text-white flex items-center gap-2">
                        <span>{p.code}</span>
                        <span className="text-xs bg-[#52C41A]/20 text-[#73D13D] px-2 py-0.5 rounded font-sans font-semibold">
                          {p.discountPercentage}% OFF
                        </span>
                      </div>
                      <div className="text-xs text-[#7E4A53] mt-1">Min order: ₹{p.minOrder.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-[#6B3740] mt-0.5">{p.description}</div>
                    </div>

                    <button
                      onClick={() => onDeletePromoCode(p.code)}
                      className="p-1.5 bg-[#FAF2F4] hover:bg-[#FF4D4F] text-white rounded transition-colors"
                      title="Delete code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* RAZORPAY PAYMENT GATEWAY INTEGRATION CARD */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0D5DA]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0C2340] text-white flex items-center justify-center shadow-xs">
                      <Zap className="w-5 h-5 text-[#00BAF2]" />
                    </div>
                    <div>
                      <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider flex items-center gap-2">
                        <span>RAZORPAY PAYMENT GATEWAY SETTINGS</span>
                        <span className="text-[10px] font-sans font-bold bg-[#E6F4EA] text-[#137333] px-2 py-0.5 rounded border border-[#CEEAD6]">
                          Active & Ready
                        </span>
                      </h2>
                      <p className="text-xs text-[#7E4A53]">
                        Accept instant UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking & Wallets directly into your bank account.
                      </p>
                    </div>
                  </div>

                  <a 
                    href="https://dashboard.razorpay.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF2F4] hover:bg-[#F0D5DA] text-[#7A1526] text-xs font-semibold rounded-lg border border-[#DFCBB8] transition-colors"
                  >
                    <span>Open Razorpay Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Razorpay Key ID */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="block text-[#6B3740] font-cinzel font-semibold">
                        Razorpay Key ID (Test or Live) *
                      </label>
                      <input
                        type="text"
                        value={storeSettingsForm.razorpayKeyId || ''}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, razorpayKeyId: e.target.value.trim() })}
                        placeholder="rzp_test_1DP5mmOlF5G5ag or rzp_live_..."
                        className="w-full bg-[#FAF5F6] border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-[#3B0A12] font-mono text-xs focus:outline-none focus:border-[#7A1526]"
                      />
                      <p className="text-[11px] text-[#7E4A53]">
                        Default test key: <code className="bg-white px-1.5 py-0.5 rounded border border-[#F0D5DA] text-[#7A1526]">rzp_test_1DP5mmOlF5G5ag</code> (Instant live simulations supported). Replace with your Live API Key from your Razorpay Dashboard.
                      </p>
                    </div>

                    {/* Merchant Name */}
                    <div className="space-y-1">
                      <label className="block text-[#6B3740] font-cinzel font-semibold">
                        Merchant / Brand Name on Checkout
                      </label>
                      <input
                        type="text"
                        value={storeSettingsForm.razorpayMerchantName || 'LABEL SHIKHA WARULE'}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, razorpayMerchantName: e.target.value })}
                        placeholder="LABEL SHIKHA WARULE"
                        className="w-full bg-[#FAF5F6] border border-[#F0D5DA] rounded-lg px-3.5 py-2.5 text-[#3B0A12] text-xs focus:outline-none focus:border-[#7A1526]"
                      />
                    </div>

                    {/* Theme Color */}
                    <div className="space-y-1">
                      <label className="block text-[#6B3740] font-cinzel font-semibold">
                        Gateway Brand Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={storeSettingsForm.razorpayThemeColor || '#7A1526'}
                          onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, razorpayThemeColor: e.target.value })}
                          className="w-10 h-9 p-0.5 rounded border border-[#F0D5DA] cursor-pointer bg-white"
                        />
                        <input
                          type="text"
                          value={storeSettingsForm.razorpayThemeColor || '#7A1526'}
                          onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, razorpayThemeColor: e.target.value })}
                          className="flex-1 bg-[#FAF5F6] border border-[#F0D5DA] rounded-lg px-3 py-2 text-[#3B0A12] font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Feature highlights badge box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg">
                      <p className="font-bold text-[#7A1526] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> Instant Settlement
                      </p>
                      <p className="text-[10px] text-[#7E4A53] mt-0.5">
                        Supports instant QR codes, Google Pay, PhonePe, Paytm, and BHIM apps.
                      </p>
                    </div>

                    <div className="p-3 bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg">
                      <p className="font-bold text-[#7A1526] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> International Cards
                      </p>
                      <p className="text-[10px] text-[#7E4A53] mt-0.5">
                        Accepts Visa, Mastercard, RuPay, and American Express with 3D Secure OTP.
                      </p>
                    </div>

                    <div className="p-3 bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg">
                      <p className="font-bold text-[#7A1526] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> PCI-DSS Level 1
                      </p>
                      <p className="text-[10px] text-[#7E4A53] mt-0.5">
                        Bank-grade 256-bit encryption with auto-verification and instant digital receipts.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white font-cinzel font-semibold text-xs tracking-wider rounded-lg shadow-md uppercase cursor-pointer"
                    >
                      Save Razorpay Gateway Configuration
                    </button>
                  </div>
                </form>
              </div>

              {/* GENERAL ATELIER SYSTEM CONFIGURATION */}
              <div className="bg-white p-6 rounded-xl border border-[#F0D5DA] space-y-4">
                <h2 className="font-cinzel text-base font-bold text-[#3B0A12] tracking-wider">
                  GENERAL ATELIER SYSTEM CONFIGURATION
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-lg border border-[#F0D5DA]">
                    <span className="text-[#7E4A53] block mb-1">Base Currency</span>
                    <strong className="text-[#3B0A12] text-base font-mono">INR (₹ - Indian Rupee)</strong>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#F0D5DA]">
                    <span className="text-[#7E4A53] block mb-1">Standard GST Rate</span>
                    <strong className="text-[#3B0A12] text-base font-mono">12% (Apparel / Handloom)</strong>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#F0D5DA]">
                    <span className="text-[#7E4A53] block mb-1">Insured Logistics Partners</span>
                    <strong className="text-[#3B0A12] text-sm">BlueDart / Delhivery / DHL</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {(isAddProductOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#DFBAC2] rounded-2xl max-w-2xl w-full p-6 space-y-4 text-xs my-8 text-[#3B0A12]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <h2 className="font-cinzel text-base font-bold text-white">
                {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Add New Handcrafted Ensemble'}
              </h2>
              <button
                onClick={() => {
                  setIsAddProductOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-[#7E4A53] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formEl = e.currentTarget;
                const formData = new FormData(formEl);

                const itemData: Product = {
                  id: editingProduct ? editingProduct.id : `sw-${Date.now()}`,
                  name: formData.get('name') as string,
                  price: parseFloat(formData.get('price') as string) || 0,
                  originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
                  category: formData.get('category') as Product['category'],
                  style: formData.get('style') as Product['style'],
                  gender: formData.get('gender') as Product['gender'],
                  image: productFormImage || (formData.get('image') as string) || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
                  hoverImage: productFormHoverImage || undefined,
                  images: productFormGallery.length > 0 ? productFormGallery : undefined,
                  fabric: formData.get('fabric') as string,
                  description: formData.get('description') as string,
                  artisanNote: formData.get('artisanNote') as string,
                  careInstructions: ['Dry Clean Only', 'Steam Iron Low', 'Store in Mulmul Cloth'],
                  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                  rating: editingProduct?.rating || 4.9,
                  reviewsCount: editingProduct?.reviewsCount || 14,
                  inStock: editingProduct ? editingProduct.inStock : true,
                  isBestSeller: formData.get('isBestSeller') === 'on',
                  isNew: editingProduct?.isNew !== undefined ? editingProduct.isNew : true,
                };

                if (editingProduct) {
                  onUpdateProduct(itemData);
                } else {
                  onAddProduct(itemData);
                }

                setIsAddProductOpen(false);
                setEditingProduct(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Ensemble Name *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    placeholder="e.g. Saffron Raw Silk Zardozi Kurta Set"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Selling Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={editingProduct?.price || 4499}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Original Price (₹) [For Sale badge]</label>
                  <input
                    name="originalPrice"
                    type="number"
                    defaultValue={editingProduct?.originalPrice || ''}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'Kurtas'}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none"
                  >
                    <option value="Kurtas">Kurtas</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Dupattas">Dupattas</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Sets">Sets</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Style Silhouette *</label>
                  <select
                    name="style"
                    defaultValue={editingProduct?.style || 'Ethnic'}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none"
                  >
                    <option value="Ethnic">Ethnic</option>
                    <option value="Classic">Classic</option>
                    <option value="Festive">Festive</option>
                    <option value="Everyday">Everyday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Gender *</label>
                  <select
                    name="gender"
                    defaultValue={editingProduct?.gender || 'Women'}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Fabric Details *</label>
                  <input
                    name="fabric"
                    required
                    defaultValue={editingProduct?.fabric || 'Pure Chanderi Silk with Zari Border'}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none"
                  />
                </div>

                {/* PRODUCT LOOKBOOK & COMPUTER IMAGE UPLOAD STUDIO */}
                <div className="col-span-2 space-y-4 bg-[#FCF4F6] p-4 rounded-xl border-2 border-[#E8C5CC]">
                  <div className="flex items-center justify-between border-b border-[#F0D5DA] pb-2">
                    <div>
                      <span className="text-[#7A1526] font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-[#7A1526]" />
                        <span>कंप्यूटर से प्रोडक्ट फोटो अपलोड करें (Upload Images from Computer)</span>
                      </span>
                      <p className="text-[10px] text-[#7E4A53] mt-0.5">
                        Select high-resolution JPG, PNG, WEBP from your local PC or phone storage.
                      </p>
                    </div>
                    {uploadProgressMsg && (
                      <span className="text-[10px] font-medium bg-[#7A1526] text-white px-2 py-0.5 rounded-full animate-pulse">
                        {uploadProgressMsg}
                      </span>
                    )}
                  </div>

                  {/* 1. PRIMARY LOOKBOOK IMAGE UPLOAD BOX */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#F0D5DA] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#3B0A12] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7A1526]"></span>
                        <span>1. Primary Garment Image * (मुख्य फोटो)</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF2F4] text-[#7A1526] border border-[#F0D5DA]">
                        3:4 Ratio Recommended
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                      {/* Left: Thumbnail Preview */}
                      <div className="sm:col-span-4 flex flex-col items-center">
                        <div className="relative group w-32 h-44 rounded-lg overflow-hidden border-2 border-[#DFBAC2] bg-[#FAF2F4] shadow-md flex items-center justify-center">
                          {productFormImage ? (
                            <img
                              src={productFormImage}
                              alt="Product Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-3 text-[#8F6C72]">
                              <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50 text-[#7A1526]" />
                              <span className="text-[10px] block font-medium">कोई फोटो नहीं</span>
                              <span className="text-[9px] text-[#A67882]">No photo selected</span>
                            </div>
                          )}

                          {/* Hover Action Overlay */}
                          {productFormImage && (
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white text-xs font-cinzel transition-all p-2">
                              <button
                                type="button"
                                onClick={() => handleOpenProductImageResizer(productFormImage, editingProduct ? `Edit Image: ${editingProduct.name}` : 'New Garment Image')}
                                className="w-full py-1.5 bg-[#7A1526] hover:bg-[#61101E] rounded text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Crop className="w-3.5 h-3.5" />
                                <span>Crop / Frame (3:4)</span>
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-[#7E4A53] mt-1 font-mono">Catalog 3:4 Frame</span>
                      </div>

                      {/* Right: Drag & Drop + Computer Upload Controls */}
                      <div className="sm:col-span-8 space-y-2.5">
                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingProductImage(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDraggingProductImage(false);
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsDraggingProductImage(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              await handleProductImageUploadFromFile(e.dataTransfer.files[0], false);
                            }
                          }}
                          className={`p-4 rounded-xl border-2 border-dashed transition-all text-center ${
                            isDraggingProductImage
                              ? 'border-[#7A1526] bg-[#7A1526]/10 scale-[1.01]'
                              : 'border-[#DFBAC2] bg-[#FAF2F4]/60 hover:bg-[#FAF2F4]'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <label className="px-4 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-bold rounded-lg flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer">
                              <Upload className="w-4 h-4 text-white" />
                              <span>कंप्यूटर से फोटो चुनें (Upload from PC)</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleProductImageUploadFromFile(e.target.files[0], false);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>
                            <span className="text-[11px] text-[#6B3740]">
                              या फोटो को यहाँ ड्रैग & ड्रॉप करें (or drag & drop file here)
                            </span>
                            <span className="text-[9px] text-[#8F6C72]">
                              Supports JPG, PNG, WEBP, HEIC • Auto-compressed for lightning speed
                            </span>
                          </div>
                        </div>

                        {/* Image Actions Bar */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (productFormImage) {
                                handleOpenProductImageResizer(productFormImage, editingProduct ? `Edit: ${editingProduct.name}` : 'Primary Image', false);
                              }
                            }}
                            disabled={!productFormImage}
                            className="px-3 py-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel rounded-lg flex items-center gap-1.5 border border-[#DFBAC2] transition-colors cursor-pointer disabled:opacity-40"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Crop / Resize Studio (3:4)</span>
                          </button>

                          {productFormImage && (
                            <button
                              type="button"
                              onClick={() => setProductFormImage('')}
                              className="px-2.5 py-1.5 text-[#8F6C72] hover:text-[#7A1526] text-xs font-cinzel rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>Clear</span>
                            </button>
                          )}
                        </div>

                        {/* Optional URL input */}
                        <div>
                          <input
                            name="image"
                            required
                            value={productFormImage}
                            onChange={(e) => setProductFormImage(e.target.value)}
                            placeholder="Or paste direct image URL (https://...)"
                            className="w-full bg-[#FAF2F4]/40 border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] text-xs focus:outline-none focus:border-[#7A1526]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. SECONDARY / HOVER ANGLE IMAGE (BACK VIEW) */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#F0D5DA] space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#3B0A12] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C59B27]"></span>
                        <span>2. Secondary / Back View Image (बैक व्यू या क्लोज-अप)</span>
                      </span>
                      <span className="text-[10px] text-[#7E4A53]">Optional Hover Angle</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {productFormHoverImage && (
                        <div className="relative group w-16 h-20 rounded-md overflow-hidden border border-[#DFBAC2] shrink-0 bg-[#FAF2F4]">
                          <img src={productFormHoverImage} alt="Hover angle" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setProductFormHoverImage('')}
                            className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-[#7A1526] cursor-pointer"
                            title="Remove hover image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex-1 w-full flex flex-wrap items-center gap-2">
                        <label className="px-3 py-2 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel font-semibold rounded-lg flex items-center gap-1.5 border border-[#DFBAC2] transition-colors cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>कंप्यूटर से बैक फोटो अपलोड करें (Upload Back View)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                await handleProductImageUploadFromFile(e.target.files[0], true);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>

                        {productFormHoverImage && (
                          <button
                            type="button"
                            onClick={() => handleOpenProductImageResizer(productFormHoverImage, 'Hover Angle Image', true)}
                            className="px-3 py-2 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel rounded-lg flex items-center gap-1 border border-[#DFBAC2] cursor-pointer"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Crop / Resize</span>
                          </button>
                        )}

                        <input
                          name="hoverImage"
                          value={productFormHoverImage}
                          onChange={(e) => setProductFormHoverImage(e.target.value)}
                          placeholder="Or paste hover angle URL"
                          className="flex-1 min-w-[180px] bg-[#FAF2F4]/40 border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] text-xs focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. MULTI-PHOTO GALLERY STUDIO (अतिरिक्त गैलरी फोटो) */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#F0D5DA] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#3B0A12] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1A8A5A]"></span>
                        <span>3. Multi-Photo Gallery (गैलरी के लिए अन्य फोटो - एक साथ कई चुनें)</span>
                      </span>
                      <span className="text-[10px] text-[#7E4A53] font-mono">
                        {productFormGallery.length} Extra Photos
                      </span>
                    </div>

                    {/* Multi-File Upload Button & Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingGallery(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingGallery(false);
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsDraggingGallery(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          await handleProductGalleryUploadFromFiles(e.dataTransfer.files);
                        }
                      }}
                      className={`p-3 rounded-xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-2.5 ${
                        isDraggingGallery
                          ? 'border-[#7A1526] bg-[#7A1526]/10'
                          : 'border-[#DFBAC2] bg-[#FAF2F4]/40'
                      }`}
                    >
                      <div className="text-center sm:text-left">
                        <div className="text-xs font-cinzel font-bold text-[#7A1526]">
                          गैलरी में एक साथ कई फोटो जोड़ें (Select Multiple Photos)
                        </div>
                        <div className="text-[10px] text-[#7E4A53]">
                          Choose embroidery details, drape flow, border shots from computer
                        </div>
                      </div>

                      <label className="px-3.5 py-1.5 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                        <span>कंप्यूटर से फोटो चुनें (Add Photos)</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              await handleProductGalleryUploadFromFiles(e.target.files);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Gallery Thumbnails Grid */}
                    {productFormGallery.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 pt-1">
                        {productFormGallery.map((imgUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="relative group aspect-3/4 rounded-lg overflow-hidden border border-[#DFBAC2] bg-[#FAF2F4] shadow-xs"
                          >
                            <img src={imgUrl} alt={`Gallery angle ${gIdx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity p-1">
                              <button
                                type="button"
                                onClick={() => {
                                  openImageResizer(
                                    imgUrl,
                                    'product',
                                    `Gallery Photo #${gIdx + 1}`,
                                    (croppedUrl) => {
                                      setProductFormGallery((prev) => {
                                        const copy = [...prev];
                                        copy[gIdx] = croppedUrl;
                                        return copy;
                                      });
                                    }
                                  );
                                }}
                                className="p-1 bg-[#7A1526] text-white rounded hover:bg-[#61101E] cursor-pointer"
                                title="Crop / Resize"
                              >
                                <Crop className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setProductFormGallery((prev) => prev.filter((_, idx) => idx !== gIdx));
                                }}
                                className="p-1 bg-[#FF4D4F] text-white rounded hover:bg-[#CF1322] cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 px-1 py-0.2 bg-black/60 text-white rounded text-[8px] font-mono">
                              #{gIdx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingProduct?.description || 'Tailored to perfection with hand-pleated details and royal borders.'}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Artisan Story / Craft Note</label>
                  <input
                    name="artisanNote"
                    defaultValue={editingProduct?.artisanNote || 'Handwoven by master weavers of Maheshwar cluster.'}
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    name="isBestSeller"
                    defaultChecked={editingProduct?.isBestSeller}
                    className="w-4 h-4 accent-[#7A1526]"
                  />
                  <label htmlFor="isBestSeller" className="text-[#3B0A12] cursor-pointer font-cinzel">
                    Mark as Best Seller Collection Piece
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#F0D5DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-[#FAF2F4] text-[#7A1526] hover:bg-[#F0D5DA] rounded-lg font-cinzel text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white rounded-lg font-cinzel font-semibold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Add Ensemble to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PATRON STORY */}
      {isAddDiaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DFBAC2] rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs text-[#3B0A12]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <h2 className="font-cinzel text-base font-bold text-white">Add Verified Patron Testimonial</h2>
              <button onClick={() => setIsAddDiaryOpen(false)} className="text-[#7E4A53] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateClientDiaries([diaryForm, ...clientDiaries]);
                setIsAddDiaryOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[#6B3740] font-cinzel mb-1">Patron Name *</label>
                <input
                  required
                  value={diaryForm.author}
                  onChange={(e) => setDiaryForm({ ...diaryForm, author: e.target.value })}
                  placeholder="e.g. Priyanka Singhania"
                  className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">City</label>
                  <input
                    value={diaryForm.city}
                    onChange={(e) => setDiaryForm({ ...diaryForm, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Category / Edit</label>
                  <input
                    value={diaryForm.category || ''}
                    onChange={(e) => setDiaryForm({ ...diaryForm, category: e.target.value })}
                    placeholder="e.g. WEDDING EDIT"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B3740] font-cinzel mb-1">Outfit Ensemble Name</label>
                <input
                  value={diaryForm.outfit}
                  onChange={(e) => setDiaryForm({ ...diaryForm, outfit: e.target.value })}
                  placeholder="e.g. Antique Gold Jamdani Kurta Set"
                  className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12]"
                />
              </div>

              <div>
                <label className="block text-[#6B3740] font-cinzel mb-1">Quote / Review *</label>
                <textarea
                  rows={3}
                  required
                  value={diaryForm.quote}
                  onChange={(e) => setDiaryForm({ ...diaryForm, quote: e.target.value })}
                  placeholder="The craftsmanship was sublime..."
                  className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12]"
                />
              </div>

              <div>
                <label className="block text-[#6B3740] font-cinzel mb-1">Customer / Garment Photo URL</label>
                <input
                  value={diaryForm.image}
                  onChange={(e) => setDiaryForm({ ...diaryForm, image: e.target.value })}
                  className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDiaryOpen(false)}
                  className="px-4 py-2 bg-[#FAF2F4] text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A1526] text-white font-cinzel font-semibold rounded"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT WATCH DISCOVERY REEL */}
      {isAddStoryOpen && (
        <div className="fixed inset-0 z-50 bg-[#20050A]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#F0D5DA] rounded-2xl max-w-2xl w-full p-6 text-xs text-[#3B0A12] space-y-5 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#7A1526]" />
                <h3 className="font-cinzel text-base font-bold text-white tracking-wider">
                  {editingStory ? `EDIT DISCOVERY REEL: ${editingStory.title}` : 'ADD NEW WATCH DISCOVERY REEL'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddStoryOpen(false);
                  setEditingStory(null);
                }}
                className="p-1.5 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingStory) {
                  const updated = discoveryStories.map((s) => (s.id === editingStory.id ? { ...storyForm } : s));
                  onUpdateDiscoveryStories(updated);
                } else {
                  onUpdateDiscoveryStories([...discoveryStories, { ...storyForm, id: `story-${Date.now()}` }]);
                }
                setIsAddStoryOpen(false);
                setEditingStory(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1 font-semibold">Story / Reel Title *</label>
                  <input
                    required
                    value={storyForm.title}
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    placeholder="e.g. The Weaves of Maheshwar"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Subtitle / Theme</label>
                  <input
                    value={storyForm.subtitle}
                    onChange={(e) => setStoryForm({ ...storyForm, subtitle: e.target.value })}
                    placeholder="e.g. Behind The Loom"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Duration Badge (MM:SS)</label>
                  <input
                    value={storyForm.videoDuration}
                    onChange={(e) => setStoryForm({ ...storyForm, videoDuration: e.target.value })}
                    placeholder="e.g. 02:45"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] font-mono focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                {/* Thumbnail & Cropper Studio */}
                <div className="sm:col-span-2 bg-[#FCF4F6] p-4 rounded-xl border border-[#F0D5DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#7A1526] font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Crop className="w-4 h-4 text-[#7A1526]" />
                      <span>Reel Video Thumbnail (4:5 Ratio) *</span>
                    </label>
                    <span className="text-[10px] text-[#7E4A53] font-mono">Vertical Video Aspect</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4 flex flex-col items-center">
                      <div className="relative group w-24 h-32 rounded-lg overflow-hidden border-2 border-[#DFBAC2] bg-black shadow-lg flex items-center justify-center">
                        {storyForm.thumbnail ? (
                          <img
                            src={storyForm.thumbnail}
                            alt="Story Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2 text-[#8F6C72]">
                            <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <span className="text-[10px]">No image</span>
                          </div>
                        )}

                        {storyForm.thumbnail && (
                          <button
                            type="button"
                            onClick={() => {
                              openImageResizer(
                                storyForm.thumbnail,
                                'product',
                                `Reel Thumbnail: ${storyForm.title || 'New Reel'}`,
                                (cropped) => setStoryForm((prev) => ({ ...prev, thumbnail: cropped }))
                              );
                            }}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-[10px] font-cinzel transition-all cursor-pointer"
                          >
                            <Crop className="w-4 h-4 text-[#7A1526]" />
                            <span>Resize & Crop</span>
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-[#7E4A53] mt-1 font-mono">4:5 Reel Frame</span>
                    </div>

                    <div className="sm:col-span-8 space-y-2">
                      <div>
                        <span className="text-[10px] text-[#7E4A53] block mb-1">Thumbnail Image URL</span>
                        <input
                          required
                          value={storyForm.thumbnail}
                          onChange={(e) => setStoryForm({ ...storyForm, thumbnail: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#FCF4F6] border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] text-xs focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (storyForm.thumbnail) {
                              openImageResizer(
                                storyForm.thumbnail,
                                'product',
                                `Reel Thumbnail: ${storyForm.title || 'New Reel'}`,
                                (cropped) => setStoryForm((prev) => ({ ...prev, thumbnail: cropped }))
                              );
                            }
                          }}
                          disabled={!storyForm.thumbnail}
                          className="px-3 py-1.5 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel rounded-lg flex items-center gap-1.5 border border-[#DFBAC2] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>Resize & Crop Studio</span>
                        </button>

                        <label
                          title="Upload thumbnail file from computer"
                          className="px-3 py-1.5 bg-[#FCF4F6] hover:bg-[#FAF2F4] text-stone-200 hover:text-white text-xs font-cinzel rounded-lg flex items-center gap-1.5 border border-[#F0D5DA] transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#7A1526]" />
                          <span>Upload File & Crop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleStoryImageUpload(e.target.files[0]);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Artisan / Master Craftsman Name</label>
                  <input
                    value={storyForm.artisanName}
                    onChange={(e) => setStoryForm({ ...storyForm, artisanName: e.target.value })}
                    placeholder="e.g. Ustad Ramzan Ali"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Tags (Comma-separated)</label>
                  <input
                    value={storyForm.tags ? storyForm.tags.join(', ') : ''}
                    onChange={(e) => {
                      const tagsArr = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                      setStoryForm({ ...storyForm, tags: tagsArr });
                    }}
                    placeholder="Handloom, Raw Silk, Zari"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Artisan Quote / Philosophy</label>
                  <input
                    value={storyForm.artisanQuote}
                    onChange={(e) => setStoryForm({ ...storyForm, artisanQuote: e.target.value })}
                    placeholder="e.g. Every thread has a rhythm and a song."
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] italic focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Craftsmanship Process Detail</label>
                  <input
                    value={storyForm.craftsmanshipDetail}
                    onChange={(e) => setStoryForm({ ...storyForm, craftsmanshipDetail: e.target.value })}
                    placeholder="e.g. Over 40 hours of hand-spun zari weaving on wooden looms."
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Story Narrative / Description</label>
                  <textarea
                    rows={2}
                    value={storyForm.description}
                    onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                    placeholder="Describe the artisan journey, cluster heritage, or cultural significance..."
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#F0D5DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddStoryOpen(false);
                    setEditingStory(null);
                  }}
                  className="px-4 py-2 bg-[#FCF4F6] hover:bg-[#F8E2E6] text-[#7A1526] border border-[#F0D5DA] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStory ? 'Update Discovery Reel' : 'Save Discovery Reel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SHOP BY STYLE SILHOUETTE */}
      {isAddStyleOpen && (
        <div className="fixed inset-0 z-50 bg-[#20050A]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#F0D5DA] rounded-2xl max-w-xl w-full p-6 text-xs text-[#3B0A12] space-y-5 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#7A1526]" />
                <h3 className="font-cinzel text-base font-bold text-white tracking-wider">
                  {editingStyle ? `EDIT STYLE SILHOUETTE: ${editingStyle.title}` : 'ADD NEW STYLE SILHOUETTE'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddStyleOpen(false);
                  setEditingStyle(null);
                }}
                className="p-1.5 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingStyle) {
                  const updated = stylesList.map((s) => (s.id === editingStyle.id ? { ...styleForm } : s));
                  onUpdateStylesList(updated);
                } else {
                  onUpdateStylesList([...stylesList, { ...styleForm, id: `style-${Date.now()}` }]);
                }
                setIsAddStyleOpen(false);
                setEditingStyle(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1 font-semibold">Style Silhouette Title *</label>
                  <input
                    required
                    value={styleForm.title}
                    onChange={(e) => setStyleForm({ ...styleForm, title: e.target.value })}
                    placeholder="e.g. Ethnic, Classic, Festive, Bridal"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Designs / Silhouette Count</label>
                  <input
                    type="number"
                    required
                    value={styleForm.itemCount}
                    onChange={(e) => setStyleForm({ ...styleForm, itemCount: parseInt(e.target.value) || 0 })}
                    placeholder="24"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] font-mono focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Accent Subtitle / Highlight</label>
                  <input
                    value={styleForm.accentText || ''}
                    onChange={(e) => setStyleForm({ ...styleForm, accentText: e.target.value })}
                    placeholder="e.g. Pure Silks & Zari Weaves"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                {/* Style Arch Image & PC Upload Studio */}
                <div className="sm:col-span-2 bg-[#FCF4F6] p-4 rounded-xl border border-[#F0D5DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#7A1526] font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Crop className="w-4 h-4 text-[#7A1526]" />
                      <span>Style Silhouette Arch Photo (3:4 Lookbook Ratio) *</span>
                    </label>
                    <span className="text-[10px] text-[#7E4A53] font-mono">Architectural Frame</span>
                  </div>

                  {/* Drag and Drop Zone + Computer Upload */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingStyleModalImage(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingStyleModalImage(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingStyleModalImage(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleStyleImageUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                      isDraggingStyleModalImage
                        ? 'border-[#7A1526] bg-[#7A1526]/10 scale-[1.01]'
                        : 'border-[#DFBAC2] bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 flex flex-col items-center">
                        <div className="relative group w-24 h-32 rounded-lg overflow-hidden border-2 border-[#DFBAC2] bg-black shadow-lg flex items-center justify-center">
                          {styleForm.image ? (
                            <img
                              src={styleForm.image}
                              alt="Style Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-[#8F6C72]">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <span className="text-[10px]">No image</span>
                            </div>
                          )}

                          {styleForm.image && (
                            <button
                              type="button"
                              onClick={() => {
                                openImageResizer(
                                  styleForm.image,
                                  'product',
                                  `Style Image: ${styleForm.title || 'New Style'}`,
                                  (cropped) => setStyleForm((prev) => ({ ...prev, image: cropped }))
                                );
                              }}
                              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-[10px] font-cinzel transition-all cursor-pointer"
                            >
                              <Crop className="w-4 h-4 text-[#7A1526]" />
                              <span>Resize & Crop</span>
                            </button>
                          )}
                        </div>
                        <span className="text-[9px] text-[#7E4A53] mt-1 font-mono">3:4 Lookbook Arch</span>
                      </div>

                      <div className="sm:col-span-8 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            title="Upload photo from computer / PC"
                            className="px-3.5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                          >
                            <Upload className="w-4 h-4 text-white" />
                            <span>Upload from Computer</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleStyleImageUpload(e.target.files[0]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              if (styleForm.image) {
                                openImageResizer(
                                  styleForm.image,
                                  'product',
                                  `Style Image: ${styleForm.title || 'New Style'}`,
                                  (cropped) => setStyleForm((prev) => ({ ...prev, image: cropped }))
                                );
                              }
                            }}
                            disabled={!styleForm.image}
                            className="px-3 py-2 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel rounded-lg flex items-center gap-1.5 border border-[#DFBAC2] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Crop 3:4 Studio</span>
                          </button>
                        </div>

                        <p className="text-[10px] text-[#7E4A53]">
                          Drag and drop photo here or click <span className="font-semibold text-[#7A1526]">Upload from Computer</span>. JPG, PNG, WebP supported.
                        </p>

                        <div>
                          <span className="text-[10px] text-[#7E4A53] block mb-1">Or Paste Web Image URL</span>
                          <input
                            required
                            value={styleForm.image}
                            onChange={(e) => setStyleForm({ ...styleForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] text-xs focus:outline-none focus:border-[#7A1526]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={styleForm.description || ''}
                    onChange={(e) => setStyleForm({ ...styleForm, description: e.target.value })}
                    placeholder="Bespoke tailoring handcrafted with pure heritage weaves..."
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#F0D5DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddStyleOpen(false);
                    setEditingStyle(null);
                  }}
                  className="px-4 py-2 bg-[#FCF4F6] hover:bg-[#F8E2E6] text-[#7A1526] border border-[#F0D5DA] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStyle ? 'Update Style Silhouette' : 'Save Style Silhouette'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SHOP BY COLLECTION CARD */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-[#20050A]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#F0D5DA] rounded-2xl max-w-xl w-full p-6 text-xs text-[#3B0A12] space-y-5 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D5DA]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#7A1526]" />
                <h3 className="font-cinzel text-base font-bold text-white tracking-wider">
                  {editingCategory ? `EDIT COLLECTION: ${editingCategory.title}` : 'ADD NEW COLLECTION CARD'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddCategoryOpen(false);
                  setEditingCategory(null);
                }}
                className="p-1.5 rounded-lg bg-[#FCF4F6] hover:bg-[#FAF2F4] text-[#7E4A53] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingCategory) {
                  const updated = categoriesList.map((c) => (c.id === editingCategory.id ? { ...categoryForm } : c));
                  onUpdateCategoriesList(updated);
                } else {
                  const autoSlug = categoryForm.slug || categoryForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  onUpdateCategoriesList([...categoriesList, { ...categoryForm, slug: autoSlug, id: `cat-${Date.now()}` }]);
                }
                setIsAddCategoryOpen(false);
                setEditingCategory(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1 font-semibold">Collection Name *</label>
                  <input
                    required
                    value={categoryForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      setCategoryForm({ ...categoryForm, title: val, slug: categoryForm.slug ? categoryForm.slug : autoSlug });
                    }}
                    placeholder="e.g. Kurtas, Sarees, Dresses, Chanderi"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B3740] font-cinzel mb-1">Ensembles / Items Count</label>
                  <input
                    type="number"
                    required
                    value={categoryForm.itemCount}
                    onChange={(e) => setCategoryForm({ ...categoryForm, itemCount: parseInt(e.target.value) || 0 })}
                    placeholder="18"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2.5 text-[#3B0A12] font-mono focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B3740] font-cinzel mb-1">Category Slug / Filter Key</label>
                  <input
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="e.g. kurtas, sarees, festive-sets"
                    className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] font-mono focus:outline-none focus:border-[#7A1526]"
                  />
                </div>

                {/* Collection Arch Image & PC Upload Studio */}
                <div className="sm:col-span-2 bg-[#FCF4F6] p-4 rounded-xl border border-[#F0D5DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#7A1526] font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Crop className="w-4 h-4 text-[#7A1526]" />
                      <span>Mughal Arch Card Photo (3:4 Ratio) *</span>
                    </label>
                    <span className="text-[10px] text-[#7E4A53] font-mono">Arch Card Frame</span>
                  </div>

                  {/* Drag and Drop Zone + Computer Upload */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingCategoryModalImage(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingCategoryModalImage(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingCategoryModalImage(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleCategoryImageUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                      isDraggingCategoryModalImage
                        ? 'border-[#7A1526] bg-[#7A1526]/10 scale-[1.01]'
                        : 'border-[#DFBAC2] bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 flex flex-col items-center">
                        <div className="relative group w-24 h-32 rounded-lg overflow-hidden border-2 border-[#DFBAC2] bg-black shadow-lg flex items-center justify-center">
                          {categoryForm.image ? (
                            <img
                              src={categoryForm.image}
                              alt="Category Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-[#8F6C72]">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <span className="text-[10px]">No image</span>
                            </div>
                          )}

                          {categoryForm.image && (
                            <button
                              type="button"
                              onClick={() => {
                                openImageResizer(
                                  categoryForm.image,
                                  'product',
                                  `Collection Arch: ${categoryForm.title || 'New Collection'}`,
                                  (cropped) => setCategoryForm((prev) => ({ ...prev, image: cropped }))
                                );
                              }}
                              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-[10px] font-cinzel transition-all cursor-pointer"
                            >
                              <Crop className="w-4 h-4 text-[#7A1526]" />
                              <span>Resize & Crop</span>
                            </button>
                          )}
                        </div>
                        <span className="text-[9px] text-[#7E4A53] mt-1 font-mono">3:4 Mughal Arch</span>
                      </div>

                      <div className="sm:col-span-8 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            title="Upload photo from computer / PC"
                            className="px-3.5 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                          >
                            <Upload className="w-4 h-4 text-white" />
                            <span>Upload from Computer</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCategoryImageUpload(e.target.files[0]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              if (categoryForm.image) {
                                openImageResizer(
                                  categoryForm.image,
                                  'product',
                                  `Collection Arch: ${categoryForm.title || 'New Collection'}`,
                                  (cropped) => setCategoryForm((prev) => ({ ...prev, image: cropped }))
                                );
                              }
                            }}
                            disabled={!categoryForm.image}
                            className="px-3 py-2 bg-[#FAF2F4] hover:bg-[#7A1526] text-[#7A1526] hover:text-white text-xs font-cinzel rounded-lg flex items-center gap-1.5 border border-[#DFBAC2] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Crop 3:4 Studio</span>
                          </button>
                        </div>

                        <p className="text-[10px] text-[#7E4A53]">
                          Drag and drop photo here or click <span className="font-semibold text-[#7A1526]">Upload from Computer</span>. JPG, PNG, WebP supported.
                        </p>

                        <div>
                          <span className="text-[10px] text-[#7E4A53] block mb-1">Or Paste Web Image URL</span>
                          <input
                            required
                            value={categoryForm.image}
                            onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white border border-[#F0D5DA] rounded-lg p-2 text-[#3B0A12] text-xs focus:outline-none focus:border-[#7A1526]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#F0D5DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCategoryOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 bg-[#FCF4F6] hover:bg-[#F8E2E6] text-[#7A1526] border border-[#F0D5DA] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Update Collection Card' : 'Save Collection Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER INVOICE RECEIPT */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#3B0A12] border border-[#F0D5DA] rounded-xl max-w-xl w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" logoCMS={logoCMS} />
                <span className="font-mono font-bold text-sm text-[#7A1526]">INVOICE #{selectedOrderForInvoice.orderNumber}</span>
              </div>
              <button onClick={() => setSelectedOrderForInvoice(null)} className="p-1 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <strong>Billed To:</strong>
                <div>{selectedOrderForInvoice.customerName}</div>
                <div>{selectedOrderForInvoice.shippingAddress}, {selectedOrderForInvoice.city}</div>
                <div>{selectedOrderForInvoice.customerPhone}</div>
              </div>
              <div className="text-right">
                <div><strong>Date:</strong> {selectedOrderForInvoice.createdAt}</div>
                <div><strong>Payment:</strong> {selectedOrderForInvoice.paymentStatus} ({selectedOrderForInvoice.paymentMethod})</div>
                <div><strong>GSTIN:</strong> 27AABCS1429K1Z5</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Size</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOrderForInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2">{item.size}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2 text-right font-mono font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-sm">
              <span>Total Amount Paid</span>
              <span className="font-mono text-[#7A1526]">₹{selectedOrderForInvoice.total.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#7A1526] text-white font-cinzel rounded text-xs font-semibold cursor-pointer"
              >
                Print Official Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE RESIZER & CROPPER MODAL (HERO BANNERS, PRODUCTS & CMS) */}
      <ImageResizerModal
        isOpen={resizerModalOpen}
        imageSrc={resizerImageSrc}
        title={resizerSlideTitle}
        mode={resizerMode}
        onClose={() => setResizerModalOpen(false)}
        onSave={handleSaveResizedImage}
      />

    </div>
  );
};
