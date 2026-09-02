import { Product, DiscoveryStory } from '../../types';

export interface DiscoveryProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  reviews: number;
  rating: number;
  image: string;
  videoUrl?: string;
  videoDuration?: string;
  hoverImage?: string;
  slug: string;
  productUrl: string;
  description: string;
  fabric: string;
  careInstructions: string[];
  artisanNote: string;
  sizes: string[];
}

export function discoveryStoryToDiscoveryProduct(story: DiscoveryStory, index: number = 0): DiscoveryProduct {
  const defaultPrices = [85000, 125000, 68000, 48000, 95000, 78000, 72000, 110000];
  const numPrice = story.numericPrice || (story.price ? parseInt(story.price.replace(/[^\d]/g, ''), 10) : null) || defaultPrices[index % defaultPrices.length];
  const priceStr = story.price || `₹${numPrice.toLocaleString('en-IN')}`;
  const origPriceStr = story.originalPrice || `₹${Math.round(numPrice * 1.15).toLocaleString('en-IN')}`;
  const categoryStr = story.category || (story.tags && story.tags[0]) || (story.subtitle ? story.subtitle.toUpperCase() : 'COUTURE');
  const imageUrl = story.thumbnail || story.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop';

  return {
    id: story.id,
    name: story.title ? story.title.toUpperCase() : 'HERITAGE COUTURE ENSEMBLE',
    category: categoryStr,
    price: priceStr,
    numericPrice: numPrice,
    originalPrice: origPriceStr,
    reviews: story.reviews || (16 + ((index * 7) % 20)),
    rating: story.rating || 5,
    image: imageUrl,
    videoUrl: story.videoUrl,
    videoDuration: story.videoDuration || '0:20',
    hoverImage: story.thumbnail || imageUrl,
    slug: story.slug || story.id,
    productUrl: `/product/${story.slug || story.id}`,
    description: story.description || story.craftsmanshipDetail || 'A bespoke handcrafted atelier ensemble woven with royal heritage zardozi, tilla and fine silk.',
    fabric: story.craftsmanshipDetail || 'Pure Raw Silk with Tonal Organza Dupatta',
    careInstructions: ['Dry clean only', 'Store wrapped in pristine muslin cloth', 'Steam press on reverse'],
    artisanNote: story.artisanQuote ? `"${story.artisanQuote}" — ${story.artisanName || 'Master Artisan'}` : 'Handcrafted over 160 hours by master artisans in our Jaipur & Pune ateliers.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
  };
}

