import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/services/auth';
import type { User } from '../../types';

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    authApi.getCurrentUser()
      .then((response) => setUser(response.data))
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = () => {
    authApi.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/admin/login');
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Выйти
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Добро пожаловать, {user.username}!</h2>
        <p className="text-gray-600 mb-4">Роль: {user.role}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <a href="/admin/research/" className="p-4 border rounded hover:shadow transition">
            <h3 className="font-bold">Направления</h3>
            <p className="text-sm text-gray-600">Управление направлениями</p>
          </a>
          <a href="/admin/equipment/" className="p-4 border rounded hover:shadow transition">
            <h3 className="font-bold">Оборудование</h3>
            <p className="text-sm text-gray-600">Каталог оборудования</p>
          </a>
          <a href="/admin/publications/" className="p-4 border rounded hover:shadow transition">
            <h3 className="font-bold">Публикации</h3>
            <p className="text-sm text-gray-600">Научные работы</p>
          </a>
          <a href="/admin/team/" className="p-4 border rounded hover:shadow transition">
            <h3 className="font-bold">Команда</h3>
            <p className="text-sm text-gray-600">Сотрудники лаборатории</p>
          </a>
        </div>
      </div>
    </div>
  );
}