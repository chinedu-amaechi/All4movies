const BASE_URL = "http://localhost:3001";

// Movie CRUD operations
export const getCustomMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movies`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching custom movies:", error);
    throw error;
  }
};

export const getCustomMovie = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movies/${movieId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching custom movie ${movieId}:`, error);
    throw error;
  }
};

export const createMovie = async (movieData) => {
  try {
    const response = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error;
  }
};

export const updateMovie = async (movieId, movieData) => {
  try {
    const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error updating movie ${movieId}:`, error);
    throw error;
  }
};

export const deleteMovie = async (movieId) => {
  try {
    await fetch(`${BASE_URL}/movies/${movieId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error) {
    console.error(`Error deleting movie ${movieId}:`, error);
    throw error;
  }
};

// Review CRUD operations
export const getMovieReviews = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews?movieId=${movieId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching reviews for movie ${movieId}:`, error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw error;
  }
};

// List CRUD operations
export const getLists = async () => {
  try {
    const response = await fetch(`${BASE_URL}/lists`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
};

export const getList = async (listId) => {
  try {
    const response = await fetch(`${BASE_URL}/lists/${listId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching list ${listId}:`, error);
    throw error;
  }
};

export const createList = async (listData) => {
  try {
    const response = await fetch(`${BASE_URL}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};

export const updateList = async (listId, listData) => {
  try {
    const response = await fetch(`${BASE_URL}/lists/${listId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listData),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error updating list ${listId}:`, error);
    throw error;
  }
};

export const deleteList = async (listId) => {
  try {
    await fetch(`${BASE_URL}/lists/${listId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error) {
    console.error(`Error deleting list ${listId}:`, error);
    throw error;
  }
};

export const addMovieToList = async (listId, movie) => {
  try {
    // First get the current list
    const list = await getList(listId);

    // Check if movie already exists in the list
    const movieExists = list.movies.some((m) => m.id === movie.id);
    if (movieExists) {
      return list;
    }

    // Add movie to the list
    const updatedMovies = [...list.movies, movie];

    // Update the list
    return await updateList(listId, { movies: updatedMovies });
  } catch (error) {
    console.error(`Error adding movie to list ${listId}:`, error);
    throw error;
  }
};

export const removeMovieFromList = async (listId, movieId) => {
  try {
    // First get the current list
    const list = await getList(listId);

    // Filter out the movie
    const updatedMovies = list.movies.filter((movie) => movie.id !== movieId);

    // Update the list
    return await updateList(listId, { movies: updatedMovies });
  } catch (error) {
    console.error(`Error removing movie from list ${listId}:`, error);
    throw error;
  }
};
