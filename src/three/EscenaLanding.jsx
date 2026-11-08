import MascotaPerro119 from './MascotaPerro119.jsx'

// Escena 3D de la Landing (React Three Fiber):
// Mascota #1 del escuadrón 1-1-9: Mamoru-kun (Casco #1 - Prevención y Respuesta Inmediata).
export default function EscenaLanding() {
  return (
    <MascotaPerro119
      nombre="Mamoru-kun (Unidad 1)"
      rol="Mascota de Prevención · Bienvenida Línea 119 Cali"
      numeroCasco="1"
      colorCasco="#dc2626"
      colorTraje="#1e293b"
      colorPelaje="#e6a15c"
      mensajeInicial="¡Hola! Soy Mamoru-kun. Haz clic sobre mí o reporta tu emergencia abajo."
      mensajeActivo="¡Sirena 119 lista! Si tienes una emergencia en Cali, usa el botón rojo de reporte."
      altura={260}
    />
  )
}
