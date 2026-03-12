'use client'
// This is a Lottie cloud animation component for the homepage background.
import React from 'react'
import Lottie from 'lottie-react'
import cloudAnimation from './clouds-lottie.json'

const LottieCloudsBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
    <Lottie
      animationData={cloudAnimation}
      loop={true}
      style={{ width: '100vw', height: '100vh' }}
    />
  </div>
)

export default LottieCloudsBackground
