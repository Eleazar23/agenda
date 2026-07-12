import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { installMockApi } from './mock/mockApi'

if (import.meta.env.DEV && !window.api) {
  installMockApi()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
