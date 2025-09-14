import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { LoadingProvider } from './components/Loader/LoadingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>

    <BrowserRouter>
      <App />
    </BrowserRouter>
    </LoadingProvider>
  </StrictMode>,
)
