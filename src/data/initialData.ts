import { Article, RelatedCourse, Quiz } from '../types';

export const initialCourses: RelatedCourse[] = [
  {
    id: 'course-1',
    title: 'System Design & Distributed Systems Masterclass',
    category: 'Computer Science',
    price: '₹1,499',
    rating: 4.9,
    studentsCount: 14200,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    linkUrl: '#course-[#course-system-design]'
  },
  {
    id: 'course-2',
    title: 'Complete General Science & Tech Practice Series',
    category: 'Engineering & Tech',
    price: '₹799',
    rating: 4.8,
    studentsCount: 9800,
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    linkUrl: '#course-science'
  },
  {
    id: 'course-3',
    title: 'Algorithms, Data Structures & CSAT 2026',
    category: 'Core Engineering',
    price: '₹999',
    rating: 4.7,
    studentsCount: 18500,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    linkUrl: '#course-dsa'
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Fundamental Architecture & Systems Quick Test',
    subject: 'System Architecture',
    timeLimitMinutes: 10,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        question: 'Which component in a distributed system provides consistent hashing and load balance across cache nodes?',
        options: ['Reverse Proxy', 'API Gateway', 'Consistent Hash Ring', 'Message Queue'],
        correctAnswerIndex: 2,
        explanation: 'A consistent hash ring minimizes key remapping when cache nodes are added or removed.'
      },
      {
        id: 'q2',
        question: 'Which database isolation level prevents non-repeatable reads and phantom reads completely?',
        options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'],
        correctAnswerIndex: 2,
        explanation: 'Serializable is the highest isolation level, enforcing total ordering of transactions.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Environmental Ecology & Climate Tech MCQs',
    subject: 'Environment',
    timeLimitMinutes: 15,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary objective of the Ramsar Convention?',
        options: ['Ozone Layer Protection', 'Conservation of Wetlands', 'Prevention of Nuclear Waste', 'Biodiversity Hotspots'],
        correctAnswerIndex: 1,
        explanation: 'The Ramsar Convention (1971) is an international treaty for the conservation and sustainable utilization of wetlands.'
      }
    ]
  }
];

