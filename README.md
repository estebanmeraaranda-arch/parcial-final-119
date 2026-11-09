# Línea 119 · Benemérito Cuerpo de Bomberos Voluntarios de Cali

Aplicación web de reporte ciudadano y consola de despacho para el **Benemérito Cuerpo de Bomberos Voluntarios de Cali (Línea 119)**, desarrollada con **React**, **Vite**, **React Router**, **Leaflet (OpenStreetMap)** y **React Three Fiber (Three.js)**.

---

## Integrantes del equipo

- **Esteban Mera Aranda**
- **Johan David Medina Valderrama**

---

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

Rutas principales de la aplicación:
- `http://localhost:5173/` — **Landing (`/`)**: Presentación del canal digital 119, escenas 3D interactivas del escuadrón canino (`Mamoru-kun`), tipos de emergencias atendidas (grupos 100 a 900) y guía de reporte.
- `http://localhost:5173/reportar` — **Reportar emergencia (`/reportar`)**: Formulario ciudadano basado en el protocolo de despacho de Bomberos Cali, geolocalización GPS, mini mapa interactivo con clic (`useMapEvents`), carga de fotografías, panel de seguimiento del radicado en vivo y mascota 3D (`Resu-kun`).
- `http://localhost:5173/operador` — **Radio operador (`/operador`)**: Mapa real de Cali en Leaflet con pines animados por estado y color de grupo, filtros por estado y grupo, detalle completo del caso, enlace a Google Maps, llamada directa al ciudadano, validación/corrección de grupo, despacho de unidades (`Máquina`, `Rescate`, `Ambulancia`, `HazMat`) y mascota 3D (`Keshi-kun`).

---

## Prototipo y diseño en Figma

- **Archivo de Figma (3 pantallas)**: https://www.figma.com/design/8q4QqIvzt0hyTdlFjWdklr/Parcial-Final---L%C3%ADnea-119-Bomberos-Cali

---

## Parte 1 · Investigación previa sobre Bomberos Cali

### 1. ¿Qué es el Benemérito Cuerpo de Bomberos Voluntarios de Cali y desde cuándo existe?
El **Benemérito Cuerpo de Bomberos Voluntarios de Cali** es una institución privada de utilidad común, sin ánimo de lucro y de carácter voluntario, encargada de la gestión integral del riesgo contra incendios, los preparativos y atención de rescates en todas sus modalidades y la atención de incidentes con materiales peligrosos en Santiago de Cali. Fue fundado el **20 de julio de 1928**, contando con casi un siglo de servicio continuo a la ciudad.

### 2. ¿Qué número marca un ciudadano en Cali para llamar a los bomberos y cómo funciona hoy ese canal?
En Cali los ciudadanos marcan de forma gratuita la **Línea 119** (desde teléfonos fijos o celulares las 24 horas) o se comunican mediante la línea única de emergencias **123**. Hoy en día el canal funciona principalmente por voz: un radio operador en el Centro de Comando y Telemática recibe la llamada, realiza las preguntas del protocolo de despacho (identificación, dirección, barrio, punto de referencia y qué observa el ciudadano), clasifica el incidente en los códigos 100 a 900 y despacha por radio a la estación más cercana.

### 3. ¿Qué otros tipos de emergencias atienden los Bomberos de Cali además de incendios?
Además de incendios estructurales, vehiculares y forestales (Grupo 100), los Bomberos de Cali atienden:
1. **Rescate vehicular y extricación** en accidentes de tránsito con personas atrapadas (Grupo 300).
2. **Atención Prehospitalaria (APH)** y soporte vital en ambulancias por emergencias médicas o traumas (Grupo 300).
3. **Incidentes con Materiales Peligrosos (HazMat)**, tales como fugas de gas natural/propano, derrames de combustibles o sustancias químicas (Grupo 400).
4. **Rescates técnicos en alturas, espacios confinados y estructuras colapsadas (USAR)**, incluyendo personas atrapadas en ascensores (Grupo 300).
5. **Emergencias por clima severo y desastres naturales**, como caída de árboles sobre vías o redes eléctricas, inundaciones, deslizamientos y rescate acuático en ríos (Grupo 800).
6. **Control de abejas africanizadas, avispas y rescate de animales** en situación de riesgo (Grupos 500 y 900).

