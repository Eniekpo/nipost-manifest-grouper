import React, { useState } from 'react';
import { Info, CheckCircle2, ChevronRight, Layers, Navigation, ArrowDownRight, Compass } from 'lucide-react';

export default function PostcodeExplainer({ onClose }) {
  const [activeSegment, setActiveSegment] = useState(2); // default to District

  const segments = [
    {
      index: 0,
      label: "State",
      chars: "LA",
      desc: "2-letter uppercase State identifier (e.g., LA for Lagos, FC for FCT Abuja, OG for Ogun, EK for Ekiti).",
      role: "Determines state distribution hub and zonal logistics center.",
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-400"
    },
    {
      index: 1,
      label: "LGA",
      chars: "11",
      desc: "2-digit Local Government Area code (must be 01 to 99).",
      role: "Identifies the administrative council (e.g., 11 for Ikeja LGA).",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/40 text-blue-400"
    },
    {
      index: 2,
      label: "District (Route Cluster)",
      chars: "W06",
      desc: "3 alphanumeric characters designating the postal delivery district.",
      role: "Used as the PRIMARY CLUSTERING KEY (State-LGA-District) to bundle orders for a specific dispatch rider.",
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-400"
    },
    {
      index: 3,
      label: "Area",
      chars: "TC",
      desc: "2-letter alphabetic sub-district or neighborhood sector code.",
      role: "Primary sorting parameter for delivery stop sequencing.",
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-400"
    },
    {
      index: 4,
      label: "Unit / Building",
      chars: "18",
      desc: "2-digit numerical building / delivery point number (01 to 99).",
      role: "Secondary sorting parameter for final doorstep delivery sequence.",
      color: "from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-400"
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              NIPOST 5-Segment Postcode Architecture &amp; Route Clustering
            </h2>
            <p className="text-xs text-slate-400">
              How the National Addressing System transforms raw addresses into dispatch-ready courier clusters
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition"
          >
            Hide Guide
          </button>
        )}
      </div>

      {/* Interactive Anatomy Visualizer */}
      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Click any segment to inspect its function:
        </div>

        {/* 5-Segment Pill Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 max-w-2xl">
          {segments.map((seg, idx) => {
            const isSelected = activeSegment === idx;
            return (
              <React.Fragment key={seg.label}>
                <button
                  type="button"
                  onClick={() => setActiveSegment(idx)}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-lg border transition-all text-center ${
                    isSelected 
                      ? `bg-gradient-to-b ${seg.color} shadow-lg scale-105 z-10 font-bold` 
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-lg font-bold tracking-wider">
                    {seg.chars}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">
                    {seg.label.split(' ')[0]}
                  </span>
                </button>
                {idx < segments.length - 1 && (
                  <span className="text-slate-600 font-mono text-xl font-bold px-1 select-none">
                    -
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Segment Detail Box */}
        {activeSegment !== null && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-md bg-slate-800 text-emerald-400 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">
                    Segment {activeSegment + 1}: {segments[activeSegment].label}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded text-xs bg-slate-800 text-emerald-300 font-bold border border-slate-700">
                    "{segments[activeSegment].chars}"
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {segments[activeSegment].desc}
                </p>
                <div className="text-xs text-emerald-400/90 flex items-center space-x-1 pt-1">
                  <span className="font-semibold text-slate-400">Logistics Logic:</span>
                  <span>{segments[activeSegment].role}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Cluster Key & Sequence Formula */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
          <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
            <Navigation className="w-4 h-4" />
            1. District Route Clustering Key
          </div>
          <p className="text-slate-300 leading-relaxed">
            Consignment orders are clustered using <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">State-LGA-District</code> (e.g. <span className="font-mono text-emerald-300">LA-11-W06</span>). All packages in this zone are assigned to one designated rider and motorcycle.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/30">
          <div className="font-semibold text-blue-400 flex items-center gap-1.5 mb-1.5">
            <ArrowDownRight className="w-4 h-4" />
            2. Stop Sequence Optimization
          </div>
          <p className="text-slate-300 leading-relaxed">
            Within each cluster, stops are automatically sorted by <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded font-mono">Area</code> alphabetically, then <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded font-mono">Unit Number</code> ascending to minimize backtracking on the delivery route.
          </p>
        </div>
      </div>

    </div>
  );
}
