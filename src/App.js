import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CategorySupportPage from './pages/CategorySupportPage';
import Footer from './components/Footer';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <div className={theme === 'light' ? 'light-theme' : 'dark-theme'}>
          <Navbar toggleTheme={toggleTheme} currentTheme={theme} user={user} onLoginLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/:genre/idea" element={<CategoryPage />} />
            <Route path="/:genre/supporto" element={<CategorySupportPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;