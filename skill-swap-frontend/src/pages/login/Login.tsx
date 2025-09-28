import React, { useState } from 'react';
import styles from '../register/Register.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('userId', JSON.stringify(result.user));
        
        login();
        navigate('/');
      } else {
        console.error('Greška pri prijavi:', result);
        alert(`Greška: ${result.message || 'Neuspešna prijava'}`);
      }
    } catch (error) {
      console.error('Greška pri slanju zahteva:', error);
      alert('Došlo je do greške. Pokušajte ponovo.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h1 className={styles.heading}>Prijavi se</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Korisničko ime"
            className={styles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Šifra"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.button}>Prijavi se</button>
        </form>
      </div>
    </div>
  );
};

export default Login;