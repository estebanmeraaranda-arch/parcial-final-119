import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GRUPOS, colorDeGrupo } from '../data/grupos.js'
import { BARRIOS } from '../data/barrios.js'
import { useReportes } from '../context/ReportesContext.jsx'

const ULTIMO_ID_KEY = 'bomberos_119_ultimo_id'
const ESTADOS_FLUJO = ['Recibido', 'Validado', 'Unidad despachada', 'Cerrado']

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
  // Preguntas de continuación para grupo 300 (emergencias médicas)
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

  // Guardamos el id del último reporte enviado para que el ciudadano vea cambios de estado en vivo
  const [ultimoId, setUltimoId] = useState(() => {
    const guardado = localStorage.getItem(ULTIMO_ID_KEY)
    return guardado ? Number(guardado) : null
  })

  // Buscamos el reporte en tiempo real dentro del Context (se actualiza si el operador lo cambia)
  const reporteActual = reportes.find((r) => r.id === ultimoId) ?? null

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

  // Permite subir hasta 3 fotos acumulando o reemplazando y quitar cualquiera
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

  // Validaciones de todos los campos obligatorios del protocolo
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
    <main className="reportar-contenedor">
      <header className="reportar-header">
        <h1>Reportar emergencia · Línea 119</h1>
        <div style={{ display: 'flex', gap: 14 }}>
          <Link to="/operador">Ir al operador</Link>
          <Link to="/">← Volver al inicio</Link>
        </div>
      </header>

      {reporteActual ? (
        <section className="reportar-confirmacion">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>¡Reporte recibido en Central 119!</h2>
            <span className="badge-radicado">Radicado #{reporteActual.radicado}</span>
          </div>

          <p>
            Hemos registrado tu reporte a las <strong>{reporteActual.hora}</strong> para el barrio{' '}
            <strong>{reporteActual.barrio}</strong> ({reporteActual.direccion}). Mantén disponible el
            teléfono <strong>{reporteActual.telefono}</strong>.
          </p>

          {/* Aviso si el operador solicita más información */}
          {reporteActual.solicitudInfo && (
            <div className="alerta-operador">
              ⚠️ <strong>Aviso del radio operador:</strong> Central 119 solicita información adicional
              o confirmación telefónica sobre tu emergencia.
            </div>
          )}

          {/* Barra de progreso en vivo del estado del reporte */}
          <div className="estado-seguimiento">
            <h3>Estado actual del reporte: {reporteActual.estado}</h3>
            {reporteActual.estado === 'Descartado' ? (
              <p className="reportar-error">
                Este reporte fue marcado como Descartado (falso o duplicado) por el radio operador.
              </p>
            ) : (
              <ol className="lista-estados">
                {ESTADOS_FLUJO.map((paso, idx) => {
                  const indiceActual = ESTADOS_FLUJO.indexOf(reporteActual.estado)
                  const completado = idx <= indiceActual
                  const esActual = paso === reporteActual.estado
                  return (
                    <li
                      key={paso}
                      className={`paso-estado ${completado ? 'paso-completado' : ''} ${
                        esActual ? 'paso-actual' : ''
                      }`}
                    >
                      <strong>{idx + 1}. {paso}</strong>
                      {paso === 'Unidad despachada' && reporteActual.unidad && (
                        <span> — Unidad en camino: {reporteActual.unidad}</span>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </div>

          {reporteActual.fotos?.length > 0 && (
            <div>
              <strong>Fotos enviadas ({reporteActual.fotos.length}):</strong>
              <div className="reportar-miniaturas">
                {reporteActual.fotos.map((f, i) => (
                  <img key={i} src={f.url} alt={f.nombre} />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <button type="button" className="btn-secundario" onClick={iniciarNuevoReporte}>
              Registrar otro reporte
            </button>
          </div>
        </section>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="reportar-bloque">
            <legend>1. Datos del ciudadano</legend>

            <div className="reportar-fila-2">
              <div className="reportar-campo">
                <label htmlFor="nombres">Nombres *</label>
                <input
                  id="nombres"
                  name="nombres"
                  type="text"
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
                <label htmlFor="apellidos">Apellidos *</label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
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
              <label htmlFor="telefono">Teléfono (10 dígitos, solo números) *</label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                inputMode="numeric"
                autoComplete="tel"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {tocado.telefono && errores.telefono && (
                <p className="reportar-error">{errores.telefono}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="reportar-bloque">
            <legend>2. ¿Cuál es su emergencia?</legend>

            <div className="reportar-campo">
              <label htmlFor="grupo">Grupo de emergencia *</label>
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
                }}
                required
              >
                <option value="">-- Seleccione un grupo --</option>
                {GRUPOS.map((g) => (
                  <option key={g.codigo} value={g.codigo}>
                    {g.codigo} - {g.nombre}
                  </option>
                ))}
              </select>
              {tocado.grupo && errores.grupo && (
                <p className="reportar-error">{errores.grupo}</p>
              )}
            </div>

            {/* Preguntas de continuación si selecciona el grupo 300 (Rescates y médicas) */}
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
                <div className="reportar-campo">
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
              <label htmlFor="queVe">¿Qué ve? (Descripción de lo que está pasando) *</label>
              <textarea
                id="queVe"
                name="queVe"
                rows={3}
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
            <legend>3. ¿Dónde es su emergencia?</legend>

            <div className="reportar-fila-2">
              <div className="reportar-campo">
                <label htmlFor="barrio">Barrio *</label>
                <select
                  id="barrio"
                  name="barrio"
                  value={form.barrio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">-- Seleccione un barrio --</option>
                  {BARRIOS.map((b) => (
                    <option key={b.nombre} value={b.nombre}>
                      {b.nombre}
                    </option>
                  ))}
                </select>
                {tocado.barrio && errores.barrio && (
                  <p className="reportar-error">{errores.barrio}</p>
                )}
              </div>

              <div className="reportar-campo">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
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
                <label htmlFor="referencia">Punto de referencia *</label>
                <input
                  id="referencia"
                  name="referencia"
                  type="text"
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
                <label htmlFor="edificio">Nombre del edificio *</label>
                <input
                  id="edificio"
                  name="edificio"
                  type="text"
                  value={form.edificio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={form.noAplicaEdificio}
                  required={!form.noAplicaEdificio}
                />
                <label style={{ fontWeight: 400, marginTop: 6 }}>
                  <input
                    type="checkbox"
                    name="noAplicaEdificio"
                    checked={form.noAplicaEdificio}
                    onChange={handleChange}
                  />{' '}
                  No aplica
                </label>
                {!form.noAplicaEdificio && tocado.edificio && errores.edificio && (
                  <p className="reportar-error">{errores.edificio}</p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="reportar-bloque">
            <legend>4. Fotos de la emergencia (hasta 3 imágenes)</legend>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label htmlFor="fotos" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Adjuntar imágenes ({fotos.length}/3)
              </label>
              <button
                type="button"
                className="btn-link"
                onClick={() => setMostrarTipsFotos(!mostrarTipsFotos)}
              >
                {mostrarTipsFotos ? 'Ocultar recomendaciones' : '💡 Recomendaciones para tomar fotos'}
              </button>
            </div>

            {mostrarTipsFotos && (
              <div className="caja-tips">
                <strong>Recomendaciones de Bomberos Cali:</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                  <li>Mantén una distancia segura; nunca te acerques al fuego, humo o cables caídos.</li>
                  <li>Toma al menos 1 foto general donde se vea la fachada o el entorno para ubicar la unidad.</li>
                  <li>Si es accidente vial, enfoca cuántos vehículos están involucrados sin obstruir el paso.</li>
                </ul>
              </div>
            )}

            <div className="reportar-campo">
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
                        ✕ Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          <button type="submit" className="btn-enviar" disabled={!formularioValido}>
            Enviar reporte
          </button>
        </form>
      )}
    </main>
  )
}
