import React from 'react';
import { ArticleVersion } from '../types';
import { History, RotateCcw, Clock, Columns } from 'lucide-react';

interface VersionHistoryPanelProps {
  versionHistory: ArticleVersion[];
  onRestoreVersion: (version: ArticleVersion) => void;
  onSaveCurrentSnapshot: () => void;
  onOpenDiffViewer?: () => void;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  versionHistory,
  onRestoreVersion,
  onSaveCurrentSnapshot,
  onOpenDiffViewer,
}) => {
  return (
    <div className="space-y-6 text-slate-800 font-sans min-w-0">
      
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <History className="w-5 h-5 text-indigo-400 shrink-0 flex-shrink-0" />
            <h4 className="font-bold text-sm text-white min-w-0 truncate">Version History</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0 flex-shrink-0">{versionHistory.length} Revisions</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed min-w-0 break-words">
          Real-time revision timeline. Restore earlier drafts, inspect word count changes, and compare side-by-side text diffs.
        </p>

        <div className="flex flex-col gap-2 min-w-0">
          <button
            onClick={onSaveCurrentSnapshot}
            className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 flex-shrink-0"
          >
            <Clock className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
            <span>Save Current Snapshot</span>
          </button>

          {onOpenDiffViewer && versionHistory.length > 0 && (
            <button
              onClick={onOpenDiffViewer}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shrink-0 flex-shrink-0"
            >
              <Columns className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
              <span>Inspect Side-by-Side Diff</span>
            </button>
          )}
        </div>
      </div>

      {/* Revision Timeline */}
      <div className="space-y-3 min-w-0">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Revision Timeline</h4>

        {versionHistory.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 min-w-0">
            No previous snapshots saved yet. Click above to capture a version milestone.
          </div>
        ) : (
          <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 min-w-0">
            {versionHistory.map((ver, i) => (
              <div key={ver.id || i} className="relative pl-8 pr-3 py-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1.5 min-w-0">
                <span className="absolute left-2 top-4 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 min-w-0 truncate">{ver.title || `Revision ${i + 1}`}</span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 flex-shrink-0">{ver.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 min-w-0 break-words">{ver.summary}</p>
                
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 font-mono min-w-0">
                  <span className="text-[10px] text-slate-500 min-w-0 truncate">{ver.wordCount} words • {ver.savedBy || 'Editor'}</span>
                  <div className="flex items-center gap-2 shrink-0 flex-shrink-0">
                    {onOpenDiffViewer && (
                      <button
                        onClick={onOpenDiffViewer}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 shrink-0 flex-shrink-0"
                        title="View side-by-side diff"
                      >
                        <Columns className="w-3 h-3 text-indigo-600 shrink-0 flex-shrink-0" />
                        <span>Diff</span>
                      </button>
                    )}
                    <button
                      onClick={() => onRestoreVersion(ver)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 flex-shrink-0"
                    >
                      <RotateCcw className="w-3 h-3 shrink-0 flex-shrink-0" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
