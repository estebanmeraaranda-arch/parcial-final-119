import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GRUPOS, colorDeGrupo } from '../data/grupos.js'
import { BARRIOS } from '../data/barrios.js'
import { useReportes } from '../context/ReportesContext.jsx'

const ULTIMO_ID_KEY = 'bomberos_119_ultimo_id'
const ESTADOS_FLUJO = [
  {
    nombre: 'Recibido',
    detalle: 'Coordenadas y fotos registradas en el mapa CAD.',
  },
  {
    nombre: 'Validado',
    detalle: 'Caso verificado por Radio Operador · Preparando respuesta.',
  },
  {
    nombre: 'Unidad despachada',
    detalle: 'Máquina extintora / Ambulancia / Rescate en camino.',
  },
  {
    nombre: 'Cerrado',
    detalle: 'Emergencia controlada por Bomberos Cali.',
  },
]

const FORM_INICIAL = {
  nombres: '',
  apellidos: '',
  telefono: '',
  grupo: '',
  queVe: '',
  direccion: '',
  barrio: '',
  referencia: '',
  edificio: '',
  noAplicaEdificio: false,
  pacienteEdadSexo: '',
  pacienteConsciente: 'Sí',
  pacienteRespira: 'Sí',
}

export default function Reportar() {
  const { reportes, agregarReporte } = useReportes()

  const [form, setForm] = useState(FORM_INICIAL)
  const [fotos, setFotos] = useState([])
  const [tocado, setTocado] = useState({})
  const [mostrarTipsFotos, setMostrarTipsFotos] = useState(false)

  const [ultimoId, setUltimoId] = useState(() => {
    const guardado = localStorage.getItem(ULTIMO_ID_KEY)
    return guardado ? Number(guardado) : null
  })

  const reporteActual = reportes.find((r) => r.id === ultimoId) ?? null
  const grupoInfo = GRUPOS.find(
    (g) => g.codigo === Number(reporteActual?.grupo || form.grupo)
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox' && name === 'noAplicaEdificio') {
      setForm({
        ...form,
        noAplicaEdificio: checked,
        edificio: checked ? 'No aplica' : '',
      })
      return
    }

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 10)
      setForm({ ...form, telefono: soloNumeros })
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleBlur = (e) => {
    setTocado({ ...tocado, [e.target.name]: true })
  }

  const handleFotos = (e) => {
    const archivos = Array.from(e.target.files || [])
    if (!archivos.length) return

    const nuevas = archivos.map((file) => ({
      nombre: file.name,
      url: URL.createObjectURL(file),
    }))

    setFotos((prev) => [...prev, ...nuevas].slice(0, 3))
    e.target.value = ''
  }

  const quitarFoto = (indice) => {
    setFotos((prev) => prev.filter((_, i) => i !== indice))
  }

  const errores = {
    nombres: form.nombres.trim() === '' ? 'El nombre es obligatorio.' : '',
    apellidos: form.apellidos.trim() === '' ? 'Los apellidos son obligatorios.' : '',
    telefono:
      form.telefono.length !== 10
        ? 'El teléfono debe tener exactamente 10 dígitos numéricos.'
        : '',
    grupo: form.grupo === '' ? 'Seleccione un grupo de emergencia.' : '',
    queVe: form.queVe.trim() === '' ? 'Describa qué está viendo en la emergencia.' : '',
    direccion: form.direccion.trim() === '' ? 'La dirección es obligatoria.' : '',
    barrio: form.barrio === '' ? 'Seleccione el barrio.' : '',
    referencia:
      form.referencia.trim() === '' ? 'El punto de referencia es obligatorio.' : '',
    edificio:
      !form.noAplicaEdificio && form.edificio.trim() === ''
        ? 'Indique el nombre del edificio o marque "No aplica".'
        : '',
  }

  const formularioValido = Object.values(errores).every((msg) => msg === '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formularioValido) return

    const creado = agregarReporte({
      ...form,
      fotos,
    })

    setUltimoId(creado.id)
    localStorage.setItem(ULTIMO_ID_KEY, String(creado.id))
  }

  const iniciarNuevoReporte = () => {
    setUltimoId(null)
    localStorage.removeItem(ULTIMO_ID_KEY)
    setForm(FORM_INICIAL)
    setFotos([])
    setTocado({})
  }

  return (
    <div className="reportar-pagina">
      <header className="reportar-topbar">
        <div className="reportar-brand">
          <div className="escudo-119">119</div>
          <div>
            <h1>Formulario de Reporte Digital · Línea 119 Cali</h1>
            <p>Todos los campos marcados con (*) son obligatorios según el protocolo Despacho V4</p>
          </div>
        </div>
        <div className="reportar-topbar-nav">
          <Link to="/operador" className="btn-volver-top">
            Tablero Operador
          </Link>
          <Link to="/" className="btn-volver-top">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="reportar-layout">
        {/* Columna izquierda: Formulario del protocolo */}
        <section className="reportar-tarjeta-form">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset className="reportar-bloque">
              <div className="seccion-titulo">
                <span className="paso-circulo">1</span>
                <span>Datos del ciudadano («¿Cuál es su nombre y de qué número llama?»)</span>
              </div>

              <div className="reportar-fila-2">
                <div className="reportar-campo">
                  <label htmlFor="nombres">
                    Nombres <span className="asterisco">*</span>
                  </label>
                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    placeholder="Ej. Camilo Andrés"
                    autoComplete="given-name"
                    value={form.nombres}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {tocado.nombres && errores.nombres && (
                    <p className="reportar-error">{errores.nombres}</p>
                  )}
                </div>

                <div className="reportar-campo">
                  <label htmlFor="apellidos">
                    Apellidos <span className="asterisco">*</span>
                  </label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    placeholder="Ej. Valencia Ortiz"
                    autoComplete="family-name"
                    value={form.apellidos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {tocado.apellidos && errores.apellidos && (
                    <p className="reportar-error">{errores.apellidos}</p>
                  )}
                </div>
              </div>

              <div className="reportar-campo">
                <label htmlFor="telefono">
                  Teléfono celular (10 dígitos, solo números) <span className="asterisco">*</span>
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej. 3158904412"
                  autoComplete="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {form.telefono.length === 10 ? (
                  <p className="reportar-valido">
                    Número válido de 10 dígitos para retorno de llamada del operador
                  </p>
                ) : (
                  tocado.telefono &&
                  errores.telefono && <p className="reportar-error">{errores.telefono}</p>
                )}
              </div>
            </fieldset>

            <fieldset className="reportar-bloque">
              <div className="seccion-titulo">
                <span className="paso-circulo">2</span>
                <span>Clasificación («Línea 119 Bomberos Cali, ¿cuál es su emergencia?»)</span>
              </div>

              <div className="reportar-campo">
                <label htmlFor="grupo">
                  Grupo de emergencia <span className="asterisco">*</span>
                </label>
                <select
                  id="grupo"
                  name="grupo"
                  value={form.grupo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    borderLeft: form.grupo
                      ? `6px solid ${colorDeGrupo(Number(form.grupo))}`
                      : undefined,
                    fontWeight: form.grupo ? 600 : 400,
                  }}
                  required
                >
                  <option value="">-- Seleccione un grupo de emergencia --</option>
                  {GRUPOS.map((g) => (
                    <option key={g.codigo} value={g.codigo}>
                      {g.codigo} — {g.nombre}
                    </option>
                  ))}
                </select>
                {tocado.grupo && errores.grupo && (
                  <p className="reportar-error">{errores.grupo}</p>
                )}
              </div>

              {Number(form.grupo) === 300 && (
                <div className="subbloque-300">
                  <strong>Datos adicionales para emergencia médica / rescate (Código 300):</strong>
                  <div className="reportar-fila-2" style={{ marginTop: 8 }}>
                    <div className="reportar-campo">
                      <label htmlFor="pacienteEdadSexo">Sexo y edad aproximada</label>
                      <input
                        id="pacienteEdadSexo"
                        name="pacienteEdadSexo"
                        type="text"
                        placeholder="Ej. Hombre, 45 años"
                        value={form.pacienteEdadSexo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="reportar-campo">
                      <label htmlFor="pacienteConsciente">¿Está consciente?</label>
                      <select
                        id="pacienteConsciente"
                        name="pacienteConsciente"
                        value={form.pacienteConsciente}
                        onChange={handleChange}
                      >
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                        <option value="No sabe">No sabe</option>
                      </select>
                    </div>
                  </div>
                  <div className="reportar-campo" style={{ marginBottom: 0 }}>
                    <label htmlFor="pacienteRespira">¿Respira?</label>
                    <select
                      id="pacienteRespira"
                      name="pacienteRespira"
                      value={form.pacienteRespira}
                      onChange={handleChange}
                    >
                      <option value="Sí">Sí</option>
                      <option value="Con dificultad">Con dificultad</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="reportar-campo">
                <label htmlFor="queVe">
                  ¿Qué ve? (Descripción de lo que está pasando) <span className="asterisco">*</span>
                </label>
                <textarea
                  id="queVe"
                  name="queVe"
                  rows={3}
                  placeholder="Describa qué observa (humo, llamas, personas atrapadas, olor a gas...)"
                  value={form.queVe}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {tocado.queVe && errores.queVe && (
                  <p className="reportar-error">{errores.queVe}</p>
                )}
              </div>
            </fieldset>

            <fieldset className="reportar-bloque">
              <div className="seccion-titulo">
                <span className="paso-circulo">3</span>
                <span>Ubicación exacta en Cali («¿Dónde es su emergencia?»)</span>
              </div>

              <div className="reportar-fila-2">
                <div className="reportar-campo">
                  <label htmlFor="barrio">
                    Barrio (con coordenadas en mapa) <span className="asterisco">*</span>
                  </label>
                  <select
                    id="barrio"
                    name="barrio"
                    value={form.barrio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">-- Seleccione un barrio de Cali --</option>
                    {BARRIOS.map((b) => (
                      <option key={b.nombre} value={b.nombre}>
                        {b.nombre} ({b.lat}, {b.lng})
                      </option>
                    ))}
                  </select>
                  {tocado.barrio && errores.barrio && (
                    <p className="reportar-error">{errores.barrio}</p>
                  )}
                </div>

                <div className="reportar-campo">
                  <label htmlFor="direccion">
                    Dirección <span className="asterisco">*</span>
                  </label>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Ej. Calle 2 # 10-45"
                    autoComplete="street-address"
                    value={form.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {tocado.direccion && errores.direccion && (
                    <p className="reportar-error">{errores.direccion}</p>
                  )}
                </div>
              </div>

              <div className="reportar-fila-2">
                <div className="reportar-campo">
                  <label htmlFor="referencia">
                    Punto de referencia <span className="asterisco">*</span>
                  </label>
                  <input
                    id="referencia"
                    name="referencia"
                    type="text"
                    placeholder="Ej. A media cuadra del Parque de San Antonio"
                    value={form.referencia}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {tocado.referencia && errores.referencia && (
                    <p className="reportar-error">{errores.referencia}</p>
                  )}
                </div>

                <div className="reportar-campo">
                  <label htmlFor="edificio">
                    Nombre del edificio / conjunto <span className="asterisco">*</span>
                  </label>
                  <input
                    id="edificio"
                    name="edificio"
                    type="text"
                    placeholder="Ej. Edificio Mirador"
                    value={form.edificio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={form.noAplicaEdificio}
                    required={!form.noAplicaEdificio}
                  />
                  <label className="checkbox-no-aplica">
                    <input
                      type="checkbox"
                      name="noAplicaEdificio"
                      checked={form.noAplicaEdificio}
                      onChange={handleChange}
                    />
                    No aplica (casa o vía pública)
                  </label>
                  {!form.noAplicaEdificio && tocado.edificio && errores.edificio && (
                    <p className="reportar-error">{errores.edificio}</p>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="reportar-bloque">
              <div className="seccion-titulo">
                <span className="paso-circulo">4</span>
                <span>Fotos de la emergencia (Hasta 3 imágenes con miniatura)</span>
              </div>

              <div className="fotos-dropzone">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <label htmlFor="fotos" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    {fotos.length} de 3 fotos adjuntadas
                  </label>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => setMostrarTipsFotos(!mostrarTipsFotos)}
                  >
                    {mostrarTipsFotos
                      ? 'Ocultar recomendaciones'
                      : 'Ver recomendaciones para tomar las fotos'}
                  </button>
                </div>

                {mostrarTipsFotos && (
                  <div className="caja-tips">
                    <strong>Recomendaciones de Bomberos Cali:</strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                      <li>Mantén una distancia segura; no te acerques al fuego, humo o cables caídos.</li>
                      <li>Toma una foto abierta donde se vea la fachada o el entorno para ubicar la máquina.</li>
                      <li>En accidentes viales, muestra los vehículos involucrados sin obstaculizar la vía.</li>
                    </ul>
                  </div>
                )}

                <input
                  id="fotos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFotos}
                  disabled={fotos.length >= 3}
                />

                {fotos.length > 0 && (
                  <div className="reportar-miniaturas">
                    {fotos.map((f, i) => (
                      <div key={i} className="miniatura-item">
                        <img src={f.url} alt={f.nombre} />
                        <button
                          type="button"
                          className="btn-quitar-foto"
                          onClick={() => quitarFoto(i)}
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </fieldset>

            <button type="submit" className="btn-enviar" disabled={!formularioValido}>
              Enviar reporte a Central 119 Cali
            </button>
          </form>
        </section>

        {/* Columna derecha: Tarjeta oscura de Respuesta Automática y Estado en Vivo */}
        <aside className="panel-confirmacion-dark">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-respuesta-auto">Respuesta Automática</span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {reporteActual ? `Hora: ${reporteActual.hora}` : 'Central 119 Cali'}
            </span>
          </div>

          {reporteActual ? (
            <>
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem' }}>
                  ¡Reporte recibido en Central 119!
                </h2>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  El radio operador ya ve tu punto exacto en el mapa de Cali (Barrio{' '}
                  <strong>{reporteActual.barrio}</strong>). Mantén tu teléfono{' '}
                  <strong>{reporteActual.telefono}</strong> disponible.
                </p>
              </div>

              {reporteActual.solicitudInfo && (
                <div className="alerta-operador">
                  <strong>Aviso del operador:</strong> Central 119 solicita información adicional
                  sobre tu emergencia.
                </div>
              )}

              <div className="caja-radicado-dark">
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Número de Radicado
                  </div>
                  <div className="numero-radicado-grande">#{reporteActual.radicado}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Grupo</div>
                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: colorDeGrupo(reporteActual.grupo),
                    }}
                  >
                    {reporteActual.grupo} · {grupoInfo?.nombre}
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  Estado en tiempo real (Sincronizado con el Operador)
                </div>

                {reporteActual.estado === 'Descartado' ? (
                  <div className="alerta-operador">
                    Este reporte fue marcado como <strong>Descartado</strong> (falso o duplicado)
                    por el radio operador.
                  </div>
                ) : (
                  <ol className="lista-estados-dark">
                    {ESTADOS_FLUJO.map((paso, idx) => {
                      const nombresFlujo = ESTADOS_FLUJO.map((p) => p.nombre)
                      const indiceActual = nombresFlujo.indexOf(reporteActual.estado)
                      const esCompletado = idx < indiceActual
                      const esActual = paso.nombre === reporteActual.estado
                      return (
                        <li
                          key={paso.nombre}
                          className={`paso-dark ${esCompletado ? 'completado' : ''} ${
                            esActual ? 'actual' : ''
                          }`}
                        >
                          <span className="punto-paso" />
                          <div>
                            <strong>
                              {idx + 1}. {paso.nombre}
                            </strong>
                            <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: 2 }}>
                              {paso.nombre === 'Unidad despachada' && reporteActual.unidad
                                ? `Unidad en camino: ${reporteActual.unidad}`
                                : paso.detalle}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </div>

              <button
                type="button"
                className="btn-secundario-dark"
                onClick={iniciarNuevoReporte}
              >
                Limpiar para registrar otro reporte
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: '1.2rem' }}>
                  Seguimiento en vivo de tu emergencia
                </h2>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  Completa los campos obligatorios y presiona <strong>Enviar reporte</strong>. Aquí
                  recibirás al instante tu número de radicado y verás los cambios que haga el radio
                  operador.
                </p>
              </div>

              <ol className="lista-estados-dark">
                {ESTADOS_FLUJO.map((paso, idx) => (
                  <li key={paso.nombre} className="paso-dark">
                    <span className="punto-paso" />
                    <div>
                      <strong>
                        {idx + 1}. {paso.nombre}
                      </strong>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: 2 }}>
                        {paso.detalle}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </aside>
      </main>
    </div>
  )
}
