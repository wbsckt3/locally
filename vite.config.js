import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/locally/' : '/local-vue3-vite/',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    // Plugin para inyectar CDNs en el HTML
    {
      name: 'inject-cdns',
      transformIndexHtml(html) {
        return html.replace(
          '<head>',
          `<head>
    <!-- Google Sign-In -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    
    <!-- Phosphor Icons -->
    <script src="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.9/lib/index.js"></script>
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" />
    
    <!-- Leaflet JS -->
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- CDN verification script -->
    <script>
      window.addEventListener('load', function() {
        console.log('🔍 Verificando CDNs...');
        
        // Verificar Phosphor Icons
        if (typeof window.PhosphorIcons !== 'undefined') {
          console.log('✅ Phosphor Icons cargado correctamente');
        } else {
          console.error('❌ Phosphor Icons no se cargó correctamente');
        }
        
        // Verificar Leaflet
        console.log('L disponible:', typeof L !== 'undefined');
        if (typeof L !== 'undefined') {
          console.log('✅ Leaflet cargado correctamente');
          console.log('Versión:', L.version);
        } else {
          console.error('❌ Leaflet no se cargó correctamente');
        }
      });
    </script>`
        );
      }
    }
  ],
});