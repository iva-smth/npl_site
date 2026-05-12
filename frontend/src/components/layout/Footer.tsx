export function Footer() {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <p className="text-sm">Томск, пр. Ленина, 30</p>
            <p className="text-sm">Email: lab@tpu.ru</p>
          </div>
          
          {/* Навигация */}
          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:text-gray-300">Главная</a></li>
              <li><a href="/directions" className="hover:text-gray-300">Направления</a></li>
              <li><a href="/equipment" className="hover:text-gray-300">Оборудование</a></li>
              <li><a href="/publications" className="hover:text-gray-300">Публикации</a></li>
            </ul>
          </div>
          
          {/* Копирайт */}
          <div>
            <h3 className="text-lg font-bold mb-4">НПЛ ИПЭПТ ТПУ</h3>
            <p className="text-sm">© 2026 Все права защищены</p>
          </div>
        </div>
      </div>
    </footer>
  );
}