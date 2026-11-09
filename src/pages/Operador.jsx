import { useState, useEffect } from 'react'
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

const UNIDADES_DESPACHO = ['Máquina', 'Rescate', 'Ambulancia', 'HazMat']

export default function Operador() {
  const { reportes, actualizarReporte } = useReportes()
  const [seleccionadoId, setSeleccionadoId] = useState(reportes[0]?.id ?? null)
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroGrupo, setFiltroGrupo] = useState('Todos')
  const [unidadElegida, setUnidadElegida] = useState('Máquina')
  const [fotoAmpliada, setFotoAmpliada] = useState(null)

  const reportesFiltrados = reportes.filter((r) => {
    const cumpleEstado = filtroEstado === 'Todos' || r.estado === filtroEstado
    const cumpleGrupo = filtroGrupo === 'Todos' || Number(r.grupo) === Number(filtroGrupo)
    return cumpleEstado && cumpleGrupo
  })

  const seleccionado = reportes.find((r) => r.id === seleccionadoId) || null

  // Si entra un nuevo reporte y no había ninguno seleccionado, seleccionarlo automáticamente
  useEffect(() => {
    if (!seleccionado && reportes.length > 0) {
      setSeleccionadoId(reportes[0].id)
    }
  }, [reportes, seleccionado])

  // Sincronizar el selector de unidad cuando cambia el reporte seleccionado
  useEffect(() => {
    if (seleccionado?.unidad) {
      setUnidadElegida(seleccionado.unidad)
    } else {
      setUnidadElegida('Máquina')
    }
  }, [seleccionado?.id, seleccionado?.unidad])

  const infoGrupoSeleccionado = seleccionado
    ? GRUPOS.find((g) => g.codigo === Number(seleccionado.grupo))
    : null

  const cambiarGrupoReporte = (nuevoCodigo) => {
    if (!seleccionado) return
    actualizarReporte(seleccionado.id, { grupo: Number(nuevoCodigo) })
  }

  const validarReporte = () => {
    if (!seleccionado) return
    actualizarReporte(seleccionado.id, {
      estado: 'Validado',
      solicitudInfo: false,
    })
  }

  const descartarReporte = () => {
    if (!seleccionado) return
    actualizarReporte(seleccionado.id, {
      estado: 'Descartado',
      unidad: null,
      solicitudInfo: false,
    })
  }

  const despacharUnidad = () => {
    if (!seleccionado || seleccionado.estado !== 'Validado') return
    actualizarReporte(seleccionado.id, {
      estado: 'Unidad despachada',
      unidad: unidadElegida,
    })
  }

  const cerrarCaso = () => {
    if (!seleccionado) return
    actualizarReporte(seleccionado.id, {
      estado: 'Cerrado',
    })
  }

  const alternarSolicitudInfo = () => {
    if (!seleccionado) return
    actualizarReporte(seleccionado.id, {
      solicitudInfo: !seleccionado.solicitudInfo,
    })
  }

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
          mensajeInicial="Central 119 en línea. Selecciona un reporte para validar y despachar."
          mensajeActivo="Unidades listas para salir a cualquier barrio de Cali."
          altura={145}
        />

        {/* Detalle del reporte seleccionado + Acciones de validación y despacho */}
        {seleccionado ? (
          <section className="operador-detalle-card">
            <div className="operador-detalle-head">
              <div>
                <span className="operador-radicado-tag">
                  Radicado {seleccionado.radicado || `#${seleccionado.id}`} · {seleccionado.hora || '--:--'}
                </span>
                <h3 className="operador-detalle-barrio">{seleccionado.barrio}</h3>
              </div>
              <span
                className={`operador-estado-badge estado-${seleccionado.estado
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              >
                {seleccionado.estado}
              </span>
            </div>

            {/* Datos del ciudadano y botón Llamar */}
            <div className="operador-bloque">
              <div className="operador-bloque-titulo">Datos del ciudadano</div>
              <div className="operador-ciudadano-row">
                <div>
                  <div className="operador-dato-principal">
                    {[seleccionado.nombres, seleccionado.apellidos].filter(Boolean).join(' ') ||
                      'Ciudadano registrado'}
                  </div>
                  <div className="operador-dato-sec">
                    Tel: {seleccionado.telefono || 'Sin teléfono'}
                  </div>
                </div>
                {seleccionado.telefono && (
                  <a
                    href={`tel:${seleccionado.telefono}`}
                    className="operador-btn-llamar"
                  >
                    Llamar al ciudadano
                  </a>
                )}
              </div>
            </div>

            {/* Datos de la emergencia y ubicación */}
            <div className="operador-bloque">
              <div className="operador-bloque-titulo">Emergencia y ubicación</div>

              <div className="operador-campo-inline">
                <label htmlFor="corregir-grupo">Grupo protocolo (corregible):</label>
                <select
                  id="corregir-grupo"
                  value={seleccionado.grupo}
                  onChange={(e) => cambiarGrupoReporte(e.target.value)}
                  style={{
                    borderLeft: `4px solid ${colorDeGrupo(seleccionado.grupo)}`,
                  }}
                >
                  {GRUPOS.map((g) => (
                    <option key={g.codigo} value={g.codigo}>
                      {g.codigo} — {g.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {infoGrupoSeleccionado && (
                <div className="operador-grupo-Actual">
                  <span
                    className="operador-grupo-dot"
                    style={{ backgroundColor: infoGrupoSeleccionado.color }}
                  />
                  <span>
                    Grupo {infoGrupoSeleccionado.codigo}: {infoGrupoSeleccionado.nombre}
                  </span>
                </div>
              )}

              <p className="operador-que-ve">
                <strong>Qué ve:</strong> {seleccionado.queVe || 'Sin descripción registrada.'}
              </p>

              <div className="operador-ubicacion-grid">
                <div>
                  <span>Dirección:</span>
                  <strong>{seleccionado.direccion || 'No especificada'}</strong>
                </div>
                <div>
                  <span>Barrio:</span>
                  <strong>{seleccionado.barrio}</strong>
                </div>
                <div>
                  <span>Punto de referencia:</span>
                  <strong>{seleccionado.referencia || 'Sin referencia'}</strong>
                </div>
                <div>
                  <span>Edificio / conjunto:</span>
                  <strong>{seleccionado.edificio || 'No aplica'}</strong>
                </div>
              </div>

              <div className="operador-links-mapa">
                <a
                  href={`https://www.google.com/maps?q=${seleccionado.lat},${seleccionado.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="operador-link-gmaps"
                >
                  Ver en Google Maps ({Number(seleccionado.lat).toFixed(4)},{' '}
                  {Number(seleccionado.lng).toFixed(4)})
                </a>
              </div>
            </div>

            {/* Miniaturas de las fotos subidas */}
            <div className="operador-bloque">
              <div className="operador-bloque-titulo">
                Evidencia fotográfica ({seleccionado.fotos?.length || 0})
              </div>
              {seleccionado.fotos && seleccionado.fotos.length > 0 ? (
                <div className="operador-fotos-grid">
                  {seleccionado.fotos.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="operador-foto-thumb"
                      onClick={() => setFotoAmpliada(src)}
                      title="Ver imagen en tamaño completo"
                    >
                      <img src={src} alt={`Evidencia ${idx + 1} del reporte`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="operador-sin-fotos">
                  El ciudadano no adjuntó fotografías en este reporte.
                </div>
              )}
            </div>

            {/* Contactar y validar */}
            <div className="operador-bloque">
              <div className="operador-bloque-titulo">1. Validación del caso</div>
              <div className="operador-acciones-val">
                <button
                  type="button"
                  onClick={validarReporte}
                  className={`operador-btn-validar ${
                    seleccionado.estado === 'Validado' ? 'activo' : ''
                  }`}
                >
                  Marcar como Validado
                </button>
                <button
                  type="button"
                  onClick={descartarReporte}
                  className={`operador-btn-descartar ${
                    seleccionado.estado === 'Descartado' ? 'activo' : ''
                  }`}
                >
                  Descartar (falso / duplicado)
                </button>
              </div>
              <button
                type="button"
                onClick={alternarSolicitudInfo}
                className={`operador-btn-info ${seleccionado.solicitudInfo ? 'activo' : ''}`}
              >
                {seleccionado.solicitudInfo
                  ? 'Solicitud de más información enviada al ciudadano (clic para quitar)'
                  : 'Solicitar más información o foto adicional al ciudadano'}
              </button>
            </div>

            {/* Despacho y cierre */}
            <div className="operador-bloque">
              <div className="operador-bloque-titulo">2. Despacho de unidades y cierre</div>
              {seleccionado.estado !== 'Validado' &&
                seleccionado.estado !== 'Unidad despachada' &&
                seleccionado.estado !== 'Cerrado' && (
                  <div className="operador-aviso-val">
                    Para despachar una unidad, primero valida el reporte con el ciudadano.
                  </div>
                )}

              <div className="operador-unidades-grid">
                {UNIDADES_DESPACHO.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnidadElegida(u)}
                    className={`operador-unidad-opcion ${
                      unidadElegida === u ? 'seleccionada' : ''
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className="operador-acciones-despacho">
                <button
                  type="button"
                  onClick={despacharUnidad}
                  disabled={seleccionado.estado !== 'Validado'}
                  className="operador-btn-despachar"
                >
                  Despachar {unidadElegida}
                </button>

                <button
                  type="button"
                  onClick={cerrarCaso}
                  disabled={
                    seleccionado.estado === 'Cerrado' ||
                    seleccionado.estado === 'Descartado'
                  }
                  className="operador-btn-cerrar"
                >
                  Marcar como Cerrado
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="operador-vacio">
            Selecciona un reporte en la lista o en el mapa para ver su detalle.
          </div>
        )}

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
          <span>Bandeja de reportes ({reportesFiltrados.length})</span>
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
                    <span
                      className={`operador-estado-badge estado-${r.estado
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
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
      </aside>

      {/* Visor de foto ampliada */}
      {fotoAmpliada && (
        <div
          className="modal-guia-backdrop"
          onClick={() => setFotoAmpliada(null)}
        >
          <div
            className="modal-guia-card"
            style={{ maxWidth: 680 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-guia-header">
              <div>
                <span className="modal-guia-tag">EVIDENCIA DEL CIUDADANO</span>
                <h3>Vista previa de fotografía</h3>
              </div>
              <button
                type="button"
                className="modal-guia-cerrar"
                onClick={() => setFotoAmpliada(null)}
              >
                Cerrar
              </button>
            </div>
            <img
              src={fotoAmpliada}
              alt="Evidencia ampliada"
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 10,
                background: '#0f172a',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
