import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CategoryIdeaPage.css';

const CategoryPage = () => {
  const { genre } = useParams(); // film, musica o libri
  const [ideas, setIdeas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
  if (!genre) return;

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  axios.get(`${baseUrl}/idee?genre=${genre}&type=idea`)
    .then((res) => setIdeas(res.data))
    .catch((err) => console.error('Errore caricamento idee:', err));
}, [genre]);

  const handleToggleUpvote = async (idea) => {
    if (!user) return;

    const hasVoted = user && idea.upvotes.includes(user._id);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    try {
      const url = hasVoted
        ? `${baseUrl}/idee/${idea._id}/remove-upvote`
        : `${baseUrl}/idee/${idea._id}/upvote`;

      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Aggiorna localmente lo stato
      setIdeas((prevIdeas) =>
        prevIdeas.map((i) =>
          i._id === idea._id
            ? {
                ...i,
                upvotes: hasVoted
                  ? i.upvotes.filter((id) => id !== user._id)
                  : [...i.upvotes, user._id],
              }
            : i
        )
      );
    } catch (err) {
      console.error('Errore toggle upvote:', err);
    }
  };

  const handleSubmitIdea = async () => {
    if (!user || !newIdeaContent.trim()) return;

    try {
      console.log('il mio utente:', user);

      const newIdea = {
        genre, // <-- prende quello dalla URL
        type: 'idea',
        content: newIdeaContent.trim(),
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/idee`,
        newIdea,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setIdeas([res.data, ...ideas]); // aggiungi in cima
      setNewIdeaContent('');
      setShowForm(false);
    } catch (err) {
      console.error('Errore invio nuova idea:', err);
    }
  };

  return (
    <div className="idea-chat-container">
      <h2>Idee</h2>

      {user && (
        <div className="submit-idea-section">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annulla' : 'Condividi un\'idea'}
          </button>

          {showForm && (
            <div className="idea-form">
              <textarea
                value={newIdeaContent}
                onChange={(e) => setNewIdeaContent(e.target.value)}
                placeholder="Scrivi la tua idea..."
              />
              <button onClick={handleSubmitIdea}>Invia</button>
            </div>
          )}
        </div>
      )}

      {!user && <p style={{ color: 'gray' }}>Accedi per condividere un'idea.</p>}

      <div className="idea-chat-list">
        {ideas.map((idea) => (
          <div key={idea._id} className="idea-bubble">
            <p className="idea-author">
              {idea.user?.name || idea.user?.email || 'Anonimo'}
            </p>
            <p className="idea-content">{idea.content}</p>
            <div className="idea-footer">
              <button
                className={`upvote-button ${user && idea.upvotes.includes(user._id) ? 'voted' : ''}`}
                onClick={() => handleToggleUpvote(idea)}
                disabled={!user}
              >
                👍
              </button>
              <span>{idea.upvotes.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
