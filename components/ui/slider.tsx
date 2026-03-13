'use client'

import * as React from 'react'

interface SliderProps {
  min: number
  max: number
  step: number
  value: number[]
  onValueChange: (value: number[]) => void
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ min, max, step, value, onValueChange, className }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative flex items-center ${className || ''}`}
      >
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={e => onValueChange([parseFloat(e.target.value)])}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
