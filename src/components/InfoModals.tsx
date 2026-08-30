import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, Clock, Ruler, RotateCcw, ShieldCheck, Sparkles, Star, CheckCircle2, Upload, ImageIcon } from 'lucide-react';
import { triggerConfetti } from '../utils/storage';
import { compressImageFile } from '../utils/imageCompressor';
import { ClientDiary } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Size Guide Modal
export const SizeGuideModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cms'>('inches');

  if (!isOpen) return null;

  const sizeTable = [
    { size: 'XS', bustIn: '32 - 34', bustCm: '81 - 86', waistIn: '26 - 28', waistCm: '66 - 71', hipIn: '36 - 38', hipCm: '91 - 96' },
    { size: 'S', bustIn: '34 - 36', bustCm: '86 - 91', waistIn: '28 - 30', waistCm: '71 - 76', hipIn: '38 - 40', hipCm: '96 - 101' },
    { size: 'M', bustIn: '36 - 38', bustCm: '91 - 96', waistIn: '30 - 32', waistCm: '76 - 81', hipIn: '40 - 42', hipCm: '101 - 106' },
    { size: 'L', bustIn: '38 - 40', bustCm: '96 - 101', waistIn: '32 - 34', waistCm: '81 - 86', hipIn: '42 - 44', hipCm: '106 - 111' },
    { size: 'XL', bustIn: '40 - 42', bustCm: '101 - 106', waistIn: '34 - 36', waistCm: '86 - 91', hipIn: '44 - 46', hipCm: '111 - 116' },
    { size: 'XXL', bustIn: '42 - 44', bustCm: '106 - 111', waistIn: '36 - 38', waistCm: '91 - 96', hipIn: '46 - 48', hipCm: '116 - 121' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />
        <div className="relative inline-block w-full max-w-2xl p-6 sm:p-8 bg-[#FAF6F0] rounded-lg shadow-2xl text-left border border-[#DFCBB8]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A]">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-cinzel text-[#9E472A] tracking-widest uppercase mb-1">
            <Ruler className="w-4 h-4" />
            <span>Label Shikha Warule Atelier</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-[#2C2420] mb-4">
            WOMEN'S ATELIER SIZE CHART
          </h2>

          <div className="flex items-center justify-end gap-2 mb-4">
            <span className="text-xs text-[#7A6F68]">Units:</span>
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs rounded ${unit === 'inches' ? 'bg-[#9E472A] text-white' : 'bg-white text-[#2C2420] border'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cms')}
              className={`px-3 py-1 text-xs rounded ${unit === 'cms' ? 'bg-[#9E472A] text-white' : 'bg-white text-[#2C2420] border'}`}
            >
              Centimeters (cm)
            </button>
          </div>

          <div className="overflow-x-auto rounded border border-[#DFCBB8] bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F3E8DB] font-cinzel text-[#2C2420] border-b border-[#DFCBB8]">
                <tr>
                  <th className="p-3">Size Tag</th>
                  <th className="p-3">Bust ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="p-3">Waist ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="p-3">Hip ({unit === 'inches' ? 'in' : 'cm'})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADDCF]">
                {sizeTable.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF6F0]">
                    <td className="p-3 font-cinzel font-bold text-[#9E472A]">{row.size}</td>
                    <td className="p-3">{unit === 'inches' ? row.bustIn : row.bustCm}</td>
                    <td className="p-3">{unit === 'inches' ? row.waistIn : row.waistCm}</td>
                    <td className="p-3">{unit === 'inches' ? row.hipIn : row.hipCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3.5 bg-[#F4E9DC] rounded text-xs text-[#523A30] space-y-1">
            <strong className="block font-cinzel text-[#9E472A]">Complimentary Made-to-Measure Custom Sizing:</strong>
            <p>Select 'Custom Fit' during checkout or schedule a virtual measurement call with our stylist.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Store Locator Modal
export const StoreLocatorModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stores = [
    {
      city: 'Nerul, Navi Mumbai (Flagship Atelier)',
      address: 'Sector 19A, Nerul West, Navi Mumbai, Maharashtra 400706',
      hours: 'Mon – Sun: 11:00 AM – 08:30 PM',
      phone: '+91 22 2770 1890 / +91 98200 12345',
      email: 'nerul.atelier@shikhawarule.com',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />
        <div className="relative inline-block w-full max-w-2xl p-6 sm:p-8 bg-[#FAF6F0] rounded-lg shadow-2xl text-left border border-[#DFCBB8]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A]">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-cinzel text-[#9E472A] tracking-widest uppercase mb-1">
            <MapPin className="w-4 h-4" />
            <span>Store Locations</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-[#2C2420] mb-4">
            VISIT OUR FLAGSHIP GALLERIES
          </h2>

          <div className="space-y-4">
            {stores.map((store) => (
              <div key={store.city} className="p-4 bg-white rounded border border-[#EADDCF] space-y-2">
                <h3 className="font-cinzel text-base font-bold text-[#9E472A]">{store.city}</h3>
                <p className="text-xs text-[#523A30]">{store.address}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7A6F68] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#9E472A]" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#9E472A]" />
                    <span>{store.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Shipping & Returns Modal
export const ShippingReturnsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />
        <div className="relative inline-block w-full max-w-2xl p-6 sm:p-8 bg-[#FAF6F0] rounded-lg shadow-2xl text-left border border-[#DFCBB8]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A]">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-cinzel text-[#9E472A] tracking-widest uppercase mb-1">
            <RotateCcw className="w-4 h-4" />
            <span>Customer Care</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-[#2C2420] mb-4">
            SHIPPING & 15-DAY RETURNS POLICY
          </h2>

          <div className="space-y-4 text-xs text-[#523A30] leading-relaxed">
            <div className="p-3.5 bg-white rounded border border-[#EADDCF]">
              <h4 className="font-cinzel font-bold text-[#9E472A] mb-1">Domestic Shipping (India)</h4>
              <p>• Complimentary Express Delivery on orders above ₹2,999.</p>
              <p>• Standard delivery within 3-5 business days across metro cities.</p>
              <p>• Handcrafted made-to-order couture items take 8-12 crafting days before dispatch.</p>
            </div>

            <div className="p-3.5 bg-white rounded border border-[#EADDCF]">
              <h4 className="font-cinzel font-bold text-[#9E472A] mb-1">15-Day Hassle-Free Returns & Exchanges</h4>
              <p>• Items in unworn condition with original tags intact can be returned within 15 days of receipt.</p>
              <p>• Free doorstep courier pickup arranged seamlessly via our automated portal.</p>
              <p>• Full refund initiated to the original payment mode or store credit within 48 hours of inspection.</p>
            </div>

            <div className="p-3.5 bg-white rounded border border-[#EADDCF]">
              <h4 className="font-cinzel font-bold text-[#9E472A] mb-1">Worldwide International Shipping</h4>
              <p>• We ship to over 85 countries worldwide via DHL Express with tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Review / Client Diary Submission Modal
interface ClientDiaryModalProps extends ModalProps {
  onSubmitDiary?: (diary: ClientDiary) => void;
}

export const ClientDiaryModal: React.FC<ClientDiaryModalProps> = ({ isOpen, onClose, onSubmitDiary }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [occasion, setOccasion] = useState('');
  const [outfit, setOutfit] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiary: ClientDiary = {
      id: `diary-${Date.now()}`,
      author: name,
      city: city || 'India',
      occasion: occasion || 'Special Celebration',
      outfit: outfit || 'Custom Handcrafted Ensemble',
      quote: quote,
      rating: rating,
      image: imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      date: 'Just now',
      tags: ['Patron Diary', 'Bespoke Look'],
    };

    if (onSubmitDiary) {
      onSubmitDiary(newDiary);
    }
    setSubmitted(true);
    triggerConfetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-xs" />
        <div className="relative inline-block w-full max-w-lg p-6 sm:p-8 bg-[#FAF6F0] rounded-xl shadow-2xl text-left border border-[#DFCBB8]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A] cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#2D6A4F] mx-auto" />
              <h3 className="font-cinzel text-xl font-bold text-[#2C2420]">THANK YOU FOR SHARING!</h3>
              <p className="text-xs text-[#685C54] leading-relaxed">
                Your client diary note & photograph have been received and featured in our patron lookbook.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 bg-[#9E472A] text-white text-xs font-cinzel rounded uppercase hover:bg-[#80331A] cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-[11px] font-cinzel text-[#9E472A] font-semibold uppercase tracking-widest block mb-1">
                  Patron Community
                </span>
                <h3 className="font-cinzel text-xl font-bold text-[#2C2420]">Share Your Atelier Story</h3>
                <p className="text-xs text-[#7A6F68]">Tell us how your Label Shikha Warule couture ensemble made you feel.</p>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">Your Experience Rating</label>
                <div className="flex gap-1.5 text-[#C29342]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-[#C29342]' : 'stroke-[#C29342] fill-none'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">Your Name / Couple Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Arushi & Kabir"
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">City / Venue *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Udaipur / Mumbai"
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">Occasion / Celebration</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Royal Sangeet & Reception"
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">Outfit / Ensemble Name</label>
                  <input
                    type="text"
                    value={outfit}
                    onChange={(e) => setOutfit(e.target.value)}
                    placeholder="e.g. Bespoke Zardozi Silk Set"
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">Your Look / Garment Photo</label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-20 rounded border border-[#DFCBB8] overflow-hidden shrink-0 bg-white">
                      <img src={imageUrl} alt="Uploaded look" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-red-600 cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-20 rounded border border-dashed border-[#DFCBB8] bg-[#F4E9DC]/40 flex flex-col items-center justify-center text-[#9E472A] shrink-0">
                      <ImageIcon className="w-5 h-5 opacity-60" />
                      <span className="text-[9px] mt-0.5">3:4 Photo</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="w-full py-2 px-3 bg-white hover:bg-[#F3E8DB] border border-[#DFCBB8] text-[#9E472A] rounded flex items-center justify-center gap-2 cursor-pointer transition-colors font-cinzel text-xs font-semibold shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const compressed = await compressImageFile(e.target.files[0], {
                                maxWidth: 1000,
                                maxHeight: 1333,
                                quality: 0.85,
                              });
                              setImageUrl(compressed);
                            } catch (err) {
                              console.error('Error reading image:', err);
                            }
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>

                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full p-2 bg-white border border-[#DFCBB8] rounded text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">Your Story & Testimonial *</label>
                <textarea
                  required
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Share details about the fitting, drape, fabric feel, or wedding memories..."
                  className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase hover:bg-[#80331A] transition-colors cursor-pointer shadow-md"
              >
                Submit Client Diary Entry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
