import React from 'react';
import { RelatedCourse } from '../types';
import { GraduationCap, Plus, Check, ExternalLink } from 'lucide-react';

interface CourseIntegrationPanelProps {
  availableCourses: RelatedCourse[];
  attachedCourseIds: string[];
  onToggleAttach: (courseId: string) => void;
}

export const CourseIntegrationPanel: React.FC<CourseIntegrationPanelProps> = ({
  availableCourses,
  attachedCourseIds,
  onToggleAttach,
}) => {
  return (
    <div className="space-y-6 text-slate-800 font-sans min-w-0">
      
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs min-w-0">
        <div className="flex items-center gap-2 mb-1 min-w-0">
          <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0 flex-shrink-0" />
          <h4 className="font-bold text-sm text-white min-w-0 truncate">Course & Test Series Integration</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed min-w-0 break-words">
          Link relevant test series or courses to this article. Readers can seamlessly enroll or attempt practice quizzes while reading notes.
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-3 min-w-0">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          Available Test Series ({availableCourses.length})
        </h4>

        {availableCourses.map((course) => {
          const isAttached = attachedCourseIds.includes(course.id);
          return (
            <div
              key={course.id}
              className={`p-3.5 border rounded-2xl transition-all flex flex-col gap-2.5 min-w-0 ${
                isAttached ? 'border-indigo-500 bg-indigo-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono block truncate">{course.category}</span>
                  <h5 className="text-xs font-bold text-slate-900 truncate min-w-0">{course.title}</h5>
                  <p className="text-[11px] text-slate-500 font-mono min-w-0 truncate">{course.price} • ⭐ {course.rating} ({course.studentsCount.toLocaleString()} Students)</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 min-w-0">
                <a
                  href={course.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 min-w-0 truncate"
                >
                  <ExternalLink className="w-3 h-3 shrink-0 flex-shrink-0" />
                  <span className="min-w-0 truncate">Preview Course</span>
                </a>

                <button
                  onClick={() => onToggleAttach(course.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 flex-shrink-0 transition-all ${
                    isAttached
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isAttached ? (
                    <>
                      <Check className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
                      <span>Attached</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
                      <span>Attach to Article</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
