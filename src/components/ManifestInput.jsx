import React, { useRef } from 'react';
import { 
  Upload, 
  FileText, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Download,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { normalizePostcode } from '../services/manifestService';

export default function ManifestInput({ 
  rawRows, 
  onLoadSample, 
  onUploadCsv, 
  onOpenAddModal, 
  onClearRows, 
  onDeleteRow,
  onProcessBatch,
  isProcessing
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (text) {
          onUploadCsv(text);
        }
      };
      reader.readAsText(file);
    }
    // reset input so same file can be picked again
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const sampleCsv = `order_id,customer,phone,raw_postcode,package_weight
ORD-901,Amaka Obi,08031112201,la 11 w06 tc 18,2.4kg
ORD-902,Bello Danjuma,08023334412,FC-01-A01-KP-27,1.1kg
ORD-903,Kemi Adebayo,08095556677,LA11W06TC10,3.0kg
ORD-904,Yusuf Garba,08057778899,FC-00-A01-LR-01,0.8kg
ORD-905,Ngozi Eze,08134445566,fc-01-a01-lr-01,4.2kg
ORD-906,Tosin Ajayi,07062223344,LA-11-W06-AB-04,1.5kg
ORD-907,Sadiq Abubakar,08089990011,FC01A01MH01,2.0kg
ORD-908,Biodun Oke,08161239876,OG-14-T18-BN-16,5.5kg
ORD-909,Chidi Nwachukwu,08039876543,LA-11-W06-TC-00,1.9kg`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nipost_manifest_sample_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      
      {/* Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Consignment Manifest Ingestion
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest raw unstandardized logistics manifests with messy postcode formats, missing dashes, or casing anomalies.
          </p>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv,text/csv" 
            className="hidden" 
          />

          {/* Load Sample Button */}
          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Sample Manifest</span>
          </button>

          {/* Upload CSV */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Upload CSV</span>
          </button>

          {/* Download CSV Template */}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
            title="Download CSV sample file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV Template</span>
          </button>

          {/* Add Single Order */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Order</span>
          </button>

          {/* Clear All */}
          {rawRows.length > 0 && (
            <button
              onClick={onClearRows}
              className="flex items-center space-x-1 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition"
              title="Clear manifest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

        </div>
      </div>

      {/* Raw Manifest Table Preview */}
      <div className="mt-4">
        {rawRows.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-800 rounded-xl text-center space-y-3 bg-slate-950/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Upload className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">No Manifest Loaded</p>
              <p className="text-xs text-slate-500 mt-1">
                Click "Load Sample Manifest" or upload your dispatch CSV to begin normalization.
              </p>
            </div>
            <button
              onClick={onLoadSample}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-700/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load NIPOST Sample (9 Orders)</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <span>Previewing <span className="text-white font-semibold">{rawRows.length}</span> raw consignment records</span>
              <span className="text-[11px] text-slate-500">Notice messy postcodes with missing dashes or irregular casing</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Order ID</th>
                    <th className="py-2.5 px-3 font-semibold">Customer</th>
                    <th className="py-2.5 px-3 font-semibold">Phone</th>
                    <th className="py-2.5 px-3 font-semibold">Raw Postcode Input</th>
                    <th className="py-2.5 px-3 font-semibold">Instant Normalization</th>
                    <th className="py-2.5 px-3 font-semibold">Weight</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {rawRows.map((row, idx) => {
                    const normalized = normalizePostcode(row.raw_postcode);
                    const isMessy = row.raw_postcode !== normalized;
                    return (
                      <tr key={row.order_id || idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-3 font-semibold text-emerald-400">
                          {row.order_id}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-200">
                          {row.customer}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {row.phone}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            isMessy 
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' 
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {row.raw_postcode || '<empty>'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          <span className="text-emerald-400 font-bold">{normalized}</span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-400">
                          {row.package_weight}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onDeleteRow(idx)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Processing Control Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  Ready to disassemble 5-segments, verify Level 3 address records, and group into district routes.
                </span>
              </div>

              <button
                onClick={onProcessBatch}
                disabled={isProcessing || rawRows.length === 0}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-700/30 hover:shadow-emerald-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing NIPOST Verification Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition" />
                    <span>Clean &amp; Cluster Manifest</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
