import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './mapa.css'
import { crearIcono } from './iconos.js'
import { GRUPOS, colorDeGrupo } from '../data/grupos.js'

const CENTRO_CALI = [3.437, -76.522]

// Mapa REAL de Cali (OpenStreetMap a través de Leaflet). No necesita API key.
// Props:
//   reportes: [{ id, grupo, lat, lng, estado, barrio, comuna }]
//   seleccionadoId: id del reporte seleccionado (o null)
//   onSeleccionar: (id) => void
export default function MapaOperador({ reportes = [], seleccionadoId = null, onSeleccionar }) {
  const seleccionado = reportes.find((r) => r.id === seleccionadoId)

  return (
    <MapContainer center={CENTRO_CALI} zoom={13} style={{ width: '100%', height: '100%' }}>
      {/* Dos estilos de mapa: el operador los cambia con el control de la esquina */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Calles (OpenStreetMap)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Oscuro (centro de control)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {reportes.map((r) => {
        const clasesPin = [
          r.estado === 'Recibido' ? 'pin--pulso' : '',
          r.estado === 'Cerrado' || r.estado === 'Descartado' ? 'pin--apagado' : '',
        ]
          .filter(Boolean)
          .join(' ')

        const nombreCiudadano = [r.nombres, r.apellidos].filter(Boolean).join(' ') || 'Ciudadano en línea'

        return (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={crearIcono(colorDeGrupo(r.grupo), {
              seleccionado: r.id === seleccionadoId,
              clases: clasesPin,
            })}
            eventHandlers={{ click: () => onSeleccionar?.(r.id) }}
          >
            <Popup>
              <div style={{ minWidth: 190, lineHeight: 1.45 }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  Grupo {r.grupo} · {r.comuna ? `${r.comuna} (${r.barrio})` : r.barrio}
                </div>
                <div style={{ fontSize: 12, color: '#334155', marginBottom: 4 }}>
                  <strong>Reporta:</strong> {nombreCiudadano}
                </div>
                {r.queVe && (
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                    <strong>Qué ve:</strong> {r.queVe}
                  </div>
                )}
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>
                  Estado: {r.estado}
                  {r.unidad ? ` (${r.unidad})` : ''}
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}

      <IrAlSeleccionado reporte={seleccionado} />
      <Leyenda reportes={reportes} />
    </MapContainer>
  )
}

// Cuando se selecciona un reporte (desde la lista o el mapa), el mapa vuela hasta él.
function IrAlSeleccionado({ reporte }) {
  const map = useMap()
  useEffect(() => {
    if (reporte) map.flyTo([reporte.lat, reporte.lng], 16, { duration: 0.8 })
  }, [reporte, map])
  return null
}

// Leyenda fija en la esquina inferior izquierda: color y conteo por grupo.
function Leyenda({ reportes }) {
  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leyenda">
        <div style={{ fontWeight: 700, marginBottom: 6 }}>REPORTES · {reportes.length}</div>
        {GRUPOS.map((g) => {
          const n = reportes.filter((r) => r.grupo === g.codigo).length
          return (
            <div key={g.codigo} className="leyenda__fila" style={{ opacity: n ? 1 : 0.45 }}>
              <span className="leyenda__punto" style={{ background: g.color }} />
              <span style={{ width: 28, color: '#94a3b8' }}>{g.codigo}</span>
              <span style={{ flex: 1 }}>{g.nombre}</span>
              <strong>{n}</strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}
