import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/movie/MovieCard";
import "../styles/Favorites.css";

const Favorites = () => {
  const { favorites, loading } = useMovieContext();

  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>Your Favorite Movies</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>You haven't added any favorites yet.</p>
          <Link to="/" className="browse-movies-btn">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
