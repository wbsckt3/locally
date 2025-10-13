import { ref, onMounted, onUnmounted } from 'vue'

export function useMap() {
  const map = ref(null)
  const userMarker = ref(null)
  const damageMarkers = ref([])
  const isMapReady = ref(false)

  const initializeMap = (containerId = 'map') => {
    return new Promise((resolve) => {
      // Esperar a que Leaflet esté disponible
      if (typeof L === 'undefined') {
        console.log('⏳ Leaflet no disponible, esperando...')
        // Intentar hasta 50 veces (5 segundos máximo)
        let attempts = 0
        const maxAttempts = 50
        
        const checkLeaflet = () => {
          attempts++
          if (typeof L !== 'undefined') {
            console.log('✅ Leaflet disponible después de', attempts, 'intentos')
            initializeMap(containerId).then(resolve)
          } else if (attempts < maxAttempts) {
            setTimeout(checkLeaflet, 100)
          } else {
            console.error('❌ Leaflet no se pudo cargar después de', maxAttempts, 'intentos')
            resolve(null)
          }
        }
        
        setTimeout(checkLeaflet, 100)
        return
      }

      console.log('🗺️ Inicializando mapa en:', containerId)
      
      // Verificar que el contenedor existe
      const container = document.getElementById(containerId)
      if (!container) {
        console.error('❌ Contenedor del mapa no encontrado:', containerId)
        resolve(null)
        return
      }
      
      // Esperar a que el contenedor esté disponible
      setTimeout(() => {
        try {
          console.log('🗺️ Creando instancia del mapa...')
          
          // Crear mapa centrado en Medellín
          map.value = L.map(containerId, {
            zoomControl: true,
            attributionControl: true
          }).setView([6.2442, -75.5812], 15)
          
          console.log('🗺️ Agregando capa de tiles...')
          
          // Agregar capa de OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map.value)
          
          // Forzar redimensionamiento del mapa
          setTimeout(() => {
            if (map.value) {
              map.value.invalidateSize()
              isMapReady.value = true
              console.log('✅ Mapa inicializado correctamente')
              resolve(map.value)
            } else {
              console.error('❌ Mapa no se pudo crear')
              resolve(null)
            }
          }, 100)
          
          // Redimensionar mapa cuando cambie el tamaño de la ventana
          window.addEventListener('resize', () => {
            setTimeout(() => {
              if (map.value) {
                map.value.invalidateSize()
              }
            }, 100)
          })
          
        } catch (error) {
          console.error('❌ Error inicializando mapa:', error)
          console.error('❌ Stack trace:', error.stack)
          resolve(null)
        }
      }, 100)
    })
  }

  const addUserMarker = (location) => {
    if (!map.value) return

    console.log('📍 Agregando marcador de usuario:', location)
    
    // Remover marcador anterior si existe
    if (userMarker.value) {
      map.value.removeLayer(userMarker.value)
    }
    
    // Crear marcador del usuario
    userMarker.value = L.marker([location.lat, location.lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background: #10b981; color: white; border-radius: 12px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; border: 2px solid white; box-shadow: 0 6px 14px rgba(16,185,129,0.85), 0 2px 6px rgba(5,150,105,0.65);"><i class="ph ph-navigation-arrow" style="font-family: Phosphor !important; font-size:18px; color:#ffffff; line-height:1; display:inline-block;"></i></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    }).addTo(map.value)
    
    // Centrar mapa en ubicación del usuario
    map.value.setView([location.lat, location.lng], 15)
  }

  const addDamageMarkers = (damages) => {
    if (!map.value) {
      console.log('⚠️ No se puede agregar marcadores - mapa no disponible')
      return
    }

    if (!damages || damages.length === 0) {
      console.log('⚠️ No se pueden agregar marcadores - no hay daños')
      return
    }

    console.log('📍 Agregando marcadores de daños:', damages.length)
    console.log('📍 Datos de daños:', damages)
    
    // Limpiar marcadores existentes
    damageMarkers.value.forEach(marker => {
      if (marker.marker) {
        map.value.removeLayer(marker.marker)
      }
    })
    damageMarkers.value = []
    
    // Agregar nuevos marcadores
    damages.forEach((damage, index) => {
      console.log(`📍 Procesando daño ${index + 1}:`, damage)
      const marker = createDamageMarker(damage, index)
      if (marker) {
        damageMarkers.value.push(marker)
        console.log(`✅ Marcador ${index + 1} agregado`)
      } else {
        console.log(`⚠️ No se pudo crear marcador ${index + 1}`)
      }
    })
    
    console.log('✅ Total marcadores agregados:', damageMarkers.value.length)
  }

  const createDamageMarker = (damage, index) => {
    if (!map.value) return null

    console.log('📍 Creando marcador para:', damage.title)
    
    // Determinar color según severidad
    let color = '#f59e0b' // Amarillo por defecto
    if (damage.severity === 'high') color = '#ef4444' // Rojo
    else if (damage.severity === 'medium') color = '#f59e0b' // Amarillo
    else if (damage.severity === 'low') color = '#10b981' // Verde
    
    // Crear marcador
    const marker = L.marker([damage.lat, damage.lng], {
      icon: L.divIcon({
        className: 'damage-marker',
        html: `<div style="background: ${color}; color: white; border-radius: 12px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; border: 2px solid white; box-shadow: 0 6px 14px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.2);"><i class="ph ph-warning" style="font-family: Phosphor !important; font-size:18px; color:#ffffff; line-height:1; display:inline-block;"></i></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    })
    
    // Agregar popup
    const popupContent = `
      <div style="padding: 16px; min-width: 280px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="background: ${color}; color: white; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <i class="ph ph-warning" style="font-size: 16px;"></i>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${damage.title}</h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">${damage.location}</p>
          </div>
        </div>
        <p style="margin: 0 0 12px 0; color: #374151; line-height: 1.5;">${damage.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="background: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${damage.severity}</span>
          <span style="color: #6b7280; font-size: 12px;">${damage.timestamp}</span>
        </div>
      </div>
    `
    
    marker.bindPopup(popupContent, {
      maxWidth: 320,
      className: 'custom-popup'
    })
    
    marker.addTo(map.value)
    return { marker, damage }
  }

  const centerMapOnUser = (location) => {
    if (map.value && location) {
      map.value.setView([location.lat, location.lng], 15)
    }
  }

  const destroyMap = () => {
    if (map.value) {
      map.value.remove()
      map.value = null
      isMapReady.value = false
    }
  }

  return {
    map,
    userMarker,
    damageMarkers,
    isMapReady,
    initializeMap,
    addUserMarker,
    addDamageMarkers,
    centerMapOnUser,
    destroyMap
  }
}
