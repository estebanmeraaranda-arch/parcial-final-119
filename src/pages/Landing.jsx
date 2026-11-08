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
          background: '#070d1e',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.04em', color: '#ffffff' }}>
                Cuerpo de Bomberos · Linea 119
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Bomberos Voluntarios de Santiago de Cali
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMostrarModalRecomendaciones(true)}
              style={{
                background: 'rgba(56, 50, 50, 0.08)',
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
              Guía de Fotos & Videos
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
              background: 'rgba(84, 24, 24, 0)',
              border: '1px solid rgba(220, 38, 38, 0.5)',
              color: '#fefefe',
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
              <span style={{ fontSize: 20 }}></span>
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
              <span></span>
              <span>Llamar al 119</span>
            </a>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 20, color: '#94a3b8', fontSize: 13 }}>

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
    {/* SECCIÓN: CÓMO FUNCIONA EL CANAL DIGITAL */}
      <section style={{ maxWidth: 1200, margin: '40px auto 30px', padding: '0 24px', width: '100%' }}>
        <div style={{ background: '#111a36', borderRadius: 16, padding: '32px 28px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>
            Flujo de Atención en 3 Pasos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}></div>
              <h4 style={{ margin: '0 0 6px', fontSize: 16 }}>1. Reporte del Ciudadano</h4>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                Completas el interrogatorio inicial obligatorio, seleccionas tu barrio o punto en el mapa y adjuntas fotos.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}></div>
              <h4 style={{ margin: '0 0 6px', fontSize: 16 }}>2. Ubicación en Tablero 119</h4>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                El radio operador visualiza el punto en el mapa real de Cali, verifica la evidencia y valida la emergencia.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}></div>
              <h4 style={{ margin: '0 0 6px', fontSize: 16 }}>3. Despacho y Seguimiento</h4>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                Se asigna la unidad (Máquina, Rescate, Ambulancia o HazMat) y el ciudadano ve el estado actualizado en vivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#070d1e',
          padding: '24px',
          fontSize: 13,
          color: '#64748b',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div>
            <strong>Línea 119 · Bomberos Voluntarios de Cali</strong> &copy; 2026. Proyecto Prototipo Canal Digital.
          </div>
          <div>
          </div>
        </div>
      </footer>

      {/* MODAL FLOTANTE: RECOMENDACIONES PARA FOTOS Y VIDEOS (EXTRA OPCIONAL) */}
      {mostrarModalRecomendaciones && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setMostrarModalRecomendaciones(false)}
        >
          <div
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              maxWidth: 540,
              width: '100%',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                Guía de Bomberos para Captura de Fotos y Videos
              </h3>
              <button
                onClick={() => setMostrarModalRecomendaciones(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 22,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
                <strong style={{ color: '#f8fafc' }}>1. Tu seguridad es primero:</strong> Nunca te acerques al fuego, cables caídos o áreas inestables para tomar una fotografía.
              </div>
              <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, borderLeft: '4px solid #3b82f6' }}>
                <strong style={{ color: '#f8fafc' }}>2. Toma un plano general:</strong> Muestra el contexto (si hay casas vecinas en riesgo, árboles, postes de luz o tráfico).
              </div>
              <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, borderLeft: '4px solid #eab308' }}>
                <strong style={{ color: '#f8fafc' }}>3. Puntos de referencia visibles:</strong> Incluye esquinas, placas de nomenclatura o fachadas de edificios para acelerar el arribo.
              </div>
              <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, borderLeft: '4px solid #10b981' }}>
                <strong style={{ color: '#f8fafc' }}>4. Color del humo o sustancia:</strong> Ayuda a los bomberos a identificar qué material está ardiendo o si hay químicos (HazMat).
              </div>
            </div>

            <button
              onClick={() => setMostrarModalRecomendaciones(false)}
              style={{
                width: '100%',
                marginTop: 20,
                padding: '10px',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
