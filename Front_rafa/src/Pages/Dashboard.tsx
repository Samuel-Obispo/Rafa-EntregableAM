"use client"

import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import Card from "../Components/Cards/Card"
import Map from "../Components/Map/Map"
import "../Styles/Dashboard.css"
import { fetchAllData, fetchDatosGenerales } from "../Services/api"

interface SensorData {
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
  fecha?: string
}

interface Parcela {
  id: number
  nombre: string
  latitud: number
  longitud: number
  ubicacion?: string
  tipo_cultivo: string
  responsable: string
  ultimo_riego: string
  is_deleted: number
}

const Dashboard = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [sensorData, setSensorData] = useState<SensorData>({
    temperatura: 0,
    humedad: 0,
    lluvia: 0,
    sol: 0,
  })
  const [lastUpdate, setLastUpdate] = useState<string>("No hay datos")
  const [dataDate, setDataDate] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Obtener todos los datos desde el endpoint /api/dump
      const allData = await fetchAllData()
      console.log("Datos completos:", allData)

      // Extraer parcelas
      if (allData.parcelas) {
        setParcelas(allData.parcelas)
      }

      // Obtener datos de sensores usando la función actualizada
      const sensorDataRes = await fetchDatosGenerales()
      console.log("Datos de sensores:", sensorDataRes)

      // Verificar si hay datos de sensores y si son válidos
      if (sensorDataRes && sensorDataRes.data) {
        // Asegurarse de que todos los valores sean números válidos o 0 por defecto
        const temperatura =
          typeof sensorDataRes.data.temperatura === "number" && !isNaN(sensorDataRes.data.temperatura)
            ? sensorDataRes.data.temperatura
            : 0

        const humedad =
          typeof sensorDataRes.data.humedad === "number" && !isNaN(sensorDataRes.data.humedad)
            ? sensorDataRes.data.humedad
            : 0

        const lluvia =
          typeof sensorDataRes.data.lluvia === "number" && !isNaN(sensorDataRes.data.lluvia)
            ? sensorDataRes.data.lluvia
            : 0

        const sol =
          typeof sensorDataRes.data.sol === "number" && !isNaN(sensorDataRes.data.sol) ? sensorDataRes.data.sol : 0

        setSensorData({
          temperatura,
          humedad,
          lluvia,
          sol,
          fecha: sensorDataRes.data.fecha || "",
        })

        if (sensorDataRes.data.fecha) {
          setDataDate(new Date(sensorDataRes.data.fecha).toLocaleString())
        } else {
          setDataDate("No disponible")
        }
      } else {
        // Si no hay datos de sensores, establecer valores predeterminados
        console.log("No se encontraron datos de sensores, usando valores predeterminados")
        setSensorData({
          temperatura: 0,
          humedad: 0,
          lluvia: 0,
          sol: 0,
        })
        setDataDate("No disponible")
      }

      setLastUpdate(new Date().toLocaleString())
    } catch (err: any) {
      console.error("Error al obtener datos:", err)
      setError(err.message || "Error al cargar los datos")
      // Establecer valores predeterminados en caso de error
      setSensorData({
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
      })
      setDataDate("No disponible")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filtrar parcelas para excluir las eliminadas
  const filtrarParcelasActivas = () => {
    return parcelas.filter((parcela) => parcela.is_deleted === 0)
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchData}>Reintentar</button>
      </div>
    )
  }

  // Obtener solo las parcelas activas para el mapa
  const parcelasActivas = filtrarParcelasActivas()
  console.log("Parcelas activas para mostrar en el mapa:", parcelasActivas)

  // Función para renderizar el valor del sensor de forma segura
  const renderSensorValue = (value: number) => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0.0"
    }
    return value.toFixed(1)
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar />

        <div className="dashboard-main">
          <Header />

          <main className="dashboard-content">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-description">Bienvenido al panel de control</p>
            </div>

            <div className="dashboard-container">
              <div className="dashboard-grid">
                <div className="dashboard-map-container">
                  {/* Pasar solo las parcelas activas al mapa */}
                  <Map parcelas={parcelasActivas} />
                </div>

                <div className="dashboard-cards-grid">
                  <Card
                    title="Temperatura"
                    value={renderSensorValue(sensorData.temperatura)}
                    unit="°C"
                    loading={isLoading}
                  />
                  <Card title="Humedad" value={renderSensorValue(sensorData.humedad)} unit="%" loading={isLoading} />
                  <Card title="Lluvia" value={renderSensorValue(sensorData.lluvia)} unit="mm" loading={isLoading} />
                  <Card
                    title="Intensidad del Sol"
                    value={renderSensorValue(sensorData.sol)}
                    unit="lux"
                    loading={isLoading}
                  />
                </div>
              </div>

              <div className="dashboard-status">
                <p>Última actualización: {lastUpdate}</p>
                {dataDate && <p>Datos registrados: {dataDate}</p>}
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

