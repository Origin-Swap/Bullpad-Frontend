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
    <div className="flex h-screen flex-col md:flex-row justify-center items-center">
      <div className="flex-1 flex flex-col justify-center md:justify-start items-center md:items-start md:p-4 md:mb-4">
        <div className="text-center md:text-left px-4 md:px-6 py-2">
          <h1 className="md:text-4xl text-2xl font-bold text-black">
            DEX, <span style={{color: '#4ade80'}}>SocialFi</span> And LaunchPad in <span style={{color: '#fde047'}}>One</span> Platform
          </h1>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left mt-4">
          <p className="md:text-xl text-md text-black md:px-6 lowerchase">
            {t('Trade, Stake, & Earn With 5IRE BlockChain')}
          </p>
        </div>

        <div className="flex justify-center md:justify-start md:px-6 w-full mt-6 ">
          <button type="button" onClick={handleLaunchApp} className="home-bt text-white font-bold px-6 py-3 rounded-lg">
            {t('Launch App')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center p-6 hidden md:block">
        <div className="md:flex justify-center items-center bg-transparent p-2">
          <img
            className="md:w-[310px] md:h-[310px] w-70 h-60 "
            src="https://cdn3d.iconscout.com/3d/premium/thumb/trading-and-invest-app-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--analytics-logo-loss-hand-holding-phone-pack-miscellaneous-illustrations-4723729.png"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
