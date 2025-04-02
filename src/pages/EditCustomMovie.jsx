import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import CustomMovieForm from "../components/movie/CustomMovieForm";
import "../styles/EditCustomMovie.css";

const EditCustomMovie = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { customMovies } = useMovieContext();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Find the movie in our custom movies list
    const foundMovie = customMovies.find((m) => m.id === movieId);

    if (foundMovie) {
      setMovie(foundMovie);
    } else {
      setError("Custom movie not found.");
    }

    setLoading(false);
  }, [movieId, customMovies]);

  const handleSuccess = () => {
    navigate(`/movie/${movieId}`);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <div className="loading">Loading movie data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate("/my-movies")} className="back-btn">
          Back to My Movies
        </button>
      </div>
    );
  }

  return (
    <div className="edit-custom-movie-page">
      <h1>Edit Movie</h1>
      <p className="page-description">Update the details for "{movie.title}"</p>

      <CustomMovieForm
        movie={movie}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditCustomMovie;
