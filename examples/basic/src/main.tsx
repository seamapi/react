import React from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.js'

const rootElement = globalThis.document.getElementById('root')

if (rootElement == null) throw new Error('Root element not found')

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
