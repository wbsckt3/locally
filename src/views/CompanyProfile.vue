<template>
  <div class="company-profile">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="header-title">
          <i class="ph ph-map-pin-area"></i>
          <span>Locally</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <img :src="user.ImageURL" :alt="user.FullName" class="user-avatar" />
          <div class="user-details">
            <span class="user-name">{{ user.FullName }}</span>
            <span class="user-role">Empresa</span>
          </div>
        </div>
        <button @click="logout" class="logout-btn">
          <i class="ph ph-sign-out"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Navigation Tabs -->
      <nav class="nav-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-tab', { active: currentTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Map Tab -->
        <div v-if="currentTab === 'map'" class="tab-panel">
          <div class="map-container">
            <div id="company-map" class="map"></div>
            <div class="map-controls">
              <button @click="getCurrentLocation" class="btn primary">
                <i class="ph ph-crosshairs"></i>
                Mi Ubicación
              </button>
            </div>
          </div>
        </div>

        <!-- Requests Tab -->
        <div v-if="currentTab === 'requests'" class="tab-panel">
          <div class="panel-header">
            <h2>Mis Solicitudes de Servicio</h2>
            <button @click="showRequestModal = true" class="btn primary">
              <i class="ph ph-plus"></i>
              Nueva Solicitud
            </button>
          </div>
          
          <div class="requests-list">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Cargando solicitudes...</p>
            </div>
            
            <div v-else-if="requests.length === 0" class="empty-state">
              <i class="ph ph-clipboard-text"></i>
              <h3>No tienes solicitudes</h3>
              <p>Crea tu primera solicitud de servicio</p>
              <button @click="showRequestModal = true" class="btn primary">
                Crear Solicitud
              </button>
            </div>
            
            <div v-else class="requests-grid">
              <div v-for="request in requests" :key="request.id" class="request-card">
                <div class="request-header">
                  <h3>{{ request.title }}</h3>
                  <span :class="['status-badge', request.status]">{{ request.status }}</span>
                </div>
                <p class="request-description">{{ request.description }}</p>
                <div class="request-meta">
                  <span class="request-date">{{ request.timestamp }}</span>
                  <span class="request-location">{{ request.location }}</span>
                </div>
                <div class="request-actions">
                  <button @click="viewRequest(request)" class="btn outline">
                    Ver Detalles
                  </button>
                  <button @click="editRequest(request)" class="btn outline">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Services Tab -->
        <div v-if="currentTab === 'services'" class="tab-panel">
          <div class="panel-header">
            <h2>Propuestas Recibidas</h2>
          </div>
          
          <div class="proposals-list">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Cargando propuestas...</p>
            </div>
            
            <div v-else-if="proposals.length === 0" class="empty-state">
              <i class="ph ph-handshake"></i>
              <h3>No hay propuestas</h3>
              <p>Las propuestas de técnicos aparecerán aquí</p>
            </div>
            
            <div v-else class="proposals-grid">
              <div v-for="proposal in proposals" :key="proposal.id" class="proposal-card">
                <div class="proposal-header">
                  <div class="technician-info">
                    <img :src="proposal.technician.avatar" :alt="proposal.technician.name" class="technician-avatar" />
                    <div>
                      <h4>{{ proposal.technician.name }}</h4>
                      <span class="technician-rating">{{ proposal.technician.rating }} ⭐</span>
                    </div>
                  </div>
                  <span :class="['status-badge', proposal.status]">{{ proposal.status }}</span>
                </div>
                <p class="proposal-description">{{ proposal.description }}</p>
                <div class="proposal-meta">
                  <span class="proposal-price">{{ proposal.price }}</span>
                  <span class="proposal-date">{{ proposal.timestamp }}</span>
                </div>
                <div class="proposal-actions">
                  <button @click="acceptProposal(proposal)" class="btn success">
                    Aceptar
                  </button>
                  <button @click="rejectProposal(proposal)" class="btn danger">
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Tab -->
        <div v-if="currentTab === 'profile'" class="tab-panel">
          <div class="profile-content">
            <div class="profile-header">
              <img :src="user.ImageURL" :alt="user.FullName" class="profile-avatar" />
              <div class="profile-info">
                <h2>{{ user.FullName }}</h2>
                <p class="profile-email">{{ user.Email }}</p>
                <span class="profile-role">Empresa</span>
              </div>
            </div>
            
            <div class="profile-sections">
              <div class="profile-section">
                <h3>Información de la Empresa</h3>
                <div class="form-group">
                  <label>Nombre de la Empresa</label>
                  <input v-model="companyInfo.name" type="text" placeholder="Ingresa el nombre de tu empresa" />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea v-model="companyInfo.description" placeholder="Describe tu empresa y servicios"></textarea>
                </div>
                <div class="form-group">
                  <label>Teléfono</label>
                  <input v-model="companyInfo.phone" type="tel" placeholder="Número de contacto" />
                </div>
                <div class="form-group">
                  <label>Dirección</label>
                  <input v-model="companyInfo.address" type="text" placeholder="Dirección de la empresa" />
                </div>
                <button @click="saveCompanyInfo" class="btn primary">
                  Guardar Información
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Request Modal -->
    <div v-if="showRequestModal" class="modal-overlay" @click="showRequestModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Nueva Solicitud de Servicio</h3>
          <button @click="showRequestModal = false" class="modal-close">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRequest">
            <div class="form-group">
              <label>Título de la Solicitud</label>
              <input v-model="newRequest.title" type="text" required placeholder="Ej: Reparación de aire acondicionado" />
            </div>
            <div class="form-group">
              <label>Área</label>
              <select v-model="newRequest.area" required>
                <option value="">Selecciona un área</option>
                <option value="zonas_comunes">Zonas Comunes</option>
                <option value="apartamento">Apartamento</option>
                <option value="oficina">Oficina</option>
                <option value="bodega">Bodega</option>
              </select>
            </div>
            <div class="form-group">
              <label>Item Específico</label>
              <input v-model="newRequest.item" type="text" required placeholder="Ej: SALÓN SOCIAL" />
            </div>
            <div class="form-group">
              <label>Descripción del Problema</label>
              <textarea v-model="newRequest.description" required placeholder="Describe detalladamente el problema o servicio requerido"></textarea>
            </div>
            <div class="form-group">
              <label>Severidad</label>
              <select v-model="newRequest.severity" required>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ubicación</label>
              <input v-model="newRequest.location" type="text" required placeholder="Dirección específica" />
            </div>
            <div class="form-actions">
              <button type="button" @click="showRequestModal = false" class="btn outline">
                Cancelar
              </button>
              <button type="submit" class="btn primary" :disabled="loading">
                {{ loading ? 'Enviando...' : 'Crear Solicitud' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div v-if="notifications.length > 0" class="notifications">
      <div v-for="notification in notifications" :key="notification.id" 
           :class="['notification', notification.type]">
        <i :class="getNotificationIcon(notification.type)"></i>
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)" class="notification-close">
          <i class="ph ph-x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useMap } from '../composables/useMap'

export default {
  name: 'CompanyProfile',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // Map composable
    const { 
      map, 
      userMarker, 
      damageMarkers, 
      isMapReady, 
      initializeMap, 
      addUserMarker, 
      addDamageMarkers, 
      centerMapOnUser 
    } = useMap()
    
    // Reactive data
    const currentTab = ref('map')
    const loading = ref(false)
    const showRequestModal = ref(false)
    const requests = ref([])
    const proposals = ref([])
    const companyInfo = ref({
      name: '',
      description: '',
      phone: '',
      address: ''
    })
    const newRequest = ref({
      title: '',
      area: '',
      item: '',
      description: '',
      severity: 'medium',
      location: ''
    })

    // Computed
    const user = computed(() => store.getters.currentUser)
    const notifications = computed(() => store.state.app.notifications)
    
    const tabs = [
      { id: 'map', label: 'Mapa', icon: 'ph ph-map-pin' },
      { id: 'requests', label: 'Mis Solicitudes', icon: 'ph ph-clipboard-text' },
      { id: 'services', label: 'Propuestas', icon: 'ph ph-handshake' },
      { id: 'profile', label: 'Perfil', icon: 'ph ph-user' }
    ]

    // Methods
    const switchTab = async (tabId) => {
      currentTab.value = tabId
      console.log('🔄 Switching to tab:', tabId)
      
      // Initialize map if switching to map tab
      if (tabId === 'map' && !map.value) {
        await nextTick()
        await initializeMap('company-map')
        
        // Add user marker if location is available
        const location = store.getters.userLocation
        if (location) {
          addUserMarker(location)
        }
      }
    }

    const logout = async () => {
      await store.dispatch('logout')
      router.push({ name: 'login' })
    }

    const getCurrentLocation = async () => {
      try {
        loading.value = true
        const location = await store.dispatch('loadUserLocation')
        
        if (location && map.value) {
          addUserMarker(location)
          centerMapOnUser(location)
        }
        
        store.dispatch('showNotification', {
          message: 'Ubicación actualizada',
          type: 'success'
        })
      } catch (error) {
        console.error('Error getting location:', error)
        store.dispatch('showNotification', {
          message: 'Error obteniendo ubicación',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const loadRequests = async () => {
      try {
        loading.value = true
        // TODO: Implement API call to load company requests
        console.log('📋 Loading company requests...')
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        requests.value = []
      } catch (error) {
        console.error('Error loading requests:', error)
        store.dispatch('showNotification', {
          message: 'Error cargando solicitudes',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const loadProposals = async () => {
      try {
        loading.value = true
        // TODO: Implement API call to load proposals
        console.log('📋 Loading proposals...')
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        proposals.value = []
      } catch (error) {
        console.error('Error loading proposals:', error)
        store.dispatch('showNotification', {
          message: 'Error cargando propuestas',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const submitRequest = async () => {
      try {
        loading.value = true
        console.log('📝 Submitting request:', newRequest.value)
        
        // TODO: Implement API call to create request
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        store.dispatch('showNotification', {
          message: 'Solicitud creada exitosamente',
          type: 'success'
        })
        
        showRequestModal.value = false
        newRequest.value = {
          title: '',
          area: '',
          item: '',
          description: '',
          severity: 'medium',
          location: ''
        }
        
        // Reload requests
        await loadRequests()
      } catch (error) {
        console.error('Error submitting request:', error)
        store.dispatch('showNotification', {
          message: 'Error creando solicitud',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const viewRequest = (request) => {
      console.log('👁️ Viewing request:', request)
      // TODO: Implement request details view
    }

    const editRequest = (request) => {
      console.log('✏️ Editing request:', request)
      // TODO: Implement request editing
    }

    const acceptProposal = (proposal) => {
      console.log('✅ Accepting proposal:', proposal)
      // TODO: Implement proposal acceptance
    }

    const rejectProposal = (proposal) => {
      console.log('❌ Rejecting proposal:', proposal)
      // TODO: Implement proposal rejection
    }

    const saveCompanyInfo = async () => {
      try {
        loading.value = true
        console.log('💾 Saving company info:', companyInfo.value)
        
        // TODO: Implement API call to save company info
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        store.dispatch('showNotification', {
          message: 'Información guardada exitosamente',
          type: 'success'
        })
      } catch (error) {
        console.error('Error saving company info:', error)
        store.dispatch('showNotification', {
          message: 'Error guardando información',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const getNotificationIcon = (type) => {
      const icons = {
        success: 'ph ph-check-circle',
        error: 'ph ph-x-circle',
        warning: 'ph ph-warning-circle',
        info: 'ph ph-info'
      }
      return icons[type] || 'ph ph-info'
    }

    const removeNotification = (id) => {
      store.commit('REMOVE_NOTIFICATION', id)
    }

    // Lifecycle
    onMounted(async () => {
      console.log('🏢 Company profile mounted')
      
      // Initialize map when component is mounted
      await nextTick()
      if (currentTab.value === 'map') {
        await initializeMap('company-map')
      }
      
      // Load user location
      const location = await store.dispatch('loadUserLocation')
      
      // Add user marker if location is available
      if (location && map.value) {
        addUserMarker(location)
      }
      
      // Load initial data based on current tab
      if (currentTab.value === 'requests') {
        await loadRequests()
      } else if (currentTab.value === 'services') {
        await loadProposals()
      }
    })

    return {
      currentTab,
      loading,
      showRequestModal,
      requests,
      proposals,
      companyInfo,
      newRequest,
      user,
      notifications,
      tabs,
      switchTab,
      logout,
      getCurrentLocation,
      loadRequests,
      loadProposals,
      submitRequest,
      viewRequest,
      editRequest,
      acceptProposal,
      rejectProposal,
      saveCompanyInfo,
      getNotificationIcon,
      removeNotification
    }
  }
}
</script>

<style scoped>
.company-profile {
  min-height: 100vh;
  background: #f8fafc;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.header-title i {
  font-size: 24px;
  color: #667eea;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: #718096;
}

.logout-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #f7fafc;
  color: #e53e3e;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.nav-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #718096;
  font-weight: 500;
}

.nav-tab:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-tab.active {
  background: #667eea;
  color: white;
}

.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tab-panel {
  padding: 24px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.panel-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.map-container {
  position: relative;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state i {
  font-size: 48px;
  color: #cbd5e0;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 24px 0;
}

.requests-grid, .proposals-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.request-card, .proposal-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: all 0.2s;
}

.request-card:hover, .proposal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.request-header, .proposal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.request-header h3, .proposal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3cd;
  color: #d69e2e;
}

.status-badge.accepted {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.request-description, .proposal-description {
  color: #718096;
  margin-bottom: 12px;
  line-height: 1.5;
}

.request-meta, .proposal-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #a0aec0;
  margin-bottom: 16px;
}

.request-actions, .proposal-actions {
  display: flex;
  gap: 8px;
}

.technician-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.technician-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.technician-rating {
  font-size: 12px;
  color: #f6ad55;
}

.profile-content {
  max-width: 600px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.profile-email {
  color: #718096;
  margin: 0 0 8px 0;
}

.profile-role {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2d3748;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn.primary:hover {
  background: #5a67d8;
}

.btn.outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #718096;
}

.btn.outline:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn.success {
  background: #48bb78;
  color: white;
}

.btn.danger {
  background: #f56565;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f7fafc;
  color: #2d3748;
}

.modal-body {
  padding: 24px;
}

.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.notification.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.notification.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.notification.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  margin-left: auto;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .nav-tabs {
    flex-wrap: wrap;
  }
  
  .nav-tab {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .requests-grid, .proposals-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
