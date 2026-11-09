import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../mapa/mapa.css'
import { crearIcono } from '../mapa/iconos.js'
import { GRUPOS, colorDeGrupo } from '../data/grupos.js'
import { BARRIOS, COMUNAS_CALI } from '../data/barrios.js'
import { useReportes } from '../context/ReportesContext.jsx'
import MascotaPerro119 from '../three/MascotaPerro119.jsx'

const CENTRO_CALI = [3.437, -76.522]
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
  comuna: '',
  barrio: '',
  direccion: '',
  referencia: '',
  edificio: '',
  noAplicaEdificio: false,
  pacienteEdadSexo: '',
  pacienteConsciente: 'Sí',
  pacienteRespira: 'Sí',
}

// Convierte un archivo de imagen a DataURL comprimido para que se vea en el reporte y se guarde en localStorage
function archivoADataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrlOriginal = ev.target?.result
      if (typeof dataUrlOriginal !== 'string') {
        resolve(null)
        return
      }
      const img = new Image()
      img.onload = () => {
        try {
          const maxDim = 900
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        } catch {
          resolve(dataUrlOriginal)
        }
      }
      img.onerror = () => resolve(dataUrlOriginal)
      img.src = dataUrlOriginal
    }
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

// Captura el clic en el mini mapa para ajustar la coordenada exacta (useMapEvents)
function CapturarClicMapa({ onSeleccionarPunto }) {
  useMapEvents({
    click(e) {
      onSeleccionarPunto({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
      })
    },
  })
  return null
}

// Centra el mini mapa cuando el ciudadano elige una comuna o barrio
function CentrarMiniMapa({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 15, { duration: 0.6 })
    }
  }, [coords, map])
  return null
}

