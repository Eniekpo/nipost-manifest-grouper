import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Package, 
  CheckCircle2, 
  Building2, 
  Home, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Download,
  Navigation
} from 'lucide-react';

export default function RouteClustersView({ 
  routeClusters, 
  onExportCsv, 
  onPrintCluster 
}) {
  const [copiedCluster, setCopiedCluster] = useState(null);
  const [collapsedClusters, setCollapsedClusters] = useState({});

  if (!routeClusters || routeClusters.length === 0) {
    return null;
  }

  const toggleCollapse = (clusterKey) => {
    setCollapsedClusters(prev => ({
      ...prev,
      [clusterKey]: !prev[clusterKey]
    }));
  };

  const handleCopyItinerary = (cluster) => {
    const lines = [
      `🚚 NIPOST ROUTE MANIFEST - CLUSTER ${cluster.clusterKey}`,
      `Rider: ${cluster.riderName} | Bike: ${cluster.riderBike}`,
      `Zone: ${cluster.localityName}, ${cluster.lgaName}, ${cluster.stateName}`,
      `Stops: ${cluster.stops.length} packages`,
      `------------------------------------------`,
      ...cluster.stops.map((stop, idx) => 
        `Stop #${idx + 1}: [${stop.canonical_postcode}] ${stop.customer} (${stop.phone}) - ${stop.address_data.recent_house_address.recent} [${stop.package_weight}]`
      ),
      `------------------------------------------`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedCluster(cluster.clusterKey);
    setTimeout(() => setCopiedCluster(null), 2500);
  };

  return (
    <div className="space-y-6 mb-10">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Dispatched Route Clusters &amp; Courier Sequence
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-normal">
                {routeClusters.length} Active Zones
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Orders automatically grouped by State-LGA-District (<code className="text-emerald-400">clusterKey</code>) and sorted by delivery sequence.
            </p>
          </div>
        </div>

        {/* Global Action: Export Cleaned CSV */}
        <button
          onClick={onExportCsv}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-700/30 transition group"
        >
          <Download className="w-4 h-4 text-emerald-200 group-hover:-translate-y-0.5 transition-transform" />
          <span>Export Cleaned Routes CSV</span>
        </button>
      </div>

      {/* List of Clusters */}
      <div className="grid grid-cols-1 gap-6">
        {routeClusters.map((cluster) => {
          const isCollapsed = Boolean(collapsedClusters[cluster.clusterKey]);
          const clusterWeight = cluster.stops.reduce((acc, s) => {
            const raw = String(s.package_weight || "0").replace(/[^0-9.]/g, "");
            return acc + (parseFloat(raw) || 0);
          }, 0);

          return (
            <div 
              key={cluster.clusterKey}
              className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition hover:border-slate-700/80"
            >
              
              {/* Cluster Header Bar */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Cluster Key & Zone */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-extrabold px-3 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 shadow-sm">
                      {cluster.clusterKey}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {cluster.localityName || 'District Hub'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {cluster.lgaName}, {cluster.stateName} STATE
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center space-x-3 pt-0.5">
                    <span>
                      Stops: <strong className="text-white">{cluster.stops.length}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Weight: <strong className="text-white">{clusterWeight.toFixed(1)} kg</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Assigned Rider Card & Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  
                  {/* Courier Pill */}
                  <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div className="text-left text-xs">
                      <div className="font-bold text-white leading-tight">
                        {cluster.riderName}
                      </div>
                      <div className="font-mono text-[10px] text-purple-400 font-semibold">
                        Bike: {cluster.riderBike}
                      </div>
                    </div>
                  </div>

                  {/* Copy Itinerary for SMS/WhatsApp */}
                  <button
                    onClick={() => handleCopyItinerary(cluster)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    title="Copy delivery manifest to clipboard"
                  >
                    {copiedCluster === cluster.clusterKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Manifest</span>
                      </>
                    )}
                  </button>

                  {/* Print Slip */}
                  <button
                    onClick={() => onPrintCluster(cluster)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    title="Print Rider Dispatch Slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-400" />
                    <span>Print Slip</span>
                  </button>

                  {/* Toggle Collapse */}
                  <button
                    onClick={() => toggleCollapse(cluster.clusterKey)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title={isCollapsed ? "Expand cluster" : "Collapse cluster"}
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>

                </div>

              </div>

              {/* Stops Table / List */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold w-16">Seq #</th>
                        <th className="py-2.5 px-4 font-semibold">Order ID</th>
                        <th className="py-2.5 px-4 font-semibold">Recipient &amp; Phone</th>
                        <th className="py-2.5 px-4 font-semibold">Canonical Postcode</th>
                        <th className="py-2.5 px-4 font-semibold">Building Status</th>
                        <th className="py-2.5 px-4 font-semibold">Verified NIPOST Address</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {cluster.stops.map((stop, sIndex) => {
                        const isCommercial = stop.address_data?.building_use_status === 'commercial';
                        const addressText = stop.address_data?.recent_house_address?.recent || 'Address verified';
                        
                        return (
                          <tr 
                            key={stop.order_id || sIndex}
                            className="hover:bg-slate-800/40 transition group"
                          >
                            {/* Sequence Number */}
                            <td className="py-3 px-4 font-mono">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-700/60 text-xs">
                                {sIndex + 1}
                              </span>
                            </td>

                            {/* Order ID */}
                            <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                              {stop.order_id}
                            </td>

                            {/* Recipient & Contact */}
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white">
                                {stop.customer}
                              </div>
                              <div className="font-mono text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <a href={`tel:${stop.phone}`} className="hover:text-emerald-400 transition">
                                  {stop.phone}
                                </a>
                              </div>
                            </td>

                            {/* Canonical Postcode with 5-segment breakdown */}
                            <td className="py-3 px-4 font-mono">
                              <div className="flex flex-col">
                                <span className="font-bold text-emerald-400 text-xs">
                                  {stop.canonical_postcode}
                                </span>
                                {stop.segments && (
                                  <span className="text-[10px] text-slate-500 mt-0.5">
                                    Area: <span className="text-amber-400 font-semibold">{stop.segments.area}</span> • Unit: <span className="text-rose-400 font-semibold">{stop.segments.unit}</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Building Status */}
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                                isCommercial 
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-800/60' 
                                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                              }`}>
                                {isCommercial ? (
                                  <Building2 className="w-3 h-3 text-blue-400" />
                                ) : (
                                  <Home className="w-3 h-3 text-emerald-400" />
                                )}
                                <span className="capitalize">{stop.address_data?.building_use_status || 'Residential'}</span>
                              </span>
                            </td>

                            {/* Verified Address */}
                            <td className="py-3 px-4 max-w-sm">
                              <div className="text-slate-200 font-medium leading-relaxed">
                                {addressText}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Level 3 NIPOST verified</span>
                              </div>
                            </td>

                            {/* Weight */}
                            <td className="py-3 px-4 font-mono text-right text-slate-300 font-semibold">
                              {stop.package_weight}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