export const DISCOVERY_PRODUCTS: DiscoveryProduct[] = [
  {
    id: 'signature-embroidered-lehenga',
    name: 'SIGNATURE EMBROIDERED LEHENGA',
    category: 'LEHENGA',
    price: '₹85,000',
    numericPrice: 85000,
    originalPrice: '₹95,000',
    reviews: 16,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-black-dress-42526-large.mp4',
    videoDuration: '0:18',
    slug: 'signature-embroidered-lehenga',
    productUrl: '/product/signature-embroidered-lehenga',
    description: 'A masterpiece in raw silk featuring hand-cut gota patti, heritage zardozi wirework, and intricate lotus border motifs.',
    fabric: 'Pure Raw Silk with Tonal Organza Dupatta',
    careInstructions: ['Dry clean only', 'Store wrapped in pristine muslin cloth', 'Steam press on reverse'],
    artisanNote: 'Handcrafted over 160 hours by master artisans in our Jaipur & Pune ateliers.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
  },
  {
    id: 'ivory-pearl-bridal-lehenga',
    name: 'IVORY PEARL BRIDAL LEHENGA',
    category: 'BRIDAL',
    price: '₹1,25,000',
    numericPrice: 125000,
    originalPrice: '₹1,40,000',
    reviews: 24,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-in-a-studio-42527-large.mp4',
    videoDuration: '0:22',
    slug: 'ivory-pearl-bridal-lehenga',
    productUrl: '/product/ivory-pearl-bridal-lehenga',
    description: 'Ethereal ivory silk lehenga embellished with freshwater seed pearls, silver dabka, and shimmering crystal accents.',
    fabric: 'Pure Chanderi Silk & Hand-woven Tissue Organza',
    careInstructions: ['Professional couture dry clean only', 'Keep away from moisture', 'Store flat in garment bag'],
    artisanNote: 'Over 12,000 hand-sewn micro pearls painstakingly aligned across 16 panels.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
  },
  {
    id: 'rose-zari-anarkali',
    name: 'ROSE ZARI ANARKALI',
    category: 'ANARKALI',
    price: '₹68,000',
    numericPrice: 68000,
    originalPrice: '₹75,000',
    reviews: 18,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-dress-42530-large.mp4',
    videoDuration: '0:15',
    slug: 'rose-zari-anarkali',
    productUrl: '/product/rose-zari-anarkali',
    description: 'A 28-kali flared silhouette in dusty rose organza adorned with delicate antique rose gold tilla and mukaish work.',
    fabric: 'Pure Silk Organza with Mulmul Lining',
    careInstructions: ['Dry clean only', 'Store in dry place', 'Low steam iron'],
    artisanNote: 'Woven with real silver zari electroplated in subtle antique rose gold.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'heritage-silk-saree',
    name: 'HERITAGE SILK SAREE',
    category: 'SAREE',
    price: '₹48,000',
    numericPrice: 48000,
    originalPrice: '₹55,000',
    reviews: 29,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-42531-large.mp4',
    videoDuration: '0:20',
    slug: 'heritage-silk-saree',
    productUrl: '/product/heritage-silk-saree',
    description: 'Handwoven Paithani-inspired mulberry silk drape with peacock feather pallu and gold kadwa border.',
    fabric: '100% Handloom Mulberry Silk & Pure Gold Zari',
    careInstructions: ['Dry clean only', 'Change folds periodically', 'Keep in cedar chest or cotton cover'],
    artisanNote: 'Loomed over 22 days by 4th-generation master weavers in Yeola.',
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
  },
  {
    id: 'midnight-velvet-lehenga',
    name: 'MIDNIGHT VELVET LEHENGA',
    category: 'LEHENGA',
    price: '₹95,000',
    numericPrice: 95000,
    originalPrice: '₹1,05,000',
    reviews: 14,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-at-a-fashion-show-42528-large.mp4',
    videoDuration: '0:25',
    slug: 'midnight-velvet-lehenga',
    productUrl: '/product/midnight-velvet-lehenga',
    description: 'Deep royal blue micro-velvet ensemble laden with antique marodi and resham floral vines.',
    fabric: 'Plush Silk Micro-Velvet & Tissue Silk Dupatta',
    careInstructions: ['Dry clean only', 'Do not steam directly on velvet pile'],
    artisanNote: 'Deep night sky tone achieved with chemical-free indigo and vegetal dye infusions.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
  },
  {
    id: 'champagne-couture-gown',
    name: 'CHAMPAGNE COUTURE GOWN',
    category: 'GOWN',
    price: '₹78,000',
    numericPrice: 78000,
    originalPrice: '₹88,000',
    reviews: 11,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-glamorous-dress-42532-large.mp4',
    videoDuration: '0:16',
    slug: 'champagne-couture-gown',
    productUrl: '/product/champagne-couture-gown',
    description: 'Sculptural corseted evening gown crafted in liquid silk chiffon with cascading micro-drapes and glass beadwork.',
    fabric: 'Pure Silk Chiffon with Structured Inner Boning',
    careInstructions: ['Specialist dry clean only', 'Store hung on padded hanger'],
    artisanNote: 'Draped organically on the mannequin for a flawless red-carpet silhouette.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'maroon-royal-sherwani',
    name: 'MAROON ROYAL SHERWANI',
    category: 'SHERWANI',
    price: '₹72,000',
    numericPrice: 72000,
    originalPrice: '₹82,000',
    reviews: 19,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-model-posing-for-the-camera-42529-large.mp4',
    videoDuration: '0:21',
    slug: 'maroon-royal-sherwani',
    productUrl: '/product/maroon-royal-sherwani',
    description: 'Imperial deep crimson silk brocade sherwani with antique metal crested buttons and concealed placket.',
    fabric: 'Hand-woven Banarasi Tanchoi Brocade Silk',
    careInstructions: ['Dry clean only', 'Low iron over pressing cloth'],
    artisanNote: 'Tailored with bespoke horsehair canvas chest piece for immaculate drape.',
    sizes: ['38', '40', '42', '44', '46', 'Custom Fit'],
  },
  {
    id: 'golden-heritage-ensemble',
    name: 'GOLDEN HERITAGE ENSEMBLE',
    category: 'COUTURE',
    price: '₹1,10,000',
    numericPrice: 110000,
    originalPrice: '₹1,25,000',
    reviews: 22,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-black-dress-42533-large.mp4',
    videoDuration: '0:19',
    slug: 'golden-heritage-ensemble',
    productUrl: '/product/golden-heritage-ensemble',
    description: 'Luminous 24k gold leaf block-printed tissue ensemble with hand-stitched real pearl tassels and farshi pants.',
    fabric: 'Pure Gold Tissue Silk with Soft Habotai Silk Lining',
    careInstructions: ['Dry clean only', 'Handle with cotton gloves', 'Store flat'],
    artisanNote: 'Created in collaboration with royal court preservation artisans.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
  },
];

// Helper to convert DiscoveryProduct to global Product interface
export function toGlobalProduct(dp: DiscoveryProduct): Product {
  return {
    id: dp.id,
    name: dp.name,
    price: dp.numericPrice,
    originalPrice: dp.originalPrice ? parseInt(dp.originalPrice.replace(/[^\d]/g, ''), 10) : undefined,
    category: dp.category,
    style: 'Royal Wedding',
    gender: dp.category === 'SHERWANI' ? 'Men' : 'Women',
    image: dp.image,
    hoverImage: dp.hoverImage || dp.image,
    description: dp.description,
    fabric: dp.fabric,
    careInstructions: dp.careInstructions,
    artisanNote: dp.artisanNote,
    sizes: dp.sizes,
    isBestSeller: true,
    isNew: true,
    rating: dp.rating,
    reviewsCount: dp.reviews,
    inStock: true,
    tags: ['Discovery', 'Couture', dp.category],
  };
}
