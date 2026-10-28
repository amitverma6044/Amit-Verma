export interface LucidTheme {
  id: string;
  name: string;
  colorName: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentBg: string;
  accentText: string;
  hoverClass: string;
  badgeClass: string;
  inlineStyle: {
    backgroundColor: string;
    borderColor: string;
    color: string;
    accentColor: string;
  };
}

export const LUCID_THEMES: LucidTheme[] = [
  {
    id: 'indigo',
    name: 'Lucid Indigo SaaS',
    colorName: 'Indigo & Slate',
    bgClass: 'bg-indigo-50/90 backdrop-blur-xs',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-950',
    accentBg: 'bg-indigo-600',
    accentText: 'text-indigo-700',
    hoverClass: 'hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    inlineStyle: {
      backgroundColor: '#f5f3ff',
      borderColor: '#c7d2fe',
      color: '#1e1b4b',
      accentColor: '#4f46e5',
    },
  },
  {
    id: 'slate',
    name: 'Lucid Slate Pro',
    colorName: 'Clean Slate & Graphite',
    bgClass: 'bg-slate-50/90 backdrop-blur-xs',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-900',
    accentBg: 'bg-slate-700',
    accentText: 'text-slate-700',
    hoverClass: 'hover:border-slate-400 hover:shadow-md hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    inlineStyle: {
      backgroundColor: '#f8fafc',
      borderColor: '#cbd5e1',
      color: '#0f172a',
      accentColor: '#334155',
    },
  },
  {
    id: 'emerald',
    name: 'Lucid Emerald Dev',
    colorName: 'Mint & Emerald',
    bgClass: 'bg-emerald-50/90 backdrop-blur-xs',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-950',
    accentBg: 'bg-emerald-600',
    accentText: 'text-emerald-700',
    hoverClass: 'hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    inlineStyle: {
      backgroundColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      color: '#064e3b',
      accentColor: '#059669',
    },
  },
  {
    id: 'violet',
    name: 'Lucid Violet Tech',
    colorName: 'Periwinkle & Violet',
    bgClass: 'bg-purple-50/90 backdrop-blur-xs',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-950',
    accentBg: 'bg-purple-600',
    accentText: 'text-purple-700',
    hoverClass: 'hover:border-purple-400 hover:shadow-md hover:shadow-purple-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
    inlineStyle: {
      backgroundColor: '#faf5ff',
      borderColor: '#e9d5ff',
      color: '#3b0764',
      accentColor: '#7c3aed',
    },
  },
  {
    id: 'blue',
    name: 'Lucid Sky Blue',
    colorName: 'Cyan & Sky',
    bgClass: 'bg-sky-50/90 backdrop-blur-xs',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-950',
    accentBg: 'bg-sky-600',
    accentText: 'text-sky-700',
    hoverClass: 'hover:border-sky-400 hover:shadow-md hover:shadow-sky-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
    inlineStyle: {
      backgroundColor: '#f0f9ff',
      borderColor: '#bae6fd',
      color: '#0c4a6e',
      accentColor: '#0284c7',
    },
  },
  {
    id: 'cyan',
    name: 'Lucid Cyan Quartz',
    colorName: 'Cyan & Aqua',
    bgClass: 'bg-cyan-50/90 backdrop-blur-xs',
    borderClass: 'border-cyan-200',
    textClass: 'text-cyan-950',
    accentBg: 'bg-cyan-600',
    accentText: 'text-cyan-700',
    hoverClass: 'hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    inlineStyle: {
      backgroundColor: '#ecfeff',
      borderColor: '#a5f3fc',
      color: '#164e63',
      accentColor: '#0891b2',
    },
  },
  {
    id: 'amber',
    name: 'Lucid Amber Gold',
    colorName: 'Amber & Gold',
    bgClass: 'bg-amber-50/90 backdrop-blur-xs',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-950',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-700',
    hoverClass: 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    inlineStyle: {
      backgroundColor: '#fffbeb',
      borderColor: '#fde68a',
      color: '#451a03',
      accentColor: '#d97706',
    },
  },
  {
    id: 'teal',
    name: 'Lucid Opal Teal',
    colorName: 'Breeze & Teal',
    bgClass: 'bg-teal-50/90 backdrop-blur-xs',
    borderClass: 'border-teal-200',
    textClass: 'text-teal-950',
    accentBg: 'bg-teal-600',
    accentText: 'text-teal-700',
    hoverClass: 'hover:border-teal-400 hover:shadow-md hover:shadow-teal-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-200',
    inlineStyle: {
      backgroundColor: '#f0fdfa',
      borderColor: '#99f6e4',
      color: '#042f2e',
      accentColor: '#0d9488',
    },
  },
  {
    id: 'rose',
    name: 'Lucid Rose Crystal',
    colorName: 'Blush & Coral',
    bgClass: 'bg-rose-50/90 backdrop-blur-xs',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-950',
    accentBg: 'bg-rose-600',
    accentText: 'text-rose-700',
    hoverClass: 'hover:border-rose-400 hover:shadow-md hover:shadow-rose-100/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    inlineStyle: {
      backgroundColor: '#fff1f2',
      borderColor: '#fecdd3',
      color: '#4c0519',
      accentColor: '#e11d48',
    },
  },
  {
    id: 'zinc',
    name: 'Lucid Minimal Zinc',
    colorName: 'Monochrome Zinc',
    bgClass: 'bg-zinc-50/90 backdrop-blur-xs',
    borderClass: 'border-zinc-200',
    textClass: 'text-zinc-900',
    accentBg: 'bg-zinc-800',
    accentText: 'text-zinc-700',
    hoverClass: 'hover:border-zinc-400 hover:shadow-md hover:shadow-zinc-200/60 hover:-translate-y-0.5 transition-all duration-300',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    inlineStyle: {
      backgroundColor: '#fafafa',
      borderColor: '#e4e4e7',
      color: '#18181b',
      accentColor: '#3f3f46',
    },
  },
];

export const getLucidThemeById = (id?: string): LucidTheme => {
  if (!id) return LUCID_THEMES[0];
  return LUCID_THEMES.find((t) => t.id === id) || LUCID_THEMES[0]; // Default Lucid Indigo SaaS
};
