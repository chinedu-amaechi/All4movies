import { Link, NavLink } from "react-router-dom";
import "../../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie Addicts</Link>
      </div>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          end
        >
          Home
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Favorites
        </NavLink>

        <NavLink
          to="/my-movies"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          My Movies
        </NavLink>

        <NavLink
          to="/lists"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Lists
        </NavLink>

        <NavLink to="/add-movie" className="nav-link add-btn">
          + Add Movie
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
