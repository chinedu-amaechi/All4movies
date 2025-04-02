import { ListGrid } from "../components/list";
import "../styles/Lists.css";

const Lists = () => {
  return (
    <div className="lists-page">
      <div className="page-header">
        <h1>My Movie Lists</h1>
      </div>

      <p className="page-description">
        Create and manage your personalized movie lists. Organize your movies by
        genre, mood, or any category you like.
      </p>

      <ListGrid />
    </div>
  );
};

export default Lists;
