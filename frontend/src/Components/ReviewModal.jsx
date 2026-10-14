import React, { useState } from "react";
import API from "../services/api";
import { X, Star, Send, AlertCircle, Loader2 } from "lucide-react";

export default function ReviewModal({ exchange, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/reviews", {
        exchange_id: exchange.id,
        rating,
        comment,
      });

      if (res.data.success) {
        onSuccess(res.data.message || "Review submitted successfully!");
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-150 relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Leave a Review</h2>
          <p className="text-xs text-slate-500 mt-1">
            Rate your skill exchange experience for session #{exchange.id}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Star Selector */}
          <div className="flex flex-col items-center justify-center">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600 mt-1">
              {rating === 5 && "🌟 Excellent Swap!"}
              {rating === 4 && "👍 Very Good Session"}
              {rating === 3 && "👌 Good Experience"}
              {rating === 2 && "😐 Average"}
              {rating === 1 && "🙁 Disappointing"}
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Feedback / Testimonial
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How was your swap partner's teaching style?"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-200 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Review
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
