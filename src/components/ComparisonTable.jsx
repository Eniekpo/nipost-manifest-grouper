import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  Home, 
  ArrowRight,
  Filter,
  Layers
} from 'lucide-react';

export default function ComparisonTable({ processedRows }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, VALID, FLAGGED

  const filteredRows = useMemo(() => {
    return processedRows.filter(row => {
      // Status filter
      if (filterStatus === "VALID" && row.status !== "VALID") return false;
      if (filterStatus === "FLAGGED" && row.status === "VALID") return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchOrder = row.order_id?.toLowerCase().includes(q);
        const matchCustomer = row.customer?.toLowerCase().includes(q);
        const matchPhone = row.phone?.toLowerCase().includes(q);
        const matchRaw = row.raw_postcode?.toLowerCase().includes(q);
        const matchCanon = row.canonical_postcode?.toLowerCase().includes(q);
        const matchAddress = row.address_data?.recent_house_address?.recent?.toLowerCase().includes(q);
        const matchCluster = row.clusterKey?.toLowerCase().includes(q);
        return matchOrder || matchCustomer || matchPhone || matchRaw || matchCanon || matchAddress || matchCluster;
      }
      return true;
    });
  }, [processedRows, filterStatus, searchQuery]);

  if (!processedRows || processedRows.length === 0) return null;

  const validCount = processedRows.filter(r => r.status === "VALID").length;
  const flaggedCount = processedRows.filter(r => r.status !== "VALID").length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Consignment Audit Ledger &amp; Disassembly Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side verification comparing raw courier entry, canonical 11-char normalization, and NIPOST registry validation.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStatus === "ALL" 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({processedRows.length})
            </button>
            <button
              onClick={() => setFilterStatus("VALID")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                filterStatus === "VALID" 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow-sm' 
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Valid ({validCount})
            </button>
            <button
              onClick={() => setFilterStatus("FLAGGED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                filterStatus === "FLAGGED" 
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/80 shadow-sm' 
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Flagged ({flaggedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order, customer, postcode..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-52 sm:w-64"
            />
          </div>

        </div>
      </div>

      {/* Ledger Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0 z-10 font-medium backdrop-blur-sm">
            <tr>
              <th className="py-2.5 px-3 font-semibold">Order</th>
              <th className="py-2.5 px-3 font-semibold">Customer</th>
              <th className="py-2.5 px-3 font-semibold">Raw Input</th>
              <th className="py-2.5 px-3 font-semibold">Canonical Postcode</th>
              <th className="py-2.5 px-3 font-semibold">5-Segment Disassembly</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold">Route Cluster</th>
              <th className="py-2.5 px-3 font-semibold">Verified Street / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredRows.map((row, idx) => {
              const isValid = row.status === "VALID";
              return (
                <tr key={row.order_id || idx} className="hover:bg-slate-800/30 transition">
                  
                  {/* Order ID */}
                  <td className="py-2.5 px-3 font-semibold text-emerald-400">
                    {row.order_id}
                  </td>

                  {/* Customer */}
                  <td className="py-2.5 px-3 font-sans text-slate-200">
                    <div>{row.customer}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{row.phone}</div>
                  </td>

                  {/* Raw Postcode */}
                  <td className="py-2.5 px-3">
                    <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {row.raw_postcode}
                    </span>
                  </td>

                  {/* Canonical Postcode */}
                  <td className="py-2.5 px-3">
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      isValid 
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60' 
                        : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                    }`}>
                      {row.canonical_postcode}
                    </span>
                  </td>

                  {/* 5-Segment Disassembly */}
                  <td className="py-2.5 px-3">
                    {row.segments ? (
                      <div className="flex items-center space-x-1 text-[11px]">
                        <span className="text-emerald-400 font-semibold" title="State">{row.segments.state}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-blue-400 font-semibold" title="LGA">{row.segments.lga}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-purple-400 font-semibold" title="District">{row.segments.district}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-amber-400 font-semibold" title="Area">{row.segments.area}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-rose-400 font-semibold" title="Unit">{row.segments.unit}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 font-sans text-[11px] italic">Failed disassembly</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3 font-sans">
                    {isValid ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>VALID</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60" title={row.error_reason}>
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span>{row.status}</span>
                      </span>
                    )}
                  </td>

                  {/* Route Cluster */}
                  <td className="py-2.5 px-3">
                    {row.clusterKey ? (
                      <span className="font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 text-xs">
                        {row.clusterKey}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-sans text-[11px]">—</span>
                    )}
                  </td>

                  {/* Street Address or Reason */}
                  <td className="py-2.5 px-3 font-sans max-w-xs truncate">
                    {isValid ? (
                      <span className="text-slate-300 font-medium">
                        {row.address_data?.recent_house_address?.recent}
                      </span>
                    ) : (
                      <span className="text-rose-400/90 text-[11px]">
                        {row.error_reason}
                      </span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
