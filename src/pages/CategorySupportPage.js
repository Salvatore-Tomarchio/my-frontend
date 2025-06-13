// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const CategorySupportPage = () => {
//   const { genre } = useParams();
//   const [supportData, setSupportData] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//   axios.get('http://localhost:3002/idee')
//     .then((res) => {
//       const filteredIdeas = res.data.filter((idea) =>
//         idea.genre === genre && idea.type === 'supporto'
//       );
//       setSupportData(filteredIdeas);
//     })
//     .catch((err) => console.error('Errore caricamento supporti:', err));
// }, [genre]);

//   return (
//     <div className="category-content">
//       <h1>Supporto - {genre}</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ul>
//         {supportData.map((item) => (
//           <li key={item._id}>{item.content}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CategorySupportPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategorySupportPage = () => {
  const { genre } = useParams();
  const [supportData, setSupportData] = useState([]);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState(''); // stato per il commento

  useEffect(() => {
    axios.get('http://localhost:3002/idee')
      .then((res) => {
        const filteredIdeas = res.data.filter((idea) =>
          idea.genre === genre && idea.type === 'supporto'
        );
        setSupportData(filteredIdeas);
      })
      .catch((err) => console.error('Errore caricamento supporti:', err));
  }, [genre]);

  // Funzione per gestire l'invio del commento
  const handleSubmitComment = async (ideaId) => {
    if (!newComment.trim()) return; // se il commento è vuoto, non fare nulla

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('Devi essere loggato per inviare un commento.');
      return;
    }

    try {
      const commentData = {
        content: newComment.trim(),
        author: user._id, // Usa l'ID dell'utente per associare il commento
      };

      // Invia il commento al server
      const res = await axios.post(`http://localhost:3002/idee/${ideaId}/commenti`, commentData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Aggiungi il commento alla lista dei commenti dell'idea
      setSupportData((prevSupportData) =>
        prevSupportData.map((item) =>
          item._id === ideaId ? { ...item, comments: [...item.comments, res.data] } : item
        )
      );

      setNewComment(''); // Resetta il campo di input
    } catch (err) {
      console.error('Errore invio commento:', err);
      setError('Errore durante l\'invio del commento.');
    }
  };

  return (
    <div className="category-content">
      <h1>Supporto - {genre}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {supportData.map((item) => (
          <li key={item._id}>
            <p>{item.content}</p>
            {/* Se ci sono commenti, visualizzali */}
            <div>
              <h3>Commenti:</h3>
              <ul>
                {item.comments && item.comments.map((comment) => (
                  <li key={comment._id}>{comment.content} - {comment.author.name}</li>
                ))}
              </ul>
            </div>
            
            {/* Input per inserire il nuovo commento */}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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