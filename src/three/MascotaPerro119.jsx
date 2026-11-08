import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'

// Generador de sonido con Web Audio API (ladrido amigable + tono corto de radio/sirena 119)
function reproducirSonidoMascota(colorCasco = '#dc2626', activarSirena = true) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const ahora = ctx.currentTime

    const factorTono =
      colorCasco === '#2563eb' ? 1.15 : colorCasco === '#ea580c' ? 0.9 : 1.0

    const crearLadrido = (inicio, duracion, frecBase) => {
      const osc = ctx.createOscillator()
      const filtro = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(frecBase * 0.85, inicio)
      osc.frequency.exponentialRampToValueAtTime(frecBase * 1.65, inicio + duracion * 0.35)
      osc.frequency.exponentialRampToValueAtTime(frecBase * 0.65, inicio + duracion)

      filtro.type = 'bandpass'
      filtro.frequency.setValueAtTime(frecBase * 1.4, inicio)
      filtro.Q.setValueAtTime(2.5, inicio)

      gain.gain.setValueAtTime(0.001, inicio)
      gain.gain.linearRampToValueAtTime(0.22, inicio + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracion)

      osc.connect(filtro)
      filtro.connect(gain)
      gain.connect(ctx.destination)

      osc.start(inicio)
      osc.stop(inicio + duracion)
    }

    // Doble ladrido ("guau, guau")
    crearLadrido(ahora, 0.11, 340 * factorTono)
    crearLadrido(ahora + 0.14, 0.13, 390 * factorTono)

    if (activarSirena) {
      const sirena = ctx.createOscillator()
      const gainSirena = ctx.createGain()

      sirena.type = 'triangle'
      sirena.frequency.setValueAtTime(660, ahora + 0.3)
      sirena.frequency.linearRampToValueAtTime(920, ahora + 0.46)
      sirena.frequency.linearRampToValueAtTime(660, ahora + 0.62)

      gainSirena.gain.setValueAtTime(0.001, ahora + 0.3)
      gainSirena.gain.linearRampToValueAtTime(0.12, ahora + 0.33)
      gainSirena.gain.exponentialRampToValueAtTime(0.001, ahora + 0.64)

      sirena.connect(gainSirena)
      gainSirena.connect(ctx.destination)

      sirena.start(ahora + 0.3)
      sirena.stop(ahora + 0.65)
    }

    setTimeout(() => {
      ctx.close().catch(() => {})
    }, 900)
  } catch {
    // Ignorar si el navegador bloquea audio sin interacción previa
  }
}

// Número en relieve 3D integrado directamente en la placa frontal del casco
function NumeroCasco3D({ numero = '1' }) {
  if (String(numero) === '9') {
    return (
      <group position={[0, 0, 0.015]}>
        {/* Aro superior del 9 */}
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[0.024, 0.009, 12, 24]} />
          <meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.25} />
        </mesh>
        {/* Poste derecho del 9 */}
        <mesh position={[0.02, -0.006, 0]}>
          <boxGeometry args={[0.016, 0.064, 0.014]} />
          <meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.25} />
        </mesh>
        {/* Base inferior del 9 */}
        <mesh position={[0, -0.034, 0]}>
          <boxGeometry args={[0.048, 0.016, 0.014]} />
          <meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.25} />
        </mesh>
      </group>
    )
  }

  // Número "1" en relieve 3D dorado sobre fondo oscuro del escudo
  return (
    <group position={[0, 0, 0.015]}>
      <mesh position={[0.004, 0, 0]}>
        <boxGeometry args={[0.02, 0.078, 0.014]} />
        <meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.25} />
      </mesh>
      <mesh position={[-0.01, 0.023, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.016, 0.032, 0.014]} />
        <meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.25} />
      </mesh>
      <mesh position={[0.004, -0.034, 0]}>
        <boxGeometry args={[0.048, 0.016, 0.014]} />
        <meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.25} />
      </mesh>
    </group>
  )
}

