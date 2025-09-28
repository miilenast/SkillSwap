import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Skill Swap</Link>
      <div className={styles.navLinks}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className={styles.navLink}>Prijavi se</Link>
            <Link to="/register" className={styles.navLink}>Registruj se</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className={styles.navLink}>Profil</Link>
            <Link to="/requests" className={styles.navLink}>Zahtevi</Link>
            <button onClick={handleLogout} className={styles.logoutButton}>Odjavi se</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;