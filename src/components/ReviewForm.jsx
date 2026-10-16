
import { useState } from "react";
import { X, Star, ImagePlus, Send } from "lucide-react";

export default function ReviewForm({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("Excellent");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be 2 MB or smaller.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    if (feedback.trim().length < 5) {
      setError("Please write at least 5 characters of feedback.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(
        {
          name: name.trim(),
          experience,
          rating,
          feedback: feedback.trim(),
        },
        image
      );
    } catch (err) {
      setError(err.message || "Unable to submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="review-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow dark-eyebrow">YOUR EXPERIENCE</span>
            <h2 id="form-title">Write a review<span>.</span></h2>
            <p>Your feedback helps us grow.</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close form">
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="review-name">Your name</label>
          <input
            id="review-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            maxLength={80}
            required
          />

          <label className="field-label">Upload your image (optional)</label>
          <label className="image-upload">
            {preview ? (
              <img src={preview} alt="Profile preview" className="upload-preview" />
            ) : (
              <span className="upload-icon"><ImagePlus size={23} /></span>
            )}
            <span>
              <strong>{image ? image.name : "Choose a profile image"}</strong>
              <small>JPG, PNG or WebP · Max 2 MB</small>
            </span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} />
          </label>

          <label className="field-label">How was your experience?</label>
          <div className="experience-options">
            {[
              { label: "Excellent", emoji: "😍" },
              { label: "Good", emoji: "😊" },
              { label: "Super", emoji: "🤩" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className={`experience-option ${experience === item.label ? "selected" : ""}`}
                onClick={() => setExperience(item.label)}
              >
                <span>{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>

          <label className="field-label">Your rating</label>
          <div className="rating-picker">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating === star}
              >
                <Star
                  size={29}
                  fill={star <= rating ? "currentColor" : "none"}
                  className={star <= rating ? "star-active" : "star-inactive"}
                />
              </button>
            ))}
            <span>{rating} / 5</span>
          </div>

          <label className="field-label" htmlFor="review-feedback">Enter your feedback</label>
          <textarea
            id="review-feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience with VGWD..."
            rows={4}
            minLength={5}
            maxLength={1000}
            required
          />
          <div className="character-count">{feedback.length}/1000</div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="primary-btn submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit review"}
            <Send size={17} />
          </button>
        </form>
      </section>
    </div>
  );
}
