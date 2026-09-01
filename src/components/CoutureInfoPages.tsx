import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Ruler, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Truck, 
  Globe, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Heart, 
  Layers, 
  Scissors, 
  Feather, 
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Package,
  Send,
  AlertCircle
} from 'lucide-react';
import { CustomerUser } from '../types';

export type InfoPageSlug = 
  | 'about-us'
  | 'our-process'
  | 'size-guide'
  | 'returns-exchange'
  | 'contact-us'
  | 'track-order'
  | 'shipping-returns'
  | 'flagship-atelier'
  | 'privacy-policy';

interface CoutureInfoPagesProps {
  pageSlug: InfoPageSlug;
  onNavigateHome: () => void;
  onNavigatePage: (slug: InfoPageSlug) => void;
  onOpenAppointment?: () => void;
  onOpenCustomerLogin?: () => void;
  onOpenCustomerAccount?: () => void;
  currentUser?: CustomerUser | null;
  onAddToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const CoutureInfoPages: React.FC<CoutureInfoPagesProps> = ({
  pageSlug,
  onNavigateHome,
  onNavigatePage,
  onOpenAppointment,
  onOpenCustomerLogin,
  onOpenCustomerAccount,
  currentUser,
  onAddToast,
}) => {
  // Size Guide state
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cms'>('inches');
  const [activeGenderTab, setActiveGenderTab] = useState<'women' | 'men'>('women');

  // Track Order state
  const [trackingId, setTrackingId] = useState('');
  const [trackingPhone, setTrackingPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<boolean>(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // Contact form state
  const [contactSubject, setContactSubject] = useState('Bespoke Styling Consultation');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Return request state
  const [returnOrderId, setReturnOrderId] = useState('');
  const [returnReason, setReturnReason] = useState('Size / Fitting Exchange');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setSearchedOrder(true);
    // Dynamic mock order result
    setTrackingResult({
      orderNumber: trackingId.toUpperCase().startsWith('#') ? trackingId.toUpperCase() : `#${trackingId.toUpperCase()}`,
      status: 'In Atelier Fitting & Finishing',
      courier: 'DHL Express / BlueDart Couture Priority',
      awbNumber: 'AWB-8942-IN-COUTURE',
      estimatedDelivery: '3 - 5 Business Days',
      destination: 'Nerul Flagship to Client Residence',
      timeline: [
        { title: 'Order Placed & Fabric Sourced', date: 'Confirmed & Logged', done: true },
        { title: 'Pattern Drafting & Hand Embroidery', date: 'Master Artisan Handloom Phase', done: true },
        { title: 'Atelier Quality Assurance & Steaming', date: 'Current In-Progress Stage', done: true },
        { title: 'Insured White-Glove Dispatch', date: 'Scheduled in 24 hrs', done: false },
        { title: 'Delivered in Signature Luxury Box', date: 'Awaiting Final Transit', done: false },
      ]
    });

    if (onAddToast) {
      onAddToast('success', 'Order Located', `Tracking status retrieved for ${trackingId}`);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    if (onAddToast) {
      onAddToast('success', 'Message Dispatched', 'Our atelier concierge will connect with you within 4 hours.');
    }
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
    if (onAddToast) {
      onAddToast('success', 'Exchange Request Logged', `Request for ${returnOrderId} is under concierge review.`);
    }
  };

  // Sizing data
  const womenSizeTable = [
    { size: 'XS', bustIn: '32 - 34', bustCm: '81 - 86', waistIn: '26 - 28', waistCm: '66 - 71', hipIn: '36 - 38', hipCm: '91 - 96' },
    { size: 'S', bustIn: '34 - 36', bustCm: '86 - 91', waistIn: '28 - 30', waistCm: '71 - 76', hipIn: '38 - 40', hipCm: '96 - 101' },
    { size: 'M', bustIn: '36 - 38', bustCm: '91 - 96', waistIn: '30 - 32', waistCm: '76 - 81', hipIn: '40 - 42', hipCm: '101 - 106' },
    { size: 'L', bustIn: '38 - 40', bustCm: '96 - 101', waistIn: '32 - 34', waistCm: '81 - 86', hipIn: '42 - 44', hipCm: '106 - 111' },
    { size: 'XL', bustIn: '40 - 42', bustCm: '101 - 106', waistIn: '34 - 36', waistCm: '86 - 91', hipIn: '44 - 46', hipCm: '111 - 116' },
    { size: 'XXL', bustIn: '42 - 44', bustCm: '106 - 111', waistIn: '36 - 38', waistCm: '91 - 96', hipIn: '46 - 48', hipCm: '116 - 121' },
  ];

  const menSizeTable = [
    { size: '36 (S)', chestIn: '36 - 38', chestCm: '91 - 96', shoulderIn: '17.5', shoulderCm: '44.5', lengthIn: '42', lengthCm: '106' },
    { size: '38 (M)', chestIn: '38 - 40', chestCm: '96 - 101', shoulderIn: '18.0', shoulderCm: '45.7', lengthIn: '43', lengthCm: '109' },
    { size: '40 (L)', chestIn: '40 - 42', chestCm: '101 - 106', shoulderIn: '18.5', shoulderCm: '47.0', lengthIn: '44', lengthCm: '111' },
    { size: '42 (XL)', chestIn: '42 - 44', chestCm: '106 - 111', shoulderIn: '19.0', shoulderCm: '48.2', lengthIn: '44.5', lengthCm: '113' },
    { size: '44 (XXL)', chestIn: '44 - 46', chestCm: '111 - 116', shoulderIn: '19.5', shoulderCm: '49.5', lengthIn: '45', lengthCm: '114' },
  ];

  // Helper titles
  const getPageTitle = () => {
    switch (pageSlug) {
      case 'about-us': return 'About Label Shikha Warule';
      case 'our-process': return 'The Atelier Craft & Process';
      case 'size-guide': return 'Atelier Sizing Guide & Fit';
      case 'returns-exchange': return 'Returns & Exchange Policy';
      case 'contact-us': return 'Concierge & Contact Us';
      case 'track-order': return 'Track Your Couture Order';
      case 'shipping-returns': return 'Shipping, Delivery & Returns';
      case 'flagship-atelier': return 'Our Flagship Atelier Gallery';
      case 'privacy-policy': return 'Client Confidentiality & Privacy Policy';
      default: return 'Label Shikha Warule';
    }
  };

  const getPageSubtitle = () => {
    switch (pageSlug) {
      case 'about-us': return 'Preserving heritage weaves and master artisanal craftsmanship through timeless Indian couture.';
      case 'our-process': return 'From hand-sketched silhouettes to master Zardozi handlooms, discover how our garments come to life.';
      case 'size-guide': return 'Standard luxury sizing charts along with complimentary bespoke Made-to-Measure services.';
      case 'returns-exchange': return 'Seamless 7-day complimentary exchanges and fitting alterations for our valued patrons.';
      case 'contact-us': return 'Speak with our styling consultants, schedule private fittings, or reach our concierge.';
      case 'track-order': return 'Real-time transit updates and handcrafting milestones for your bespoke orders.';
      case 'shipping-returns': return 'Complimentary insured shipping across India and worldwide white-glove international courier service.';
      case 'flagship-atelier': return 'Immerse yourself in our private couture salon located in Nerul West, Navi Mumbai.';
      case 'privacy-policy': return 'Our commitment to safeguarding your personal data, measurements, and transaction security.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C2420] pb-24">
      {/* Top Editorial Banner */}
      <div className="bg-gradient-to-b from-[#241712] via-[#2F1F18] to-[#1C120E] text-[#EADDCF] pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#3E2921]">
        <div className="max-w-5xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A89384] mb-6 font-cinzel">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-[#FAF6F0] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-[#C8A97E] tracking-wider uppercase">{getPageTitle()}</span>
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-cinzel tracking-[0.2em] text-[#C8A97E] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HAUTE COUTURE ATELIER</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-[#FAF6F0] mb-4">
            {getPageTitle()}
          </h1>

          {/* Subtitle */}
          <p className="font-serif-luxury text-base sm:text-lg text-[#D4C3B4] font-light leading-relaxed max-w-3xl">
            {getPageSubtitle()}
          </p>

          {/* Quick Page Jump Chips */}
          <div className="flex flex-wrap gap-2 pt-8">
            {[
              { id: 'about-us', label: 'About Us' },
              { id: 'our-process', label: 'Our Process' },
              { id: 'size-guide', label: 'Size Guide' },
              { id: 'track-order', label: 'Track Order' },
              { id: 'returns-exchange', label: 'Returns & Exchange' },
              { id: 'flagship-atelier', label: 'Flagship Atelier' },
              { id: 'contact-us', label: 'Contact Us' },
              { id: 'shipping-returns', label: 'Shipping & Delivery' },
              { id: 'privacy-policy', label: 'Privacy Policy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigatePage(tab.id as InfoPageSlug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  pageSlug === tab.id
                    ? 'bg-[#C8A97E] text-[#1C120E] font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-[#D4C3B4] border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xl border border-[#DFCBB8] p-6 sm:p-10 md:p-12">
          
          {/* ========================================================================= */}
          {/* 1. ABOUT US PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'about-us' && (
            <div className="space-y-10">
              
              <div className="border-b border-[#EADDCF] pb-8">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-2">
                  THE FOUNDATION &amp; PHILOSOPHY
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420] mb-4">
                  Honoring India's Textile Heritage Through Modern Couture
                </h2>
                <p className="text-sm sm:text-base text-[#523A30] font-light leading-relaxed mb-4">
                  Founded under the visionary artistic direction of Principal Couturier <strong>Shikha Warule</strong>, Label Shikha Warule represents the confluence of timeless Indian craftsmanship, regal silhouettes, and contemporary tailoring.
                </p>
                <p className="text-sm sm:text-base text-[#523A30] font-light leading-relaxed">
                  Every creation is designed as a wearable masterpiece — honoring age-old techniques such as Zardozi metal thread embroidery, gota patti detailing, hand-spun Banarasi brocades, and gossamer Chanderi silks, lovingly handcrafted by multigenerational artisan clusters across India.
                </p>
              </div>

              {/* Three Brand Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#52131D] text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-[#2C2420]">Artisanal Preservation</h3>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    Direct collaboration with master weaver guilds in Varanasi, Maheshwar, and Rajasthan, sustaining living heritage crafts.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#52131D] text-white flex items-center justify-center">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-[#2C2420]">Bespoke Made-to-Measure</h3>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    Custom pattern grading tailored to your exact measurements, posture, and drape preferences for a flawless fit.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#52131D] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-[#2C2420]">Ethical &amp; Conscious</h3>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    Pure organic natural fibers, non-toxic AZO-free dyes, zero-waste fabric utilization, and fair craft compensation.
                  </p>
                </div>
              </div>

              {/* Atelier Quote Block */}
              <div className="p-8 rounded-xl bg-gradient-to-r from-[#241712] to-[#362118] text-[#FAF6F0] text-center space-y-4">
                <p className="font-serif-luxury italic text-lg sm:text-xl text-[#EADDCF]">
                  “We do not simply craft garments; we curate heirlooms destined to be cherished and passed down through generations.”
                </p>
                <div className="font-cinzel text-xs tracking-[0.2em] text-[#C8A97E] uppercase">
                  — Shikha Warule, Principal Couturier
                </div>
                {onOpenAppointment && (
                  <div className="pt-2">
                    <button
                      onClick={onOpenAppointment}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A97E] hover:bg-[#FAF6F0] text-[#1C120E] font-cinzel text-xs font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book An Atelier Styling Session</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. OUR PROCESS PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'our-process' && (
            <div className="space-y-10">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-2">
                  THE 5 PHASES OF LUXURY ATELIER CRAFT
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  How Your Bespoke Garment Is Born
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  {
                    step: '01',
                    title: 'Moodboarding & Concept Silhouette',
                    desc: 'Every piece begins with hand-drawn sketches, architectural drape studies, and historical motif inspiration guided by Shikha Warule.',
                    icon: <Feather className="w-5 h-5 text-[#9E472A]" />
                  },
                  {
                    step: '02',
                    title: 'Raw Fiber Sourcing & Handloom Weaving',
                    desc: 'We procure pure mulberry silks, organic handspun cottons, and genuine gold/silver zari threads directly from generational handloom cooperatives.',
                    icon: <Layers className="w-5 h-5 text-[#9E472A]" />
                  },
                  {
                    step: '03',
                    title: 'Precision Pattern Drafting & Toile Fitting',
                    desc: 'Our master pattern cutters draft bespoke templates matching each patron’s exact contours to ensure effortless movement and drape.',
                    icon: <Scissors className="w-5 h-5 text-[#9E472A]" />
                  },
                  {
                    step: '04',
                    title: 'Artisanal Zardozi, Aari & Gota Embellishment',
                    desc: 'Over 120+ hours of intricate needlework by master artisans, securing pearls, sequins, and metallic bullion threads onto the fabric.',
                    icon: <Sparkles className="w-5 h-5 text-[#9E472A]" />
                  },
                  {
                    step: '05',
                    title: 'Quality Auditing & Insured Luxury Packaging',
                    desc: 'Triple-point inspection for finish, tension, and hems before steam pressing and packing into our signature keepsake garment trunk.',
                    icon: <ShieldCheck className="w-5 h-5 text-[#9E472A]" />
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-5 p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF]">
                    <div className="font-cinzel text-2xl font-bold text-[#9E472A] shrink-0 w-10">
                      {item.step}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <h3 className="font-cinzel text-base font-bold text-[#2C2420]">{item.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#523A30] font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-lg bg-[#F4E9DC] border border-[#DFCBB8] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#9E472A] uppercase">Custom Bridal &amp; Festive Commissions</h4>
                  <p className="text-xs text-[#523A30]">We welcome bespoke color alterations, fabric customizations, and family crest embroideries.</p>
                </div>
                {onOpenAppointment && (
                  <button
                    onClick={onOpenAppointment}
                    className="px-5 py-2.5 bg-[#52131D] text-white hover:bg-[#851E30] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shrink-0"
                  >
                    Schedule Consultation
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. SIZE GUIDE PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'size-guide' && (
            <div className="space-y-8">
              
              {/* Header & Unit Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADDCF] pb-6">
                <div>
                  <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                    PRECISION ATELIER MEASUREMENTS
                  </span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                    Size Chart &amp; Fit Guide
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Gender switch */}
                  <div className="flex rounded-md border border-[#DFCBB8] overflow-hidden bg-[#FAF6F0] p-0.5">
                    <button
                      onClick={() => setActiveGenderTab('women')}
                      className={`px-3 py-1.5 text-xs font-cinzel uppercase tracking-wider rounded-xs cursor-pointer ${
                        activeGenderTab === 'women' ? 'bg-[#52131D] text-white font-bold' : 'text-[#523A30]'
                      }`}
                    >
                      Women
                    </button>
                    <button
                      onClick={() => setActiveGenderTab('men')}
                      className={`px-3 py-1.5 text-xs font-cinzel uppercase tracking-wider rounded-xs cursor-pointer ${
                        activeGenderTab === 'men' ? 'bg-[#52131D] text-white font-bold' : 'text-[#523A30]'
                      }`}
                    >
                      Men
                    </button>
                  </div>

                  {/* Unit switch */}
                  <div className="flex rounded-md border border-[#DFCBB8] overflow-hidden bg-[#FAF6F0] p-0.5">
                    <button
                      onClick={() => setSizeUnit('inches')}
                      className={`px-3 py-1.5 text-xs font-cinzel uppercase tracking-wider rounded-xs cursor-pointer ${
                        sizeUnit === 'inches' ? 'bg-[#9E472A] text-white font-bold' : 'text-[#523A30]'
                      }`}
                    >
                      Inches
                    </button>
                    <button
                      onClick={() => setSizeUnit('cms')}
                      className={`px-3 py-1.5 text-xs font-cinzel uppercase tracking-wider rounded-xs cursor-pointer ${
                        sizeUnit === 'cms' ? 'bg-[#9E472A] text-white font-bold' : 'text-[#523A30]'
                      }`}
                    >
                      CM
                    </button>
                  </div>
                </div>
              </div>

              {/* Table rendering */}
              <div className="overflow-x-auto rounded-lg border border-[#DFCBB8] bg-white shadow-xs">
                {activeGenderTab === 'women' ? (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F3E8DB] font-cinzel text-[#2C2420] border-b border-[#DFCBB8]">
                      <tr>
                        <th className="p-3.5 sm:p-4">Size Tag</th>
                        <th className="p-3.5 sm:p-4">Bust ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                        <th className="p-3.5 sm:p-4">Waist ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                        <th className="p-3.5 sm:p-4">Hip ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                        <th className="p-3.5 sm:p-4">Standard Fit Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADDCF]">
                      {womenSizeTable.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FAF6F0] transition-colors">
                          <td className="p-3.5 sm:p-4 font-cinzel font-bold text-[#9E472A]">{row.size}</td>
                          <td className="p-3.5 sm:p-4">{sizeUnit === 'inches' ? row.bustIn : row.bustCm}</td>
                          <td className="p-3.5 sm:p-4">{sizeUnit === 'inches' ? row.waistIn : row.waistCm}</td>
                          <td className="p-3.5 sm:p-4">{sizeUnit === 'inches' ? row.hipIn : row.hipCm}</td>
                          <td className="p-3.5 sm:p-4 text-[#7A6F68]">Regular tailored silhouette</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F3E8DB] font-cinzel text-[#2C2420] border-b border-[#DFCBB8]">
                      <tr>
                        <th className="p-3.5 sm:p-4">Size Tag</th>
                        <th className="p-3.5 sm:p-4">Chest ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                        <th className="p-3.5 sm:p-4">Shoulder ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                        <th className="p-3.5 sm:p-4">Kurta Length ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADDCF]">
                      {menSizeTable.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FAF6F0] transition-colors">
                          <td className="p-3.5 sm:p-4 font-cinzel font-bold text-[#9E472A]">{row.size}</td>
                          <td className="p-3.5 sm:p-4">{sizeUnit === 'inches' ? row.chestIn : row.chestCm}</td>
                          <td className="p-3.5 sm:p-4">{sizeUnit === 'inches' ? row.shoulderIn : row.shoulderCm}</td>
                          <td className="p-3.5 sm:p-4">{sizeUnit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Measurement Guidance Tips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#9E472A] uppercase">1. Bust / Chest</h4>
                  <p className="text-xs text-[#523A30] leading-relaxed">
                    Measure around the fullest part of your chest, keeping the tape comfortably horizontal under your arms.
                  </p>
                </div>
                <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#9E472A] uppercase">2. Natural Waist</h4>
                  <p className="text-xs text-[#523A30] leading-relaxed">
                    Measure around your natural waistline, approximately 1-2 inches above your navel, keeping one finger between tape and body.
                  </p>
                </div>
                <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#9E472A] uppercase">3. Low Hip</h4>
                  <p className="text-xs text-[#523A30] leading-relaxed">
                    Stand with heels together and measure around the fullest curve of your hips and seat for optimal flare drape.
                  </p>
                </div>
              </div>

              {/* Bespoke Fit Callout */}
              <div className="p-6 rounded-xl bg-[#52131D] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-cinzel text-base font-bold text-[#FAF6F0]">Need Made-to-Measure Custom Sizing?</h3>
                  <p className="text-xs text-[#EADDCF]/80">We offer complimentary bespoke sizing on all couture orders.</p>
                </div>
                {onOpenAppointment && (
                  <button
                    onClick={onOpenAppointment}
                    className="px-6 py-3 bg-[#C8A97E] hover:bg-[#FAF6F0] text-[#1C120E] font-cinzel text-xs font-bold tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    Schedule Measurement Call
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. RETURNS & EXCHANGE PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'returns-exchange' && (
            <div className="space-y-8">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                  PATRON SATISFACTION GUARANTEE
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  Returns, Exchanges &amp; Fitting Alterations
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-2">
                  <div className="flex items-center gap-2 text-[#9E472A]">
                    <RotateCcw className="w-4 h-4" />
                    <h3 className="font-cinzel text-xs font-bold uppercase">7-Day Exchange Window</h3>
                  </div>
                  <p className="text-xs text-[#523A30] leading-relaxed">
                    Unworn standard-sized garments in original condition with security seals intact are eligible for complimentary size exchange or store credit.
                  </p>
                </div>

                <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-2">
                  <div className="flex items-center gap-2 text-[#9E472A]">
                    <Scissors className="w-4 h-4" />
                    <h3 className="font-cinzel text-xs font-bold uppercase">Complimentary Alterations</h3>
                  </div>
                  <p className="text-xs text-[#523A30] leading-relaxed">
                    Our atelier master tailors provide one round of complimentary fitting adjustments on all bespoke and ready-to-wear ensembles.
                  </p>
                </div>

                <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-2">
                  <div className="flex items-center gap-2 text-[#9E472A]">
                    <Truck className="w-4 h-4" />
                    <h3 className="font-cinzel text-xs font-bold uppercase">Doorstep Reverse Pickup</h3>
                  </div>
                  <p className="text-xs text-[#523A30] leading-relaxed">
                    Our courier partners will arrange insured reverse pickup directly from your doorstep across India at no additional charge.
                  </p>
                </div>
              </div>

              {/* Online Return / Exchange Request Form */}
              <div className="p-6 sm:p-8 rounded-xl bg-[#FAF6F0] border border-[#DFCBB8]">
                <h3 className="font-cinzel text-base font-bold text-[#2C2420] mb-2">
                  Initiate a Return or Exchange Request
                </h3>
                <p className="text-xs text-[#6B5E55] mb-6">
                  Please provide your order details to generate an instant reverse pickup authorization.
                </p>

                {returnSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-cinzel text-base font-bold text-emerald-900">Exchange Request Registered</h4>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto">
                      Our customer concierge has received your request for <strong>{returnOrderId}</strong>. A reverse pickup agent will arrive in 24–48 hours.
                    </p>
                    <button
                      onClick={() => setReturnSubmitted(false)}
                      className="text-xs font-cinzel text-[#9E472A] underline font-bold"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReturnSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                          Order Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={returnOrderId}
                          onChange={(e) => setReturnOrderId(e.target.value)}
                          placeholder="e.g. #LSW-9842"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                          Reason for Exchange *
                        </label>
                        <select
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                        >
                          <option value="Size / Fitting Exchange">Size / Fitting Exchange</option>
                          <option value="Color or Silhouette Preference">Color or Silhouette Preference</option>
                          <option value="Minor Alteration Needed">Minor Alteration Needed</option>
                          <option value="Defect or Transit Damage">Defect or Transit Damage</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                        Fitting Notes or Replacement Size Needed
                      </label>
                      <textarea
                        rows={3}
                        value={returnNotes}
                        onChange={(e) => setReturnNotes(e.target.value)}
                        placeholder="e.g. Need sleeve length reduced by 1 inch or swap from size M to size S..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#52131D] hover:bg-[#851E30] text-white font-cinzel text-xs font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      Submit Return / Exchange Request
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. CONTACT US PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'contact-us' && (
            <div className="space-y-10">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                  CLIENT CONCIERGE &amp; ATELIER ADVISORY
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  Get In Touch With Our Stylists
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Contact Info cards */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                    <div className="flex items-center gap-2 text-[#9E472A]">
                      <MapPin className="w-4 h-4" />
                      <h3 className="font-cinzel text-xs font-bold uppercase">Nerul Flagship Studio</h3>
                    </div>
                    <p className="text-xs text-[#523A30] leading-relaxed">
                      Sector 19A, Nerul West, Navi Mumbai, Maharashtra 400706, India.
                    </p>
                    <div className="text-[11px] text-[#7A6F68] flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#9E472A]" />
                      <span>Mon - Sun: 11:00 AM – 08:30 PM</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                    <div className="flex items-center gap-2 text-[#9E472A]">
                      <Phone className="w-4 h-4" />
                      <h3 className="font-cinzel text-xs font-bold uppercase">Direct Concierge Phone</h3>
                    </div>
                    <p className="text-xs text-[#523A30]">
                      +91 22 2770 1890 / +91 98200 12345
                    </p>
                  </div>

                  <div className="p-5 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                    <div className="flex items-center gap-2 text-[#9E472A]">
                      <Mail className="w-4 h-4" />
                      <h3 className="font-cinzel text-xs font-bold uppercase">Client Email Desk</h3>
                    </div>
                    <p className="text-xs text-[#523A30]">
                      concierge@shikhawarule.com
                    </p>
                  </div>

                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xs font-cinzel text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat On WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Interactive Message Form */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl bg-[#FAF6F0] border border-[#DFCBB8]">
                  <h3 className="font-cinzel text-base font-bold text-[#2C2420] mb-2">
                    Send An Inquiry To Our Atelier
                  </h3>
                  <p className="text-xs text-[#6B5E55] mb-6">
                    Our master styling team responds to all styling requests within 4 business hours.
                  </p>

                  {contactSent ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="font-cinzel text-base font-bold text-emerald-900">Message Dispatched</h4>
                      <p className="text-xs text-emerald-700">
                        Thank you, {contactName}. A senior stylist from our Nerul atelier will be in touch shortly.
                      </p>
                      <button
                        onClick={() => setContactSent(false)}
                        className="text-xs font-cinzel text-[#9E472A] underline font-bold"
                      >
                        Send another inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                          Inquiry Topic *
                        </label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                        >
                          <option value="Bespoke Styling Consultation">Bespoke Styling Consultation</option>
                          <option value="Bridal Couture Commission">Bridal Couture Commission</option>
                          <option value="Order Status & Dispatch Inquiry">Order Status & Dispatch Inquiry</option>
                          <option value="Size & Fitting Advice">Size & Fitting Advice</option>
                          <option value="Press & Media Inquiries">Press & Media Inquiries</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                          Contact Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98200 00000"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                          Your Message or Styling Requirements *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tell us about the occasion, preferred silhouette, color preferences, or target delivery date..."
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#52131D] hover:bg-[#851E30] text-white font-cinzel text-xs font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message To Atelier</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. TRACK ORDER PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'track-order' && (
            <div className="space-y-8">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                  REAL-TIME COUTURE DISPATCH
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  Track Your Couture Order
                </h2>
                <p className="text-xs sm:text-sm text-[#523A30] font-light leading-relaxed mt-1">
                  Enter your order confirmation number (e.g. #LSW-8291) to view handcrafting milestones and delivery status.
                </p>
              </div>

              {/* Order lookup form */}
              <form onSubmit={handleTrackSubmit} className="p-6 sm:p-8 rounded-xl bg-[#FAF6F0] border border-[#DFCBB8] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                      Order Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="e.g. #LSW-8291"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#523A30] uppercase mb-1">
                      Phone Number or Email (Optional)
                    </label>
                    <input
                      type="text"
                      value={trackingPhone}
                      onChange={(e) => setTrackingPhone(e.target.value)}
                      placeholder="e.g. +91 98200 12345"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DFCBB8] rounded-xs focus:border-[#9E472A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#52131D] hover:bg-[#851E30] text-white font-cinzel text-xs font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTrackingId('#LSW-9482');
                      setSearchedOrder(true);
                      setTrackingResult({
                        orderNumber: '#LSW-9482',
                        status: 'Handloom Weaving & Zardozi Phase',
                        courier: 'DHL Express Couture Insured',
                        awbNumber: 'AWB-9482-DHL-IN',
                        estimatedDelivery: 'Nov 12, 2025',
                        destination: 'Navi Mumbai Atelier → New Delhi',
                        timeline: [
                          { title: 'Order Confirmed & Raw Silk Sourced', date: 'Oct 28', done: true },
                          { title: 'Pattern Drafting & Artisanal Zari Work', date: 'In Progress', done: true },
                          { title: 'Master Atelier Quality Audit & Pressing', date: 'Expected Nov 08', done: false },
                          { title: 'Insured White-Glove Courier Dispatch', date: 'Expected Nov 09', done: false },
                          { title: 'Delivered in Keepsake Box', date: 'Expected Nov 12', done: false },
                        ]
                      });
                    }}
                    className="px-4 py-2.5 text-xs font-cinzel text-[#9E472A] border border-[#9E472A]/30 hover:bg-[#9E472A]/10 rounded-xs cursor-pointer"
                  >
                    Try Sample Order #LSW-9482
                  </button>
                </div>
              </form>

              {/* Order Result Timeline */}
              {searchedOrder && trackingResult && (
                <div className="p-6 sm:p-8 rounded-xl bg-white border-2 border-[#52131D] shadow-lg space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADDCF]">
                    <div>
                      <span className="text-[11px] font-cinzel text-[#9E472A] tracking-widest uppercase">Order Status</span>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#2C2420]">
                        {trackingResult.orderNumber}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#52131D]/10 border border-[#52131D]/20 text-[#52131D] text-xs font-cinzel font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{trackingResult.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#523A30]">
                    <div className="p-3 bg-[#FAF6F0] rounded border border-[#DFCBB8]">
                      <span className="text-[#7A6F68] block">Courier Partner</span>
                      <strong className="font-cinzel">{trackingResult.courier}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF6F0] rounded border border-[#DFCBB8]">
                      <span className="text-[#7A6F68] block">Airway Bill / Tracking</span>
                      <strong className="font-mono text-[#9E472A]">{trackingResult.awbNumber}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF6F0] rounded border border-[#DFCBB8]">
                      <span className="text-[#7A6F68] block">Estimated Delivery</span>
                      <strong className="font-cinzel text-emerald-800">{trackingResult.estimatedDelivery}</strong>
                    </div>
                  </div>

                  {/* Visual Milestones */}
                  <div className="space-y-4 pt-4">
                    <h4 className="font-cinzel text-xs font-bold text-[#2C2420] uppercase tracking-wider">
                      Crafting &amp; Transit Milestones
                    </h4>
                    <div className="space-y-3">
                      {trackingResult.timeline.map((step: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                            step.done ? 'bg-[#52131D] text-white' : 'bg-gray-100 text-gray-400 border border-gray-300'
                          }`}>
                            {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <p className={`text-xs font-cinzel ${step.done ? 'font-bold text-[#2C2420]' : 'text-gray-400'}`}>
                              {step.title}
                            </p>
                            <span className="text-[11px] text-[#7A6F68]">{step.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Client sign in shortcut */}
              {!currentUser && onOpenCustomerLogin && (
                <div className="p-5 rounded-lg bg-[#F4E9DC] border border-[#DFCBB8] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#523A30]">
                    <strong className="font-cinzel text-[#9E472A] block mb-0.5">Are you a registered patron?</strong>
                    <span>Sign in to view full order history, saved measurements, and digital invoices.</span>
                  </div>
                  <button
                    onClick={onOpenCustomerLogin}
                    className="px-5 py-2 bg-[#9E472A] hover:bg-[#851E30] text-white font-cinzel text-xs font-bold uppercase rounded-xs cursor-pointer shrink-0"
                  >
                    Client Sign In
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. SHIPPING & RETURNS PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'shipping-returns' && (
            <div className="space-y-8">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                  DOMESTIC &amp; WORLDWIDE LOGISTICS
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  Shipping, Insurance &amp; Delivery Policies
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                  <div className="flex items-center gap-2 text-[#9E472A]">
                    <Truck className="w-5 h-5" />
                    <h3 className="font-cinzel text-sm font-bold uppercase">Domestic Shipping (India)</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-[#523A30] font-light">
                    <li>• <strong>Complimentary Shipping:</strong> Free insured express shipping on all domestic orders across India.</li>
                    <li>• <strong>Ready-to-Ship Pieces:</strong> Dispatched in 24–48 hours, delivered in 3–5 business days.</li>
                    <li>• <strong>Made-to-Measure Couture:</strong> Handcrafted and dispatched in 10–14 business days.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-3">
                  <div className="flex items-center gap-2 text-[#9E472A]">
                    <Globe className="w-5 h-5" />
                    <h3 className="font-cinzel text-sm font-bold uppercase">Worldwide International Shipping</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-[#523A30] font-light">
                    <li>• <strong>50+ Countries:</strong> Dispatched via DHL Express Priority / FedEx International.</li>
                    <li>• <strong>Transit Duration:</strong> 5–7 business days to USA, UK, UAE, Canada, Australia, and Singapore.</li>
                    <li>• <strong>Customs &amp; Duties:</strong> White-glove assistance with customs documentation.</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EADDCF] space-y-4">
                <h3 className="font-cinzel text-base font-bold text-[#2C2420]">
                  Signature Luxury Keepsake Packaging
                </h3>
                <p className="text-xs sm:text-sm text-[#523A30] font-light leading-relaxed">
                  Every order arrives in our signature burgundy and gold keepsake presentation box, wrapped in archival tissue paper, with breathable garment covers, botanical lavender sachet, and personalized note from Couturier Shikha Warule.
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. FLAGSHIP ATELIER PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'flagship-atelier' && (
            <div className="space-y-8">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                  PRIVATE SALON &amp; FITTINGS
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  Our Flagship Atelier Gallery (Nerul, Navi Mumbai)
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <p className="text-sm sm:text-base text-[#523A30] font-light leading-relaxed">
                    Experience the complete Label Shikha Warule universe at our flagship couture salon in Nerul, Navi Mumbai. Patrons enjoy private bridal styling suites, live drape consultations, and access to archival swatch collections.
                  </p>

                  <div className="space-y-3 text-xs text-[#523A30]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <div>
                        <strong>Address:</strong> Sector 19A, Nerul West, Navi Mumbai, Maharashtra 400706.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <div>
                        <strong>Visiting Hours:</strong> Monday – Sunday, 11:00 AM – 08:30 PM (Private appointments encouraged).
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <div>
                        <strong>Direct Salon Desk:</strong> +91 22 2770 1890 / +91 98200 12345
                      </div>
                    </div>
                  </div>

                  {onOpenAppointment && (
                    <div className="pt-2">
                      <button
                        onClick={onOpenAppointment}
                        className="px-6 py-3.5 bg-[#52131D] hover:bg-[#851E30] text-white font-cinzel text-xs font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Reserve Your Private Atelier Visit</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5">
                  <div className="p-6 rounded-xl bg-[#241712] text-[#FAF6F0] space-y-4 border border-[#3E2921]">
                    <div className="flex items-center gap-2 text-[#C8A97E]">
                      <Sparkles className="w-4 h-4" />
                      <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider">Atelier Amenities</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-[#D4C3B4] font-light">
                      <li>✓ Private Bridal &amp; Groom Suites</li>
                      <li>✓ Complimentary Valet Parking</li>
                      <li>✓ Master Couturier 1-on-1 Consultation</li>
                      <li>✓ Archival Swatch &amp; Zardozi Gallery</li>
                      <li>✓ Bespoke Tea &amp; Refreshment Service</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. PRIVACY POLICY PAGE */}
          {/* ========================================================================= */}
          {pageSlug === 'privacy-policy' && (
            <div className="space-y-8">
              <div className="border-b border-[#EADDCF] pb-6">
                <span className="text-xs font-cinzel tracking-[0.2em] text-[#9E472A] uppercase block mb-1">
                  DATA PROTECTION &amp; CLIENT CONFIDENTIALITY
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  Client Confidentiality &amp; Privacy Policy
                </h2>
                <p className="text-xs text-[#7A6F68]">Last Updated: January 2025</p>
              </div>

              <div className="space-y-6 text-xs sm:text-sm text-[#523A30] font-light leading-relaxed">
                <section className="space-y-2">
                  <h3 className="font-cinzel text-sm font-bold text-[#2C2420]">1. Collection of Personal Data</h3>
                  <p>
                    We collect essential information required to tailor your garments and fulfill your orders, including full name, delivery address, phone number, email, and bespoke anatomical measurements.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-cinzel text-sm font-bold text-[#2C2420]">2. Measurement Archive Confidentiality</h3>
                  <p>
                    All bespoke measurements and private bridal consultation files are securely encrypted and stored solely for your future atelier re-orders. We never sell, share, or disclose client dimensions or purchase records to third parties.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-cinzel text-sm font-bold text-[#2C2420]">3. Bank &amp; Payment Security</h3>
                  <p>
                    All digital transactions are processed through PCI-DSS Level 1 certified gateways (Razorpay / Stripe) featuring 256-bit SSL encryption. Label Shikha Warule never stores your credit card CVV or net banking credentials.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-cinzel text-sm font-bold text-[#2C2420]">4. Your Privacy Rights</h3>
                  <p>
                    You may request a copy of your stored client profile or request permanent deletion of your account at any time by contacting <strong>privacy@shikhawarule.com</strong>.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* Bottom Back To Home Action */}
          <div className="mt-12 pt-8 border-t border-[#EADDCF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-cinzel tracking-wider uppercase text-[#9E472A] hover:text-[#52131D] font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Label Shikha Warule Storefront</span>
            </button>

            <span className="text-[11px] font-cinzel text-[#A89384] tracking-widest uppercase">
              Handcrafted in India • Haute Couture
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
