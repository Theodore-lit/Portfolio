// App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Finance from './Pages/Finance'
import PlayerProfile from './Pages/PlayerProfile'
import NotFound from './Pages/NotFound'

function App() {
  return (
    <div className="app-layout">
      {/* Ton Header/Navbar peut aller ici pour rester visible sur toutes les pages */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/finance" element={<Finance />} />
        
        <Route path="/player/:id" element={<PlayerProfile />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App