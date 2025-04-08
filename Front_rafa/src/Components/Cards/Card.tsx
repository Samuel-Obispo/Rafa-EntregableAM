"use client"

import type React from "react"
import "./Card.css"

interface CardProps {
  title: string
  value: string
  unit: string
  loading?: boolean
}

const Card: React.FC<CardProps> = ({ title, value, unit, loading = false }) => {
  // Determinar la clase basada en el título
  const getCardClass = () => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes("temperatura")) return "temperature"
    if (titleLower.includes("humedad")) return "humidity"
    if (titleLower.includes("lluvia")) return "rain"
    if (titleLower.includes("sol") || titleLower.includes("intensidad")) return "sun"
    return ""
  }

  return (
    <div className={`card ${getCardClass()} ${loading ? "loading" : ""}`}>
      <h3 className="card-title">{title}</h3>
      <div className="card-value">{value}</div>
      <div className="card-unit">{unit}</div>
    </div>
  )
}

export default Card

