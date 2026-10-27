import './theme.scss'
import './style.css'

import { createRoot } from 'react-dom/client'

import { EcosystemProvider } from 'lib/seam/ecosystem/EcosystemProvider.js'

import { App } from './App.js'

const root = document.getElementById('root')
if (root != null)
  createRoot(root).render(
    <EcosystemProvider
      ecosystemEndpoint='/ecosystem/v1/'
      disableCssInjection
      disableFontInjection
    >
      <App />
    </EcosystemProvider>
  )
