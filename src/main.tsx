import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Initialize Firebase
import { auth, db } from './config/firebase.config'
if (!auth || !db) {
  console.error('Firebase services not initialized properly')
}

// Initialize AOS (Animate On Scroll) with error handling
import AOS from 'aos'
import 'aos/dist/aos.css'

try {
  AOS.init({
    duration: 800,
    once: false,
    easing: 'ease-in-out',
    delay: 100,
  })
  console.log('AOS initialized successfully')
} catch (error) {
  console.warn('Error initializing AOS, continuing without animations:', error)
}

// Error boundary for development
const rootElement = document.getElementById('root')

if (rootElement) {
  try {
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
    console.log('React app rendered successfully')
  } catch (error) {
    console.error('Failed to render React app:', error)
    
    // Fallback rendering in case of error
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Something went wrong</h1>
        <p>The application failed to initialize properly. Please try refreshing the page.</p>
        <pre style="margin: 20px; text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh
        </button>
      </div>
    `
  }
} else {
  console.error('Root element not found!')
}
