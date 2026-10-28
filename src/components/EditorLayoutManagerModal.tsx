import React from 'react';
import { Layout, Eye, EyeOff, Sliders, AlignLeft, AlignCenter, AlignRight, AlignJustify, X, Check } from 'lucide-react';

export interface SectionLayoutRule {
  id: string;
  title: string;
  description: string;
  isVisible: boolean;
  widthPercent: number; // Numeric container width percentage e.g. 50 to 100
  paddingPx: number; // Numeric padding in px e.g. 8 to 48
  textAlign: 'text-left' | 'text-center' | 'text-right' | 'text-justify';
}

export interface LayoutManagerSettings {
  quizzesSection: SectionLayoutRule;
  coursesSection: SectionLayoutRule;
  articlesGridSection: SectionLayoutRule;
  educatorSection: SectionLayoutRule;
  takeawaysSection: SectionLayoutRule;
  editorCanvasSection: SectionLayoutRule;
}

interface EditorLayoutManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LayoutManagerSettings;
  onUpdateSettings: (updated: LayoutManagerSettings) => void;
}

export const DEFAULT_LAYOUT_SETTINGS: LayoutManagerSettings = {
  quizzesSection: {
    id: 'quizzesSection',
    title: 'Practice Quizzes & MCQ Container',
    description: 'Embedded multiple-choice quiz cards and interactive test widgets.',
    isVisible: true,
    widthPercent: 100,
    paddingPx: 24,
    textAlign: 'text-left',
  },
  coursesSection: {
    id: 'coursesSection',
    title: 'Courses, Course Lists & Test Series',
    description: 'Specialization course links, student ratings, and price banners.',
    isVisible: true,
    widthPercent: 100,
    paddingPx: 24,
    textAlign: 'text-left',
  },
  articlesGridSection: {
    id: 'articlesGridSection',
    title: 'Recommended Educational Articles Grid',
    description: 'Curated study guide cards with read times and author avatars.',
    isVisible: true,
    widthPercent: 100,
    paddingPx: 24,
    textAlign: 'text-left',
  },
  educatorSection: {
    id: 'educatorSection',
    title: 'Educator Highlight Card',
    description: 'Author bio, faculty credentials, published articles count, and follower actions.',
    isVisible: true,
    widthPercent: 100,
    paddingPx: 24,
    textAlign: 'text-left',
  },
  takeawaysSection: {
    id: 'takeawaysSection',
    title: 'Key Takeaways & Theory Notes',
    description: 'Exam revision callouts, constitutional tips, and summary boxes.',
    isVisible: true,
    widthPercent: 100,
    paddingPx: 24,
    textAlign: 'text-left',
  },
  editorCanvasSection: {
    id: 'editorCanvasSection',
    title: 'Main Article Editor Canvas',
    description: 'Primary text editing container for long-form study notes.',
    isVisible: true,
    widthPercent: 100,
    paddingPx: 28,
    textAlign: 'text-left',
  },
};

export const EditorLayoutManagerModal: React.FC<EditorLayoutManagerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleToggleVisibility = (key: keyof LayoutManagerSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: {
        ...settings[key],
        isVisible: !settings[key].isVisible,
      },
    });
  };

  const handleUpdateRule = (key: keyof LayoutManagerSettings, field: keyof SectionLayoutRule, value: any) => {
    onUpdateSettings({
      ...settings,
      [key]: {
        ...settings[key],
        [field]: value,
      },
    });
  };

  const sectionsList: (keyof LayoutManagerSettings)[] = [
    'quizzesSection',
    'coursesSection',
    'articlesGridSection',
    'educatorSection',
    'takeawaysSection',
    'editorCanvasSection',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 font-sans space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-950">Editor & Section Layout Manager</h3>
              <p className="text-xs text-slate-500">
                Toggle visibility for Quizzes, Course Lists, and Test Series components with numeric width & padding controls.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Rules Config List */}
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {sectionsList.map((secKey) => {
            const rule = settings[secKey];
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  rule.isVisible ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-dashed border-amber-300 opacity-70'
                }`}
              >
                {/* Header & Visibility Switch */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{rule.title}</h4>
                      {!rule.isVisible && (
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          Hidden in Output
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{rule.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(secKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
                      rule.isVisible
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {rule.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{rule.isVisible ? 'Visible (Show)' : 'Hidden (Hide)'}</span>
                  </button>
                </div>

                {/* Per-Section Layout Controls with Numeric Inputs */}
                {rule.isVisible && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                    
                    {/* Container Width Percentage */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 font-mono">
                        Container Width ({rule.widthPercent}%):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={50}
                          max={100}
                          step={5}
                          value={rule.widthPercent}
                          onChange={(e) => handleUpdateRule(secKey, 'widthPercent', Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={50}
                          max={100}
                          value={rule.widthPercent}
                          onChange={(e) => handleUpdateRule(secKey, 'widthPercent', Math.max(50, Math.min(100, Number(e.target.value))))}
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    {/* Container Padding in Pixels */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 font-mono">
                        Padding Spacing ({rule.paddingPx}px):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={8}
                          max={48}
                          step={4}
                          value={rule.paddingPx}
                          onChange={(e) => handleUpdateRule(secKey, 'paddingPx', Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={8}
                          max={48}
                          value={rule.paddingPx}
                          onChange={(e) => handleUpdateRule(secKey, 'paddingPx', Math.max(8, Math.min(48, Number(e.target.value))))}
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 font-mono">
                        Text Alignment:
                      </label>
                      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateRule(secKey, 'textAlign', 'text-left')}
                          className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors ${
                            rule.textAlign === 'text-left' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Left Align"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateRule(secKey, 'textAlign', 'text-center')}
                          className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors ${
                            rule.textAlign === 'text-center' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Center Align"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateRule(secKey, 'textAlign', 'text-right')}
                          className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors ${
                            rule.textAlign === 'text-right' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Right Align"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onUpdateSettings(DEFAULT_LAYOUT_SETTINGS)}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
          >
            Reset All Layout Rules
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save & Apply Layout Rules
          </button>
        </div>

      </div>
    </div>
  );
};
