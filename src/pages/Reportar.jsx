import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GRUPOS } from '../data/grupos.js'
import { BARRIOS } from '../data/barrios.js'

// Primera parte de /reportar: datos del ciudadano, datos principales de la emergencia
// y validación básica de campos obligatorios (sin estilos).
// TODO (Parte 2): punto de referencia, edificio + "No aplica", fotos (máx 3) y confirmación con Context.
export default function Reportar() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    grupo: '',
    queVe: '',
    direccion: '',
    barrio: '',
  })

  const [tocado, setTocado] = useState({})
  const [enviadoTemp, setEnviadoTemp] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    // En teléfono solo permitimos dígitos numéricos (máximo 10)
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

  // Validaciones de los campos obligatorios de esta primera parte
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
  }

  const formularioValido = Object.values(errores).every((msg) => msg === '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formularioValido) return
    setEnviadoTemp(true)
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Reportar emergencia · Línea 119</h1>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>

      {enviadoTemp ? (
        <div>
          <h2>Reporte registrado (vista preliminar)</h2>
          <p>
            Ciudadano: {form.nombres} {form.apellidos} ({form.telefono})
          </p>
          <p>
            Emergencia grupo {form.grupo} en barrio {form.barrio} — {form.direccion}
          </p>
          <button type="button" onClick={() => setEnviadoTemp(false)}>
            Hacer otro reporte
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <fieldset style={{ marginBottom: 16 }}>
            <legend>1. Datos del ciudadano</legend>

            <div>
              <label htmlFor="nombres">Nombres *</label>
              <br />
              <input
                id="nombres"
                name="nombres"
                type="text"
                autocomplete="given-name"
                value={form.nombres}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {tocado.nombres && errores.nombres && <p>{errores.nombres}</p>}
            </div>

            <div>
              <label htmlFor="apellidos">Apellidos *</label>
              <br />
              <input
                id="apellidos"
                name="apellidos"
                type="text"
                autocomplete="family-name"
                value={form.apellidos}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {tocado.apellidos && errores.apellidos && <p>{errores.apellidos}</p>}
            </div>

            <div>
              <label htmlFor="telefono">Teléfono (10 dígitos) *</label>
              <br />
              <input
                id="telefono"
                name="telefono"
                type="text"
                inputMode="numeric"
                autocomplete="tel"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {tocado.telefono && errores.telefono && <p>{errores.telefono}</p>}
            </div>
          </fieldset>

          <fieldset style={{ marginBottom: 16 }}>
            <legend>2. Datos de la emergencia</legend>

            <div>
              <label htmlFor="grupo">Grupo de emergencia *</label>
              <br />
              <select
                id="grupo"
                name="grupo"
                value={form.grupo}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">-- Seleccione un grupo --</option>
                {GRUPOS.map((g) => (
                  <option key={g.codigo} value={g.codigo}>
                    {g.codigo} - {g.nombre}
                  </option>
                ))}
              </select>
              {tocado.grupo && errores.grupo && <p>{errores.grupo}</p>}
            </div>

            <div>
              <label htmlFor="queVe">¿Qué ve? (Descripción) *</label>
              <br />
              <textarea
                id="queVe"
                name="queVe"
                rows={3}
                value={form.queVe}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {tocado.queVe && errores.queVe && <p>{errores.queVe}</p>}
            </div>

            <div>
              <label htmlFor="direccion">Dirección *</label>
              <br />
              <input
                id="direccion"
                name="direccion"
                type="text"
                autocomplete="street-address"
                value={form.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {tocado.direccion && errores.direccion && <p>{errores.direccion}</p>}
            </div>

            <div>
              <label htmlFor="barrio">Barrio *</label>
              <br />
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
              {tocado.barrio && errores.barrio && <p>{errores.barrio}</p>}
            </div>
          </fieldset>

          <button type="submit" disabled={!formularioValido}>
            Enviar reporte
          </button>
        </form>
      )}
    </main>
  )
}
