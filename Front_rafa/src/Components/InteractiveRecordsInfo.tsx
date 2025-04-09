"use client"

import { useState, useEffect } from "react"
import FarmingTipCard from "./FarmingTipCard"
import { getRandomTip, getSeasonalTip, getWeatherBasedTip } from "../data/farming-tips"
import "../styles/farming-tips.css"

interface InteractiveRecordsInfoProps {
  recordsShown: number
  totalRecords: number
  onRecordsChange: (amount: number) => void
  currentTemperature?: number
  currentHumidity?: number
}

export default function InteractiveRecordsInfo({
  recordsShown,
  totalRecords,
  onRecordsChange,
  currentTemperature,
  currentHumidity,
}: InteractiveRecordsInfoProps) {
  const [currentTip, setCurrentTip] = useState<string>("")
  const [tipType, setTipType] = useState<"random" | "seasonal" | "weather">("random")

  // Función para obtener un nuevo consejo
  const getNewTip = () => {
    // Determinar aleatoriamente qué tipo de consejo mostrar
    const tipTypes: ("random" | "seasonal" | "weather")[] = ["random", "seasonal", "weather"]
    const newTipType = tipTypes[Math.floor(Math.random() * tipTypes.length)]

    setTipType(newTipType)

    if (newTipType === "seasonal") {
      setCurrentTip(getSeasonalTip())
    } else if (newTipType === "weather" && currentTemperature && currentHumidity) {
      setCurrentTip(getWeatherBasedTip(currentTemperature, currentHumidity))
    } else {
      setCurrentTip(getRandomTip())
    }
  }

  // Inicializar consejo y configurar cambio periódico
  useEffect(() => {
    getNewTip()
    const tipInterval = setInterval(getNewTip, 45000) // Cambiar consejo cada 45 segundos
    return () => clearInterval(tipInterval)
  }, [currentTemperature, currentHumidity])

  return (
    <div className="data-info-container">
      <div className="data-info">
        <div className="records-selector">
          <span>Mostrar últimos: </span>
          <div className="records-buttons">
            <button className={recordsShown === 10 ? "active" : ""} onClick={() => onRecordsChange(10)}>
              10
            </button>
            <button className={recordsShown === 20 ? "active" : ""} onClick={() => onRecordsChange(20)}>
              20
            </button>
            <button className={recordsShown === 50 ? "active" : ""} onClick={() => onRecordsChange(50)}>
              50
            </button>
          </div>
        </div>
        <span className="records-count">
          Mostrando {Math.min(recordsShown, totalRecords)} de {totalRecords} registros
        </span>
      </div>

      <FarmingTipCard
        tip={currentTip}
        onRequestNewTip={getNewTip}
        className={tipType === "seasonal" ? "seasonal-tip" : tipType === "weather" ? "weather-tip" : ""}
      />
    </div>
  )
}
