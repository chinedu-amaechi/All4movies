import { useState, useEffect } from "react";
import MovieCard from "../components/movie/MovieCard";
import { tmdbApi } from "../api";
import "../styles/Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        setLoading(true);
        const popularMovies = await tmdbApi.getPopularMovies();
        setMovies(popularMovies);
        setError(null);
      } catch (err) {
        console.error("Failed to load popular movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const searchResults = await tmdbApi.searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.error("Failed to search movies:", err);
      setError("Failed to search movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <>
          <h2 className="section-title">
            {searchQuery ? "Search Results" : "Popular Movies"}
          </h2>
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
              <p className="no-movies">
                {searchQuery
                  ? "No movies found for your search. Try something else!"
                  : "No movies available right now."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
