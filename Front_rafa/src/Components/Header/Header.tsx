"use client"

import type React from "react"
import { useLocation } from "react-router-dom"
import "./Header.css"

const Header: React.FC = () => {
  const location = useLocation()

  // Función para obtener el título según la ruta
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Monitoreo de Parcelas"
      case "/estadisticas":
        return "Monitoreo de Parcelas"
      case "/parcelasEliminadas":
        return "Monitoreo de Parcelas"
      default:
        return "Monitoreo de Parcelas"
    }
  }

  return (
    <header className="page-header">
      <h1 className="page-header-title">{getPageTitle()}</h1>
    </header>
  )
}

export default Header

