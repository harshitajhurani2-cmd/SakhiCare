import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './AppRoutes.jsx'
import './index.css'
import { LanguageProvider } from './App.jsx'

const savedLang = localStorage.getItem('sakhi_lang');
const browserLang = navigator.language?.startsWith('hi') ? 'hi' : 'en';
if (!savedLang) {
  localStorage.setItem('sakhi_lang', browserLang);
}
document.documentElement.lang = savedLang || browserLang;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
)
