import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/movie/MovieCard";
import "../styles/ListDetail.css";

const ListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { lists, removeMovieFromList, updateList, deleteList } =
    useMovieContext();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [listName, setListName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Find the list in our context
    const foundList = lists.find((l) => l.id === listId);

    if (foundList) {
      setList(foundList);
      setListName(foundList.name);
    } else {
      setError("List not found.");
      setLoading(false);
    }

    setLoading(false);
  }, [listId, lists]);

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeMovieFromList(listId, movieId);
    } catch (err) {
      console.error("Error removing movie:", err);
      setError("Failed to remove movie from list. Please try again.");
    }
  };

  const handleNameUpdate = async () => {
    if (!listName.trim()) {
      return; // Don't update with empty name
    }

    try {
      await updateList(listId, { name: listName });
      setIsEditingName(false);
    } catch (err) {
      console.error("Error updating list name:", err);
      setError("Failed to update list name. Please try again.");
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteList(listId);
      navigate("/lists");
    } catch (err) {
      console.error("Error deleting list:", err);
      setError("Failed to delete list. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading list...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <Link to="/lists" className="back-btn">
          Back to Lists
        </Link>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="error-container">
        <div className="error">List not found</div>
        <Link to="/lists" className="back-btn">
          Back to Lists
        </Link>
      </div>
    );
  }

  const isFavoritesList = list.id === "favorites";
  const isEmpty = !list.movies || list.movies.length === 0;

  return (
    <div className="list-detail-page">
      <div className="list-header">
        <div className="list-title">
          {isEditingName ? (
            <div className="edit-name-form">
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                autoFocus
              />
              <button onClick={handleNameUpdate} className="save-name-btn">
                Save
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1>
              {list.name}
              {!isFavoritesList && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="edit-name-btn"
                  title="Edit list name"
                >
                  ✎
                </button>
              )}
            </h1>
          )}

          <p className="list-movie-count">
            {list.movies?.length || 0}{" "}
            {list.movies?.length === 1 ? "movie" : "movies"}
          </p>
        </div>

        <div className="list-actions">
          <Link to="/lists" className="back-btn">
            Back to Lists
          </Link>

          {!isFavoritesList && !showDeleteConfirm && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-list-btn"
            >
              Delete List
            </button>
          )}

          {showDeleteConfirm && (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this list?</p>
              <div className="confirm-actions">
                <button
                  onClick={handleDeleteList}
                  className="confirm-delete-btn"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="cancel-delete-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {list.description && (
        <p className="list-description">{list.description}</p>
      )}

      {isEmpty ? (
        <div className="empty-list">
          <p>This list doesn't have any movies yet.</p>
          <Link to="/" className="browse-movies-btn">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {list.movies.map((movie) => (
            <div key={movie.id} className="movie-card-wrapper">
              <MovieCard movie={movie} />
              <button
                onClick={() => handleRemoveMovie(movie.id)}
                className="remove-from-list-btn"
                title="Remove from list"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListDetail;
