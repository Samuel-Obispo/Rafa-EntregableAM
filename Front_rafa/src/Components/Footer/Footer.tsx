"use client"

import type React from "react"
import { Facebook, Instagram } from "lucide-react"
import "./Footer.css"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">© {currentYear} - Todos los derechos reservados</p>
        <div className="footer-right">
          <p className="footer-user">Samuel Alejandro Obispo Navarro</p>
          <div className="footer-social">
            <a href="#" className="footer-social-link">
              <Facebook size={18} />
            </a>
            <a href="#" className="footer-social-link">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

