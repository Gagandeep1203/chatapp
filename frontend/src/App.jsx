import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Layout Component
import Navbar from './components/Navbar';

// Route Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Page Components
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Add Navbar here */}
        <div className="container">
          <Routes>
            {/* Protected Routes (require login) */}
            <Route path="/" element={<ProtectedRoute />}>
              {/* Child route of ProtectedRoute, rendered via Outlet */}
              <Route index element={<ChatPage />} />
              {/* Add other protected routes here if needed */}
            </Route>

            {/* Public Routes (redirect if logged in) */}
            <Route path="/login" element={<PublicRoute />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/register" element={<PublicRoute />}>
              <Route index element={<RegisterPage />} />
            </Route>

            {/* Optional: Add a 404 Not Found route */}
            {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 