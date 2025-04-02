import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tmdbApi, localApi } from "../api";
import { useMovieContext } from "../contexts/MovieContext";
import { ReviewForm, ReviewsList } from "../components/review";
import "../styles/MovieDetail.css";

const MovieDetail = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    customMovies,
    deleteCustomMovie,
  } = useMovieContext();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isCustomMovie, setIsCustomMovie] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const favorite = movie ? isFavorite(movie.id) : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // First check if it's a custom movie
        const customMovie = customMovies.find((m) => m.id === movieId);

        if (customMovie) {
          setMovie(customMovie);
          setIsCustomMovie(true);
        } else {
          // If not custom, try to fetch from TMDB
          const data = await tmdbApi.getMovieDetails(movieId);
          setMovie(data);
          setIsCustomMovie(false);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, customMovies]);

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomMovie(movie.id);
      navigate("/my-movies");
    } catch (err) {
      console.error("Error deleting movie:", err);
      setError("Failed to delete movie. Please try again.");
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    // Optionally refresh reviews here
  };

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  // Format genres
  const genres = movie.genres
    ? Array.isArray(movie.genres)
      ? movie.genres.map((g) => (typeof g === "string" ? g : g.name)).join(", ")
      : ""
    : "";

  // Format release date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown release date";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="movie-detail">
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="movie-content">
        <div className="movie-header">
          <div className="movie-poster-container">
            <img
              src={
                movie.poster_path
                  ? movie.poster_path.startsWith("http")
                    ? movie.poster_path
                    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="movie-poster"
            />
          </div>

          <div className="movie-info">
            <h1>{movie.title}</h1>

            {isCustomMovie && (
              <span className="custom-badge">Custom Movie</span>
            )}

            <p className="movie-date">{formatDate(movie.release_date)}</p>

            {movie.runtime && (
              <p className="movie-runtime">{movie.runtime} minutes</p>
            )}

            {genres && <p className="movie-genres">{genres}</p>}

            {movie.vote_average && (
              <div className="movie-rating">
                <span className="rating-label">Rating:</span>
                <span className="rating-value">
                  {movie.vote_average.toFixed(1)}
                </span>
                /10
              </div>
            )}

            <div className="movie-actions">
              <button
                className={`favorite-btn ${favorite ? "active" : ""}`}
                onClick={handleFavoriteToggle}
              >
                {favorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>

              {isCustomMovie && (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/movie/${movie.id}/edit`)}
                  >
                    Edit Movie
                  </button>

                  {!showDeleteConfirm ? (
                    <button
                      className="delete-btn"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Movie
                    </button>
                  ) : (
                    <div className="delete-confirmation">
                      <p>Are you sure you want to delete this movie?</p>
                      <div className="delete-actions">
                        <button
                          className="confirm-delete"
                          onClick={handleDelete}
                        >
                          Yes, Delete
                        </button>
                        <button
                          className="cancel-delete"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {movie.overview && (
          <div className="movie-overview">
            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </div>
        )}

        {movie.director && (
          <div className="movie-director">
            <h2>Director</h2>
            <p>{movie.director}</p>
          </div>
        )}

        {movie.cast && movie.cast.length > 0 && (
          <div className="movie-cast">
            <h2>Cast</h2>
            <p>
              {Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}
            </p>
          </div>
        )}

        {/* Show videos if available (from TMDB) */}
        {movie.videos &&
          movie.videos.results &&
          movie.videos.results.length > 0 && (
            <div className="movie-videos">
              <h2>Videos</h2>
              <div className="videos-container">
                {movie.videos.results.slice(0, 3).map((video) => (
                  <div key={video.id} className="video-item">
                    <h3>{video.name}</h3>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Reviews section */}
        <div className="movie-reviews-section">
          <div className="reviews-header">
            <h2>Reviews</h2>
            {!showReviewForm && (
              <button
                className="write-review-btn"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <ReviewForm
              movieId={movie.id}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowReviewForm(false)}
            />
          )}

          <ReviewsList movieId={movie.id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
