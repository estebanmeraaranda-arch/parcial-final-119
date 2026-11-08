import { useState } from 'react'
import MapaOperador from '../mapa/MapaOperador.jsx'
import { useReportes } from '../context/ReportesContext.jsx'
import { GRUPOS, colorDeGrupo } from '../data/grupos.js'
import MascotaPerro119 from '../three/MascotaPerro119.jsx'

const ESTADOS_FILTRO = [
  'Todos',
  'Recibido',
  'Validado',
  'Unidad despachada',
  'Cerrado',
  'Descartado',
]

export default function Operador() {
  const { reportes } = useReportes()
  const [seleccionadoId, setSeleccionadoId] = useState(reportes[0]?.id ?? null)
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroGrupo, setFiltroGrupo] = useState('Todos')

  const reportesFiltrados = reportes.filter((r) => {
    const cumpleEstado = filtroEstado === 'Todos' || r.estado === filtroEstado
    const cumpleGrupo = filtroGrupo === 'Todos' || Number(r.grupo) === Number(filtroGrupo)
    return cumpleEstado && cumpleGrupo
  })

  const seleccionado = reportes.find((r) => r.id === seleccionadoId) || null

  return (
    <div className="operador-layout">
      <div className="operador-mapa-wrap">
        <MapaOperador
          reportes={reportesFiltrados}
          seleccionadoId={seleccionadoId}
          onSeleccionar={setSeleccionadoId}
        />
      </div>

      <aside className="operador-panel">
        <div className="operador-header">
          <div>
            <span className="operador-subtitulo">CENTRAL CAD 119 · CALI</span>
            <h2 className="operador-titulo">Consola de Radio Operador</h2>
          </div>
          <span className="operador-contador">
            {reportesFiltrados.length} de {reportes.length} casos
          </span>
        </div>

        <MascotaPerro119
          nombre="Keshi-kun (Unidad 9)"
          rol="Mascota de Despacho · Central CAD 119"
          numeroCasco="9"
          colorCasco="#ea580c"
          colorTraje="#0f172a"
          colorPelaje="#b45309"
          mensajeInicial="Central 119 en línea. Selecciona un reporte para volar al pin en el mapa."
          mensajeActivo="Unidades listas para salir a cualquier barrio de Cali."
          altura={155}
        />

        {/* Filtros rápidos por estado y grupo */}
        <div className="operador-filtros">
          <div className="operador-filtro-col">
            <label htmlFor="filtro-estado">Filtrar por estado</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              {ESTADOS_FILTRO.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>
          </div>

          <div className="operador-filtro-col">
            <label htmlFor="filtro-grupo">Filtrar por grupo</label>
            <select
              id="filtro-grupo"
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
            >
              <option value="Todos">Todos los grupos</option>
              {GRUPOS.map((g) => (
                <option key={g.codigo} value={g.codigo}>
                  {g.codigo} · {g.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de reportes conectada al estado global */}
        <div className="operador-seccion-titulo">
          <span>Bandeja de reportes entrantes</span>
          <small>Clic para centrar en mapa</small>
        </div>

        <ul className="operador-lista">
          {reportesFiltrados.map((r) => {
            const colorGrupo = colorDeGrupo(r.grupo)
            const activo = r.id === seleccionadoId
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setSeleccionadoId(r.id)}
                  className={`operador-item ${activo ? 'activo' : ''}`}
                >
                  <div className="operador-item-top">
                    <span
                      className="operador-grupo-chip"
                      style={{
                        backgroundColor: `${colorGrupo}22`,
                        borderColor: colorGrupo,
                        color: '#f8fafc',
                      }}
                    >
                      <span
                        className="operador-grupo-dot"
                        style={{ backgroundColor: colorGrupo }}
                      />
                      Grupo {r.grupo}
                    </span>
                    <span className="operador-item-hora">
                      {r.radicado || `#${r.id}`} · {r.hora || '--:--'}
                    </span>
                  </div>

                  <div className="operador-item-barrio">{r.barrio}</div>
                  {r.direccion && (
                    <div className="operador-item-dir">{r.direccion}</div>
                  )}

                  <div className="operador-item-bottom">
                    <span className={`operador-estado-badge estado-${r.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {r.estado}
                    </span>
                    {r.unidad && (
                      <span className="operador-unidad-tag">
                        Unidad: {r.unidad}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
          {reportesFiltrados.length === 0 && (
            <li className="operador-vacio">
              No hay reportes que coincidan con los filtros seleccionados.
            </li>
          )}
        </ul>

        {seleccionado && (
          <div className="operador-resumen-mini">
            Reporte seleccionado: <strong>{seleccionado.radicado || `#${seleccionado.id}`}</strong> en{' '}
            <strong>{seleccionado.barrio}</strong> ({seleccionado.estado})
          </div>
        )}
      </aside>
    </div>
  )
}
