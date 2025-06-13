import './HomePage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const categories = ['Film', 'Musica', 'Libri'];

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="homepage">
      <h1>Le nostre Categorie</h1>
      <div className="categories-container">
        {categories.map(category => (
          <div key={category} className="category-wrapper">
            <div className="category-card" onClick={() => handleCategoryClick(category)}>
              <span className="category-text">{category}</span>
            </div>

            {selectedCategory === category && (
              <div className="category-options">
                <button onClick={() => navigate(`/${category.toLowerCase()}/idea`)}>Idea</button>
                <button onClick={() => navigate(`/${category.toLowerCase()}/supporto`)}>Supporto</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;