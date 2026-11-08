import { useState } from 'react'
import { Link } from 'react-router-dom'
import EscenaLanding from '../three/EscenaLanding.jsx'
import { GRUPOS } from '../data/grupos.js'

export default function Landing() {
  const [mostrarModalRecomendaciones, setMostrarModalRecomendaciones] = useState(false)

  const ejemplosPorGrupo = {
    100: 'Edificación, vehículo, vegetación, basuras, conatos',
    200: 'Explosión de caldera, fuga con deflagración, falla en transformador',
    300: 'Accidente de tránsito, personas en ascensor, rescate en río Cali, colapso',
    400: 'Fuga u olor penetrante a gas natural o propano, cables caídos, HazMat químico',
    500: 'Control de abejas africanizadas, corte preventivo de árboles en riesgo',
    800: 'Inundaciones por lluvias, vendaval sobre techos, movimientos sísmicos',
    900: 'Incidentes no clasificados o situaciones especiales de riesgo público',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b132b', color: '#f8fafc' }}>
      {/* Barra superior de navegación / identidad institucional */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(11, 19, 43, 0.95)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 0 15px rgba(220, 38, 38, 0.6)',
              }}
            >
              🚒
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.04em', color: '#ffffff' }}>
                BOMBEROS CALI · LÍNEA 119
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Benemérito Cuerpo de Bomberos Voluntarios de Santiago de Cali
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMostrarModalRecomendaciones(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📷 Guía de Fotos & Videos
            </button>
            <Link
              to="/operador"
              style={{
                color: '#94a3b8',
                fontSize: 13,
                textDecoration: 'none',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#38bdf8'
                e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#94a3b8'
                e.target.style.borderColor = 'transparent'
              }}
            >
              Acceso Operador ➔
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: LLAMADO CLARO, ACCESO RÁPIDO VISIBLE SIN SCROLL Y ESCENA 3D */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '28px 24px 20px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32,
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.5)',
              color: '#fca5a5',
              padding: '6px 14px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: '0.03em',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }}></span>
            CANAL DIGITAL DE DESPACHO INMEDIATO 119
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 16px',
              color: '#ffffff',
            }}
          >
            ¿Tienes una <span style={{ color: '#ef4444' }}>emergencia</span> en Cali?
          </h1>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#cbd5e1', margin: '0 0 24px' }}>
            Reporta incidentes en tiempo real. Tu ubicación exacta, descripción y evidencia fotográfica
            llegan directamente al tablero del radio operador para despachar de inmediato la máquina,
            ambulancia o brigada requerida.
          </p>

          {/* Botones de acción principales (visibles sin scroll) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <Link
              to="/reportar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.5)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(220, 38, 38, 0.7)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(220, 38, 38, 0.5)'
              }}
            >
              <span style={{ fontSize: 20 }}>🚨</span>
              <span>Reportar emergencia</span>
            </Link>

            <a
              href="tel:119"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '14px 24px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <span>📞</span>
              <span>Llamar al 119</span>
            </a>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 20, color: '#94a3b8', fontSize: 13 }}>
            <span>✓ Geolocalización asistida</span>
            <span>✓ Respuesta con radicado</span>
            <span>✓ 100% Gratuito</span>
          </div>
        </div>

        {/* Escena 3D R3F que no bloquea la visibilidad ni el botón */}
        <div>
          <EscenaLanding />
        </div>
      </section>

      {/* SECCIÓN: 7 GRUPOS DE EMERGENCIA DEL PROTOCOLO DE DESPACHO V4 */}
      <section style={{ maxWidth: 1200, margin: '40px auto 20px', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
            Clasificación de Grupos de Emergencia
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
            Códigos oficiales según el Protocolo de Despacho V4 de Bomberos Santiago de Cali
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16,
          }}
        >
          {GRUPOS.map((grupo) => (
            <div
              key={grupo.codigo}
              style={{
                background: '#16203d',
                borderRadius: 12,
                padding: '18px 20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: `5px solid ${grupo.color}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      background: grupo.color,
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    CÓDIGO {grupo.codigo}
                  </span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: grupo.color }}></span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
                  {grupo.nombre}
                </h3>
                <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {ejemplosPorGrupo[grupo.codigo]}
                </p>
              </div>

              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Link
                  to={`/reportar?grupo=${grupo.codigo}`}
                  style={{
                    color: grupo.color,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Reportar este tipo ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
