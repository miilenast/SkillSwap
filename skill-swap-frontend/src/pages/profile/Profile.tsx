import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import type { User } from '../../types/User';
import SkillForm from './SkillFormModal';
import type { Skill } from '../../types/Skill';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showSkillForm, setShowSkillForm] = useState<'edit' | 'delete' | 'add' | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Skill | null>(null);

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

      if (!response.ok) {
        console.error('Greška pri preuzimanju korisničkih podataka:', data);
        alert('Greška pri učitavanju profila.');
        return;
      } 

      const offersRes = await fetch(`http://localhost:3000/skill-offer?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const offersData = await offersRes.json();

      setUser({ ...data, offers: offersData });
    
    } catch (error) {
      console.error('Došlo je do greške pri slanju zahteva:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAction = async (action: 'edit' | 'delete' | 'add', skill?: Skill) => {
    setSelectedSkills(skill || null);
    setShowSkillForm(action);
  };

  const handleSave = async (skillData: Skill) => {
    const token = localStorage.getItem('token');
    if(!token) return;

    const url = showSkillForm === 'add' 
      ? `http://localhost:3000/skill-offer` 
      : `http://localhost:3000/skill-offer/${selectedSkills?.id}`;
    const method = showSkillForm === 'add' ? 'POST' : 'PATCH';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error(`Greška pri ažuriranju veština:`, data);
        return null;
      }

      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        if (showSkillForm === 'add') {
          return { ...prevUser, offers: [...(prevUser.offers ?? []), data] };
        } else {
          return {
            ...prevUser,
            offers: prevUser.offers?.map((o) => (o.id === data.id ? data : o)) ?? [],
          };
        }
      });
      setShowSkillForm(null);
    } catch (error) {
      console.error('Došlo je do greške pri slanju zahteva:', error);
      return null;
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedSkills) return;

    try {
      const response = await fetch(`http://localhost:3000/skill-offer/${selectedSkills.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser!,
          offers: (prevUser?.offers ?? []).filter((offer) => offer.id !== selectedSkills.id),
        }));
        setShowSkillForm(null);
      } else {
        const data = await response.json();
        console.error(`Greška pri brisanju veština:`, data);
      }
    } catch (error) {
      console.error('Došlo je do greške pri slanju zahteva:', error);
    }
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
        <div className={styles.skillsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.column}>Kategorija</div>
            <div className={styles.column}>Opis</div>
            <div className={styles.column}>Status</div>
            <div className={styles.column}></div>
          </div>
          {Array.isArray(user.offers) && user.offers.map(offer => (
            <div key={offer.id} className={styles.tableRow}>
              <div className={styles.column}>{offer.title}</div>
              <div className={styles.column}>{offer.description}</div>
              <div className={styles.column}>{offer.status}</div>
              <div className={styles.column}>
                <button onClick={() => handleAction('edit', offer)}>Izmeni</button>
                <button onClick={() => handleAction('delete', offer)}>Obriši</button>
              </div>
            </div>
          ))}
          <div className={styles.tableRow}>
            <button className={styles.newButton} onClick={() => handleAction('add')}>
              Nova veština
            </button>
          </div>
        </div>
      </div>

      {showSkillForm && (
        <SkillForm
          mode={showSkillForm}
          skill={selectedSkills}
          onClose={() => setShowSkillForm(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default UserProfile;