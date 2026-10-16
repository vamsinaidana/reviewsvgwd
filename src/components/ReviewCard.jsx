
import { Star, Quote } from "lucide-react";

export default function ReviewCard({ review }) {
  const initial = review.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <article className="review-card">
      <div className="card-top">
        <span className="quote-icon"><Quote size={21} /></span>
        <span className="experience-pill">{review.experience}</span>
      </div>

      <div className="card-stars" aria-label={`${review.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= review.rating ? "currentColor" : "none"}
          />
        ))}
      </div>

      <p className="review-feedback">{review.feedback}</p>

      <div className="review-author">
        {review.profile_image ? (
          <img src={review.profile_image} alt={review.name} className="avatar" />
        ) : (
          <div className="avatar avatar-fallback">{initial}</div>
        )}
        <div className="author-info">
          <strong>{review.name}</strong>
          <span>
            {review.created_at
              ? new Date(review.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "VGWD client"}
          </span>
        </div>
        <span className="verified-mark" title="Review submitted">✦</span>
      </div>
    </article>
  );
}