// Modelo 3D pulido de las 3 mascotas caninas tipo Shiba-Inu del escuadrón 119
function PerritoBombero({
  numeroCasco = '1',
  colorCasco = '#dc2626',
  colorTraje = '#1e293b',
  colorPelaje = '#e6a15c',
  alertaActiva = false,
  onInteractuar,
}) {
  const grupoRef = useRef()
  const cabezaRef = useRef()
  const colaRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const velocidad = alertaActiva || hovered ? 10 : 4.5

    if (grupoRef.current) {
      const alturaBase = alertaActiva
        ? Math.abs(Math.sin(t * 6.5)) * 0.14
        : Math.sin(t * 2.4) * 0.035
      grupoRef.current.position.y = -0.36 + alturaBase
      grupoRef.current.rotation.y = Math.sin(t * 0.85) * 0.34
    }

    if (cabezaRef.current) {
      cabezaRef.current.rotation.z = Math.sin(t * 2.2) * (hovered ? 0.11 : 0.045)
      cabezaRef.current.rotation.x = Math.sin(t * 1.6) * 0.035
    }

    if (colaRef.current) {
      colaRef.current.rotation.z = Math.sin(t * velocidad) * 0.42
    }
  })

  return (
    <group
      ref={grupoRef}
      onClick={(e) => {
        e.stopPropagation()
        onInteractuar?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Base circular tipo estación 119 */}
      <mesh position={[0, -0.52, 0]} receiveShadow>
        <cylinderGeometry args={[0.92, 1.02, 0.11, 36]} />
        <meshStandardMaterial color="#0f172a" metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.455, 0]}>
        <cylinderGeometry args={[0.84, 0.84, 0.025, 36]} />
        <meshStandardMaterial
          color={colorCasco}
          emissive={colorCasco}
          emissiveIntensity={alertaActiva || hovered ? 0.65 : 0.22}
        />
      </mesh>

      {/* Torso con chaquetón de bombero */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.37, 0.45, 0.6, 28]} />
        <meshStandardMaterial color={colorTraje} roughness={0.45} />
      </mesh>

      {/* Franjas reflectivas dobles del uniforme (amarillo lima + plata) */}
      <mesh position={[0, -0.17, 0]}>
        <cylinderGeometry args={[0.422, 0.432, 0.075, 28]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={alertaActiva ? 0.55 : 0.18}
        />
      </mesh>
      <mesh position={[0, -0.17, 0]}>
        <cylinderGeometry args={[0.426, 0.43, 0.028, 28]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.25} />
      </mesh>

      {/* Tanque de oxígeno / equipo táctico en la espalda del traje */}
      <group position={[0, -0.05, -0.4]}>
        <mesh>
          <capsuleGeometry args={[0.11, 0.24, 12, 20]} />
          <meshStandardMaterial color={colorCasco} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.06, 14]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Collar rojo con medalla dorada en el pecho */}
      <mesh position={[0, 0.19, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.042, 14, 28]} />
        <meshStandardMaterial color="#dc2626" roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.13, 0.39]}>
        <cylinderGeometry args={[0.055, 0.055, 0.025, 20]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#facc15" metalness={0.65} roughness={0.22} />
      </mesh>

      {/* Pecho crema esponjoso tipo Shiba */}
      <mesh position={[0, 0.01, 0.34]} scale={[0.66, 0.8, 0.36]}>
        <sphereGeometry args={[0.34, 20, 20]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.65} />
      </mesh>

      {/* Patitas delanteras sentadas con mangas de bombero y almohadillas */}
      <group position={[-0.21, -0.23, 0.28]} rotation={[0.14, 0, 0.06]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.11, 0.1, 0.24, 18]} />
          <meshStandardMaterial color={colorTraje} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.106, 0.104, 0.04, 18]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[0, -0.11, 0.03]} scale={[1, 0.82, 1.15]}>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.6} />
        </mesh>
      </group>
      <group position={[0.21, -0.23, 0.28]} rotation={[0.14, 0, -0.06]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.11, 0.1, 0.24, 18]} />
          <meshStandardMaterial color={colorTraje} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.106, 0.104, 0.04, 18]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[0, -0.11, 0.03]} scale={[1, 0.82, 1.15]}>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.6} />
        </mesh>
      </group>

      {/* Patitas traseras */}
      <mesh position={[-0.28, -0.36, -0.14]} scale={[1, 0.85, 1.15]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={colorPelaje} roughness={0.55} />
      </mesh>
      <mesh position={[0.28, -0.36, -0.14]} scale={[1, 0.85, 1.15]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={colorPelaje} roughness={0.55} />
      </mesh>

      {/* Colita enroscada característica de Shiba-Inu con punta crema */}
      <group ref={colaRef} position={[0, -0.12, -0.4]}>
        <mesh position={[0, 0.12, -0.09]} rotation={[-0.4, 0, 0]}>
          <torusGeometry args={[0.105, 0.062, 12, 22, Math.PI * 1.35]} />
          <meshStandardMaterial color={colorPelaje} roughness={0.55} />
        </mesh>
        <mesh position={[-0.08, 0.17, -0.09]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.6} />
        </mesh>
      </group>

      {/* Grupo de la Cabeza con el casco bien encajado */}
      <group ref={cabezaRef} position={[0, 0.49, 0.04]}>
        {/* Cráneo principal tipo Shiba */}
        <mesh scale={[1.07, 0.94, 0.98]}>
          <sphereGeometry args={[0.44, 32, 32]} />
          <meshStandardMaterial color={colorPelaje} roughness={0.52} />
        </mesh>

        {/* Mejillas blancas esponjosas (urajiro de Shiba) */}
        <mesh position={[-0.22, -0.09, 0.25]} scale={[0.86, 0.72, 0.62]}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.6} />
        </mesh>
        <mesh position={[0.22, -0.09, 0.25]} scale={[0.86, 0.72, 0.62]}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.6} />
        </mesh>

        {/* Rubor suave en las mejillas */}
        <mesh position={[-0.27, -0.05, 0.36]} rotation={[0, -0.4, 0]} scale={[1.2, 0.7, 0.3]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#fda4af" roughness={0.7} />
        </mesh>
        <mesh position={[0.27, -0.05, 0.36]} rotation={[0, 0.4, 0]} scale={[1.2, 0.7, 0.3]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#fda4af" roughness={0.7} />
        </mesh>

        {/* Cejas crema características de Shiba ("mame") justo debajo de la visera */}
        <mesh position={[-0.14, 0.125, 0.395]} rotation={[0, 0, 0.18]} scale={[1.15, 0.68, 0.5]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#fffbeb" />
        </mesh>
        <mesh position={[0.14, 0.125, 0.395]} rotation={[0, 0, -0.18]} scale={[1.15, 0.68, 0.5]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#fffbeb" />
        </mesh>

        {/* Hocico redondeado */}
        <mesh position={[0, -0.1, 0.39]} scale={[0.88, 0.7, 0.85]}>
          <sphereGeometry args={[0.205, 22, 22]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.55} />
        </mesh>

        {/* Nariz negra triangular/ovalada brillante */}
        <mesh position={[0, -0.035, 0.565]} scale={[1.2, 0.85, 0.8]}>
          <sphereGeometry args={[0.058, 18, 18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} />
        </mesh>

        {/* Sonrisa tierna debajo de la nariz */}
        <mesh position={[-0.038, -0.1, 0.545]} rotation={[0, 0, 0.45]}>
          <capsuleGeometry args={[0.009, 0.045, 8, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.038, -0.1, 0.545]} rotation={[0, 0, -0.45]}>
          <capsuleGeometry args={[0.009, 0.045, 8, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Lengüita alegre cuando interactúan */}
        {(hovered || alertaActiva) && (
          <mesh position={[0, -0.16, 0.515]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.035]} />
            <meshStandardMaterial color="#fb7185" roughness={0.4} />
          </mesh>
        )}

        {/* Ojos expresivos con doble brillo */}
        <mesh position={[-0.165, 0.025, 0.405]}>
          <sphereGeometry args={[0.062, 18, 18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.08} />
        </mesh>
        <mesh position={[0.165, 0.025, 0.405]}>
          <sphereGeometry args={[0.062, 18, 18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.08} />
        </mesh>
        {/* Brillo principal */}
        <mesh position={[-0.145, 0.048, 0.458]}>
          <sphereGeometry args={[0.021, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.185, 0.048, 0.458]}>
          <sphereGeometry args={[0.021, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Segundo destello pequeño */}
        <mesh position={[-0.18, 0.008, 0.458]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.15, 0.008, 0.458]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Orejas de Shiba saliendo por los costados del casco */}
        <group position={[-0.35, 0.22, -0.02]} rotation={[0.06, 0.12, 0.52]}>
          <mesh>
            <coneGeometry args={[0.145, 0.34, 18]} />
            <meshStandardMaterial color={colorPelaje} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.02, 0.055]} scale={[0.58, 0.68, 0.38]}>
            <coneGeometry args={[0.125, 0.28, 14]} />
            <meshStandardMaterial color="#fffbeb" />
          </mesh>
        </group>
        <group position={[0.35, 0.22, -0.02]} rotation={[0.06, -0.12, -0.52]}>
          <mesh>
            <coneGeometry args={[0.145, 0.34, 18]} />
            <meshStandardMaterial color={colorPelaje} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.02, 0.055]} scale={[0.58, 0.68, 0.38]}>
            <coneGeometry args={[0.125, 0.28, 14]} />
            <meshStandardMaterial color="#fffbeb" />
          </mesh>
        </group>

        {/* Casco de Bombero 119 encajado sobre la cabeza (más bajo y ajustado al cráneo) */}
        <group position={[0, 0.175, -0.015]} rotation={[-0.08, 0, 0]}>
          {/* Domo principal del casco ajustado al diámetro de la cabeza */}
          <mesh scale={[1.05, 0.92, 1.04]}>
            <sphereGeometry args={[0.445, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={colorCasco} metalness={0.28} roughness={0.3} />
          </mesh>

          {/* Cresta superior del casco de bombero */}
          <mesh position={[0, 0.36, -0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 1.1, 0.45]}>
            <capsuleGeometry args={[0.07, 0.32, 10, 16]} />
            <meshStandardMaterial color={colorCasco} metalness={0.32} roughness={0.28} />
          </mesh>

          {/* Ala / visera perimetral del casco */}
          <mesh position={[0, 0.025, 0.035]} rotation={[0.05, 0, 0]} scale={[1.04, 1, 1.08]}>
            <cylinderGeometry args={[0.455, 0.515, 0.038, 32]} />
            <meshStandardMaterial color={colorCasco} metalness={0.3} roughness={0.35} />
          </mesh>

          {/* Borde reflectivo amarillo alrededor del casco */}
          <mesh position={[0, 0.052, 0.01]} scale={[1.05, 1, 1.04]}>
            <cylinderGeometry args={[0.448, 0.452, 0.022, 32]} />
            <meshStandardMaterial color="#facc15" metalness={0.4} roughness={0.3} />
          </mesh>

          {/* Faldón protector de nuca trasero del casco */}
          <mesh position={[0, -0.05, -0.39]} rotation={[0.35, 0, 0]}>
            <boxGeometry args={[0.52, 0.14, 0.035]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>

          {/* Escudo frontal circular con borde dorado y número en relieve 3D */}
          <group position={[0, 0.165, 0.435]} rotation={[-0.22, 0, 0]}>
            {/* Anillo exterior dorado */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.115, 0.115, 0.022, 28]} />
              <meshStandardMaterial color="#facc15" metalness={0.55} roughness={0.22} />
            </mesh>
            {/* Fondo azul oscuro de la insignia para máximo contraste */}
            <mesh position={[0, 0, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.092, 0.092, 0.02, 28]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} />
            </mesh>
            <NumeroCasco3D numero={numeroCasco} />
          </group>

          {/* Sirena luminosa superior del casco */}
          <mesh position={[0, 0.415, 0.04]}>
            <cylinderGeometry args={[0.058, 0.076, 0.075, 18]} />
            <meshStandardMaterial
              color={alertaActiva ? '#38bdf8' : '#ef4444'}
              emissive={alertaActiva ? '#38bdf8' : '#ef4444'}
              emissiveIntensity={alertaActiva || hovered ? 1.5 : 0.45}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function MascotaPerro119({
  nombre = 'Mamoru-kun',
  rol = 'Mascota de Prevención · Unidad 1',
  numeroCasco = '1',
  colorCasco = '#dc2626',
  colorTraje = '#1e293b',
  colorPelaje = '#e6a15c',
  mensajeInicial = 'Haz clic sobre mí para activar el modo alerta 119',
  mensajeActivo = 'Sirena 119 activada y lista para asistirte en Cali',
  altura = 210,
}) {
  const [alertaActiva, setAlertaActiva] = useState(false)

  const manejarInteraccion = () => {
    setAlertaActiva((prev) => {
      const siguiente = !prev
      reproducirSonidoMascota(colorCasco, siguiente)
      return siguiente
    })
  }

  return (
    <div className="mascota-119-card">
      <div className="mascota-119-header">
        <div>
          <span className="mascota-119-tag">MASCOTA 119 · CASCO #{numeroCasco}</span>
          <h4 className="mascota-119-nombre">{nombre}</h4>
          <p className="mascota-119-rol">{rol}</p>
        </div>
      </div>

      <div style={{ height: altura, width: '100%', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0.58, 2.7], fov: 40 }}>
          <ambientLight intensity={0.82} />
          <directionalLight position={[3, 5, 3]} intensity={1.35} />
          <pointLight
            position={[0, 1.5, 1.2]}
            intensity={alertaActiva ? 1.6 : 0.45}
            color={alertaActiva ? '#38bdf8' : colorCasco}
          />
          <PerritoBombero
            numeroCasco={numeroCasco}
            colorCasco={colorCasco}
            colorTraje={colorTraje}
            colorPelaje={colorPelaje}
            alertaActiva={alertaActiva}
            onInteractuar={manejarInteraccion}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div
        className="mascota-119-burbuja"
        onClick={manejarInteraccion}
        style={{ cursor: 'pointer' }}
        title="Haz clic para escuchar a la mascota"
      >
        {alertaActiva ? mensajeActivo : mensajeInicial}
      </div>
    </div>
  )
}
