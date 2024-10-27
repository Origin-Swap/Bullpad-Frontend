import React from 'react'
import useTheme from 'hooks/useTheme'
import Hero from './components2/Hero'

const Home: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div style={{
      position: 'relative',
      height: '100vh', // Pastikan untuk menetapkan tinggi agar terlihat
      overflow: 'hidden', // Menyembunyikan elemen yang melampaui batas
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url('/images/5569176.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transform: 'scaleX(-1)', // Menerapkan transformasi mirror pada latar belakang
        zIndex: -1, // Memastikan elemen ini di belakang konten lain
      }} />
      <Hero />
    </div>
  );
}

export default Home
