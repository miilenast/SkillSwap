import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import type { User } from '../../types/User';
import SkillForm from './SkillFormModal';
import type { Skill } from '../../types/Skill';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        console.error('Korisnik nije prijavljen');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/auth/profile`, {
          headers: {
          'Authorization': `Bearer ${token}`,
        }
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          console.error('Greška pri preuzimanju korisničkih podataka:', data);
          alert('Greška pri učitavanju profila.');
        }
      } catch (error) {
        console.error('Došlo je do greške pri slanju zahteva:', error);
      }
};

  fetchUserData();
  }, []);

  const handleSaveSkills = async (updatedSkills: Omit<Skill, 'id'>[]) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const createPromises = updatedSkills.map(async (skill) => {
        try {
            const response = await fetch(`http://localhost:3000/user/skills`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(skill),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error(`Greška pri ažuriranju veština:`, data);
                return null;
            }
            setUser({...user!, offers: data.offers });
            setShowSkillForm(false);
        } catch (error) {
            console.error('Došlo je do greške pri slanju zahteva:', error);
            return null;
        }
    });

    await Promise.all(createPromises);

    const response = await fetch(`http://localhost:3000/auth/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const updatedUser = await response.json();

    if (response.ok) {
        setUser(updatedUser);
        setShowSkillForm(false);
    } else {
        console.error('Greška pri ažuriranju profila nakon izmene veština:', updatedUser);
        alert('Profil nije uspešno ažuriran.');
    }
  };

  const handleCloseSkillForm = () => {
    setShowSkillForm(false);
  };

  if (!user) {
    return <div className={styles.container}>Učitavanje profila...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <img src={user.profilePicture} alt="Profilna slika" className={styles.profileImage} />
        <h1 className={styles.username}>{user.username}</h1>
      </div>
      <div className={styles.profileDetails}>
        <div className={styles.detailItem}>
          <span>Ime i prezime:</span>
          <span>{user.firstName} {user.lastName}</span>
        </div>
        <div className={styles.detailItem}>
          <span>Email:</span>
          <span>{user.email}</span>
        </div>
        <div className={styles.detailItem}>
          <span>Broj telefona:</span>
          <span>{user.phoneNumber}</span>
        </div>
      </div>
      <div className={styles.skillsSection}>
        <h2>Veštine</h2>
        <ul className={styles.skillsList}>
          {Array.isArray(user.offers) && user.offers.map((offer, index) => (
            <li key={offer.id || index}>{offer.title}</li>
          ))}
        </ul>
        <button className={styles.manageSkillsButton} onClick={() => setShowSkillForm(true)}>Izmeni veštine</button>
      </div>

      {showSkillForm && (
        <SkillForm
          skills={user.offers ?? []}
          onClose={handleCloseSkillForm}
          onSave={handleSaveSkills}
        />
      )}
    </div>
  );
};

export default UserProfile;