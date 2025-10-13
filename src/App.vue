<!-- <script setup>
  import HelloWorld from './components/HelloWorld.vue'
  import TheWelcome from './components/TheWelcome.vue'
</script>
 <template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>
  <main>
    <TheWelcome />
  </main>
</template>  -->

<template>
  <div id="App">
    <router-view />
    
    <!-- Global Notifications -->
    <div v-if="notifications.length > 0" class="global-notifications">
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
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    
    const notifications = computed(() => store.state.app.notifications)
    
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
    
    return {
      notifications,
      getNotificationIcon,
      removeNotification
    }
  }
}
</script>


<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #2d3748;
  background: #f8fafc;
}

#App {
  min-height: 100vh;
}

/* Global Notifications */
.global-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
  font-size: 14px;
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
  transition: background-color 0.2s;
}

.notification-close:hover {
  background: rgba(0, 0, 0, 0.1);
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

/* Map Styles */
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
  display: flex;
  gap: 8px;
  z-index: 1000;
}

/* Leaflet specific styles */
.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.leaflet-map-pane {
  width: 100% !important;
  height: 100% !important;
}

.leaflet-tile-pane {
  width: 100% !important;
  height: 100% !important;
}

/* Custom popup styles */
.leaflet-popup-content-wrapper {
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 72px rgba(2,6,23,0.28), 0 8px 24px rgba(2,6,23,0.18);
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,1));
  backdrop-filter: blur(8px);
  padding: 0;
  overflow: hidden;
}

.leaflet-popup-tip {
  filter: drop-shadow(0 8px 20px rgba(2,6,23,0.25));
}

.leaflet-popup-content {
  margin: 0;
  padding: 0;
  min-width: 280px;
  max-width: 320px;
}

.leaflet-popup-close-button {
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #64748b;
  top: 12px;
  right: 12px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(2,6,23,0.15);
}

.leaflet-popup-close-button:hover {
  background: rgba(239,68,68,0.1);
  color: #ef4444;
}

/* Layout principal - Mobile First */
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #0b1220 0%, #0f172a 60%, #111827 100%) !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 8px 30px rgba(2,6,23,0.25) !important;
  backdrop-filter: blur(6px);
}

.main {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Header móvil */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff !important;
  letter-spacing: 0.5px;
}

.header-title .ph {
  font-size: 20px;
  color: #93c5fd;
}

.locally-icon {
  font-size: 36px;
  color: #f59e0b;
  transition: all 0.3s ease;
  font-weight: bold;
}

.header-title:hover .locally-icon {
  transform: scale(1.1);
  color: #fbbf24;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 10px 24px rgba(59,130,246,0.45);
  border: 1px solid rgba(255,255,255,0.18);
  position: relative;
}

.user-avatar::after {
  content: "";
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #0b1220;
  box-shadow: 0 2px 6px rgba(16,185,129,0.55);
}

.logout-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
}

/* Mapa - Ocupar toda la pantalla */
.map {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Bottom Navigation - Mejorada con fondo gris claro */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(2,6,23,0.06);
  display: flex;
  z-index: 1000;
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -8px 24px rgba(2,6,23,0.06);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  text-decoration: none;
  color: #64748b;
  transition: all 0.25s ease;
  border-radius: 12px;
  margin: 0 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-item.active {
  color: #3b82f6;
  background: rgba(37,99,235,0.10);
  transform: translateY(-2px);
}

.nav-item:hover {
  color: #3b82f6;
  background: rgba(37,99,235,0.06);
}

.nav-icon {
  font-size: 22px;
  margin-bottom: 6px;
  transition: transform 0.2s;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 1.2;
  white-space: nowrap;
}

/* Map Controls */
.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

/* Cards deslizables - Mobile First */
.card-container {
  position: fixed;
  bottom: 100px;
  left: 0;
  right: 0;
  z-index: 500;
  padding: 0 16px;
  pointer-events: none;
  max-height: 60vh;
  overflow-y: auto;
}

.card {
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95));
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(2,6,23,0.12);
  margin-bottom: 12px;
  pointer-events: auto;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 50vh;
  overflow-y: auto;
  backdrop-filter: blur(6px);
}

.card.visible {
  transform: translateY(0);
}

