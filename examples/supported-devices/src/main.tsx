import '@seamapi/react/index.css'
import './style.css'

import { createRoot } from 'react-dom/client'

import { App } from './App.js'

const root = globalThis.document.getElementById('root')
if (root == null) throw new Error('Root element not found')
createRoot(root).render(<App />)