### 4. ¿Cuántas estaciones de bomberos tiene Cali aproximadamente y en qué zonas están?
El Cuerpo de Bomberos Voluntarios de Cali cuenta con **11 estaciones operativas** distribuidas estratégicamente de norte a sur y de oriente a occidente para cubrir las 22 comunas y los corregimientos:
- **Zona Centro y Oeste:** Estación Central (Roosevelt / San Fernando), Estación Alameda y Estación Siloé (ladera).
- **Zona Norte y Nororiente:** Estación Salomia y Estación Floralia / Paso del Comercio.
- **Zona Oriente (Distrito de Aguablanca y alrededores):** Estación Aguablanca, Estación El Vallado, Estación Los Mangos y Estación Villa del Sur.
- **Zona Sur:** Estación Meléndez y Estación Ciudad Jardín.

### 5. ¿Qué problema tiene una llamada telefónica cuando el ciudadano no sabe explicar dónde está o cuando veinte personas llaman por el mismo incendio?
- **Cuando el ciudadano no sabe explicar dónde está:** bajo estrés o en un sector que no frecuenta, el ciudadano tarda varios minutos tratando de describir la dirección exacta. Por voz no es posible compartir las coordenadas GPS del teléfono ni enviar fotografías que permitan al operador dimensionar de inmediato la gravedad real de la escena.
- **Cuando veinte personas llaman por el mismo incendio:** un incidente muy visible (como una columna de humo en un cerro o avenida principal) genera decenas de llamadas simultáneas a la línea 119. Esto **congestiona la central telefónica**, ocupando a los operadores en repetir el mismo interrogatorio para un caso que ya fue reportado y haciendo esperar en la cola a ciudadanos que llaman por otras emergencias críticas en distintos puntos de la ciudad.

---

## Parte 2 · Decisiones sobre el protocolo de despacho en `/reportar`

El protocolo telefónico del radio operador contempla nueve elementos de información. Para diseñar un formulario web ágil para una persona en medio de una emergencia, incluimos los campos esenciales (`Nombres`, `Apellidos`, `Teléfono`, `Grupo de emergencia`, `Qué ve`, `Dirección` y `Barrio` + coordenadas GPS / mini mapa y fotos) y tomamos **dos decisiones de simplificación justificadas**:

1. **No exigir al ciudadano el sub-código técnico ni el tipo de unidad a despachar (`Máquina`, `Rescate`, `Ambulancia`, `HazMat`)**:
   - *Justificación:* Un ciudadano en una urgencia puede identificar a grandes rasgos qué ocurre (por ejemplo, fuego, choque, olor a gas o caída de árbol) y adjuntar una foto, pero no conoce la codificación operativa interna ni qué recurso técnico se requiere. Por ello, en `/operador` el radio operador puede **revisar la foto, llamar al ciudadano y corregir el grupo del protocolo** antes de elegir la unidad específica a despachar.
2. **Dejar el "Nombre del edificio / conjunto" y el "Punto de referencia" como campos opcionales (no bloqueantes) y delegar las preguntas de ampliación al canal de seguimiento en vivo**:
   - *Justificación:* Gran parte de las emergencias en Cali ocurren en vía pública, parques, ríos o zonas de ladera donde no aplica un edificio o conjunto residencial. Hacer obligatorios esos campos detendría o retrasaría el envío del reporte inicial. En su lugar, si el operador necesita precisar el bloque/apartamento o pedir otra foto, cuenta en `/operador` con el botón **"Solicitar más información"**, el cual activa un aviso en tiempo real en la pantalla del radicado del ciudadano.
