import './App.css';
import { Actors } from './Actors.js';
import { Movies } from './Movies.js';
import { BrowserRouter, Route, NavLink, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App-container">
        <h3 className="d-flex justify-content-center m-3">
          React JS Frontend
        </h3>

        <nav className="navbar navbar-expand-sm bg-light navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/actors">
                Actors
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/movies">
                Movies
              </NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/actors" element={<Actors />} />
          <Route path="/movies" element={<Movies />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
