import { useState, useEffect } from "react";
import { useMovieContext } from "../../contexts/MovieContext";
import "../../styles/CustomMovieForm.css";

const CustomMovieForm = ({ movie = null, onSuccess, onCancel }) => {
  const { addCustomMovie, updateCustomMovie } = useMovieContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    poster_path: "",
    release_date: "",
    genres: "",
    runtime: "",
    director: "",
    cast: "",
  });

  // Initialize form with movie data if editing
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        overview: movie.overview || "",
        poster_path: movie.poster_path || "",
        release_date: movie.release_date || "",
        genres: movie.genres ? movie.genres.join(", ") : "",
        runtime: movie.runtime || "",
        director: movie.director || "",
        cast: movie.cast ? movie.cast.join(", ") : "",
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate form
      if (!formData.title) {
        throw new Error("Movie title is required");
      }

      // Process form data
      const processedData = {
        ...formData,
        genres: formData.genres
          ? formData.genres.split(",").map((g) => g.trim())
          : [],
        cast: formData.cast
          ? formData.cast.split(",").map((c) => c.trim())
          : [],
        // If poster_path doesn't start with http, assume it's a relative path for TMDB
        poster_path:
          formData.poster_path && !formData.poster_path.startsWith("http")
            ? formData.poster_path.startsWith("/")
              ? formData.poster_path
              : `/${formData.poster_path}`
            : formData.poster_path,
      };

      // Create or update movie
      if (movie) {
        await updateCustomMovie(movie.id, processedData);
      } else {
        await addCustomMovie(processedData);
      }

      // Call success callback
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "An error occurred while saving the movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-movie-form-container">
      <h2>{movie ? "Edit Movie" : "Add New Movie"}</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="custom-movie-form">
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="release_date">Release Date</label>
          <input
            type="date"
            id="release_date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="overview">Overview</label>
          <textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="poster_path">Poster Image URL</label>
          <input
            type="text"
            id="poster_path"
            name="poster_path"
            value={formData.poster_path}
            onChange={handleChange}
            placeholder="Enter URL or TMDB path"
          />
          {formData.poster_path && (
            <div className="poster-preview">
              <img
                src={
                  formData.poster_path.startsWith("/")
                    ? `https://image.tmdb.org/t/p/w200${formData.poster_path}`
                    : formData.poster_path
                }
                alt="Poster preview"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/200x300?text=No+Image")
                }
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="genres">Genres</label>
          <input
            type="text"
            id="genres"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            placeholder="Action, Drama, Comedy, etc. (comma separated)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="runtime">Runtime (minutes)</label>
          <input
            type="number"
            id="runtime"
            name="runtime"
            value={formData.runtime}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="director">Director</label>
          <input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cast">Cast</label>
          <input
            type="text"
            id="cast"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            placeholder="Actor 1, Actor 2, etc. (comma separated)"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomMovieForm;
