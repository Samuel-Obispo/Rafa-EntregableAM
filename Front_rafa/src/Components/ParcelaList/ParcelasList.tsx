"use client"

import type React from "react"
import { FileX } from "lucide-react"
import "./ParcelasList.css"

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

interface ParcelasListProps {
  parcelas: Parcela[]
}

const ParcelasList: React.FC<ParcelasListProps> = ({ parcelas }) => {
  if (!parcelas || parcelas.length === 0) {
    return (
      <div className="parcelas-list-empty">
        <div className="parcelas-list-empty-icon">
          <FileX size={48} />
        </div>
        <h3 className="parcelas-list-empty-title">No hay parcelas eliminadas</h3>
        <p className="parcelas-list-empty-message">No se encontraron registros de parcelas eliminadas en el sistema.</p>
      </div>
    )
  }

  return (
    <div className="parcelas-list">
      <table className="parcelas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Responsable</th>
            <th>Tipo de Cultivo</th>
            <th>Último Riego</th>
          </tr>
        </thead>
        <tbody>
          {parcelas.map((parcela) => (
            <tr key={parcela.id}>
              <td>{parcela.id}</td>
              <td>{parcela.nombre}</td>
              <td>{parcela.ubicacion}</td>
              <td>{parcela.responsable}</td>
              <td>{parcela.tipo_cultivo}</td>
              <td>{new Date(parcela.ultimo_riego).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ParcelasList

