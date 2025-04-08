"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { register } from "../Services/api"
import { Link } from "react-router-dom"
import { User, KeyRound } from "lucide-react"
import "../Styles/register.css"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  })

  // Actualizar los requisitos de contraseña cuando cambia la contraseña
  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    })
  }, [password])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    }
  }

  const sanitizeInput = (input: string) => input.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword)

    if (!validateEmail(sanitizedEmail)) {
      setError("Formato de correo inválido")
      return
    }

    const passwordValidation = validatePassword(sanitizedPassword)
    if (!Object.values(passwordValidation).every(Boolean)) {
      setError("La contraseña no cumple con todos los requisitos")
      return
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      setLoading(true)
      const response = await register(sanitizedEmail, sanitizedPassword)
      console.log("Registro exitoso:", response)
      setSuccess("Usuario registrado exitosamente")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      setError("Error al registrar el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-content">
        <h2 className="register-title">Registrar Usuario</h2>
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
              placeholder="usuario@gmail.com"
              maxLength={50}
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
              placeholder="••••••••"
              maxLength={20}
              className="form-input"
            />
          </div>

          <ul className="password-requirements">
            <li className={passwordRequirements.length ? "requirement-valid" : "requirement-invalid"}>
              <span className="requirement-bullet"></span>
              <span className="requirement-text">Mínimo 6 caracteres</span>
            </li>
            <li className={passwordRequirements.uppercase ? "requirement-valid" : "requirement-invalid"}>
              <span className="requirement-bullet"></span>
              <span className="requirement-text">Al menos una letra mayúscula</span>
            </li>
            <li className={passwordRequirements.number ? "requirement-valid" : "requirement-invalid"}>
              <span className="requirement-bullet"></span>
              <span className="requirement-text">Al menos un número (0-9)</span>
            </li>
            <li className={passwordRequirements.specialChar ? "requirement-valid" : "requirement-invalid"}>
              <span className="requirement-bullet"></span>
              <span className="requirement-text">Al menos un carácter especial</span>
            </li>
          </ul>
        </div>

        <div className="form-group">
          <label className="form-label">Confirmar Contraseña</label>
          <div className="input-container">
            <KeyRound className="input-icon" size={16} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              maxLength={20}
              className="form-input"
            />
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <p className="redirect-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="redirect-link">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

