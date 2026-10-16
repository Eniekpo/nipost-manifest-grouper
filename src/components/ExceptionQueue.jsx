import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Check, 
  Edit3, 
  X, 
  HelpCircle, 
  ArrowRight, 
  Trash2, 
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { normalizePostcode } from '../services/manifestService';

export default function ExceptionQueue({ 
  flaggedRows, 
  onFixRow, 
  onDeleteRow 
}) {
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [correctedPostcode, setCorrectedPostcode] = useState("");

  if (!flaggedRows || flaggedRows.length === 0) {
    return null;
  }

  const startEdit = (row) => {
    setEditingOrderId(row.order_id);
    setCorrectedPostcode(row.raw_postcode);
  };

  const cancelEdit = () => {
    setEditingOrderId(null);
    setCorrectedPostcode("");
  };

  const handleApplyFix = (row) => {
    if (!correctedPostcode.trim()) return;
    onFixRow(row.order_id, correctedPostcode.trim());
    setEditingOrderId(null);
    setCorrectedPostcode("");
  };

  // Smart suggestions for common sample errors
  const getSuggestion = (row) => {
    const raw = row.raw_postcode.toUpperCase();
    if (raw.includes("FC-00-A01")) {
      return "FC-01-A01-LR-01 (Change invalid LGA '00' to '01')";
    }
    if (raw.includes("LA-11-W06-TC-00")) {
      return "LA-11-W06-TC-10 (Change invalid Unit '00' to registered Unit '10')";
    }
    return null;
  };

  return (
    <div className="bg-slate-900/95 border border-amber-900/60 rounded-2xl p-5 mb-8 shadow-xl relative overflow-hidden">
      
      {/* Top Warning Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Exception &amp; Validation Queue
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {flaggedRows.length} Action Required
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Consignments with invalid formats, forbidden '00' numeric segments, or unregistered postcodes.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Rule: LGA and Unit segments must be between <code className="text-amber-300 font-bold">01 and 99</code>
        </div>
      </div>

      {/* Flagged Rows List */}
      <div className="mt-4 space-y-3">
        {flaggedRows.map((row) => {
          const isEditing = editingOrderId === row.order_id;
          const suggestion = getSuggestion(row);

          return (
            <div 
              key={row.order_id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* Left Info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {row.order_id}
                    </span>
                    <span className="text-white font-semibold text-xs">
                      {row.customer}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-slate-400 font-mono text-xs">
                      {row.phone}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-slate-400 text-xs">
                      {row.package_weight}
                    </span>
                  </div>

                  {/* Raw Postcode & Error Reason */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80 font-bold">
                      {row.raw_postcode}
                    </span>
                    <span className="text-xs text-rose-400 font-medium">
                      {row.error_reason || "Invalid NIPOST address code"}
                    </span>
                  </div>

                  {/* Suggestion if available */}
                  {suggestion && !isEditing && (
                    <div className="pt-1 text-[11px] text-amber-300 flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Suggested Fix:</span>
                      <button
                        onClick={() => {
                          const suggestedCode = suggestion.split(' ')[0];
                          onFixRow(row.order_id, suggestedCode);
                        }}
                        className="underline hover:text-white font-mono font-semibold"
                      >
                        {suggestion}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Actions / Inline Fix Input */}
                <div className="flex items-center space-x-2 shrink-0">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={correctedPostcode}
                        onChange={(e) => setCorrectedPostcode(e.target.value)}
                        placeholder="e.g. FC-01-A01-LR-01"
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleApplyFix(row)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                        title="Save & Re-verify"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(row)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-medium transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Fix Postcode</span>
                      </button>
                      <button
                        onClick={() => onDeleteRow(row.order_id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Remove from manifest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
