
import { useEffect, useState } from "react";
import { Star, Plus, ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "./supabase";
import ReviewForm from "./components/ReviewForm";
import ReviewCard from "./components/ReviewCard";
import "./index.css";

export default function App() {
  const [reviews, setReviews] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else {
      setReviews(data || []);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  async function handleSubmit(reviewData, imageFile) {
    let imageUrl = null;

    if (imageFile) {
      const extension = imageFile.name.split(".").pop().toLowerCase();
      const path = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("review-images")
        .upload(path, imageFile, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("review-images")
        .getPublicUrl(path);

      imageUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase
      .from("reviews")
      .insert([{ ...reviewData, profile_image: imageUrl }]);

    if (insertError) throw insertError;

    setFormOpen(false);
    await loadReviews();
  }

  return (
    <main className="site-shell">
      <nav className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">✦</span> VGWD
          <span className="brand-tag">REVIEWS</span>
        </a>
        <button className="nav-review-btn" onClick={() => setFormOpen(true)}>
          <Plus size={17} /> Add Review
        </button>
      </nav>

      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />

        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={15} /> YOUR VOICE MATTERS</span>
          <h1>Your feedback<br /> <span>matters.</span></h1>
          <p>
            Real experiences from people we've worked with.
            Share your experience with VGWD.
          </p>

          <div className="hero-rating">
            <div className="hero-stars" aria-label="Five star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={22} fill="currentColor" />
              ))}
            </div>
            <div>
              <strong>{reviews.length ? `${average}/5` : "★★★★★"}</strong>
              <span>Client feedback & ratings</span>
            </div>
          </div>

          <button className="primary-btn" onClick={() => setFormOpen(true)}>
            Write a review <ArrowUpRight size={19} />
          </button>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="decoration-ring ring-one" />
          <div className="decoration-ring ring-two" />
          <div className="floating-star"><Star fill="currentColor" /></div>
          <div className="floating-review">
            <span className="mini-stars">★★★★★</span>
            <strong>Every voice counts.</strong>
            <small>Made better together.</small>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark-eyebrow">THE COMMUNITY</span>
            <h2>What people say<span>.</span></h2>
            <p>Honest feedback. Real experiences.</p>
          </div>
          <div className="review-count">
            <MessageCircle size={19} />
            <span>{reviews.length} reviews</span>
          </div>
        </div>

        {error && <div className="error-message">Unable to load reviews: {error}</div>}

        {loading ? (
          <div className="empty-state">Loading reviews...</div>
        ) : reviews.length ? (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><MessageCircle size={26} /></div>
            <h3>Your review could be the first.</h3>
            <p>Share your experience and help others discover VGWD.</p>
            <button className="primary-btn" onClick={() => setFormOpen(true)}>
              Add the first review <ArrowUpRight size={18} />
            </button>
          </div>
        )}
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#"><span className="brand-mark">✦</span> VGWD</a>
        <span>Built with care. Improved by your feedback.</span>
      </footer>

      {formOpen && (
        <ReviewForm
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}
