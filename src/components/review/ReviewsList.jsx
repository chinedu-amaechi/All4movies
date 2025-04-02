import { useState, useEffect } from "react";
import { localApi } from "../../api";
import ReviewItem from "./ReviewItem";
import "../../styles/ReviewsList.css";

const ReviewsList = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await localApi.getMovieReviews(movieId);
        setReviews(data);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [movieId]);

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      await localApi.deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete review. Please try again.");
    }
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        No reviews yet. Be the first to review this movie!
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <h3>User Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onDelete={() => handleDeleteReview(review.id)}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