export default function Reportar() {
  const { reportes, agregarReporte } = useReportes()

  const [form, setForm] = useState(FORM_INICIAL)
  const [coordenadas, setCoordenadas] = useState(null)
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

    if (name === 'comuna') {
      const comunaObj = COMUNAS_CALI.find((c) => c.codigo === value)
      if (comunaObj) {
        setCoordenadas({ lat: comunaObj.lat, lng: comunaObj.lng })
      }
    }

    if (name === 'barrio') {
      const barrioObj = BARRIOS.find(
        (b) => b.nombre.toLowerCase() === value.trim().toLowerCase()
      )
      if (barrioObj) {
        setCoordenadas({ lat: barrioObj.lat, lng: barrioObj.lng })
      }
    }

    setForm({ ...form, [name]: value })
  }

  const handleBlur = (e) => {
    setTocado({ ...tocado, [e.target.name]: true })
  }

  const handleFotos = async (e) => {
    const archivos = Array.from(e.target.files || [])
    e.target.value = ''
    if (!archivos.length) return

    const procesadas = await Promise.all(
      archivos.slice(0, 3).map(async (file) => {
        const dataUrl = await archivoADataUrl(file)
        return dataUrl ? { nombre: file.name, url: dataUrl } : null
      })
    )

    const validas = procesadas.filter(Boolean)
    if (validas.length > 0) {
      setFotos((prev) => [...prev, ...validas].slice(0, 3))
    }
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
    comuna: form.comuna === '' ? 'Seleccione la comuna o sector sugerido.' : '',
    barrio: form.barrio.trim() === '' ? 'Escriba el nombre del barrio.' : '',
    direccion: form.direccion.trim() === '' ? 'La dirección es obligatoria.' : '',
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
      lat: coordenadas?.lat,
      lng: coordenadas?.lng,
      fotos,
    })

    setUltimoId(creado.id)
    localStorage.setItem(ULTIMO_ID_KEY, String(creado.id))
  }

  const iniciarNuevoReporte = () => {
    setUltimoId(null)
    localStorage.removeItem(ULTIMO_ID_KEY)
    setForm(FORM_INICIAL)
    setCoordenadas(null)
    setFotos([])
    setTocado({})
  }

  const colorPinActual = form.grupo ? colorDeGrupo(Number(form.grupo)) : '#dc2626'

  return (
    <div className="reportar-pagina">
      <div className="reportar-subbanner">
        <div className="reportar-subbanner__inner">
          <strong>Formulario de Reporte Digital · Protocolo Despacho V4</strong>
          <span>Todos los campos marcados con (*) son obligatorios</span>
        </div>
      </div>

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
                  <label htmlFor="comuna">
                    Comuna / Sector sugerido (ubica el mapa) <span className="asterisco">*</span>
                  </label>
                  <select
                    id="comuna"
                    name="comuna"
                    value={form.comuna}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">-- Seleccione una comuna de Cali --</option>
                    {COMUNAS_CALI.map((c) => (
                      <option key={c.codigo} value={c.codigo}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  {tocado.comuna && errores.comuna && (
                    <p className="reportar-error">{errores.comuna}</p>
                  )}
                </div>

                <div className="reportar-campo">
                  <label htmlFor="barrio">
                    Barrio <span className="asterisco">*</span>
                  </label>
                  <input
                    id="barrio"
                    name="barrio"
                    type="text"
                    list="barrios-sugeridos-cali"
                    placeholder="Escriba el barrio (ej. San Antonio, Meléndez...)"
                    value={form.barrio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <datalist id="barrios-sugeridos-cali">
                    {BARRIOS.map((b) => (
                      <option key={b.nombre} value={b.nombre} />
                    ))}
                  </datalist>
                  {tocado.barrio && errores.barrio && (
                    <p className="reportar-error">{errores.barrio}</p>
                  )}
                </div>
              </div>

              <div className="reportar-fila-2">
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

              {/* Extra opcional: Mini mapa interactivo para tocar el punto exacto (useMapEvents) */}
              <div className="minimapa-caja">
                <div className="minimapa-header">
                  <span>
                    <svg className="icono-svg" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <path d="M12 21s-7-5.686-7-11a7 7 0 1 1 14 0c0 5.314-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <strong>Punto exacto en el mapa:</strong> toca sobre la calle para afinar la ubicación
                  </span>
                  <span className="minimapa-coords">
                    {coordenadas
                      ? `${coordenadas.lat}, ${coordenadas.lng}`
                      : 'Seleccione una comuna o toque el mapa'}
                  </span>
                </div>
                <MapContainer
                  center={CENTRO_CALI}
                  zoom={13}
                  style={{ width: '100%', height: 220 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <CapturarClicMapa onSeleccionarPunto={setCoordenadas} />
                  <CentrarMiniMapa coords={coordenadas} />
                  {coordenadas && (
                    <Marker
                      position={[coordenadas.lat, coordenadas.lng]}
                      icon={crearIcono(colorPinActual, { seleccionado: true, clases: 'pin--pulso' })}
                    />
                  )}
                </MapContainer>
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

        {/* Columna derecha: Mascota #2 (Resu-kun) + Tarjeta oscura de Respuesta Automática */}
        <div>
          <MascotaPerro119
            nombre="Resu-kun (Unidad 1)"
            rol="Mascota de Rescate · Acompañamiento al Ciudadano"
            numeroCasco="1"
            colorCasco="#2563eb"
            colorTraje="#1e293b"
            colorPelaje="#d97706"
            mensajeInicial="Tranquilo, completa los datos con calma. Haz clic en mí si necesitas ánimo."
            mensajeActivo={
              reporteActual
                ? `Radicado #${reporteActual.radicado} en seguimiento. Estoy atento a tu caso.`
                : 'Estamos contigo en Cali. Una foto clara nos ayuda a llegar más rápido.'
            }
            altura={195}
          />

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
                    Reporte recibido en Central 119
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    El radio operador ya ve tu punto exacto en el mapa de Cali (
                    {reporteActual.comuna ? `${reporteActual.comuna} · ` : ''}Barrio{' '}
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

                {/* Fotos adjuntadas en el reporte confirmado */}
                {reporteActual.fotos && reporteActual.fotos.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        marginBottom: 8,
                        textTransform: 'uppercase',
                      }}
                    >
                      Fotos enviadas en este reporte ({reporteActual.fotos.length})
                    </div>
                    <div className="operador-fotos-grid">
                      {reporteActual.fotos.map((f, idx) => {
                        const srcFoto = typeof f === 'string' ? f : f?.url
                        if (!srcFoto) return null
                        return (
                          <div key={idx} className="operador-foto-thumb" style={{ cursor: 'default' }}>
                            <img src={srcFoto} alt={`Foto enviada ${idx + 1}`} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

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
        </div>
      </main>
    </div>
  )
}
