import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import { FaSun, FaMoon } from 'react-icons/fa';  // Per le icone di cambio tema

const Navbar = ({ toggleTheme, currentTheme, onLoginLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Gestisce l'apertura/chiusura del menu
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${currentTheme}`}>
      {/* Logo a sinistra con link alla homepage */}
      <div className="logo">
        <Link to="/">Know Sharing</Link>
      </div>

      {/* Bottone per aprire/chiudere il menu su mobile */}
      <button className="toggle-menu" onClick={handleMenuToggle}>
        ☰ {/* Icona del menu per dispositivi mobili */}
      </button>

      {/* Menu con i link */}
      <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
        {/* Pulsanti a destra */}
        <button onClick={toggleTheme}>
          {currentTheme === 'light' ? <FaMoon /> : <FaSun />} {/* Icona di tema */}
        </button>
        {user ? (
          <>
            <span>{user.name}</span> {/* Mostra il nome dell'utente */}
            <button onClick={onLoginLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
          Problemi
        </button>
      </div>
    </nav>
  );
};

export default Navbar;