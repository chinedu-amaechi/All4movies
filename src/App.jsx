import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/layout/NavBar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetail from "./pages/MovieDetail";
import AddCustomMovie from "./pages/AddCustomMovie";
import EditCustomMovie from "./pages/EditCustomMovie";
import MyMovies from "./pages/MyMovies";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import "./styles/App.css";

function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/add-movie" element={<AddCustomMovie />} />
          <Route path="/movie/:movieId/edit" element={<EditCustomMovie />} />
          <Route path="/my-movies" element={<MyMovies />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/list/:listId" element={<ListDetail />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
