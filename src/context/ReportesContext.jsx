import { createContext, useContext, useState, useEffect } from 'react'
import { BARRIOS } from '../data/barrios.js'

const STORAGE_KEY = 'bomberos_119_reportes_clean_v2'
const LEGACY_STORAGE_KEY = 'bomberos_119_reportes_v1'

// Inicia sin reportes de prueba para que el sistema arranque limpio
const REPORTES_INICIALES = []

const ReportesContext = createContext(null)

export function ReportesProvider({ children }) {
  const [reportes, setReportes] = useState(() => {
    try {
      // Limpiar datos de prueba antiguos si estaban guardados en el navegador
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      const guardado = localStorage.getItem(STORAGE_KEY)
      if (guardado) {
        const parsed = JSON.parse(guardado)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Si falla localStorage, iniciamos con arreglo vacío
    }
    return REPORTES_INICIALES
  })

  // Guardar en localStorage cada vez que cambien los reportes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes))
    } catch {
      // Ignorar si excede cuota
    }
  }, [reportes])

  // Sincronizar entre pestañas abiertas (Ciudadano y Operador)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setReportes(JSON.parse(e.newValue))
        } catch {
          // Ignorar error de parseo
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Agregar nuevo reporte desde /reportar
  const agregarReporte = (datos) => {
    const barrioObj = BARRIOS.find((b) => b.nombre === datos.barrio)
    const siguienteId =
      reportes.length > 0 ? Math.max(...reportes.map((r) => Number(r.id) || 0)) + 1 : 1

    const nuevo = {
      id: siguienteId,
      radicado: `119-${String(siguienteId).padStart(4, '0')}`,
      hora: new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      estado: 'Recibido',
      unidad: null,
      solicitudInfo: false,
      ...datos,
      grupo: Number(datos.grupo),
      lat: datos.lat ?? barrioObj?.lat ?? 3.437,
      lng: datos.lng ?? barrioObj?.lng ?? -76.522,
    }

    setReportes((prev) => [nuevo, ...prev])
    return nuevo
  }

  // Actualizar estado o datos de un reporte desde /operador
  const actualizarReporte = (id, cambios) => {
    setReportes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...cambios } : r))
    )
  }

  return (
    <ReportesContext.Provider
      value={{
        reportes,
        agregarReporte,
        actualizarReporte,
      }}
    >
      {children}
    </ReportesContext.Provider>
  )
}

export function useReportes() {
  const ctx = useContext(ReportesContext)
  if (!ctx) {
    throw new Error('useReportes debe usarse dentro de un ReportesProvider')
  }
  return ctx
}
