import React from 'react';
import { Printer, X, Bike, MapPin, Package, CheckSquare } from 'lucide-react';

export default function PrintDispatchModal({ cluster, onClose }) {
  if (!cluster) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalWeight = cluster.stops.reduce((acc, s) => {
    const raw = String(s.package_weight || "0").replace(/[^0-9.]/g, "");
    return acc + (parseFloat(raw) || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs">Print Dispatch Manifest Slip</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Content */}
        <div className="p-8 overflow-y-auto font-sans text-xs space-y-6">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase">
                Nigerian Postal Service (NIPOST) • Courier &amp; Logistics Division
              </div>
              <h1 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                DISPATCH RUN MANIFEST SLIP
              </h1>
              <div className="text-xs text-slate-600 mt-0.5 font-medium">
                National Addressing System • Route Cluster {cluster.clusterKey}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Date Generated</div>
              <div className="font-mono font-bold text-xs">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Courier & Route Briefing */}
          <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Assigned Dispatch Courier</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{cluster.riderName}</div>
              <div className="font-mono text-xs font-semibold text-emerald-700 mt-0.5">
                Motorcycle Reg: {cluster.riderBike}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Route Zone / Hub</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {cluster.localityName || 'District Delivery Area'}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {cluster.lgaName}, {cluster.stateName} State
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200 font-medium">
            <span>Total Assigned Stops: <strong className="text-slate-950 font-bold">{cluster.stops.length}</strong></span>
            <span>Payload Gross Weight: <strong className="text-slate-950 font-bold">{totalWeight.toFixed(1)} kg</strong></span>
            <span>Cluster Code: <strong className="font-mono text-emerald-800">{cluster.clusterKey}</strong></span>
          </div>

          {/* Delivery Sequence Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3 w-10 text-center">Stop</th>
                  <th className="py-2 px-3">Order / Customer</th>
                  <th className="py-2 px-3">Contact</th>
                  <th className="py-2 px-3">NIPOST Postcode</th>
                  <th className="py-2 px-3">Delivery Address</th>
                  <th className="py-2 px-3 text-center w-16">Weight</th>
                  <th className="py-2 px-3 text-center w-20">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cluster.stops.map((stop, idx) => (
                  <tr key={stop.order_id || idx} className="print-break-inside-avoid">
                    <td className="py-2.5 px-3 font-mono font-bold text-center bg-slate-50">
                      #{idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-950">{stop.customer}</div>
                      <div className="font-mono text-[10px] text-slate-500">{stop.order_id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px]">
                      {stop.phone}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 text-[10px]">
                      {stop.canonical_postcode}
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <div className="font-medium text-slate-800 leading-tight">
                        {stop.address_data?.recent_house_address?.recent}
                      </div>
                      <div className="text-[9px] uppercase font-semibold text-slate-500 mt-0.5">
                        {stop.address_data?.building_use_status}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {stop.package_weight}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-4 h-4 mx-auto border-2 border-slate-400 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signoff / Verification Box */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-[10px] print-break-inside-avoid">
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-slate-600">
                Dispatch Supervisor Signature:
              </div>
              <div className="mt-8 text-slate-400">Date: ________________________</div>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-slate-600">
                Courier Acceptance Signature:
              </div>
              <div className="mt-8 text-slate-400">Time Dispatched: _____________</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
