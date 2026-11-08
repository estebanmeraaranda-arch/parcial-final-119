import { createContext, useContext, useState, useEffect } from 'react'
import { BARRIOS } from '../data/barrios.js'

const STORAGE_KEY = 'bomberos_119_reportes_v1'

// Reportes iniciales de demostración con todos los campos del protocolo
const REPORTES_INICIALES = [
  {
    id: 1,
    radicado: '119-0001',
    hora: '18:10',
    nombres: 'Camilo Andrés',
    apellidos: 'Valencia Ortiz',
    telefono: '3158904412',
    grupo: 100,
    queVe: 'Humo negro denso saliendo del segundo piso de una casona esquinera.',
    direccion: 'Calle 2 # 10-45',
    barrio: 'San Antonio',
    referencia: 'A media cuadra del Parque de San Antonio',
    edificio: 'No aplica',
    estado: 'Recibido',
    unidad: null,
    fotos: [],
  },
  {
    id: 2,
    radicado: '119-0002',
    hora: '18:18',
    nombres: 'Luisa Fernanda',
    apellidos: 'Ríos Gómez',
    telefono: '3104521987',
    grupo: 300,
    queVe: 'Colisión entre motocicleta y automóvil sobre la vía principal.',
    direccion: 'Calle 1 # 50-12',
    barrio: 'Siloé',
    referencia: 'Frente a la estación del MIO Cable',
    edificio: 'No aplica',
    estado: 'Recibido',
    unidad: null,
    fotos: [],
  },
  {
    id: 3,
    radicado: '119-0003',
    hora: '18:25',
    nombres: 'Andrés Felipe',
    apellidos: 'Mora Salazar',
    telefono: '3187650921',
    grupo: 400,
    queVe: 'Fuerte olor a gas en zona de comidas del primer nivel.',
    direccion: 'Carrera 98 # 42-10',
    barrio: 'Valle del Lili',
    referencia: 'Diagonal a la clínica',
    edificio: 'Conjunto Residencial Los Almendros',
    estado: 'Unidad despachada',
    unidad: 'HazMat',
    fotos: [],
  },
  {
    id: 4,
    radicado: '119-0004',
    hora: '18:32',
    nombres: 'Diana Marcela',
    apellidos: 'Castro Mina',
    telefono: '3163348890',
    grupo: 800,
    queVe: 'Árbol de gran tamaño inclinado sobre cables y calzada vehicular.',
    direccion: 'Calle 72N # 3N-20',
    barrio: 'Floralia',
    referencia: 'Cerca al polideportivo del barrio',
    edificio: 'No aplica',
    estado: 'Recibido',
    unidad: null,
    fotos: [],
  },
  {
    id: 5,
    radicado: '119-0005',
    hora: '18:40',
    nombres: 'Carlos Julio',
    apellidos: 'Perea Angulo',
    telefono: '3129987765',
    grupo: 300,
    queVe: 'Persona atrapada en ascensor detenido en el cuarto piso.',
    direccion: 'Carrera 29 # 38-15',
    barrio: 'El Poblado',
    referencia: 'A dos cuadras de la galería',
    edificio: 'Edificio Mirador del Oriente',
    estado: 'Validado',
    unidad: null,
    fotos: [],
  },
  {
    id: 6,
    radicado: '119-0006',
    hora: '18:47',
    nombres: 'Jorge Iván',
    apellidos: 'Paz Córdoba',
    telefono: '3145561234',
    grupo: 100,
    queVe: 'Conato de incendio en zona de vegetación seca en la ladera.',
    direccion: 'Avenida 6N # 36N-40',
    barrio: 'Chipichape',
    referencia: 'Subiendo por la vía hacia el cerro',
    edificio: 'No aplica',
    estado: 'Recibido',
    unidad: null,
    fotos: [],
  },
  {
    id: 7,
    radicado: '119-0007',
    hora: '18:55',
    nombres: 'María del Mar',
    apellidos: 'Soto Caicedo',
    telefono: '3008876543',
    grupo: 500,
    queVe: 'Solicitud de rescate de mascota atrapada en tejado alto.',
    direccion: 'Calle 16 # 102-30',
    barrio: 'Ciudad Jardín',
    referencia: 'Cerca al parque del lago',
    edificio: 'Condominio Parque Real',
    estado: 'Cerrado',
    unidad: 'Rescate',
    fotos: [],
  },
  {
    id: 8,
    radicado: '119-0008',
    hora: '19:02',
    nombres: 'Héctor Fabio',
    apellidos: 'Lozano Vélez',
    telefono: '3172234455',
    grupo: 200,
    queVe: 'Ruptura de tubería matriz de presión en taller industrial.',
    direccion: 'Carrera 23 # 13-50',
    barrio: 'Junín',
    referencia: 'Frente a la ferretería central',
    edificio: 'Bodega 4',
    estado: 'Recibido',
    unidad: null,
    fotos: [],
  },
  {
    id: 9,
    radicado: '119-0009',
    hora: '19:10',
    nombres: 'Natalia Andrea',
    apellidos: 'Giraldo Duque',
    telefono: '3116654321',
    grupo: 900,
    queVe: 'Enjambre de abejas activo en poste junto a entrada peatonal.',
    direccion: 'Calle 4 # 94-18',
    barrio: 'Meléndez',
    referencia: 'Frente a la cancha múltiple',
    edificio: 'Unidad Residencial Colinas del Sur',
    estado: 'Recibido',
    unidad: null,
    fotos: [],
  },
].map((r) => {
  const b = BARRIOS.find((x) => x.nombre === r.barrio)
  return { ...r, lat: b?.lat ?? 3.437, lng: b?.lng ?? -76.522 }
})

const ReportesContext = createContext(null)

export function ReportesProvider({ children }) {
  const [reportes, setReportes] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY)
      if (guardado) {
        const parsed = JSON.parse(guardado)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Si falla localStorage, usamos los reportes iniciales
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
