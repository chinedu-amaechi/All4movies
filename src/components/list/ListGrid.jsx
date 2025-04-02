import { useState } from "react";
import { Link } from "react-router-dom";
import { useMovieContext } from "../../contexts/MovieContext";
import ListForm from "./ListForm";
import "../../styles/ListGrid.css";

const ListGrid = () => {
  const { lists, deleteList } = useMovieContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [deletingListId, setDeletingListId] = useState(null);

  const handleCreateSuccess = () => {
    setIsCreating(false);
  };

  const handleEditSuccess = () => {
    setEditingList(null);
  };

  const handleDeleteConfirm = async (listId) => {
    try {
      await deleteList(listId);
      setDeletingListId(null);
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  // Filter out the favorites list - it's special and managed differently
  const userLists = lists.filter((list) => list.id !== "favorites");

  if (isCreating) {
    return (
      <ListForm
        onSuccess={handleCreateSuccess}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  if (editingList) {
    return (
      <ListForm
        list={editingList}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingList(null)}
      />
    );
  }

  return (
    <div className="lists-container">
      <div className="lists-header">
        <h2>My Movie Lists</h2>
        <button onClick={() => setIsCreating(true)} className="create-list-btn">
          Create New List
        </button>
      </div>

      {userLists.length === 0 ? (
        <div className="no-lists">
          <p>You haven't created any lists yet.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="create-list-btn"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="lists-grid">
          {/* Always show Favorites list first */}
          <div className="list-card special">
            <Link to="/favorites" className="list-link">
              <h3>Favorites</h3>
              <p className="list-movie-count">
                {lists.find((l) => l.id === "favorites")?.movies?.length || 0}{" "}
                movies
              </p>
            </Link>
          </div>

          {/* Display user-created lists */}
          {userLists.map((list) => (
            <div key={list.id} className="list-card">
              <Link to={`/list/${list.id}`} className="list-link">
                <h3>{list.name}</h3>
                <p className="list-description">
                  {list.description && list.description.length > 100
                    ? `${list.description.substring(0, 100)}...`
                    : list.description}
                </p>
                <p className="list-movie-count">
                  {list.movies?.length || 0} movies
                </p>
              </Link>

              <div className="list-actions">
                <button
                  onClick={() => setEditingList(list)}
                  className="edit-list-btn"
                >
                  Edit
                </button>

                {deletingListId === list.id ? (
                  <div className="delete-confirmation">
                    <button
                      onClick={() => handleDeleteConfirm(list.id)}
                      className="confirm-delete-btn"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeletingListId(null)}
                      className="cancel-delete-btn"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingListId(list.id)}
                    className="delete-list-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListGrid;
