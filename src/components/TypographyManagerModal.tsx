import React from 'react';
import { Type, Check, X, Sliders, Heading } from 'lucide-react';
import { TypographySettings } from '../types';

interface TypographyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TypographySettings;
  onUpdateSettings: (newSettings: TypographySettings) => void;
}

export const BODY_FONTS = [
  { name: 'Inter (Clean Modern Sans)', value: 'Inter, sans-serif' },
  { name: 'Plus Jakarta Sans (SaaS Sans)', value: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Outfit (Modern Geometry)', value: "'Outfit', sans-serif" },
  { name: 'Poppins (Modern Clean)', value: "'Poppins', sans-serif" },
  { name: 'Roboto (EdTech Standard)', value: 'Roboto, sans-serif' },
  { name: 'Urbanist (Minimalist Sans)', value: "'Urbanist', sans-serif" },
  { name: 'Noto Sans Devanagari (हिंदी Clean Sans)', value: "'Noto Sans Devanagari', sans-serif" },
  { name: 'Mukta (हिंदी Sans)', value: "'Mukta', sans-serif" },
  { name: 'Merriweather (Editorial Serif)', value: 'Merriweather, serif' },
  { name: 'Lora (Academic Warm Serif)', value: "'Lora', serif" },
  { name: 'JetBrains Mono (Code & Stats)', value: "'JetBrains Mono', monospace" },
];

export const HEADING_FONTS = [
  { name: 'Inter (Bold Tracking Tight)', value: 'Inter, sans-serif' },
  { name: 'Outfit (Modern Geometry)', value: "'Outfit', sans-serif" },
  { name: 'Montserrat (High-Impact EdTech)', value: "'Montserrat', sans-serif" },
  { name: 'Space Grotesk (Tech Monospaced)', value: "'Space Grotesk', sans-serif" },
  { name: 'Oswald (Display Headline)', value: "'Oswald', sans-serif" },
  { name: 'Playfair Display (Luxury Serif)', value: "'Playfair Display', serif" },
  { name: 'Cormorant Garamond (Classical Serif)', value: "'Cormorant Garamond', serif" },
  { name: 'Noto Serif Devanagari (हिंदी Academic Serif)', value: "'Noto Serif Devanagari', serif" },
];

export const FONT_SIZES = [
  { name: '12px - Small Compact', value: '12px' },
  { name: '14px - Regular Body', value: '14px' },
  { name: '16px - Standard Academic (Recommended)', value: '16px' },
  { name: '18px - Large Reader Body', value: '18px' },
  { name: '20px - XL Display Reader', value: '20px' },
];

export const LINE_HEIGHTS = [
  { name: '1.4 (Compact)', value: '1.4' },
  { name: '1.6 (Standard)', value: '1.6' },
  { name: '1.8 (Relaxed Academic)', value: '1.8' },
  { name: '2.0 (Double Spaced)', value: '2.0' },
];

export const TypographyManagerModal: React.FC<TypographyManagerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Typography & Font Manager</h2>
              <p className="text-xs text-slate-500">
                Configure global font families, body text sizes, and line height across editor & reader preview.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Body Font */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-600" />
                Body Font Family
              </label>
              <select
                value={settings.bodyFontFamily}
                onChange={(e) => onUpdateSettings({ ...settings, bodyFontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-600"
              >
                {BODY_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Heading Font */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Heading className="w-3.5 h-3.5 text-indigo-600" />
                Heading Font Family
              </label>
              <select
                value={settings.headingFontFamily}
                onChange={(e) => onUpdateSettings({ ...settings, headingFontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-600"
              >
                {HEADING_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Global Font Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                Global Body Font Size
              </label>
              <select
                value={settings.globalFontSize}
                onChange={(e) => onUpdateSettings({ ...settings, globalFontSize: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-600"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Line Height */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-600" />
                Line Spacing Height
              </label>
              <select
                value={settings.lineHeight}
                onChange={(e) => onUpdateSettings({ ...settings, lineHeight: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-600"
              >
                {LINE_HEIGHTS.map((lh) => (
                  <option key={lh.value} value={lh.value}>
                    {lh.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Live Typography Preview
            </span>
            <div
              className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs"
              style={{
                fontFamily: settings.bodyFontFamily,
                fontSize: settings.globalFontSize,
                lineHeight: settings.lineHeight,
              }}
            >
              <h3
                className="text-lg font-bold text-slate-900"
                style={{ fontFamily: settings.headingFontFamily }}
              >
                Sample Heading Title: Fundamental Quantum Computing
              </h3>
              <p className="text-slate-700">
                This is a sample live preview of how students will read long-form technical articles, theory notes, and formula equations ($E = mc^2$) on TestPrime Portal.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Changes apply live to editor & reader mode.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply Typography Settings
          </button>
        </div>
      </div>
    </div>
  );
};
