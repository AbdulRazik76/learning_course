import { useState, useEffect } from 'react';
import image from "../../assets/heroSection.jpg"
import image2 from "../../assets/hs.png"


const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Your slides data
  const slides = [
    {
      image: image,
      title: "Build Your Skills",
      subtitle: "Choose a right platform to learn",
      button1: "Get Started",
      button2: "Know More"
    },
    {
      image: image2,
      title: "Learn From Experts",
      subtitle: "Quality education at your fingertips",
      button1: "Enroll Now",
      button2: "View Courses"
    },
    // Add more slides as needed
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative bg-white text-black h-96 overflow-hidden">
      {/* Slides container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 grid grid-cols-3">
            <div className="flex justify-center items-center">
              <img src={slide.image} className="h-96 w-1/2 object-cover" alt="" />
            </div>
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-gray-800 text-4xl font-bold mt-4">{slide.title}</h1>
              <p className="text-gray-500 font-bold italic mt-2">{slide.subtitle}</p>
              <div className="flex mt-4">
                <button className="bg-black rounded-md font-bold h-10 w-36 text-white cursor-pointer hover:bg-gray-800 mr-4">
                  {slide.button1}
                </button> 
                <button className="rounded-md font-bold h-10 w-36 border-2 cursor-pointer hover:bg-gray-100">
                  {slide.button2}
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={slides[(index + 1) % slides.length].image} className="h-96 w-1/2 object-cover" alt="" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-black' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &lt;
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;    