import React, { useState } from 'react';
import { Key, ShieldCheck, X, Check, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || "");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!inputKey.trim()) {
      setTestResult({
        success: false,
        message: "Please enter an API Key to test."
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Test lookup with a sample canonical code
      const testCode = "LA-11-W06-TC-18";
      const res = await fetch(`https://api.postcode.gov.ng/v1/lookup?code=${encodeURIComponent(testCode)}&level=3`, {
        method: "GET",
        headers: {
          "X-API-Key": inputKey.trim(),
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (res.ok && data?.data?.valid) {
        setTestResult({
          success: true,
          message: "API Key verified! Successfully authenticated with NIPOST Level 3 Registry."
        });
      } else {
        setTestResult({
          success: false,
          message: data?.error?.message || `HTTP ${res.status}: Validation failed or invalid API key.`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Network/CORS error: ${err.message}. If testing locally without CORS proxy, use the offline sandbox directory.`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey("");
    onSaveApiKey("");
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">NIPOST API Configuration</h3>
              <p className="text-xs text-slate-400">Level 3 Digital Postcode Registry Integration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Level 3 Registry Endpoint:
            </div>
            <code className="block bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 break-all border border-slate-800">
              GET https://api.postcode.gov.ng/v1/lookup?code=LA-11-W06-TC-18&amp;level=3
            </code>
            <p className="text-slate-400 text-[11px]">
              Header: <code className="text-amber-300">X-API-Key: &lt;YOUR_KEY&gt;</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              NIPOST X-API-Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your NIPOST Level 3 API Key (or leave blank for sandbox)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
            />
          </div>

          {/* Test connection alert */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
            }`}>
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-300">Sandbox Note:</span> When the API key is blank, the engine seamlessly uses the local NIPOST Directory dataset with real postcodes from Lagos (Ikeja GRA), FCT Abuja (CBD, Garki), Ogun (Akute), and Ekiti (Ado Ekiti).
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              Use Sandbox
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !inputKey.trim()}
              className="flex items-center space-x-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 px-3 py-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Verifying...' : 'Test Key'}</span>
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-300 hover:text-white px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-semibold text-white px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-700/30 transition"
            >
              Save Key
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
