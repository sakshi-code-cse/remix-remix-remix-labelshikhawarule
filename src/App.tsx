import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ShopByStyle } from './components/ShopByStyle';
import { BestSellers } from './components/BestSellers';
import { ShopByCategory } from './components/ShopByCategory';
import { DiscoverySection } from './components/DiscoverySection';
import { FlagshipStore } from './components/FlagshipStore';
import { ClientDiaries } from './components/ClientDiaries';
import { BookAppointment } from './components/BookAppointment';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AppointmentModal } from './components/AppointmentModal';
import { StoryModal } from './components/StoryModal';
import { SearchModal } from './components/SearchModal';
import { SizeGuideModal, StoreLocatorModal, ShippingReturnsModal, ClientDiaryModal } from './components/InfoModals';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountDrawer } from './components/CustomerAccountDrawer';
import { CollectionPage } from './components/CollectionPage';
import { ProductPage } from './components/ProductPage';
import { safeLocalStorage } from './utils/storage';
import { 
  saveToCloudDatabase, 
  subscribeToCloudStoreData, 
  saveFullStoreSnapshot, 
  fetchCloudStoreData 
} from './lib/cloudStore';

import { 
  ALL_PRODUCTS, 
  BEST_SELLERS, 
  INITIAL_ADMIN_ORDERS, 
  INITIAL_ADMIN_APPOINTMENTS, 
  PROMO_CODES, 
  CLIENT_DIARIES,
  MOCK_CUSTOMERS,
  INITIAL_HERO_CMS,
  INITIAL_BRAND_STORY_CMS,
  INITIAL_STORE_SETTINGS_CMS,
  INITIAL_LOGO_CMS,
  STYLE_CATEGORIES,
  CATEGORIES_LIST,
  DISCOVERY_STORIES
} from './data/mockData';
import { 
  Product, 
  CartItem, 
  DiscoveryStory, 
  AdminOrder, 
  AdminAppointment, 
  PromoCode, 
  ClientDiary,
  AppointmentForm,
  CustomerUser,
  HeroCMSContent,
  BrandStoryCMSContent,
  StoreSettingsCMSContent,
  LogoCMSContent,
  StyleCategory,
  CategoryItem
} from './types';
import { Filter, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  // Store Catalog & Data State (Shared & Reactive with Admin & Persisted)
  const [products, setProducts] = useState<Product[]>(() => {
    return safeLocalStorage.getJSON<Product[]>('label_sw_products', ALL_PRODUCTS);
  });
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    return safeLocalStorage.getJSON<AdminOrder[]>('label_sw_orders', INITIAL_ADMIN_ORDERS);
  });
  const [appointments, setAppointments] = useState<AdminAppointment[]>(() => {
    return safeLocalStorage.getJSON<AdminAppointment[]>('label_sw_appointments', INITIAL_ADMIN_APPOINTMENTS);
  });
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    return safeLocalStorage.getJSON<PromoCode[]>('label_sw_promo_codes', PROMO_CODES);
  });
  const [clientDiaries, setClientDiaries] = useState<ClientDiary[]>(() => {
    return safeLocalStorage.getJSON<ClientDiary[]>('label_sw_client_diaries', CLIENT_DIARIES);
  });
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    return safeLocalStorage.getItem('label_sw_announcement_text') || 'WELCOME TO OUR STORE!';
  });

  // Full CMS State
  const [heroCMS, setHeroCMS] = useState<HeroCMSContent>(() => {
    return safeLocalStorage.getJSON<HeroCMSContent>('label_sw_hero_cms', INITIAL_HERO_CMS);
  });
  const [brandStoryCMS, setBrandStoryCMS] = useState<BrandStoryCMSContent>(() => {
    return safeLocalStorage.getJSON<BrandStoryCMSContent>('label_sw_brand_story_cms', INITIAL_BRAND_STORY_CMS);
  });
  const [storeSettingsCMS, setStoreSettingsCMS] = useState<StoreSettingsCMSContent>(() => {
    return safeLocalStorage.getJSON<StoreSettingsCMSContent>('label_sw_store_settings_cms', INITIAL_STORE_SETTINGS_CMS);
  });
  const [logoCMS, setLogoCMS] = useState<LogoCMSContent>(() => {
    return safeLocalStorage.getJSON<LogoCMSContent>('label_sw_logo_cms', INITIAL_LOGO_CMS);
  });
  const [stylesList, setStylesList] = useState<StyleCategory[]>(() => {
    const saved = safeLocalStorage.getJSON<StyleCategory[]>('label_sw_styles_list', STYLE_CATEGORIES);
    if (Array.isArray(saved) && saved.length > 0 && saved.some(s => s.id === 'kurtas' || s.title?.toLowerCase() === 'kurtas' || s.id === 'sherwanis' || s.id === 'jacket-set')) {
      return saved;
    }
    safeLocalStorage.setJSON('label_sw_styles_list', STYLE_CATEGORIES);
    return STYLE_CATEGORIES;
  });
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    return safeLocalStorage.getJSON<CategoryItem[]>('label_sw_categories_list', CATEGORIES_LIST);
  });
  const [discoveryStories, setDiscoveryStories] = useState<DiscoveryStory[]>(() => {
    return safeLocalStorage.getJSON<DiscoveryStory[]>('label_sw_discovery_stories', DISCOVERY_STORIES);
  });
  const [customers, setCustomers] = useState<CustomerUser[]>(MOCK_CUSTOMERS);

  // Admin Authentication & View State (false by default until admin logs in)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return safeLocalStorage.getItem('label_sw_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return safeLocalStorage.getItem('label_sw_admin_email') || '';
  });
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Cloud Database Sync Status
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Setup Firestore Real-time Listener & Cloud Initializer
  useEffect(() => {
    let isMounted = true;

    // 1. First fetch or initialize cloud data
    fetchCloudStoreData().then((cloudData) => {
      if (!isMounted) return;
      if (!cloudData) {
        // Seed cloud with initial baseline
        saveFullStoreSnapshot({
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
        });
      } else {
        // Ensure stylesList in Firestore is updated with the 5 styles if missing or outdated
        const cloudStyles = cloudData.stylesList;
        const hasNewStyles = Array.isArray(cloudStyles) && cloudStyles.some(s => s.id === 'kurtas' || s.title?.toLowerCase() === 'kurtas' || s.id === 'sherwanis' || s.id === 'jacket-set');
        if (!hasNewStyles) {
          saveToCloudDatabase('stylesList', STYLE_CATEGORIES);
        }
      }
    });

    // 2. Subscribe to real-time changes
    const unsubscribe = subscribeToCloudStoreData(
      (data) => {
        if (!isMounted) return;
        setIsCloudSynced(true);
        if (data.lastUpdated) {
          setLastSyncTime(new Date(data.lastUpdated).toLocaleTimeString());
        }

        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          safeLocalStorage.setJSON('label_sw_products', data.products);
        }
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          safeLocalStorage.setJSON('label_sw_orders', data.orders);
        }
        if (data.appointments && Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
          safeLocalStorage.setJSON('label_sw_appointments', data.appointments);
        }
        if (data.promoCodes && Array.isArray(data.promoCodes)) {
          setPromoCodes(data.promoCodes);
          safeLocalStorage.setJSON('label_sw_promo_codes', data.promoCodes);
        }
        if (data.clientDiaries && Array.isArray(data.clientDiaries)) {
          setClientDiaries(data.clientDiaries);
          safeLocalStorage.setJSON('label_sw_client_diaries', data.clientDiaries);
        }
        if (typeof data.announcementText === 'string') {
          setAnnouncementText(data.announcementText);
          safeLocalStorage.setItem('label_sw_announcement_text', data.announcementText);
        }
        if (data.heroCMS) {
          setHeroCMS(data.heroCMS);
          safeLocalStorage.setJSON('label_sw_hero_cms', data.heroCMS);
        }
        if (data.brandStoryCMS) {
          setBrandStoryCMS(data.brandStoryCMS);
          safeLocalStorage.setJSON('label_sw_brand_story_cms', data.brandStoryCMS);
        }
        if (data.storeSettingsCMS) {
          setStoreSettingsCMS(data.storeSettingsCMS);
          safeLocalStorage.setJSON('label_sw_store_settings_cms', data.storeSettingsCMS);
        }
        if (data.logoCMS) {
          setLogoCMS(data.logoCMS);
          safeLocalStorage.setJSON('label_sw_logo_cms', data.logoCMS);
        }
        if (data.stylesList && Array.isArray(data.stylesList)) {
          const hasNewStyles = data.stylesList.some(s => s.id === 'kurtas' || s.title?.toLowerCase() === 'kurtas' || s.id === 'sherwanis' || s.id === 'jacket-set');
          if (!hasNewStyles) {
            setStylesList(STYLE_CATEGORIES);
            safeLocalStorage.setJSON('label_sw_styles_list', STYLE_CATEGORIES);
            saveToCloudDatabase('stylesList', STYLE_CATEGORIES);
          } else {
            setStylesList(data.stylesList);
            safeLocalStorage.setJSON('label_sw_styles_list', data.stylesList);
          }
        }
        if (data.categoriesList && Array.isArray(data.categoriesList)) {
          setCategoriesList(data.categoriesList);
          safeLocalStorage.setJSON('label_sw_categories_list', data.categoriesList);
        }
        if (data.discoveryStories && Array.isArray(data.discoveryStories)) {
          setDiscoveryStories(data.discoveryStories);
          safeLocalStorage.setJSON('label_sw_discovery_stories', data.discoveryStories);
        }
      },
      (err) => {
        console.warn('Firestore live listener info:', err);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);


  // Customer Shopping Bag & Wishlist (empty by default)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Customer User Authentication & Profile State (null until customer logs in)
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => {
    return safeLocalStorage.getJSON<CustomerUser | null>('label_sw_customer_user', null);
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [isCustomerAccountDrawerOpen, setIsCustomerAccountDrawerOpen] = useState(false);

  // Modals & Drawers Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [isShippingInfoOpen, setIsShippingInfoOpen] = useState(false);
  const [isClientDiaryModalOpen, setIsClientDiaryModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    subtotal: number;
    discount: number;
    appliedPromo: string | null;
    isGiftWrap: boolean;
    orderNotes: string;
  }>({
    subtotal: 0,
    discount: 0,
    appliedPromo: 'WELCOME10',
    isGiftWrap: false,
    orderNotes: '',
  });
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<AdminOrder | null>(null);

  // Selected Items for Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStory, setSelectedStory] = useState<DiscoveryStory | null>(null);

  // Page View Routing (home vs collection vs product)
  const [currentView, setCurrentView] = useState<'home' | 'collection' | 'product'>('home');
  const [currentCollectionSlug, setCurrentCollectionSlug] = useState<string>('new-arrivals');
  const [activeProductPage, setActiveProductPage] = useState<Product | null>(null);

  // Active Category / Style / Gender Filters for home
  const [activeFilter, setActiveFilter] = useState<{
    type: 'all' | 'category' | 'style' | 'gender' | 'sale';
    value: string;
  }>({ type: 'all', value: 'All' });

  // Dedicated Route & Shortcut Listener (#admin, #/collections/..., #/product/..., Ctrl+Shift+A)
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const pathname = window.location.pathname || '';

      if (hash === '#admin' || search.includes('admin') || pathname.endsWith('/admin')) {
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginModalOpen(true);
        }
      } else if (hash.startsWith('#/product/') || hash.startsWith('#product/')) {
        const prodId = hash.replace(/^#\/?product\//, '');
        const found = products.find((p) => p.id.toLowerCase() === prodId.toLowerCase());
        if (found) {
          setActiveProductPage(found);
          setCurrentView('product');
        } else {
          setCurrentView('home');
        }
      } else if (hash.startsWith('#/collections/') || hash.startsWith('#collections/')) {
        const slug = hash.replace(/^#\/?collections\//, '') || 'new-arrivals';
        setCurrentView('collection');
        setCurrentCollectionSlug(slug);
      } else if (hash === '#/new-arrivals' || hash === '#new-arrivals') {
        setCurrentView('collection');
        setCurrentCollectionSlug('new-arrivals');
      } else if (hash === '#/all' || hash === '#all') {
        setCurrentView('collection');
        setCurrentCollectionSlug('all');
      } else if (hash === '#/' || hash === '' || hash === '#') {
        setCurrentView('home');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    // Discrete Staff Keyboard Shortcut: Ctrl + Shift + A / Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen((prev) => !prev);
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminLoggedIn]);

  // Route Navigation Handlers
  const navigateToProduct = (product: Product) => {
    setActiveProductPage(product);
    setCurrentView('product');
    window.location.hash = `/product/${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCollection = (slug: string = 'new-arrivals') => {
    setCurrentView('collection');
    setCurrentCollectionSlug(slug);
    window.location.hash = `/collections/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setActiveFilter({ type: 'all', value: 'All' });
    if (window.location.hash) {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Helper
  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const handleAddToCart = (product: Product, size: string = 'M', quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: `item-${Date.now()}-${Math.random()}`,
            product,
            selectedSize: size,
            quantity,
          },
        ];
      }
    });
    addToast('cart', 'Added to Shopping Bag', `${product.name} (Size ${size})`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'Item removed from bag');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = (newOrder: AdminOrder) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      safeLocalStorage.setJSON('label_sw_orders', updated);
      saveToCloudDatabase('orders', updated);
      return updated;
    });
    addToast('cart', 'Order Confirmed!', `Order ${newOrder.orderNumber} placed successfully.`);
    
    // Reward customer with Couture Points if logged in
    if (currentCustomer) {
      const earnedPoints = Math.round(newOrder.total * 0.05); // 5% cashback in points
      const updatedCustomer: CustomerUser = {
        ...currentCustomer,
        couturePoints: currentCustomer.couturePoints + earnedPoints,
        ordersCount: currentCustomer.ordersCount + 1,
        totalSpent: currentCustomer.totalSpent + newOrder.total,
      };
      setCurrentCustomer(updatedCustomer);
      safeLocalStorage.setJSON('label_sw_customer_user', updatedCustomer);
      addToast('wishlist', `+${earnedPoints} Couture Points Earned!`, `New balance: ${updatedCustomer.couturePoints} pts`);
    }
  };

  // Customer Authentication & Profile Handlers
  const handleCustomerLogin = (user: CustomerUser) => {
    setCurrentCustomer(user);
    safeLocalStorage.setJSON('label_sw_customer_user', user);
    setIsCustomerAuthModalOpen(false);
    addToast('info', `Welcome, ${user.name}!`, `Signed in to Shikha Warule Atelier Circle (${user.tier} Member)`);
  };

  const handleCustomerLogout = () => {
    setCurrentCustomer(null);
    safeLocalStorage.removeItem('label_sw_customer_user');
    setIsCustomerAccountDrawerOpen(false);
    addToast('info', 'Signed Out', 'You have been logged out of your client profile.');
  };

  const handleUpdateCustomerProfile = (updatedData: Partial<CustomerUser>) => {
    if (!currentCustomer) return;
    const updated: CustomerUser = {
      ...currentCustomer,
      ...updatedData,
    };
    setCurrentCustomer(updated);
    safeLocalStorage.setJSON('label_sw_customer_user', updated);
    addToast('info', 'Profile Updated', 'Your bespoke preferences and measurements have been saved.');
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('info', 'Removed from Wishlist', product.name);
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('wishlist', 'Saved to Wishlist', product.name);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isWishlisted = (productId: string) => wishlist.some((p) => p.id === productId);

  // Appointment Submission
  const handleAppointmentBooked = (form: AppointmentForm) => {
    const newApt: AdminAppointment = {
      ...form,
      id: `apt-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      assignedStylist: 'Shikha Warule (Principal Couturier)',
    };
    setAppointments((prev) => {
      const updated = [newApt, ...prev];
      safeLocalStorage.setJSON('label_sw_appointments', updated);
      saveToCloudDatabase('appointments', updated);
      return updated;
    });
    addToast('info', 'Consultation Booked', `${form.experienceType} for ${form.fullName}`);
  };

  // Admin Handlers
  const handleLoginSuccess = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    safeLocalStorage.setItem('label_sw_admin_auth', 'true');
    safeLocalStorage.setItem('label_sw_admin_email', email);
    setIsAdminLoginModalOpen(false);
    setIsAdminDashboardOpen(true);
    addToast('info', 'Admin Access Granted', `Welcome back, ${email}`);
  };

  const handleCloseAdminPortal = () => {
    setIsAdminDashboardOpen(false);
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    safeLocalStorage.removeItem('label_sw_admin_auth');
    safeLocalStorage.removeItem('label_sw_admin_email');
    setIsAdminDashboardOpen(false);
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    addToast('info', 'Admin Signed Out', 'Returned to customer storefront');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      safeLocalStorage.setJSON('label_sw_products', updated);
      saveToCloudDatabase('products', updated);
      return updated;
    });
    addToast('success', 'Product Published & Saved to Database', `${newProduct.name} is now saved securely in cloud database`);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => {
      const updatedList = prev.map((p) => (p.id === updated.id ? updated : p));
      safeLocalStorage.setJSON('label_sw_products', updatedList);
      saveToCloudDatabase('products', updatedList);
      return updatedList;
    });
    // Also update selected product preview if open
    setSelectedProduct((prev) => (prev && prev.id === updated.id ? updated : prev));
    // Also sync cart and wishlist items
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === updated.id ? { ...item, product: updated } : item))
    );
    setWishlist((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    addToast('success', 'Product Updated in Database', `${updated.name} changes saved permanently`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updatedList = prev.filter((p) => p.id !== productId);
      safeLocalStorage.setJSON('label_sw_products', updatedList);
      saveToCloudDatabase('products', updatedList);
      return updatedList;
    });
    setSelectedProduct((prev) => (prev && prev.id === productId ? null : prev));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    addToast('info', 'Product Removed from Database', 'Item deleted from cloud database');
  };

  const handleUpdateOrderStatus = (orderId: string, status: AdminOrder['orderStatus']) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
      safeLocalStorage.setJSON('label_sw_orders', updated);
      saveToCloudDatabase('orders', updated);
      return updated;
    });
    addToast('info', 'Order Status Saved', `Order marked as ${status}`);
  };

  const handleUpdateAppointmentStatus = (aptId: string, status: AdminAppointment['status']) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === aptId ? { ...a, status } : a));
      safeLocalStorage.setJSON('label_sw_appointments', updated);
      saveToCloudDatabase('appointments', updated);
      return updated;
    });
    addToast('info', 'Appointment Saved', `Status changed to ${status}`);
  };

  const handleAddPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => {
      const updated = [...prev.filter((p) => p.code !== promo.code), promo];
      safeLocalStorage.setJSON('label_sw_promo_codes', updated);
      saveToCloudDatabase('promoCodes', updated);
      return updated;
    });
    addToast('info', 'Coupon Saved to Database', `Code ${promo.code} is now active`);
  };

  const handleDeletePromoCode = (code: string) => {
    setPromoCodes((prev) => {
      const updated = prev.filter((p) => p.code !== code);
      safeLocalStorage.setJSON('label_sw_promo_codes', updated);
      saveToCloudDatabase('promoCodes', updated);
      return updated;
    });
    addToast('info', 'Coupon Removed', `Code ${code} deleted from database`);
  };

  // Filtered Products Calculation for Storefront
  const displayedProducts = useMemo(() => {
    if (activeFilter.type === 'all') return products;
    if (activeFilter.type === 'gender') {
      return products.filter((p) => p.gender.toLowerCase() === activeFilter.value.toLowerCase() || p.gender === 'Unisex');
    }
    if (activeFilter.type === 'category') {
      return products.filter((p) => p.category.toLowerCase() === activeFilter.value.toLowerCase());
    }
    if (activeFilter.type === 'style') {
      const target = activeFilter.value.toLowerCase().replace(/s$/, '').replace(/[-_ ]/g, '');
      return products.filter((p) => {
        const styleNorm = (p.style || '').toLowerCase().replace(/s$/, '').replace(/[-_ ]/g, '');
        const catNorm = (p.category || '').toLowerCase().replace(/s$/, '').replace(/[-_ ]/g, '');
        const nameNorm = (p.name || '').toLowerCase().replace(/s$/, '').replace(/[-_ ]/g, '');
        const tagsNorm = (p.tags || []).map((t) => t.toLowerCase().replace(/s$/, '').replace(/[-_ ]/g, ''));
        return (
          styleNorm === target ||
          styleNorm.includes(target) ||
          target.includes(styleNorm) ||
          catNorm === target ||
          catNorm.includes(target) ||
          target.includes(catNorm) ||
          nameNorm.includes(target) ||
          tagsNorm.some((t) => t.includes(target) || target.includes(t))
        );
      });
    }
    if (activeFilter.type === 'sale') {
      return products.filter((p) => Boolean(p.originalPrice));
    }
    return products;
  }, [activeFilter, products]);

  // Handlers for Navigation / Categorization
  const handleFilterSelect = (filterName: string) => {
    if (['Men', 'Women', 'Kids', 'Accessories'].includes(filterName)) {
      setActiveFilter({ type: 'gender', value: filterName });
    } else if (filterName === 'Sale') {
      setActiveFilter({ type: 'sale', value: 'Sale' });
    } else if (filterName === 'Ready to Wear') {
      setActiveFilter({ type: 'style', value: 'Everyday' });
    } else if (filterName === 'All') {
      setActiveFilter({ type: 'all', value: 'All' });
    } else {
      setActiveFilter({ type: 'category', value: filterName });
    }

    const section = document.getElementById('best-sellers-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If Admin Dashboard is explicitly open, render the Full Admin Portal!
  if (isAdminDashboardOpen) {
    return (
      <>
        <AdminPortal
          products={products}
          orders={orders}
          appointments={appointments}
          promoCodes={promoCodes}
          clientDiaries={clientDiaries}
          announcementText={announcementText}
          heroCMS={heroCMS}
          brandStoryCMS={brandStoryCMS}
          storeSettingsCMS={storeSettingsCMS}
          logoCMS={logoCMS}
          stylesList={stylesList}
          categoriesList={categoriesList}
          discoveryStories={discoveryStories}
          customers={customers}
          onUpdateAnnouncement={(txt) => {
            setAnnouncementText(txt);
            safeLocalStorage.setItem('label_sw_announcement_text', txt);
            saveToCloudDatabase('announcementText', txt);
            addToast('success', 'Announcement Bar Saved to Database', 'Storefront ticker refreshed and synced.');
          }}
          onUpdateHeroCMS={(content) => {
            setHeroCMS(content);
            safeLocalStorage.setJSON('label_sw_hero_cms', content);
            saveToCloudDatabase('heroCMS', content);
            addToast('success', 'Hero Banner Saved to Database', 'Storefront hero banner images and settings synced.');
          }}
          onUpdateBrandStoryCMS={(content) => {
            setBrandStoryCMS(content);
            safeLocalStorage.setJSON('label_sw_brand_story_cms', content);
            saveToCloudDatabase('brandStoryCMS', content);
            addToast('success', 'Brand Story Saved to Database', 'Atelier manifesto and founder quote synced.');
          }}
          onUpdateStoreSettingsCMS={(content) => {
            setStoreSettingsCMS(content);
            safeLocalStorage.setJSON('label_sw_store_settings_cms', content);
            saveToCloudDatabase('storeSettingsCMS', content);
            addToast('success', 'Store Policies Saved to Database', 'Contact info and policies synced.');
          }}
          onUpdateLogoCMS={(content) => {
            setLogoCMS(content);
            safeLocalStorage.setJSON('label_sw_logo_cms', content);
            saveToCloudDatabase('logoCMS', content);
            addToast('success', 'Brand Logo Saved to Database', 'Storefront header and footer brand logo synced.');
          }}
          onUpdateStylesList={(list) => {
            setStylesList(list);
            safeLocalStorage.setJSON('label_sw_styles_list', list);
            saveToCloudDatabase('stylesList', list);
            addToast('success', 'Styles Saved to Database', 'Shop By Style silhouettes synced.');
          }}
          onUpdateCategoriesList={(list) => {
            setCategoriesList(list);
            safeLocalStorage.setJSON('label_sw_categories_list', list);
            saveToCloudDatabase('categoriesList', list);
            addToast('success', 'Collections Saved to Database', 'Shop By Collection cards synced.');
          }}
          onUpdateDiscoveryStories={(list) => {
            setDiscoveryStories(list);
            safeLocalStorage.setJSON('label_sw_discovery_stories', list);
            saveToCloudDatabase('discoveryStories', list);
            addToast('success', 'Discovery Reels Saved to Database', 'Artisan craft reels synced.');
          }}
          onUpdateClientDiaries={(list) => {
            setClientDiaries(list);
            safeLocalStorage.setJSON('label_sw_client_diaries', list);
            saveToCloudDatabase('clientDiaries', list);
            addToast('success', 'Client Diaries Saved to Database', 'Verified patron reviews synced.');
          }}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onAddPromoCode={handleAddPromoCode}
          onDeletePromoCode={handleDeletePromoCode}
          onCloseAdminPortal={handleCloseAdminPortal}
          onLogout={handleLogout}
          adminEmail={adminEmail}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C2420] selection:bg-[#9E472A] selection:text-white">
      
      {/* 1. Sticky Header & Announcement Bar */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onSelectCategory={(category) => {
          handleFilterSelect(category);
          if (currentView === 'collection') {
            // keep on collection or update
          }
        }}
        onNavigateCollection={navigateToCollection}
        onOpenCustomerLogin={() => setIsCustomerAuthModalOpen(true)}
        onOpenCustomerAccount={() => setIsCustomerAccountDrawerOpen(true)}
        currentUser={currentCustomer}
        announcementText={announcementText}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        activeGenderFilter={activeFilter.type === 'gender' ? activeFilter.value : undefined}
        logoCMS={logoCMS}
      />

      {/* Main Page Body: Product View OR Collection View OR Home View */}
      <main className="flex-1">
        {currentView === 'product' && activeProductPage ? (
          <ProductPage
            product={activeProductPage}
            allProducts={products}
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigateToCollection('new-arrivals');
              }
            }}
            onAddToCart={(prod, size, qty, custom) => {
              handleAddToCart(prod, size, qty);
              addToast('success', `Added ${prod.name} (${size}) to your Shopping Bag`);
            }}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            onSelectProduct={(prod) => navigateToProduct(prod)}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onBuyNow={(prod, size, qty) => {
              handleAddToCart(prod, size, qty);
              setIsCartOpen(false);
              setCheckoutData((prev) => ({
                ...prev,
                subtotal: prod.price * qty,
                discount: 0,
              }));
              setIsCheckoutOpen(true);
            }}
          />
        ) : currentView === 'collection' ? (
          <CollectionPage
            products={products}
            currentCollectionSlug={currentCollectionSlug}
            onSelectCollection={(slug) => {
              setCurrentCollectionSlug(slug);
              window.location.hash = `/collections/${slug}`;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(product) => navigateToProduct(product)}
            onAddToCart={(product, size, qty) => handleAddToCart(product, size || 'M', qty || 1)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onBackToHome={navigateToHome}
          />
        ) : (
          <>
            {/* 2. Hero Section */}
            <Hero
              cmsContent={heroCMS}
              onExploreClick={() => navigateToCollection('new-arrivals')}
              onOpenAppointment={() => setIsAppointmentOpen(true)}
            />

            {/* 3. Shop By Style Section */}
            <ShopByStyle
              stylesList={stylesList}
              onSelectStyle={(style) => {
                setActiveFilter({ type: 'style', value: style });
                const el = document.getElementById('best-sellers-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              selectedStyle={activeFilter.type === 'style' ? activeFilter.value : undefined}
            />

            {/* Active Filter Notification Bar */}
            {activeFilter.type !== 'all' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                <div className="p-3 bg-[#F3E8DB] rounded-md border border-[#DFCBB8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#523A30]">
                    <Filter className="w-4 h-4 text-[#9E472A]" />
                    <span>
                      Filtering by <strong className="font-cinzel text-[#9E472A] uppercase">{activeFilter.value}</strong> ({displayedProducts.length} pieces)
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveFilter({ type: 'all', value: 'All' })}
                    className="inline-flex items-center gap-1 text-[#9E472A] hover:underline font-cinzel font-semibold text-[11px] cursor-pointer"
                  >
                    <span>Clear Filter</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Best Sellers / Catalog Section */}
            <BestSellers
              products={displayedProducts.length > 0 ? displayedProducts : products.slice(0, 4)}
              onSelectProduct={(product) => navigateToProduct(product)}
              onAddToCart={(product, size) => handleAddToCart(product, size || 'M', 1)}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted}
              onViewAllClick={() => navigateToCollection('all')}
            />

            {/* 5. Shop By Category Section */}
            <ShopByCategory
              categoriesList={categoriesList}
              onSelectCategory={(cat) => {
                setActiveFilter({ type: 'category', value: cat });
                const el = document.getElementById('best-sellers-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              selectedCategory={activeFilter.type === 'category' ? activeFilter.value : undefined}
              onViewAllCategories={() => navigateToCollection('all')}
            />

            {/* 6. Discovery Product Carousel Section */}
            <DiscoverySection
              onSelectProduct={(product) => navigateToProduct(product)}
            />

            {/* 7. Client Diaries Section */}
            <ClientDiaries
              diariesList={clientDiaries}
              onOpenReviewModal={() => setIsClientDiaryModalOpen(true)}
              onBookAppointment={() => setIsAppointmentOpen(true)}
            />

            {/* 8. Experience Our Flagship Store Section (Nerul Only) */}
            <FlagshipStore />

            {/* 9. Book An Appointment Banner */}
            <BookAppointment
              onOpenBooking={() => setIsAppointmentOpen(true)}
            />
          </>
        )}
      </main>

      {/* 9. Main Footer */}
      <Footer
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        onOpenShippingInfo={() => setIsShippingInfoOpen(true)}
        onOpenTrackOrder={() => {
          if (currentCustomer) {
            setIsCustomerAccountDrawerOpen(true);
          } else {
            addToast('info', 'Order Tracking', 'Sign in to your client account or check your SMS confirmation.');
            setIsShippingInfoOpen(true);
          }
        }}
        onOpenCustomerLogin={() => setIsCustomerAuthModalOpen(true)}
        onOpenCustomerAccount={() => setIsCustomerAccountDrawerOpen(true)}
        currentUser={currentCustomer}
        logoCMS={logoCMS}
        onOpenAbout={() => {
          setSelectedStory({
            id: 'about-atelier',
            title: 'The Philosophy of Label Shikha Warule',
            subtitle: 'Crafting Heritage for Contemporary Lives',
            thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
            videoDuration: '03:15',
            description: 'Label Shikha Warule was founded on the belief that clothing is a wearable piece of art. We work directly with over 120 traditional weaving and embroidery families across Maharashtra, Madhya Pradesh, Bengal, and Rajasthan to create slow, sustainable luxury fashion.',
            craftsmanshipDetail: '100% natural, biodegradable silks and cottons with zero synthetic blends.',
            artisanQuote: '"To preserve our heritage, we must make it relevant, comfortable, and breathtaking for today."',
            artisanName: 'Shikha Warule, Founder & Creative Director',
            tags: ['Ethical Luxury', 'Zero Waste', 'Women Led'],
          });
        }}
      />

      {/* Interactive Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onOpenCheckout={(data) => {
          setCheckoutData(data);
          setIsCheckoutOpen(true);
        }}
        currentUser={currentCustomer}
        onOpenCustomerLogin={() => setIsCustomerAuthModalOpen(true)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={(product) => {
          handleAddToCart(product, 'M', 1);
        }}
        onSelectProduct={(product) => {
          setIsWishlistOpen(false);
          navigateToProduct(product);
        }}
      />

      {/* Customer Authentication Modal (Login / Register / OTP) */}
      <CustomerAuthModal
        isOpen={isCustomerAuthModalOpen}
        onClose={() => setIsCustomerAuthModalOpen(false)}
        onLoginSuccess={handleCustomerLogin}
      />

      {/* Customer Client Account & VIP Dashboard Drawer */}
      <CustomerAccountDrawer
        isOpen={isCustomerAccountDrawerOpen}
        onClose={() => setIsCustomerAccountDrawerOpen(false)}
        customer={currentCustomer}
        user={currentCustomer}
        orders={orders}
        appointments={appointments}
        onLogout={handleCustomerLogout}
        onUpdateProfile={handleUpdateCustomerProfile}
        onViewInvoice={(order) => {
          setSelectedTrackingOrder(order);
          setIsOrderTrackingOpen(true);
        }}
        onBookAppointment={() => {
          setIsCustomerAccountDrawerOpen(false);
          setIsAppointmentOpen(true);
        }}
        onExploreCollection={() => {
          setIsCustomerAccountDrawerOpen(false);
          const el = document.getElementById('best-sellers-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Luxury Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={checkoutData.subtotal}
        discount={checkoutData.discount}
        appliedPromo={checkoutData.appliedPromo}
        isGiftWrap={checkoutData.isGiftWrap}
        orderNotes={checkoutData.orderNotes}
        currentUser={currentCustomer}
        storeSettingsCMS={storeSettingsCMS}
        logoCMS={logoCMS}
        onOrderPlaced={handlePlaceOrder}
        onClearCart={handleClearCart}
      />

      {/* Real-time Order Tracking & Invoice Modal */}
      <OrderTrackingModal
        order={selectedTrackingOrder}
        isOpen={isOrderTrackingOpen}
        onClose={() => {
          setIsOrderTrackingOpen(false);
          setSelectedTrackingOrder(null);
        }}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onAppointmentBooked={handleAppointmentBooked}
      />

      <StoryModal
        story={selectedStory}
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        onExploreCollection={() => {
          setSelectedStory(null);
          const el = document.getElementById('best-sellers-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(product) => {
          setIsSearchOpen(false);
          navigateToProduct(product);
        }}
        onAddToCart={(product) => handleAddToCart(product, 'M', 1)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Informational Modals */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
      />

      <ShippingReturnsModal
        isOpen={isShippingInfoOpen}
        onClose={() => setIsShippingInfoOpen(false)}
      />

      <ClientDiaryModal
        isOpen={isClientDiaryModalOpen}
        onClose={() => setIsClientDiaryModalOpen(false)}
        onSubmitDiary={(newDiary) => {
          const updated = [newDiary, ...clientDiaries];
          setClientDiaries(updated);
          safeLocalStorage.setJSON('label_sw_client_diaries', updated);
          saveToCloudDatabase('clientDiaries', updated);
          addToast('success', 'Thank You!', 'Your client diary story has been submitted & featured in our lookbook.');
        }}
      />

      {/* Floating Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />

    </div>
  );
}
