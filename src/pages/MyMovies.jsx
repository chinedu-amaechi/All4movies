import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/movie/MovieCard";
import "../styles/MyMovies.css";

const MyMovies = () => {
  const { customMovies, loading } = useMovieContext();

  if (loading) {
    return <div className="loading">Loading your movies...</div>;
  }

  return (
    <div className="my-movies-page">
      <div className="page-header">
        <h1>My Custom Movies</h1>
        <Link to="/add-movie" className="add-movie-btn">
          Add New Movie
        </Link>
      </div>

      <p className="page-description">
        These are custom movies that you've added to your collection.
      </p>

      {customMovies.length === 0 ? (
        <div className="empty-movies">
          <p>You haven't added any custom movies yet.</p>
          <Link to="/add-movie" className="add-movie-btn">
            Add Your First Movie
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {customMovies.map((movie) => (
            <MovieCard key={movie.id} movie={{ ...movie, custom: true }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMovies;
