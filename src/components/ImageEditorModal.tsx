import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Maximize2, 
  RotateCw, 
  Check, 
  X,
  Eye,
  Sun,
  Contrast,
  Palette
} from 'lucide-react';

export interface ImageEditingConfig {
  src: string;
  alt: string;
  caption: string;
  alignment: 'left' | 'center' | 'right' | 'full';
  widthPreset: '25' | '50' | '75' | '100';
  brightness: number; // 0 to 200 (default 100)
  contrast: number;   // 0 to 200 (default 100)
  saturate: number;   // 0 to 200 (default 100)
  sepia: number;      // 0 to 100 (default 0)
  grayscale: number;  // 0 to 100 (default 0)
  blur: number;       // 0 to 10 (default 0)
  rotation: number;   // 0, 90, 180, 270
  borderStyle: 'none' | 'thin-slate' | 'thick-slate' | 'indigo-accent' | 'dashed';
  borderRadius: 'none' | 'sm' | 'md' | 'xl' | 'full';
  shadowPreset: 'none' | 'soft' | 'medium' | 'deep' | 'indigo-glow';
}

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: Partial<ImageEditingConfig>;
  onApply: (html: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onApply,
}) => {
  const [src, setSrc] = useState(initialConfig?.src || '');
  const [alt, setAlt] = useState(initialConfig?.alt || '');
  const [caption, setCaption] = useState(initialConfig?.caption || '');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'full'>(initialConfig?.alignment || 'center');
  const [widthPreset, setWidthPreset] = useState<'25' | '50' | '75' | '100'>(initialConfig?.widthPreset || '100');
  
  // Filters
  const [brightness, setBrightness] = useState(initialConfig?.brightness ?? 100);
  const [contrast, setContrast] = useState(initialConfig?.contrast ?? 100);
  const [saturate, setSaturate] = useState(initialConfig?.saturate ?? 100);
  const [sepia, setSepia] = useState(initialConfig?.sepia ?? 0);
  const [grayscale, setGrayscale] = useState(initialConfig?.grayscale ?? 0);
  const [blur, setBlur] = useState(initialConfig?.blur ?? 0);
  const [rotation, setRotation] = useState(initialConfig?.rotation ?? 0);

  // Styles
  const [borderStyle, setBorderStyle] = useState<'none' | 'thin-slate' | 'thick-slate' | 'indigo-accent' | 'dashed'>(initialConfig?.borderStyle || 'thin-slate');
  const [borderRadius, setBorderRadius] = useState<'none' | 'sm' | 'md' | 'xl' | 'full'>(initialConfig?.borderRadius || 'md');
  const [shadowPreset, setShadowPreset] = useState<'none' | 'soft' | 'medium' | 'deep' | 'indigo-glow'>(initialConfig?.shadowPreset || 'soft');

  const [activeTab, setActiveTab] = useState<'filters' | 'layout' | 'styling' | 'metadata'>('filters');

  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.src) setSrc(initialConfig.src);
      if (initialConfig.alt) setAlt(initialConfig.alt);
      if (initialConfig.caption) setCaption(initialConfig.caption);
      if (initialConfig.alignment) setAlignment(initialConfig.alignment);
      if (initialConfig.widthPreset) setWidthPreset(initialConfig.widthPreset);
      if (initialConfig.brightness !== undefined) setBrightness(initialConfig.brightness);
      if (initialConfig.contrast !== undefined) setContrast(initialConfig.contrast);
      if (initialConfig.saturate !== undefined) setSaturate(initialConfig.saturate);
      if (initialConfig.sepia !== undefined) setSepia(initialConfig.sepia);
      if (initialConfig.grayscale !== undefined) setGrayscale(initialConfig.grayscale);
      if (initialConfig.blur !== undefined) setBlur(initialConfig.blur);
      if (initialConfig.rotation !== undefined) setRotation(initialConfig.rotation);
      if (initialConfig.borderStyle) setBorderStyle(initialConfig.borderStyle);
      if (initialConfig.borderRadius) setBorderRadius(initialConfig.borderRadius);
      if (initialConfig.shadowPreset) setShadowPreset(initialConfig.shadowPreset);
    }
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setSepia(0);
    setGrayscale(0);
    setBlur(0);
    setRotation(0);
  };

  const applyPresetFilter = (preset: 'academic-vintage' | 'high-contrast' | 'noir' | 'vibrant' | 'warm-paper') => {
    switch (preset) {
      case 'academic-vintage':
        setBrightness(95); setContrast(105); setSaturate(85); setSepia(35); setGrayscale(0); setBlur(0);
        break;
      case 'high-contrast':
        setBrightness(105); setContrast(140); setSaturate(110); setSepia(0); setGrayscale(0); setBlur(0);
        break;
      case 'noir':
        setBrightness(100); setContrast(125); setSaturate(0); setSepia(0); setGrayscale(100); setBlur(0);
        break;
      case 'vibrant':
        setBrightness(105); setContrast(115); setSaturate(150); setSepia(0); setGrayscale(0); setBlur(0);
        break;
      case 'warm-paper':
        setBrightness(98); setContrast(95); setSaturate(90); setSepia(20); setGrayscale(0); setBlur(0);
        break;
    }
  };

  // Build Filter string
  const filterCss = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) rotate(${rotation}deg)`;

  // Build Border style
  let borderCss = '';
  if (borderStyle === 'thin-slate') borderCss = '1px solid #e2e8f0';
  else if (borderStyle === 'thick-slate') borderCss = '3px solid #475569';
  else if (borderStyle === 'indigo-accent') borderCss = '3px solid #4f46e5';
  else if (borderStyle === 'dashed') borderCss = '2px dashed #cbd5e1';

  // Build Radius
  let radiusCss = '0.5rem';
  if (borderRadius === 'none') radiusCss = '0px';
  else if (borderRadius === 'sm') radiusCss = '0.25rem';
  else if (borderRadius === 'md') radiusCss = '0.5rem';
  else if (borderRadius === 'xl') radiusCss = '1rem';
  else if (borderRadius === 'full') radiusCss = '9999px';

  // Build Shadow
  let shadowCss = '0 1px 3px rgba(0,0,0,0.1)';
  if (shadowPreset === 'none') shadowCss = 'none';
  else if (shadowPreset === 'soft') shadowCss = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
  else if (shadowPreset === 'medium') shadowCss = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
  else if (shadowPreset === 'deep') shadowCss = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
  else if (shadowPreset === 'indigo-glow') shadowCss = '0 0 15px rgba(79, 70, 229, 0.25)';

  // Build Alignment wrapper inline styles
  let wrapperStyle = 'margin: 1.5rem auto; text-align: center; font-family: Inter, system-ui, sans-serif;';
  if (alignment === 'left') {
    wrapperStyle = 'float: left; margin: 0.5rem 1.5rem 1rem 0; max-width: 45%;';
  } else if (alignment === 'right') {
    wrapperStyle = 'float: right; margin: 0.5rem 0 1rem 1.5rem; max-width: 45%;';
  } else if (alignment === 'full') {
    wrapperStyle = 'margin: 2rem 0; width: 100%; text-align: center;';
  } else {
    wrapperStyle = 'margin: 1.5rem auto; text-align: center; max-width: ' + widthPreset + '%;';
  }

  const handleSave = () => {
    if (!src.trim()) return;

    const imgStyle = `max-width: 100%; width: ${widthPreset === '100' ? '100%' : 'auto'}; height: auto; filter: ${filterCss}; border: ${borderCss}; border-radius: ${radiusCss}; box-shadow: ${shadowCss}; transition: all 0.2s ease; display: inline-block;`;
    
    const captionHtml = caption.trim() 
      ? `<figcaption style="font-size: 0.825rem; color: #64748b; margin-top: 0.5rem; font-style: italic; font-family: Inter, system-ui, sans-serif; text-align: center;">Fig: ${caption}</figcaption>`
      : '';

    const figureHtml = `
      <figure style="${wrapperStyle}" class="article-image-figure" data-align="${alignment}" data-width="${widthPreset}">
        <img src="${src}" alt="${alt || caption || 'Article Image'}" style="${imgStyle}" />
        ${captionHtml}
      </figure>
      <p><br></p>
    `;

    onApply(figureHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">Image & Diagram Studio</h3>
              <p className="text-xs text-slate-400">Filters, cropping presets, borders, shadows & alignment controls</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 grow">
          
          {/* Left / Top: Interactive Live Preview */}
          <div className="lg:w-1/2 p-6 bg-slate-100 flex flex-col items-center justify-center min-h-[300px] overflow-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 font-mono">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Real-Time Article Preview</span>
            </div>

            {src ? (
              <div className="w-full bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col items-center overflow-hidden">
                <div style={{ maxWidth: `${widthPreset}%`, textAlign: 'center' }}>
                  <img
                    src={src}
                    alt={alt || 'Preview'}
                    style={{
                      filter: filterCss,
                      border: borderCss,
                      borderRadius: radiusCss,
                      boxShadow: shadowCss,
                      maxWidth: '100%',
                      maxHeight: '320px',
                      objectFit: 'contain',
                      transition: 'all 0.2s ease',
                    }}
                    className="mx-auto"
                  />
                  {caption && (
                    <p className="text-xs text-slate-600 italic font-sans mt-2 text-center">
                      Fig: {caption}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 text-slate-400">
                <Sliders className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Please enter an image URL to start editing</p>
              </div>
            )}

            {/* Quick Filter Presets */}
            {src && (
              <div className="mt-4 w-full font-mono">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Preset Enhancements
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyPresetFilter('academic-vintage')}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[11px] font-medium text-slate-800 transition-colors"
                  >
                    📜 Academic Vintage
                  </button>
                  <button
                    onClick={() => applyPresetFilter('high-contrast')}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[11px] font-medium text-slate-800 transition-colors"
                  >
                    ⚡ High Contrast
                  </button>
                  <button
                    onClick={() => applyPresetFilter('warm-paper')}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-[11px] font-medium text-indigo-900 transition-colors"
                  >
                    📜 Crisp Paper
                  </button>
                  <button
                    onClick={() => applyPresetFilter('noir')}
                    className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[11px] font-medium hover:bg-black transition-colors"
                  >
                    🖤 Mono Noir
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-semibold transition-colors ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom: Editing Controls Sidebar */}
          <div className="lg:w-1/2 flex flex-col bg-white overflow-y-auto font-sans">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 shrink-0 font-mono">
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  activeTab === 'filters' ? 'border-indigo-600 text-indigo-600 bg-white font-bold' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  activeTab === 'layout' ? 'border-indigo-600 text-indigo-600 bg-white font-bold' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Layout
              </button>
              <button
                onClick={() => setActiveTab('styling')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  activeTab === 'styling' ? 'border-indigo-600 text-indigo-600 bg-white font-bold' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Borders
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  activeTab === 'metadata' ? 'border-indigo-600 text-indigo-600 bg-white font-bold' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Source
              </button>
            </div>

            {/* Tab Controls Body */}
            <div className="p-6 space-y-5 grow overflow-y-auto">
              
              {/* FILTERS TAB */}
              {activeTab === 'filters' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-500" /> Brightness</span>
                      <span className="text-slate-500">{brightness}%</span>
                    </div>
                    <input
                      type="range" min="0" max="200" value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span className="flex items-center gap-1"><Contrast className="w-3.5 h-3.5 text-slate-700" /> Contrast</span>
                      <span className="text-slate-500">{contrast}%</span>
                    </div>
                    <input
                      type="range" min="0" max="200" value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span className="flex items-center gap-1"><Palette className="w-3.5 h-3.5 text-rose-600" /> Saturation</span>
                      <span className="text-slate-500">{saturate}%</span>
                    </div>
                    <input
                      type="range" min="0" max="200" value={saturate}
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span>Sepia Tone</span>
                      <span className="text-slate-500">{sepia}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span>Grayscale / Monochromatic</span>
                      <span className="text-slate-500">{grayscale}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={grayscale}
                      onChange={(e) => setGrayscale(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span>Blur / Soft Focus</span>
                      <span className="text-slate-500">{blur}px</span>
                    </div>
                    <input
                      type="range" min="0" max="10" step="0.5" value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 font-mono">
                      <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5 text-indigo-600" /> Rotation</span>
                      <span className="text-slate-500">{rotation}°</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 font-mono">
                      {[0, 90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() => setRotation(deg)}
                          className={`py-1.5 text-xs font-medium rounded-xl border transition-all ${
                            rotation === deg
                              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT & SIZE TAB */}
              {activeTab === 'layout' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2 font-mono">Image Alignment</label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setAlignment('left')}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs transition-all ${
                          alignment === 'left' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlignLeft className="w-5 h-5" />
                        <span>Float Left</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlignment('center')}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs transition-all ${
                          alignment === 'center' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlignCenter className="w-5 h-5" />
                        <span>Center</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlignment('right')}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs transition-all ${
                          alignment === 'right' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlignRight className="w-5 h-5" />
                        <span>Float Right</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlignment('full')}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs transition-all ${
                          alignment === 'full' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Maximize2 className="w-5 h-5" />
                        <span>Full Width</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2 font-mono">Width Preset Scale</label>
                    <div className="grid grid-cols-4 gap-2 font-mono">
                      {(['25', '50', '75', '100'] as const).map((scale) => (
                        <button
                          key={scale}
                          type="button"
                          onClick={() => setWidthPreset(scale)}
                          className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                            widthPreset === scale
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {scale}% Width
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BORDERS & SHADOW TAB */}
              {activeTab === 'styling' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2 font-mono">Border Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', label: 'No Border' },
                        { id: 'thin-slate', label: 'Thin Slate Border' },
                        { id: 'thick-slate', label: 'Bold Slate Frame' },
                        { id: 'indigo-accent', label: 'Indigo Accent Frame' },
                        { id: 'dashed', label: 'Dashed Outline' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBorderStyle(item.id as any)}
                          className={`p-2.5 rounded-2xl border text-left text-xs font-medium transition-all ${
                            borderStyle === item.id
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2 font-mono">Corner Rounding</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'none', label: 'Square (0px)' },
                        { id: 'sm', label: 'Subtle (4px)' },
                        { id: 'md', label: 'Medium (8px)' },
                        { id: 'xl', label: 'Large (16px)' },
                        { id: 'full', label: 'Circle / Pill' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBorderRadius(item.id as any)}
                          className={`p-2 rounded-xl border text-xs text-center font-medium transition-all ${
                            borderRadius === item.id
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2 font-mono">Shadow Preset</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', label: 'Flat (No Shadow)' },
                        { id: 'soft', label: 'Soft Desk Elevation' },
                        { id: 'medium', label: 'Medium Academic Lift' },
                        { id: 'deep', label: 'Deep Diagram Shadow' },
                        { id: 'indigo-glow', label: 'Indigo Accent Glow' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setShadowPreset(item.id as any)}
                          className={`p-2.5 rounded-2xl border text-left text-xs font-medium transition-all ${
                            shadowPreset === item.id
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* METADATA & SOURCE TAB */}
              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1 font-mono">Image URL</label>
                    <input
                      type="text"
                      value={src}
                      onChange={(e) => setSrc(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1 font-mono">Caption Text (Shown under image)</label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="e.g. Fig 2.1: Flowchart of Legislative Process"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1 font-mono">Alt Text (Accessibility & SEO)</label>
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      placeholder="e.g. Diagram detailing the steps in legislative lawmaking"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 font-sans">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!src.trim()}
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Apply Style & Insert</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
