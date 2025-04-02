import { useState } from "react";
import ReviewForm from "./ReviewForm";
import { formatDate } from "../../utils/dateUtils";
import "../../styles/ReviewItem.css";

const ReviewItem = ({ review, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Current user - In a real app, this would come from an auth context
  const currentUser = { id: "1" };
  const isOwner = review.userId === currentUser.id;

  const handleEditSuccess = () => {
    setIsEditing(false);
    // In a real app, you would reload the review or update the state
  };

  if (isEditing) {
    return (
      <ReviewForm
        review={review}
        movieId={review.movieId}
        onSuccess={handleEditSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-user-info">
          <span className="review-username">
            {review.username || "Anonymous User"}
          </span>
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
        <div className="review-rating">
          <span className="rating-value">{review.rating}</span>/10
        </div>
      </div>

      <div className="review-content">{review.content}</div>

      {isOwner && (
        <div className="review-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="edit-review-btn"
          >
            Edit
          </button>

          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="delete-review-btn"
            >
              Delete
            </button>
          ) : (
            <div className="delete-confirmation">
              <span>Are you sure?</span>
              <button onClick={onDelete} className="confirm-delete-btn">
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="cancel-delete-btn"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
