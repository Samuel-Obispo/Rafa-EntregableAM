"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Popup, CircleMarker, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"
import { MapPin, Droplet, AlertTriangle, Info, Calendar, PenToolIcon as Tool } from "lucide-react"
import { fetchZonasRiego } from "../Services/api"
import Sidebar from "../Components/Sidebar/Sidebar"
import Footer from "../Components/Footer/Footer"
import "../styles/ZonasRiego.css"

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, ChartTooltip, Legend)

// Corregir el ícono de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Definir la interfaz para las zonas de riego
interface ZonaRiego {
  id: number | string
  sector: string
  nombre?: string
  tipo_riego: string
  estado: string
  motivo?: string | null
  latitud: number | null
  longitud: number | null
  color: string
  fecha: string
}

const ZonasRiego = () => {
  const [zonas, setZonas] = useState<ZonaRiego[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"mapa" | "problemas" | "estadisticas">("mapa")

  useEffect(() => {
    const cargarZonas = async () => {
      try {
        setLoading(true)
        // Usamos la función de tu API en lugar de fetch directo
        const data = await fetchZonasRiego()

        // Transformamos los datos si es necesario
        const zonasFormateadas = data.map((zona: any) => ({
          id: zona.id,
          sector: zona.sector || "Sector sin nombre",
          nombre: zona.nombre,
          tipo_riego: zona.tipo_riego || "Desconocido",
          estado: zona.estado || "Desconocido",
          motivo: zona.motivo,
          latitud: zona.latitud !== null ? Number.parseFloat(zona.latitud) : 19.432608 + (Math.random() * 0.02 - 0.01),
          longitud:
            zona.longitud !== null ? Number.parseFloat(zona.longitud) : -99.133209 + (Math.random() * 0.02 - 0.01),
          color: zona.color || getColorForEstado(zona.estado),
          fecha: zona.fecha || new Date().toISOString(),
        }))

        // Añadir datos de ejemplo si no hay datos
        if (zonasFormateadas.length === 0) {
          const datosEjemplo = generarDatosEjemplo()
          setZonas(datosEjemplo)
        } else {
          setZonas(zonasFormateadas)
        }

        setError(null)
      } catch (err) {
        console.error("Error al cargar las zonas de riego:", err)
        setError("Error al cargar las zonas de riego")

        // Cargar datos de ejemplo en caso de error
        const datosEjemplo = generarDatosEjemplo()
        setZonas(datosEjemplo)
      } finally {
        setLoading(false)
      }
    }

    cargarZonas()
    // Actualizar cada 5 minutos
    const interval = setInterval(cargarZonas, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Función para generar datos de ejemplo
  const generarDatosEjemplo = (): ZonaRiego[] => {
    const estados = ["Funcionando", "Mantenimiento", "Descompuesto", "Fuera de servicio"]
    const tiposRiego = ["Aspersión", "Goteo", "Microaspersión", "Inundación"]

    return Array.from({ length: 10 }, (_, i) => {
      const estado = estados[Math.floor(Math.random() * estados.length)]
      return {
        id: `ejemplo-${i + 1}`,
        sector: `Sector ${i + 1}`,
        nombre: `Zona de Riego ${i + 1}`,
        tipo_riego: tiposRiego[Math.floor(Math.random() * tiposRiego.length)],
        estado: estado,
        motivo: estado !== "Funcionando" ? "Mantenimiento programado" : null,
        latitud: 19.432608 + (Math.random() * 0.05 - 0.025),
        longitud: -99.133209 + (Math.random() * 0.05 - 0.025),
        color: getColorForEstado(estado),
        fecha: new Date().toISOString(),
      }
    })
  }

  // Función para asignar color según el estado
  function getColorForEstado(estado: string): string {
    if (!estado) return "#9E9E9E" // Gris para estado desconocido

    const estadoLower = estado.toLowerCase()
    if (estadoLower.includes("funcionando") || estadoLower.includes("activo") || estadoLower.includes("encendido")) {
      return "#4CAF50" // Verde
    } else if (estadoLower.includes("mantenimiento")) {
      return "#FFC107" // Amarillo
    } else if (estadoLower.includes("descompuesto")) {
      return "#F44336" // Rojo
    } else if (estadoLower.includes("fuera de servicio") || estadoLower.includes("apagado")) {
      return "#9E9E9E" // Gris
    }
    return "#9E9E9E" // Gris por defecto
  }

  // Filtrar zonas con problemas
  const zonasConProblemas = zonas.filter((zona) => {
    const estadoLower = zona.estado.toLowerCase()
    return !estadoLower.includes("funcionando") && !estadoLower.includes("activo") && !estadoLower.includes("encendido")
  })

  // Preparar datos para el gráfico
  const contarZonasPorEstado = () => {
    const contador: Record<string, number> = {}
    zonas.forEach((zona) => {
      const estado = zona.estado
      contador[estado] = (contador[estado] || 0) + 1
    })
    return contador
  }

  const estadoZonas = contarZonasPorEstado()
  const coloresEstados: Record<string, string> = {
    Funcionando: "#4CAF50",
    Activo: "#4CAF50",
    Encendido: "#4CAF50",
    Mantenimiento: "#FFC107",
    Descompuesto: "#F44336",
    "Fuera de servicio": "#9E9E9E",
    Apagado: "#9E9E9E",
  }

  const datosGrafico = {
    labels: Object.keys(estadoZonas),
    datasets: [
      {
        label: "Zonas por estado",
        data: Object.values(estadoZonas),
        backgroundColor: Object.keys(estadoZonas).map((estado) => coloresEstados[estado] || getColorForEstado(estado)),
        borderWidth: 1,
      },
    ],
  }

  // Calcular el centro del mapa basado en las coordenadas de las zonas
  const calcularCentroMapa = () => {
    if (zonas.length === 0) return [19.432608, -99.133209] // Default: CDMX

    // Filtrar zonas con coordenadas válidas
    const zonasConCoordenadas = zonas.filter((zona) => zona.latitud !== null && zona.longitud !== null)

    if (zonasConCoordenadas.length === 0) return [19.432608, -99.133209]

    const sumLat = zonasConCoordenadas.reduce((sum, zona) => sum + (zona.latitud || 0), 0)
    const sumLng = zonasConCoordenadas.reduce((sum, zona) => sum + (zona.longitud || 0), 0)

    return [sumLat / zonasConCoordenadas.length, sumLng / zonasConCoordenadas.length]
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-content">
        <main className="main-content">
          <div className="zonas-riego-container">
            <div className="zonas-riego-header">
              <h1>Mapa de Zonas de Riego</h1>
            </div>

            <div className="zonas-riego-tabs">
              <button
                className={activeTab === "mapa" ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab("mapa")}
              >
                <MapPin size={16} />
                <span>Mapa</span>
              </button>
              <button
                className={activeTab === "problemas" ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab("problemas")}
              >
                <AlertTriangle size={16} />
                <span>Zonas con Problemas ({zonasConProblemas.length})</span>
              </button>
              <button
                className={activeTab === "estadisticas" ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab("estadisticas")}
              >
                <Info size={16} />
                <span>Estadísticas</span>
              </button>
            </div>

            {loading ? (
              <div className="zonas-riego-loading">
                <div className="loading-spinner"></div>
                <p>Cargando zonas de riego...</p>
              </div>
            ) : error ? (
              <div className="zonas-riego-error">
                <AlertTriangle size={24} />
                <p>{error}</p>
              </div>
            ) : (
              <div className="zonas-riego-content">
                {activeTab === "mapa" && (
                  <div className="mapa-container">
                    <div className="mapa-wrapper">
                      <MapContainer
                        center={calcularCentroMapa() as [number, number]}
                        zoom={13}
                        zoomControl={false}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <ZoomControl position="topright" />
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {zonas.map((zona) => (
                          <CircleMarker
                            key={zona.id}
                            center={[zona.latitud || 0, zona.longitud || 0]}
                            radius={10}
                            pathOptions={{
                              color: zona.color,
                              fillColor: zona.color,
                              fillOpacity: 0.7,
                            }}
                          >
                            <Popup>
                              <div className="popup-content">
                                <h3>{zona.sector}</h3>
                                {zona.nombre && (
                                  <p>
                                    <strong>Nombre:</strong> {zona.nombre}
                                  </p>
                                )}
                                <p>
                                  <strong>Tipo de riego:</strong> {zona.tipo_riego}
                                </p>
                                <p>
                                  <strong>Estado:</strong> {zona.estado}
                                </p>
                                {zona.motivo && (
                                  <p>
                                    <strong>Motivo:</strong> {zona.motivo}
                                  </p>
                                )}
                                <p>
                                  <strong>Última actualización:</strong> {new Date(zona.fecha).toLocaleString()}
                                </p>
                              </div>
                            </Popup>
                          </CircleMarker>
                        ))}
                      </MapContainer>
                    </div>
                    <div className="mapa-leyenda">
                      <h3>Leyenda</h3>
                      <div className="leyenda-items">
                        <div className="leyenda-item">
                          <span className="color-dot" style={{ backgroundColor: "#4CAF50" }}></span>
                          <span>Funcionando</span>
                        </div>
                        <div className="leyenda-item">
                          <span className="color-dot" style={{ backgroundColor: "#FFC107" }}></span>
                          <span>Mantenimiento</span>
                        </div>
                        <div className="leyenda-item">
                          <span className="color-dot" style={{ backgroundColor: "#F44336" }}></span>
                          <span>Descompuesto</span>
                        </div>
                        <div className="leyenda-item">
                          <span className="color-dot" style={{ backgroundColor: "#9E9E9E" }}></span>
                          <span>Fuera de servicio</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "problemas" && (
                  <div className="problemas-container">
                    <h2>Zonas con Problemas</h2>
                    {zonasConProblemas.length === 0 ? (
                      <div className="no-problemas">
                        <p>No hay zonas con problemas actualmente.</p>
                      </div>
                    ) : (
                      <div className="problemas-grid">
                        {zonasConProblemas.map((zona) => (
                          <div
                            key={zona.id}
                            className="problema-card"
                            style={{ borderLeft: `4px solid ${zona.color}` }}
                          >
                            <div className="problema-header">
                              <h3>{zona.sector}</h3>
                              <span
                                className="estado-badge"
                                style={{
                                  backgroundColor: zona.color,
                                  color: zona.color === "#FFC107" ? "#333" : "#fff",
                                }}
                              >
                                {zona.estado}
                              </span>
                            </div>
                            <div className="problema-detalles">
                              {zona.nombre && (
                                <p>
                                  <strong>Nombre:</strong> {zona.nombre}
                                </p>
                              )}
                              <p>
                                <Tool size={14} className="icon" /> <strong>Tipo de riego:</strong> {zona.tipo_riego}
                              </p>
                              <p>
                                <AlertTriangle size={14} className="icon" /> <strong>Motivo:</strong>{" "}
                                {zona.motivo || "No especificado"}
                              </p>
                              <p>
                                <Calendar size={14} className="icon" /> <strong>Última actualización:</strong>{" "}
                                {new Date(zona.fecha).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "estadisticas" && (
                  <div className="estadisticas-container">
                    <h2>Estadísticas de Zonas de Riego</h2>
                    <div className="estadisticas-content">
                      <div className="grafico-container">
                        <Pie
                          data={datosGrafico}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "right",
                                labels: {
                                  padding: 20,
                                  font: {
                                    size: 12,
                                  },
                                },
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const label = context.label || ""
                                    const value = context.raw as number
                                    const total = context.dataset.data.reduce(
                                      (a: number, b: number) => a + b,
                                      0,
                                    ) as number
                                    const percentage = Math.round((value / total) * 100)
                                    return `${label}: ${value} (${percentage}%)`
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="estadisticas-resumen">
                        <h3>Resumen</h3>
                        <ul className="resumen-lista">
                          {Object.entries(estadoZonas).map(([estado, cantidad]) => (
                            <li key={estado} className="resumen-item">
                              <span
                                className="color-dot"
                                style={{ backgroundColor: coloresEstados[estado] || getColorForEstado(estado) }}
                              ></span>
                              <span className="resumen-texto">
                                <strong>{estado}:</strong> {cantidad} zonas (
                                {((cantidad / zonas.length) * 100).toFixed(1)}%)
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="total-zonas">
                          <Droplet size={18} className="total-icon" />
                          <span>
                            <strong>Total de zonas:</strong> {zonas.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ZonasRiego
