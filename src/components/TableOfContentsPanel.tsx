import React, { useState } from 'react';
import {
  ListTree,
  Hash,
  ArrowRight,
  GripVertical,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import {
  TocItem,
  parseHeadingsFromHtml,
  reorderTocSections,
} from '../utils/tocSectionReorder';

interface TableOfContentsPanelProps {
  contentHtml: string;
  onScrollToHeader?: (headerText: string) => void;
  onReorderContent?: (updatedHtml: string, updatedText: string) => void;
}

export const TableOfContentsPanel: React.FC<TableOfContentsPanelProps> = ({
  contentHtml,
  onScrollToHeader,
  onReorderContent,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [reorderFeedback, setReorderFeedback] = useState<string | null>(null);

  const tocItems: TocItem[] = parseHeadingsFromHtml(contentHtml);

  const highlightHeadingInEditor = (headingText: string, scroll: boolean = true) => {
    const editorDiv = document.querySelector('[contenteditable="true"]');
    if (editorDiv) {
      const headings = Array.from(editorDiv.querySelectorAll('h2, h3'));
      const target = headings.find((h) => h.textContent?.trim() === headingText);
      if (target) {
        if (scroll) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        target.classList.add('bg-amber-100/80', 'transition-colors', 'rounded', 'px-1');
        setTimeout(() => {
          target.classList.remove('bg-amber-100/80', 'rounded', 'px-1');
        }, 1600);
      }
    }
  };

  const handleHeadingClick = (item: TocItem) => {
    if (onScrollToHeader) {
      onScrollToHeader(item.text);
      return;
    }
    highlightHeadingInEditor(item.text, true);
  };

  const performSectionReorder = (fromIndex: number, toIndex: number) => {
    if (!onReorderContent) return;
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= tocItems.length ||
      toIndex >= tocItems.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const movedHeadingText = tocItems[fromIndex]?.text || 'Section';
    const result = reorderTocSections(contentHtml, fromIndex, toIndex);
    onReorderContent(result.contentHtml, result.contentText);

    setReorderFeedback(`Moved "${movedHeadingText}" to position #${toIndex + 1}`);
    setTimeout(() => {
      highlightHeadingInEditor(movedHeadingText, false);
    }, 60);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== idx) {
      setDragOverIndex(idx);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIdx: number) => {
    e.preventDefault();
    const rawSource = e.dataTransfer.getData('text/plain');
    const sourceIdx =
      draggedIndex !== null ? draggedIndex : rawSource !== '' ? Number(rawSource) : -1;

    setDraggedIndex(null);
    setDragOverIndex(null);

    if (!Number.isNaN(sourceIdx) && sourceIdx >= 0 && sourceIdx !== targetIdx) {
      performSectionReorder(sourceIdx, targetIdx);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-5 text-stone-800 font-sans min-w-0">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-stone-900 text-white shadow-xs min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <ListTree className="w-5 h-5 text-amber-400 shrink-0 flex-shrink-0" />
            <h4 className="font-serif font-bold text-base text-white min-w-0 truncate">
              Table of Contents
            </h4>
          </div>
          <span className="text-[10px] font-mono text-stone-400 shrink-0 flex-shrink-0">
            {tocItems.length} Headings
          </span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed min-w-0 break-words">
          Drag and drop any heading below to reorder document sections, or click a heading to jump directly to that section.
        </p>
      </div>

      {/* Live Reorder Status Feedback */}
      {reorderFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start justify-between gap-2 min-w-0"
        >
          <div className="flex items-start gap-1.5 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="min-w-0 break-words leading-snug">{reorderFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setReorderFeedback(null)}
            aria-label="Dismiss reorder status"
            className="text-emerald-600 hover:text-emerald-900 text-[11px] font-bold px-1 shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Headings List */}
      <div className="space-y-2 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
          <h4 className="text-[11px] font-bold text-stone-700 uppercase tracking-wider min-w-0">
            Article Sections Breakdown
          </h4>
          {tocItems.length > 1 && onReorderContent && (
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 rounded-md shrink-0">
              Drag to Reorder
            </span>
          )}
        </div>

        {tocItems.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-stone-200 rounded-xl text-xs text-stone-500 min-w-0">
            No H2 or H3 headings detected in article text yet. Use the formatting toolbar to add Heading 2 or Heading 3 blocks.
          </div>
        ) : (
          <div
            data-testid="toc-sections-list"
            className="space-y-1.5 bg-stone-50/60 p-2 rounded-xl border border-stone-200/80 min-w-0"
          >
            {tocItems.map((item, idx) => {
              const isDragged = draggedIndex === idx;
              const isDragTarget = dragOverIndex === idx && draggedIndex !== idx;

              return (
                <div
                  key={`${item.id}-${item.text}`}
                  data-testid={`toc-section-item-${idx}`}
                  draggable={Boolean(onReorderContent)}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`w-full rounded-xl text-xs transition-all flex items-center gap-1.5 p-1.5 group min-w-0 border ${
                    isDragTarget
                      ? 'border-indigo-500 bg-indigo-50/90 ring-2 ring-indigo-500/20 shadow-xs'
                      : isDragged
                      ? 'opacity-50 border-indigo-300 bg-white scale-[0.99]'
                      : 'border-transparent bg-white/80 hover:bg-white hover:border-stone-200 hover:shadow-2xs'
                  } ${item.level === 'h3' ? 'pl-2.5' : ''}`}
                >
                  {/* Drag Handle */}
                  {onReorderContent && (
                    <span
                      title="Drag to reorder section"
                      className="cursor-grab active:cursor-grabbing text-stone-400 hover:text-indigo-600 p-1 rounded shrink-0 flex items-center justify-center"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* Clickable Heading Jump Button */}
                  <button
                    type="button"
                    onClick={() => handleHeadingClick(item)}
                    className={`flex-1 text-left py-1 px-1 rounded-lg transition-colors flex items-start gap-1.5 min-w-0 ${
                      item.level === 'h2'
                        ? 'font-serif font-bold text-stone-900 hover:text-[#9A3412]'
                        : 'font-sans font-medium text-stone-600 hover:text-stone-900 border-l-2 border-stone-200 pl-2'
                    }`}
                  >
                    <Hash
                      className={`w-3.5 h-3.5 shrink-0 flex-shrink-0 mt-0.5 ${
                        item.level === 'h2' ? 'text-[#9A3412]' : 'text-stone-400'
                      }`}
                    />
                    <span className="flex-1 min-w-0 leading-snug line-clamp-2 break-words">
                      {item.text}
                    </span>
                    <ArrowRight className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex-shrink-0 mt-0.5" />
                  </button>

                  {/* Accessible Reorder Up/Down Controls */}
                  {onReorderContent && tocItems.length > 1 && (
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          performSectionReorder(idx, idx - 1);
                        }}
                        aria-label={`Move "${item.text}" up`}
                        title="Move section up"
                        className="p-0.5 rounded hover:bg-indigo-50 text-stone-400 hover:text-indigo-600 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === tocItems.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          performSectionReorder(idx, idx + 1);
                        }}
                        aria-label={`Move "${item.text}" down`}
                        title="Move section down"
                        className="p-0.5 rounded hover:bg-indigo-50 text-stone-400 hover:text-indigo-600 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
