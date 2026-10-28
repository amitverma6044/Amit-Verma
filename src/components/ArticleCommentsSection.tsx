import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, CheckCircle, Trash2, Reply, Send, ShieldAlert, Award } from 'lucide-react';
import { ArticleComment, ArticleRating } from '../types';

interface ArticleCommentsSectionProps {
  comments?: ArticleComment[];
  rating?: ArticleRating;
  onAddComment: (comment: Omit<ArticleComment, 'id' | 'timestamp' | 'likes' | 'approved'>) => void;
  onLikeComment?: (commentId: string) => void;
  onAdminReply?: (commentId: string, replyText: string) => void;
  onAdminDeleteComment?: (commentId: string) => void;
  onAdminToggleApprove?: (commentId: string) => void;
  isAdmin?: boolean;
}

export const ArticleCommentsSection: React.FC<ArticleCommentsSectionProps> = ({
  comments = [],
  rating = {
    averageRating: 4.8,
    totalVotes: 24,
    breakdown: { 5: 18, 4: 4, 3: 2, 2: 0, 1: 0 },
  },
  onAddComment,
  onLikeComment,
  onAdminReply,
  onAdminDeleteComment,
  onAdminToggleApprove,
  isAdmin = true,
}) => {
  const [newAuthor, setNewAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'highest' | 'recent'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newCommentText.trim()) return;

    onAddComment({
      authorName: newAuthor.trim(),
      text: newCommentText.trim(),
      rating: newRating,
    });

    setNewAuthor('');
    setNewCommentText('');
    setNewRating(5);
  };

  const handleAdminReplySubmit = (commentId: string) => {
    if (!replyInput.trim() || !onAdminReply) return;
    onAdminReply(commentId, replyInput.trim());
    setReplyInput('');
    setReplyingCommentId(null);
  };

  const filteredComments = comments.filter((c) => (isAdmin ? true : c.approved));

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (filterMode === 'highest') return b.rating - a.rating;
    return 0; // default recent
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 my-8 shadow-xs font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Student Reviews & Discussion
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Read authentic ratings, ask questions, and share notes with fellow educators & students.
          </p>
        </div>

        {isAdmin && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            Admin Moderation Controls Active
          </span>
        )}
      </div>

      {/* Ratings Dashboard & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        {/* Average Score */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6 text-center">
          <span className="text-4xl font-black text-slate-900 tracking-tight">
            {rating.averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(rating.averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            Based on {rating.totalVotes} student evaluations
          </span>
        </div>

        {/* Rating Bars */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = (rating.breakdown as any)[stars] || 0;
            const pct = rating.totalVotes > 0 ? (count / rating.totalVotes) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-slate-600 flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Comment Form */}
      <form onSubmit={handleSubmit} className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl space-y-4">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <span>Leave a Review & Rating</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Star Selection */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-slate-600 mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= (hoverRating || newRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Author Name */}
          <input
            type="text"
            placeholder="Your Name / Designation (e.g. Rahul S., Student)"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-600 w-full sm:w-72 shadow-2xs"
            required
          />
        </div>

        <textarea
          rows={3}
          placeholder="Share your feedback, clear doubts, or suggest improvements for this lesson..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 shadow-2xs resize-none"
          required
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Comment
          </button>
        </div>
      </form>

      {/* Filter Tabs & Comments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-700">
            {sortedComments.length} Comments Published
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Sort:</span>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setFilterMode('highest')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'highest' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Highest Rated
            </button>
          </div>
        </div>

        {/* List */}
        {sortedComments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs italic">
            No comments posted yet. Be the first student to review this article!
          </div>
        ) : (
          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  !comment.approved
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Author Info & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {comment.authorName[0]?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{comment.authorName}</span>
                        {!comment.approved && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            Pending Approval
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= comment.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {comment.text}
                </p>

                {/* Educator Reply */}
                {comment.educatorReply && (
                  <div className="mt-3 p-3 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                      Official Educator Reply:
                    </div>
                    <p className="text-indigo-900/90 leading-relaxed">{comment.educatorReply}</p>
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onLikeComment && onLikeComment(comment.id)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({comment.likes})</span>
                  </button>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id)
                        }
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply as Educator
                      </button>

                      {onAdminToggleApprove && (
                        <button
                          onClick={() => onAdminToggleApprove(comment.id)}
                          className={`font-semibold ${
                            comment.approved ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'
                          }`}
                        >
                          {comment.approved ? 'Unapprove' : 'Approve'}
                        </button>
                      )}

                      {onAdminDeleteComment && (
                        <button
                          onClick={() => onAdminDeleteComment(comment.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Educator Reply Box */}
                {replyingCommentId === comment.id && (
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write official educator reply..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                    <button
                      onClick={() => handleAdminReplySubmit(comment.id)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Post Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
