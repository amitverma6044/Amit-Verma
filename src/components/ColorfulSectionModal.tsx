import React, { useState } from 'react';
import { LUCID_THEMES, getLucidThemeById } from '../utils/lucidThemes';
import { Palette, Sparkles, BookOpen, GraduationCap, AlertCircle, Lightbulb, Check, X, Layers, Layout, ArrowRight } from 'lucide-react';

interface ColorfulSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSection: (html: string) => void;
}

export const ColorfulSectionModal: React.FC<ColorfulSectionModalProps> = ({
  isOpen,
  onClose,
  onInsertSection,
}) => {
  const [sectionType, setSectionType] = useState<
    'recommended_articles' | 'educator_card' | 'key_takeaways' | 'theory_context' | 'exam_warning' | 'summary_box' | 'cheatsheet_cards' | 'course_banner'
  >('recommended_articles');

  const [themeId, setThemeId] = useState<string>('indigo');
  const [customTitle, setCustomTitle] = useState<string>('Recommended Educational Articles');
  const [customTag, setCustomTag] = useState<string>('NEXT UP IN SYLLABUS');
  const [customDescription, setCustomDescription] = useState<string>(
    'Explore curated high-yield study guides and syllabus modules to strengthen your exam preparation.'
  );

  if (!isOpen) return null;

  const activeTheme = getLucidThemeById(themeId);

  const handleGenerateAndInsert = () => {
    let generatedHtml = '';

    if (sectionType === 'cheatsheet_cards') {
      // Formula & Complexity Cheat Sheet Tri-Color Cards
      generatedHtml = `
        <div class="colorful-cheatsheet my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid ${activeTheme.inlineStyle.borderColor}; padding-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${activeTheme.inlineStyle.accentColor}; font-family: monospace;">${customTag || 'REVISION DECK'}</span>
              <h3 style="margin: 0.25rem 0 0 0; font-family: Inter, system-ui, sans-serif; font-size: 1.35rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle || 'Formula & Complexity Cheat Sheet'}</h3>
            </div>
            <span style="font-size: 0.75rem; font-weight: bold; background-color: #ffffff; border: 1px solid ${activeTheme.inlineStyle.borderColor}; padding: 0.35rem 0.75rem; border-radius: 0.5rem; color: ${activeTheme.inlineStyle.accentColor};">
              📥 Quick Download Card
            </span>
          </div>

          <p style="font-size: 0.875rem; color: #475569; margin-bottom: 1.25rem;">${customDescription}</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div style="padding: 1.25rem; border-radius: 1rem; background-color: #eef2ff; border: 1px solid #c7d2fe;">
              <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #4338ca; background-color: #e0e7ff; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Pattern 1</span>
              <h4 style="font-family: Inter, system-ui, sans-serif; font-weight: bold; font-size: 1rem; color: #0f172a; margin: 0.5rem 0 0.25rem 0;">0/1 Knapsack Problem</h4>
              <p style="font-size: 0.75rem; color: #475569; margin: 0;">Include or exclude item based on max weight capacity limit.</p>
              <div style="margin-top: 1rem; font-family: monospace; font-size: 0.75rem; font-weight: bold; color: #312e81; border-top: 1px solid #c7d2fe; padding-top: 0.5rem;">Time: O(N×W) | Space: O(W)</div>
            </div>

            <div style="padding: 1.25rem; border-radius: 1rem; background-color: #fffbeb; border: 1px solid #fde68a;">
              <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #b45309; background-color: #fef3c7; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Pattern 2</span>
              <h4 style="font-family: Inter, system-ui, sans-serif; font-weight: bold; font-size: 1rem; color: #0f172a; margin: 0.5rem 0 0.25rem 0;">Longest Common Subsequence</h4>
              <p style="font-size: 0.75rem; color: #475569; margin: 0;">Finding common ordered characters across two strings without shifting order.</p>
              <div style="margin-top: 1rem; font-family: monospace; font-size: 0.75rem; font-weight: bold; color: #78350f; border-top: 1px solid #fde68a; padding-top: 0.5rem;">Time: O(M×N) | Space: O(min(M,N))</div>
            </div>

            <div style="padding: 1.25rem; border-radius: 1rem; background-color: #f0fdf4; border: 1px solid #a7f3d0;">
              <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #047857; background-color: #d1fae5; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Pattern 3</span>
              <h4 style="font-family: Inter, system-ui, sans-serif; font-weight: bold; font-size: 1rem; color: #0f172a; margin: 0.5rem 0 0.25rem 0;">Matrix Chain Multiplication</h4>
              <p style="font-size: 0.75rem; color: #475569; margin: 0;">Optimal parenthesization order to minimize scalar multiplications.</p>
              <div style="margin-top: 1rem; font-family: monospace; font-size: 0.75rem; font-weight: bold; color: #064e3b; border-top: 1px solid #a7f3d0; padding-top: 0.5rem;">Time: O(N³) | Space: O(N²)</div>
            </div>
          </div>
        </div>
        <p><br/></p>
      `;
    } else if (sectionType === 'course_banner') {
      // Linked Course Certification Banner Dark Slate/Indigo Card
      generatedHtml = `
        <div class="colorful-course-banner my-8 p-6 sm:p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl font-sans antialiased text-white" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); border: 1.5px solid #4338ca;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem;">
            <div style="max-width: 600px;">
              <span style="font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; background-color: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.4); padding: 0.3rem 0.75rem; border-radius: 9999px; font-family: monospace;">
                🎓 ${customTag || 'SPECIALIZATION CERTIFICATION'}
              </span>
              <h3 style="font-family: Inter, system-ui, sans-serif; font-size: 1.6rem; font-weight: bold; color: #ffffff; margin: 0.75rem 0 0.5rem 0; line-height: 1.25;">
                ${customTitle || 'Advanced Algorithms & System Design Masterclass'}
              </h3>
              <p style="font-size: 0.875rem; color: #cbd5e1; line-height: 1.6; margin: 0;">
                ${customDescription || 'Comprehensive 12-week cohort-based program with live faculty mentoring, peer code reviews, and mock interview practice.'}
              </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
              <button style="background-color: #4f46e5; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 0.875rem; font-weight: bold; font-size: 0.875rem; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); transition: all 0.2s;" onmouseover="this.style.backgroundColor='#4338ca'" onmouseout="this.style.backgroundColor='#4f46e5'">
                Enroll in Masterclass →
              </button>
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 500; font-family: monospace;">
                ⭐ <strong>4.92/5 Rating</strong> • 12,400+ Enrolled Students
              </div>
            </div>
          </div>
        </div>
        <p><br/></p>
      `;
    } else if (sectionType === 'recommended_articles') {
      // 3-card Recommended Articles Grid inspired by reference image
      generatedHtml = `
        <div class="colorful-section my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid ${activeTheme.inlineStyle.borderColor}; padding-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${activeTheme.inlineStyle.accentColor}; font-family: monospace;">${customTag || 'NEXT UP IN SYLLABUS'}</span>
              <h3 style="margin: 0.25rem 0 0 0; font-family: Inter, system-ui, sans-serif; font-size: 1.35rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle}</h3>
            </div>
            <a href="#" style="font-size: 0.8rem; font-weight: bold; color: ${activeTheme.inlineStyle.accentColor}; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              View All Study Guides →
            </a>
          </div>

          <p style="font-size: 0.875rem; color: #475569; margin-bottom: 1.25rem; line-height: 1.5;">${customDescription}</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            
            {/* Card 1 */}
            <div style="background-color: #ffffff; border: 1px solid ${activeTheme.inlineStyle.borderColor}; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column;" class="hover:shadow-md hover:-translate-y-1">
              <div style="height: 130px; background: linear-gradient(135deg, ${activeTheme.inlineStyle.borderColor} 0%, ${activeTheme.inlineStyle.accentColor} 100%); position: relative; padding: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="background-color: rgba(255,255,255,0.95); font-size: 0.65rem; font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #0f172a;">Algorithms & Data Structures</span>
                <span style="background-color: rgba(15,23,42,0.8); color: #ffffff; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">9 min read</span>
              </div>
              <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <span style="font-size: 0.7rem; color: ${activeTheme.inlineStyle.accentColor}; font-weight: bold; font-family: monospace;">Core Concept • Intermediate</span>
                  <h4 style="font-family: Inter, system-ui, sans-serif; font-size: 0.95rem; font-weight: bold; color: #0f172a; margin: 0.375rem 0 0.5rem 0; line-height: 1.35;">Mastering Dynamic Programming: Memoization vs Tabulation</h4>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                  <span>Prof. Aman Sharma</span>
                  <span style="color: ${activeTheme.inlineStyle.accentColor}; font-weight: bold;">→</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div style="background-color: #ffffff; border: 1px solid ${activeTheme.inlineStyle.borderColor}; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column;" class="hover:shadow-md hover:-translate-y-1">
              <div style="height: 130px; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); position: relative; padding: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="background-color: rgba(255,255,255,0.95); font-size: 0.65rem; font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #0f172a;">Artificial Intelligence</span>
                <span style="background-color: rgba(15,23,42,0.8); color: #ffffff; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">14 min read</span>
              </div>
              <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <span style="font-size: 0.7rem; color: #9333ea; font-weight: bold; font-family: monospace;">Must Read • Advanced</span>
                  <h4 style="font-family: Inter, system-ui, sans-serif; font-size: 0.95rem; font-weight: bold; color: #0f172a; margin: 0.375rem 0 0.5rem 0; line-height: 1.35;">Complete Guide to Transformer Architecture & Attention Mechanisms</h4>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                  <span>Dr. Evelyn Vance</span>
                  <span style="color: #9333ea; font-weight: bold;">→</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div style="background-color: #ffffff; border: 1px solid ${activeTheme.inlineStyle.borderColor}; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column;" class="hover:shadow-md hover:-translate-y-1">
              <div style="height: 130px; background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); position: relative; padding: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="background-color: rgba(255,255,255,0.95); font-size: 0.65rem; font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #0f172a;">System Architecture</span>
                <span style="background-color: rgba(15,23,42,0.8); color: #ffffff; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">7 min read</span>
              </div>
              <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <span style="font-size: 0.7rem; color: #0284c7; font-weight: bold; font-family: monospace;">Interview Prep • Intermediate</span>
                  <h4 style="font-family: Inter, system-ui, sans-serif; font-size: 0.95rem; font-weight: bold; color: #0f172a; margin: 0.375rem 0 0.5rem 0; line-height: 1.35;">System Design 101: Understanding Consistent Hashing & Caching</h4>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                  <span>Kunal Verma</span>
                  <span style="color: #0284c7; font-weight: bold;">→</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <p><br/></p>
      `;
    } else if (sectionType === 'educator_card') {
      // Educator Profile Highlight Card
      generatedHtml = `
        <div class="colorful-educator-card my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.25rem;">
            
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 72px; height: 72px; border-radius: 1rem; background: linear-gradient(135deg, ${activeTheme.inlineStyle.accentColor}, #0f172a); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.75rem; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                👨‍🏫
              </div>
              <div>
                <h3 style="margin: 0; font-family: Inter, system-ui, sans-serif; font-size: 1.25rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle || 'Prof. Aman Sharma'}</h3>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: ${activeTheme.inlineStyle.accentColor}; font-weight: 600;">
                  Head of Computer Science & Academic Curriculum • EduForge
                </p>
                <p style="margin: 0.375rem 0 0 0; font-size: 0.85rem; color: #475569; max-width: 600px;">
                  ${customDescription || 'Taught over 85,000+ engineers worldwide. Author of "Cracking the Code System Architecture" and former mentor at IIT Delhi Competitive Coding Circle.'}
                </p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: 0.5rem;">
              <button style="background-color: ${activeTheme.inlineStyle.accentColor}; color: #ffffff; border: none; padding: 0.5rem 1.25rem; border-radius: 0.75rem; font-weight: bold; font-size: 0.8rem; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                + Follow Educator
              </button>
              <div style="font-size: 0.75rem; color: #64748b; text-align: right; font-family: monospace;">
                <strong>42</strong> Articles • <strong>4.95 ⭐</strong> Student Rating
              </div>
            </div>

          </div>
        </div>
        <p><br/></p>
      `;
    } else if (sectionType === 'key_takeaways') {
      // Key Takeaways Box
      generatedHtml = `
        <div class="colorful-takeaways my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid ${activeTheme.inlineStyle.borderColor}; padding-bottom: 0.5rem;">
            <span style="font-size: 1.25rem;">📌</span>
            <h3 style="margin: 0; font-family: Inter, system-ui, sans-serif; font-size: 1.2rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle || '📌 Key Takeaways for IAS & Exam Aspirants'}</h3>
          </div>
          <p style="font-size: 0.9rem; color: #334155; line-height: 1.6; margin-bottom: 0.75rem;">${customDescription}</p>
          <ul style="font-size: 0.875rem; color: #1e293b; line-height: 1.7; padding-left: 1.25rem; margin: 0;">
            <li><strong>Core Constitutional Principle:</strong> Articles 12-35 define fundamental citizen rights with constitutional remedies under Article 32.</li>
            <li><strong>Supreme Court Writs:</strong> Habeas Corpus, Mandamus, Prohibition, Quo Warranto, and Certiorari safeguard liberty against state overreach.</li>
            <li><strong>Exam Strategy Tip:</strong> Memorize landmark Supreme Court rulings (e.g. Kesavananda Bharati case 1973) for essay and mains answers.</li>
          </ul>
        </div>
        <p><br/></p>
      `;
    } else if (sectionType === 'theory_context') {
      // Theoretical Context Box
      generatedHtml = `
        <div class="colorful-theory my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid ${activeTheme.inlineStyle.borderColor}; padding-bottom: 0.5rem;">
            <span style="font-size: 1.25rem;">💡</span>
            <h3 style="margin: 0; font-family: Inter, system-ui, sans-serif; font-size: 1.2rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle || '💡 Theoretical & Historical Background'}</h3>
          </div>
          <p style="font-size: 0.9rem; color: #334155; line-height: 1.6; margin: 0;">${customDescription}</p>
        </div>
        <p><br/></p>
      `;
    } else if (sectionType === 'exam_warning') {
      // Exam Warning Box
      generatedHtml = `
        <div class="colorful-warning my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid ${activeTheme.inlineStyle.borderColor}; padding-bottom: 0.5rem;">
            <span style="font-size: 1.25rem;">⚠️</span>
            <h3 style="margin: 0; font-family: Inter, system-ui, sans-serif; font-size: 1.2rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle || '⚠️ Common Exam Traps & Misconceptions'}</h3>
          </div>
          <p style="font-size: 0.9rem; color: #334155; line-height: 1.6; margin: 0;">${customDescription}</p>
        </div>
        <p><br/></p>
      `;
    } else {
      // Interactive Summary Box
      generatedHtml = `
        <div class="colorful-summary my-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl font-sans antialiased" style="background-color: ${activeTheme.inlineStyle.backgroundColor}; border-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color};">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid ${activeTheme.inlineStyle.borderColor}; padding-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">📝</span>
              <h3 style="margin: 0; font-family: Inter, system-ui, sans-serif; font-size: 1.2rem; font-weight: bold; color: ${activeTheme.inlineStyle.color};">${customTitle || '📝 Chapter Quick Revision Summary'}</h3>
            </div>
            <span style="font-size: 0.7rem; font-mono; font-weight: bold; background-color: ${activeTheme.inlineStyle.borderColor}; color: ${activeTheme.inlineStyle.color}; padding: 0.2rem 0.5rem; border-radius: 0.375rem;">Revision Module</span>
          </div>
          <p style="font-size: 0.9rem; color: #334155; line-height: 1.6; margin: 0;">${customDescription}</p>
        </div>
        <p><br/></p>
      `;
    }

    onInsertSection(generatedHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 font-sans space-y-5 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Insert Colorful Section / Lucid Module</h3>
              <p className="text-xs text-slate-500">Pick layout type and customize with 10 Lucid Light Themes with hover effects.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Section Type Picker Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
            1. Select Section Layout Type:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            
            <button
              onClick={() => {
                setSectionType('recommended_articles');
                setCustomTitle('Recommended Educational Articles');
                setCustomTag('NEXT UP IN SYLLABUS');
                setCustomDescription('Explore curated high-yield study guides and syllabus modules to strengthen your exam preparation.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'recommended_articles'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <div className="font-bold text-xs text-slate-900">Recommended Articles</div>
              <div className="text-[10px] text-slate-500">3-card syllabus module grid</div>
            </button>

            <button
              onClick={() => {
                setSectionType('educator_card');
                setCustomTitle('Prof. Aman Sharma');
                setCustomTag('LEAD CURATOR');
                setCustomDescription('Taught over 85,000+ engineers worldwide. Author of "Cracking the Code System Architecture" and former mentor at IIT Delhi Competitive Coding Circle.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'educator_card'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <div className="font-bold text-xs text-slate-900">Educator Highlight</div>
              <div className="text-[10px] text-slate-500">Author bio card with stats</div>
            </button>

            <button
              onClick={() => {
                setSectionType('key_takeaways');
                setCustomTitle('📌 Key Takeaways for IAS Aspirants');
                setCustomTag('CORE HIGHLIGHTS');
                setCustomDescription('Essential exam concepts, constitutional provisions, and key decision cases summarized for quick student revision.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'key_takeaways'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div className="font-bold text-xs text-slate-900">Key Takeaways Box</div>
              <div className="text-[10px] text-slate-500">Bullet points & exam tips</div>
            </button>

            <button
              onClick={() => {
                setSectionType('theory_context');
                setCustomTitle('💡 Historical & Theoretical Context');
                setCustomTag('THEORY NOTE');
                setCustomDescription('Detailed analytical overview, landmark precedents, and contextual framework for deep understanding.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'theory_context'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-sky-600" />
              <div className="font-bold text-xs text-slate-900">Theory Context</div>
              <div className="text-[10px] text-slate-500">Deep study background box</div>
            </button>

            <button
              onClick={() => {
                setSectionType('exam_warning');
                setCustomTitle('⚠️ Common Exam Traps & Misconceptions');
                setCustomTag('EXAM WARNING');
                setCustomDescription('Watch out for subtle negative marking traps, common formula mistakes, and confusing terminology.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'exam_warning'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <div className="font-bold text-xs text-slate-900">Exam Warning</div>
              <div className="text-[10px] text-slate-500">Cautionary study highlight</div>
            </button>

            <button
              onClick={() => {
                setSectionType('summary_box');
                setCustomTitle('📝 Chapter Quick Revision Module');
                setCustomTag('SUMMARY');
                setCustomDescription('Consolidated chapter notes, key equations, and memory flashcards for final revision before test day.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'summary_box'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Layers className="w-4 h-4 text-violet-600" />
              <div className="font-bold text-xs text-slate-900">Summary Module</div>
              <div className="text-[10px] text-slate-500">End-of-chapter recap</div>
            </button>

            <button
              onClick={() => {
                setSectionType('cheatsheet_cards');
                setCustomTitle('Formula & Complexity Cheat Sheet');
                setCustomTag('REVISION DECK');
                setCustomDescription('Tri-color pattern grid with space & time complexities for quick exam review.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'cheatsheet_cards'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Layout className="w-4 h-4 text-indigo-600" />
              <div className="font-bold text-xs text-slate-900">Cheat Sheet Grid</div>
              <div className="text-[10px] text-slate-500">Tri-card formula review</div>
            </button>

            <button
              onClick={() => {
                setSectionType('course_banner');
                setCustomTitle('Advanced Algorithms & System Design Masterclass');
                setCustomTag('SPECIALIZATION CERTIFICATION');
                setCustomDescription('Comprehensive cohort program with live faculty mentoring, peer code reviews, and mock interviews.');
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                sectionType === 'course_banner'
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <ArrowRight className="w-4 h-4 text-slate-800" />
              <div className="font-bold text-xs text-slate-900">Course Banner</div>
              <div className="text-[10px] text-slate-500">Dark gradient CTA banner</div>
            </button>

          </div>
        </div>

        {/* 2. Choose Lucid Light Color Theme (10 Themes) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between font-mono">
            <span>2. Choose Lucid Light Color Theme (10 Palettes):</span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Selected: {activeTheme.name}
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {LUCID_THEMES.map((theme) => {
              const isSelected = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  style={{
                    backgroundColor: theme.inlineStyle.backgroundColor,
                    borderColor: theme.inlineStyle.borderColor,
                    color: theme.inlineStyle.color,
                  }}
                  className={`p-2.5 rounded-2xl border text-center text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-1 ${
                    isSelected ? 'ring-2 ring-indigo-600 shadow-xs font-extrabold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: theme.inlineStyle.accentColor }}
                  />
                  <span className="text-[11px] truncate w-full">{theme.colorName}</span>
                  {isSelected && (
                    <span className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Section Content Customization */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
            3. Customize Text Content & Headers:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tag / Category Badge</label>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Main Body Text / Description</label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Lucid Hover Effect Preview:</span>
          <div
            style={{
              backgroundColor: activeTheme.inlineStyle.backgroundColor,
              borderColor: activeTheme.inlineStyle.borderColor,
              color: activeTheme.inlineStyle.color,
            }}
            className={`p-3.5 rounded-xl border text-xs ${activeTheme.hoverClass}`}
          >
            <span style={{ color: activeTheme.inlineStyle.accentColor }} className="font-bold text-[10px] uppercase block mb-0.5 font-mono">
              {customTag}
            </span>
            <h4 className="font-bold text-sm m-0 text-slate-900">{customTitle}</h4>
            <p className="text-xs m-0 mt-1 opacity-90">{customDescription}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateAndInsert}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Insert Colorful Section into Article</span>
          </button>
        </div>

      </div>
    </div>
  );
};
