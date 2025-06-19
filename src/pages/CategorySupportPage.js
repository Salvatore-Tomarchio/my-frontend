import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CategorySupportPage.css';

const CategorySupportPage = () => {
  const { genre } = useParams();
  const [supportData, setSupportData] = useState([]);
  const [error, setError] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [newSupportContent, setNewSupportContent] = useState('');

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${baseUrl}/idee?genre=${genre}&type=supporto`)
      .then((res) => {
        setSupportData(res.data);
      })
      .catch((err) => console.error('Errore caricamento supporti:', err));
  }, [genre]);

  const handleCreateSupport = async () => {
    const content = newSupportContent.trim();
    if (!content) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setError('Devi essere loggato per creare un supporto.');
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/idee`,
        {
          genre,
          type: 'supporto',
          content,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSupportData((prev) => [res.data, ...prev]);
      setNewSupportContent('');
      setError(null);
    } catch (err) {
      console.error('Errore creazione supporto:', err);
      setError('Errore durante la creazione del supporto.');
    }
  };

  const handleSubmitComment = async (ideaId) => {
    const commentText = newComments[ideaId]?.trim();
    if (!commentText) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setError('Devi essere loggato per inviare un commento.');
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/idee/${ideaId}/commenti`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSupportData((prevSupportData) =>
        prevSupportData.map((item) =>
          item._id === ideaId
            ? { ...item, comments: [...(item.comments || []), res.data] }
            : item
        )
      );

      setNewComments((prev) => ({ ...prev, [ideaId]: '' }));
      setError(null);
    } catch (err) {
      console.error('Errore invio commento:', err);
      setError('Errore durante l\'invio del commento.');
    }
  };

  const handleChange = (ideaId, value) => {
    setNewComments((prev) => ({ ...prev, [ideaId]: value }));
  };

  return (
    <div className="category-content">
      <h1>Supporto - {genre}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* FORM creazione nuovo supporto */}
      <div>
        <h2>Crea un nuovo supporto</h2>
        <textarea
          value={newSupportContent}
          onChange={(e) => setNewSupportContent(e.target.value)}
          placeholder="Scrivi il contenuto del nuovo supporto..."
        />
        <br />
        <button onClick={handleCreateSupport}>Aggiungi supporto</button>
      </div>

      <ul>
        {supportData.map((item) => (
          <li key={item._id}>
            {/* Mostra autore del supporto */}
            <p><strong>{item.user?.name || 'Utente sconosciuto'}:</strong> {item.content}</p>

            <div>
              <h3>Commenti:</h3>
              {item.comments && item.comments.length > 0 ? (
                <ul>
                  {item.comments.map((comment) => (
                    <li key={comment._id}>
                      {/* Mostra autore del commento */}
                      <strong>{comment.user?.name || 'Anonimo'}:</strong> {comment.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nessun commento</p>
              )}
            </div>

            <textarea
              value={newComments[item._id] || ''}
              onChange={(e) => handleChange(item._id, e.target.value)}
              placeholder="Scrivi un commento..."
            />
            <button onClick={() => handleSubmitComment(item._id)}>Invia commento</button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default CategorySupportPage;