.card-header {
  padding: 16px 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.card-content {
  padding: 16px;
  overflow-y: auto;
}

/* Request cards - Moderno tipo Uber/Didi */
.request-card {
  background: #fff;
  border-radius: 20px;
  padding: 0;
  margin-bottom: 16px;
  box-shadow: 0 8px 32px rgba(2,6,23,0.12);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(2,6,23,0.18);
}

.request-card-image {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.request-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.95);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.no-image-placeholder i {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.request-card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
}

.request-card-distance {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.request-card-content {
  padding: 16px;
}

.request-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.request-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
}

.request-card-info {
  flex: 1;
}

.request-title {
  font-weight: 800;
  font-size: 16px;
  margin: 0 0 3px 0;
  color: #0f172a;
  line-height: 1.3;
}

.request-company {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.request-desc {
  color: #475569;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.request-card-details {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
}

.request-card-details-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 3px;
}

.request-card-details-text {
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
}

.request-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(37,99,235,0.18);
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn.primary {
  background: #3b82f6;
}

.btn.primary:hover {
  background: #2563eb;
}

.btn.success {
  background: #10b981;
}

.btn.success:hover {
  background: #059669;
}

.btn.small {
  padding: 8px 12px;
  font-size: 12px;
}

/* Cuando hay cards visibles, ajustar el mapa */
.card-container:not(:empty) ~ .main .leaflet-container {
  bottom: 60vh !important;
}

.card.visible ~ .main .leaflet-container {
  bottom: 60vh !important;
}

/* Mobile First - App Nativa */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

body {
  background: #f8fafc;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Variables CSS */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --secondary: #10b981;
  --bg: #ffffff;
  --surface: #f8fafc;
  --text: #0f172a;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-elevated: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .global-notifications {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .map-container {
    height: 100vh;
    padding-bottom: 80px; /* Space for bottom nav */
  }
  
  .map-controls {
    top: 16px;
    right: 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  .card-container {
    bottom: 80px; /* Above bottom nav */
  }
  
  .bottom-nav {
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  }
  
  .nav-item {
    padding: 8px 4px;
  }
  
  .nav-icon {
    font-size: 20px;
  }
  
  .nav-label {
    font-size: 10px;
  }
}

/* Tablet y Desktop */
@media (min-width: 768px) {
  .app {
    max-width: 480px;
    margin: 0 auto;
    border: 1px solid var(--border);
    box-shadow: 0 20px 60px rgba(2,6,23,0.18);
  }
  
  .map-controls {
    top: 20px;
    right: 20px;
  }
  
  .card-container {
    padding: 0 20px;
  }
}

/* Profile Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.profile-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.profile-modal-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-modal-content {
  padding: 24px;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.profile-details h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.profile-details p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.profile-role {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.profile-sections {
  margin-bottom: 24px;
}

.profile-section h5 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.profile-actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.profile-actions .btn {
  width: 100%;
  justify-content: center;
}

/* Opportunity Details Modal */
.opportunity-details-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.modal-content {
  padding: 24px;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
}

.opportunity-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.opportunity-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.opportunity-info h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.opportunity-info p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.opportunity-details {
  margin-bottom: 24px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.detail-section p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item i {
  color: #6b7280;
  font-size: 16px;
  width: 20px;
}

.detail-item span {
  color: #374151;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Proposal Modal */
.proposal-modal, .proposals-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

/* Proposals List */
.proposals-list {
  max-height: 60vh;
  overflow-y: auto;
}

.proposal-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.proposal-card:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
}

.proposal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.proposal-icon {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.proposal-info h4 {
  margin: 0 0 4px 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
}

.proposal-info p {
  margin: 0 0 8px 0;
  color: #64748b;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.accepted {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.completed {
  background: #dbeafe;
  color: #1e40af;
}

.proposal-details {
  margin-bottom: 16px;
}

.detail-section {
  margin-bottom: 12px;
}

.detail-section h5 {
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.detail-item i {
  color: #3b82f6;
  font-size: 16px;
}

.proposal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn.danger {
  background: #ef4444;
  color: white;
  border: none;
}

.btn.danger:hover {
  background: #dc2626;
}

.proposal-modal .modal-content {
  padding: 24px;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
}

.proposal-modal .form-group {
  margin-bottom: 16px;
}

.proposal-modal .form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.proposal-modal .form-group input,
.proposal-modal .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.proposal-modal .form-group input:focus,
.proposal-modal .form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.proposal-modal .form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.proposal-modal .modal-actions {
    display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Safe area para iPhone */
@supports (padding: max(0px)) {
  .header {
    padding-top: max(12px, env(safe-area-inset-top));
  }
  
  .bottom-nav {
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
</style>
