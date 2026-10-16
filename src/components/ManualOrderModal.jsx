import React, { useState } from 'react';
import { PlusCircle, X, Package, User, Phone, MapPin, Scale } from 'lucide-react';
import { normalizePostcode } from '../services/manifestService';

export default function ManualOrderModal({ isOpen, onClose, onAddOrder }) {
  const [orderId, setOrderId] = useState(`ORD-${Math.floor(100 + Math.random() * 900)}`);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("080");
  const [rawPostcode, setRawPostcode] = useState("");
  const [weight, setWeight] = useState("1.5kg");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.trim() || !rawPostcode.trim()) {
      alert("Please provide customer name and postcode.");
      return;
    }

    onAddOrder({
      order_id: orderId.trim(),
      customer: customer.trim(),
      phone: phone.trim(),
      raw_postcode: rawPostcode.trim(),
      package_weight: weight.trim().endsWith("kg") ? weight.trim() : `${weight.trim()}kg`,
    });

    onClose();
  };

  const sampleQuickFills = [
    { label: "Ikeja GRA (Res)", code: "la 11 w06 tc 10", weight: "2.5kg", customer: "Folake Balogun" },
    { label: "Abuja Garki (Comm)", code: "fc-01-a01-lr-01", weight: "1.2kg", customer: "Musa Usman" },
    { label: "Ogun Akute", code: "OG-14-T18-BN-16", weight: "3.4kg", customer: "Kayode Adeleke" },
    { label: "Ado Ekiti", code: "EK-01-A03-FK-01", weight: "0.9kg", customer: "Bisi Fayemi" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Add Consignment Order</h3>
              <p className="text-xs text-slate-400">Manual delivery parcel entry</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Test Postcodes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuickFills.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => {
                    setRawPostcode(p.code);
                    setCustomer(p.customer);
                    setWeight(p.weight);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-600/60 text-slate-300 hover:text-white transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order ID & Customer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Customer Name
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Amina Garba"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Phone & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                Package Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 1.5kg"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Raw Postcode */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Raw Postcode (Clean or Messy)
              </span>
              {rawPostcode && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  Normalized: {normalizePostcode(rawPostcode)}
                </span>
              )}
            </label>
            <input
              type="text"
              value={rawPostcode}
              onChange={(e) => setRawPostcode(e.target.value)}
              placeholder="e.g. la 11 w06 tc 18 or FC-01-A01-KP-27"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-700/30 transition"
            >
              Add to Manifest
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
