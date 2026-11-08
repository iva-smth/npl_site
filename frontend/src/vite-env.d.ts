/// <reference types="vite/client" />

// Объявляем типы для импорта CSS модулей
declare module '*.css' {
  const content: string;
  export default content;
}

// Специфично для swiper/css, если общий тип выше не сработает
declare module 'swiper/css';
declare module 'swiper/css/navigation';
declare module 'swiper/css/pagination';