import React, { useState, useEffect } from 'react';

const TestSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ WORKING ONLINE IMAGES - Guaranteed to load
  const slides = [
    {
      id: 1,
      image: "images/slide1.jpg",
      title: "Textbooks for Every Course",
      description: "Find all your required textbooks at affordable prices"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=500&fit=crop", 
      title: "Campus Tech Essentials",
      description: "Laptops, tablets, calculators and gadgets"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=500&fit=crop",
      title: "Quality Study Notes", 
      description: "Access well-organized lecture notes and materials"
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 overflow-hidden rounded-xl shadow-2xl">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <img 
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
      
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-300 shadow-lg z-10"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-300 shadow-lg z-10"
      >
        →
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestSlider;