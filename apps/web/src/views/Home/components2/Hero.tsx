import React from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'

const Hero = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleLaunchApp = () => {
    router.push('/swap')  // Redirect ke halaman "/swap"
  }

  return (
    <div className="corner-border bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex h-screen md:h-auto flex-col md:flex-row justify-center items-center">
      <div className="flex-1 flex flex-col justify-center md:justify-start items-center md:items-start md:p-4 md:mb-4">
        <div className="text-center md:text-left px-1 py-2">
          <h1 className="md:text-4xl text-2xl font-bold text-white">
            DEX, <span style={{color: '#61ffbd'}}>SocialFi</span> And LaunchPad in <span style={{color: '#fcff3d'}}>One</span> Platform
          </h1>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left mt-4">
          <p className="md:text-xl text-md text-white lowerchase">
            {t('Trade, Stake, & Earn With 5IRE BlockChain')}
          </p>
        </div>

        <div className="flex justify-center md:justify-start w-full mt-6">
          <button type="button" onClick={handleLaunchApp} className="home-bt text-white font-bold px-6 py-3 rounded-lg">
            {t('Launch App')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="md:flex justify-center items-center bg-transparent p-2">
          <img
            className="md:w-80 md:h-80 w-70 h-60 md:absolute md:top-10 md:translate-y-1/2"
            src="https://cdn3d.iconscout.com/3d/premium/thumb/trading-and-invest-app-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--analytics-logo-loss-hand-holding-phone-pack-miscellaneous-illustrations-4723729.png"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
