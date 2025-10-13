<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <i class="ph ph-map-pin-area"></i>
          <h1>Locally</h1>
        </div>
        <p class="subtitle">Encuentra oportunidades de servicios cerca de ti</p>
      </div>

      <div class="login-content">
        <div class="profile-selection" v-if="!showGoogleLogin">
          <h2>Selecciona tu perfil</h2>
          <div class="profile-options">
            <button 
              class="profile-btn" 
              :class="{ selected: selectedProfile === 'company' }"
              @click="selectProfile('company')"
            >
              <div class="profile-icon">
                <i class="ph ph-buildings"></i>
              </div>
              <div class="profile-info">
                <h3>Empresa</h3>
                <p>Publica solicitudes de servicio y recibe propuestas de técnicos especializados</p>
              </div>
            </button>

            <button 
              class="profile-btn" 
              :class="{ selected: selectedProfile === 'technician' }"
              @click="selectProfile('technician')"
            >
              <div class="profile-icon">
                <i class="ph ph-wrench"></i>
              </div>
              <div class="profile-info">
                <h3>Técnico/Especialista</h3>
                <p>Encuentra oportunidades de servicio y postula tus propuestas profesionales</p>
              </div>
            </button>
          </div>
        </div>

        <div class="google-login" v-if="showGoogleLogin">
          <h2>Inicia sesión con Google</h2>
          <p v-if="selectedProfile === 'company'">
            Inicia sesión para publicar solicitudes de servicio y recibir propuestas de técnicos
          </p>
          <p v-else>
            Inicia sesión para ver oportunidades de servicio y postular tus propuestas
          </p>

          <div class="google-signin-container">
            <div id="google-signin-button"></div>
          </div>

          <button class="btn outline" @click="goBackToProfileSelection">
            ← Cambiar Perfil
          </button>
        </div>
      </div>

      <div class="login-footer">
        <p>Acceso para técnicos, profesionales o empresas que buscan oportunidades de servicios cercanas a su ubicación</p>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    const selectedProfile = ref(null)
    const showGoogleLogin = ref(false)
    const loading = ref(false)
    const loadingMessage = ref('')
    
    const googleClientId = '980822676255-vntch0t28qbesul2bp5oc1galtoi8a97.apps.googleusercontent.com'

    // Check if user is already authenticated
    onMounted(async () => {
      console.log('🔍 Checking auth status...')
      const isAuthenticated = await store.dispatch('checkAuthStatus')
      
      if (isAuthenticated) {
        console.log('✅ User already authenticated, redirecting...')
        const profile = store.getters.userProfile
        if (profile === 'company') {
          router.push({ name: 'company' })
        } else if (profile === 'technician') {
          router.push({ name: 'technician' })
        }
      }
    })

    const selectProfile = (profile) => {
      console.log('🎭 Selecting profile:', profile)
      selectedProfile.value = profile
      showGoogleLogin.value = true
      
      // Initialize Google Sign-In after DOM update
      nextTick(() => {
        initializeGoogleSignIn()
      })
    }

    const goBackToProfileSelection = () => {
      console.log('🔄 Going back to profile selection')
      selectedProfile.value = null
      showGoogleLogin.value = false
    }

    const initializeGoogleSignIn = () => {
      console.log('🔐 Initializing Google Sign-In...')
      
      // Wait for Google Sign-In to be available
      if (typeof google !== 'undefined' && google.accounts) {
        console.log('✅ Google Sign-In API available')
        
        // Initialize the Google Sign-In button
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false
        })
        
        // Render the button
        google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'sign_in_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        )
        
        console.log('✅ Google Sign-In button rendered')
      } else {
        console.log('⏳ Google Sign-In API not ready, retrying...')
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    // Global function for Google callback
    window.handleCredentialResponse = async (response) => {
      console.log('🔐 Google authentication response:', response)
      
      try {
        loading.value = true
        loadingMessage.value = 'Procesando autenticación...'
        
        // Decode JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]))
        console.log('📋 Decoded payload:', payload)
        
        // Create user data object
        const userData = {
          FullName: payload.name,
          GivenName: payload.given_name,
          FamilyName: payload.family_name,
          ImageURL: payload.picture,
          Email: payload.email,
          credential: response.credential
        }
        
        // Login to store
        const result = await store.dispatch('login', {
          userData,
          profile: selectedProfile.value
        })
        
        if (result.success) {
          console.log('✅ Login successful, redirecting...')
          loadingMessage.value = 'Redirigiendo...'
          
          // Redirect based on profile
          if (selectedProfile.value === 'company') {
            router.push({ name: 'company' })
          } else if (selectedProfile.value === 'technician') {
            router.push({ name: 'technician' })
          }
        } else {
          console.error('❌ Login failed:', result.error)
          store.dispatch('showNotification', {
            message: 'Error en la autenticación',
            type: 'error'
          })
        }
      } catch (error) {
        console.error('❌ Authentication error:', error)
        store.dispatch('showNotification', {
          message: 'Error procesando credenciales',
          type: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    onUnmounted(() => {
      // Clean up global function
      delete window.handleCredentialResponse
    })

    return {
      selectedProfile,
      showGoogleLogin,
      loading,
      loadingMessage,
      googleClientId,
      selectProfile,
      goBackToProfileSelection,
      initializeGoogleSignIn
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo i {
  font-size: 32px;
  color: #667eea;
}

.logo h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.subtitle {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.login-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 24px 0;
  text-align: center;
}

.profile-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.profile-btn:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.profile-btn.selected {
  border-color: #667eea;
  background: #f7fafc;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.profile-icon {
  width: 48px;
  height: 48px;
  background: #f7fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-icon i {
  font-size: 24px;
  color: #667eea;
}

.profile-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.profile-info p {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}

.google-login {
  text-align: center;
}

.google-login p {
  color: #718096;
  margin-bottom: 24px;
  font-size: 16px;
}

.google-signin-container {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

#google-signin-button {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 16px;
}

.btn.outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #718096;
}

.btn.outline:hover {
  border-color: #667eea;
  color: #667eea;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer p {
  color: #718096;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.loading-overlay {
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

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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

.loading-content p {
  color: #718096;
  margin: 0;
  font-size: 16px;
}

@media (max-width: 640px) {
  .login-card {
    padding: 24px;
  }
  
  .profile-btn {
    padding: 16px;
  }
  
  .profile-icon {
    width: 40px;
    height: 40px;
  }
  
  .profile-icon i {
    font-size: 20px;
  }
}
</style>