export const initialArticles: Article[] = [
  {
    id: 'article-1',
    title: 'Mastering System Architecture: Consistent Hashing & Distributed Cache',
    subtitle: 'A deep dive into distributed systems engineering for senior developers and competitive tech aspirants.',
    category: 'Theory Notes',
    status: 'Published',
    author: 'Prof. Aman Sharma',
    language: 'English',
    createdAt: '2026-10-20',
    updatedAt: '2026-10-25',
    viewsCount: 3420,
    readTimeMinutes: 7,
    lucidThemeId: 'indigo',
    contentHtml: `
      <h2>Introduction to Distributed System Architecture</h2>
      <p>Building high-throughput, low-latency web services requires robust load distribution, caching strategies, and fail-safe partitioning techniques.</p>
      
      <div class="callout-box bg-indigo-50 border-l-4 border-indigo-600 p-4 my-4 rounded-r-xl shadow-xs">
        <h4 class="font-bold text-indigo-950 text-base">📌 Key Architectural Principle</h4>
        <p class="text-indigo-900 text-sm leading-relaxed">Consistent Hashing ensures that when a server node is added or removed from a cache cluster, only k/n keys need to be remapped on average.</p>
      </div>

      <!-- Lucid Educator Bio Highlight Card -->
      <div class="colorful-educator-card my-8 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg font-sans antialiased" style="background-color: #f5f3ff; border-color: #c7d2fe; color: #1e1b4b;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 72px; height: 72px; border-radius: 1rem; background: linear-gradient(135deg, #4f46e5, #0f172a); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.75rem; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              👨‍💻
            </div>
            <div>
              <h3 style="margin: 0; font-sans font-bold; font-size: 1.25rem; font-weight: 700; color: #0f172a;">Prof. Aman Sharma</h3>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; font-family: sans-serif; color: #4f46e5; font-weight: 600;">
                Head of Computer Science Curriculum • EduForge Academy
              </p>
              <p style="margin: 0.375rem 0 0 0; font-size: 0.85rem; font-family: sans-serif; color: #475569; max-width: 520px;">
                Taught over 85,000+ engineers worldwide. Author of "Cracking the Code System Architecture" and former mentor at IIT Delhi Competitive Coding Circle.
              </p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: 0.5rem; font-family: sans-serif;">
            <button style="background-color: #0f172a; color: #ffffff; border: none; padding: 0.5rem 1.25rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.8rem; cursor: pointer;">
              + Follow Educator
            </button>
            <div style="font-size: 0.75rem; color: #64748b; text-align: right;">
              <strong>42</strong> Published Articles • <strong>4.95 ⭐</strong> Student Rating
            </div>
          </div>
        </div>
      </div>

      <h3>Core Components of Scalable Systems</h3>
      <ol>
        <li><strong>Consistent Hash Ring:</strong> Distributes traffic uniformly without recalculating all keys on node churn.</li>
        <li><strong>API Gateway & Rate Limiting:</strong> Manages authentication, token bucket throttling, and circuit breakers.</li>
        <li><strong>Distributed Caching (Redis Cluster):</strong> Offloads DB read queries with sub-millisecond retrieval times.</li>
        <li><strong>Asynchronous Message Queues (Kafka):</strong> Decouples write paths and supports event-driven microservices.</li>
      </ol>

      <!-- Lucid 3-Card Recommended Educational Articles Module -->
      <div class="colorful-section my-8 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg font-sans antialiased" style="background-color: #f8fafc; border-color: #e2e8f0; color: #0f172a;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem;">
          <div>
            <span style="font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #4f46e5;">NEXT UP IN SYLLABUS</span>
            <h3 style="margin: 0.25rem 0 0 0; font-size: 1.35rem; font-weight: 700; color: #0f172a;">Recommended Educational Articles</h3>
          </div>
          <a href="#articles" style="font-size: 0.8rem; font-weight: 600; color: #4f46e5; text-decoration: none;">
            View All Study Guides →
          </a>
        </div>

        <p style="font-size: 0.875rem; color: #475569; margin-bottom: 1.25rem; line-height: 1.5;">Explore curated high-yield study guides and syllabus modules to strengthen your technical foundation.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
          
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column;" class="hover:shadow-md hover:-translate-y-1">
            <div style="height: 120px; background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); position: relative; padding: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
              <span style="background-color: rgba(255,255,255,0.95); font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #1e1b4b;">Algorithms & Data Structures</span>
              <span style="background-color: rgba(0,0,0,0.6); color: #ffffff; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">9 min read</span>
            </div>
            <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 0.7rem; color: #4f46e5; font-weight: 700;">Core Concept • Intermediate</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.375rem 0 0.5rem 0;">Mastering Dynamic Programming: Memoization vs Tabulation</h4>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                <span>Prof. Aman Sharma</span>
                <span style="color: #4f46e5; font-weight: 700;">→</span>
              </div>
            </div>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column;" class="hover:shadow-md hover:-translate-y-1">
            <div style="height: 120px; background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); position: relative; padding: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
              <span style="background-color: rgba(255,255,255,0.95); font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #3b0764;">Artificial Intelligence</span>
              <span style="background-color: rgba(0,0,0,0.6); color: #ffffff; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">14 min read</span>
            </div>
            <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 0.7rem; color: #7c3aed; font-weight: 700;">Must Read • Advanced</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.375rem 0 0.5rem 0;">Complete Guide to Transformer Architecture & Attention Mechanisms</h4>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                <span>Dr. Evelyn Vance</span>
                <span style="color: #7c3aed; font-weight: 700;">→</span>
              </div>
            </div>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column;" class="hover:shadow-md hover:-translate-y-1">
            <div style="height: 120px; background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); position: relative; padding: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
              <span style="background-color: rgba(255,255,255,0.95); font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #0c4a6e;">System Architecture</span>
              <span style="background-color: rgba(0,0,0,0.6); color: #ffffff; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">7 min read</span>
            </div>
            <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 0.7rem; color: #0284c7; font-weight: 700;">Interview Prep • Intermediate</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.375rem 0 0.5rem 0;">System Design 101: Understanding Consistent Hashing & Distributed Caching</h4>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                <span>Kunal Verma</span>
                <span style="color: #0284c7; font-weight: 700;">→</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <p>Engineers should practice designing distributed cache topologies and benchmarking throughput under peak traffic loads.</p>
    `,
    contentText: `Introduction to Distributed System Architecture... Building high-throughput, low-latency web services...`,
    seo: {
      metaTitle: 'System Architecture: Consistent Hashing & Distributed Cache | Engineering Notes',
      metaDescription: 'Comprehensive guide on consistent hashing, Redis caching, rate limiting, and system design for engineers.',
      keywords: ['System Design', 'Consistent Hashing', 'Distributed Systems', 'Redis Cache', 'High Availability'],
      canonicalSlug: 'mastering-system-architecture-consistent-hashing-distributed-cache',
      targetAudience: 'Software Engineers & Computer Science Students',
      seoScore: 94,
      tips: ['Great keyword distribution across H2 and H3 tags', 'Optimal meta description length (155 characters)']
    },
    plagiarism: {
      originalityScore: 98,
      plagiarismDetected: false,
      flaggedSegments: [],
      matchedSources: [
        { domain: 'system-design-reference.org', similarity: '1.2%', excerpt: 'Standard technical terms' }
      ],
      academicToneScore: 96,
      aiProbabilityScore: 6,
      feedback: 'Excellent technical tone. High originality with precise architectural analysis.'
    },
    readability: {
      score: 88,
      readingLevel: 'Grade 10 - Standard Educational',
      fleschReadingEase: 72.5,
      avgSentenceLength: '13 words',
      complexWordsCount: 22,
      passiveVoicePercentage: '4%',
      readingTimeMinutes: 7,
      suggestions: [
        'Excellent paragraph breaks.',
        'Consider using bullet points for component breakdown (already implemented).'
      ]
    },
    attachedCourseIds: ['course-1'],
    versionHistory: [
      {
        id: 'v3',
        timestamp: '2026-10-25 14:30',
        title: 'Mastering System Architecture (Final Review)',
        wordCount: 420,
        summary: 'Added Callout box for Key Architectural Principle and refined distributed cache details.',
        savedBy: 'Prof. Aman Sharma',
        contentSnapshot: `
          <h2>Introduction to Distributed System Architecture</h2>
          <p>Building high-throughput, low-latency web services requires robust load distribution and caching strategies.</p>
          <div class="callout-box bg-indigo-50 border-l-4 border-indigo-600 p-4 my-4 rounded-r-lg">
            <h4 class="font-bold text-indigo-950">Key Takeaway</h4>
            <p class="text-indigo-900 text-sm">Consistent Hashing ensures minimal key remapping during server node churn.</p>
          </div>
          <h3>Core Components of Scalable Systems</h3>
          <ol>
            <li><strong>Consistent Hash Ring:</strong> Distributes traffic uniformly.</li>
            <li><strong>API Gateway:</strong> Manages authentication and rate limiting.</li>
            <li><strong>Distributed Caching:</strong> Offloads DB queries.</li>
          </ol>
        `
      }
    ]
  },
  {
    id: 'article-2',
    title: 'Editorial: The Future of Renewable Energy Integration in Modern Smart Grids',
    subtitle: 'Analyzing battery storage tech, solar rooftop incentives, and grid stability challenges heading into 2030.',
    category: 'Editorial',
    status: 'Published',
    author: 'Meera Deshmukh',
    language: 'English',
    createdAt: '2026-10-22',
    updatedAt: '2026-10-26',
    viewsCount: 2150,
    readTimeMinutes: 5,
    lucidThemeId: 'emerald',
    coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    contentHtml: `
      <h2>The Green Energy Transition Shift</h2>
      <p>India's ambitious target of achieving 500 GW of non-fossil energy capacity by 2030 requires revolutionary changes in grid management and energy storage solutions.</p>
      
      <h3>Key Challenges</h3>
      <ul>
        <li>Intermittency of solar and wind energy production.</li>
        <li>High capital expenditure for Battery Energy Storage Systems (BESS).</li>
        <li>Distribution company (DISCOM) financial restructuring.</li>
      </ul>
    `,
    contentText: `The Green Energy Transition Shift... India's ambitious target...`,
    seo: {
      metaTitle: 'Editorial: India Renewable Energy Grid Integration & Challenges 2030',
      metaDescription: 'In-depth editorial on India renewable energy goals, battery storage systems, DISCOM challenges, and clean energy transition policies.',
      keywords: ['Renewable Energy India', 'Solar Power Grid', 'BESS Storage', 'DISCOM Reforms', 'Editorial Analysis'],
      canonicalSlug: 'future-renewable-energy-integration-india',
      targetAudience: 'Economics & Environment Students, Current Affairs Readers',
      seoScore: 89,
      tips: ['Meta description is well formulated', 'Consider adding relevant statistics image']
    },
    plagiarism: {
      originalityScore: 98,
      plagiarismDetected: false,
      flaggedSegments: [],
      matchedSources: [],
      academicToneScore: 92,
      aiProbabilityScore: 10,
      feedback: 'Original editorial opinion with strong analytical structure.'
    },
    readability: {
      score: 82,
      readingLevel: 'Grade 11 - Advanced Secondary',
      fleschReadingEase: 65.0,
      avgSentenceLength: '15 words',
      complexWordsCount: 30,
      passiveVoicePercentage: '7%',
      readingTimeMinutes: 5,
      suggestions: ['Clear transitions between economic data and policy analysis.']
    },
    attachedCourseIds: ['course-2'],
    versionHistory: []
  }
];
