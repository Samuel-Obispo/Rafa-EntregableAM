"use client"

import { useEffect, useState } from "react"
import ParcelasList from "../Components/ParcelaList/ParcelasList"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import "../Styles/ParcelasEliminadas.css"
import { fetchAllData } from "../Services/api"

interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimo_riego: string
  latitud: string
  longitud: string
  is_deleted: number
}

const ParcelasEliminadas = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParcelasEliminadas = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener todos los datos desde el endpoint
      const allData = await fetchAllData()
      console.log("Datos completos recibidos:", allData)

      // Filtrar solo las parcelas eliminadas (is_deleted = 1)
      const parcelasEliminadas = allData.parcelas ? allData.parcelas.filter((p: Parcela) => p.is_deleted === 1) : []

      console.log("Parcelas eliminadas filtradas:", parcelasEliminadas)
      setParcelas(parcelasEliminadas)
    } catch (error: any) {
      console.error("Error al obtener las parcelas eliminadas:", error)
      setError("No se pudieron cargar las parcelas eliminadas. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParcelasEliminadas()
  }, [])

  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-main">
          <Header />
          <div className="dashboard-content">
            <div className="parcelas-eliminadas-container">
              <h1 className="parcelas-eliminadas-title">Parcelas Eliminadas</h1>
              <p className="parcelas-eliminadas-description">Historial de parcelas que fueron eliminadas</p>

              {error && (
                <div className="parcelas-eliminadas-error">
                  <div className="parcelas-eliminadas-error-icon">!</div>
                  <div className="parcelas-eliminadas-error-content">
                    <p className="parcelas-eliminadas-error-message">{error}</p>
                    <button className="parcelas-eliminadas-error-button" onClick={fetchParcelasEliminadas}>
                      Reintentar
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="parcelas-eliminadas-loading">
                  <div className="parcelas-eliminadas-loading-spinner"></div>
                  <p className="parcelas-eliminadas-loading-text">Cargando parcelas eliminadas...</p>
                </div>
              ) : (
                <div className="parcelas-eliminadas-content">
                  <ParcelasList parcelas={parcelas} />
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default ParcelasEliminadas

