"use client"

import { useState, useEffect } from "react"

interface FarmingTipCardProps {
  onRequestNewTip?: () => void
  tip: string
}

export default function FarmingTipCard({ tip, onRequestNewTip }: FarmingTipCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Efecto para animar la entrada de un nuevo consejo
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [tip])

  return (
    <div className={`farming-tip-container ${isAnimating ? "tip-fade-in" : ""}`}>
      <div className="farming-tip">
        <span className="tip-icon">💡</span>
        <p>{tip}</p>
        <button onClick={onRequestNewTip} className="next-tip-button" aria-label="Ver otro consejo">
          Siguiente consejo
        </button>
      </div>
    </div>
  )
}
