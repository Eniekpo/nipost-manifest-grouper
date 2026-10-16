import React from 'react';
import { 
  Truck, 
  Key, 
  MapPin, 
  BookOpen, 
  Zap, 
  Server, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function Header({ 
  apiKey, 
  onOpenApiKeyModal, 
  onToggleExplainer, 
  showExplainer,
  onQuickDemo,
  isProcessing
}) {
  const isLive = Boolean(apiKey && apiKey.trim() !== "");

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Truck className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  NIPOST • National Addressing
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                  Prototype 3
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Logistics Manifest Cleaner <span className="text-slate-500 font-normal">&amp;</span> Route Grouper
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Mode Indicator Badge */}
            <div 
              onClick={onOpenApiKeyModal}
              className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                isLive 
                  ? 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/50 shadow-sm shadow-emerald-900/40' 
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
              title="Click to configure NIPOST API Key"
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="truncate max-w-[140px]">
                {isLive ? 'Live API (Level 3)' : 'Sandbox Directory'}
              </span>
              <Key className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Quick Postcode Guide Button */}
            <button
              onClick={onToggleExplainer}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                showExplainer 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30' 
                  : 'bg-slate-800 hover:bg-slate-700/90 text-slate-300 border-slate-700'
              }`}
              title="Toggle NIPOST 5-Segment Postcode Anatomy"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Postcode Anatomy</span>
            </button>

            {/* API Settings Button */}
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="API Key Configuration"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">API Config</span>
            </button>

            {/* Quick Demo Run */}
            <button
              onClick={onQuickDemo}
              disabled={isProcessing}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-md shadow-emerald-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Load Sample Manifest & Clean Routes in One Click"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Quick Demo</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
