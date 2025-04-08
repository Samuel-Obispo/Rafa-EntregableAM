"use client"

import type React from "react"
import { useState } from "react"
import { login } from "../Services/api"
import { Link, useNavigate } from "react-router-dom"
import { User, KeyRound } from "lucide-react"
import { useAuth } from "../Context/AuthContext"
import "../Styles/login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
    return passwordRegex.test(password)
  }

  const sanitizeInput = (input: string) => {
    return input.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)

    if (!validateEmail(sanitizedEmail)) {
      setError("Formato de correo inválido")
      return
    }

    if (!validatePassword(sanitizedPassword)) {
      setError("Contraseña incorrecta.")
      return
    }

    try {
      setLoading(true)
      const response = await login(sanitizedEmail, sanitizedPassword)
      console.log("Login exitoso:", response)

      authLogin(response.token)
      navigate("/dashboard")
    } catch (error) {
      setError("Correo o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-title">Iniciar Sesión</h2>
        <div className="title-underline"></div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-container">
            <User className="input-icon" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={50}
              placeholder="usuario@gmail.com"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="input-container">
            <KeyRound className="input-icon" size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={20}
              placeholder="••••••••"
              className="form-input"
            />
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>

        {error && <p className="error-message">{error}</p>}

        <p className="redirect-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="redirect-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

