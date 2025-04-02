import { useState } from "react";
import { localApi } from "../../api";
import "../../styles/ReviewForm.css";

const ReviewForm = ({ movieId, onSuccess, review = null, onCancel }) => {
  const [formData, setFormData] = useState({
    content: review?.content || "",
    rating: review?.rating || 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate form
      if (!formData.content.trim()) {
        throw new Error("Review content is required");
      }

      // Create or update review
      if (review) {
        await localApi.updateReview(review.id, {
          content: formData.content,
          rating: formData.rating,
        });
      } else {
        await localApi.createReview({
          movieId,
          content: formData.content,
          rating: formData.rating,
          userId: "1", // In a real app, get this from auth
          username: "User", // In a real app, get this from auth
          createdAt: new Date().toISOString(),
        });
      }

      // Call success callback
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Review form error:", err);
      setError(err.message || "An error occurred while saving the review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>{review ? "Edit Review" : "Write a Review"}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <label key={value} className="rating-label">
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={formData.rating === value}
                  onChange={handleChange}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Review</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Share your thoughts about this movie..."
          ></textarea>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : review
              ? "Update Review"
              : "Post Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
