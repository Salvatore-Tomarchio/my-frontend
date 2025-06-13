// import './LoginPage.css';
// import React, { useState } from 'react';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';

// const LoginPage = ({onLogin}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // Login con Google
//   const handleGoogleLoginSuccess = (response) => {
//     const { credential } = response;

//     axios.post('http://localhost:3002/auth/google', { token: credential })
//       .then((res) => {
//         // Salva il token JWT nel localStorage
//         localStorage.setItem('token', res.data.token);

//         setMessage('Login con Google riuscito!');
//         onLogin(res.data)
//         console.log('Login con Google:', res.data);
//       })
//       .catch((err) => {
//         setError('Errore nel login con Google.');
//         console.error('Errore autenticazione Google:', err);
//       });
//   };

//   // Gestione errore login Google
//   const handleGoogleLoginFailure = (error) => {
//     console.error('Google Login Failed:', error);
//     setError('Errore durante il login con Google. Riprova.');
//   };

//   // Login tradizionale
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const res = await axios.post('http://localhost:3002/login', { email, password });

//     // Salva il token JWT nel localStorage
//      localStorage.setItem('token', res.data.token);

//     setMessage('Login tradizionale riuscito!');
//      console.log('Login tradizionale:', res.data);
//     } catch (err) {
//       setError('Email o password non validi.');
//       console.error('Errore login tradizionale:', err);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h1>Login</h1>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}

//       <form onSubmit={handleSubmit}>
//         <label>Email:</label>
//         <input 
//           type="email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//           required 
//         />
        
//         <label>Password:</label>
//         <input 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           required 
//         />

//         <button type="submit">Login</button>
//       </form>

//       <p>Oppure accedi con Google:</p>
//       <GoogleLogin
//         onSuccess={handleGoogleLoginSuccess}
//         onError={handleGoogleLoginFailure}
//       />
//     </div>
//   );
// };

// export default LoginPage;

import './LoginPage.css';
import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState(''); // solo per la registrazione
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // LOGIN CON GOOGLE
  const handleGoogleLoginSuccess = (response) => {
    const { credential } = response;

    axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/google`, { token: credential })
  .then((res) => {
    localStorage.setItem('token', res.data.token);
    setMessage('Login con Google riuscito!');
    onLogin(res.data);
    console.log('Login con Google:', res.data);
  })
  .catch((err) => {
    setError('Errore nel login con Google.');
    console.error('Errore autenticazione Google:', err);
  });
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
    setError('Errore durante il login con Google. Riprova.');
  };

  // LOGIN TRADIZIONALE
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
  const res = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/login`,
    { email, password }
  );
  localStorage.setItem('token', res.data.token);
  setMessage('Login tradizionale riuscito!');
  onLogin(res.data);
} catch (err) {
  setError('Email o password non validi.');
  console.error('Errore login tradizionale:', err);
}
  };

  // REGISTRAZIONE
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/users`,
    {
      name,
      email,
      password
    }
    );

      localStorage.setItem('token', res.data.token);
      setMessage('Registrazione riuscita! Effettuato accesso.');
      onLogin(res.data);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Errore durante la registrazione.');
      }
      console.error('Errore registrazione:', err);
    }
  };

  return (
    <div className="login-container">
      <h1>{isRegistering ? 'Registrati' : 'Login'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {isRegistering && (
          <>
            <label>Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </>
        )}

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isRegistering ? 'Registrati' : 'Login'}
        </button>
      </form>

      {!isRegistering && (
        <>
          <p>Oppure accedi con Google:</p>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          />
        </>
      )}

      <p style={{ marginTop: '1rem' }}>
        {isRegistering ? 'Hai già un account?' : 'Non hai un account?'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setMessage('');
          }}
          style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {isRegistering ? 'Accedi' : 'Registrati'}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;