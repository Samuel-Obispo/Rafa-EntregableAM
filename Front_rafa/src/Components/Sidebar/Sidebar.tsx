"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, BarChart2, FileX, LogOut, Droplets, Menu } from 'lucide-react'
import { useAuth } from "../../Context/AuthContext"
import "./Sidebar.css"

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      <button className="mobile-menu-button" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h1 className="sidebar-title">SAON</h1>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            <li className="sidebar-nav-item">
              <Link
                to="/dashboard"
                className={`sidebar-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <LayoutDashboard className="sidebar-nav-icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link
                to="/zonasriego"
                className={`sidebar-nav-link ${location.pathname === "/zonasriego" ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <Droplets className="sidebar-nav-icon" />
                <span>Zonas de Riego</span>
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link
                to="/estadisticas"
                className={`sidebar-nav-link ${location.pathname === "/estadisticas" ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <BarChart2 className="sidebar-nav-icon" />
                <span>Estadísticas</span>
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link
                to="/parcelasEliminadas"
                className={`sidebar-nav-link ${location.pathname === "/parcelasEliminadas" ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <FileX className="sidebar-nav-icon" />
                <span>Parcelas Eliminadas</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar