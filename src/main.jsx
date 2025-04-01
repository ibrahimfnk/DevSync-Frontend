import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './authContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import ProjectRoutes from './Routes.jsx'
import { ThemeProvider } from './components/home/comp/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
  <AuthProvider>
    <Router>
      <ProjectRoutes />
    </Router>
    </AuthProvider>
    </ThemeProvider>
)
