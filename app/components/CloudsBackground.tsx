import React from 'react'

const CloudsBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="clouds-svg animate-clouds"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <g>
        <ellipse cx="300" cy="200" rx="120" ry="60" fill="#fff" opacity="0.7">
          <animate
            attributeName="cx"
            values="300;1700;300"
            dur="30s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="700" cy="350" rx="100" ry="50" fill="#fff" opacity="0.6">
          <animate
            attributeName="cx"
            values="700;1800;700"
            dur="40s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="1200" cy="150" rx="140" ry="70" fill="#fff" opacity="0.8">
          <animate
            attributeName="cx"
            values="1200;200;1200"
            dur="35s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="1600" cy="500" rx="110" ry="55" fill="#fff" opacity="0.5">
          <animate
            attributeName="cx"
            values="1600;100;1600"
            dur="50s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="900" cy="700" rx="130" ry="65" fill="#fff" opacity="0.6">
          <animate
            attributeName="cx"
            values="900;1700;900"
            dur="45s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
  </div>
)

export default CloudsBackground
