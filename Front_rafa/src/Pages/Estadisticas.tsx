"use client"

import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import CombinedCharts from "../Components/Graficos/Charts"
import { Info } from "lucide-react"
import "../Styles/Estadisticas.css"
import { fetchAllData } from "../Services/api"

interface HistoricalData {
  id: number
  parcela_id: number
  fecha_registro: string
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
}

const StatisticsPage = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [tooltipInfo, setTooltipInfo] = useState<{ visible: boolean; id: string | null; text: string }>({
    visible: false,
    id: null,
    text: "",
  })
  // Estado para controlar cuántos registros mostrar
  const [recordsToShow, setRecordsToShow] = useState<number>(10)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener todos los datos desde el nuevo endpoint
        const allData = await fetchAllData()

        // Extraer datos históricos
        if (allData.historico) {
          console.log("Datos históricos obtenidos:", allData.historico.length)
          setHistoricalData(allData.historico)
        } else {
          console.error("No se encontraron datos históricos en la respuesta")
          setHistoricalData([])
        }

        setLastUpdate(new Date().toLocaleTimeString())
      } catch (err) {
        setError("Error al cargar datos históricos")
        console.error("Error fetching historical data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
    const interval = setInterval(fetchHistoricalData, 30000) // Actualizar cada 30 seg
    return () => clearInterval(interval)
  }, [])

  const processData = () => {
    if (historicalData.length === 0) {
      return {
        labels: [],
        temperatureData: [],
        humidityData: [],
        rainData: [],
        sunData: [],
      }
    }

    // Ordenar por fecha (más reciente primero)
    const sortedData = [...historicalData].sort(
      (a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime(),
    )

    // Tomar solo los últimos N registros (los más recientes)
    const limitedData = sortedData.slice(0, recordsToShow)

    // Invertir para mostrar en orden cronológico (más antiguo primero)
    const chronologicalData = [...limitedData].reverse()

    const labels = chronologicalData.map((item) =>
      new Date(item.fecha_registro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    )

    return {
      labels,
      temperatureData: chronologicalData.map((item) => Number(item.temperatura)),
      humidityData: chronologicalData.map((item) => Number(item.humedad)),
      rainData: chronologicalData.map((item) => Number(item.lluvia)),
      sunData: chronologicalData.map((item) => Number(item.sol)),
    }
  }

  const handleInfoClick = (id: string, text: string) => {
    if (tooltipInfo.visible && tooltipInfo.id === id) {
      setTooltipInfo({ visible: false, id: null, text: "" })
    } else {
      setTooltipInfo({ visible: true, id, text })
    }
  }

  // Función para cambiar la cantidad de registros a mostrar
  const handleRecordsChange = (amount: number) => {
    setRecordsToShow(amount)
  }

  const { labels, temperatureData, humidityData, rainData, sunData } = processData()

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatureData,
        borderColor: "rgba(234, 84, 85, 1)",
        backgroundColor: "rgba(234, 84, 85, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: "Humedad (%)",
        data: humidityData,
        borderColor: "rgba(0, 123, 255, 1)",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  }

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Lluvia (mm)",
        data: rainData,
        backgroundColor: "rgba(40, 167, 69, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Intensidad Solar (lux)",
        data: sunData,
        backgroundColor: "rgba(255, 193, 7, 0.7)",
        borderRadius: 4,
      },
    ],
  }

  // Calcular promedios actuales y valores de referencia
  const currentAvgTemp = temperatureData.length
    ? temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length
    : 0
  const currentAvgHum = humidityData.length ? humidityData.reduce((a, b) => a + b, 0) / humidityData.length : 0
  const currentAvgRain = rainData.length ? rainData.reduce((a, b) => a + b, 0) / rainData.length : 0
  const currentAvgSun = sunData.length ? sunData.reduce((a, b) => a + b, 0) / sunData.length : 0

  // Valores máximos para cada variable (podrían ser valores ideales o límites físicos)
  const maxTemp = 40 // Temperatura máxima en °C
  const maxHum = 100 // Humedad máxima en %
  const maxRain = 50 // Lluvia máxima en mm
  const maxSun = 100 // Intensidad solar máxima en lux (ajustado a la escala)

  // Datos para el gráfico de araña (reemplazando el gráfico de área polar)
  const radarData = {
    labels: ["Temperatura (°C)", "Humedad (%)", "Lluvia (mm)", "Intensidad Solar (lux)"],
    datasets: [
      {
        label: "Niveles Actuales",
        data: [
          Number.parseFloat(currentAvgTemp.toFixed(1)),
          Number.parseFloat(currentAvgHum.toFixed(1)),
          Number.parseFloat(currentAvgRain.toFixed(1)),
          Number.parseFloat(currentAvgSun.toFixed(1)),
        ],
        backgroundColor: "rgba(234, 84, 85, 0.2)",
        borderColor: "rgba(234, 84, 85, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(234, 84, 85, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(234, 84, 85, 1)",
        pointRadius: 4,
        fill: true,
        // Valores originales y máximos para mostrar en la leyenda y tooltips
        maxValues: [maxTemp, maxHum, maxRain, maxSun],
        originalValues: [
          Number.parseFloat(currentAvgTemp.toFixed(1)),
          Number.parseFloat(currentAvgHum.toFixed(1)),
          Number.parseFloat(currentAvgRain.toFixed(1)),
          Number.parseFloat(currentAvgSun.toFixed(1)),
        ],
      },
      {
        label: "Niveles Máximos",
        data: [maxTemp, maxHum, maxRain, maxSun],
        backgroundColor: "rgba(0, 123, 255, 0.05)",
        borderColor: "rgba(0, 123, 255, 0.6)",
        borderWidth: 1,
        pointBackgroundColor: "rgba(0, 123, 255, 0.8)",
        pointBorderColor: "#fff",
        pointRadius: 3,
        borderDash: [5, 5],
        fill: false,
        maxValues: [maxTemp, maxHum, maxRain, maxSun],
        originalValues: [maxTemp, maxHum, maxRain, maxSun],
      },
    ],
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar />

        <div className="dashboard-main">
          <Header />

          <main className="dashboard-content">
            <div className="statistics-container">
              {loading ? (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <p>Cargando datos...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <span className="error-icon">!</span>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Reintentar</button>
                </div>
              ) : (
                <>
                  <div className="chart-controls">
                    <div className="records-selector">
                      <span>Mostrar últimos: </span>
                      <div className="records-buttons">
                        <button
                          className={recordsToShow === 10 ? "active" : ""}
                          onClick={() => handleRecordsChange(10)}
                        >
                          10
                        </button>
                        <button
                          className={recordsToShow === 20 ? "active" : ""}
                          onClick={() => handleRecordsChange(20)}
                        >
                          20
                        </button>

                      </div>
                    </div>
                    <div className="data-info">
                      <span>
                        Mostrando {Math.min(recordsToShow, historicalData.length)} de {historicalData.length} registros
                      </span>
                    </div>
                  </div>

                  <div className="charts-grid">
                    <div className="chart-card">
                      <div className="chart-header">
                        <div className="chart-title-container">
                          <h3>Variación de Temperatura y Humedad</h3>
                          <button
                            className="info-button"
                            onClick={() =>
                              handleInfoClick(
                                "temp-humidity",
                                "Este gráfico muestra la variación de temperatura (°C) y humedad (%) a lo largo del tiempo. La temperatura se representa en rojo y la humedad en azul.",
                              )
                            }
                            aria-label="Información sobre el gráfico"
                          >
                            <Info size={18} />
                          </button>
                          {tooltipInfo.visible && tooltipInfo.id === "temp-humidity" && (
                            <div className="info-tooltip">{tooltipInfo.text}</div>
                          )}
                        </div>
                        <div className="chart-legend">
                          <span className="legend-temperature">
                            <i></i> Temperatura
                          </span>
                          <span className="legend-humidity">
                            <i></i> Humedad
                          </span>
                        </div>
                      </div>
                      <div className="chart-wrapper">
                        <CombinedCharts.Line data={lineChartData} />
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <div className="chart-title-container">
                          <h3>Lluvia e Intensidad Solar</h3>
                          <button
                            className="info-button"
                            onClick={() =>
                              handleInfoClick(
                                "rain-sun",
                                "Este gráfico muestra la cantidad de lluvia (mm) y la intensidad solar (lux) registradas. La lluvia se representa en verde y la intensidad solar en amarillo.",
                              )
                            }
                            aria-label="Información sobre el gráfico"
                          >
                            <Info size={18} />
                          </button>
                          {tooltipInfo.visible && tooltipInfo.id === "rain-sun" && (
                            <div className="info-tooltip">{tooltipInfo.text}</div>
                          )}
                        </div>
                        <div className="chart-legend">
                          <span className="legend-rain">
                            <i></i> Lluvia
                          </span>
                          <span className="legend-sun">
                            <i></i> Intensidad Solar
                          </span>
                        </div>
                      </div>
                      <div className="chart-wrapper">
                        <CombinedCharts.Bar data={barChartData} />
                      </div>
                    </div>

                    <div className="chart-card full-width">
                      <div className="chart-header">
                        <div className="chart-title-container">
                          <h3>Niveles Actuales vs. Máximos</h3>
                          <button
                            className="info-button"
                            onClick={() =>
                              handleInfoClick(
                                "spider-chart",
                                "Este gráfico de araña muestra los valores actuales de cada variable climática en relación con sus valores máximos. Cada eje representa una variable diferente, permitiendo visualizar fácilmente el balance entre las diferentes mediciones.",
                              )
                            }
                            aria-label="Información sobre el gráfico"
                          >
                            <Info size={18} />
                          </button>
                          {tooltipInfo.visible && tooltipInfo.id === "spider-chart" && (
                            <div className="info-tooltip">{tooltipInfo.text}</div>
                          )}
                        </div>
                      </div>
                      <div className="spider-chart-wrapper">
                        <CombinedCharts.Radar data={radarData} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage
