import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GRUPOS, colorDeGrupo } from '../data/grupos.js'
import { BARRIOS } from '../data/barrios.js'

// Pantalla 2 (/reportar): formulario completo con validación, hasta 3 fotos
// y confirmación básica (pendiente conectar al Context global y aplicar diseño final).
export default function Reportar() {
  const [form, setForm] = useState({
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
  })

  const [fotos, setFotos] = useState([])
  const [tocado, setTocado] = useState({})
  const [reporteEnviado, setReporteEnviado] = useState(null)

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
    const archivos = Array.from(e.target.files || []).slice(0, 3)
    const urls = archivos.map((file) => ({
      nombre: file.name,
      url: URL.createObjectURL(file),
    }))
    setFotos(urls)
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

    const barrioObj = BARRIOS.find((b) => b.nombre === form.barrio)
    const nuevoReporte = {
      id: Math.floor(1000 + Math.random() * 9000),
      hora: new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      estado: 'Recibido',
      ...form,
      grupo: Number(form.grupo),
      lat: barrioObj?.lat ?? 3.437,
      lng: barrioObj?.lng ?? -76.522,
      fotos,
    }

    setReporteEnviado(nuevoReporte)
  }

  return (
    <main className="reportar-contenedor">
      <header className="reportar-header">
        <h1>Reportar emergencia · Línea 119</h1>
        <Link to="/">← Volver al inicio</Link>
      </header>

      {reporteEnviado ? (
        <section className="reportar-confirmacion">
          <h2>¡Reporte recibido!</h2>
          <p>
            <strong>Número de radicado:</strong> #119-{reporteEnviado.id}
          </p>
          <p>
            <strong>Hora de registro:</strong> {reporteEnviado.hora}
          </p>
          <p>
            <strong>Estado actual:</strong> {reporteEnviado.estado}
          </p>
          <p>
            <strong>Ubicación:</strong> {reporteEnviado.direccion} ({reporteEnviado.barrio})
          </p>
          {reporteEnviado.fotos.length > 0 && (
            <div className="reportar-miniaturas">
              {reporteEnviado.fotos.map((f, i) => (
                <img key={i} src={f.url} alt={f.nombre} />
              ))}
            </div>
          )}
          <p style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setReporteEnviado(null)}
            >
              Crear otro reporte
            </button>
          </p>
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
            <legend>4. Fotos de la emergencia (opcional, hasta 3)</legend>
            <div className="reportar-campo">
              <label htmlFor="fotos">Subir imágenes (máximo 3)</label>
              <input
                id="fotos"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFotos}
              />
              {fotos.length > 0 && (
                <div className="reportar-miniaturas">
                  {fotos.map((f, i) => (
                    <img key={i} src={f.url} alt={f.nombre} />
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
