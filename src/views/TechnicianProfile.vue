<template>
  <!-- My Proposals Modal - FUERA del contenedor principal -->
  <div v-if="showMyProposalsModal" class="modal-overlay" @click="closeMyProposalsModal" style="background: rgba(255, 0, 0, 0.8); z-index: 9999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center;">
    <div class="proposals-modal" @click.stop style="border: 5px solid red; background: white; z-index: 10000; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
      <div class="modal-header" style="padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 600;">Mis Propuestas Enviadas</h3>
        <button @click="closeMyProposalsModal" class="modal-close" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <i class="ph ph-x"></i>
        </button>
      </div>
      <div class="modal-content" style="padding: 20px;">
        <div v-if="loading" style="text-align: center; padding: 2rem;">
          <div class="loading" style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 1rem; color: #64748b;">Cargando propuestas...</p>
        </div>
        
        <div v-else-if="myProposals.length === 0" style="text-align: center; padding: 2rem;">
          <i class="ph ph-paper-plane-tilt" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--text); margin-bottom: 0.5rem;">No tienes propuestas enviadas</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">Encuentra oportunidades y envía tu primera propuesta</p>
          <button @click="closeMyProposalsModal" class="btn primary">
            <i class="ph ph-magnifying-glass"></i>
            Buscar Oportunidades
          </button>
        </div>
        
        <div v-else class="proposals-list" style="max-height: 60vh; overflow-y: auto;">
          <div v-for="proposal in myProposals" :key="proposal._id" class="proposal-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px; transition: all 0.2s ease;">
            <div class="proposal-header" style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
              <div class="proposal-icon" style="width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                <i class="ph ph-paper-plane-tilt"></i>
              </div>
              <div class="proposal-info" style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 600;">Propuesta #{{ proposal._id.slice(-6) }}</h4>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Enviada el {{ new Date(proposal.submittedAt).toLocaleDateString() }}</p>
                <span :class="['status-badge', proposal.status]" style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase; background: #fef3c7; color: #92400e;">
                  {{ proposal.status === 'pending' ? 'Pendiente' : 
                     proposal.status === 'accepted' ? 'Aceptada' : 
                     proposal.status === 'rejected' ? 'Rechazada' : 
                     proposal.status === 'completed' ? 'Completada' : 'Cancelada' }}
                </span>
              </div>
            </div>
            
            <div class="proposal-details" style="margin-bottom: 16px;">
              <div class="detail-section" style="margin-bottom: 12px;">
                <h5 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Detalles de la Propuesta</h5>
                <div class="detail-grid" style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                  <div class="detail-item" style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 14px;">
                    <i class="ph ph-currency-dollar" style="color: #3b82f6; font-size: 16px;"></i>
                    <span>Precio: ${{ proposal.proposal.price.toLocaleString() }} COP</span>
                  </div>
                  <div class="detail-item" style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 14px;">
                    <i class="ph ph-clock" style="color: #3b82f6; font-size: 16px;"></i>
                    <span>Duración: {{ proposal.proposal.duration }} días</span>
                  </div>
                  <div class="detail-item" style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 14px;">
                    <i class="ph ph-file-text" style="color: #3b82f6; font-size: 16px;"></i>
                    <span>Descripción: {{ proposal.proposal.description }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="proposal.proposal.experience" class="detail-section" style="margin-bottom: 12px;">
                <h5 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Experiencia</h5>
                <p style="margin: 0; color: #64748b; font-size: 14px;">{{ proposal.proposal.experience }}</p>
              </div>
              
              <div v-if="proposal.proposal.materials" class="detail-section" style="margin-bottom: 12px;">
                <h5 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Materiales</h5>
                <p style="margin: 0; color: #64748b; font-size: 14px;">{{ proposal.proposal.materials }}</p>
              </div>
            </div>
            
            <div class="proposal-actions" style="display: flex; gap: 8px; justify-content: flex-end;">
              <button @click="viewProposal(proposal)" class="btn outline small" style="background: transparent; color: #3b82f6; border: 1px solid #3b82f6; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <i class="ph ph-eye"></i>
                Ver Detalles
              </button>
              <button v-if="proposal.status === 'pending'" @click="cancelProposal(proposal)" class="btn danger small" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <i class="ph ph-x"></i>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="header-title">
          <i class="ph ph-map-pin-area locally-icon"></i>
          <span>Locally</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-avatar" :data-tooltip="user.FullName">
          {{ user.FullName.charAt(0).toUpperCase() }}
        </div>
        <button @click="logout" class="logout-btn">
          <i class="ph ph-sign-out"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <!-- Map Container -->
      <div class="map-container">
        <div id="technician-map" class="map"></div>
        
        <!-- Map Controls -->
        <div class="map-controls">
          <button @click="getCurrentLocation" class="btn primary" :disabled="loading">
            <i class="ph ph-crosshairs"></i>
            Mi Ubicación
          </button>
          <button @click="loadOpportunities" class="btn outline" :disabled="loading">
            <i class="ph ph-magnifying-glass"></i>
            Buscar Oportunidades
          </button>
        </div>
        
        <!-- Loading Overlay -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>

      <!-- Cards deslizables para oportunidades -->
      <div v-if="showOpportunitiesCard" class="card-container">
        <div class="card visible">
          <div class="card-header">
            <h3 class="card-title">Oportunidades de Servicio Cercanas</h3>
            <div style="display: flex; gap: 8px;">
              <button @click="loadOpportunities" style="padding: 4px 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                🔄 Actualizar
              </button>
              <button class="card-close" @click="hideOpportunitiesCard">&times;</button>
            </div>
          </div>
          <div class="card-content">
            <div v-if="loading" style="text-align: center; padding: 2rem;">
              <div class="loading"></div>
              <p style="margin-top: 1rem; color: var(--text-secondary);">Cargando oportunidades...</p>
            </div>
            
            <div v-else-if="opportunities.length === 0" style="text-align: center; padding: 2rem;">
              <i class="ph ph-magnifying-glass" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 1rem;"></i>
              <h3 style="color: var(--text); margin-bottom: 0.5rem;">No hay oportunidades disponibles</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1rem;">Haz clic en "Buscar Oportunidades" para encontrar servicios cercanos</p>
              <button @click="loadOpportunities" class="btn primary">
                <i class="ph ph-magnifying-glass"></i>
                Buscar Oportunidades
              </button>
            </div>
            
            <div v-else class="opportunities-list">
              <div v-for="opportunity in opportunities" :key="opportunity.id" class="request-card" @click="viewOpportunity(opportunity)">
                <div class="request-card-image">
                  <img 
                    v-if="opportunity.image" 
                    :src="opportunity.image" 
                    :alt="opportunity.title"
                    @error="handleImageError"
                  >
                  <div v-else class="no-image-placeholder">
                    <i class="ph ph-image"></i>
                    <span>Sin imagen</span>
                  </div>
                  <div class="request-card-badge">
                    <i :class="['ph', opportunity.severity === 'high' ? 'ph-warning-octagon' : opportunity.severity === 'medium' ? 'ph-warning' : 'ph-info']" style="font-size:12px;"></i>
                    {{ opportunity.severity === 'high' ? 'Urgente' : opportunity.severity === 'medium' ? 'Media' : 'Baja' }}
                  </div>
                  <div class="request-card-distance">
                    <i class="ph ph-map-pin" style="font-size:10px; margin-right:3px;"></i>
                    {{ opportunity.distance || 'Cerca' }}
                  </div>
                </div>
                <div class="request-card-content">
                  <div class="request-card-header">
                    <div class="request-card-icon">
                      <i class="ph ph-wrench"></i>
                    </div>
                    <div class="request-card-info">
                      <h3 class="request-title">{{ opportunity.title }}</h3>
                      <div class="request-company">
                        <i class="ph ph-building"></i>
                        {{ opportunity.location }}
                      </div>
                    </div>
                  </div>
                  <p class="request-desc">{{ opportunity.description }}</p>
                  <div class="request-card-details">
                    <div class="request-card-details-header">
                      <i class="ph ph-clock"></i>
                      {{ opportunity.timestamp }}
                    </div>
                    <div class="request-card-details-text">
                      <i class="ph ph-currency-dollar"></i>
                      {{ opportunity.price }}
                    </div>
                  </div>
                  <div class="request-actions">
                    <button @click.stop="viewOpportunity(opportunity)" class="btn primary small">
                      <i class="ph ph-eye"></i>
                      Ver Detalles
                    </button>
                    <button @click.stop="createProposal(opportunity)" class="btn success small">
                      <i class="ph ph-paper-plane-tilt"></i>
                      Enviar Propuesta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['nav-item', { active: currentTab === tab.id }]"
        @click="switchTab(tab.id)"
      >
        <i :class="tab.icon"></i>
        <span class="nav-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="modal-overlay" @click="closeProfileModal">
      <div class="profile-modal" @click.stop>
        <div class="profile-modal-header">
          <h3>Mi Perfil</h3>
          <button @click="closeProfileModal" class="modal-close">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <div class="profile-modal-content">
          <div class="profile-info">
            <div class="profile-avatar">
              {{ user.FullName.charAt(0).toUpperCase() }}
            </div>
            <div class="profile-details">
              <h4>{{ user.FullName }}</h4>
              <p>{{ user.Email }}</p>
              <span class="profile-role">Técnico</span>
            </div>
          </div>
          
          <div class="profile-sections">
            <div class="profile-section">
              <h5>Información Personal</h5>
              <div class="form-group">
                <label>Especialidades</label>
                <input v-model="technicianInfo.specialties" type="text" placeholder="Ej: Plomería, Electricidad, Carpintería">
              </div>
              <div class="form-group">
                <label>Años de Experiencia</label>
                <input v-model="technicianInfo.experience" type="text" placeholder="Ej: 5 años">
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="technicianInfo.phone" type="tel" placeholder="+57 300 123 4567">
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea v-model="technicianInfo.description" placeholder="Cuéntanos sobre tu experiencia y servicios..."></textarea>
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="saveTechnicianInfo" class="btn primary">
              <i class="ph ph-floppy-disk"></i>
              Guardar Cambios
            </button>
            <button @click="logout" class="btn outline">
              <i class="ph ph-sign-out"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Opportunity Details Modal -->
    <div v-if="showOpportunityDetails" class="modal-overlay" @click="closeOpportunityDetails">
      <div class="opportunity-details-modal" @click.stop>
        <div class="modal-header">
          <h3>Detalles de la Oportunidad</h3>
          <button @click="closeOpportunityDetails" class="modal-close">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <div class="modal-content" v-if="selectedOpportunity">
          <div class="opportunity-header">
            <div class="opportunity-icon">
              <i class="ph ph-wrench"></i>
            </div>
            <div class="opportunity-info">
              <h4>{{ selectedOpportunity.title }}</h4>
              <p>{{ selectedOpportunity.location }}</p>
              <span :class="['severity-badge', selectedOpportunity.severity]">
                {{ selectedOpportunity.severity === 'high' ? 'Urgente' : selectedOpportunity.severity === 'medium' ? 'Media' : 'Baja' }}
              </span>
            </div>
          </div>
          
          <div class="opportunity-details">
            <div class="detail-section">
              <h5>Descripción del Daño</h5>
              <p>{{ selectedOpportunity.description }}</p>
            </div>
            
            <div class="detail-section">
              <h5>Información Adicional</h5>
              <div class="detail-grid">
                <div class="detail-item">
                  <i class="ph ph-clock"></i>
                  <span>Fecha: {{ selectedOpportunity.timestamp }}</span>
                </div>
                <div class="detail-item">
                  <i class="ph ph-currency-dollar"></i>
                  <span>Precio estimado: {{ selectedOpportunity.price }}</span>
                </div>
                <div class="detail-item">
                  <i class="ph ph-map-pin"></i>
                  <span>Ubicación: {{ selectedOpportunity.location }}</span>
                </div>
                <div class="detail-item">
                  <i class="ph ph-warning"></i>
                  <span>Severidad: {{ selectedOpportunity.severity }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button @click="closeOpportunityDetails" class="btn outline">
              <i class="ph ph-x"></i>
              Cerrar
            </button>
            <button @click="openProposalModal" class="btn primary">
              <i class="ph ph-paper-plane-tilt"></i>
              Enviar Propuesta
            </button>
          </div>
        </div>
      </div>
    </div>


            <!-- Proposal Modal -->
            <div v-if="showProposalModal" class="modal-overlay" @click="closeProposalModal">
      <div class="proposal-modal" @click.stop>
        <div class="modal-header">
          <h3>Enviar Propuesta</h3>
          <button @click="closeProposalModal" class="modal-close">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitProposal">
            <div class="form-group">
              <label>Precio de la Propuesta (COP)</label>
              <input v-model="newProposal.price" type="number" placeholder="150000" required>
            </div>
            
            <div class="form-group">
              <label>Duración Estimada (días)</label>
              <input v-model="newProposal.duration" type="number" placeholder="2" required>
            </div>
            
            <div class="form-group">
              <label>Descripción de la Solución</label>
              <textarea v-model="newProposal.description" placeholder="Reparación completa del sistema de filtración con materiales de primera calidad" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Experiencia Relevante</label>
              <textarea v-model="newProposal.experience" placeholder="15 años de experiencia en sistemas de piscinas" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Materiales a Utilizar</label>
              <textarea v-model="newProposal.materials" placeholder="Válvula principal, sellos, tubería de conexión" required></textarea>
            </div>
            
            
            <div class="modal-actions">
              <button type="button" @click="closeProposalModal" class="btn outline">
                <i class="ph ph-x"></i>
                Cancelar
              </button>
              <button type="submit" class="btn primary" :disabled="loading">
                <i class="ph ph-paper-plane-tilt"></i>
                Enviar Propuesta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useMap } from '../composables/useMap'

export default {
  name: 'TechnicianProfile',
  setup() {
    const router = useRouter()
    const store = useStore()
    const { map, userMarker, damageMarkers, isMapReady, initializeMap, addUserMarker, addDamageMarkers, centerMapOnUser } = useMap()

    // Reactive data
    const currentTab = ref('map')
    const loading = ref(false)
    const showProposalModal = ref(false)
    const showMyProposalsModal = ref(false)
    const opportunities = ref([])
    const myProposals = ref([])
    const selectedOpportunity = ref(null)
    const showOpportunitiesCard = ref(false)
    const showProfileModal = ref(false)
    const showOpportunityDetails = ref(false)
    const technicianInfo = ref({
      specialties: '',
      experience: '',
      description: '',
      phone: '',
      availability: 'available'
    })
    const newProposal = ref({
      price: '',
      duration: '',
      description: '',
      experience: '',
      materials: ''
    })

    // User data
    const user = ref(store.getters.currentUser)
    const notifications = ref([])

    // Navigation tabs
    const tabs = ref([
      { id: 'map', label: 'Mapa', icon: 'ph ph-map-pin' },
      { id: 'opportunities', label: 'Oportunidades', icon: 'ph ph-magnifying-glass' },
      { id: 'proposals', label: 'Mis Propuestas', icon: 'ph ph-file-text' },
      { id: 'profile', label: 'Perfil', icon: 'ph ph-user' }
    ])

    // Methods
    const switchTab = async (tabId) => {
      // Handle profile tab specially
      if (tabId === 'profile') {
        showProfileModal.value = true
        return
      }
      
      currentTab.value = tabId
      
      // Initialize map if switching to map tab
      if (tabId === 'map' && !map.value) {
        await nextTick()
        await initializeMap('technician-map')
        const location = store.getters.userLocation
        if (location) {
          addUserMarker(location)
        }
      }
      
      // Load data based on tab
      if (tabId === 'opportunities') {
        // Cargar oportunidades automáticamente al cambiar a esta pestaña
        await loadOpportunities()
      } else if (tabId === 'proposals') {
        openMyProposalsModal()
      }
    }

    const logout = async () => {
      await store.dispatch('logout')
      router.push({ name: 'login' })
    }

    const getCurrentLocation = async () => {
      try {
        console.log('📍 Getting current location...')
        const location = await store.dispatch('loadUserLocation')
        console.log('📍 Location obtained:', location)
        
        if (location && map.value) {
          addUserMarker(location)
          centerMapOnUser(location)
          
          store.dispatch('showNotification', {
            message: 'Ubicación actualizada',
            type: 'success'
          })
        }
      } catch (error) {
        console.error('Error getting location:', error)
        store.dispatch('showNotification', {
          message: 'Error obteniendo ubicación',
          type: 'error'
        })
      }
    }

    const refreshOpportunities = async () => {
      await loadOpportunities()
    }

    const loadOpportunities = async () => {
      try {
        loading.value = true
        showOpportunitiesCard.value = true
        console.log('🔍 Loading opportunities...')
        
        // Load damages from API
        const damages = await store.dispatch('loadDamages')
        console.log('📋 Daños obtenidos de la API:', damages)
        console.log('📋 Cantidad de daños:', damages.length)
        
        if (damages && damages.length > 0) {
          console.log('✅ Procesando daños encontrados...')
          
          // Convert damages to opportunities
          opportunities.value = damages.map((damage, index) => {
            console.log(`🔍 Procesando daño ${index + 1}:`, damage)
            console.log(`🖼️ Imagen del daño:`, damage.image)
            return {
              id: damage._id,
              title: `${damage.item} - ${damage.area}`,
              description: damage.description,
              location: damage.unidadNombre || 'Ubicación no especificada',
              timestamp: new Date(damage.createdAt).toLocaleString('es-ES'),
              price: damage.severity === 'high' ? '$120,000 - $180,000' : 
                     damage.severity === 'medium' ? '$80,000 - $120,000' : '$60,000 - $90,000',
              severity: damage.severity,
              lat: damage.location?.latitude || 6.2442,
              lng: damage.location?.longitude || -75.5812,
              image: damage.image || null,
              damageData: damage
            }
          })
          
          console.log('📋 Oportunidades generadas desde API:', opportunities.value.length)
          console.log('📋 Primera oportunidad:', opportunities.value[0])
          
          // Add markers to map if available
          if (map.value && opportunities.value.length > 0) {
            addDamageMarkers(opportunities.value)
          }
          
          store.dispatch('showNotification', {
            message: `Se encontraron ${opportunities.value.length} oportunidades cercanas`,
            type: 'success'
          })
        } else {
          console.log('⚠️ No se encontraron damages en la API')
          console.log('🔍 Respuesta de la API:', damages)
          opportunities.value = []
          
          store.dispatch('showNotification', {
            message: 'No se encontraron oportunidades cercanas',
            type: 'info'
          })
        }
        
        console.log('✅ Opportunities loaded:', opportunities.value.length)
      } catch (error) {
        console.error('Error loading opportunities:', error)
        store.dispatch('showNotification', {
          message: 'Error cargando oportunidades',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const hideOpportunitiesCard = () => {
      showOpportunitiesCard.value = false
    }

    const closeProfileModal = () => {
      showProfileModal.value = false
    }

    const closeOpportunityDetails = () => {
      showOpportunityDetails.value = false
      selectedOpportunity.value = null
    }

    const openProposalModal = () => {
      showOpportunityDetails.value = false
      showProposalModal.value = true
    }

    const closeProposalModal = () => {
      showProposalModal.value = false
      // Reset form
      newProposal.value = {
        price: '',
        duration: '',
        description: '',
        experience: '',
        materials: ''
      }
    }

    const openMyProposalsModal = () => {
      console.log('🔍 Opening my proposals modal...')
      store.dispatch('showNotification', {
        message: '🔍 Opening my proposals modal...',
        type: 'info'
      })
      showMyProposalsModal.value = true
      console.log('🔍 showMyProposalsModal.value:', showMyProposalsModal.value)
      store.dispatch('showNotification', {
        message: `🔍 showMyProposalsModal.value: ${showMyProposalsModal.value}`,
        type: 'info'
      })
      console.log('🔍 Modal should be visible now')
      store.dispatch('showNotification', {
        message: '🔍 Modal should be visible now',
        type: 'info'
      })
      
      // Debug: Verificar si el modal está en el DOM
      setTimeout(() => {
        const modal = document.querySelector('.modal-overlay')
        const proposalsModal = document.querySelector('.proposals-modal')
        if (modal) {
          store.dispatch('showNotification', {
            message: '🔍 Modal overlay found in DOM!',
            type: 'success'
          })
        } else {
          store.dispatch('showNotification', {
            message: '❌ Modal overlay NOT found in DOM!',
            type: 'error'
          })
        }
        
        if (proposalsModal) {
          store.dispatch('showNotification', {
            message: '🔍 Proposals modal found in DOM!',
            type: 'success'
          })
        } else {
          store.dispatch('showNotification', {
            message: '❌ Proposals modal NOT found in DOM!',
            type: 'error'
          })
        }
        
        // Debug: Verificar el estado de showMyProposalsModal
        store.dispatch('showNotification', {
          message: `🔍 showMyProposalsModal.value: ${showMyProposalsModal.value}`,
          type: 'info'
        })
      }, 100)
      
      loadMyProposals()
    }

    const closeMyProposalsModal = () => {
      console.log('🔍 Closing my proposals modal...')
      store.dispatch('showNotification', {
        message: '🔍 Closing my proposals modal...',
        type: 'info'
      })
      showMyProposalsModal.value = false
    }

    const loadMyProposals = async () => {
      try {
        loading.value = true
        console.log('📋 Loading my proposals...')
        store.dispatch('showNotification', {
          message: '📋 Loading my proposals...',
          type: 'info'
        })
        console.log('📋 User email:', user.value.Email)
        store.dispatch('showNotification', {
          message: `📋 User email: ${user.value.Email}`,
          type: 'info'
        })

        const API_BASE_URL = 'https://www.refactorii.com/api/tenant'
        const url = `${API_BASE_URL}/proposals/technician`
        console.log('📋 API URL:', url)
        store.dispatch('showNotification', {
          message: `📋 API URL: ${url}`,
          type: 'info'
        })
        console.log('📋 Full URL constructed:', url)
        console.log('📋 User email for headers:', user.value.Email)
        
        console.log('📋 Making fetch request...')
        store.dispatch('showNotification', {
          message: '📋 Making fetch request...',
          type: 'info'
        })
        
        console.log('📋 Headers being sent:', {
          'x-user-email': user.value.Email,
          'Content-Type': 'application/json'
        })
        store.dispatch('showNotification', {
          message: `📋 Headers: x-user-email=${user.value.Email}`,
          type: 'info'
        })
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-user-email': user.value.Email,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit'
        })
        console.log('📋 Fetch completed, response received')
        store.dispatch('showNotification', {
          message: '📋 Fetch completed, response received',
          type: 'info'
        })

        console.log('📋 Response status:', response.status)
        store.dispatch('showNotification', {
          message: `📋 Response status: ${response.status}`,
          type: 'info'
        })
        console.log('📋 Response ok:', response.ok)
        store.dispatch('showNotification', {
          message: `📋 Response ok: ${response.ok}`,
          type: 'info'
        })

        // Debug: Verificar el content-type de la respuesta
        const contentType = response.headers.get('content-type')
        console.log('📋 Content-Type:', contentType)
        store.dispatch('showNotification', {
          message: `📋 Content-Type: ${contentType}`,
          type: 'info'
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error:', errorText)
          store.dispatch('showNotification', {
            message: `❌ API Error: ${errorText.substring(0, 100)}...`,
            type: 'error'
          })
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // Log de la respuesta completa para debug
        const responseText = await response.text()
        console.log('📋 Full response text:', responseText)
        store.dispatch('showNotification', {
          message: `📋 Response: ${responseText.substring(0, 100)}...`,
          type: 'info'
        })

        // Verificar si la respuesta es HTML en lugar de JSON
        if (contentType && contentType.includes('text/html')) {
          const htmlText = await response.text()
          console.error('❌ Received HTML instead of JSON:', htmlText.substring(0, 200))
          store.dispatch('showNotification', {
            message: '❌ Received HTML instead of JSON!',
            type: 'error'
          })
          throw new Error('Server returned HTML instead of JSON')
        }

        const data = await response.json()
        console.log('📋 My proposals loaded:', data)
        console.log('📋 Data structure:', JSON.stringify(data, null, 2))
        
        myProposals.value = data.data || []
        console.log('📋 myProposals.value after assignment:', myProposals.value)
        console.log('📋 myProposals.value.length:', myProposals.value.length)
        
        store.dispatch('showNotification', {
          message: `${myProposals.value.length} propuestas cargadas`,
          type: 'success'
        })
      } catch (error) {
        console.error('❌ Error loading my proposals:', error)
        console.error('❌ Error details:', error.message)
        console.error('❌ Error stack:', error.stack)
        console.error('❌ Error type:', error.constructor.name)
        
        let errorMessage = 'Error cargando propuestas'
        if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
          errorMessage = 'Error de red: No se puede conectar con el servidor'
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión: Servidor no disponible'
        } else {
          errorMessage = `Error cargando propuestas: ${error.message}`
        }
        
        store.dispatch('showNotification', {
          message: errorMessage,
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const viewOpportunity = (opportunity) => {
      console.log('Viewing opportunity:', opportunity)
      selectedOpportunity.value = opportunity
      showOpportunityDetails.value = true
    }

    const createProposal = (opportunity) => {
      console.log('Creating proposal for:', opportunity)
      selectedOpportunity.value = opportunity
      showProposalModal.value = true
    }

    const submitProposal = async () => {
      try {
        console.log('🚀 submitProposal called!')
        console.log('📋 Form data:', newProposal.value)
        console.log('📋 Selected opportunity:', selectedOpportunity.value)
        console.log('📋 User email:', user.value.Email)
        
        loading.value = true
        
        // Validate form data
        if (!newProposal.value.price || !newProposal.value.duration || !newProposal.value.description) {
          store.dispatch('showNotification', {
            message: 'Por favor completa todos los campos requeridos',
            type: 'error'
          })
          return
        }
        
        if (!selectedOpportunity.value) {
          store.dispatch('showNotification', {
            message: 'No hay oportunidad seleccionada',
            type: 'error'
          })
          return
        }
        
        const API_BASE_URL = 'https://www.refactorii.com/api/tenant'
        
        // Get the damage ID from the damageData
        const damageId = selectedOpportunity.value.damageData?._id || selectedOpportunity.value.id
        console.log('🔍 Damage ID to send:', damageId)
        console.log('🔍 Damage data:', selectedOpportunity.value.damageData)
        
        const proposalData = {
          damageId: damageId,
          proposal: {
            price: parseInt(newProposal.value.price),
            duration: parseInt(newProposal.value.duration),
            description: newProposal.value.description,
            experience: newProposal.value.experience,
            materials: newProposal.value.materials
          },
          technician: {
            email: user.value.Email,
            name: user.value.FullName || user.value.GivenName || 'Técnico',
            phone: user.value.phone || ''
          }
        }
        
        console.log('📤 Sending proposal to API:', proposalData)
        console.log('🔗 API URL:', `${API_BASE_URL}/proposals`)
        
        const response = await fetch(`${API_BASE_URL}/proposals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': user.value.Email
          },
          body: JSON.stringify(proposalData)
        })
        
        console.log('📡 Response status:', response.status)
        console.log('📡 Response ok:', response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error:', errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
        
        const result = await response.json()
        console.log('✅ Proposal submitted successfully:', result)
        
        store.dispatch('showNotification', {
          message: 'Propuesta enviada exitosamente',
          type: 'success'
        })
        
      } catch (error) {
        console.error('❌ Error submitting proposal:', error)
        store.dispatch('showNotification', {
          message: `Error enviando propuesta: ${error.message}`,
          type: 'error'
        })
      } finally {
        loading.value = false
        closeProposalModal()
      }
    }

    const viewProposal = (proposal) => {
      console.log('Viewing proposal:', proposal)
      // TODO: Implement proposal details modal
    }

    const cancelProposal = async (proposal) => {
      try {
        console.log('Cancelling proposal:', proposal._id)
        // TODO: Implement cancel proposal API call
        store.dispatch('showNotification', {
          message: 'Funcionalidad de cancelar propuesta en desarrollo',
          type: 'info'
        })
      } catch (error) {
        console.error('Error cancelling proposal:', error)
        store.dispatch('showNotification', {
          message: 'Error cancelando propuesta',
          type: 'error'
        })
      }
    }

    const editProposal = (proposal) => {
      console.log('Editing proposal:', proposal)
      // TODO: Implement proposal edit modal
    }

    const saveTechnicianInfo = async () => {
      try {
        console.log('Saving technician info:', technicianInfo.value)
        // TODO: Implement API call to save technician info
        
        store.dispatch('showNotification', {
          message: 'Información guardada exitosamente',
          type: 'success'
        })
      } catch (error) {
        console.error('Error saving technician info:', error)
        store.dispatch('showNotification', {
          message: 'Error guardando información',
          type: 'error'
        })
      }
    }

    const getNotificationIcon = (type) => {
      const icons = {
        success: 'ph ph-check-circle',
        error: 'ph ph-warning-circle',
        info: 'ph ph-info',
        warning: 'ph ph-warning'
      }
      return icons[type] || 'ph ph-info'
    }

    const removeNotification = (id) => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }

    const handleImageError = (event) => {
      console.log('❌ Error loading image:', event.target.src)
      event.target.style.display = 'none'
    }

    // Lifecycle
    onMounted(async () => {
      console.log('👨‍🔧 Technician profile mounted')
      
      // Initialize map
      await nextTick()
      await initializeMap('technician-map')
      
      // Load user location
      const location = await store.dispatch('loadUserLocation')
      if (location && map.value) {
        addUserMarker(location)
      }
      
      // Load initial data based on current tab
      if (currentTab.value === 'opportunities') {
        // Cargar oportunidades automáticamente al iniciar
        await loadOpportunities()
      } else if (currentTab.value === 'proposals') {
        await loadMyProposals()
      }
    })

    return {
      currentTab,
      loading,
      showProposalModal,
      opportunities,
      myProposals,
      selectedOpportunity,
      showOpportunitiesCard,
      showProfileModal,
      showOpportunityDetails,
      technicianInfo,
      newProposal,
      user,
      notifications,
      tabs,
      switchTab,
      logout,
      getCurrentLocation,
      refreshOpportunities,
      loadOpportunities,
      hideOpportunitiesCard,
      closeProfileModal,
      closeOpportunityDetails,
      openProposalModal,
      closeProposalModal,
      openMyProposalsModal,
      closeMyProposalsModal,
      loadMyProposals,
      viewOpportunity,
      createProposal,
      submitProposal,
      viewProposal,
      cancelProposal,
      editProposal,
      saveTechnicianInfo,
      getNotificationIcon,
      removeNotification,
      handleImageError
    }
  }
}
</script>

<style scoped>
/* Estilos específicos del componente si es necesario */
</style>