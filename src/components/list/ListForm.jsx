import { useState } from "react";
import { useMovieContext } from "../../contexts/MovieContext";
import "../../styles/ListForm.css";

const ListForm = ({ list = null, onSuccess, onCancel }) => {
  const { createList, updateList } = useMovieContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: list?.name || "",
    description: list?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.name.trim()) {
        throw new Error("List name is required");
      }

      if (list) {
        await updateList(list.id, formData);
      } else {
        await createList(formData);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("List form error:", err);
      setError(err.message || "An error occurred while saving the list");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="list-form-container">
      <h2>{list ? "Edit List" : "Create New List"}</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="list-form">
        <div className="form-group">
          <label htmlFor="name">List Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="My Awesome Movie List"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="What kind of movies belong in this list?"
          ></textarea>
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
            {isSubmitting ? "Saving..." : list ? "Update List" : "Create List"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListForm;
