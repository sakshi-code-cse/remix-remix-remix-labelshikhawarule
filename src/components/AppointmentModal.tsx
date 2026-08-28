import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle2, User, Phone, Mail, MapPin, Video } from 'lucide-react';
import { AppointmentForm } from '../types';
import { triggerConfetti } from '../utils/storage';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentBooked?: (appointment: AppointmentForm) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ 
  isOpen, 
  onClose,
  onAppointmentBooked,
}) => {
  const [formData, setFormData] = useState<AppointmentForm>({
    fullName: '',
    email: '',
    phone: '',
    date: '2026-08-25',
    timeSlot: '03:00 PM - 04:00 PM',
    experienceType: 'Bespoke Couture Consultation',
    mode: 'Flagship Studio Visit',
    locationPreference: 'Bandra Flagship Atelier, Mumbai',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (onAppointmentBooked) {
        onAppointmentBooked(formData);
      }
      triggerConfetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#9E472A', '#C29342', '#FAF6F0'],
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Content */}
        <div className="relative inline-block w-full max-w-2xl p-6 sm:p-8 my-8 overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-lg shadow-2xl transform transition-all border border-[#DFCBB8]">
          
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A] rounded-full hover:bg-[#F3E8DB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#EAF5EC] text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-[#2C2420]">
                CONSULTATION APPOINTMENT CONFIRMED
              </h3>
              <p className="font-serif-luxury text-base text-[#685C54] max-w-md mx-auto">
                Dear {formData.fullName || 'Guest'}, your bespoke appointment for <strong>{formData.experienceType}</strong> on <strong>{formData.date} at {formData.timeSlot}</strong> has been reserved.
              </p>
              <div className="p-4 bg-white border border-[#EADDCF] rounded max-w-md mx-auto text-xs text-[#523A30] text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8C7E74]">Format:</span>
                  <span className="font-semibold">{formData.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C7E74]">Location / Link:</span>
                  <span className="font-semibold">{formData.mode.includes('Studio') ? formData.locationPreference : 'Google Meet Invitation'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C7E74]">Concierge Stylist:</span>
                  <span className="font-semibold text-[#9E472A]">Senior Atelier Couturier</span>
                </div>
              </div>
              <p className="text-[11px] text-[#8C7E74]">
                A confirmation calendar invite and swatch lookbook have been dispatched to {formData.email}.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-8 py-3 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider uppercase rounded"
                >
                  Return to Store
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8DB] text-[#9E472A] text-[10px] font-cinzel font-bold tracking-widest uppercase mb-2">
                  <Sparkles className="w-3 h-3" />
                  Bespoke Styling Service
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420] uppercase tracking-wider">
                  Book Your Appointment
                </h2>
                <p className="font-serif-luxury text-sm text-[#7A6F68] mt-1 italic">
                  One-on-one session with our master couturiers for bespoke cuts, bridal trousseau, and size customisation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Consultation Mode Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    onClick={() => setFormData({ ...formData, mode: 'Flagship Studio Visit' })}
                    className={`p-3.5 rounded border cursor-pointer flex items-center gap-3 transition-all ${
                      formData.mode === 'Flagship Studio Visit' 
                        ? 'border-[#9E472A] bg-white shadow-xs' 
                        : 'border-[#DFCBB8] bg-[#F7F0E6] hover:bg-white'
                    }`}
                  >
                    <MapPin className={`w-5 h-5 shrink-0 ${formData.mode === 'Flagship Studio Visit' ? 'text-[#9E472A]' : 'text-[#8C7E74]'}`} />
                    <div className="text-left">
                      <span className="font-cinzel text-xs font-bold text-[#2C2420] block">Flagship Studio Visit</span>
                      <span className="text-[10px] text-[#7A6F68]">Bandra West, Mumbai</span>
                    </div>
                  </label>

                  <label 
                    onClick={() => setFormData({ ...formData, mode: 'Virtual Consultation (Video)' })}
                    className={`p-3.5 rounded border cursor-pointer flex items-center gap-3 transition-all ${
                      formData.mode === 'Virtual Consultation (Video)' 
                        ? 'border-[#9E472A] bg-white shadow-xs' 
                        : 'border-[#DFCBB8] bg-[#F7F0E6] hover:bg-white'
                    }`}
                  >
                    <Video className={`w-5 h-5 shrink-0 ${formData.mode === 'Virtual Consultation (Video)' ? 'text-[#9E472A]' : 'text-[#8C7E74]'}`} />
                    <div className="text-left">
                      <span className="font-cinzel text-xs font-bold text-[#2C2420] block">Virtual Consultation</span>
                      <span className="text-[10px] text-[#7A6F68]">HD Video Call Worldwide</span>
                    </div>
                  </label>
                </div>

                {/* Experience Type */}
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#2C2420] mb-1.5 uppercase">
                    Service / Occasion Type
                  </label>
                  <select
                    value={formData.experienceType}
                    onChange={(e) => setFormData({ ...formData, experienceType: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                  >
                    <option value="Bespoke Couture Consultation">Bespoke Couture & Made-to-Measure Drape</option>
                    <option value="Bridal & Festive Trousseau">Bridal & Festive Trousseau Curation</option>
                    <option value="Personal Wardrobe Styling">Personal Wardrobe & Everyday Capsule Styling</option>
                    <option value="Virtual Styling Session">Virtual Swatch & Draping Walkthrough</option>
                  </select>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                    />
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                    >
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM (Morning Slot)</option>
                      <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM (Afternoon Slot)</option>
                      <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM (Tea Time Slot)</option>
                      <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM (Evening Slot)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-cinzel font-medium text-[#2C2420] mb-1">
                    Occasion Details / Specific Style Inquiries (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your upcoming wedding, color palette preferences, or specific drape styles..."
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] placeholder-[#8A7E75] focus:outline-none focus:border-[#9E472A]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#52131D] hover:bg-[#681926] text-white border border-[#7A1C2B] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-xs transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
                >
                  {loading ? 'RESERVING ATELIER SLOT...' : 'CONFIRM ATELIER APPOINTMENT'}
                </button>

                <p className="text-[10px] text-center text-[#8C7E74]">
                  No consultation fee for initial styling and trousseau discovery sessions.
                </p>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
