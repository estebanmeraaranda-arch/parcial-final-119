import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useReportes } from '../context/ReportesContext.jsx'

export default function Navbar119() {
  const { reportes } = useReportes()
  const [mostrarGuia, setMostrarGuia] = useState(false)

  const pendientesCount = reportes.filter((r) => r.estado === 'Recibido').length

  return (
    <>
      <header className="navbar-119">
        <div className="navbar-119__inner">
          {/* Identidad institucional izquierda */}
          <Link to="/" className="navbar-119__brand">
            <div className="escudo-119">119</div>
            <div>
              <div className="navbar-119__title">Bomberos Voluntarios de Cali</div>
              <div className="navbar-119__subtitle">Canal Digital de Emergencias · Línea 119</div>
            </div>
          </Link>

          {/* Menú central de las 3 pestañas */}
          <nav className="navbar-119__tabs" aria-label="Navegación principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar-119__tab ${isActive ? 'navbar-119__tab--active' : ''}`
              }
            >
              1. Inicio
            </NavLink>

            <NavLink
              to="/reportar"
              className={({ isActive }) =>
                `navbar-119__tab ${isActive ? 'navbar-119__tab--active' : ''}`
              }
            >
              2. Reportar Emergencia
            </NavLink>

            <NavLink
              to="/operador"
              className={({ isActive }) =>
                `navbar-119__tab ${isActive ? 'navbar-119__tab--active' : ''}`
              }
            >
              <span>3. Radio Operador</span>
              {pendientesCount > 0 && (
                <span className="navbar-119__badge">{pendientesCount}</span>
              )}
            </NavLink>
          </nav>

          {/* Acciones rápidas derecha */}
          <div className="navbar-119__actions">
            <button
              type="button"
              className="navbar-119__btn-guia"
              onClick={() => setMostrarGuia(true)}
            >
              Guía de Fotos
            </button>
            <a href="tel:119" className="navbar-119__btn-llamar">
              Llamar al 119
            </a>
          </div>
        </div>
      </header>

      {/* Modal de recomendaciones de fotos y videos accesible desde cualquier pestaña */}
      {mostrarGuia && (
        <div className="modal-119-overlay" onClick={() => setMostrarGuia(false)}>
          <div className="modal-119-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-119-header">
              <h3>Guía de Bomberos Cali para Captura de Fotos y Videos</h3>
              <button
                type="button"
                className="modal-119-close"
                onClick={() => setMostrarGuia(false)}
              >
                Cerrar
              </button>
            </div>

            <div className="modal-119-body">
              <div className="modal-119-item" style={{ borderLeftColor: '#ef4444' }}>
                <strong>1. Tu seguridad es primero:</strong> Nunca te acerques al fuego, cables
                caídos o áreas inestables para tomar una fotografía.
              </div>
              <div className="modal-119-item" style={{ borderLeftColor: '#3b82f6' }}>
                <strong>2. Toma un plano general:</strong> Muestra el contexto (si hay viviendas
                vecinas en riesgo, árboles, postes de energía o tráfico).
              </div>
              <div className="modal-119-item" style={{ borderLeftColor: '#eab308' }}>
                <strong>3. Puntos de referencia visibles:</strong> Incluye esquinas, nomenclatura o
                fachadas para acelerar la ubicación de la máquina.
              </div>
              <div className="modal-119-item" style={{ borderLeftColor: '#10b981' }}>
                <strong>4. Color del humo o sustancia:</strong> Ayuda al operador a identificar qué
                material arde o si se requiere unidad HazMat.
              </div>
            </div>

            <button
              type="button"
              className="btn-enviar"
              style={{ marginTop: 16, padding: '11px 16px' }}
              onClick={() => setMostrarGuia(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}
