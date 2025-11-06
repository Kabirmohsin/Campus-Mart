import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Laptop, FileText, Shield, Truck, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/Products/ProductGrid';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { products, loading } = useProducts();
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 8);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Main Carousel Slides with local images
  const carouselSlides = [
    {
      id: 1,
      image: "/images/slide1.jpg"
    },
    {
      id: 2,
      image: "/images/slide2.jpg"
    },
    {
      id: 3,
      image: "/images/slide3.jpg"
    },
    {
      id: 4,
      image: "/images/slide4.jpg"
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleStartSelling = () => {
    if (user) {
      if (isSeller()) {
        navigate('/seller/dashboard');
        toast.success('Welcome to your seller dashboard!');
      } else {
        if (window.confirm('You need to become a seller to list products. Would you like to upgrade to seller account?')) {
          navigate('/seller/dashboard');
          toast.success('Welcome to seller dashboard!');
        }
      }
    } else {
      navigate('/login?intent=seller');
      toast.success('Login to start selling!');
    }
  };

  return (
    <div className="min-h-screen">
      {/* MAIN HERO SLIDER SECTION - ONLY IMAGES */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="relative h-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Background Image Only - No Text, No Buttons */}
              <img 
                src={slide.image}
                alt={`Slide ${slide.id}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${slide.image}`);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Rest of your sections remain EXACTLY THE SAME */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '2,000+', label: 'Happy Students' },
              { number: '500+', label: 'Successful Transactions' },
              { number: '4.8/5', label: 'Average Rating' },
              { number: '24/7', label: 'Campus Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Textbooks',
                description: 'Find required and recommended textbooks for your courses',
                count: '150+ Books',
                link: '/products?category=textbook'
              },
              {
                icon: Laptop,
                title: 'Gadgets',
                description: 'Laptops, tablets, calculators and other tech essentials',
                count: '80+ Gadgets',
                link: '/products?category=gadget'
              },
              {
                icon: FileText,
                title: 'Notes',
                description: 'Well-organized lecture notes and study materials',
                count: '200+ Notes',
                link: '/products?category=notes'
              }
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => navigate(category.link)}
                className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition duration-300 group cursor-pointer border border-gray-200"
              >
                <category.icon className="h-16 w-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <span className="text-blue-600 font-semibold">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover popular items from our student community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>View All Products</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose CampusMart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Trading',
                description: 'Verified student accounts ensure safe transactions'
              },
              {
                icon: Truck,
                title: 'Cash on Delivery',
                description: 'Pay when you receive your items on campus'
              },
              {
                icon: Clock,
                title: 'Quick Delivery',
                description: 'Get your items delivered within campus in hours'
              },
              {
                icon: Users,
                title: 'Campus Community',
                description: 'Buy and sell with trusted fellow students'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center bg-white p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join CampusMart?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start buying and selling with your campus community today
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Browse Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;