import React, { useState } from 'react';
import { RelatedCourse, Quiz, QuizQuestion } from '../types';
import { 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  Award, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Sliders,
  Settings,
  Grid,
  Columns,
  List,
  Save,
  Check,
  X,
  PlusCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface CoursesAndQuizzesProps {
  courses: RelatedCourse[];
  quizzes: Quiz[];
  onUpdateCourses?: (courses: RelatedCourse[]) => void;
  onUpdateQuizzes?: (quizzes: Quiz[]) => void;
  initialTab?: 'courses' | 'quizzes';
}

interface ContainerSettings {
  gridCols: number; // 1, 2, 3, or 4
  displayLimit: number; // 3, 5, 8, 10, 0 (0 = all)
  kickerText: string;
  titleText: string;
  subtitleText: string;
  ctaText: string;
  isContainerHidden: boolean;
  hiddenItemIds: string[];
}

export const CoursesAndQuizzes: React.FC<CoursesAndQuizzesProps> = ({
  courses,
  quizzes,
  onUpdateCourses,
  onUpdateQuizzes,
  initialTab = 'courses',
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'quizzes'>(initialTab);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Container Management State for Courses / Test Series
  const [courseContainerSettings, setCourseContainerSettings] = useState<ContainerSettings>({
    gridCols: 3,
    displayLimit: 0,
    kickerText: 'TestPrime Test Series Hub',
    titleText: 'Courses, Test Series & Practice Modules',
    subtitleText: 'Integrated interactive study materials linked directly with educational articles for seamless learning.',
    ctaText: 'Explore Course',
    isContainerHidden: false,
    hiddenItemIds: [],
  });

  // Container Management State for Quizzes
  const [quizContainerSettings, setQuizContainerSettings] = useState<ContainerSettings>({
    gridCols: 2,
    displayLimit: 0,
    kickerText: 'TestPrime MCQ Portal',
    titleText: 'Interactive Practice Quizzes & Mock Tests',
    subtitleText: 'Test your knowledge with instant evaluation, detailed explanations, and score tracking.',
    ctaText: 'Attempt Practice Quiz',
    isContainerHidden: false,
    hiddenItemIds: [],
  });

  const [showContainerSettingsModal, setShowContainerSettingsModal] = useState(false);

  // CRUD Modals State
  const [editingCourse, setEditingCourse] = useState<RelatedCourse | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);
  
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isNewQuiz, setIsNewQuiz] = useState(false);

  const activeSettings = activeTab === 'courses' ? courseContainerSettings : quizContainerSettings;
  const setSettings = activeTab === 'courses' ? setCourseContainerSettings : setQuizContainerSettings;

  // Option select in active quiz
  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers({ ...userAnswers, [qId]: optIdx });
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correct += 1;
      }
    });
    return Math.round((correct / activeQuiz.questions.length) * 100);
  };

  // Toggle card visibility (hide/unhide)
  const toggleItemVisibility = (id: string) => {
    const isHidden = activeSettings.hiddenItemIds.includes(id);
    const updatedHidden = isHidden
      ? activeSettings.hiddenItemIds.filter((hId) => hId !== id)
      : [...activeSettings.hiddenItemIds, id];
    setSettings({ ...activeSettings, hiddenItemIds: updatedHidden });
  };

  // Delete Course
  const handleDeleteCourse = (id: string) => {
    if (!confirm('Are you sure you want to delete this course from the portal?')) return;
    const updated = courses.filter((c) => c.id !== id);
    if (onUpdateCourses) onUpdateCourses(updated);
  };

  // Delete Quiz
  const handleDeleteQuiz = (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz from the portal?')) return;
    const updated = quizzes.filter((q) => q.id !== id);
    if (onUpdateQuizzes) onUpdateQuizzes(updated);
    if (activeQuiz?.id === id) setActiveQuiz(null);
  };

  // Save Course (Create / Edit)
  const handleSaveCourse = (course: RelatedCourse) => {
    if (isNewCourse) {
      const updated = [course, ...courses];
      if (onUpdateCourses) onUpdateCourses(updated);
    } else {
      const updated = courses.map((c) => (c.id === course.id ? course : c));
      if (onUpdateCourses) onUpdateCourses(updated);
    }
    setEditingCourse(null);
  };

  // Save Quiz (Create / Edit)
  const handleSaveQuiz = (quiz: Quiz) => {
    if (isNewQuiz) {
      const updated = [quiz, ...quizzes];
      if (onUpdateQuizzes) onUpdateQuizzes(updated);
    } else {
      const updated = quizzes.map((q) => (q.id === quiz.id ? quiz : q));
      if (onUpdateQuizzes) onUpdateQuizzes(updated);
    }
    setEditingQuiz(null);
  };

  // Filter items based on display limit and hidden items (or show hidden in admin mode)
  const visibleCourses = courses.slice(0, activeSettings.displayLimit > 0 ? activeSettings.displayLimit : undefined);
  const visibleQuizzes = quizzes.slice(0, activeSettings.displayLimit > 0 ? activeSettings.displayLimit : undefined);

  // Dynamic Grid Class mapping
  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  return (
    <div className="h-full flex-1 overflow-y-auto max-w-7xl mx-auto p-4 lg:p-8 space-y-6 font-sans w-full">
      
      {/* Top Banner & Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 flex-shrink-0" />
            <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider font-mono min-w-0 truncate">
              {activeSettings.kickerText}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mt-1 min-w-0 break-words">
            {activeSettings.titleText}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl min-w-0 break-words">
            {activeSettings.subtitleText}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-shrink-0 flex-wrap">
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 flex-shrink-0">
            <button
              onClick={() => { setActiveTab('courses'); setActiveQuiz(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 flex-shrink-0 ${
                activeTab === 'courses' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test Series ({courses.length})
            </button>
            <button
              onClick={() => { setActiveTab('quizzes'); setActiveQuiz(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 flex-shrink-0 ${
                activeTab === 'quizzes' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Quizzes ({quizzes.length})
            </button>
          </div>

          {/* Container Controls Button */}
          <button
            onClick={() => setShowContainerSettingsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shrink-0 flex-shrink-0"
            title="Manage Container Grid Size, Item Limit, Header Text & Hide/Unhide Options"
          >
            <Settings className="w-4 h-4 text-indigo-600 shrink-0 flex-shrink-0" />
            <span>Container Settings</span>
          </button>

          {/* Add New Item Button */}
          {activeTab === 'courses' ? (
            <button
              onClick={() => {
                setIsNewCourse(true);
                setEditingCourse({
                  id: `course-${Date.now()}`,
                  title: 'New Specialization Course',
                  category: 'Computer Science',
                  price: '₹999',
                  rating: 4.9,
                  studentsCount: 1200,
                  thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                  linkUrl: '#course-new',
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex-shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0 flex-shrink-0" />
              <span>Add Course</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsNewQuiz(true);
                setEditingQuiz({
                  id: `quiz-${Date.now()}`,
                  title: 'New Subject Practice Quiz',
                  subject: 'Computer Science',
                  timeLimitMinutes: 10,
                  totalQuestions: 2,
                  questions: [
                    {
                      id: 'q1',
                      question: 'What is the primary advantage of indexing in database query performance?',
                      options: ['Reduces storage space', 'Accelerates data retrieval speeds', 'Prevents table locks', 'Encrypts user passwords'],
                      correctAnswerIndex: 1,
                      explanation: 'B-tree indexes enable log-time lookups without scanning all rows.'
                    }
                  ]
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex-shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0 flex-shrink-0" />
              <span>Add Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Container Hidden Notice */}
      {activeSettings.isContainerHidden && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <EyeOff className="w-4 h-4 text-amber-600 shrink-0 flex-shrink-0" />
            <span className="min-w-0 break-words">
              <strong>Container Hidden:</strong> This {activeTab === 'courses' ? 'Test Series' : 'Quizzes'} section is currently hidden from public readers. Click <strong>Container Settings</strong> to unhide.
            </span>
          </div>
          <button
            onClick={() => setSettings({ ...activeSettings, isContainerHidden: false })}
            className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors text-[11px] shrink-0 flex-shrink-0"
          >
            Unhide Section
          </button>
        </div>
      )}

      {/* Main Container Content */}
      {!activeSettings.isContainerHidden && (
        <>
          {/* Courses Showcase Grid */}
          {activeTab === 'courses' && (
            <div className={`grid ${getGridColsClass(activeSettings.gridCols)} gap-6`}>
              {visibleCourses.map((course) => {
                const isHidden = activeSettings.hiddenItemIds.includes(course.id);
                return (
                  <div 
                    key={course.id} 
                    className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group ${
                      isHidden ? 'opacity-60 border-dashed border-amber-300 bg-amber-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative overflow-hidden">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 text-[10px] uppercase font-bold text-indigo-700 tracking-wider bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-indigo-200 shadow-xs">
                          {course.category}
                        </span>

                        {/* Admin Action Bar on Card Hover */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs">
                          <button
                            onClick={() => toggleItemVisibility(course.id)}
                            className={`p-1 rounded-lg transition-colors ${
                              isHidden ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                            }`}
                            title={isHidden ? 'Unhide Course for Readers' : 'Hide Course from Readers'}
                          >
                            {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setIsNewCourse(false);
                              setEditingCourse(course);
                            }}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Course Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        {isHidden && (
                          <span className="inline-block text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md mb-1">
                            Hidden from students
                          </span>
                        )}
                        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-1">
                          <span className="flex items-center gap-1 font-semibold text-amber-500">⭐ {course.rating}</span>
                          <span>·</span>
                          <span>{course.studentsCount.toLocaleString()} Enrolled</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
                      <span className="text-lg font-bold text-slate-900 font-mono">{course.price}</span>
                      <a
                        href={course.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>{activeSettings.ctaText || 'Explore Course'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Quiz Taker / Grid */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {!activeQuiz ? (
                <div className={`grid ${getGridColsClass(activeSettings.gridCols)} gap-6`}>
                  {visibleQuizzes.map((quiz) => {
                    const isHidden = activeSettings.hiddenItemIds.includes(quiz.id);
                    return (
                      <div 
                        key={quiz.id} 
                        className={`bg-white border hover:border-indigo-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between ${
                          isHidden ? 'opacity-60 border-dashed border-amber-300 bg-amber-50/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">{quiz.subject}</span>
                            
                            <div className="flex items-center gap-1.5">
                              {isHidden && (
                                <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                                  Hidden
                                </span>
                              )}
                              <button
                                onClick={() => toggleItemVisibility(quiz.id)}
                                className="p-1 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"
                                title={isHidden ? 'Unhide Quiz' : 'Hide Quiz'}
                              >
                                {isHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => {
                                  setIsNewQuiz(false);
                                  setEditingQuiz(quiz);
                                }}
                                className="p-1 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"
                                title="Edit Quiz"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz.id)}
                                className="p-1 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                                title="Delete Quiz"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{quiz.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-mono">{quiz.totalQuestions} Questions • {quiz.timeLimitMinutes} Mins Limit</p>
                          </div>
                        </div>

                        <button
                          onClick={() => { setActiveQuiz(quiz); setUserAnswers({}); setIsQuizSubmitted(false); }}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                        >
                          <span>{activeSettings.ctaText || 'Attempt Practice Quiz'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Active Quiz Taker Screen */
                <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">{activeQuiz.subject} Quiz</span>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activeQuiz.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Exit Quiz
                    </button>
                  </div>

                  {/* Quiz Questions List */}
                  <div className="space-y-6">
                    {activeQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          Q{idx + 1}. {q.question}
                        </h4>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswers[q.id] === optIdx;
                            const isCorrect = q.correctAnswerIndex === optIdx;
                            let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-indigo-50/50 hover:border-indigo-300';

                            if (isQuizSubmitted) {
                              if (isCorrect) optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                              else if (isSelected) optionStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                            } else if (isSelected) {
                              optionStyle = 'bg-indigo-600 text-white font-semibold border-indigo-600 shadow-xs';
                            }

                            return (
                              <div
                                key={optIdx}
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${optionStyle}`}
                              >
                                <span className="font-mono mr-2">({String.fromCharCode(65 + optIdx)})</span>
                                {opt}
                              </div>
                            );
                          })}
                        </div>

                        {isQuizSubmitted && (
                          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-950 leading-relaxed">
                            <strong className="text-indigo-800 font-semibold">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit / Results Bar */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    {!isQuizSubmitted ? (
                      <button
                        onClick={() => setIsQuizSubmitted(true)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Submit Quiz Answers
                      </button>
                    ) : (
                      <div className="w-full p-5 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-center space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">Quiz Completed!</h4>
                        <p className="text-base font-bold text-indigo-600 font-mono">Your Score: {calculateScore()}%</p>
                        <button
                          onClick={() => { setUserAnswers({}); setIsQuizSubmitted(false); }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl mt-2 transition-colors"
                        >
                          Retry Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* CONTAINER SETTINGS MODAL */}
      {showContainerSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 font-sans space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  Manage {activeTab === 'courses' ? 'Test Series' : 'Quizzes'} Container
                </h3>
              </div>
              <button onClick={() => setShowContainerSettingsModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* Grid Layout Size */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Container Grid Layout (Columns):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setSettings({ ...activeSettings, gridCols: cols })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      activeSettings.gridCols === cols
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cols} {cols === 1 ? 'Column' : 'Cols'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Limit Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Maximum Cards to Display:
              </label>
              <div className="flex flex-wrap gap-2">
                {[3, 5, 8, 10, 0].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => setSettings({ ...activeSettings, displayLimit: limit })}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      activeSettings.displayLimit === limit
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {limit === 0 ? 'Show All Cards' : `Max ${limit} Cards`}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Header & Labels Text Editing */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Edit Container Text & Headings:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section Main Title</label>
                  <input
                    type="text"
                    value={activeSettings.titleText}
                    onChange={(e) => setSettings({ ...activeSettings, titleText: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kicker Badge Tag</label>
                  <input
                    type="text"
                    value={activeSettings.kickerText}
                    onChange={(e) => setSettings({ ...activeSettings, kickerText: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subtitle / Summary Text</label>
                <input
                  type="text"
                  value={activeSettings.subtitleText}
                  onChange={(e) => setSettings({ ...activeSettings, subtitleText: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">CTA Action Button Text</label>
                <input
                  type="text"
                  value={activeSettings.ctaText}
                  onChange={(e) => setSettings({ ...activeSettings, ctaText: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Container Visibility Toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 block">Container Visibility</label>
                <span className="text-[11px] text-slate-500">Show or hide this entire container section in portal</span>
              </div>
              <button
                onClick={() => setSettings({ ...activeSettings, isContainerHidden: !activeSettings.isContainerHidden })}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeSettings.isContainerHidden
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {activeSettings.isContainerHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{activeSettings.isContainerHidden ? 'Section Hidden' : 'Section Visible'}</span>
              </button>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowContainerSettingsModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save & Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE COURSE MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 font-sans space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {isNewCourse ? 'Add New Course / Test Series' : 'Edit Course Details'}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (e.g. 4.9)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingCourse.rating}
                    onChange={(e) => setEditingCourse({ ...editingCourse, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enrolled Students</label>
                  <input
                    type="number"
                    value={editingCourse.studentsCount}
                    onChange={(e) => setEditingCourse({ ...editingCourse, studentsCount: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingCourse.thumbnail}
                  onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCourse(editingCourse)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE QUIZ MODAL */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 font-sans space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {isNewQuiz ? 'Add New Practice Quiz' : 'Edit Quiz & Questions'}
              </h3>
              <button onClick={() => setEditingQuiz(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={editingQuiz.title}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingQuiz.subject}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, subject: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Limit (Mins)</label>
                  <input
                    type="number"
                    value={editingQuiz.timeLimitMinutes}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, timeLimitMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* Questions List Editor */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Questions ({editingQuiz.questions.length}):
                  </label>
                  <button
                    onClick={() => {
                      const newQ: QuizQuestion = {
                        id: `q-${Date.now()}`,
                        question: 'Enter your new multiple choice question here...',
                        options: ['Option A', 'Option B', 'Option C', 'Option D'],
                        correctAnswerIndex: 0,
                        explanation: 'Add detailed explanation for why this answer is correct.',
                      };
                      setEditingQuiz({
                        ...editingQuiz,
                        totalQuestions: editingQuiz.questions.length + 1,
                        questions: [...editingQuiz.questions, newQ],
                      });
                    }}
                    className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {editingQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-600 font-mono">Q{idx + 1}</span>
                        <button
                          onClick={() => {
                            const updatedQ = editingQuiz.questions.filter((item) => item.id !== q.id);
                            setEditingQuiz({
                              ...editingQuiz,
                              totalQuestions: updatedQ.length,
                              questions: updatedQ,
                            });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const updated = editingQuiz.questions.map((item) => item.id === q.id ? { ...item, question: e.target.value } : item);
                          setEditingQuiz({ ...editingQuiz, questions: updated });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                        placeholder="Question text..."
                      />

                      <div className="grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswerIndex === optIdx}
                              onChange={() => {
                                const updated = editingQuiz.questions.map((item) => item.id === q.id ? { ...item, correctAnswerIndex: optIdx } : item);
                                setEditingQuiz({ ...editingQuiz, questions: updated });
                              }}
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...q.options];
                                newOpts[optIdx] = e.target.value;
                                const updated = editingQuiz.questions.map((item) => item.id === q.id ? { ...item, options: newOpts } : item);
                                setEditingQuiz({ ...editingQuiz, questions: updated });
                              }}
                              className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingQuiz(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveQuiz(editingQuiz)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
