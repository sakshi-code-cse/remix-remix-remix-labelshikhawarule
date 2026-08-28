import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShoppingBag, 
  Calendar, 
  Award, 
  Ruler, 
  MapPin, 
  LogOut, 
  Sparkles, 
  PackageCheck, 
  Clock, 
  Truck, 
  ChevronRight, 
  ExternalLink,
  Edit2,
  Check,
  FileText
} from 'lucide-react';
import { CustomerUser, AdminOrder, AdminAppointment } from '../types';

interface CustomerAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: CustomerUser | null;
  user?: CustomerUser | null;
  orders: AdminOrder[];
  appointments: AdminAppointment[];
  onLogout: () => void;
  onUpdateCustomer?: (updated: CustomerUser) => void;
  onUpdateProfile?: (updated: Partial<CustomerUser>) => void;
  onOpenAppointment?: () => void;
  onBookAppointment?: () => void;
  onOpenWishlist?: () => void;
  onExploreCollection?: () => void;
  onViewInvoice?: (order: AdminOrder) => void;
}

export const CustomerAccountDrawer: React.FC<CustomerAccountDrawerProps> = ({
  isOpen,
  onClose,
  customer: propCustomer,
  user: propUser,
  orders,
  appointments,
  onLogout,
  onUpdateCustomer,
  onUpdateProfile,
  onOpenAppointment,
  onBookAppointment,
  onOpenWishlist,
  onExploreCollection,
  onViewInvoice,
}) => {
  const customer = propUser || propCustomer;
  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'rewards' | 'measurements' | 'profile'>('orders');

  // Measurements State
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);
  const [bust, setBust] = useState(customer?.measurements?.bust || '34 in');
  const [waist, setWaist] = useState(customer?.measurements?.waist || '28 in');
  const [hip, setHip] = useState(customer?.measurements?.hip || '38 in');
  const [height, setHeight] = useState(customer?.measurements?.height || "5'6\"");
  const [shoulder, setShoulder] = useState(customer?.measurements?.shoulder || '14.5 in');
  const [kurtaLength, setKurtaLength] = useState(customer?.measurements?.kurtaLength || '44 in');

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [city, setCity] = useState(customer?.city || '');
  const [address, setAddress] = useState(customer?.address || '');

  // Synchronize state if customer changes
  React.useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setCity(customer.city || '');
      setAddress(customer.address || '');
      setBust(customer.measurements?.bust || '34 in');
      setWaist(customer.measurements?.waist || '28 in');
      setHip(customer.measurements?.hip || '38 in');
      setHeight(customer.measurements?.height || "5'6\"");
      setShoulder(customer.measurements?.shoulder || '14.5 in');
      setKurtaLength(customer.measurements?.kurtaLength || '44 in');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  // Customer Orders & Appointments (filtered by email or matching name)
  const customerEmail = customer.email ? customer.email.toLowerCase() : '';
  const customerFirstName = customer.name ? customer.name.toLowerCase().split(' ')[0] : '';

  const myOrders = (orders || []).filter((o) => 
    (customerEmail && o.customerEmail?.toLowerCase() === customerEmail) ||
    (customerFirstName && o.customerName?.toLowerCase().includes(customerFirstName))
  );

  const myAppointments = (appointments || []).filter((a) =>
    (customerEmail && a.email?.toLowerCase() === customerEmail) ||
    (customerFirstName && a.fullName?.toLowerCase().includes(customerFirstName))
  );

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMeasurements = {
      bust,
      waist,
      hip,
      height,
      shoulder,
      kurtaLength,
    };
    if (onUpdateProfile) {
      onUpdateProfile({ measurements: updatedMeasurements });
    } else if (onUpdateCustomer) {
      onUpdateCustomer({
        ...customer,
        measurements: updatedMeasurements,
      });
    }
    setIsEditingMeasurements(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        phone,
        city,
        address,
      });
    } else if (onUpdateCustomer) {
      onUpdateCustomer({
        ...customer,
        name,
        phone,
        city,
        address,
      });
    }
    setIsEditingProfile(false);
  };

  const triggerBookAppointment = onBookAppointment || onOpenAppointment || (() => {});

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#FAF6F0] shadow-2xl flex flex-col border-l border-[#DFCBB8]">
          
          {/* Top Header Card */}
          <div className="bg-[#2C2420] text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#9E472A_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.2em] text-[#C4A894] uppercase font-cinzel font-semibold">
                  Label Shikha Warule
                </span>
                <span className="px-2 py-0.5 bg-[#9E472A] text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                  Client Account
                </span>
              </div>
              <button
                id="customer-account-close-button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#C4A894] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <img
                src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                alt={customer.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#C4A894] shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-cinzel font-bold text-[#FAF6F0] truncate">
                  {customer.name}
                </h3>
                <p className="text-xs text-[#C4A894] truncate">{customer.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] bg-[#3E2F25] text-[#DFCBB8] px-2 py-0.5 rounded border border-[#523A30]">
                    {customer.tier}
                  </span>
                  <span className="text-[10px] text-[#E08A68] flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    {customer.couturePoints} Couture Points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#DFCBB8] bg-[#F3EBE1] text-xs font-cinzel font-semibold overflow-x-auto scrollbar-none">
            <button
              id="cust-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-[#9E472A] text-[#9E472A] bg-[#FAF6F0]'
                  : 'border-transparent text-[#7A6F68] hover:text-[#2C2420]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({myOrders.length})</span>
            </button>

            <button
              id="cust-tab-appointments"
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'appointments'
                  ? 'border-[#9E472A] text-[#9E472A] bg-[#FAF6F0]'
                  : 'border-transparent text-[#7A6F68] hover:text-[#2C2420]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Fittings ({myAppointments.length})</span>
            </button>

            <button
              id="cust-tab-rewards"
              onClick={() => setActiveTab('rewards')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'rewards'
                  ? 'border-[#9E472A] text-[#9E472A] bg-[#FAF6F0]'
                  : 'border-transparent text-[#7A6F68] hover:text-[#2C2420]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>VIP Circle</span>
            </button>

            <button
              id="cust-tab-measurements"
              onClick={() => setActiveTab('measurements')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'measurements'
                  ? 'border-[#9E472A] text-[#9E472A] bg-[#FAF6F0]'
                  : 'border-transparent text-[#7A6F68] hover:text-[#2C2420]'
              }`}
            >
              <Ruler className="w-4 h-4" />
              <span>Sizes</span>
            </button>

            <button
              id="cust-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-[#9E472A] text-[#9E472A] bg-[#FAF6F0]'
                  : 'border-transparent text-[#7A6F68] hover:text-[#2C2420]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>

          {/* Drawer Body Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-cinzel font-bold text-[#2C2420]">
                    Atelier Order History
                  </h4>
                  <span className="text-xs text-[#7A6F68]">
                    {myOrders.length} {myOrders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                </div>

                {myOrders.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-white border border-[#DFCBB8] rounded-lg">
                    <ShoppingBag className="w-10 h-10 text-[#C4A894] mx-auto mb-2" />
                    <p className="text-sm font-cinzel font-bold text-[#2C2420]">No Orders Placed Yet</p>
                    <p className="text-xs text-[#7A6F68] mt-1 mb-4">
                      Explore our handcrafted festive & classic ensembles.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        if (onExploreCollection) onExploreCollection();
                      }}
                      className="px-4 py-2 bg-[#9E472A] text-white rounded text-xs font-cinzel font-bold cursor-pointer hover:bg-[#83381E]"
                    >
                      Browse Best Sellers
                    </button>
                  </div>
                ) : (
                  myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#DFCBB8] rounded-lg p-4 shadow-xs hover:border-[#9E472A] transition-colors"
                    >
                      <div className="flex items-start justify-between border-b border-[#F3EBE1] pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-cinzel font-bold text-xs text-[#2C2420]">
                              {order.orderNumber}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.orderStatus === 'Dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A6F68] mt-0.5">
                            Placed on {order.createdAt}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-cinzel font-bold text-[#9E472A]">
                            ₹{order.total.toLocaleString('en-IN')}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items in this order */}
                      <div className="space-y-2 mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#FAF6F0] p-2 rounded">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-10 h-12 rounded object-cover border border-[#DFCBB8]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#2C2420] truncate">
                                {item.productName}
                              </p>
                              <p className="text-[11px] text-[#7A6F68]">
                                Size: {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-cinzel font-bold text-[#2C2420]">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking / Address Info */}
                      <div className="pt-2 border-t border-[#F3EBE1] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#7A6F68] truncate max-w-[200px]">
                          📍 {order.city}
                        </span>
                        <div className="flex items-center gap-2">
                          {onViewInvoice && (
                            <button
                              onClick={() => onViewInvoice(order)}
                              className="text-[11px] text-[#9E472A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </button>
                          )}
                          {order.trackingNumber && (
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              🚚 {order.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-cinzel font-bold text-[#2C2420]">
                    Atelier Consultations & Fittings
                  </h4>
                  <button
                    onClick={() => {
                      onClose();
                      triggerBookAppointment();
                    }}
                    className="text-xs text-[#9E472A] font-cinzel font-bold hover:underline cursor-pointer"
                  >
                    + Book New Session
                  </button>
                </div>

                {myAppointments.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-white border border-[#DFCBB8] rounded-lg">
                    <Calendar className="w-10 h-10 text-[#C4A894] mx-auto mb-2" />
                    <p className="text-sm font-cinzel font-bold text-[#2C2420]">No Consultations Booked</p>
                    <p className="text-xs text-[#7A6F68] mt-1 mb-4">
                      Book a bespoke consultation with Principal Couturier Shikha Warule.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        triggerBookAppointment();
                      }}
                      className="px-4 py-2 bg-[#9E472A] text-white rounded text-xs font-cinzel font-bold cursor-pointer hover:bg-[#83381E]"
                    >
                      Book Atelier Fitting
                    </button>
                  </div>
                ) : (
                  myAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white border border-[#DFCBB8] rounded-lg p-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-cinzel font-bold text-[#2C2420]">
                            {apt.experienceType}
                          </span>
                          <p className="text-[11px] text-[#9E472A] font-semibold">
                            {apt.mode}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="bg-[#FAF6F0] p-3 rounded space-y-1 text-xs text-[#523A30] my-2">
                        <p><strong>📅 Date:</strong> {apt.date}</p>
                        <p><strong>⏰ Time Slot:</strong> {apt.timeSlot}</p>
                        {apt.assignedStylist && (
                          <p><strong>👗 Assigned Stylist:</strong> {apt.assignedStylist}</p>
                        )}
                        {apt.notes && (
                          <p className="text-[11px] text-[#7A6F68] italic mt-1 border-t border-[#DFCBB8] pt-1">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. REWARDS & COUTURE CIRCLE */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                {/* Rewards Card */}
                <div className="bg-gradient-to-br from-[#2C2420] to-[#523A30] text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C4A894]">
                      VIP Membership Card
                    </span>
                    <span className="px-2 py-0.5 bg-[#9E472A] text-white text-[10px] font-bold rounded">
                      {customer.tier}
                    </span>
                  </div>

                  <div className="my-4">
                    <p className="text-xs text-[#C4A894]">Available Couture Points</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-cinzel font-bold text-[#FAF6F0]">
                        {customer.couturePoints}
                      </span>
                      <span className="text-xs text-[#E08A68]">
                        = ₹{customer.couturePoints} instant checkout discount
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between text-[11px] text-[#C4A894]">
                    <span>Member since: {customer.joinedDate}</span>
                    <span>100% Handcrafted Exclusivity</span>
                  </div>
                </div>

                {/* VIP Perks */}
                <div className="bg-white border border-[#DFCBB8] rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-cinzel font-bold text-[#2C2420] uppercase tracking-wider">
                    Your {customer.tier} Privileges
                  </h4>
                  <div className="space-y-2.5 text-xs text-[#523A30]">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <span><strong>Early Handloom Loom Access:</strong> 48 hours priority reserve on newly loomed limited silk runs.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <span><strong>Complimentary Bespoke Alterations:</strong> Lifetime free fitting adjustment at our Bandra flagship atelier.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <span><strong>Personal Bridal & Styling Concierge:</strong> Direct WhatsApp access with creative director Shikha Warule.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#9E472A] shrink-0 mt-0.5" />
                      <span><strong>Complimentary Gold Thread Monogramming:</strong> Custom hand-embroidered initials on kurta cuffs.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. MEASUREMENTS TAB */}
            {activeTab === 'measurements' && (
              <div className="bg-white border border-[#DFCBB8] rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-cinzel font-bold text-[#2C2420]">
                      Tailored Fit & Measurements
                    </h4>
                    <p className="text-xs text-[#7A6F68]">
                      Saved for automatic bespoke tailoring when placing orders
                    </p>
                  </div>
                  {!isEditingMeasurements && (
                    <button
                      onClick={() => setIsEditingMeasurements(true)}
                      className="text-xs text-[#9E472A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditingMeasurements ? (
                  <form onSubmit={handleSaveMeasurements} className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#523A30] mb-1">Bust / Chest</label>
                        <input
                          type="text"
                          value={bust}
                          onChange={(e) => setBust(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#523A30] mb-1">Waist</label>
                        <input
                          type="text"
                          value={waist}
                          onChange={(e) => setWaist(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#523A30] mb-1">Hip</label>
                        <input
                          type="text"
                          value={hip}
                          onChange={(e) => setHip(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#523A30] mb-1">Height</label>
                        <input
                          type="text"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#523A30] mb-1">Shoulder</label>
                        <input
                          type="text"
                          value={shoulder}
                          onChange={(e) => setShoulder(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#523A30] mb-1">Kurta Length</label>
                        <input
                          type="text"
                          value={kurtaLength}
                          onChange={(e) => setKurtaLength(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#9E472A] hover:bg-[#83381E] text-white rounded text-xs font-cinzel font-bold cursor-pointer"
                      >
                        Save Measurements
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingMeasurements(false)}
                        className="px-3 py-2 text-xs text-[#7A6F68] hover:text-[#2C2420] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    <div className="p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-center">
                      <p className="text-[10px] text-[#7A6F68] uppercase font-cinzel">Bust / Chest</p>
                      <p className="text-sm font-bold text-[#2C2420]">{customer.measurements?.bust || '34 in'}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-center">
                      <p className="text-[10px] text-[#7A6F68] uppercase font-cinzel">Waist</p>
                      <p className="text-sm font-bold text-[#2C2420]">{customer.measurements?.waist || '28 in'}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-center">
                      <p className="text-[10px] text-[#7A6F68] uppercase font-cinzel">Hip</p>
                      <p className="text-sm font-bold text-[#2C2420]">{customer.measurements?.hip || '38 in'}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-center">
                      <p className="text-[10px] text-[#7A6F68] uppercase font-cinzel">Height</p>
                      <p className="text-sm font-bold text-[#2C2420]">{customer.measurements?.height || "5'6\""}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-center">
                      <p className="text-[10px] text-[#7A6F68] uppercase font-cinzel">Shoulder</p>
                      <p className="text-sm font-bold text-[#2C2420]">{customer.measurements?.shoulder || '14.5 in'}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-center">
                      <p className="text-[10px] text-[#7A6F68] uppercase font-cinzel">Kurta Length</p>
                      <p className="text-sm font-bold text-[#2C2420]">{customer.measurements?.kurtaLength || '44 in'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. PROFILE & ADDRESS TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-[#DFCBB8] rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-cinzel font-bold text-[#2C2420]">
                    Personal Details & Delivery Address
                  </h4>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-xs text-[#9E472A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-[#523A30] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#523A30] mb-1">Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#523A30] mb-1">City, State</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#523A30] mb-1">Default Delivery Address</label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded text-xs outline-hidden focus:border-[#9E472A]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#9E472A] hover:bg-[#83381E] text-white rounded text-xs font-cinzel font-bold cursor-pointer"
                      >
                        Save Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-2 text-xs text-[#7A6F68] hover:text-[#2C2420] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3 text-xs text-[#523A30]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F3EBE1]">
                      <span className="text-[#7A6F68]">Email:</span>
                      <span className="font-semibold text-[#2C2420]">{customer.email}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#F3EBE1]">
                      <span className="text-[#7A6F68]">Phone:</span>
                      <span className="font-semibold text-[#2C2420]">{customer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#F3EBE1]">
                      <span className="text-[#7A6F68]">City:</span>
                      <span className="font-semibold text-[#2C2420]">{customer.city}</span>
                    </div>
                    <div className="pb-2 border-b border-[#F3EBE1]">
                      <span className="text-[#7A6F68] block mb-1">Delivery Address:</span>
                      <span className="font-semibold text-[#2C2420] block bg-[#FAF6F0] p-2.5 rounded border border-[#DFCBB8]">
                        📍 {customer.address}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Footer Actions */}
          <div className="p-4 bg-[#F3EBE1] border-t border-[#DFCBB8] flex items-center justify-between">
            <button
              id="customer-drawer-wishlist-button"
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="text-xs font-cinzel font-bold text-[#523A30] hover:text-[#9E472A] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Saved Wishlist</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="customer-drawer-logout-button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 bg-[#2C2420] hover:bg-black text-white text-xs font-cinzel font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C4A894]" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
