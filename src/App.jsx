import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PostcodeExplainer from './components/PostcodeExplainer';
import StatsOverview from './components/StatsOverview';
import ManifestInput from './components/ManifestInput';
import RouteClustersView from './components/RouteClustersView';
import ExceptionQueue from './components/ExceptionQueue';
import ComparisonTable from './components/ComparisonTable';
import ApiKeyModal from './components/ApiKeyModal';
import ManualOrderModal from './components/ManualOrderModal';
import PrintDispatchModal from './components/PrintDispatchModal';

import { 
  SAMPLE_RAW_MANIFEST, 
  processManifestBatch, 
  parseUploadedCsv, 
  generateCleanRoutesCsv 
} from './services/manifestService';

import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('nipost_api_key') || '';
  });

  const [rawRows, setRawRows] = useState(SAMPLE_RAW_MANIFEST);
  const [processedRows, setProcessedRows] = useState([]);
  const [routeClusters, setRouteClusters] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals & Panels
  const [showExplainer, setShowExplainer] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printingCluster, setPrintingCluster] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Run initial manifest batch on initial load so the prototype is immediately alive
  useEffect(() => {
    runBatchProcessing(SAMPLE_RAW_MANIFEST);
  }, []);

  const runBatchProcessing = async (rows = rawRows, key = apiKey) => {
    if (!rows || rows.length === 0) {
      setProcessedRows([]);
      setRouteClusters([]);
      return;
    }

    setIsProcessing(true);
    try {
      const { processedRows: pRows, routeClusters: rClusters } = await processManifestBatch(rows, key);
      setProcessedRows(pRows);
      setRouteClusters(rClusters);

      const validCount = pRows.filter(r => r.status === 'VALID').length;
      const flaggedCount = pRows.filter(r => r.status !== 'VALID').length;

      showToast(
        `Manifest Processed: ${validCount} valid stops grouped into ${rClusters.length} route clusters (${flaggedCount} flagged).`,
        flaggedCount > 0 ? 'warning' : 'success'
      );
    } catch (err) {
      console.error("Batch processing error:", err);
      showToast(`Error processing manifest: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('nipost_api_key', newKey);
    showToast(newKey ? "NIPOST Live API Key saved!" : "Switched to NIPOST Sandbox Directory");
    // Re-run with new key
    runBatchProcessing(rawRows, newKey);
  };

  const handleLoadSample = () => {
    setRawRows(SAMPLE_RAW_MANIFEST);
    runBatchProcessing(SAMPLE_RAW_MANIFEST);
    showToast("Loaded NIPOST sample manifest (9 test consignments)");
  };

  const handleUploadCsv = (csvText) => {
    const parsed = parseUploadedCsv(csvText);
    if (parsed.length === 0) {
      showToast("CSV file appeared empty or invalid format", "error");
      return;
    }
    setRawRows(parsed);
    runBatchProcessing(parsed);
    showToast(`Successfully imported ${parsed.length} consignments from CSV!`);
  };

  const handleAddOrder = (newOrder) => {
    const updated = [newOrder, ...rawRows];
    setRawRows(updated);
    runBatchProcessing(updated);
    showToast(`Added Order ${newOrder.order_id} to manifest`);
  };

  const handleDeleteRawRow = (index) => {
    const updated = rawRows.filter((_, idx) => idx !== index);
    setRawRows(updated);
    runBatchProcessing(updated);
    showToast("Consignment removed from manifest");
  };

  const handleDeleteById = (orderId) => {
    const updated = rawRows.filter(r => r.order_id !== orderId);
    setRawRows(updated);
    runBatchProcessing(updated);
    showToast(`Order ${orderId} removed`);
  };

  const handleFixRow = (orderId, newPostcode) => {
    const updated = rawRows.map(row => {
      if (row.order_id === orderId) {
        return {
          ...row,
          raw_postcode: newPostcode
        };
      }
      return row;
    });

    setRawRows(updated);
    runBatchProcessing(updated);
    showToast(`Updated postcode for ${orderId} & re-verified`);
  };

  const handleClearRows = () => {
    setRawRows([]);
    setProcessedRows([]);
    setRouteClusters([]);
    showToast("Manifest cleared");
  };

  const handleExportCleanCsv = () => {
    if (routeClusters.length === 0) {
      showToast("No valid routes to export", "warning");
      return;
    }

    const csvContent = generateCleanRoutesCsv(routeClusters);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nipost_clean_dispatched_routes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Dispatched Routes CSV downloaded successfully!");
  };

  const handleQuickDemo = () => {
    handleLoadSample();
  };

  const flaggedRows = processedRows.filter(r => r.status !== 'VALID');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur-md ${
            toast.type === 'error' 
              ? 'bg-rose-950/90 text-rose-200 border-rose-700/80' 
              : toast.type === 'warning'
                ? 'bg-amber-950/90 text-amber-200 border-amber-700/80'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onToggleExplainer={() => setShowExplainer(!showExplainer)}
        showExplainer={showExplainer}
        onQuickDemo={handleQuickDemo}
        isProcessing={isProcessing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Postcode 5-Segment Explainer (Collapsible) */}
        {showExplainer && (
          <PostcodeExplainer onClose={() => setShowExplainer(false)} />
        )}

        {/* Operational Metrics Cards */}
        <StatsOverview
          rawRows={rawRows}
          processedRows={processedRows}
          routeClusters={routeClusters}
        />

        {/* Consignment Manifest Ingestion & Raw Table */}
        <ManifestInput
          rawRows={rawRows}
          onLoadSample={handleLoadSample}
          onUploadCsv={handleUploadCsv}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onClearRows={handleClearRows}
          onDeleteRow={handleDeleteRawRow}
          onProcessBatch={() => runBatchProcessing(rawRows)}
          isProcessing={isProcessing}
        />

        {/* Exception & Flagged Queue (If any invalid rows exist) */}
        <ExceptionQueue
          flaggedRows={flaggedRows}
          onFixRow={handleFixRow}
          onDeleteRow={handleDeleteById}
        />

        {/* Dispatched Route Clusters & Courier Sequences */}
        <RouteClustersView
          routeClusters={routeClusters}
          onExportCsv={handleExportCleanCsv}
          onPrintCluster={(cluster) => setPrintingCluster(cluster)}
        />

        {/* Full Consignment Audit Ledger & Comparison */}
        <ComparisonTable
          processedRows={processedRows}
        />

      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>NIPOST Digital Addressing System (Prototype 3)</span>
          </div>
          <div>
            Powered by NIPOST Level 3 Postcode API &amp; District Cluster Routing Algorithm
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <ManualOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrder={handleAddOrder}
      />

      <PrintDispatchModal
        cluster={printingCluster}
        onClose={() => setPrintingCluster(null)}
      />

    </div>
  );
}
