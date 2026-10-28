import React, { useState } from 'react';
import { ArticleVersion } from '../types';
import { computeWordDiff, stripHtml } from '../utils/diffUtils';
import { History, RotateCcw, Columns, AlignLeft, AlertTriangle, X } from 'lucide-react';

interface VersionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionHistory: ArticleVersion[];
  currentContentHtml: string;
  currentTitle: string;
  onRestoreVersion: (version: ArticleVersion) => void;
}

export const VersionDiffModal: React.FC<VersionDiffModalProps> = ({
  isOpen,
  onClose,
  versionHistory,
  currentContentHtml,
  currentTitle,
  onRestoreVersion,
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    versionHistory.length > 0 ? versionHistory[0].id : ''
  );
  const [viewMode, setViewMode] = useState<'sideBySide' | 'inline'>('sideBySide');
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  if (!isOpen) return null;

  const selectedVersion = versionHistory.find((v) => v.id === selectedVersionId) || versionHistory[0];

  const historicalText = selectedVersion ? stripHtml(selectedVersion.contentSnapshot) : '';
  const currentText = stripHtml(currentContentHtml);

  // Compute word diff tokens
  const diffTokens = selectedVersion ? computeWordDiff(selectedVersion.contentSnapshot, currentContentHtml) : [];

  const handleRestore = () => {
    if (selectedVersion) {
      onRestoreVersion(selectedVersion);
      setShowRestoreConfirm(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 lg:p-8 font-sans">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 lg:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Version History & Diff Inspection</h3>
              <p className="text-xs text-slate-300">Compare historical revisions with your current active draft</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Segmented Controls */}
            <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'sideBySide' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </button>
              <button
                onClick={() => setViewMode('inline')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'inline' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Unified Inline</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Sub-Sidebar: Version Selector List */}
          <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-200 p-4 shrink-0 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Select Version Timeline</h4>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                {versionHistory.length} Revisions
              </span>
            </div>

            {versionHistory.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-slate-300 rounded-2xl text-xs text-slate-500">
                No saved snapshot versions found.
              </div>
            ) : (
              <div className="space-y-2">
                {versionHistory.map((ver, idx) => {
                  const isSelected = ver.id === selectedVersionId;
                  return (
                    <div
                      key={ver.id || idx}
                      onClick={() => setSelectedVersionId(ver.id)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-1 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{ver.title || `Revision ${idx + 1}`}</span>
                        <span className="text-[10px] font-mono font-normal text-slate-500">{ver.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{ver.summary}</p>
                      <div className="text-[10px] text-slate-500 pt-1 font-mono flex items-center justify-between border-t border-slate-100">
                        <span>{ver.wordCount} words</span>
                        <span>{ver.savedBy || 'Editor'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Diff Content Viewer */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
            
            {/* Active Selected Snapshot Metadata Bar */}
            {selectedVersion && (
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                      Selected: {selectedVersion.timestamp}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">Saved by {selectedVersion.savedBy}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{selectedVersion.summary}</p>
                </div>

                <button
                  onClick={() => setShowRestoreConfirm(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore This Version</span>
                </button>
              </div>
            )}

            {/* SIDE-BY-SIDE DIFF VIEW */}
            {viewMode === 'sideBySide' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                
                {/* Left Pane: Selected Historical Version */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
                  <div className="pb-3 mb-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h4 className="font-bold text-sm text-slate-900">
                        Historical Version ({selectedVersion?.timestamp || 'Snapshot'})
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{selectedVersion?.wordCount || 0} words</span>
                  </div>

                  <div className="flex-1 font-sans text-sm leading-relaxed text-slate-800 space-y-2 overflow-y-auto max-h-[450px] p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {diffTokens.map((token, i) => {
                      if (token.type === 'added') return null; // Only show unchanged and removed in historical pane
                      if (token.type === 'removed') {
                        return (
                          <span key={i} className="bg-rose-100 text-rose-950 line-through px-1 rounded mx-0.5 font-semibold">
                            {token.value}{' '}
                          </span>
                        );
                      }
                      return <span key={i}>{token.value} </span>;
                    })}
                  </div>
                </div>

                {/* Right Pane: Current Active Draft */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
                  <div className="pb-3 mb-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h4 className="font-bold text-sm text-slate-900">
                        Current Active Draft (Live)
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {currentText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  <div className="flex-1 font-sans text-sm leading-relaxed text-slate-800 space-y-2 overflow-y-auto max-h-[450px] p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {diffTokens.map((token, i) => {
                      if (token.type === 'removed') return null; // Only show unchanged and added in current draft pane
                      if (token.type === 'added') {
                        return (
                          <span key={i} className="bg-emerald-100 text-emerald-950 px-1 rounded mx-0.5 font-semibold">
                            {token.value}{' '}
                          </span>
                        );
                      }
                      return <span key={i}>{token.value} </span>;
                    })}
                  </div>
                </div>

              </div>
            ) : (
              /* UNIFIED INLINE DIFF VIEW */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex-1 flex flex-col">
                <div className="pb-3 mb-4 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900 text-sm">
                    Unified Diff View (Legend: <span className="bg-emerald-100 text-emerald-950 px-1.5 py-0.5 rounded font-bold">Green = Addition</span>, <span className="bg-rose-100 text-rose-950 line-through px-1.5 py-0.5 rounded font-bold">Red = Deletion</span>)
                  </span>
                </div>

                <div className="font-sans text-sm leading-relaxed text-slate-900 overflow-y-auto max-h-[500px] p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  {diffTokens.map((token, i) => {
                    if (token.type === 'added') {
                      return (
                        <span key={i} className="bg-emerald-100 text-emerald-950 font-semibold px-1 rounded mx-0.5 border border-emerald-300">
                          {token.value}{' '}
                        </span>
                      );
                    }
                    if (token.type === 'removed') {
                      return (
                        <span key={i} className="bg-rose-100 text-rose-950 line-through px-1 rounded mx-0.5 border border-rose-300 opacity-80">
                          {token.value}{' '}
                        </span>
                      );
                    }
                    return <span key={i}>{token.value} </span>;
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Confirmation Dialog for Restoring Version */}
      {showRestoreConfirm && selectedVersion && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-500" />
              <h4 className="font-bold text-lg text-slate-900">Restore Draft Version?</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to restore the snapshot from <strong>{selectedVersion.timestamp}</strong>? This will replace your current editor content with the selected historical draft.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                Confirm Restoration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
