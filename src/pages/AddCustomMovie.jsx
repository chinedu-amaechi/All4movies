import { useNavigate } from "react-router-dom";
import CustomMovieForm from "../components/movie/CustomMovieForm";
import "../styles/AddCustomMovie.css";

const AddCustomMovie = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/my-movies");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="add-custom-movie-page">
      <h1>Add a Custom Movie</h1>
      <p className="page-description">
        Add your own movie that isn't available in our database.
      </p>

      <CustomMovieForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};

export default AddCustomMovie;
