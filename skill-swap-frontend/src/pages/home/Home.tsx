import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      {isLoggedIn ? (
        <div className={styles.loggedInContent}>
          <h1 className={styles.heading}>Dobrodošao/la nazad!</h1>
          <p className={styles.text}>Spreman/spremna za razmenu veština?</p>
          {/* Ovde možeš dodati linkove ili komponente za ulogovane korisnike */}
        </div>
      ) : (
        <div className={styles.loggedOutContent}>
          <h1 className={styles.heading}>Dobrodošli u Skill Swap!</h1>
          <p className={styles.description}>
            Platforma za razmenu veština među komšijama.
            Pronađi nekoga sa veštinom koja ti je potrebna i ponudi svoju u zamenu.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
