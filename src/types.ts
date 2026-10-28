export type ArticleCategory = 
  | 'News Article' 
  | 'Editorial' 
  | 'Theory Notes' 
  | 'Quiz Article' 
  | 'Exam Strategy';

export type ArticleStatus = 'Draft' | 'In Review' | 'Published';

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalSlug: string;
  targetAudience: string;
  seoScore: number;
  tips: string[];
  customCategories?: string[];
  tags?: string[];
}

export interface PlagiarismResult {
  originalityScore: number;
  plagiarismDetected: boolean;
  flaggedSegments: Array<{
    text: string;
    reason: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  matchedSources: Array<{
    domain: string;
    similarity: string;
    excerpt: string;
  }>;
  academicToneScore: number;
  aiProbabilityScore: number;
  feedback: string;
  lastCheckedAt?: string;
}

export interface ReadabilityResult {
  score: number;
  readingLevel: string;
  fleschReadingEase: number;
  avgSentenceLength: string;
  complexWordsCount: number;
  passiveVoicePercentage: string;
  readingTimeMinutes: number;
  suggestions: string[];
  lastAnalyzedAt?: string;
}

export interface RelatedCourse {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  studentsCount: number;
  thumbnail: string;
  linkUrl: string;
}

export interface ArticleVersion {
  id: string;
  timestamp: string;
  title: string;
  wordCount: number;
  summary: string;
  savedBy: string;
  contentSnapshot: string;
}

export interface TypographySettings {
  bodyFontFamily: string;
  headingFontFamily: string;
  globalFontSize: string; // e.g., '14px', '16px', '18px', '20px'
  lineHeight: string; // e.g., '1.6', '1.8'
}

export interface ArticleComment {
  id: string;
  authorName: string;
  text: string;
  rating: number; // 1-5
  timestamp: string;
  likes: number;
  educatorReply?: string;
  approved: boolean;
}

export interface ArticleRating {
  averageRating: number;
  totalVotes: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  category: ArticleCategory;
  status: ArticleStatus;
  contentHtml: string;
  contentText: string;
  author: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  readTimeMinutes: number;
  coverImage?: string;
  seo: SeoData;
  plagiarism?: PlagiarismResult;
  readability?: ReadabilityResult;
  attachedCourseIds: string[];
  versionHistory: ArticleVersion[];
  lucidThemeId?: string;
  typographySettings?: TypographySettings;
  comments?: ArticleComment[];
  rating?: ArticleRating;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface PrintWatermarkConfig {
  enabled: boolean;
  text: string;
  pattern: 'diagonal_grid' | 'center_single' | 'header_footer';
  opacity: number;
  fontSize: number;
  color: string;
  rotation: number;
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  density: 'compact' | 'normal' | 'sparse';
}

export interface PrintLayoutConfig {
  printFont: 'serif' | 'sans' | 'mono';
  fontSizeScale: 'normal' | 'large' | 'compact';
  breakBeforeH2: boolean;
  includeMetaHeader: boolean;
  includeSeoTags: boolean;
  includeFooterDisclaimer: boolean;
  customHeaderNote?: string;
  customFooterNote?: string;
  pageSelection: 'all' | 'first_only' | 'custom';
  customPageRange?: string; // e.g. "1, 3-5"
}


