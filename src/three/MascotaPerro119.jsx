import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useRef, useState } from 'react'

// Modelo 3D en React Three Fiber de las 3 mascotas caninas del escuadrón 1-1-9
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
    const velocidad = alertaActiva || hovered ? 9 : 4

    if (grupoRef.current) {
      // Flotación suave o salto alegre cuando interactúan con él
      const alturaBase = alertaActiva ? Math.abs(Math.sin(t * 6)) * 0.18 : Math.sin(t * 2.5) * 0.05
      grupoRef.current.position.y = -0.35 + alturaBase
      grupoRef.current.rotation.y = Math.sin(t * 0.9) * 0.35
    }

    if (cabezaRef.current) {
      // Inclinación tierna de cabeza de perrito
      cabezaRef.current.rotation.z = Math.sin(t * 2.2) * (hovered ? 0.14 : 0.06)
      cabezaRef.current.rotation.x = Math.sin(t * 1.8) * 0.05
    }

    if (colaRef.current) {
      // Movimiento de la cola con useFrame
      colaRef.current.rotation.z = Math.sin(t * velocidad) * 0.45
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
      {/* Base circular tipo pedestal 119 */}
      <mesh position={[0, -0.52, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.12, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.03, 32]} />
        <meshStandardMaterial
          color={colorCasco}
          emissive={colorCasco}
          emissiveIntensity={alertaActiva || hovered ? 0.6 : 0.2}
        />
      </mesh>

      {/* Cuerpo con uniforme de bombero */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.65, 24]} />
        <meshStandardMaterial color={colorTraje} roughness={0.5} />
      </mesh>

      {/* Franja reflectiva amarilla/naranja del traje de bombero */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.455, 0.465, 0.1, 24]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={alertaActiva ? 0.5 : 0.15}
        />
      </mesh>

      {/* Pecho blanco del perrito */}
      <mesh position={[0, 0.02, 0.36]} scale={[0.7, 0.85, 0.4]}>
        <sphereGeometry args={[0.35, 20, 20]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.7} />
      </mesh>

      {/* Patitas delanteras y traseras */}
      <mesh position={[-0.22, -0.36, 0.28]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#fffbeb" />
      </mesh>
      <mesh position={[0.22, -0.36, 0.28]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#fffbeb" />
      </mesh>
      <mesh position={[-0.28, -0.36, -0.18]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={colorPelaje} />
      </mesh>
      <mesh position={[0.28, -0.36, -0.18]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={colorPelaje} />
      </mesh>

      {/* Colita animada */}
      <group ref={colaRef} position={[0, -0.1, -0.44]}>
        <mesh position={[0, 0.15, -0.1]} rotation={[-0.6, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.24, 8, 16]} />
          <meshStandardMaterial color={colorPelaje} />
        </mesh>
      </group>

      {/* Grupo de la Cabeza */}
      <group ref={cabezaRef} position={[0, 0.52, 0.05]}>
        {/* Cráneo principal */}
        <mesh scale={[1.08, 0.96, 1]}>
          <sphereGeometry args={[0.48, 28, 28]} />
          <meshStandardMaterial color={colorPelaje} roughness={0.6} />
        </mesh>

        {/* Mejillas blancas esponjosas */}
        <mesh position={[-0.22, -0.1, 0.28]} scale={[0.8, 0.7, 0.6]}>
          <sphereGeometry args={[0.25, 18, 18]} />
          <meshStandardMaterial color="#fffbeb" />
        </mesh>
        <mesh position={[0.22, -0.1, 0.28]} scale={[0.8, 0.7, 0.6]}>
          <sphereGeometry args={[0.25, 18, 18]} />
          <meshStandardMaterial color="#fffbeb" />
        </mesh>

        {/* Hocico */}
        <mesh position={[0, -0.1, 0.42]} scale={[0.9, 0.72, 0.85]}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#fffbeb" />
        </mesh>

        {/* Nariz negra */}
        <mesh position={[0, -0.03, 0.61]} scale={[1.2, 0.85, 0.8]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>

        {/* Lengüita feliz (más visible cuando está activo o con hover) */}
        {(hovered || alertaActiva) && (
          <mesh position={[0, -0.19, 0.54]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.09, 0.12, 0.04]} />
            <meshStandardMaterial color="#fb7185" />
          </mesh>
        )}

        {/* Ojos brillantes */}
        <mesh position={[-0.18, 0.06, 0.43]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.06, 0.43]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        {/* Brillo blanco de los ojos */}
        <mesh position={[-0.16, 0.085, 0.485]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.2, 0.085, 0.485]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Orejas de perrito */}
        <mesh position={[-0.36, 0.25, -0.02]} rotation={[0, 0, 0.45]}>
          <coneGeometry args={[0.16, 0.34, 16]} />
          <meshStandardMaterial color={colorPelaje} />
        </mesh>
        <mesh position={[0.36, 0.25, -0.02]} rotation={[0, 0, -0.45]}>
          <coneGeometry args={[0.16, 0.34, 16]} />
          <meshStandardMaterial color={colorPelaje} />
        </mesh>

        {/* Casco de Bombero 119 */}
        <group position={[0, 0.3, 0]}>
          {/* Domo del casco */}
          <mesh>
            <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={colorCasco} metalness={0.25} roughness={0.35} />
          </mesh>
          {/* Visera del casco */}
          <mesh position={[0, 0.02, 0.06]} rotation={[0.12, 0, 0]}>
            <cylinderGeometry args={[0.46, 0.52, 0.05, 24]} />
            <meshStandardMaterial color={colorCasco} metalness={0.3} roughness={0.4} />
          </mesh>
          {/* Escudo frontal con el dígito de la mascota (1, 1 o 9) */}
          <mesh position={[0, 0.16, 0.39]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 20]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#facc15" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Luz sirena arriba del casco */}
          <mesh position={[0, 0.44, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.1, 16]} />
            <meshStandardMaterial
              color={alertaActiva ? '#38bdf8' : '#ef4444'}
              emissive={alertaActiva ? '#38bdf8' : '#ef4444'}
              emissiveIntensity={alertaActiva || hovered ? 1.4 : 0.45}
            />
          </mesh>

          {/* Etiqueta flotante con el número de la mascota (1, 1 o 9) */}
          <Html position={[0, 0.17, 0.43]} center distanceFactor={6}>
            <div
              style={{
                background: '#0f172a',
                color: '#facc15',
                fontWeight: 900,
                fontSize: '12px',
                padding: '1px 6px',
                borderRadius: '999px',
                border: '1.5px solid #facc15',
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {numeroCasco}
            </div>
          </Html>
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
  mensajeActivo = '¡Guau! Sirena 119 activada y lista para asistirte en Cali',
  altura = 210,
}) {
  const [alertaActiva, setAlertaActiva] = useState(false)

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
        <Canvas camera={{ position: [0, 0.7, 2.7], fov: 42 }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 5, 3]} intensity={1.3} />
          <pointLight
            position={[0, 1.5, 1]}
            intensity={alertaActiva ? 1.6 : 0.4}
            color={alertaActiva ? '#38bdf8' : colorCasco}
          />
          <PerritoBombero
            numeroCasco={numeroCasco}
            colorCasco={colorCasco}
            colorTraje={colorTraje}
            colorPelaje={colorPelaje}
            alertaActiva={alertaActiva}
            onInteractuar={() => setAlertaActiva((prev) => !prev)}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="mascota-119-burbuja">
        {alertaActiva ? mensajeActivo : mensajeInicial}
      </div>
    </div>
  )
}
