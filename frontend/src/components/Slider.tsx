import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { ResearchDirection } from '../types';

interface DirectionSliderProps {
  directions: ResearchDirection[];
}

export function DirectionSlider({ directions }: DirectionSliderProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Направления исследований</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="mb-8"
      >
        {directions.map((direction) => (
          <SwiperSlide key={direction.id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              {direction.image_url && (
                <img
                  src={direction.image_url}
                  alt={direction.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{direction.title}</h3>
                <p className="text-gray-600 mb-4">
                  {direction.description.substring(0, 100)}...
                </p>
                <a
                  href={`/directions/${direction.slug}`}
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Подробнее →
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}