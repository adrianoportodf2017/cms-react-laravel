import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Slide } from '../types/slide'

export function Slides() {
  const slides: Slide[] = [
    {
      title: 'Dia de Solidariedade COOPERFORTE',
      subtitle: '',
      cta: 'Doe agora e faça parte dessa corrente do bem!',
      link: '/doar',
      img: 'slide1.png',
      imgMobile: 'slide1-mobile.png', // Imagem específica para mobile
    },
    {
      title: 'Instituto COOPERFORTE',
      subtitle: 'Transformando realidades',
      cta: 'Associe-se',
      link: '/doar',
      img: '/slide2.png',
      imgMobile: '/slide2-mobile.png', // Imagem específica para mobile
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  // Efeito para transição automática dos slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000) // Muda a cada 5 segundos

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }

  return (
    <div className="space-y-20">
      {/* Hero com Carrossel */}
      <section className="">
        <div className="relative overflow-hidden">
          {/* Layout Desktop */}
          <div className="relative h-[60vh] hidden md:block">
            {slides.map((s, idx) => (
               <Link
                      to={s.link}
                      className="mt-6 inline-block bg-[#ffcc00] text-black text-2xl px-8 py-5 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition-colors"
                    >
              <div
                key={idx}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{ 
                  backgroundImage: `url(${s.img})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <div className="container mx-auto px-4 relative flex items-center h-full">
                  <div className="max-w-xl">
                    <h1 className="text-2xl md:text-5xl font-extrabold text-black">{s.title}</h1>
                    <h2 className="text-1xl md:text-3xl font-bold text-black-500">{s.subtitle}</h2>
                   
                      {s.cta}
                   
                  </div>
                </div>
              </div>
               </Link>
            ))}

            {/* Botões de navegação - Desktop */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Slide anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffcc00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Próximo slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffcc00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores de slide - Desktop */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-orange-500' : 'bg-white/80'} hover:bg-orange-400 transition-colors`}
                  aria-label={`Ir para o slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Layout Mobile */}
          <div className="relative md:hidden">
            {slides.map((s, idx) => (
              <div
                key={`mobile-${idx}`}
                className={`transition-opacity duration-1000 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'
                }`}
              >
                {/* Imagem Mobile com conteúdo sobreposto - 85vh */}
                <div 
                  className="h-[85vh] w-full relative flex items-end"
                  style={{ 
                    backgroundImage: `url(${s.imgMobile})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }}
                >
                  {/* Overlay para melhorar legibilidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Conteúdo Mobile - Sobreposto na parte inferior */}
                  <div className="relative z-10 w-full px-4 pb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg">{s.title}</h1>
                    {s.subtitle && (
                      <h2 className="text-xl font-bold text-white mb-6 drop-shadow-md">{s.subtitle}</h2>
                    )}
                    <Link
                      to={s.link}
                      className="inline-block bg-[#ffcc00] text-black lg:text-lg text-md px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition-colors"
                    >
                      {s.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Botões de navegação - Mobile */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 top-[40vh] transform -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Slide anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-[40vh] transform -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Próximo slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores de slide - Mobile */}
            <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-[#ffcc00]' : 'bg-white/80'} hover:bg-orange-400 transition-colors`}
                  aria-label={`Ir para o slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}