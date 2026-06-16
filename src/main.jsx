import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

// NOTE: StrictMode intentionally removed.
// React 19 StrictMode double-mounts components in development, which causes
// R3F to create → destroy → re-create the WebGL context. Chrome's strict
// WebGL context lifecycle management fails on the second creation; Edge and
// Electron (VSCode) are more permissive. Removing StrictMode fixes the
// localhost black canvas. (StrictMode is dev-only anyway — no prod impact.)
createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Analytics />
  </>
)
