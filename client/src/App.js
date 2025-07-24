import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './Home';
import Admin from './Admin';
import AboutUs from './AboutUs';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand as={Link} to="/">ÜtüMak</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <LinkContainer to="/">
                  <Nav.Link>Anasayfa</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/about">
                  <Nav.Link>Hakkımızda</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

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