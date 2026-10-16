import React from 'react';
import { Package, CheckCircle2, AlertTriangle, MapPin, Bike, Weight } from 'lucide-react';

export default function StatsOverview({ rawRows, processedRows, routeClusters }) {
  const totalOrders = rawRows.length;
  const validOrders = processedRows.filter(r => r.status === 'VALID').length;
  const flaggedOrders = processedRows.filter(r => r.status !== 'VALID').length;
  const clusterCount = routeClusters.length;

  // Calculate total payload weight
  const totalWeightKg = rawRows.reduce((acc, row) => {
    const raw = String(row.package_weight || "0").replace(/[^0-9.]/g, "");
    return acc + (parseFloat(raw) || 0);
  }, 0);

  const validPercent = totalOrders > 0 ? Math.round((validOrders / totalOrders) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* 1. Total Manifest Orders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Total Consignments</span>
          <Package className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
        </div>
        <div className="mt-2 text-2xl font-bold text-white tracking-tight">
          {totalOrders}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Ingested rows
        </div>
      </div>

      {/* 2. Validated Orders */}
      <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-700/60 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-emerald-400">Cleaned &amp; Valid</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-emerald-400 tracking-tight">
            {validOrders}
          </span>
          {totalOrders > 0 && (
            <span className="text-xs text-emerald-500/80 font-semibold">
              ({validPercent}%)
            </span>
          )}
        </div>
        <div className="text-[10px] text-emerald-600 mt-0.5">
          Level 3 verified
        </div>
      </div>

      {/* 3. Flagged Exceptions */}
      <div className={`bg-slate-900/90 border rounded-xl p-3.5 relative overflow-hidden group transition ${
        flaggedOrders > 0 
          ? 'border-amber-700/50 hover:border-amber-600' 
          : 'border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-medium ${flaggedOrders > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            Flagged / Invalid
          </span>
          <AlertTriangle className={`w-4 h-4 ${flaggedOrders > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
        </div>
        <div className="mt-2 text-2xl font-bold text-white tracking-tight">
          <span className={flaggedOrders > 0 ? 'text-amber-400' : 'text-slate-300'}>
            {flaggedOrders}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Needs operator fix
        </div>
      </div>

      {/* 4. Active Route Clusters */}
      <div className="bg-slate-900/90 border border-blue-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-blue-700/60 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-blue-400">Route Clusters</span>
          <MapPin className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-blue-300 tracking-tight">
          {clusterCount}
        </div>
        <div className="text-[10px] text-blue-500/80 mt-0.5">
          District zones
        </div>
      </div>

      {/* 5. Assigned Dispatch Riders */}
      <div className="bg-slate-900/90 border border-purple-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-purple-700/60 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-purple-400">Assigned Couriers</span>
          <Bike className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-purple-300 tracking-tight">
          {clusterCount}
        </div>
        <div className="text-[10px] text-purple-500/80 mt-0.5">
          Active motorbikes
        </div>
      </div>

      {/* 6. Total Payload Weight */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Gross Payload</span>
          <Weight className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-white tracking-tight">
          {totalWeightKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Total package weight
        </div>
      </div>

    </div>
  );
}
