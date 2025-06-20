import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <Link to="/" className="footer-brand">Know Sharing</Link>
      </div>
      <div className="footer-center">
        <div className="footer-column">
          <h4>Indirizzo</h4>
          <ul>
            <li>Via Roma, 13</li>
            <li>Sicilia, Catania, 95030</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contattaci</h4>
          <ul>
            <li>salvoprovak@gmail.com</li>
            <li>seguici sui social</li>
          </ul>
        </div>
        <div className="footer-column">
        </div>
      </div>
    </footer>
  );
};

export default Footer;