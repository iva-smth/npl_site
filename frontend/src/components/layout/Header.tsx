import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-primary text-white py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            НПЛ ИПЭПТ
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link to="/directions" className="hover:text-gray-300">
                Направления
              </Link>
            </li>
            <li>
              <Link to="/equipment" className="hover:text-gray-300">
                Оборудование
              </Link>
            </li>
            <li>
              <Link to="/publications" className="hover:text-gray-300">
                Публикации
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-gray-300">
                Команда
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="hover:text-gray-300">
                Контакты
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}