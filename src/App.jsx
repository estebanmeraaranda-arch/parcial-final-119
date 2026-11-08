import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Reportar from './pages/Reportar.jsx'
import Operador from './pages/Operador.jsx'
import Navbar119 from './components/Navbar119.jsx'
import { ReportesProvider } from './context/ReportesContext.jsx'

// Las tres pantallas del parcial con menú superior unificado (Navbar119)
// y envueltas en ReportesProvider para compartir la lista de reportes.
export default function App() {
  return (
    <ReportesProvider>
      <Navbar119 />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reportar" element={<Reportar />} />
        <Route path="/operador" element={<Operador />} />
        <Route path="*" element={<p style={{ padding: 24 }}>Página no encontrada. <Link to="/">Volver</Link></p>} />
      </Routes>
    </ReportesProvider>
  )
}
