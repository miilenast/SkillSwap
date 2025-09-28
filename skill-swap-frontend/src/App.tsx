import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Register from './pages/register/Register';
import Login from './pages/login/Login.tsx';
import UserProfile from './pages/profile/Profile.tsx';
import Navbar from './navbar/Navbar.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

function App() {
  return (
    <>
      <Navbar />
      <div style ={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App
