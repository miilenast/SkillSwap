/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
    profilePicture: File | null;
    profilePreview: string;
  }>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    profilePicture: null,
    profilePreview: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        profilePreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Podaci za registraciju:', formData);
    console.log('Da li slika postoji:', formData.profilePicture);

    const { profilePicture, profilePreview, ...data } = formData;

    try{
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if(!response.ok){
        console.error('Greška pri registraciji:', result);
        alert(`Došlo je do greške pri registraciji. ${result.message || ''}`);
        return;
      }
      console.log('Uspešna registracija:', result);
      alert('Uspešno ste se registrovali!');
      
      const pp = formData.profilePicture instanceof FileList ? formData.profilePicture[0] : formData.profilePicture;
      if (pp instanceof File) {
        const imageData = new FormData();
        imageData.append('profilePicture', pp);
        const userId = result.id;
        const token = result.token.access_token;
        const imageResponse = await fetch(`http://localhost:3000/user/${userId}/profile-picture`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageData,
        });

        const imageResult = await imageResponse.json();
        if (!imageResponse.ok) {
          console.error('Greška pri uploadu slike:', imageResult);
        }
        else{
          navigate('/login');
        }
      }
      else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Greška pri slanju zahteva:', error);
      alert('Došlo je do greške. Pokušajte ponovo.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h1 className={styles.heading}>Registruj se</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImageContainer}>
              {!formData.profilePreview ? (
                <label htmlFor="profilePicture" className={styles.profileImageLabel}>
                  <span className={styles.profileImagePlaceholder}>Dodaj profilnu sliku</span>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    className={styles.profileImageInput}
                    onChange={handleChange}
                  />
                </label>
              ) : (
                <img
                  src={formData.profilePreview}
                  alt="Preview"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginTop: '15px',
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.row}>
            <input
              type="text"
              name="firstName"
              placeholder="Ime"
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Prezime"
              className={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
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
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            value={formData.email}
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
          <input
            type="text"
            name="address"
            placeholder="Adresa"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Broj telefona"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.button}>Registruj se</button>
        </form>
      </div>
    </div>
  );
};

export default Register;