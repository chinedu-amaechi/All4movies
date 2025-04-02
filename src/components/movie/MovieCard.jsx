import { useState } from "react";
import { Link } from "react-router-dom";
import { useMovieContext } from "../../contexts/MovieContext";
import "../../styles/MovieCard.css";

const MovieCard = ({ movie, showActions = true }) => {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    lists,
    addMovieToList,
  } = useMovieContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedList, setSelectedList] = useState("");

  const favorite = isFavorite(movie.id);

  // Format image URL
  const getImageUrl = () => {
    if (!movie.poster_path)
      return "https://via.placeholder.com/300x450?text=No+Image";

    if (movie.poster_path.startsWith("http")) {
      return movie.poster_path;
    }

    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    if (!selectedList) return;

    try {
      await addMovieToList(selectedList, movie);
      setSelectedList("");
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Error adding movie to list:", err);
    }
  };

  // Filter out the favorites list from available lists
  const availableLists = lists.filter((list) => list.id !== "favorites");

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <div className="movie-poster">
          <img src={getImageUrl()} alt={movie.title} />

          {showActions && (
            <div className="movie-overlay">
              <button
                className={`favorite-btn ${favorite ? "active" : ""}`}
                onClick={handleFavoriteClick}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                ♥
              </button>

              <button
                className="menu-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                }}
                title="More options"
              >
                •••
              </button>

              {isMenuOpen && (
                <div className="movie-menu">
                  {availableLists.length > 0 ? (
                    <div className="add-to-list">
                      <select
                        value={selectedList}
                        onChange={(e) => setSelectedList(e.target.value)}
                        onClick={(e) => e.preventDefault()}
                      >
                        <option value="">Add to list...</option>
                        {availableLists.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddToList}
                        disabled={!selectedList}
                        className="add-to-list-btn"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/lists/new"
                      onClick={(e) => e.stopPropagation()}
                      className="create-list-link"
                    >
                      Create a list
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>
            {movie.release_date ? movie.release_date.split("-")[0] : "Unknown"}
          </p>

          {movie.custom && <span className="custom-tag">Custom</span>}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
