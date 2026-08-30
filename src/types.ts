export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Kurtas' | 'Sarees' | 'Dresses' | 'Dupattas' | 'Accessories' | 'Kids' | 'Shirts' | 'Sets' | 'Bandhgala' | 'Sherwanis' | 'Indo-Western' | 'Anarkalis' | 'Lehengas' | string;
  style: 'Ethnic' | 'Classic' | 'Festive' | 'Everyday' | 'Royal Wedding' | 'Indo-Western' | string;
  gender: 'Women' | 'Men' | 'Kids' | 'Unisex';
  image: string;
  hoverImage?: string;
  images?: string[];
  description: string;
  fabric: string;
  careInstructions: string[];
  artisanNote: string;
  sizes: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  tags?: string[];
  occasion?: string;
  colors?: { name: string; hex: string }[];
  collectionSlug?: string;
  isCustomFit?: boolean;
  readyToShip?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  mimeType?: string;
  fileSize?: number;
  uploadedAt: string;
  tag?: string;
  aspectRatio?: string;
}

export interface StyleCategory {
  id: string;
  title: string;
  image: string;
  description: string;
  itemCount: number;
  accentText: string;
  isActive?: boolean;
  displayOrder?: number;
  mediaId?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  itemCount: number;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  mediaId?: string;
}

export interface DiscoveryStory {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  videoDuration: string;
  description: string;
  craftsmanshipDetail: string;
  artisanQuote: string;
  artisanName: string;
  tags: string[];
  videoUrl?: string;
  videoType?: 'mp4' | 'webm' | 'mov' | 'embed';
  videoMediaId?: string;
  thumbnailMediaId?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface ClientDiary {
  id: string;
  author: string;
  category?: string;
  city: string;
  quote: string;
  rating: number;
  image: string;
  outfit: string;
  date: string;
  occasion?: string;
  venue?: string;
  craftDetails?: string;
  tags?: string[];
  secondaryImages?: string[];
  isActive?: boolean;
  displayOrder?: number;
  mediaId?: string;
}

export interface AppointmentForm {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  experienceType: 'Bespoke Couture Consultation' | 'Bridal & Festive Trousseau' | 'Personal Wardrobe Styling' | 'Virtual Styling Session';
  mode: 'Flagship Studio Visit' | 'Virtual Consultation (Video)';
  locationPreference?: string;
  notes?: string;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  minOrder: number;
  description: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Prepaid (UPI / Card)' | 'Cash on Delivery' | 'Razorpay (Instant Online)' | string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: 'Processing' | 'Handcrafting' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
  trackingNumber?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface AdminAppointment extends AppointmentForm {
  id: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled';
  createdAt: string;
  assignedStylist?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city: string;
  address: string;
  joinedDate: string;
  couturePoints: number;
  tier: 'Heritage Circle' | 'Couture Member' | 'Royal Patron';
  measurements?: {
    bust?: string;
    waist?: string;
    hip?: string;
    height?: string;
    shoulder?: string;
    kurtaLength?: string;
  };
}

export interface HeroCMSContent {
  bannerLayout?: 'full-size' | 'split-arch';
  bannerImages?: string[];
  tagline: string;
  headlinePart1: string;
  headlinePart2: string;
  italicSubline: string;
  description: string;
  exploreButtonText: string;
  consultButtonText: string;
  scriptCalloutLine1: string;
  scriptCalloutLine2: string;
  scriptCalloutLine3: string;
  heroImage: string;
  floatingBadgeTitle: string;
  floatingBadgeSubtitle: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface BrandStoryCMSContent {
  heading: string;
  subheading: string;
  founderName: string;
  founderRole: string;
  founderQuote: string;
  founderImage: string;
  storyParagraph1: string;
  storyParagraph2: string;
  artisanCount: number;
  heritageWeaves: string[];
}

export interface StoreSettingsCMSContent {
  storeName: string;
  phone: string;
  email: string;
  atelierAddress: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  prepaidDiscountPercent: number;
  returnWindowDays: number;
  gstinNumber: string;
  announcementTicker: string;
  shippingPolicyText: string;
  returnsPolicyText: string;
  razorpayKeyId?: string;
  razorpayEnabled?: boolean;
  razorpayMerchantName?: string;
  razorpayThemeColor?: string;
}

export interface LogoCMSContent {
  logoType: 'svg-monogram' | 'custom-image' | 'text-luxury';
  customImageUrl?: string;
  customImageDarkUrl?: string;
  brandName?: string;
  brandSubtitle?: string;
  monogramCurvedText?: string;
  monogramSubtitle?: string;
  curvedArchText?: string;
  subtitleLine?: string;
  textBrandName?: string;
  textSubtitle?: string;
  primaryColorHex?: string;
  footerColorHex?: string;
  heightScale?: number; // 80 - 150
  // LOGO BACKGROUND BLUR & FROSTED GLASS OPTIONS
  enableBackgroundBlur?: boolean;
  blurAmount?: number; // 0 to 40 (px blur intensity)
  blurIntensity?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bgBlurColor?: string;
  bgBlurOpacity?: number; // 0 - 100%
  bgBlurBorder?: boolean;
  bgBlurBorderColor?: string;
  bgBlurPadding?: 'none' | 'compact' | 'standard' | 'generous';
  bgBlurShape?: 'pill' | 'rounded' | 'arch' | 'soft-rect';
  bgBlurShadow?: boolean;
  removeImageBgMode?: 'none' | 'multiply' | 'screen';
}
