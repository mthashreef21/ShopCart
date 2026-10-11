import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import headphoneBanner from '../../assets/Banners/headphone.png'
import smartphoneBanner from '../../assets/Banners/phone.png'
import laptopBanner from '../../assets/Banners/laptop.png'
import fashionBanner from '../../assets/Banners/clothing.png'

const banners = [
  {
    id: 1,
    image: headphoneBanner,
    alt: 'Headphone Promotion Banner',
  },
  {
    id: 2,
    image: smartphoneBanner,
    alt: 'Smartphone Promotion Banner',
  },
  {
    id: 3,
    image: fashionBanner,
    alt: 'Fashion Promotion Banner',
  },
  {
    id: 4,
    image: laptopBanner,
    alt: 'Laptop Promotion Banner',
  },
]

function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Automatically change the banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (previousIndex + 1) % banners.length
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Display the previous banner
  const previousBanner = () => {
    setCurrentIndex((previousIndex) => {
      return previousIndex === 0
        ? banners.length - 1
        : previousIndex - 1
    })
  }

  // Display the next banner
  const nextBanner = () => {
    setCurrentIndex((previousIndex) => {
      return (previousIndex + 1) % banners.length
    })
  }

  return (
    <section className="mx-auto w-[90%] pt-5">

      {/* Main Carousel */}
      <div
        id="default-carousel"
        className="relative w-full"
        aria-label="ShopCart promotional banners"
        aria-roledescription="carousel"
      >

        {/* Carousel Wrapper */}
        <div className="relative h-[280px] w-full overflow-hidden rounded-3xl bg-gray-100 sm:h-[350px] lg:h-[400px]">

          {/* Banner Items */}
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentIndex === index
                  ? 'z-10 opacity-100'
                  : 'z-0 opacity-0 pointer-events-none'
              }`}
              aria-hidden={currentIndex !== index}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="absolute inset-0 block h-full w-full object-fill"
                draggable="false"
              />
            </div>
          ))}

          {/* Previous Button */}
          <button
            type="button"
            onClick={previousBanner}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextBanner}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">

            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show banner ${index + 1}`}
                aria-current={
                  currentIndex === index ? 'true' : undefined
                }
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-7 bg-violet-500'
                    : 'w-2.5 bg-white hover:bg-violet-200'
                }`}
              />
            ))}

          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroBanner