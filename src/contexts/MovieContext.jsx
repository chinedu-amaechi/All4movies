import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import * as tmdbApi from "../api/tmdbApi";
import * as localApi from "../api/localApi";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [lists, setLists] = useState([]);
  const [customMovies, setCustomMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Current user - In a real app, this would come from auth
  const currentUser = { id: "1" };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Fetch user's lists
        const userLists = await localApi.getLists();
        setLists(userLists);

        // Find favorites list
        const favoritesList = userLists.find((list) => list.id === "favorites");
        if (favoritesList) {
          setFavorites(favoritesList.movies || []);
        } else {
          // Create favorites list if it doesn't exist
          const newFavoritesList = await localApi.createList({
            id: "favorites",
            name: "Favorites",
            userId: currentUser.id,
            movies: [],
          });
          setLists((prev) => [...prev, newFavoritesList]);
        }

        // Fetch custom movies
        const userCustomMovies = await localApi.getCustomMovies();
        setCustomMovies(
          userCustomMovies.filter((movie) => movie.userId === currentUser.id)
        );
      } catch (err) {
        console.error("Failed to initialize movie data:", err);
        setError("Failed to load your movie data. Please try again later.");

        // Fallback to localStorage for favorites if API fails
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [currentUser.id]);

  // Save favorites to localStorage as backup
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // CRUD operations for favorites
  const addToFavorites = useCallback(
    async (movie) => {
      try {
        setLoading(true);
        // Try to add to server first
        const favoritesList = lists.find((list) => list.id === "favorites");
        if (favoritesList) {
          await localApi.addMovieToList("favorites", movie);
          // Update local state
          setFavorites((prev) => [...prev, movie]);
        }
      } catch (err) {
        console.error("Failed to add to favorites:", err);
        setError("Failed to add movie to favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [lists]
  );

  const removeFromFavorites = useCallback(
    async (movieId) => {
      try {
        setLoading(true);
        // Try to remove from server first
        const favoritesList = lists.find((list) => list.id === "favorites");
        if (favoritesList) {
          await localApi.removeMovieFromList("favorites", movieId);
          // Update local state
          setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
        }
      } catch (err) {
        console.error("Failed to remove from favorites:", err);
        setError("Failed to remove movie from favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [lists]
  );

  const isFavorite = useCallback(
    (movieId) => {
      return favorites.some((movie) => movie.id === movieId);
    },
    [favorites]
  );

  // CRUD operations for custom movies
  const addCustomMovie = useCallback(
    async (movieData) => {
      try {
        setLoading(true);
        // Add userId to movieData
        const movieWithUserId = { ...movieData, userId: currentUser.id };
        const newMovie = await localApi.createMovie(movieWithUserId);
        setCustomMovies((prev) => [...prev, newMovie]);
        return newMovie;
      } catch (err) {
        console.error("Failed to add custom movie:", err);
        setError("Failed to add custom movie. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser.id]
  );

  const updateCustomMovie = useCallback(async (movieId, movieData) => {
    try {
      setLoading(true);
      const updatedMovie = await localApi.updateMovie(movieId, movieData);
      setCustomMovies((prev) =>
        prev.map((movie) => (movie.id === movieId ? updatedMovie : movie))
      );
      return updatedMovie;
    } catch (err) {
      console.error(`Failed to update custom movie ${movieId}:`, err);
      setError("Failed to update movie. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCustomMovie = useCallback(
    async (movieId) => {
      try {
        setLoading(true);
        await localApi.deleteMovie(movieId);
        setCustomMovies((prev) => prev.filter((movie) => movie.id !== movieId));

        // Also remove from favorites if it's there
        if (isFavorite(movieId)) {
          await removeFromFavorites(movieId);
        }

        return { success: true };
      } catch (err) {
        console.error(`Failed to delete custom movie ${movieId}:`, err);
        setError("Failed to delete movie. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isFavorite, removeFromFavorites]
  );

  // CRUD operations for lists
  const createList = useCallback(
    async (listData) => {
      try {
        setLoading(true);
        // Add userId to listData
        const listWithUserId = {
          ...listData,
          userId: currentUser.id,
          movies: [],
        };
        const newList = await localApi.createList(listWithUserId);
        setLists((prev) => [...prev, newList]);
        return newList;
      } catch (err) {
        console.error("Failed to create list:", err);
        setError("Failed to create list. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser.id]
  );

  const updateList = useCallback(async (listId, listData) => {
    try {
      setLoading(true);
      const updatedList = await localApi.updateList(listId, listData);
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      // Update favorites if we're updating the favorites list
      if (listId === "favorites") {
        setFavorites(updatedList.movies || []);
      }

      return updatedList;
    } catch (err) {
      console.error(`Failed to update list ${listId}:`, err);
      setError("Failed to update list. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteList = useCallback(async (listId) => {
    try {
      setLoading(true);
      // Don't allow deleting the favorites list
      if (listId === "favorites") {
        throw new Error("Cannot delete the favorites list");
      }

      await localApi.deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
      return { success: true };
    } catch (err) {
      console.error(`Failed to delete list ${listId}:`, err);
      setError("Failed to delete list. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMovieToList = useCallback(async (listId, movie) => {
    try {
      setLoading(true);
      const updatedList = await localApi.addMovieToList(listId, movie);

      // Update lists state
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      // Update favorites if we're updating the favorites list
      if (listId === "favorites") {
        setFavorites(updatedList.movies || []);
      }

      return updatedList;
    } catch (err) {
      console.error(`Failed to add movie to list ${listId}:`, err);
      setError("Failed to add movie to list. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMovieFromList = useCallback(async (listId, movieId) => {
    try {
      setLoading(true);
      const updatedList = await localApi.removeMovieFromList(listId, movieId);

      // Update lists state
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      // Update favorites if we're updating the favorites list
      if (listId === "favorites") {
        setFavorites(updatedList.movies || []);
      }

      return updatedList;
    } catch (err) {
      console.error(`Failed to remove movie from list ${listId}:`, err);
      setError("Failed to remove movie from list. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // State
    favorites,
    lists,
    customMovies,
    loading,
    error,

    // Favorites operations
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // Custom movies operations
    addCustomMovie,
    updateCustomMovie,
    deleteCustomMovie,

    // Lists operations
    createList,
    updateList,
    deleteList,
    addMovieToList,
    removeMovieFromList,

    // Clear error
    clearError: () => setError(null),
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
