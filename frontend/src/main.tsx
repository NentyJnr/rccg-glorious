import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Auto-recover from chunk loading or deployment hash mismatches
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error detected (new deployment). Reloading page...', event);
  window.location.reload();
});

// Auto-recover from module script MIME errors caused by stale browser caches
window.addEventListener('error', (e) => {
  if (
    e.message &&
    (e.message.includes('Failed to load module script') ||
      e.message.includes('MIME type of "text/html"') ||
      e.message.includes('Loading chunk'))
  ) {
    console.warn('Stale chunk/MIME error detected. Purging caches and reloading...', e.message);
    if ('caches' in window) {
      caches.keys().then((keys) => {
        Promise.all(keys.map((k) => caches.delete(k))).then(() => {
          window.location.reload();
        });
      });
    } else {
      window.location.reload();
    }
  }
});

// Register PWA Service Worker with auto-update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.update();
        console.log('Parish Portal Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
  });
}


