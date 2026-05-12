import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/Dashboard';
import { DirectionsPage } from './pages/public/DirectionsPage';
import { DirectionPage } from './pages/public/DirectionPage';
import { EquipmentPage } from './pages/public/EquipmentPage';
// 👇 ДОБАВЬТЕ ЭТУ СТРОКУ ИМПОРТА
import { EquipmentDetailPage } from './pages/public/EquipmentDetailPage'; 
import { PublicationsPage } from './pages/public/PublicationsPage';
import { TeamPage } from './pages/public/TeamPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="directions" element={<DirectionsPage />} />
          <Route path="directions/:slug" element={<DirectionPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          {/* 👇 Убедитесь, что этот роут есть */}
          <Route path="equipment/:slug" element={<EquipmentDetailPage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="team" element={<TeamPage />} />
        </Route>

        {/* Админ-панель */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;