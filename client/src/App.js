import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import AboutUs from './AboutUs';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container">
            <Link className="navbar-brand" to="/">ÜtüMak</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Anasayfa</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">Hakkımızda</Link>
                </li>
                
              </ul>
            </div>
          </div>
        </nav>

        <main className="container mt-5 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="footer mt-auto py-3 bg-dark">
          <div className="container text-center">
            <span className="text-white">© 2025 Hulusi Yılmaz - Tüm Hakları Saklıdır.</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;