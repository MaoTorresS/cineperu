
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';
import MisPeliculas from '../pages/MisPeliculas';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MovieDetail from '../pages/MovieDetail';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MainLayout from '../layout/MainLayout';
import SearchPage from '../pages/SearchPage';

const AppRouter: React.FC = () => (
  <Router>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/buscar" element={<SearchPage />} />
        <Route path="/pelicula/:id" element={<MovieDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/mis-peliculas" element={<MisPeliculas />} />
      </Routes>
    </MainLayout>
  </Router>
);
export default AppRouter;
